"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { shelfStore } from "./shelfSync";

export interface SlimMaterial {
  id: string;
  name: string;
  kind: string;
  syn: string[];
  group?: string;
  variable?: boolean;
  optional?: boolean;
  note?: string;
}

const LEGACY_KEY = "argil-materials";
const LEGACY_DONE = "argile-legacy-migrated";

// ---------------------------------------------------------------- storage (never throws)
function readStore<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function writeStore(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota: the shelf just won't persist */
  }
}

// ---------------------------------------------------------------- glossary (fetched once)
let glossaryPromise: Promise<SlimMaterial[]> | null = null;
export function fetchGlossary(): Promise<SlimMaterial[]> {
  if (!glossaryPromise) {
    glossaryPromise = fetch("/api/glazes/materials")
      .then((r) => r.json())
      .then((d) => d.materials as SlimMaterial[])
      .catch((e) => {
        glossaryPromise = null;
        throw e;
      });
  }
  return glossaryPromise;
}

export function useGlossary() {
  const [list, setList] = useState<SlimMaterial[] | null>(null);
  useEffect(() => {
    let alive = true;
    fetchGlossary()
      .then((l) => alive && setList(l))
      .catch(() => alive && setList([]));
    return () => {
      alive = false;
    };
  }, []);
  return list;
}

export const normText = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

/** Search the glossary by name and synonyms (any language). */
export function searchGlossary(list: SlimMaterial[], q: string, limit = 8) {
  const n = normText(q);
  if (!n) return [];
  const scored: { m: SlimMaterial; s: number; via?: string }[] = [];
  for (const m of list) {
    let best = 0;
    let via: string | undefined;
    const name = normText(m.name);
    if (name === n) best = 100;
    else if (name.startsWith(n)) best = 80;
    else if (name.includes(n)) best = 60;
    for (const s of m.syn) {
      const t = normText(s);
      let sc = 0;
      if (t === n) sc = 90;
      else if (t.startsWith(n)) sc = 70;
      else if (t.includes(n)) sc = 50;
      if (sc > best) {
        best = sc;
        via = s;
      }
    }
    if (best) scored.push({ m, s: best - m.name.length / 100, via: best === 100 || (via && normText(via) === name) ? undefined : via });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit);
}

// ---------------------------------------------------------------- shelf hook
// Storage lives in ./shelfSync (this browser when signed out, the person's account when signed in).
const names = new Map<string, string>();
function rememberNames() {
  fetchGlossary()
    .then((l) => l.forEach((m) => names.set(m.id, m.name)))
    .catch(() => {});
}

export function useShelf() {
  const s = useSyncExternalStore(shelfStore.subscribe, shelfStore.get, shelfStore.getServer);

  useEffect(() => {
    rememberNames();
    // One-time migration from the old "My Materials" checklist (names), signed-out shelf only.
    if (!s.loaded || s.mode !== "local" || s.ids.length) return;
    const legacy = readStore<{ name: string; inStock: boolean }[]>(LEGACY_KEY);
    if (!legacy || !Array.isArray(legacy) || !legacy.some((m) => m.inStock)) return;
    // Only once, and never if the v1 shelf already did it.
    if (readStore("argile-shelf-v1") !== null || readStore(LEGACY_DONE) !== null) return;
    writeStore(LEGACY_DONE, true);
    fetchGlossary()
      .then((list) => {
        for (const m of legacy.filter((x) => x.inStock)) {
          const hit = searchGlossary(list, m.name, 1)[0];
          if (hit && hit.s >= 89) shelfStore.add(hit.m.id, hit.m.name);
        }
      })
      .catch(() => {});
  }, [s.loaded, s.mode, s.ids.length]);

  const add = useCallback((id: string) => shelfStore.add(id, names.get(id)), []);
  const remove = useCallback((id: string) => shelfStore.remove(id), []);
  const clear = useCallback(() => shelfStore.clear(), []);

  return { shelf: s.ids, entries: s.entries, loaded: s.loaded, mode: s.mode, status: s.status, email: s.email, add, remove, clear, addEntries: shelfStore.addEntries };
}
