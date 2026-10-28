#!/usr/bin/env node
// One-time glaze index builder. Run with `npm run glazes:index` (add --force to
// rebuild even when nothing changed). Never runs on request or during `next build`.
//
// 1. Maps every ingredient in data/glazes/{digitalfire,glazy}.json to a canonical
//    material id from data/materials/glossary.json (reports what it can't match).
// 2. Computes cone range, surface, colour family and a short plain description.
// 3. Embeds the descriptions with Xenova/all-MiniLM-L6-v2 (q8, transformers.js,
//    run locally) and writes int8-quantised vectors.
// Output: data/glaze-index/{recipes.json, vectors.bin, manifest.json, match-report.json}
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { createHash } from "crypto";
import path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data/glaze-index");
const SOURCES = ["data/glazes/digitalfire.json", "data/glazes/glazy.json", "data/materials/glossary.json", "scripts/glazes/build-index.mjs"];
export const MODEL = "Xenova/all-MiniLM-L6-v2";
export const DTYPE = "q8";
const FORCE = process.argv.includes("--force");
const SKIP_EMBED = process.argv.includes("--no-embed");

// ---------------------------------------------------------------- change detection
const hash = createHash("sha256");
for (const f of SOURCES) hash.update(readFileSync(path.join(ROOT, f)));
const sourceHash = hash.digest("hex").slice(0, 16);
const manifestPath = path.join(OUT, "manifest.json");
if (!FORCE && existsSync(manifestPath)) {
  const prev = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (prev.sourceHash === sourceHash && existsSync(path.join(OUT, "vectors.bin"))) {
    console.log(`glaze index is up to date (${prev.count} recipes, hash ${sourceHash}). Use --force to rebuild.`);
    process.exit(0);
  }
}

// ---------------------------------------------------------------- glossary & matching
const glossary = JSON.parse(readFileSync(path.join(ROOT, "data/materials/glossary.json"), "utf8")).materials;
const byId = new Map(glossary.map((g) => [g.id, g]));

const norm = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
const strip = (s) =>
  norm(s)
    .replace(/\([^)]*\)/g, " ")
    .replace(/^x+\s+/, "")
    .replace(/^\d{3,4}_\s*/, "")
    .replace(/\b(solargil|ceradel|peter lavem|carl jager|jager|minerco|comacsa|minasolo|prodesco|crecer|hins)\b.*$/, " ")
    .replace(/\s*-\s*$/, "")
    .replace(/[,;.]+$/, "")
    .replace(/\s+/g, " ")
    .trim();

const synMap = new Map();
for (const g of glossary) {
  for (const s of [g.id, g.name, ...g.synonyms]) {
    for (const k of [norm(s), strip(s)]) if (k && !synMap.has(k)) synMap.set(k, g.id);
  }
}

function colourWord(s) {
  if (/black|negro|noir|nero|preto/.test(s)) return "black";
  if (/yellow|amarel|giall|jaune|amarill|prase/.test(s)) return "yellow";
  if (/red|vermel|rosso|rouge|rojo|crimson|inclusion/.test(s)) return "red";
  if (/blue|azul|celeste|blu|bleu|turquo/.test(s)) return "blue";
  if (/green|verde|vert/.test(s)) return "green";
  if (/pink|rosa|rose/.test(s)) return "pink";
  if (/purple|viola|violet|pansy/.test(s)) return "purple";
  if (/brown|marron|bruno|chocolate/.test(s)) return "brown";
  if (/orange|arancio|tangerine/.test(s)) return "orange";
  return null;
}

