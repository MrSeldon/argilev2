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
        <label htmlFor="describe" className="block font-serif font-light text-[1.9rem] md:text-display-md leading-tight">
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
          className="w-full p-4 text-body-lg bg-paper-soft border border-line-strong focus:outline-none focus:border-ink transition-colors duration-400 resize-none placeholder:text-ink-3/70"
        />
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="submit"
            disabled={busy || !q.trim()}
            className="btn-primary px-7"
          >
            {busy ? "Searching…" : "Find recipes"}
          </button>
          {busy && modelPct !== null && modelPct < 100 && (
            <span className="text-caption text-warm-500">Loading the search model once ({modelPct}%)…</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Cone">
          {(["any", "low", "mid", "high"] as ConeBand[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => {
                setBand(b);
                rerun({ band: b });
              }}
              aria-pressed={band === b}
              className={`chip ${band === b ? "chip-on" : "chip-off"}`}
            >
              {b === "any" ? "Any cone" : CONE_BANDS[b].label}
            </button>
          ))}
        </div>
        <label className="flex flex-wrap items-center gap-x-2 min-h-11 text-body-sm text-ink-2">
          <input
            type="checkbox"
            checked={onlyMine}
            onChange={(e) => {
              setOnlyMine(e.target.checked);
              rerun({ onlyMine: e.target.checked });
            }}
            className="w-4 h-4 accent-[#22211E]"
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
          <p className="eyebrow mb-3">Try</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setQ(ex);
                  run(ex);
                }}
                className="text-left text-body-sm min-h-11 px-4 py-2 rounded-full border border-line bg-paper-soft hover:border-line-strong text-ink-2 transition-colors duration-400"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {err && <p className="mt-6 text-body-sm text-rust">{err}</p>}

      {hits && (
        <section ref={resultsRef} className="mt-8 scroll-mt-4" aria-live="polite">
          <p className="eyebrow mb-4">
            {hits.length ? `Closest matches for “${lastQ.current}”` : "No matches - try fewer filters"}
            {mode === "keyword" && hits.length > 0 && " · keyword search (the model didn’t load)"}
          </p>
          <div className="space-y-4">
            {hits.slice(0, limit).map((h, k) => (
              <RecipeCard key={h.recipe.code} hit={h} rank={k} goal={lastQ.current} shelf={shelf} groupOf={groupOf} />
            ))}
          </div>
          {hits.length > limit && (
            <button type="button" onClick={() => setLimit((l) => l + 8)} className="btn-secondary mt-6 w-full">
              Show more
            </button>
          )}
        </section>
      )}
    </div>
  );
}
