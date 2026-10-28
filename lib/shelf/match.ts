/**
 * Match text printed on a bag, label or receipt line ("Carbonato di calcio 25 kg",
 * "FELDSPATO POTASSICO", "Ossido di ferro rosso") to the app's canonical materials
 * glossary (data/materials/glossary.json), using every name and synonym it lists
 * (English, Italian, French, Spanish, German, …).
 *
 * Pure and dependency-free so it runs in the API route and in plain-node tests.
 */

export interface MatchableMaterial {
  id: string;
  name: string;
  synonyms?: string[];
  syn?: string[];
  group?: string;
}

export interface MatchHit {
  id: string;
  name: string;
  score: number; // 100 exact name/synonym · 70-95 phrase found inside the text · <60 weak
  via: string; // the glossary phrase that matched
}

export const STRONG = 80;

/** Lowercase, strip accents and punctuation, drop quantities, units, codes and packaging words. */
export function normalizeLabel(s: string): string {
  return (
    " " +
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[’'`]/g, " ")
      // quantities with units: 25 kg, 25kg, 1,5 kg, 500 g, 10 lb, 50%, #325, 200 mesh
      .replace(/\b\d+(?:[.,]\d+)?\s*(?:kg|kgs|kilo|kili|chili|g|gr|grammi|grammes|lb|lbs|oz|t|l|ml|%|mesh)\b/g, " ")
      .replace(/#\s*\d+/g, " ")
      .replace(/[^a-z0-9Ѐ-ӿ぀-ヿ一-鿿]+/g, " ")
      // packaging / receipt noise in it, fr, en, rw
      .replace(/\b(?:sacco|sacchi|sacchetto|confezione|conf|pz|pezzi|busta|sac|sachet|paquet|bag|bags|sack|pack|packet|box|qty|qta|qte|ipaki|umufuka|imifuka|n|nr|x)\b/g, " ")
      .replace(/\b\d+\b/g, " ")
      .replace(/\s+/g, " ")
      .trim() +
    " "
  );
}

interface Phrase {
  norm: string; // padded with spaces
  raw: string;
  isName: boolean;
}
interface Entry {
  m: MatchableMaterial;
  phrases: Phrase[];
}

export function buildMatcher(list: MatchableMaterial[]) {
  const entries: Entry[] = list.map((m) => {
    const raw = new Set<string>([m.name, ...(m.synonyms || m.syn || [])]);
    // "Whiting (calcium carbonate)" -> also "Whiting" and "calcium carbonate"
    const paren = m.name.match(/^(.*?)\s*\((.*)\)\s*$/);
    if (paren) {
      raw.add(paren[1]);
      raw.add(paren[2]);
    }
    raw.add(m.id.replace(/-/g, " "));
    const phrases: Phrase[] = [];
    for (const r of raw) {
      const norm = normalizeLabel(r);
      if (norm.trim().length >= 3) phrases.push({ norm, raw: r, isName: r === m.name });
    }
    return { m, phrases };
  });

  /** All candidate materials for a piece of printed text, best first. */
  function candidates(text: string, limit = 5): MatchHit[] {
    const t = normalizeLabel(text);
    const core = t.trim();
    if (!core) return [];
    const tTokens = new Set(core.split(" "));
    const hits: MatchHit[] = [];
    for (const { m, phrases } of entries) {
      let best: MatchHit | null = null;
      for (const p of phrases) {
        const pc = p.norm.trim();
        let sc = 0;
        if (pc === core) sc = 100;
        else if (t.includes(p.norm)) {
          // the whole glossary phrase appears in the printed text; longer = more specific
          const coverage = pc.length / core.length;
          sc = 70 + Math.round(25 * coverage);
        } else if (p.norm.includes(t) && core.length >= 5) {
          // printed text is a fragment of a known phrase ("ossido ferro" vs "ossido di ferro")
          sc = 55 + Math.round(15 * (core.length / pc.length));
        } else {
          const pTokens = pc.split(" ");
          const shared = pTokens.filter((x) => x.length > 2 && tTokens.has(x)).length;
          if (shared) {
            const jaccard = shared / new Set([...pTokens, ...tTokens]).size;
            if (jaccard >= 0.5) sc = Math.round(60 * jaccard);
          }
        }
        if (sc && (!best || sc > best.score || (sc === best.score && pc.length > normalizeLabel(best.via).trim().length))) {
          best = { id: m.id, name: m.name, score: sc, via: p.raw };
        }
      }
      if (best) hits.push(best);
    }
    return hits
      .sort((a, b) => b.score - a.score || normalizeLabel(b.via).length - normalizeLabel(a.via).length || a.name.length - b.name.length)
      .slice(0, limit);
  }

  /** The single best match, or null when nothing is strong or the top two tie. */
  function best(text: string): { hit: MatchHit | null; ambiguous: boolean; alternatives: MatchHit[] } {
    const c = candidates(text, 5);
    const top = c[0];
    if (!top || top.score < STRONG) return { hit: null, ambiguous: false, alternatives: c };
    const second = c[1];
    const tie = second && second.score === top.score && normalizeLabel(second.via).length === normalizeLabel(top.via).length && top.score < 100;
    if (tie) return { hit: null, ambiguous: true, alternatives: c };
    return { hit: top, ambiguous: false, alternatives: c.slice(1) };
  }

  const byId = new Map(list.map((m) => [m.id, m]));
  return { candidates, best, byId };
}

export type Matcher = ReturnType<typeof buildMatcher>;

// ---------------------------------------------------------------- reconcile Claude's reading with the glossary
export interface ReadItem {
  printed: string;
  language: string;
  english: string;
  quantity: number | null;
  unit: string | null;
  candidate_id: string | null;
  confidence: "high" | "medium" | "low";
}

export interface ResolvedItem {
  printed: string;
  language: string;
  quantity: number | null;
  unit: string | null;
  status: "matched" | "unmatched";
  material: { id: string; name: string } | null;
  matchedBy: "synonym" | "claude" | "both" | null;
  suggestions: { id: string; name: string }[];
}

/**
 * Decide each item's material. The glossary's own synonyms win when they match the
 * printed text exactly; Claude's pick (already restricted to glossary ids) is used
 * when the text isn't in the glossary; disagreements and weak guesses come back as
 * "unmatched" with suggestions, so she chooses.
 */
export function resolveItem(item: ReadItem, matcher: Matcher): ResolvedItem {
  const base = { printed: item.printed, language: item.language, quantity: item.quantity, unit: item.unit };
  const fromPrinted = matcher.best(item.printed);
  const fromEnglish = item.english ? matcher.best(item.english) : { hit: null, ambiguous: false, alternatives: [] as MatchHit[] };
  const claude = item.candidate_id ? matcher.byId.get(item.candidate_id) || null : null;
  const pick = (m: { id: string; name: string }) => ({ id: m.id, name: m.name });
  const suggest = (...lists: ({ id: string; name: string } | null | undefined)[][]) => {
    const seen = new Set<string>();
    const out: { id: string; name: string }[] = [];
    for (const l of lists) for (const m of l) if (m && !seen.has(m.id)) (seen.add(m.id), out.push(pick(m)));
    return out.slice(0, 4);
  };

  const p = fromPrinted.hit;
  if (p) {
    if (!claude || claude.id === p.id) return { ...base, status: "matched", material: pick(p), matchedBy: claude ? "both" : "synonym", suggestions: suggest(fromPrinted.alternatives) };
    // Exact synonym, or Claude picked a variant of the same material family (e.g. a specific potash feldspar):
    // keep the glossary's match and offer Claude's pick as an alternative.
    const sameGroup = Boolean(claude.group) && claude.group === matcher.byId.get(p.id)?.group;
    if (p.score === 100 || sameGroup) return { ...base, status: "matched", material: pick(p), matchedBy: "synonym", suggestions: suggest([claude], fromPrinted.alternatives) };
    return { ...base, status: "unmatched", material: null, matchedBy: null, suggestions: suggest([p, claude], fromPrinted.alternatives) };
  }
  if (claude && item.confidence !== "low") {
    const e = fromEnglish.hit;
    if (!e || e.id === claude.id || e.score < 100)
      return { ...base, status: "matched", material: pick(claude), matchedBy: e && e.id === claude.id ? "both" : "claude", suggestions: suggest(e && e.id !== claude.id ? [e] : [], fromPrinted.alternatives) };
    return { ...base, status: "unmatched", material: null, matchedBy: null, suggestions: suggest([claude, e], fromPrinted.alternatives) };
  }
  if (fromEnglish.hit && !claude) return { ...base, status: "matched", material: pick(fromEnglish.hit), matchedBy: "synonym", suggestions: suggest(fromEnglish.alternatives) };
  return { ...base, status: "unmatched", material: null, matchedBy: null, suggestions: suggest([claude], fromPrinted.alternatives, fromEnglish.alternatives) };
}
