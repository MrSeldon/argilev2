import { search } from "@/lib/glazes/server";
import type { ConeBand } from "@/lib/glazes/types";

export const runtime = "nodejs";

const BANDS: ConeBand[] = ["any", "low", "mid", "high"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const q = String(body.q || "").slice(0, 500);
    const vector = Array.isArray(body.vector) ? body.vector.map(Number).filter(Number.isFinite) : undefined;
    const band: ConeBand = BANDS.includes(body.band) ? body.band : "any";
    const cone = body.cone === undefined || body.cone === null || body.cone === "" ? undefined : Number(body.cone);
    const shelf = Array.isArray(body.shelf) ? body.shelf.map(String).slice(0, 400) : undefined;
    const t0 = Date.now();
    const res = search({
      q,
      vector,
      band,
      cone: Number.isFinite(cone) ? cone : undefined,
      shelf,
      onlyMakeable: !!body.onlyMakeable && !!shelf,
      limit: Number(body.limit) || 12,
    });
    return Response.json({ ...res, ms: Date.now() - t0 });
  } catch (e) {
    console.error("glaze search error", e);
    return Response.json({ error: "Search failed" }, { status: 500 });
  }
}
