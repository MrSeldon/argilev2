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

export type MapScope = "bay" | "colombia" | "east-africa" | "world";

// Rough Bay Area box: Santa Cruz / Half Moon Bay up to Santa Rosa / Napa,
// east to Livermore.
export const BAY_BOUNDS: [[number, number], [number, number]] = [
  [36.9, -123.2],
  [38.65, -121.5],
];

/** The places Winnie moves between: each opens as a framed region; "world" shows everything. */
export const REGIONS: Record<Exclude<MapScope, "world">, { label: string; bounds: [[number, number], [number, number]]; phrase: string }> = {
  bay: { label: "Bay Area", bounds: BAY_BOUNDS, phrase: "in the Bay Area" },
  colombia: { label: "Colombia", bounds: [[-4.3, -79.1], [12.6, -66.8]], phrase: "in Colombia" },
  "east-africa": { label: "East Africa", bounds: [[-11.8, 28.8], [5.5, 42.0]], phrase: "in East Africa" },
};

export function inScope(scope: MapScope, lat: number, lng: number): boolean {
  if (scope === "world") return true;
  const [[a, b], [c, d]] = REGIONS[scope].bounds;
  return lat >= a && lat <= c && lng >= b && lng <= d;
}

/** The region a place falls in, for opening the map on it. */
export function regionOf(lat: number, lng: number): MapScope {
  return (Object.keys(REGIONS) as Exclude<MapScope, "world">[]).find((r) => inScope(r, lat, lng)) || "world";
}

export const WORLD_VIEW = { center: [25, 10] as [number, number], zoom: 2 };

export function inBayArea(lat: number, lng: number): boolean {
  return (
    lat >= BAY_BOUNDS[0][0] &&
    lat <= BAY_BOUNDS[1][0] &&
    lng >= BAY_BOUNDS[0][1] &&
    lng <= BAY_BOUNDS[1][1]
  );
}

// Earthy, distinguishable hues drawn from the studio palette (teal, celadon,
// iron red, terracotta, ochre, ash).
export const TYPE_HEX: Record<string, string> = {
  school: "#2E5552",
  residency: "#6F8A5E",
  grant: "#A4532A",
  scholarship: "#C47A4E",
  fellowship: "#7A3B2A",
  apprenticeship: "#B08A3E",
  mentorship: "#8E5A6B",
  workshop: "#B4633F",
  internship: "#4F7C86",
  studio: "#3F4A3C",
  artist: "#6B4E3D",
  gallery: "#5A5F73",
  supplier: "#8C8A5A",
  materials: "#9C7B5B",
  community: "#4E6E58",
};

export function typeHex(type: string): string {
  return TYPE_HEX[type] || "#6B655B";
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
