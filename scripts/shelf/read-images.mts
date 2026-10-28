// Run the photo reader + glossary matching on local images (no sign-in, no upload).
// Usage: node scripts/shelf/read-images.mts <image> [...]   (needs ANTHROPIC_API_KEY, e.g. from .env.local)
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { readLabelImage, type ImageMediaType } from "../../lib/shelf/read.ts";
import { buildMatcher, resolveItem } from "../../lib/shelf/match.ts";

if (!process.env.ANTHROPIC_API_KEY && existsSync(".env.local")) process.loadEnvFile(".env.local");
const glossary = JSON.parse(readFileSync(new URL("../../data/materials/glossary.json", import.meta.url), "utf8")).materials;
const matcher = buildMatcher(glossary);
const types: Record<string, ImageMediaType> = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };

for (const file of process.argv.slice(2)) {
  const t0 = Date.now();
  try {
    const res = await readLabelImage({
      base64: readFileSync(file).toString("base64"),
      mediaType: types[path.extname(file).toLowerCase()] || "image/jpeg",
      materials: glossary.map((m: { id: string; name: string }) => ({ id: m.id, name: m.name })),
    });
    console.log(`\n== ${path.basename(file)}  (${((Date.now() - t0) / 1000).toFixed(1)}s)  document=${res.document} readable=${res.readable}${res.note ? `  note="${res.note}"` : ""}`);
    for (const it of res.items) {
      const r = resolveItem(it, matcher);
      console.log(
        `  ${JSON.stringify(it.printed).padEnd(34)} ${it.language}  ${it.quantity ?? "-"} ${it.unit ?? ""}`.padEnd(52) +
          ` claude=${it.candidate_id}/${it.confidence}  ->  ${r.status === "matched" ? `${r.material!.id} [${r.matchedBy}]` : `UNMATCHED (suggest: ${r.suggestions.map((s) => s.id).join(", ") || "none"})`}`
      );
    }
  } catch (e) {
    console.log(`\n== ${path.basename(file)}  ERROR ${(e as { code?: string }).code || ""}: ${(e as Error).message}`);
  }
}
