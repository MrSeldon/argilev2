import Anthropic from "@anthropic-ai/sdk";
import { getRecipe, loadIndex } from "@/lib/glazes/server";
import { applyChange, chemistry, round, type ProposedChange } from "@/lib/glazes/math";
import { coneText } from "@/lib/glazes/types";

const MODEL = "claude-opus-5-5";

const SYSTEM_PROMPT = `You are a knowledgeable and encouraging ceramics mentor. Your role is to:

1. Answer questions about ceramics techniques, materials, glazes, and firing
2. Provide guidance on creative development and artistic growth
3. Offer practical advice about tools, equipment, and studio setup
4. Share knowledge about ceramic history, traditions, and contemporary practice
5. Help troubleshoot problems with clay, glazes, and firing
6. Suggest learning resources and opportunities

Your personality:
- Warm and encouraging, but honest about challenges
- Knowledgeable but not condescending
- Practical and hands-on focused
- Curious about the user's goals and interests
- Reference specific techniques, artists, and traditions when relevant

Keep responses focused and actionable. When discussing techniques, be specific about materials, temperatures, and processes. If you don't know something, say so and suggest where the user might find that information.`;

const ADAPT_SYSTEM = `You help a studio potter (wheel and hand-building, wild clay, local materials such as wood ash and lime) adapt a glaze recipe toward a look she described.

Rules:
- Explain the chemistry in plain words a potter uses: what melts it, what makes it glossy or matte, where the colour comes from, why it breaks or pools. Short paragraphs, no jargon without a gloss.
- Propose exactly ONE change that moves the glaze toward what she described. Prefer materials on her shelf when they would work.
- Do NOT do arithmetic. Do not compute batch weights, new percentages or totals - the app computes those from your proposed change. Only name the material and the amount to add/remove in recipe parts (percentage points of the base).
- Use material ids only from the provided list.
- Mention one safety or testing point if relevant (e.g. variable local materials: test tile first).
Reply with JSON only, no code fences:
{"chemistry": "2-4 short paragraphs", "change": {"action": "add|increase|decrease|remove|swap", "material": "<material id>", "toMaterial": "<material id, swap only>", "amount": <number of parts, not for remove/swap>, "asAddition": <true if it is a colourant/opacifier added on top of the base>}, "why": "1-2 sentences on why this change moves it toward her description", "expect": "what to look for on the test tile", "test": "a simple line-blend or test suggestion in words, without numbers you calculated"}`;

