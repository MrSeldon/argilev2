// All slip-casting arithmetic lives here: water for a target specific gravity,
// corrections from a measured cup, deflocculant dose, shrinkage and absorption.
// Weights are grams, volumes millilitres (1 ml of water = 1 g), lengths millimetres.
// Every function returns null when the inputs cannot give a sensible answer.

/** Typical particle density of dry clay, g per cm3. */
export const CLAY_DENSITY = 2.6;
export const DEFAULT_SG = 1.78;
/** Starting dose of deflocculant, as % of the dry clay weight. */
export const DEFLOC_LOW_PCT = 0.25;
export const DEFLOC_HIGH_PCT = 0.5;
/** One drop from a dropper or pipette is about 0.05 ml (20 drops per ml). */
export const ML_PER_DROP = 0.05;

const ok = (...xs: number[]) => xs.every((x) => Number.isFinite(x) && x > 0);
/** A slip can only sit between water (1) and solid clay (the particle density). */
const sgOk = (sg: number, density: number) => ok(sg, density) && density > 1 && sg > 1 && sg < density;

/** Specific gravity of dryGrams of powder stirred into waterGrams of water. */
export function slipSG(dryGrams: number, waterGrams: number, density = CLAY_DENSITY): number | null {
  if (!ok(dryGrams, waterGrams, density)) return null;
  return (dryGrams + waterGrams) / (waterGrams + dryGrams / density);
}

/** Water (g = ml) to add to dryGrams of powder to reach the target specific gravity. */
export function waterForSG(dryGrams: number, sg: number, density = CLAY_DENSITY): number | null {
  if (!ok(dryGrams) || !sgOk(sg, density)) return null;
  return (dryGrams * (1 - sg / density)) / (sg - 1);
}

/** Dry powder (g) that a given amount of water carries at a specific gravity. */
export function dryForSG(waterGrams: number, sg: number, density = CLAY_DENSITY): number | null {
  if (!ok(waterGrams) || !sgOk(sg, density)) return null;
  return (waterGrams * (sg - 1)) / (1 - sg / density);
}

/** The whole batch: water, total weight and volume. */
export function batch(dryGrams: number, sg: number, density = CLAY_DENSITY) {
  const water = waterForSG(dryGrams, sg, density);
  if (water === null) return null;
  return {
    water,
    totalGrams: dryGrams + water,
    volumeMl: water + dryGrams / density,
    waterPctOfDry: (water / dryGrams) * 100,
  };
}

/** Specific gravity from the weight of a measured volume (100 ml by default). */
export function sgFromCup(cupGrams: number, cupMl = 100): number | null {
  if (!ok(cupGrams, cupMl)) return null;
  return cupGrams / cupMl;
}

export type Correction =
  | { kind: "ok" }
  | { kind: "water"; perLitre: number; forBatch: number | null } // slip too thick: add water (ml)
  | { kind: "powder"; perLitre: number; forBatch: number | null }; // slip too thin: add powder (g)

/**
 * What to add to move a slip from its measured specific gravity to the target.
 * perLitre is for each litre of slip in the bucket; forBatch uses the dry
 * powder weight that went into the batch, when it is known.
 * Within 0.005 of the target counts as on target (a 100 ml cup on a 1 g scale
 * cannot read finer than that).
 */
export function correction(measuredSG: number, targetSG: number, density = CLAY_DENSITY, dryGrams?: number): Correction | null {
  if (!sgOk(measuredSG, density) || !sgOk(targetSG, density)) return null;
  if (Math.abs(measuredSG - targetSG) < 0.005) return { kind: "ok" };
  const dry = dryGrams && ok(dryGrams) ? dryGrams : null;
  if (measuredSG > targetSG) {
    const perLitre = (1000 * (measuredSG - targetSG)) / (targetSG - 1);
    const forBatch = dry ? waterForSG(dry, targetSG, density)! - waterForSG(dry, measuredSG, density)! : null;
    return { kind: "water", perLitre, forBatch };
  }
  const perLitre = (1000 * (targetSG - measuredSG)) / (1 - targetSG / density);
  const forBatch = dry ? dryForSG(waterForSG(dry, measuredSG, density)!, targetSG, density)! - dry : null;
  return { kind: "powder", perLitre, forBatch };
}

/** Liquid deflocculants as sold; density in g per ml (approximate, varies by maker). */
export const DEFLOCCULANTS = {
  silicate: { label: "Sodium silicate", density: 1.4 },
  darvan: { label: "Darvan or Dispex", density: 1.2 },
} as const;
export type DeflocKey = keyof typeof DEFLOCCULANTS;

/** Starting dose range: 0.25 to 0.5% of the dry clay, as grams, ml and drops. */
export function deflocDose(dryGrams: number, liquidDensity: number) {
  if (!ok(dryGrams, liquidDensity)) return null;
  const at = (pct: number) => {
    const grams = (dryGrams * pct) / 100;
    const ml = grams / liquidDensity;
    return { grams, ml, drops: ml / ML_PER_DROP };
  };
  return { low: at(DEFLOC_LOW_PCT), high: at(DEFLOC_HIGH_PCT) };
}

/**
 * Shrinkage from a line marked on wet clay (100 mm by default) and measured
 * again dry and fired. Drying and total are % of the wet length; firing is %
 * of the dry length. wetPerFired is how much bigger to make the wet piece.
 */
export function shrinkage(dryMm: number, firedMm: number, lineMm = 100) {
  if (!ok(dryMm, firedMm, lineMm) || dryMm > lineMm || firedMm > dryMm) return null;
  return {
    dryingPct: ((lineMm - dryMm) / lineMm) * 100,
    firingPct: ((dryMm - firedMm) / dryMm) * 100,
    totalPct: ((lineMm - firedMm) / lineMm) * 100,
    wetPerFired: lineMm / firedMm,
  };
}

/** Drying shrinkage alone, for when the piece has not been fired yet. */
export function dryingShrinkage(dryMm: number, lineMm = 100): number | null {
  if (!ok(dryMm, lineMm) || dryMm > lineMm) return null;
  return ((lineMm - dryMm) / lineMm) * 100;
}

/** Wet (or mould) size that fires down to the wanted size. */
export function wetSizeFor(firedWantedMm: number, firedMm: number, lineMm = 100): number | null {
  if (!ok(firedWantedMm, firedMm, lineMm) || firedMm > lineMm) return null;
  return (firedWantedMm * lineMm) / firedMm;
}

/** Water absorption: % weight gained by a fired, dry piece after boiling. */
export function absorption(dryGrams: number, boiledGrams: number): number | null {
  if (!ok(dryGrams, boiledGrams) || boiledGrams < dryGrams) return null;
  return ((boiledGrams - dryGrams) / dryGrams) * 100;
}
