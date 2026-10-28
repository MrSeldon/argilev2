import "server-only";
import { readFileSync } from "fs";
import path from "path";
import type { ConeBand, GlossaryMaterial, Ingredient, IndexRecipe, RecipeView, SearchHit } from "./types";
import { CONE_BANDS, coneText } from "./types";
import { parseQuery, type QueryHints } from "./query";

// Reads only the compact prebuilt index (data/glaze-index, ~9.6 MB on disk,
// server-side). The 12 MB raw source in data/glazes is never loaded at runtime.

interface LoadedIndex {
  recipes: IndexRecipe[];
  materialIds: string[];
  glossary: Map<string, GlossaryMaterial>;
  glossaryList: GlossaryMaterial[];
  byCode: Map<string, number>;
  dim: number;
  scales: Float32Array;
  vectors: Int8Array;
  manifest: { model: string; dtype: string; dim: number; count: number };
}

let cache: LoadedIndex | null = null;

const DIR = path.join(process.cwd(), "data", "glaze-index");

export function loadIndex(): LoadedIndex {
  if (cache) return cache;
  const manifest = JSON.parse(readFileSync(path.join(DIR, "manifest.json"), "utf8"));
  const data = JSON.parse(readFileSync(path.join(DIR, "recipes.json"), "utf8")) as { materials: string[]; recipes: IndexRecipe[] };
  const g = JSON.parse(readFileSync(path.join(process.cwd(), "data", "materials", "glossary.json"), "utf8")) as { materials: GlossaryMaterial[] };
  const buf = readFileSync(path.join(DIR, "vectors.bin"));
  const n = manifest.count as number;
  const dim = manifest.dim as number;
  // copy into aligned typed arrays
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const scales = new Float32Array(ab, 0, n);
  const vectors = new Int8Array(ab, n * 4, n * dim);
  const byCode = new Map<string, number>();
  data.recipes.forEach((r, k) => byCode.set(r.c.toLowerCase(), k));
  cache = {
    recipes: data.recipes,
    materialIds: data.materials,
    glossary: new Map(g.materials.map((m) => [m.id, m])),
    glossaryList: g.materials,
    byCode,
    dim,
    scales,
    vectors,
    manifest,
  };
  return cache;
}

const simple = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");

export function toView(r: IndexRecipe, idx = loadIndex()): RecipeView {
  const ingredients: Ingredient[] = r.i.map(([mi, pct, add, orig]) => {
    const id = mi >= 0 ? idx.materialIds[mi] : null;
    const g = id ? idx.glossary.get(id) : undefined;
    return {
      id,
      name: g?.name || orig || "?",
      original: orig && g && !simple(g.name).includes(simple(orig)) ? orig : undefined,
      pct,
      add: add === 1,
      variable: g?.variable || undefined,
      kind: g?.kind,
    };
  });
  return {
    code: r.c,
    source: r.s === "df" ? "digitalfire" : "glazy",
    name: r.n,
    description: r.d,
    family: r.f,
    surface: r.sf,
    transparency: r.tr,
    atmosphere: r.at,
    cone: r.cn,
    coneText: r.cs,
    subtype: r.st,
    tags: r.tg,
    ingredients,
    note: r.nt,
    longNote: r.nl,
    author: r.by,
    url: r.u,
  };
}

export function getRecipe(code: string): RecipeView | null {
  const idx = loadIndex();
  const k = idx.byCode.get(code.toLowerCase());
  return k === undefined ? null : toView(idx.recipes[k], idx);
}

// ---------------------------------------------------------------- shelf logic
function shelfKeys(shelf: string[], idx: LoadedIndex) {
  const ids = new Set(shelf);
  const groups = new Set<string>();
  for (const id of shelf) {
    const g = idx.glossary.get(id)?.group;
    if (g) groups.add(g);
  }
  return { ids, groups };
}

