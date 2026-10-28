"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ConeBand } from "@/lib/glazes/types";
import { CONE_BANDS, coneText } from "@/lib/glazes/types";
import { searchGlossary, useGlossary, useShelf, type SlimMaterial } from "./useShelf";
import { Swatch } from "./Swatch";
import { ShelfIntake } from "./ShelfIntake";
import { ShelfSyncNote } from "./ShelfSyncNote";

interface ShelfResult {
  total: number;
  makeableCount: number;
  makeable: { code: string; name: string; family: string; surface?: string; cone?: [number, number] }[];
  oneAway: {
    key: string;
    id: string;
    label: string;
    unlocks: number;
    kind?: string;
    variable?: boolean;
    examples: { code: string; name: string; family: string; cone?: [number, number] }[];
  }[];
}

const KIND_LABEL: Record<string, string> = {
  silica: "Silica",
  clay: "Clays & kaolins",
  "slip-clay": "Slip clays",
  feldspar: "Feldspars & stones",
  flux: "Fluxes",
  frit: "Frits",
  colorant: "Colourants",
  opacifier: "Opacifiers",
  stain: "Stains",
  refractory: "Alumina & refractories",
  local: "Local & variable",
  additive: "Additives",
};

const STARTER = ["silica", "kaolin", "potash-feldspar", "whiting", "dolomite", "talc", "zinc-oxide", "red-iron-oxide", "bentonite", "wood-ash", "lime-slaked", "wild-clay"];

