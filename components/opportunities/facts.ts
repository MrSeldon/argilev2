// One display-ready view of an opportunity, whatever shape it was stored in.
// The data has two generations: structured entries (location object, cost
// object, application object) and an older flat set (location "City, Region,
// Country", cost/duration as strings, funding as a boolean, howToApply). Pages
// and cards read from this so they never render empty sections or "Varies".
// Client-safe.

import type { Opportunity } from "@/lib/types";
import { sourceLabel, sourceUrl, type MapOpportunity } from "@/lib/opportunity-map";

type Loose = Record<string, unknown>;

const PLACEHOLDER = /^(various|varies|n\/?a|tbd|tba|unknown|-|—)\.?$/i;

/** Returns a trimmed string, or undefined for empty / placeholder values. */
export function clean(v: unknown): string | undefined {
  if (typeof v === "number") return String(v);
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s || PLACEHOLDER.test(s)) return undefined;
  return s;
}

export interface Place {
  city?: string;
  region?: string;
  country?: string;
  /** "City, Region" or similar, without the country */
  local?: string;
  /** full human line */
  line: string;
  lat?: number;
  lng?: number;
  approximate?: boolean;
}

export function placeOf(o: Opportunity): Place {
  const loc = (o as unknown as Loose).location;
  if (typeof loc === "string") {
    let s = loc.trim();
    const various = s.match(/^various\s+(.+?)\s+locations?$/i);
    if (various) return { line: `Across ${various[1]}`, local: `Across ${various[1]}` };
    if (/^various/i.test(s)) s = s.replace(/^various\s*/i, "").trim();
    const parts = s.split(",").map((p) => p.trim()).filter(Boolean);
    const country = parts.length > 1 ? parts[parts.length - 1] : undefined;
    const local = parts.length > 1 ? parts.slice(0, -1).join(", ") : parts[0];
    return { city: parts[0], country, local, line: parts.join(", ") };
  }
  const l = (loc || {}) as Loose;
  const city = clean(l.city);
  const region = clean(l.region);
  const country = clean(l.country);
  const c = (l.coordinates || {}) as Loose;
  const local = [city, region].filter(Boolean).join(", ") || undefined;
  return {
    city,
    region,
    country,
    local,
    line: [city, region, country].filter(Boolean).join(", "),
    lat: typeof c.lat === "number" ? c.lat : undefined,
    lng: typeof c.lng === "number" ? c.lng : undefined,
    approximate: l.approximate === true,
  };
}

export function countryOf(o: Opportunity): string | undefined {
  return placeOf(o).country;
}

export interface Fact {
  label: string;
  value: string;
  note?: string;
}

export interface Facts {
  place: Place;
  when?: Fact;
  deadline?: Fact;
  cost?: Fact;
  funding?: Fact;
  housing?: Fact;
  apply?: Fact;
  level?: Fact;
  eligibility?: Fact;
  website?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  lastVerified?: string;
}

function money(n: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${n.toLocaleString("en-US")} ${currency}`;
  }
}

export function factsOf(o: Opportunity): Facts {
  const r = o as unknown as Loose;
  const f: Facts = { place: placeOf(o) };

  // When / duration
  const dur = r.duration;
  const durText = typeof dur === "string" ? clean(dur) : clean((dur as Loose | undefined)?.display);
  const dates = clean(((r.programDates || {}) as Loose).type);
  if (durText) f.when = { label: "Duration", value: durText, note: dates && dates !== "academic" ? titleish(dates) : undefined };

  // Deadline
  const app = (r.application || {}) as Loose;
  const deadline = clean(r.deadline) || clean(app.deadline);
  if (deadline) f.deadline = { label: "Deadline", value: deadline };

  // Cost
  const cost = r.cost;
  if (typeof cost === "string") {
    const c = clean(cost);
    if (c) f.cost = { label: "Cost", value: c };
  } else if (cost && typeof cost === "object") {
    const c = cost as Loose;
    const tuition = clean(c.tuition);
    const est = c.estimate as { low?: number; high?: number; currency?: string } | undefined;
    const range =
      est && typeof est.low === "number" && typeof est.high === "number"
        ? est.low === est.high
          ? money(est.low, est.currency)
          : `${money(est.low, est.currency)} – ${money(est.high, est.currency)}`
        : undefined;
    if (tuition || range) f.cost = { label: "Cost", value: tuition || range!, note: tuition && range ? `About ${range}` : undefined };
  }

  // Funding
  const fund = r.funding;
  const stipend = clean(r.stipend);
  if (fund === true) {
    f.funding = { label: "Funding", value: stipend || "Available" };
  } else if (fund && typeof fund === "object") {
    const fo = fund as Loose;
    const s = clean(fo.stipend);
    const n = clean(fo.notes);
    if (fo.available === true || s) f.funding = { label: "Funding", value: s || "Available", note: n };
  } else if (stipend) {
    f.funding = { label: "Funding", value: stipend };
  }

  // Housing
  const h = r.housing as Loose | undefined;
  if (h && typeof h === "object") {
    const type = clean(h.type);
    const notes = clean(h.notes);
    if (h.included === true) f.housing = { label: "Housing", value: "Included", note: notes || (type ? titleish(type) : undefined) };
    else if (type || notes) f.housing = { label: "Housing", value: type ? titleish(type) : "Not included", note: notes };
  }

  // How to apply
  const howTo = clean(r.howToApply);
  const process = clean(app.process);
  const bits: string[] = [];
  if (app.portfolio === true) bits.push("Portfolio");
  if (typeof app.fee === "number" && app.fee > 0) bits.push(`$${app.fee} fee`);
  if (howTo) f.apply = { label: "How to apply", value: howTo };
  else if (process || bits.length)
    f.apply = { label: "How to apply", value: process ? titleish(process) : bits.join(" · "), note: process && bits.length ? bits.join(" · ") : undefined };

  const level = clean(r.level);
  if (level) f.level = { label: "Level", value: titleish(level) };
  const elig = clean(r.eligibility);
  if (elig) f.eligibility = { label: "Eligibility", value: elig };

  f.website = clean(r.website);
  const m = o as unknown as MapOpportunity;
  const su = r.source ? sourceUrl(m) : undefined;
  if (su && su !== f.website) {
    f.sourceUrl = su;
    f.sourceLabel = sourceLabel(m) === "Source" ? hostOf(su) : sourceLabel(m);
  } else if (su) {
    f.sourceUrl = su;
    f.sourceLabel = hostOf(su);
  }
  f.lastVerified = clean(r.lastVerified);
  return f;
}

function titleish(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** "2026-10-27" -> "27 October 2026" */
export function prettyDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export const STATUS_HIDDEN = "past-2026";

export function isUnconfirmed(o: Opportunity) {
  return o.status === "unconfirmed";
}
export function isPast(o: Opportunity) {
  return o.status === STATUS_HIDDEN;
}

export const TYPE_LABEL: Record<string, string> = {
  school: "School",
  residency: "Residency",
  grant: "Grant",
  scholarship: "Scholarship",
  fellowship: "Fellowship",
  apprenticeship: "Apprenticeship",
  mentorship: "Mentorship",
  workshop: "Workshop",
  internship: "Internship",
  studio: "Studio",
  artist: "Artist",
  gallery: "Gallery",
  supplier: "Supplier",
  materials: "Materials",
  community: "Community",
};

export function typeLabel(t: string) {
  return TYPE_LABEL[t] || titleish(t);
}
