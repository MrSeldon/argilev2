"use client";

import { useState } from "react";
import { SuitabilityLocation } from "@/lib/types";
import { SuitabilityModalV1 } from "@/components/suitability/SuitabilityModalV1";

interface OpportunityDetailClientProps {
  suitability: SuitabilityLocation;
  score: number;
  summary: string;
}

export function OpportunityDetailClient({
  suitability,
  score,
  summary,
}: OpportunityDetailClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get score color for badge
  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-stone-100 text-stone-700 border-stone-200";
  };

  return (
    <>
      {/* Discover This Place Button */}
      <div className="border-t border-warm-100 pt-8 mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full group"
        >
          <div className="flex items-center justify-between p-6 bg-warm-50 hover:bg-warm-100 transition-colors">
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                Suitability Index
              </p>
              <p className="font-serif text-lg text-charcoal">
                Discover this place
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Score Badge */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border ${getScoreColor(
                  score
                )}`}
              >
                <span className="text-lg font-serif">{score}</span>
              </div>
              {/* Arrow */}
              <svg
                className="w-5 h-5 text-warm-400 group-hover:text-charcoal transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {isModalOpen && (
        <SuitabilityModalV1
          locationData={suitability}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