/** Keys of materials a recipe needs that are not on the shelf. */
function missingFor(r: IndexRecipe, idx: LoadedIndex, sk: { ids: Set<string>; groups: Set<string> }): string[] {
  const miss: string[] = [];
  for (const [mi, , , orig] of r.i) {
    if (mi < 0) {
      miss.push("?" + (orig || "unknown"));
      continue;
    }
    const id = idx.materialIds[mi];
    const g = idx.glossary.get(id);
    if (g?.optional) continue;
    if (sk.ids.has(id)) continue;
    if (g?.group && sk.groups.has(g.group)) continue;
    const key = g?.group ? "g:" + g.group : id;
    if (!miss.includes(key)) miss.push(key);
  }
  return miss;
}

function keyLabel(key: string, idx: LoadedIndex): string {
  if (key.startsWith("?")) return key.slice(1);
  if (key.startsWith("g:")) {
    const grp = key.slice(2);
    const first = idx.glossaryList.find((m) => m.group === grp);
    return first ? groupLabel(grp, first.name) : grp;
  }
  return idx.glossary.get(key)?.name || key;
}

function groupLabel(group: string, fallback: string) {
  const nice: Record<string, string> = {
    "potash-feldspar": "Potash feldspar (any)",
    "soda-feldspar": "Soda feldspar (any)",
    kaolin: "Kaolin (any)",
    "ball-clay": "Ball clay (any)",
    silica: "Silica",
    whiting: "Whiting / calcium carbonate",
    nepheline: "Nepheline syenite",
    "red-iron-oxide": "Iron oxide",
    copper: "Copper (carbonate or oxide)",
    cobalt: "Cobalt (carbonate or oxide)",
    manganese: "Manganese",
    "wood-ash": "Wood ash",
    gerstley: "Gerstley borate (or substitute)",
    zircon: "Zircon opacifier",
    "red-clay": "Red clay (e.g. Redart, local terracotta)",
    "stoneware-clay": "Stoneware / fire clay",
    "bone-ash": "Bone ash",
    talc: "Talc",
    dolomite: "Dolomite",
    rutile: "Rutile",
    ilmenite: "Ilmenite",
    "slip-clay-dark": "Dark slip clay (Albany / Alberta)",
    "cornwall-stone": "Cornwall stone",
    spodumene: "Spodumene",
    bentonite: "Bentonite",
    "calcined-kaolin": "Calcined kaolin",
    alumina: "Alumina",
    wollastonite: "Wollastonite",
    "lithium-carbonate": "Lithium carbonate",
    "strontium-carbonate": "Strontium carbonate",
    "barium-carbonate": "Barium carbonate",
    tin: "Tin oxide",
    titanium: "Titanium dioxide",
    chrome: "Chrome oxide",
    nickel: "Nickel oxide",
  };
  return nice[group] || fallback;
}

function inBand(r: IndexRecipe, band: ConeBand, cone?: number) {
  if (cone !== undefined && Number.isFinite(cone)) {
    return !!r.cn && r.cn[0] - 0.5 <= cone && cone <= r.cn[1] + 0.5;
  }
  if (band === "any") return true;
  if (!r.cn) return false;
  const [lo, hi] = CONE_BANDS[band].range;
  return r.cn[1] >= lo && r.cn[0] <= hi;
}

export interface SearchOptions {
  vector?: number[];
  q: string;
  band?: ConeBand;
  cone?: number;
  shelf?: string[];
  onlyMakeable?: boolean;
  limit?: number;
}

const SURFACE_GROUP: Record<string, string[]> = {
  glossy: ["glossy", "semi-glossy"],
  satin: ["satin", "semi-matte", "semi-glossy"],
  matte: ["matte", "semi-matte", "dry matte", "satin"],
};
const FAMILY_NEAR: Record<string, string[]> = {
  green: ["green", "turquoise"],
  brown: ["brown", "amber", "rust", "black"],
  black: ["black", "brown"],
  rust: ["rust", "brown", "red"],
  blue: ["blue", "turquoise"],
  turquoise: ["turquoise", "blue", "green"],
  amber: ["amber", "yellow", "brown"],
  yellow: ["yellow", "amber"],
  red: ["red", "rust", "pink"],
  white: ["white", "clear"],
  clear: ["clear", "white"],
};

