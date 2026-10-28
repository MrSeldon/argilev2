// Shared (client + server) types for the glaze search index.

export interface GlossaryMaterial {
  id: string;
  name: string;
  kind: string;
  synonyms: string[];
  analysis?: Record<string, number>;
  group?: string;
  variable?: boolean;
  optional?: boolean;
  note?: string;
}

/** Compact recipe as stored in data/glaze-index/recipes.json */
export interface IndexRecipe {
  c: string; // code
  s: "df" | "gz"; // source
  n: string; // name
  d: string; // generated plain description
  f: string; // colour family
  sf?: string; // surface
  tr?: string; // transparency
  at?: string[]; // atmospheres
  cn?: [number, number]; // cone range (06 = -6)
  cs?: string; // cone as written in source
  st?: string; // subtype
  tg?: string[]; // tags (celadon, tenmoku, ash...)
  i: IndexRow[]; // ingredients
  nt?: string; // short source note
  nl?: string; // longer note (Digitalfire)
  by?: string; // author (Glazy)
  u?: string; // source url
}

/** [materialIndex | -1, percent, isAddition (0|1), originalName?] */
export type IndexRow = [number, number, number, string?];

/** Ingredient as sent to the browser */
export interface Ingredient {
  id: string | null; // canonical material id, null if unmatched
  name: string; // canonical display name (or original if unmatched)
  original?: string; // name as written in the source recipe
  pct: number; // base normalised to 100; additions as % of base
  add: boolean;
  variable?: boolean;
  kind?: string;
}

export interface RecipeView {
  code: string;
  source: "digitalfire" | "glazy";
  name: string;
  description: string;
  family: string;
  surface?: string;
  transparency?: string;
  atmosphere?: string[];
  cone?: [number, number];
  coneText?: string;
  subtype?: string;
  tags?: string[];
  ingredients: Ingredient[];
  note?: string;
  longNote?: string;
  author?: string;
  url?: string;
  image?: string;
}

export interface SearchHit {
  recipe: RecipeView;
  score: number;
  similarity: number;
  why: string[];
  missing?: string[]; // material names not on the shelf
  makeable?: boolean;
}

export type ConeBand = "any" | "low" | "mid" | "high";

export const CONE_BANDS: Record<Exclude<ConeBand, "any">, { label: string; range: [number, number] }> = {
  low: { label: "Low (06–04)", range: [-8, -1] },
  mid: { label: "Mid (5–7)", range: [4, 7] },
  high: { label: "High (8–11)", range: [8, 13] },
};

export function coneLabel(v: number): string {
  const s = v < 0 ? "0" + String(-v) : String(v);
  return s.replace(".5", "½");
}

export function coneText(c?: [number, number]): string {
  if (!c) return "cone ?";
  return c[0] === c[1] ? `cone ${coneLabel(c[0])}` : `cone ${coneLabel(c[0])}–${coneLabel(c[1])}`;
}
