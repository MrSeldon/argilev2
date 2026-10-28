// Unit tests for the label -> glossary matcher. Run: node --test scripts/shelf/match.test.mts
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildMatcher, normalizeLabel, resolveItem, type ReadItem } from "../../lib/shelf/match.ts";

const glossary = JSON.parse(readFileSync(new URL("../../data/materials/glossary.json", import.meta.url), "utf8")).materials;
const m = buildMatcher(glossary);
const id = (t: string) => m.best(t).hit?.id ?? null;

test("normalizes quantities, units and accents", () => {
  assert.equal(normalizeLabel("Carbonato di calcio 25 kg").trim(), "carbonato di calcio");
  assert.equal(normalizeLabel("FELDSPATH POTASSIQUE – sac 25kg").trim(), "feldspath potassique");
  assert.equal(normalizeLabel("Óxido de hierro rojo 1,5 kg").trim(), "oxido de hierro rojo");
});

const cases: [string, string][] = [
  ["Carbonato di calcio 25 kg", "whiting"],
  ["Feldspato potassico", "potash-feldspar"],
  ["Ossido di ferro rosso", "red-iron-oxide"],
  ["Cenere di legna", "wood-ash"],
  ["CAOLINO 25KG", "kaolin"],
  ["Quarzo macinato sacco 25 kg", "silica"],
  ["Feldspath potassique", "potash-feldspar"],
  ["Carbonate de calcium", "whiting"],
  ["Red iron oxide 1 lb", "red-iron-oxide"],
  ["Wood ash", "wood-ash"],
];
for (const [text, want] of cases) test(`"${text}" -> ${want}`, () => assert.equal(id(text), want));

test("unknown text is not matched", () => {
  assert.equal(id("Spedizione corriere"), null);
  assert.equal(id("Totale IVA inclusa"), null);
  assert.equal(id("Umufuka w'ibumba"), null); // Kinyarwanda "bag of clay": too vague for the glossary
});

const item = (over: Partial<ReadItem>): ReadItem => ({ printed: "", language: "it", english: "", quantity: null, unit: null, candidate_id: null, confidence: "high", ...over });

test("resolve: glossary synonym wins and agrees with Claude", () => {
  const r = resolveItem(item({ printed: "Carbonato di calcio", english: "calcium carbonate", candidate_id: "whiting", quantity: 25, unit: "kg" }), m);
  assert.equal(r.status, "matched");
  assert.equal(r.material?.id, "whiting");
  assert.equal(r.matchedBy, "both");
  assert.equal(r.quantity, 25);
});

test("resolve: Claude's pick is used when the printed text is not in the glossary", () => {
  const r = resolveItem(item({ printed: "Calce idrata", english: "slaked lime", candidate_id: "lime-slaked" }), m);
  assert.equal(r.status, "matched");
  assert.equal(r.material?.id, "lime-slaked");
});

test("resolve: low-confidence guess without a synonym is unmatched, with suggestions", () => {
  const r = resolveItem(item({ printed: "Miscela speciale MX-4", english: "special blend", candidate_id: "silica", confidence: "low" }), m);
  assert.equal(r.status, "unmatched");
  assert.equal(r.material, null);
  assert.ok(r.suggestions.some((s) => s.id === "silica"));
});

test("resolve: an id Claude invents is ignored", () => {
  const r = resolveItem(item({ printed: "Pigmento blu", english: "blue pigment", candidate_id: "not-a-material" }), m);
  assert.notEqual(r.material?.id, "not-a-material");
});

test("resolve: a variant of the same family keeps the glossary match, Claude's pick offered", () => {
  const r = resolveItem(item({ printed: "Feldspato potassico F20", english: "potash feldspar", candidate_id: "italian-feldspar-k", confidence: "medium" }), m);
  assert.equal(r.status, "matched");
  assert.equal(r.material?.id, "potash-feldspar");
  assert.ok(r.suggestions.some((s) => s.id === "italian-feldspar-k"));
});

test("resolve: Kinyarwanda name with Claude's pick", () => {
  const r = resolveItem(item({ printed: "IVU RY'IBITI", language: "rw", english: "wood ash", candidate_id: "wood-ash", confidence: "medium", quantity: 2, unit: "kg" }), m);
  assert.equal(r.material?.id, "wood-ash");
});

test("resolve: printed synonym and Claude disagree across families -> unmatched with both", () => {
  const r = resolveItem(item({ printed: "Carbonato di calcio e magnesio", english: "dolomite", candidate_id: "dolomite", confidence: "high" }), m);
  assert.equal(r.status, "unmatched");
  assert.deepEqual(r.suggestions.slice(0, 2).map((s) => s.id).sort(), ["dolomite", "whiting"]);
});
