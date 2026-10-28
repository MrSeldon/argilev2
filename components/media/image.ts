// Local stand-in for lib/images.ts (being added on the data branch).
// Reads `entry.image` = { src, alt, credit, creditUrl, license } the same way
// and only accepts locally hosted files (src starting with "/"), so remote
// hotlinks never reach next/image. When lib/images.ts lands, this can simply
// re-export imageOf from there.

export interface EntryImage {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  license?: string;
  width?: number;
  height?: number;
}

export function imageOf(entry: unknown): EntryImage | null {
  if (!entry || typeof entry !== "object") return null;
  const img = (entry as { image?: unknown }).image;
  if (!img || typeof img !== "object") return null;
  const i = img as Record<string, unknown>;
  const src = typeof i.src === "string" ? i.src : "";
  if (!src.startsWith("/")) return null;
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  const num = (v: unknown) => (typeof v === "number" && v > 0 ? v : undefined);
  const name = str((entry as { name?: unknown }).name);
  return {
    src,
    alt: str(i.alt) || name || "",
    credit: str(i.credit),
    creditUrl: str(i.creditUrl),
    license: str(i.license),
    width: num(i.width),
    height: num(i.height),
  };
}