function scoreBoost(r: IndexRecipe, h: QueryHints, why: string[], band: ConeBand) {
  let b = 0;
  const surf = r.sf || "";
  if (h.surface) {
    if (SURFACE_GROUP[h.surface].includes(surf)) {
      b += 0.05;
      why.push(`${surf} surface`);
    } else if (surf) b -= 0.04;
  }
  if (h.colour) {
    if (r.f === h.colour) {
      b += 0.07;
      why.push(`${r.f}${r.tg?.includes("celadon") ? " (celadon)" : ""}`);
    } else if (FAMILY_NEAR[h.colour]?.includes(r.f)) {
      b += 0.03;
      why.push(`${r.f} – close to ${h.colour}`);
    } else b -= 0.03;
  }
  const tagHit = h.tags.filter((t) => r.tg?.includes(t));
  if (tagHit.length) {
    b += 0.06 * tagHit.length;
    why.push(tagHit.join(", "));
  }
  const implied = h.implied.filter((t) => r.tg?.includes(t));
  if (implied.length) {
    b += 0.08;
    why.push(`${implied.join(", ")} family`);
  }
  const d = r.d.toLowerCase();
  if (h.wantsBreak && /break|thins/.test(d)) {
    b += 0.04;
    const m = r.d.match(/[^.;]*(breaks|thins)[^.;,]*/i);
    if (m) why.push(m[0].trim().replace(/^./, (c) => c.toLowerCase()));
    if (h.breakColour && new RegExp(h.breakColour === "brown" ? "brown|rust|amber" : h.breakColour).test(m?.[0] || "")) b += 0.03;
  } else if (h.wantsPool && /pool/.test(d)) {
    b += 0.03;
    const m = r.d.match(/[^.;]*pool[^.;]*/i);
    if (m) why.push(m[0].trim().replace(/^./, (c) => c.toLowerCase()));
  }
  if (h.wantsRun && /\bruns?\b|fluid/.test(d)) b += 0.02;
  if (h.atmosphere && r.at?.length) {
    if (r.at.includes(h.atmosphere)) {
      b += 0.02;
      why.push(h.atmosphere);
    } else b -= 0.02;
  }
  if (h.cone !== undefined && band === "any") {
    if (r.cn && r.cn[0] - 0.5 <= h.cone && h.cone <= r.cn[1] + 0.5) {
      b += 0.04;
      why.push(coneText(r.cn));
    } else b -= 0.04;
  }
  return b;
}

const STOP = new Set("a an the and or that with which to of in on over for is it its very bit some glaze glazes like want i".split(" "));

