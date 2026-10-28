// Pulls structured hints out of a free-text description ("glossy green that
// breaks brown over texture, cone 10 reduction"). Used to re-rank and to explain
// "why it matches". Works for English plus common Italian/French words.

export interface QueryHints {
  implied: string[]; // glaze families implied by the description (e.g. green breaking brown = celadon)
  surface?: "glossy" | "satin" | "matte";
  colour?: string; // main colour family
  breakColour?: string; // colour where it breaks/thins
  tags: string[];
  cone?: number;
  coneBand?: "low" | "mid" | "high";
  atmosphere?: "reduction" | "oxidation";
  wantsBreak: boolean;
  wantsPool: boolean;
  wantsRun: boolean;
  wantsTexture: boolean;
}

const COLOURS: [string, RegExp][] = [
  ["turquoise", /\b(turquoise|turchese|turquoise)\b/],
  ["green", /\b(green|verde|vert|verte|jade|celadon)\b/],
  ["blue", /\b(blue|blu|bleu|azzurro|cobalt)\b/],
  ["brown", /\b(brown|marrone|marron|brun|bruno|tan|chocolate)\b/],
  ["black", /\b(black|nero|noir|noire)\b/],
  ["rust", /\b(rust|ruggine|rouille|kaki|persimmon)\b/],
  ["red", /\b(red|rosso|rouge|oxblood|crimson)\b/],
  ["white", /\b(white|bianco|blanc|blanche|cream|creamy)\b/],
  ["yellow", /\b(yellow|giallo|jaune|honey|miele)\b/],
  ["amber", /\b(amber|ambra|ambre)\b/],
  ["purple", /\b(purple|viola|violet|plum|lavender)\b/],
  ["pink", /\b(pink|rosa|rose)\b/],
  ["grey", /\b(grey|gray|grigio|gris)\b/],
  ["orange", /\b(orange|arancio|arancione)\b/],
  ["clear", /\b(clear|transparent|trasparente|liner)\b/],
];

const TAGS: [string, RegExp][] = [
  ["celadon", /celadon|seladon/],
  ["tenmoku", /tenmoku|temmoku/],
  ["chun", /\bchun\b|\bjun\b/],
  ["shino", /shino/],
  ["ash", /\bash\b|cenere|cendre|wood.?fire/],
  ["oil spot", /oil.?spot/],
  ["hare's fur", /hare'?s.?fur/],
  ["kaki", /kaki|tomato red|persimmon/],
  ["crystalline", /crystal/],
  ["copper red", /oxblood|copper red|flamb/],
  ["rutile", /rutile|variegat|floating/],
  ["crawl", /crawl|lichen|beading/],
  ["crackle", /crackle|craze|crazing|cavillo/],
  ["majolica", /majolica|maiolica/],
  ["oribe", /oribe/],
];

export function parseQuery(raw: string): QueryHints {
  const q = ` ${raw.toLowerCase()} `;
  const h: QueryHints = { implied: [], tags: [], wantsBreak: false, wantsPool: false, wantsRun: false, wantsTexture: false };

  if (/\b(semi.?gloss|gloss|glossy|shiny|lucid|brillant|brillante|lucido|glassy)\b/.test(q)) h.surface = "glossy";
  if (/\b(satin|satiny|silky|satinato|satiné)\b/.test(q)) h.surface = "satin";
  if (/\b(matte?|matt|opaco|mat|dry|stony|secco)\b/.test(q)) h.surface = "matte";

  // colours: a colour right after break/over/to/into/edges is the break colour
  const found: { fam: string; at: number }[] = [];
  for (const [fam, re] of COLOURS) {
    const m = re.exec(q);
    if (m) found.push({ fam, at: m.index });
  }
  found.sort((a, b) => a.at - b.at);
  for (const f of found) {
    const before = q.slice(Math.max(0, f.at - 28), f.at);
    if (/(break|breaks|breaking|over|to|into|edges?|rims?|thin|where)\s+(\w+\s+)?$/.test(before)) {
      if (!h.breakColour) h.breakColour = f.fam;
    } else if (!h.colour) {
      h.colour = f.fam;
    }
  }
  if (!h.colour && h.breakColour && found.length === 1) {
    // "breaks brown" alone - still a hint, but no main colour
  }

  for (const [t, re] of TAGS) if (re.test(q)) h.tags.push(t);
  if (h.tags.includes("celadon") && !h.colour) h.colour = "green";

  const brownish = ["brown", "rust", "amber", "black"];
  if (h.colour === "green" && h.breakColour && brownish.includes(h.breakColour) && !h.tags.includes("celadon")) h.implied.push("celadon");
  if ((h.colour === "black" || h.colour === "brown") && h.breakColour && ["rust", "brown", "red", "amber"].includes(h.breakColour) && !h.tags.includes("tenmoku"))
    h.implied.push("tenmoku");
  if (h.colour === "blue" && h.breakColour && brownish.includes(h.breakColour) && !h.tags.includes("chun")) h.implied.push("chun");

  const cone = q.match(/(?:cone|c|\^|cono|cône)\s?(0?\d{1,2})\b/);
  if (cone) {
    const s = cone[1];
    h.cone = s.startsWith("0") && s.length > 1 ? -parseInt(s, 10) : parseInt(s, 10);
  }
  if (/low.?fire|earthenware|terracotta|bassa temperatura|basse température/.test(q)) h.coneBand = "low";
  if (/mid.?fire|mid.?range|middle/.test(q)) h.coneBand = "mid";
  if (/high.?fire|stoneware|porcelain|gres|grès|alta temperatura/.test(q)) h.coneBand = "high";
  if (/reduc|riduzione|réduction/.test(q)) h.atmosphere = "reduction";
  if (/oxid|ossidazione|oxydation|electric kiln|electric/.test(q)) h.atmosphere = "oxidation";

  h.wantsBreak = /break|breaks|breaking|edges|rims|thin/.test(q);
  h.wantsPool = /pool|pools|pooling|recess|puddle/.test(q);
  h.wantsRun = /\brun|runs|running|drip|fluid|flow/.test(q);
  h.wantsTexture = /texture|textured|carv|impress|stamp/.test(q);
  return h;
}
