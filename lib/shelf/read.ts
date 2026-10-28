/**
 * Ask Claude to read a photo of a glaze-material bag, label or receipt.
 * Returns what is printed (in its own language) plus Claude's best glossary id;
 * lib/shelf/match.ts then checks that against the glossary's synonyms.
 *
 * No Next/server-only imports so scripts can run it directly with node.
 */
import Anthropic from "@anthropic-ai/sdk";
import type { ReadItem } from "./match";

export const READ_MODEL = "claude-opus-5-5";

export type ImageMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

export interface ReadResult {
  document: "label" | "bag" | "receipt" | "other";
  readable: boolean;
  note: string | null;
  items: ReadItem[];
}

export type ReadErrorCode = "missing_key" | "refused" | "bad_output" | "busy" | "too_big" | "upstream";
export class ReadError extends Error {
  code: ReadErrorCode;
  constructor(code: ReadErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const SYSTEM = `You read photos a studio potter takes of glaze materials she owns or bought: bags, sacks, tubs, jar labels and shop receipts or invoices. They are often in Italian, sometimes French, English or Kinyarwanda.

List every distinct ceramic or glaze material named in the photo. For each one:
- printed: the material's name exactly as printed, in its original language and spelling (include a grade or product code only when it is part of the name, e.g. "Feldspato potassico F20"). Never translate this field.
- language: ISO 639-1 code of the printed name ("it", "fr", "en", "rw", "es", "de"...), or "und" if unclear.
- english: the generic English material name (e.g. "calcium carbonate", "potash feldspar", "red iron oxide"), or "" if you can't tell what it is.
- quantity and unit: the amount of that material shown for it (net weight on a bag, quantity on a receipt line). Use the unit as printed, normalised to one of kg, g, lb, oz, l, bag, pcs. Null when no amount is shown. Never use prices.
- candidate_id: the id from the materials list below that is the same material, or null if it is not in the list or you are not sure. Choose the generic material, not a lookalike (e.g. calcium carbonate is "whiting"; wood ash is "wood-ash").
- confidence: "high" when the name is clearly printed and clearly that material, "medium" if partly legible or the match is approximate, "low" if you are guessing.

Rules:
- Ignore prices, totals, VAT, discounts, shipping, shop names and addresses, safety phrases, pictograms and usage instructions.
- A bag that repeats the same material in several languages is one item; use the most prominent name as printed.
- Non-ceramic items on a receipt (tools, brushes, bags of clay body you can't identify) can be listed with candidate_id null and confidence "low" only if they look like a raw material; otherwise skip them.
- If the photo can't be read (blurry, too dark, cut off, no materials), set readable to false, items to [], and give a short plain-English note saying why and how to retake it.
- document: "receipt" for receipts or invoices, "bag" for sacks and bags, "label" for jar or tub labels, "other" otherwise.`;

function schema(ids: string[]) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["document", "readable", "note", "items"],
    properties: {
      document: { type: "string", enum: ["label", "bag", "receipt", "other"] },
      readable: { type: "boolean" },
      note: { anyOf: [{ type: "string" }, { type: "null" }] },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["printed", "language", "english", "quantity", "unit", "candidate_id", "confidence"],
          properties: {
            printed: { type: "string" },
            language: { type: "string" },
            english: { type: "string" },
            quantity: { anyOf: [{ type: "number" }, { type: "null" }] },
            unit: { anyOf: [{ type: "string", enum: ["kg", "g", "lb", "oz", "l", "bag", "pcs"] }, { type: "null" }] },
            candidate_id: { anyOf: [{ type: "string", enum: ids }, { type: "null" }] },
            confidence: { type: "string", enum: ["high", "medium", "low"] },
          },
        },
      },
    },
  };
}

export async function readLabelImage(opts: {
  base64: string;
  mediaType: ImageMediaType;
  materials: { id: string; name: string }[];
  client?: Anthropic;
}): Promise<ReadResult> {
  if (!opts.client && !process.env.ANTHROPIC_API_KEY) throw new ReadError("missing_key", "Reading photos needs the Claude API key on the server.");
  if (opts.base64.length > 5 * 1024 * 1024 * 1.37) throw new ReadError("too_big", "That photo is too large to read.");
  const client = opts.client || new Anthropic();
  const list = opts.materials.map((m) => `${m.id}: ${m.name}`).join("\n");

  let msg: Anthropic.Message;
  try {
    msg = await client.messages.create(
      {
        model: READ_MODEL,
        max_tokens: 16000,
        system: [
          { type: "text", text: SYSTEM },
          { type: "text", text: `Materials list (id: name):\n${list}`, cache_control: { type: "ephemeral" } },
        ],
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: opts.mediaType, data: opts.base64 } },
              { type: "text", text: "Read the materials in this photo." },
            ],
          },
        ],
        // Not yet in this SDK version's types: strict JSON output, effort, and the
        // server-side fallback that retries on another model if a safety filter declines.
        ...({
          output_config: { effort: "low", format: { type: "json_schema", schema: schema(opts.materials.map((m) => m.id)) } },
          fallbacks: "default",
        } as object),
      },
      { headers: { "anthropic-beta": "server-side-fallback-2026-07-01" }, timeout: 90_000 }
    );
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) throw new ReadError("busy", "Too many photos at once. Wait a moment and try again.");
    if (e instanceof Anthropic.APIError && (e.status ?? 0) >= 500) throw new ReadError("busy", "The reader is busy. Try again in a minute.");
    if (e instanceof Anthropic.APIError) throw new ReadError("upstream", `Claude API error ${e.status}: ${e.message}`);
    throw new ReadError("upstream", e instanceof Error ? e.message : String(e));
  }

  if (msg.stop_reason === "refusal") throw new ReadError("refused", "This photo couldn’t be read. Try a closer photo of just the label.");
  const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  let parsed: ReadResult;
  try {
    parsed = JSON.parse(text) as ReadResult;
  } catch {
    throw new ReadError("bad_output", msg.stop_reason === "max_tokens" ? "That photo has too much on it. Try one bag or one receipt per photo." : "Couldn’t make sense of that photo. Try again.");
  }
  parsed.items = (parsed.items || []).filter((i) => i && typeof i.printed === "string" && i.printed.trim());
  return parsed;
}
