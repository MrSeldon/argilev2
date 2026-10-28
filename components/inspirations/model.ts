// Shared shape and helpers for inspiration entries (client-safe).
import type { InspirationsData } from "@/lib/types";

export interface InspirationItem {
  id: string;
  name: string;
  origin?: string;
  period?: string;
  fallbackColor?: string;
  visualCaption?: string;
  story?: { hook?: string; body?: string; reflection?: string };
  connections?: string[];
  techniques?: string[];
  tags?: string[];
  sourceUrl?: string;
  image?: unknown;
}

export type Located = InspirationItem & { category: string };

export const CATEGORIES = [
  { key: "traditions", label: "Traditions", one: "Tradition" },
  { key: "artists", label: "Artists", one: "Artist" },
  { key: "places", label: "Places", one: "Place" },
  { key: "surfaces", label: "Surfaces", one: "Surface" },
  { key: "techniques", label: "Techniques", one: "Technique" },
  { key: "ideas", label: "Ideas", one: "Idea" },
  { key: "moments", label: "Moments", one: "Moment" },
] as const;

export function categoryLabel(key: string, singular = false) {
  const c = CATEGORIES.find((c) => c.key === key);
  if (!c) return key;
  return singular ? c.one : c.label;
}

export function allItems(data: InspirationsData): Located[] {
  const out: Located[] = [];
  for (const c of CATEGORIES) {
    const list = (data[c.key as keyof InspirationsData] || []) as unknown as InspirationItem[];
    for (const it of list) out.push({ ...it, category: c.key });
  }
  return out;
}

export function itemsIn(data: InspirationsData, category: string): Located[] {
  return allItems(data).filter((i) => i.category === category);
}

export function isCategory(key?: string): boolean {
  return !!key && CATEGORIES.some((c) => c.key === key);
}
