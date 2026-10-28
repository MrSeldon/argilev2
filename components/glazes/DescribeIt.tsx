"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ConeBand, SearchHit } from "@/lib/glazes/types";
import { CONE_BANDS } from "@/lib/glazes/types";
import { embed, loadEmbedder, onEmbedderProgress, embedderReady } from "./embedder";
import { useGlossary, useShelf } from "./useShelf";
import { RecipeCard } from "./RecipeCard";

const EXAMPLES = [
  "glossy green that breaks brown over texture",
  "satin white that stays put on carved porcelain",
  "runny wood-ash look with glassy pools",
  "deep blue that pools darker, cone 6",
  "black tenmoku breaking rust on the rim",
];

export function DescribeIt() {
  const [q, setQ] = useState("");
  const [band, setBand] = useState<ConeBand>("any");
  const [onlyMine, setOnlyMine] = useState(false);
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [mode, setMode] = useState<"semantic" | "keyword" | null>(null);
  const [busy, setBusy] = useState(false);
  const [modelPct, setModelPct] = useState<number | null>(null);
  const [err, setErr] = useState("");
  const [limit, setLimit] = useState(8);
  const lastQ = useRef("");
  const resultsRef = useRef<HTMLElement>(null);
  const { shelf, loaded } = useShelf();
  const glossary = useGlossary();
  const groupMap = useMemo(() => new Map((glossary || []).map((m) => [m.id, m.group])), [glossary]);
  const groupOf = useCallback((id: string) => groupMap.get(id), [groupMap]);

  useEffect(() => onEmbedderProgress((p) => setModelPct(p)), []);

  // warm the model up as soon as she starts typing
  const warm = () => {
    if (!embedderReady()) loadEmbedder().catch(() => {});
  };

  async function run(text = q, opts: { band?: ConeBand; onlyMine?: boolean; limit?: number } = {}) {
    const query = text.trim();
    if (!query) return;
    lastQ.current = query;
    setBusy(true);
    setErr("");
    let vector: number[] | undefined;
    try {
      // Give the model a few seconds on first use; fall back to keywords if it's slow or offline.
      vector = await Promise.race([
        embed(query),
        new Promise<undefined>((res) => setTimeout(() => res(undefined), embedderReady() ? 5000 : 25000)),
      ]);
    } catch {
      vector = undefined;
    }
    try {
      const r = await fetch("/api/glazes/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: query,
          vector,
          band: opts.band ?? band,
          shelf: loaded && shelf.length ? shelf : undefined,
          onlyMakeable: opts.onlyMine ?? onlyMine,
          limit: opts.limit ?? 24,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Search failed");
      setHits(data.hits);
      setMode(data.mode);
      setLimit(8);
      // on a phone the results start below the fold - bring them up
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }

  const rerun = (o: { band?: ConeBand; onlyMine?: boolean }) => {
    if (lastQ.current) run(lastQ.current, o);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="space-y-3"
      >
        <label htmlFor="describe" className="block font-serif text-heading-lg md:text-display-sm leading-tight">
          Describe the glaze you want
        </label>
        <textarea
          id="describe"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={warm}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              run();
            }
          }}
          rows={3}
          placeholder="e.g. glossy green that breaks brown over texture"
          className="w-full p-4 text-body-lg bg-white border border-warm-200 focus:outline-none focus:border-charcoal resize-none"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="submit"
            disabled={busy || !q.trim()}
            className="px-6 py-3 bg-charcoal text-cream text-body-sm uppercase tracking-wider disabled:opacity-40 hover:bg-charcoal-dark transition-colors"
          >
            {busy ? "Searching…" : "Find recipes"}
          </button>
          {busy && modelPct !== null && modelPct < 100 && (
            <span className="text-caption text-warm-500">Loading the search model once ({modelPct}%)…</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1" role="group" aria-label="Cone">
          {(["any", "low", "mid", "high"] as ConeBand[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                setBand(b);
                rerun({ band: b });
              }}
              className={`px-3 py-1.5 text-body-sm border ${band === b ? "bg-charcoal text-cream border-charcoal" : "border-warm-100 text-warm-700 bg-white"}`}
            >
              {b === "any" ? "Any cone" : CONE_BANDS[b].label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-body-sm text-warm-700">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => {
              setOnlyMine(e.target.checked);
              rerun({ onlyMine: e.target.checked });
            }}
            className="w-4 h-4"
          />
          Only what I can make now
          <span className="text-warm-500">
            ({shelf.length} on <Link href="/glazes/my-materials" className="underline">my shelf</Link>)
          </span>
        </label>
        {onlyMine && shelf.length === 0 && (
          <p className="text-caption text-warm-500">Your shelf is empty - add the materials you have first.</p>
        )}
      </form>

      {!hits && !busy && (
        <div className="mt-6">
          <p className="text-caption uppercase tracking-wider text-warm-500 mb-2">Try</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setQ(ex);
                  run(ex);
                }}
                className="text-left text-body-sm px-3 py-2 bg-warm-50 hover:bg-warm-100 text-warm-700"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {err && <p className="mt-6 text-body-sm text-red-800">{err}</p>}

      {hits && (
        <section ref={resultsRef} className="mt-8 scroll-mt-4" aria-live="polite">
          <p className="text-caption uppercase tracking-wider text-warm-500 mb-3">
            {hits.length ? `Closest matches for “${lastQ.current}”` : "No matches - try fewer filters"}
            {mode === "keyword" && hits.length > 0 && " · keyword search (the model didn’t load)"}
          </p>
          <div className="space-y-3">
            {hits.slice(0, limit).map((h, k) => (
              <RecipeCard key={h.recipe.code} hit={h} rank={k} goal={lastQ.current} shelf={shelf} groupOf={groupOf} />
            ))}
          </div>
          {hits.length > limit && (
            <button type="button" onClick={() => setLimit((l) => l + 8)} className="mt-4 w-full py-3 border border-warm-100 text-body-sm text-warm-700 bg-white">
              Show more
            </button>
          )}
        </section>
      )}
    </div>
  );
}