const RULES = [
  [/silicon carbide|carborund/, () => "silicon-carbide"],
  [/stain|mason|corante|colorante|pigment/, (s) => { const c = colourWord(s); return c && byId.has("stain-" + c) ? "stain-" + c : "stain"; }],
  [/zircon|zirkon|superpax|ultrox|opax/, () => "zircon"],
  [/limestone|石灰石|白石灰|kalkstein|calcare/, () => "limestone"],
  [/lithium carb|lithi.*carbon|carbonato di litio/, () => "lithium-carbonate"],
  [/frit|fritt|frita|фритт/, (s) => {
    const n = s.match(/\b(\d{4})\b/);
    if (n && byId.has("frit-" + n[1])) return "frit-" + n[1];
    if (/lead|piomb|plomb/.test(s)) return "lead-bisilicate";
    if (/alcal|alkal/.test(s)) return "high-alkaline-frit";
    if (/bor/.test(s)) return "standard-borax-frit";
    return "leadfree-frit";
  }],
  [/neph|nefel|нефелин/, () => "nepheline-syenite"],
  [/spodum|сподумен|lithi/, () => "spodumene"],
  [/feld|felsp|faltsp|veldspa|feltspa|шпат|長石/, (s) => (/sod|natr|albit|\bna\b|na-/.test(s) ? "soda-feldspar" : "potash-feldspar")],
  [/(kaolin|kaolien|caolin|caulim|каолин).*calcin|calcin.*(kaolin|caolin|caulim|каолин)/, () => "calcined-kaolin"],
  [/kaolin|kaolien|caolin|caulim|каолин|カオリン|china.?clay/, () => "kaolin"],
  [/ball ?clay/, () => "ball-clay"],
  [/bentoni/, () => "bentonite"],
  [/wollast|волласт/, () => "wollastonite"],
  [/dolom|доломит/, () => "dolomite"],
  [/talc|talk|тальк|タルク/, (s) => (/calcin/.test(s) ? "calcined-talc" : "talc")],
  [/whiting|kalkspat|chalk|craie|kreide|creta|tiza|calcit|\bмел\b|calcium carb|carbonat.*(calci|chaux|cálcio)|кальци/, () => "whiting"],
  [/zinc|zinco|zink|цинк/, () => "zinc-oxide"],
  [/tin ox|etain|stagno|estano|estanho|zinn/, () => "tin-oxide"],
  [/rutil/, () => "rutile"],
  [/titan/, () => "titanium-dioxide"],
  [/cobalt|kobalt|cobalto/, (s) => (/carb/.test(s) ? "cobalt-carbonate" : "cobalt-oxide")],
  [/copper|cuivre|\brame\b|cobre|kupfer|медь/, (s) => (/carb/.test(s) ? "copper-carbonate" : /red|cupr|rouge|rosso/.test(s) ? "red-copper-oxide" : "black-copper-oxide")],
  [/chrom|cromo/, (s) => (/iron|fer/.test(s) ? "iron-chromate" : "chrome-oxide")],
  [/mangan/, (s) => (/carb/.test(s) ? "manganese-carbonate" : "manganese-dioxide")],
  [/nickel|nichel|niquel/, (s) => (/carb/.test(s) ? "nickel-carbonate" : /green|vert|verde/.test(s) ? "nickel-oxide-green" : "nickel-oxide-black")],
  [/iron|ferro|\bfer\b|hierro|eisen|желез|hemati|magnetit/, (s) => (/black|noir|nero|negro|magnet/.test(s) ? "black-iron-oxide" : /yellow|jaune|giallo|amarill/.test(s) ? "yellow-iron-oxide" : "red-iron-oxide")],
  [/bari|baryum/, (s) => (/sulf|solf/.test(s) ? "barium-sulfate" : "barium-carbonate")],
  [/stronti/, () => "strontium-carbonate"],
  [/lithium|litio/, () => "lithium-carbonate"],
  [/magnes/, () => "magnesium-carbonate"],
  [/bone|cendre d'os|hueso|\bossa\b|phosphat|fosfat/, () => "bone-ash"],
  [/gerstley/, () => "gerstley-borate"],
  [/colemanit/, () => "colemanite"],
  [/ulexit|улексит/, () => "ulexite"],
  [/borax|borace/, () => "borax"],
  [/boric|borico|borique/, () => "boric-acid"],
  [/\bash\b|ashes|cenere|cendre|ceniza|asche|灰/, (s) =>
    /volcan|vulcan/.test(s) ? "volcanic-ash" : /straw|rice|grass|paglia|paille|藁/.test(s) ? "straw-ash" : /soft|pine|pino/.test(s) ? "softwood-ash" : /hard|oak|beech|quercia/.test(s) ? "hardwood-ash" : "wood-ash"],
  [/silic|quartz|quarz|cuarzo|кварц|flint|珪石|silex/, () => "silica"],
  [/alumin/, (s) => (/hydr/.test(s) ? "alumina-hydrate" : "calcined-alumina")],
  [/red clay|terracotta|earthenware|arcilla roja|argila vermelha/, () => "red-clay"],
  [/fire ?clay/, () => "fireclay"],
  [/slip/, () => "engobe"],
  [/clay|argil|arcilla|argile|глина/, () => "stoneware-clay"],
  [/soda ash|sodium carb/, () => "soda-ash"],
  [/granit/, () => "granite"],
  [/basalt/, () => "basalt"],
  [/pumice|pomice|ponce/, () => "pumice"],
  [/ochre|ocre|ocra/, () => "yellow-ochre"],
  [/\blime\b|calce|chaux/, () => "lime-slaked"],
];

const matchStats = { exact: 0, rule: 0, unmatched: 0 };
const unmatched = new Map();
const ruleMatched = new Map();
const matchCache = new Map();
function matchMaterial(name) {
  if (matchCache.has(name)) return matchCache.get(name);
  let res = null;
  const n = norm(name);
  const st = strip(name);
  if (synMap.has(n)) res = { id: synMap.get(n), how: "exact" };
  else if (st && synMap.has(st)) res = { id: synMap.get(st), how: "exact" };
  else {
    for (const [re, fn] of RULES) {
      if (re.test(n)) {
        const id = fn(n);
        if (id && byId.has(id)) { res = { id, how: "rule" }; break; }
      }
    }
  }
  matchCache.set(name, res);
  return res;
}

// ---------------------------------------------------------------- recipe helpers
function parseConeToken(t) {
  t = t.trim().replace(/[^\d/ .]/g, "").trim();
  if (!t) return null;
  let v;
  const half = /1\/2/.test(t);
  const base = t.replace(/\s*1\/2/, "").trim();
  if (/^0\d/.test(base)) v = -parseInt(base, 10) + (half ? -0.5 : 0); // 05 1/2 sits between 06 and 05
  else v = parseInt(base, 10) + (half ? 0.5 : 0);
  return Number.isFinite(v) ? v : null;
}
function parseCone(s) {
  if (!s) return null;
  const parts = String(s).split(/\s*[-–]\s*/).map(parseConeToken).filter((x) => x !== null);
  if (!parts.length) return null;
  return [Math.min(...parts), Math.max(...parts)];
}
export const coneLabel = (v) => (v < 0 ? "0" + String(-v).replace(".5", "½") : String(v).replace(".5", "½"));

function normSurface(s, r) {
  const t = (s || "").toLowerCase();
  if (t.includes("semi-glossy")) return "semi-glossy";
  if (t.includes("glossy") || t.includes("gloss")) return "glossy";
  if (t.includes("satin")) return "satin";
  if (t.includes("semi-matte")) return "semi-matte";
  if (t.includes("dry") || t.includes("stony")) return "dry matte";
  if (t.includes("matte") || t.includes("matt")) return "matte";
  if (t.includes("crystal")) return "glossy";
  const hint = `${r.name || ""} ${r.subtype || ""}`.toLowerCase();
  if (/semi.?matte?/.test(hint)) return "semi-matte";
  if (/satin/.test(hint)) return "satin";
  if (/matte?\b|mat\b/.test(hint)) return "matte";
  if (/gloss|clear|transparent|celadon|crystalline/.test(hint)) return "glossy";
  return "";
}

function oxides(ings) {
  // fired oxide weight % of the whole batch (base + additions), LOI removed
  const ox = {};
  let unknown = 0;
  for (const [id, pct] of ings) {
    const g = id && byId.get(id);
    if (!g || !g.analysis) { unknown += pct; continue; }
    for (const [k, v] of Object.entries(g.analysis)) {
      if (k === "LOI" || k === "SO3") continue;
      ox[k] = (ox[k] || 0) + (pct * v) / 100;
    }
  }
  return { ox, unknown };
}

const FAMILY_WORDS = {
  clear: "clear", white: "white", green: "green", blue: "blue", turquoise: "turquoise", brown: "brown",
  black: "black", red: "red", yellow: "yellow", amber: "amber", purple: "purple", pink: "pink",
  grey: "grey", orange: "orange", rust: "rust", variegated: "variegated",
};

function classify(r, ox, ingIds, atm, surface) {
  const st = (r.subtype || "").toLowerCase();
  const nm = (r.name || "").toLowerCase();
  const txt = `${nm} ${st} ${(r.description || "").toLowerCase().slice(0, 200)}`;
  const tags = [];
  const tagRe = [["celadon", /celadon|seiji/], ["chun", /\bchun\b|jun\b/], ["tenmoku", /tenmoku|temmoku/], ["kaki", /kaki|tomato red/],
    ["oil spot", /oil.?spot/], ["hare's fur", /hare'?s fur|tessha/], ["tea dust", /tea.?dust/], ["shino", /shino/], ["ash", /\bash\b|nuka/],
    ["oribe", /oribe/], ["copper red", /oxblood|flamb|peach bloom|copper red|sang de boeuf/], ["crystalline", /crystalline|aventurine/],
    ["crawl", /crawl/], ["crackle", /crackle|craze/], ["raku", /raku/], ["majolica", /majolica|maiolica/], ["slip-based", /slip.?based|albany|alberta|ravenscrag|barnard/],
    ["magnesium matte", /magnesium matte|mag matte/], ["floating blue", /floating blue/], ["metallic", /metallic|lustre|luster/], ["rutile", /rutile/]];
  for (const [t, re] of tagRe) if (re.test(txt)) tags.push(t);
  if (ingIds.some((id) => byId.get(id)?.kind === "local" && /ash/.test(id))) { if (!tags.includes("ash")) tags.push("ash"); }

  const Fe = ox.Fe2O3 || 0, Cu = ox.CuO || 0, Co = ox.CoO || 0, Cr = ox.Cr2O3 || 0, Mn = ox.MnO || 0, Ni = ox.NiO || 0,
    Ti = ox.TiO2 || 0, Sn = ox.SnO2 || 0, Zr = ox.ZrO2 || 0;
  const red = atm.includes("reduction");
  let fam = null;
  const sub = st.replace(/^glaze\s*-\s*/, "");
  if (/celadon - blue|chun/.test(sub)) fam = "blue";
  else if (/celadon - yellow/.test(sub)) fam = "yellow";
  else if (/celadon/.test(sub)) fam = "green";
  else if (/tenmoku|oil spot|hare|tea dust/.test(sub)) fam = "black";
  else if (/kaki|tomato/.test(sub)) fam = "rust";
  else if (/amber/.test(sub)) fam = "amber";
  else if (/^clear/.test(sub)) fam = "clear";
  else if (/^white/.test(sub)) fam = "white";
  else if (/^turquoise/.test(sub)) fam = "turquoise";
  else if (/^blue/.test(sub)) fam = "blue";
  else if (/^green/.test(sub)) fam = "green";
  else if (/^red - pink/.test(sub)) fam = "pink";
  else if (/^red/.test(sub)) fam = "red";
  else if (/^black/.test(sub)) fam = "black";
  else if (/^purple/.test(sub)) fam = "purple";
  else if (/^yellow/.test(sub)) fam = "yellow";
  else if (/grey|gray|charcoal/.test(sub)) fam = "grey";
  else if (/^shino/.test(sub)) fam = "orange";
  if (!fam) {
    const w = [["turquoise", /turquoise|turq/], ["green", /green|celadon|verde|vert\b|oribe|jade/], ["blue", /blue|cobalt|bleu|blu\b|chun/],
      ["black", /black|tenmoku|temmoku|noir|nero/], ["rust", /rust|kaki|tomato/], ["red", /\bred\b|oxblood|rouge|rosso|flambe/],
      ["white", /white|blanc|bianco|snow|cream/], ["yellow", /yellow|honey|giallo/], ["amber", /amber/], ["purple", /purple|violet|plum/],
      ["pink", /pink|rose\b/], ["brown", /brown|tea\b|chocolate/], ["orange", /orange|shino/], ["grey", /grey|gray/], ["clear", /clear|transparent/]];
    for (const [f, re] of w) if (re.test(nm)) { fam = f; break; }
  }
  if (!fam) {
    const stainIds = ingIds.filter((id) => byId.get(id)?.kind === "stain");
    if (Co >= 0.15) fam = "blue";
    else if (Cu >= 0.3) fam = red && Sn >= 0.3 && Cu < 1.5 ? "red" : "green";
    else if (Cr >= 0.15) fam = "green";
    else if (Fe >= 8) fam = "black";
    else if (Fe >= 4) fam = "brown";
    else if (Fe >= 0.6) fam = red ? "green" : "amber";
    else if (Mn >= 3) fam = "brown";
    else if (Ni >= 0.5) fam = "grey";
    else if (stainIds.length) { const c = stainIds[0].replace("stain-", ""); fam = FAMILY_WORDS[c] ? c : "variegated"; }
    else if (Ti >= 4) fam = "variegated";
    else if (Sn + Zr >= 4 || Ti >= 7) fam = "white";
    else if (/matte|satin|dry/.test(surface)) fam = "white";
    else fam = "clear";
  }
  if (fam === "green" && Fe >= 0.5 && Fe < 4 && red && !tags.includes("celadon") && Cu < 0.3 && Cr < 0.1) tags.push("celadon");
  if (fam === "black" && Fe >= 7 && !tags.some((t) => ["tenmoku", "oil spot", "hare's fur", "tea dust"].includes(t))) tags.push("tenmoku");
  return { fam, tags };
}

function colourantPhrase(ox, ingIds) {
  const parts = [];
  const add = (k, label) => { if ((ox[k] || 0) >= 0.1) parts.push(`${label} ${round1(ox[k])}%`); };
  add("Fe2O3", "iron"); add("CuO", "copper"); add("CoO", "cobalt"); add("Cr2O3", "chrome"); add("MnO", "manganese");
  add("NiO", "nickel"); if ((ox.TiO2 || 0) >= 1) parts.push(`titanium/rutile ${round1(ox.TiO2)}%`);
  if ((ox.SnO2 || 0) >= 1) parts.push(`tin ${round1(ox.SnO2)}%`);
  if ((ox.ZrO2 || 0) >= 2) parts.push(`zircon opacifier`);
  const stains = [...new Set(ingIds.filter((id) => byId.get(id)?.kind === "stain").map((id) => byId.get(id).name.toLowerCase()))];
  for (const s of stains) parts.push(s);
  return parts;
}
const round1 = (x) => Math.round(x * 10) / 10;

function behaviour(fam, tags, ox, surface, transp, cone, atm, notes) {
  const out = [];
  const Fe = ox.Fe2O3 || 0, Ti = ox.TiO2 || 0, Cu = ox.CuO || 0, Co = ox.CoO || 0;
  const glossy = /glossy|semi-glossy|^$/.test(surface);
  const trans = /transparent|translucent/i.test(transp);
  const Cr = ox.Cr2O3 || 0;
  const red = atm.includes("reduction");
  if (tags.includes("celadon") || (fam === "green" && Fe >= 0.5 && Fe < 4 && Cu < 0.3 && Cr < 0.1 && red)) {
    out.push("pools deeper green in recesses and thins to lighter or brown over edges and texture");
  } else if (tags.includes("tenmoku") || (fam === "black" && Fe >= 6)) {
    out.push("breaks to rust-brown on rims, edges and over texture, black-brown where thick");
  } else if (tags.includes("kaki") || fam === "rust") {
    out.push("iron-saturated: rust red where thick, breaks darker brown or black where thin");
  } else if (Fe >= 2 && glossy) {
    out.push("breaks brown where thin over edges and texture, darker where it pools");
  }
  if (tags.includes("chun")) out.push("milky blue where thick, breaks brown or clear on edges");
  if (Ti >= 3 || tags.includes("rutile")) out.push("variegated rutile streaks; breaks and mottles over texture");
  if (Cu >= 0.3 && fam === "green" && trans) out.push("copper green pools darker in recesses");
  if (Cu >= 0.3 && fam === "red") out.push("copper red that can go clear or green on rims");
  if (Co >= 0.15 && trans) out.push("cobalt blue pools darker in recesses");
  if (tags.includes("ash")) out.push("ash texture: runs in rivulets and pools glassy where thick");
  if (tags.includes("shino")) out.push("carbon trap and orange flashing where thin");
  if (tags.includes("oil spot")) out.push("metallic spots form where it is thick");
  if (tags.includes("hare's fur")) out.push("streaks into fine hare's-fur lines as it runs");
  if (tags.includes("crawl")) out.push("crawls into beads, a lichen-like surface");
  if (tags.includes("crackle")) out.push("crackle / craze pattern");
  if (tags.includes("crystalline")) out.push("grows crystals; very fluid, use a catch tray");
  if (/matte|dry|satin/.test(surface) && !out.length) out.push("stays put with little movement; softens texture rather than pooling");
  if (trans && glossy && !out.length && fam !== "clear" && fam !== "white") out.push("pools darker in recesses and thins over edges");
  if (/runs?\b|runny|fluid|drips?/.test(notes) && !out.some((o) => /runs|fluid/.test(o))) out.push("can run - fluid when thick");
  return out;
}

function noteSnippet(text, n = 220) {
  if (!text) return "";
  const t = String(text).replace(/\s+/g, " ").replace(/https?:\/\/\S+/g, "").trim();
  if (t.length <= n) return t;
  const cut = t.slice(0, n);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return (end > 80 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "") + "…").trim();
}

function atmosphereOf(a) {
  const t = (a || "").toLowerCase();
  const xs = [];
  if (t.includes("oxidation")) xs.push("oxidation");
  if (t.includes("reduction")) xs.push("reduction");
  if (t.includes("neutral")) xs.push("neutral");
  if (t.includes("salt") || t.includes("soda")) xs.push("salt/soda");
  if (t.includes("wood")) xs.push("wood");
  if (t.includes("raku")) xs.push("raku");
  if (t.includes("luster")) xs.push("luster");
  return xs;
}

// ---------------------------------------------------------------- process recipes
const df = JSON.parse(readFileSync(path.join(ROOT, "data/glazes/digitalfire.json"), "utf8"));
const gz = JSON.parse(readFileSync(path.join(ROOT, "data/glazes/glazy.json"), "utf8"));
const all = [
  ...df.recipes.map((r) => ({ ...r, _src: "df" })),
  ...gz.recipes.map((r) => ({ ...r, _src: "gz" })),
];

const matIndex = new Map();
const matList = [];
const midx = (id) => {
  if (!matIndex.has(id)) { matIndex.set(id, matList.length); matList.push(id); }
  return matIndex.get(id);
};

const recipes = [];
const texts = [];
let skipped = 0;
for (const r of all) {
  const ingsRaw = (r.ingredients || []).filter((i) => i && i.material && Number(i.amount) > 0);
  const addsRaw = (r.additionals || []).filter((i) => i && i.material && Number(i.amount) > 0);
  if (!ingsRaw.length) { skipped++; continue; }
  const baseSum = ingsRaw.reduce((s, i) => s + Number(i.amount), 0);
  const rows = [];
  const mapRow = (i, isAdd) => {
    const mres = matchMaterial(i.material);
    if (mres) {
      matchStats[mres.how]++;
      if (mres.how === "rule") ruleMatched.set(`${i.material} → ${mres.id}`, (ruleMatched.get(`${i.material} → ${mres.id}`) || 0) + 1);
    } else {
      matchStats.unmatched++;
      unmatched.set(i.material, (unmatched.get(i.material) || 0) + 1);
    }
    const pct = (Number(i.amount) / baseSum) * 100;
    const g = mres && byId.get(mres.id);
    const keepName = !g || norm(g.name) !== norm(i.material);
    // [materialIndex or -1, percent (base normalised to 100; additions as % of base), add?1:0, original name?]
    const row = [mres ? midx(mres.id) : -1, Math.round(pct * 100) / 100, isAdd ? 1 : 0];
    if (keepName) row.push(i.material);
    rows.push(row);
    return mres ? mres.id : null;
  };
  const ids = [...ingsRaw.map((i) => mapRow(i, false)), ...addsRaw.map((i) => mapRow(i, true))];
  const pctIds = rows.map((row, k) => [ids[k], row[1]]);
  const { ox, unknown } = oxides(pctIds);
  const atmList = atmosphereOf(r.atmosphere);
  const cone = parseCone(r.cone);
  const surface = normSurface(r.surface, r);
  const transp = (r.transparency || "").toLowerCase();
  const notesText = `${r.description || ""} ${r.notes || ""}`;
  const { fam, tags } = classify(r, ox, ids.filter(Boolean), atmList, surface);
  const colourants = colourantPhrase(ox, ids.filter(Boolean));
  const beh = behaviour(fam, tags, ox, surface, transp, cone, atmList, notesText.toLowerCase());

  const name = (r.name || "").trim() || (r.subtype ? `${r.subtype.replace(/^Glaze\s*-\s*/, "")} (Glazy ${r.id})` : `Glazy recipe ${r.id}`);
  const famTag = tags.find((t) => ["celadon", "tenmoku", "chun", "kaki", "shino", "oribe", "oil spot", "hare's fur", "tea dust", "copper red", "crystalline", "majolica"].includes(t));
  const head = [surface ? surface[0].toUpperCase() + surface.slice(1) : "", fam === "clear" ? "clear" : fam, famTag || (tags.includes("ash") ? "ash" : ""), "glaze"]
    .filter(Boolean).join(" ").replace(/^./, (c) => c.toUpperCase());
  const conePart = cone ? (cone[0] === cone[1] ? `cone ${coneLabel(cone[0])}` : `cone ${coneLabel(cone[0])}–${coneLabel(cone[1])}`) : "cone not recorded";
  const sentences = [];
  sentences.push(`${head}${transp ? `, ${transp}` : ""}.`);
  if (colourants.length) sentences.push(`Colour from ${colourants.join(", ")}.`);
  if (beh.length) sentences.push(`${beh[0][0].toUpperCase()}${beh[0].slice(1)}${beh[1] ? `; ${beh[1]}` : ""}.`);
  sentences.push(`Fires at ${conePart}${atmList.length ? `, ${atmList.join(" or ")}` : ""}.`);
  const desc = sentences.join(" ");
  const note = noteSnippet(r._src === "df" ? r.description || r.notes : r.description);

  const rec = {
    c: r.code,
    s: r._src,
    n: name,
    d: desc,
    f: fam,
    sf: surface || undefined,
    tr: transp || undefined,
    at: atmList.length ? atmList : undefined,
    cn: cone || undefined,
    cs: r.cone || undefined,
    st: r.subtype ? r.subtype.replace(/^Glaze\s*-\s*/, "") : undefined,
    tg: tags.length ? tags : undefined,
    i: rows,
    nt: note || undefined,
    by: r.createdBy || undefined,
    u: r.url,
  };
  if (r._src === "df" && r.notes) rec.nl = noteSnippet(r.notes, 600);
  recipes.push(rec);
  // Embedding text: the plain description plus name/subtype/tags and a little of the source notes.
  texts.push(`${name}. ${rec.st ? rec.st + ". " : ""}${desc} ${tags.length ? tags.join(", ") + "." : ""} ${noteSnippet(notesText, 160)}`.trim());
}

mkdirSync(OUT, { recursive: true });
const unmatchedSorted = [...unmatched.entries()].sort((a, b) => b[1] - a[1]);
const ruleSorted = [...ruleMatched.entries()].sort((a, b) => b[1] - a[1]);
const totalRows = matchStats.exact + matchStats.rule + matchStats.unmatched;
const report = {
  totalIngredientRows: totalRows,
  exact: matchStats.exact,
  byRule: matchStats.rule,
  unmatchedRows: matchStats.unmatched,
  unmatchedDistinctNames: unmatchedSorted.length,
  matchedPercent: Math.round(((matchStats.exact + matchStats.rule) / totalRows) * 10000) / 100,
  unmatched: unmatchedSorted.map(([name, count]) => ({ name, count })),
  ruleMatches: ruleSorted.map(([pair, count]) => ({ pair, count })),
};
writeFileSync(path.join(OUT, "match-report.json"), JSON.stringify(report, null, 1));
console.log(`recipes: ${recipes.length} (skipped ${skipped} without ingredients)`);
console.log(`ingredient rows: ${totalRows}; exact ${matchStats.exact}, by rule ${matchStats.rule}, unmatched ${matchStats.unmatched} (${unmatchedSorted.length} distinct names)`);
console.log("top unmatched:", unmatchedSorted.slice(0, 25).map(([n, c]) => `${n} (${c})`).join("; "));

writeFileSync(path.join(OUT, "recipes.json"), JSON.stringify({ v: 1, materials: matList, recipes }));

// ---------------------------------------------------------------- embeddings
if (SKIP_EMBED) { console.log("--no-embed: skipping vectors"); process.exit(0); }
const { pipeline } = await import("@huggingface/transformers");
const extractor = await pipeline("feature-extraction", MODEL, { dtype: DTYPE });
const DIM = 384;
const N = texts.length;
const q = new Int8Array(N * DIM);
const scales = new Float32Array(N);
const B = 64;
const t0 = Date.now();
for (let s = 0; s < N; s += B) {
  const batch = texts.slice(s, s + B);
  const out = await extractor(batch, { pooling: "mean", normalize: true });
  const data = out.data;
  for (let k = 0; k < batch.length; k++) {
    let mx = 1e-9;
    for (let d = 0; d < DIM; d++) mx = Math.max(mx, Math.abs(data[k * DIM + d]));
    const sc = mx / 127;
    scales[s + k] = sc;
    for (let d = 0; d < DIM; d++) q[(s + k) * DIM + d] = Math.round(data[k * DIM + d] / sc);
  }
  if ((s / B) % 20 === 0) process.stdout.write(`  embedded ${Math.min(s + B, N)}/${N} (${((Date.now() - t0) / 1000).toFixed(0)}s)\n`);
}
// layout: [N float32 scales][N*DIM int8]
const buf = Buffer.alloc(N * 4 + N * DIM);
Buffer.from(scales.buffer).copy(buf, 0);
Buffer.from(q.buffer).copy(buf, N * 4);
writeFileSync(path.join(OUT, "vectors.bin"), buf);
writeFileSync(
  manifestPath,
  JSON.stringify({ sourceHash, model: MODEL, dtype: DTYPE, dim: DIM, count: N, pooling: "mean", normalize: true, layout: "float32 scales[count] then int8 vectors[count*dim]", builtAt: new Date().toISOString(), match: { matchedPercent: report.matchedPercent, unmatchedRows: report.unmatchedRows, unmatchedDistinctNames: report.unmatchedDistinctNames } }, null, 1)
);
console.log(`vectors: ${N} x ${DIM} int8 written in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
