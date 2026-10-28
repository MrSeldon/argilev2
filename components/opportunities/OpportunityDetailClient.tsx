"use client";

import { useState } from "react";
import { SuitabilityLocation } from "@/lib/types";
import { SuitabilityModalV1 } from "@/components/suitability/SuitabilityModalV1";

interface OpportunityDetailClientProps {
  suitability: SuitabilityLocation;
  score: number;
  summary: string;
}

export function OpportunityDetailClient({ suitability, score, summary }: OpportunityDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="group w-full text-left border border-line bg-paper-soft hover:border-line-strong transition-colors duration-400 p-5"
      >
        <span className="flex items-center justify-between gap-4">
          <span>
            <span className="eyebrow block mb-1">Living there</span>
            <span className="font-serif text-heading-lg block leading-tight">Discover this place</span>
            {summary && <span className="block text-body-sm text-ink-3 mt-1.5 line-clamp-2">{summary}</span>}
          </span>
          <span className="flex flex-col items-center shrink-0">
            <span className="w-14 h-14 rounded-full border border-celadon-deep/50 flex items-center justify-center font-serif text-[1.5rem] text-celadon-deep">
              {score}
            </span>
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink-3 mt-1">of 100</span>
          </span>
        </span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-label uppercase text-ink-2 group-hover:text-terracotta-deep transition-colors duration-400">
          Climate, costs, community <span aria-hidden="true">→</span>
        </span>
      </button>

      {isModalOpen && <SuitabilityModalV1 locationData={suitability} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