export function search(opts: SearchOptions): { hits: SearchHit[]; mode: "semantic" | "keyword"; considered: number } {
  const idx = loadIndex();
  const h = parseQuery(opts.q || "");
  const band = opts.band || "any";
  const limit = Math.min(opts.limit || 12, 40);
  const sk = opts.shelf ? shelfKeys(opts.shelf, idx) : null;
  const mode: "semantic" | "keyword" = opts.vector && opts.vector.length === idx.dim ? "semantic" : "keyword";
  const qv = mode === "semantic" ? Float32Array.from(opts.vector as number[]) : null;
  const words = (opts.q || "")
    .toLowerCase()
    .split(/[^a-zà-ÿ']+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

  const scored: { k: number; sim: number; score: number }[] = [];
  let considered = 0;
  for (let k = 0; k < idx.recipes.length; k++) {
    const r = idx.recipes[k];
    if (!inBand(r, band, opts.cone)) continue;
    if (opts.onlyMakeable && sk && missingFor(r, idx, sk).length) continue;
    considered++;
    let sim = 0;
    if (qv) {
      const off = k * idx.dim;
      let dot = 0;
      for (let d = 0; d < idx.dim; d++) dot += qv[d] * idx.vectors[off + d];
      sim = dot * idx.scales[k];
    } else if (words.length) {
      const hay = `${r.n} ${r.st || ""} ${r.d} ${(r.tg || []).join(" ")}`.toLowerCase();
      let hit = 0;
      for (const w of words) if (hay.includes(w)) hit++;
      sim = (hit / words.length) * 0.6;
    }
    const tmp: string[] = [];
    const score = sim + scoreBoost(r, h, tmp, band);
    scored.push({ k, sim, score });
  }
  scored.sort((a, b) => b.score - a.score);

  const hits: SearchHit[] = [];
  const seen = new Set<string>();
  for (const s of scored) {
    if (hits.length >= limit) break;
    const r = idx.recipes[s.k];
    // skip near-duplicate copies (same name + same ingredients)
    const sig = r.n.toLowerCase().replace(/\W+/g, "") + "|" + r.i.map((x) => `${x[0]}:${Math.round(x[1])}`).join(",");
    if (seen.has(sig)) continue;
    seen.add(sig);
    const why: string[] = [];
    scoreBoost(r, h, why, band);
    if (mode === "semantic") why.push(`description match ${Math.round(Math.max(0, s.sim) * 100)}%`);
    const view = toView(r, idx);
    const hit: SearchHit = { recipe: view, score: Math.round(s.score * 1000) / 1000, similarity: Math.round(s.sim * 1000) / 1000, why: [...new Set(why)] };
    if (sk) {
      const miss = missingFor(r, idx, sk);
      hit.missing = miss.map((m) => keyLabel(m, idx));
      hit.makeable = miss.length === 0;
    }
    hits.push(hit);
  }
  return { hits, mode, considered };
}

// ---------------------------------------------------------------- shelf analysis
export function shelfAnalysis(shelf: string[], band: ConeBand = "any") {
  const idx = loadIndex();
  const sk = shelfKeys(shelf, idx);
  const makeable: number[] = [];
  const unlock = new Map<string, number[]>();
  let total = 0;
  for (let k = 0; k < idx.recipes.length; k++) {
    const r = idx.recipes[k];
    if (!inBand(r, band)) continue;
    total++;
    const miss = missingFor(r, idx, sk);
    if (miss.length === 0) makeable.push(k);
    else if (miss.length === 1 && !miss[0].startsWith("?")) {
      const arr = unlock.get(miss[0]) || [];
      arr.push(k);
      unlock.set(miss[0], arr);
    }
  }
  const pick = (ks: number[], n: number) => {
    // prefer named recipes with recorded surface, then deterministic order
    const named = ks.filter((k) => !/^Glazy recipe|\(Glazy \d+\)$/.test(idx.recipes[k].n));
    return [...named, ...ks.filter((k) => !named.includes(k))].slice(0, n).map((k) => {
      const r = idx.recipes[k];
      return { code: r.c, name: r.n, family: r.f, surface: r.sf, cone: r.cn };
    });
  };
  const oneAway = [...unlock.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 8)
    .map(([key, ks]) => {
      const id = key.startsWith("g:") ? suggestedId(key.slice(2), ks, idx) : key;
      const g = idx.glossary.get(id);
      return { key, id, label: keyLabel(key, idx), unlocks: ks.length, kind: g?.kind, variable: g?.variable, examples: pick(ks, 3) };
    });
  return { total, makeableCount: makeable.length, makeable: pick(makeable, 24), oneAway };
}

function suggestedId(group: string, ks: number[], idx: LoadedIndex) {
  // the most-used member of the group among the unlocked recipes
  const counts = new Map<string, number>();
  for (const k of ks)
    for (const [mi] of idx.recipes[k].i) {
      if (mi < 0) continue;
      const id = idx.materialIds[mi];
      if (idx.glossary.get(id)?.group === group) counts.set(id, (counts.get(id) || 0) + 1);
    }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || group;
}

export function slimGlossary() {
  const idx = loadIndex();
  return idx.glossaryList.map((m) => ({
    id: m.id,
    name: m.name,
    kind: m.kind,
    syn: m.synonyms,
    group: m.group,
    variable: m.variable || undefined,
    optional: m.optional || undefined,
    note: m.note,
  }));
}
