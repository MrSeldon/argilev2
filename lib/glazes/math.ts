// All glaze arithmetic lives here (batch weights, percentages, scaling, oxide
// analysis). The language model never does arithmetic: it may only propose a
// change ("add 2 parts rutile"), and this module computes the result.
import type { GlossaryMaterial, Ingredient } from "./types";

export const round = (x: number, dp = 1) => {
  const f = Math.pow(10, dp);
  return Math.round(x * f) / f;
};

/** Grams for a batch whose *base* (excluding additions) weighs batchGrams. */
export function batchWeights(ings: Ingredient[], batchGrams: number) {
  const baseSum = ings.filter((i) => !i.add).reduce((s, i) => s + i.pct, 0) || 100;
  const rows = ings.map((i) => ({ ...i, grams: (i.pct / baseSum) * batchGrams }));
  const baseGrams = rows.filter((r) => !r.add).reduce((s, r) => s + r.grams, 0);
  const addGrams = rows.filter((r) => r.add).reduce((s, r) => s + r.grams, 0);
  return { rows, baseGrams, addGrams, totalGrams: baseGrams + addGrams };
}

/** Grams shown to the nearest 0.1 g below 100 g, whole grams above. */
export function fmtGrams(g: number) {
  if (g < 10) return round(g, 2).toFixed(2);
  if (g < 100) return round(g, 1).toFixed(1);
  return String(Math.round(g));
}

/** Re-normalise base ingredients to 100; additions stay as % of base. */
export function normalise(ings: Ingredient[]): Ingredient[] {
  const baseSum = ings.filter((i) => !i.add).reduce((s, i) => s + i.pct, 0);
  if (!baseSum) return ings;
  return ings.map((i) => ({ ...i, pct: round((i.pct / baseSum) * 100, 2) }));
}

export type ChangeAction = "add" | "increase" | "decrease" | "remove" | "swap";
export interface ProposedChange {
  action: ChangeAction;
  material: string; // glossary id
  toMaterial?: string; // for swap
  amount?: number; // percentage points (of base), for add/increase/decrease
  asAddition?: boolean; // for add: colourant-style addition on top of the base
}

/** Apply a proposed change in code and return the new (normalised) recipe. */
export function applyChange(
  ings: Ingredient[],
  change: ProposedChange,
  glossary: Map<string, GlossaryMaterial>
): { ingredients: Ingredient[]; summary: string } {
  const mat = glossary.get(change.material);
  const label = mat?.name || change.material;
  const amt = Math.max(0, Math.min(50, Number(change.amount) || 0));
  let next = ings.map((i) => ({ ...i }));
  const idx = next.findIndex((i) => i.id === change.material || (mat?.group && glossary.get(i.id || "")?.group === mat.group));
  let summary = "";
  switch (change.action) {
    case "add":
    case "increase": {
      if (idx >= 0) {
        next[idx].pct = next[idx].pct + amt;
        summary = `${label}: ${round(ings[idx].pct, 2)} → ${round(next[idx].pct, 2)}`;
      } else {
        const add = change.asAddition ?? (mat ? ["colorant", "stain", "opacifier"].includes(mat.kind) : false);
        next.push({ id: change.material, name: label, pct: amt, add, kind: mat?.kind, variable: mat?.variable });
        summary = `${add ? "Add" : "Add to base"} ${label} ${round(amt, 2)}${add ? " (on top of the base)" : ""}`;
      }
      break;
    }
    case "decrease": {
      if (idx < 0) return { ingredients: ings, summary: `${label} is not in this recipe - no change made.` };
      next[idx].pct = Math.max(0, next[idx].pct - amt);
      summary = `${label}: ${round(ings[idx].pct, 2)} → ${round(next[idx].pct, 2)}`;
      if (next[idx].pct === 0) next.splice(idx, 1);
      break;
    }
    case "remove": {
      if (idx < 0) return { ingredients: ings, summary: `${label} is not in this recipe - no change made.` };
      summary = `Remove ${next[idx].name}`;
      next.splice(idx, 1);
      break;
    }
    case "swap": {
      const to = change.toMaterial ? glossary.get(change.toMaterial) : undefined;
      if (idx < 0 || !to) return { ingredients: ings, summary: "Swap could not be applied - no change made." };
      summary = `Swap ${next[idx].name} → ${to.name} (same weight)`;
      next[idx] = { ...next[idx], id: to.id, name: to.name, original: undefined, kind: to.kind, variable: to.variable };
      break;
    }
  }
  // Base re-normalised to 100 so the numbers stay comparable; additions are % of base.
  next = normalise(next);
  return { ingredients: next, summary };
}

// ---------------------------------------------------------------- chemistry
const MW: Record<string, number> = {
  SiO2: 60.08, Al2O3: 101.96, B2O3: 69.62, Li2O: 29.88, Na2O: 61.98, K2O: 94.2, MgO: 40.3, CaO: 56.08,
  SrO: 103.62, BaO: 153.33, ZnO: 81.38, PbO: 223.2, Fe2O3: 159.69, TiO2: 79.87, P2O5: 141.94, MnO: 70.94,
  CuO: 79.55, CoO: 74.93, Cr2O3: 151.99, NiO: 74.69, SnO2: 150.71, ZrO2: 123.22,
};
const FLUXES = ["Li2O", "Na2O", "K2O", "MgO", "CaO", "SrO", "BaO", "ZnO", "PbO"];

export interface Chemistry {
  oxides: Record<string, number>; // fired weight %
  umf?: Record<string, number>; // unity molecular formula (fluxes sum to 1)
  siAl?: number;
  unknownPct: number; // % of batch with no analysis
  variablePct: number; // % of batch from variable/local materials
}

export function chemistry(ings: Ingredient[], glossary: Map<string, GlossaryMaterial>): Chemistry {
  const ox: Record<string, number> = {};
  let unknown = 0;
  let variable = 0;
  for (const i of ings) {
    const g = i.id ? glossary.get(i.id) : undefined;
    if (g?.variable) variable += i.pct;
    if (!g?.analysis) {
      unknown += i.pct;
      continue;
    }
    for (const [k, v] of Object.entries(g.analysis)) {
      if (k === "LOI" || k === "SO3" || k === "F") continue;
      ox[k] = (ox[k] || 0) + (i.pct * v) / 100;
    }
  }
  const total = Object.values(ox).reduce((s, v) => s + v, 0) || 1;
  const oxides: Record<string, number> = {};
  for (const [k, v] of Object.entries(ox)) oxides[k] = round((v / total) * 100, 2);
  const moles: Record<string, number> = {};
  for (const [k, v] of Object.entries(ox)) if (MW[k]) moles[k] = v / MW[k];
  const fluxMoles = FLUXES.reduce((s, k) => s + (moles[k] || 0), 0);
  let umf: Record<string, number> | undefined;
  let siAl: number | undefined;
  if (fluxMoles > 0) {
    umf = {};
    for (const [k, v] of Object.entries(moles)) umf[k] = round(v / fluxMoles, 3);
    if (umf.Al2O3) siAl = round((umf.SiO2 || 0) / umf.Al2O3, 2);
  }
  const allSum = ings.reduce((s, i) => s + i.pct, 0) || 1;
  return { oxides, umf, siAl, unknownPct: round((unknown / allSum) * 100, 1), variablePct: round((variable / allSum) * 100, 1) };
}
