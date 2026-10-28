import "server-only";
import { GLOSSARY } from "@/lib/shelf/glossary";
import { createSupabaseServer } from "@/lib/supabase/server";
import { UPLOAD_BUCKET } from "@/lib/supabase/env";
import { buildMatcher, resolveItem, type Matcher } from "@/lib/shelf/match";
import { ReadError, readLabelImage, type ImageMediaType } from "@/lib/shelf/read";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

let matcher: Matcher | null = null;
function getMatcher() {
  if (!matcher) matcher = buildMatcher(GLOSSARY);
  return matcher;
}

const fail = (status: number, error: string, message: string) => Response.json({ error, message }, { status });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * POST { intakeId } -> reads the photo stored for that intake row (argile-uploads/<uid>/...),
 * asks Claude what materials it shows, matches them to the glossary, saves the result on
 * the row as `extracted`, and returns it. Nothing is added to the shelf here: she confirms first.
 */
export async function POST(req: Request) {
  const supabase = await createSupabaseServer();
  if (!supabase) return fail(503, "not_configured", "Sign-in isn’t set up on this site.");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fail(401, "signed_out", "Please sign in again to read photos.");

  let intakeId: unknown;
  try {
    ({ intakeId } = await req.json());
  } catch {
    return fail(400, "bad_request", "Bad request.");
  }
  if (typeof intakeId !== "string" || !UUID.test(intakeId)) return fail(400, "bad_request", "Bad request.");

  // Row-level security: this only finds the row if it is hers.
  const { data: row, error: rowErr } = await supabase.from("argile_intake").select("id, photo_path").eq("id", intakeId).maybeSingle();
  if (rowErr) return fail(502, "db", "Couldn’t load that photo. Try again.");
  if (!row?.photo_path) return fail(404, "not_found", "That photo wasn’t found.");

  const { data: blob, error: dlErr } = await supabase.storage.from(UPLOAD_BUCKET).download(row.photo_path);
  if (dlErr || !blob) return fail(502, "storage", "Couldn’t open the uploaded photo. Try again.");
  const type = (blob.type || "image/jpeg").toLowerCase();
  const mediaType: ImageMediaType | null = type.includes("jpeg") || type.includes("jpg") ? "image/jpeg" : type.includes("png") ? "image/png" : type.includes("webp") ? "image/webp" : null;
  if (!mediaType) return fail(415, "format", "That photo format can’t be read. Please take a new photo or a screenshot.");
  const base64 = Buffer.from(await blob.arrayBuffer()).toString("base64");

  const m = getMatcher();
  try {
    const res = await readLabelImage({ base64, mediaType, materials: GLOSSARY.map((g) => ({ id: g.id, name: g.name })) });
    const items = res.items.map((it) => resolveItem(it, m));
    const extracted = { document: res.document, readable: res.readable, note: res.note, items, raw: res.items };
    await supabase
      .from("argile_intake")
      .update({ extracted, kind: res.document === "receipt" ? "receipt" : "photo" })
      .eq("id", intakeId);
    return Response.json({ intakeId, document: res.document, readable: res.readable, note: res.note, items });
  } catch (e) {
    if (e instanceof ReadError) {
      const status = e.code === "missing_key" ? 503 : e.code === "busy" ? 503 : e.code === "too_big" ? 413 : 502;
      if (e.code === "upstream") console.error("shelf/read:", e.message);
      return fail(status, e.code, e.code === "upstream" ? "Couldn’t read that photo right now. Try again in a minute." : e.message);
    }
    console.error("shelf/read:", e);
    return fail(500, "unknown", "Something went wrong reading that photo. Try again.");
  }
}