function missingKeyResponse() {
  return Response.json(
    {
      error: "missing_key",
      message:
        "“Adapt this” needs the Claude API key (ANTHROPIC_API_KEY) set on the server. Describe-it search, the shelf and the batch calculator all still work without it.",
    },
    { status: 503 }
  );
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  if (body?.mode === "adapt") return adapt(body);

  try {
    const { messages } = body;
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }
    const client = new Anthropic();
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: anthropicMessages,
    });
    const textContent = response.content.find((block) => block.type === "text");
    const text = textContent?.type === "text" ? textContent.text : "";
    return Response.json({ message: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}

async function adapt(body: { code?: string; goal?: string; shelf?: string[] }) {
  const recipe = body.code ? getRecipe(String(body.code)) : null;
  if (!recipe) return Response.json({ error: "Recipe not found" }, { status: 404 });
  if (!process.env.ANTHROPIC_API_KEY) return missingKeyResponse();

  const idx = loadIndex();
  const goal = String(body.goal || "").slice(0, 400) || "(no description given - suggest one improvement for reliability)";
  const shelf = Array.isArray(body.shelf) ? body.shelf.map(String).filter((id) => idx.glossary.has(id)) : [];
  const chem = chemistry(recipe.ingredients, idx.glossary);

  // Everything numeric below is computed in code and handed to the model as facts.
  const lines = recipe.ingredients.map(
    (i) => `- ${i.id ?? "unmatched"} | ${i.name}${i.original ? ` (written "${i.original}")` : ""} | ${round(i.pct, 2)}${i.add ? " (addition)" : ""}${i.variable ? " [variable local material]" : ""}`
  );
  const ox = Object.entries(chem.oxides)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${v}%`)
    .join(", ");
  const umf = chem.umf
    ? Object.entries(chem.umf)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k} ${v}`)
        .join(", ")
    : "n/a";
  const candidateIds = [
    ...new Set([...recipe.ingredients.map((i) => i.id).filter(Boolean), ...shelf, "silica", "kaolin", "whiting", "red-iron-oxide", "rutile", "tin-oxide", "zircon", "talc", "dolomite", "potash-feldspar", "nepheline-syenite", "frit-3134", "gerstley-borate", "wood-ash", "lime-slaked", "copper-carbonate", "cobalt-carbonate", "titanium-dioxide", "bone-ash", "zinc-oxide", "wollastonite", "magnesium-carbonate"]),
  ] as string[];
  const userMsg = `What she wants: "${goal}"

Recipe: ${recipe.name} (${recipe.source}, ${coneText(recipe.cone)}${recipe.atmosphere?.length ? ", " + recipe.atmosphere.join("/") : ""}, surface: ${recipe.surface || "not recorded"})
Description: ${recipe.description}
Ingredients (id | name | parts; base totals 100, additions are on top):
${lines.join("\n")}

Computed fired oxide analysis (weight %): ${ox}
Computed unity formula: ${umf}; Si:Al ratio ${chem.siAl ?? "n/a"}.${chem.unknownPct ? ` ${chem.unknownPct}% of the batch has no known analysis.` : ""}${chem.variablePct ? ` ${chem.variablePct}% comes from variable local materials.` : ""}
Source note: ${recipe.note || "none"}

Her shelf (material ids): ${shelf.length ? shelf.join(", ") : "not set"}
Allowed material ids for your change: ${candidateIds.join(", ")}`;

  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: ADAPT_SYSTEM,
      messages: [{ role: "user", content: userMsg }],
      ...({ output_config: { effort: "low" } } as object),
    });
    if (response.stop_reason === "refusal") return Response.json({ error: "The model declined this request." }, { status: 502 });
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    let parsed: any = null;
    try {
      parsed = JSON.parse(text.replace(/^```(json)?|```$/g, "").trim());
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (m) {
        try {
          parsed = JSON.parse(m[0]);
        } catch {}
      }
    }
    if (!parsed) return Response.json({ chemistry: text, change: null });

    let applied = null;
    const ch = parsed.change as ProposedChange | undefined;
    if (ch && idx.glossary.has(ch.material) && (ch.action !== "swap" || (ch.toMaterial && idx.glossary.has(ch.toMaterial)))) {
      const res = applyChange(recipe.ingredients, ch, idx.glossary);
      const after = chemistry(res.ingredients, idx.glossary);
      const onShelf = shelf.length
        ? [ch.material, ch.toMaterial].filter(Boolean).every((id) => {
            const g = idx.glossary.get(id as string);
            return shelf.includes(id as string) || (!!g?.group && shelf.some((s) => idx.glossary.get(s)?.group === g.group));
          })
        : null;
      const target = idx.glossary.get(ch.action === "swap" && ch.toMaterial ? ch.toMaterial : ch.material);
      applied = {
        summary: res.summary,
        ingredients: res.ingredients,
        siAlBefore: chem.siAl,
        siAlAfter: after.siAl,
        onShelf,
        variable: target?.variable || false,
        note: target?.note,
      };
    }
    return Response.json({
      chemistry: parsed.chemistry || "",
      why: parsed.why || "",
      expect: parsed.expect || "",
      test: parsed.test || "",
      change: ch || null,
      applied,
    });
  } catch (error) {
    console.error("Adapt error:", error);
    if (error instanceof Anthropic.AuthenticationError) return missingKeyResponse();
    return Response.json({ error: "Could not reach Claude right now - try again in a moment." }, { status: 502 });
  }
}
