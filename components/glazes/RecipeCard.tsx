"use client";

import { useState } from "react";
import Link from "next/link";
import type { SearchHit } from "@/lib/glazes/types";
import { coneText } from "@/lib/glazes/types";
import { Swatch } from "./Swatch";
import { BatchCalculator } from "./BatchCalculator";
import { AdaptPanel } from "./AdaptPanel";

export function RecipeCard({
  hit,
  rank,
  goal,
  shelf,
  groupOf,
}: {
  hit: SearchHit;
  rank: number;
  goal: string;
  shelf: string[];
  groupOf: (id: string) => string | undefined;
}) {
  const r = hit.recipe;
  const [open, setOpen] = useState(rank === 0);
  const [adapt, setAdapt] = useState(false);
  const atm = r.atmosphere?.length ? r.atmosphere.join(" / ") : "";

  return (
    <article className="border border-line bg-paper-soft">
      <button type="button" onClick={() => setOpen((o) => !o)} className="w-full text-left flex gap-3 p-3 sm:p-4" aria-expanded={open}>
        {r.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.image} alt="" className="w-20 h-20 sm:w-24 sm:h-24 object-cover shrink-0" />
        ) : (
          <Swatch family={r.family} description={r.description} tags={r.tags} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-heading-md leading-tight">{r.name}</h3>
            <span className="text-heading-md font-light text-ink-3 shrink-0 leading-none" aria-hidden="true">{open ? "−" : "+"}</span>
          </div>
          <p className="text-caption uppercase tracking-wider text-warm-500 mt-0.5">
            {coneText(r.cone)}
            {atm && ` · ${atm}`} · {r.source === "glazy" ? "Glazy" : "Digitalfire"}
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1">
            {hit.why.slice(0, 4).map((w, k) => (
              <li key={k} className="text-caption bg-oat/80 text-ink-2 px-2 py-0.5">
                {w}
              </li>
            ))}
          </ul>
          {hit.makeable === true && <p className="mt-1.5 text-caption text-celadon-deep">✓ You can make this now</p>}
          {hit.makeable === false && hit.missing && hit.missing.length > 0 && (
            <p className="mt-1 text-caption text-warm-500">Missing: {hit.missing.slice(0, 3).join(", ")}{hit.missing.length > 3 ? "…" : ""}</p>
          )}
        </div>
      </button>

      {open && (
        <div className="px-3 pb-4 sm:px-4 space-y-4">
          <p className="text-body-sm text-warm-700">{r.description}</p>
          {r.note && r.note.length > 20 && <p className="text-body-sm text-warm-500 italic">“{r.note}”</p>}
          <BatchCalculator ingredients={r.ingredients} shelf={shelf} groupOf={groupOf} />
          <div className="flex flex-wrap items-center gap-x-5 text-caption text-ink-3">
            <Link href={`/glazes/${encodeURIComponent(r.code)}`} className="inline-flex items-center min-h-11 underline underline-offset-4 decoration-line-strong hover:decoration-terracotta">
              Full recipe
            </Link>
            {r.url && (
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center min-h-11 underline underline-offset-4 decoration-line-strong hover:decoration-terracotta">
                {r.source === "glazy" ? "Photos & comments on Glazy ↗" : "Digitalfire page ↗"}
              </a>
            )}
            {r.author && <span>by {r.author}</span>}
          </div>
          {adapt ? (
            <AdaptPanel autoStart code={r.code} goal={goal} shelf={shelf} groupOf={groupOf} />
          ) : (
            <button
              type="button"
              onClick={() => setAdapt(true)}
              className="btn-secondary w-full sm:w-auto"
            >
              Adapt this…
            </button>
          )}
        </div>
      )}
    </article>
  );
}
