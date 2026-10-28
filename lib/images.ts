import type { EntryImage } from "./types";

/** Returns the entry's local image (with credit and license) or null when it has none. */
export function imageOf(entry: { image?: EntryImage | null } | null | undefined): EntryImage | null {
  return entry?.image?.src ? entry.image : null;
}
