"use client";

import { useCallback, useEffect, useState } from "react";

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

const KEY = "argile-shelf-v1";
const LEGACY_KEY = "argil-materials";

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
export function useShelf() {
  const [shelf, setShelf] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = readStore<string[]>(KEY);
    if (saved && Array.isArray(saved)) {
      setShelf(saved);
      setLoaded(true);
      return;
    }
    // One-time migration from the old "My Materials" checklist (names).
    const legacy = readStore<{ name: string; inStock: boolean }[]>(LEGACY_KEY);
    if (legacy && Array.isArray(legacy) && legacy.some((m) => m.inStock)) {
      fetchGlossary()
        .then((list) => {
          const ids = new Set<string>();
          for (const m of legacy.filter((x) => x.inStock)) {
            const hit = searchGlossary(list, m.name, 1)[0];
            if (hit && hit.s >= 89) ids.add(hit.m.id);
          }
          setShelf([...ids]);
          writeStore(KEY, [...ids]);
        })
        .catch(() => {})
        .finally(() => setLoaded(true));
      return;
    }
    setLoaded(true);
  }, []);

  // keep several hook instances on one page in sync
  useEffect(() => {
    const on = (e: Event) => setShelf((e as CustomEvent<string[]>).detail);
    window.addEventListener("argile-shelf", on);
    return () => window.removeEventListener("argile-shelf", on);
  }, []);

  const update = useCallback((fn: (prev: string[]) => string[]) => {
    setShelf((prev) => {
      const next = fn(prev);
      writeStore(KEY, next);
      setTimeout(() => window.dispatchEvent(new CustomEvent("argile-shelf", { detail: next })), 0);
      return next;
    });
  }, []);

  const add = useCallback((id: string) => update((p) => (p.includes(id) ? p : [...p, id])), [update]);
  const remove = useCallback((id: string) => update((p) => p.filter((x) => x !== id)), [update]);
  const clear = useCallback(() => update(() => []), [update]);

  return { shelf, loaded, add, remove, clear };
}
