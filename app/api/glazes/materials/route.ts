import { slimGlossary } from "@/lib/glazes/server";

export const dynamic = "force-static";

export async function GET() {
  return Response.json({ materials: slimGlossary() });
}
