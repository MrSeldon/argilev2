import { promises as fs } from "fs";
import path from "path";
import type { Opportunity } from "./types";
import { getOpportunities } from "./data";

/** Hand-picked finds (data/highlights.json): why each is worth Winnie's time, with dated ones dropping off after `until`. */
export interface Highlight {
  id: string;
  tag: string;
  line: string;
  until?: string;
  opportunity: Opportunity;
}

const today = () => new Date().toISOString().slice(0, 10);

export async function getHighlights(): Promise<Highlight[]> {
  const raw = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "highlights.json"), "utf-8")) as {
    items: Omit<Highlight, "opportunity">[];
  };
  const opps = new Map((await getOpportunities()).map((o) => [o.id, o]));
  const now = today();
  const live = raw.items
    .filter((h) => !h.until || h.until >= now)
    .flatMap((h) => (opps.has(h.id) ? [{ ...h, opportunity: opps.get(h.id)! }] : []));
  // Soonest dates first, then the evergreen finds in their curated order
  const dated = live.filter((h) => h.until).sort((a, b) => a.until!.localeCompare(b.until!));
  return [...dated, ...live.filter((h) => !h.until)];
}

/** A few for today: always the soonest dated one, then a daily rotation through the rest. */
export function todaysHighlights(all: Highlight[], n = 3): Highlight[] {
  if (all.length <= n) return all;
  const day = Math.floor(Date.now() / 86_400_000);
  const first = all.find((h) => h.until);
  const rest = all.filter((h) => h !== first);
  const picks = Array.from({ length: n - (first ? 1 : 0) }, (_, k) => rest[(day * 5 + k * 7) % rest.length]);
  return [...(first ? [first] : []), ...picks.filter((h, i, a) => a.indexOf(h) === i)];
}
