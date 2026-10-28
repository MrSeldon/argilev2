/** Shelf entries and the edit operations replayed on top of the server copy. Pure; unit-tested. */

export interface ShelfEntry {
  id: string;
  name?: string;
  amount?: number;
  unit?: string;
  note?: string;
  source?: "photo" | "receipt" | "manual";
  added_at: string;
}

export type Op = { t: "add"; e: ShelfEntry; overwrite?: boolean } | { t: "remove"; id: string } | { t: "clear" };

export const now = () => new Date().toISOString();

export function clean(list: unknown): ShelfEntry[] {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: ShelfEntry[] = [];
  for (const x of list) {
    const e: ShelfEntry | null = typeof x === "string" ? { id: x, added_at: now() } : x && typeof x === "object" && typeof (x as ShelfEntry).id === "string" ? (x as ShelfEntry) : null;
    if (!e || seen.has(e.id)) continue;
    seen.add(e.id);
    out.push(e);
  }
  return out;
}

export function applyOps(base: ShelfEntry[], ops: Op[]): ShelfEntry[] {
  let list = clean(base);
  for (const op of ops) {
    if (op.t === "clear") list = [];
    else if (op.t === "remove") list = list.filter((e) => e.id !== op.id);
    else {
      const i = list.findIndex((e) => e.id === op.e.id);
      if (i < 0) list = [...list, op.e];
      else if (op.overwrite) {
        const merged: ShelfEntry = { ...list[i] };
        for (const [k, v] of Object.entries(op.e)) if (v !== undefined && v !== null && v !== "" && k !== "added_at") (merged as unknown as Record<string, unknown>)[k] = v;
        list = list.map((e, j) => (j === i ? merged : e));
      } else if (!list[i].name && op.e.name) {
        list = list.map((e, j) => (j === i ? { ...e, name: op.e.name } : e));
      }
    }
  }
  return list;
}

