// Client-safe helpers for the opportunities map. Kept separate from lib/data.ts
// and lib/types.ts so loader / schema changes elsewhere merge cleanly.
import type { Opportunity } from "./types";

/**
 * Opportunity plus the optional fields used by the San Francisco Bay dataset.
 * `type` stays the primary filter; `category` / `categories` are optional extras.
 */
export type MapOpportunity = Omit<Opportunity, "source"> & {
  category?: string;
  categories?: string[];
  source?: string | { url?: string; name?: string; label?: string };
  lastVerified?: string;
  address?: string;
};

export type MapScope = "bay" | "world";

// Rough Bay Area box: Santa Cruz / Half Moon Bay up to Santa Rosa / Napa,
// east to Livermore.
export const BAY_BOUNDS: [[number, number], [number, number]] = [
  [36.9, -123.2],
  [38.65, -121.5],
];

export const WORLD_VIEW = { center: [25, 10] as [number, number], zoom: 2 };

export function inBayArea(lat: number, lng: number): boolean {
  return (
    lat >= BAY_BOUNDS[0][0] &&
    lat <= BAY_BOUNDS[1][0] &&
    lng >= BAY_BOUNDS[0][1] &&
    lng <= BAY_BOUNDS[1][1]
  );
}

export const TYPE_HEX: Record<string, string> = {
  school: "#3b82f6",
  residency: "#22c55e",
  grant: "#a855f7",
  scholarship: "#ec4899",
  fellowship: "#6366f1",
  apprenticeship: "#f59e0b",
  mentorship: "#f43f5e",
  workshop: "#f97316",
  internship: "#06b6d4",
  studio: "#14b8a6",
  artist: "#d946ef",
  gallery: "#8b5cf6",
  supplier: "#84cc16",
  materials: "#ca8a04",
  community: "#0ea5e9",
};

export function typeHex(type: string): string {
  return TYPE_HEX[type] || "#6b7280";
}

/** All category labels an opportunity carries (single `category` and/or `categories[]`). */
export function categoriesOf(o: MapOpportunity): string[] {
  const out: string[] = [];
  if (typeof o.category === "string" && o.category) out.push(o.category);
  if (Array.isArray(o.categories)) {
    for (const c of o.categories) if (typeof c === "string" && c && !out.includes(c)) out.push(c);
  }
  return out;
}

export function sourceUrl(o: MapOpportunity): string | undefined {
  const s = o.source;
  if (typeof s === "string") return /^https?:\/\//.test(s) ? s : o.website;
  if (s && typeof s === "object" && s.url) return s.url;
  return o.website;
}

export function sourceLabel(o: MapOpportunity): string {
  const s = o.source;
  if (typeof s === "string" && !/^https?:\/\//.test(s)) return s;
  if (s && typeof s === "object") return s.name || s.label || "Source";
  return "Source";
}

export function addressOf(o: MapOpportunity): string | undefined {
  const loc = o.location as unknown as { address?: string };
  return loc?.address || o.address;
}

export function titleCase(s: string): string {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