export function Shelf() {
  const glossary = useGlossary();
  const { shelf, loaded, add, remove, clear } = useShelf();
  const [q, setQ] = useState("");
  const [band, setBand] = useState<ConeBand>("any");
  const [res, setRes] = useState<ShelfResult | null>(null);
  const [busy, setBusy] = useState(false);
  const byId = useMemo(() => new Map((glossary || []).map((m) => [m.id, m])), [glossary]);
  const suggestions = useMemo(() => (glossary ? searchGlossary(glossary, q, 8) : []), [glossary, q]);

  useEffect(() => {
    if (!loaded) return;
    let alive = true;
    setBusy(true);
    const t = setTimeout(() => {
      fetch("/api/glazes/shelf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shelf, band }),
      })
        .then((r) => r.json())
        .then((d) => alive && setRes(d))
        .catch(() => {})
        .finally(() => alive && setBusy(false));
    }, 150);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [shelf, band, loaded]);

  const grouped = useMemo(() => {
    const g = new Map<string, SlimMaterial[]>();
    for (const id of shelf) {
      const m = byId.get(id);
      if (!m) continue;
      const arr = g.get(m.kind) || [];
      arr.push(m);
      g.set(m.kind, arr);
    }
    return [...g.entries()].sort((a, b) => Object.keys(KIND_LABEL).indexOf(a[0]) - Object.keys(KIND_LABEL).indexOf(b[0]));
  }, [shelf, byId]);

  return (
    <div className="space-y-10">
      {/* add */}
      <section>
        <label htmlFor="shelf-search" className="block font-serif text-heading-lg mb-2">
          Add what’s on your shelf
        </label>
        <p className="text-body-sm text-warm-500 mb-3">Search in English, Italian or French - “carbonato di calcio”, “feldspath”, “cenere”.</p>
        <input
          id="shelf-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search materials…"
          autoComplete="off"
          className="w-full p-3 text-body-md bg-white border border-warm-200 focus:outline-none focus:border-charcoal"
        />
        {q && (
          <ul className="mt-1 border border-warm-100 bg-white divide-y divide-warm-50">
            {suggestions.length === 0 && <li className="p-3 text-body-sm text-warm-500">No material found for “{q}”.</li>}
            {suggestions.map(({ m, via }) => {
              const on = shelf.includes(m.id);
              return (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => {
                      on ? remove(m.id) : add(m.id);
                      setQ("");
                    }}
                    className="w-full text-left p-3 flex items-center justify-between gap-3 hover:bg-warm-50"
                  >
                    <span>
                      <span className="text-body-md">{m.name}</span>
                      {via && <span className="block text-caption text-warm-500">also called “{via}”</span>}
                      {m.variable && <span className="block text-caption text-amber-700">variable: test tile first</span>}
                    </span>
                    <span className={`text-caption uppercase tracking-wider shrink-0 ${on ? "text-glaze-700" : "text-warm-500"}`}>{on ? "✓ on shelf" : "+ add"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <ShelfIntake />
        {loaded && shelf.length === 0 && (
          <button type="button" onClick={() => STARTER.forEach(add)} className="mt-3 text-body-sm underline text-warm-700">
            Start with a basic studio set (silica, kaolin, feldspar, whiting, wood ash, lime, wild clay…)
          </button>
        )}
      </section>

      {/* shelf */}
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-serif text-heading-lg">My shelf · {shelf.length}</h2>
          {shelf.length > 0 && (
            <button type="button" onClick={() => confirm("Clear your whole shelf?") && clear()} className="text-caption text-warm-500 underline">
              Clear
            </button>
          )}
        </div>
        {shelf.length === 0 ? (
          <p className="text-body-sm text-warm-500">Nothing yet.</p>
        ) : (
          <div className="space-y-4">
            {grouped.map(([kind, ms]) => (
              <div key={kind}>
                <p className="text-caption uppercase tracking-wider text-warm-500 mb-1.5">{KIND_LABEL[kind] || kind}</p>
                <ul className="flex flex-wrap gap-1.5">
                  {ms.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => remove(m.id)}
                        className={`px-2.5 py-1.5 text-body-sm border bg-white ${m.variable ? "border-amber-300" : "border-warm-100"}`}
                        title="Remove from shelf"
                      >
                        {m.name} <span className="text-warm-500 ml-1">×</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {shelf.some((id) => byId.get(id)?.variable) && (
              <p className="text-caption text-amber-700">Outlined materials are variable (ash, lime, wild clay…): recipes use typical analyses - test tile first.</p>
            )}
          </div>
        )}
        <ShelfSyncNote />
      </section>

      {/* cone */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Cone">
        {(["any", "low", "mid", "high"] as ConeBand[]).map((b) => (
          <button
            key={b}
            type="button"
            onClick={() => setBand(b)}
            className={`px-3 py-1.5 text-body-sm border ${band === b ? "bg-charcoal text-cream border-charcoal" : "border-warm-100 text-warm-700 bg-white"}`}
          >
            {b === "any" ? "Any cone" : CONE_BANDS[b].label}
          </button>
        ))}
      </div>

      {/* one away */}
      <section>
        <h2 className="font-serif text-heading-lg mb-1">One material away</h2>
        <p className="text-body-sm text-warm-500 mb-3">The single material that would unlock the most new recipes.</p>
        {!res || busy ? (
          <div className="h-24 bg-warm-50 animate-pulse" />
        ) : res.oneAway.length === 0 ? (
          <p className="text-body-sm text-warm-500">Add a few materials to see suggestions.</p>
        ) : (
          <ol className="space-y-2">
            {res.oneAway.map((o, k) => (
              <li key={o.key} className="border border-warm-100 bg-white p-3 flex gap-3 items-start">
                <span className="font-serif text-heading-md text-warm-300 w-5 shrink-0">{k + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-md">
                    {o.label} <span className="text-warm-500">unlocks {o.unlocks}</span>
                  </p>
                  {o.variable && <p className="text-caption text-amber-700">variable: test tile first</p>}
                  <p className="text-caption text-warm-500 truncate">e.g. {o.examples.map((e) => e.name).join(" · ")}</p>
                </div>
                {byId.has(o.id) && (
                  <button type="button" onClick={() => add(o.id)} className="text-caption uppercase tracking-wider px-2 py-1 border border-warm-200 shrink-0">
                    + I have it
                  </button>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* makeable */}
      <section>
        <h2 className="font-serif text-heading-lg mb-1">What I can make now{res ? ` · ${res.makeableCount}` : ""}</h2>
        <p className="text-body-sm text-warm-500 mb-3">
          {res ? `${res.makeableCount} of ${res.total} recipes${band !== "any" ? ` at ${CONE_BANDS[band as Exclude<ConeBand, "any">].label}` : ""} use only materials on your shelf (close substitutes count, e.g. any potash feldspar).` : "…"}
        </p>
        {res && res.makeable.length > 0 && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {res.makeable.map((r) => (
              <li key={r.code}>
                <Link href={`/glazes/${encodeURIComponent(r.code)}`} className="flex gap-3 items-center border border-warm-100 bg-white p-2 hover:border-warm-300">
                  <Swatch family={r.family} className="w-10 h-10 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-body-sm truncate">{r.name}</span>
                    <span className="block text-caption text-warm-500">
                      {coneText(r.cone)}
                      {r.surface ? ` · ${r.surface}` : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {res && res.makeableCount > res.makeable.length && (
          <p className="mt-3 text-body-sm">
            <Link href="/glazes" className="underline">
              Describe what you want
            </Link>{" "}
            and tick “only what I can make now” to search all {res.makeableCount}.
          </p>
        )}
      </section>
    </div>
  );
}
