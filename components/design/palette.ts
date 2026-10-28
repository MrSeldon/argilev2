// Earthy hues for opportunity types and inspiration categories, plus a tint
// helper so cards can carry a quiet wash of their category colour.
// Client-safe (no server imports).

import { TYPE_HEX } from "@/lib/opportunity-map";

export const PAPER = "#F5F0E8";

export function typeColor(type: string): string {
  return TYPE_HEX[type] || "#6B655B";
}

export const CATEGORY_HEX: Record<string, string> = {
  traditions: "#A4532A",
  artists: "#2E5552",
  places: "#6F8A5E",
  surfaces: "#B08A3E",
  techniques: "#B4633F",
  ideas: "#5A5F73",
  moments: "#7A3B2A",
};

export function categoryColor(category: string): string {
  return CATEGORY_HEX[category] || "#6B655B";
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mix `hex` into the paper colour; amount 0 = paper, 1 = the colour. */
export function tint(hex: string, amount = 0.14, base = PAPER): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(base);
  const m = a.map((v, i) => Math.round(b[i] + (v - b[i]) * amount));
  return `rgb(${m[0]}, ${m[1]}, ${m[2]})`;
}

export function titleCase(s: string): string {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
