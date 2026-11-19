// Hand-worked cases for the slip calculator. Run: node --test scripts/slip/math.test.mts
import { test } from "node:test";
import assert from "node:assert/strict";
import { absorption, batch, correction, deflocDose, dryForSG, dryingShrinkage, sgFromCup, shrinkage, slipSG, waterForSG, wetSizeFor } from "../../lib/slip/math.ts";

const near = (got: number | null | undefined, want: number, tol = 0.01) => {
  assert.ok(typeof got === "number" && Math.abs(got - want) <= tol, `got ${got}, want ${want} ± ${tol}`);
};

test("water for 1 kg of powder at 1.78 (clay 2.6)", () => {
  // 1000 x (1 - 1.78/2.6) / 0.78 = 1000 x 0.315385 / 0.78 = 404.34
  near(waterForSG(1000, 1.78), 404.34);
  const b = batch(1000, 1.78)!;
  near(b.totalGrams, 1404.34);
  near(b.volumeMl, 404.34 + 384.62); // water + 1000/2.6
  near(b.waterPctOfDry, 40.43);
});

test("water for 5 kg at 1.80, and with a different particle density", () => {
  // 5000 x (1 - 1.8/2.6) / 0.8 = 5000 x 0.307692 / 0.8 = 1923.08
  near(waterForSG(5000, 1.8), 1923.08);
  // density 2.5: 1000 x (1 - 1.75/2.5) / 0.75 = 400 exactly
  near(waterForSG(1000, 1.75, 2.5), 400, 1e-9);
});

test("the batch really weighs the target per 100 ml", () => {
  near(slipSG(1000, waterForSG(1000, 1.78)!), 1.78, 1e-9);
  near(dryForSG(404.34, 1.78), 1000, 0.01);
});

test("specific gravity from a 100 ml cup", () => {
  assert.equal(sgFromCup(178), 1.78);
  assert.equal(sgFromCup(182), 1.82);
  assert.equal(sgFromCup(445, 250), 1.78);
});

test("too thick: 182 g per 100 ml, target 1.78", () => {
  // per litre: 1000 x (1.82 - 1.78) / 0.78 = 51.28 ml of water
  const c = correction(1.82, 1.78, 2.6, 5000)!;
  assert.equal(c.kind, "water");
  if (c.kind !== "water") return;
  near(c.perLitre, 51.28);
  // check: (1820 + 51.28) / (1000 + 51.28) = 1.78
  near((1820 + c.perLitre) / (1000 + c.perLitre), 1.78, 1e-9);
  // 5 kg batch: water at 1.78 = 2021.70; at 1.82 = 5000 x 0.3 / 0.82 = 1829.27; add 192.43
  near(c.forBatch, 192.43);
});

test("too thin: 174 g per 100 ml, target 1.78", () => {
  // per litre: 1000 x 0.04 / (1 - 1.78/2.6) = 40 / 0.315385 = 126.83 g of powder
  const c = correction(1.74, 1.78, 2.6, 5000)!;
  assert.equal(c.kind, "powder");
  if (c.kind !== "powder") return;
  near(c.perLitre, 126.83);
  near((1740 + c.perLitre) / (1000 + c.perLitre / 2.6), 1.78, 1e-9);
  // 5 kg batch holds 5000 x (1 - 1.74/2.6) / 0.74 = 2234.93 g water;
  // at 1.78 that water carries 2234.93 x 0.78 / 0.315385 = 5527.37 g; add 527.37
  near(c.forBatch, 527.37, 0.05);
});

test("on target, and per-litre only when the batch is unknown", () => {
  assert.deepEqual(correction(1.78, 1.78), { kind: "ok" });
  assert.deepEqual(correction(1.782, 1.78), { kind: "ok" });
  const c = correction(1.82, 1.78)!;
  assert.equal(c.kind === "water" && c.forBatch, null);
});

test("deflocculant: 0.25 to 0.5% of dry clay", () => {
  // 1 kg dry: 2.5 to 5 g. Sodium silicate at 1.4 g/ml: 1.79 to 3.57 ml, 36 to 71 drops
  const d = deflocDose(1000, 1.4)!;
  near(d.low.grams, 2.5, 1e-9);
  near(d.high.grams, 5, 1e-9);
  near(d.low.ml, 1.786, 0.001);
  near(d.low.drops, 35.7, 0.05);
  near(d.high.drops, 71.4, 0.05);
  // 5 kg, Darvan at 1.2 g/ml: 12.5 to 25 g, 10.42 to 20.83 ml
  const e = deflocDose(5000, 1.2)!;
  near(e.low.grams, 12.5, 1e-9);
  near(e.high.ml, 20.83);
});

test("shrinkage: 100 mm line, 94 dry, 88 fired", () => {
  const s = shrinkage(94, 88)!;
  near(s.dryingPct, 6, 1e-9);
  near(s.firingPct, 6.383, 0.001); // 6 / 94
  near(s.totalPct, 12, 1e-9);
  // a piece wanted 100 mm fired is made 100 / 0.88 = 113.64 mm wet
  near(wetSizeFor(100, 88), 113.64);
  near(wetSizeFor(80, 88), 90.91);
  near(dryingShrinkage(94), 6, 1e-9);
  assert.equal(dryingShrinkage(101), null);
});

test("shrinkage with a line that was not 100 mm", () => {
  const s = shrinkage(141, 132, 150)!;
  near(s.dryingPct, 6, 1e-9);
  near(s.totalPct, 12, 1e-9);
  near(wetSizeFor(100, 132, 150), 113.64);
});

test("absorption: 100 g dry, 104.2 g after boiling", () => {
  near(absorption(100, 104.2), 4.2, 1e-9);
  near(absorption(250, 251), 0.4, 1e-9);
  assert.equal(absorption(100, 100), 0);
});

test("impossible inputs give no answer", () => {
  assert.equal(waterForSG(1000, 1), null); // that is plain water
  assert.equal(waterForSG(1000, 2.6), null); // that is solid clay
  assert.equal(waterForSG(0, 1.78), null);
  assert.equal(waterForSG(NaN, 1.78), null);
  assert.equal(correction(0.9, 1.78), null);
  assert.equal(correction(2.7, 1.78), null);
  assert.equal(shrinkage(101, 88), null); // dry longer than the wet line
  assert.equal(shrinkage(90, 94), null); // fired longer than dry
  assert.equal(absorption(100, 99), null);
  assert.equal(deflocDose(0, 1.4), null);
});
