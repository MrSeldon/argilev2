import { shelfAnalysis } from "@/lib/glazes/server";
import type { ConeBand } from "@/lib/glazes/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const shelf = Array.isArray(body.shelf) ? body.shelf.map(String).slice(0, 400) : [];
    const band: ConeBand = ["low", "mid", "high"].includes(body.band) ? body.band : "any";
    return Response.json(shelfAnalysis(shelf, band));
  } catch (e) {
    console.error("shelf error", e);
    return Response.json({ error: "Shelf analysis failed" }, { status: 500 });
  }
}
