"use client";

import { useState } from "react";
import {
  SuitabilityLocation,
  SuitabilitySeasonData,
} from "@/lib/types";

interface SuitabilityPreviewProps {
  suitability: SuitabilityLocation;
  score: number;
  summary: string;
  onViewFull?: () => void;
}

export function SuitabilityPreview({
  suitability,
  score,
  summary,
  onViewFull,
}: SuitabilityPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current month for climate highlight
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentClimate = suitability.climate?.find(
    (c) => c.month === currentMonth
  );

  // Get comfort color
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-emerald-700";
    if (score >= 50) return "text-amber-700";
    return "text-stone-600";
  };

  const getSeasonComfortColor = (comfort?: string) => {
    switch (comfort) {
      case "comfortable":
        return "bg-emerald-100 text-emerald-800";
      case "cool":
        return "bg-blue-100 text-blue-800";
      case "cold":
        return "bg-slate-100 text-slate-800";
      case "warm":
        return "bg-amber-100 text-amber-800";
      case "hot":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  return (
    <div className="border-t border-warm-100 pt-8">
      {/* Header with Score */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-warm-400 mb-2">
            Suitability Index
          </h3>
          <p className="text-sm text-warm-600 leading-relaxed max-w-xs">
            {summary}
          </p>
        </div>
        <div className={`text-3xl font-serif ${getScoreColor(score)}`}>
          {score}
        </div>
      </div>

      {/* Quick Climate Snapshot */}
      {currentClimate && (
        <div className="mb-6 p-4 bg-warm-50">
          <p className="text-xs uppercase tracking-widest text-warm-400 mb-2">
            Right Now ({currentMonth})
          </p>
          <div className="flex items-baseline gap-4">
            <span className="text-2xl font-light text-charcoal">
              {currentClimate.tempHigh}°
            </span>
            <span className="text-sm text-warm-500">
              / {currentClimate.tempLow}° low
            </span>
            <span className="text-xs text-warm-400">
              {currentClimate.rainfall}mm rain
            </span>
          </div>
        </div>
      )}

      {/* Expandable Seasons */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left mb-4"
      >
        <div className="flex items-center justify-between text-xs uppercase tracking-widest text-warm-400">
          <span>Seasonal Rhythm</span>
          <span className="text-warm-300">{isExpanded ? "−" : "+"}</span>
        </div>
      </button>

      {isExpanded && suitability.seasons && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(["winter", "spring", "summer", "autumn"] as const).map((season) => {
            const data = suitability.seasons?.[season] as SuitabilitySeasonData | undefined;
            if (!data) return null;
            return (
              <div key={season} className="p-3 bg-warm-50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-warm-400">
                    {season}
                  </span>
                  {data.comfort && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${getSeasonComfortColor(
                        data.comfort
                      )}`}
                    >
                      {data.comfort}
                    </span>
                  )}
                </div>
                <p className="text-xs text-warm-600 leading-relaxed">
                  {data.summary}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      <div className="space-y-3 mb-6">
        {/* Timezone */}
        {suitability.utcOffset !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-500">From Kigali</span>
            <span className="text-charcoal">
              {(() => {
                const offset = typeof suitability.utcOffset === "number"
                  ? suitability.utcOffset
                  : parseInt(suitability.utcOffset as string) || 0;
                const diff = offset - 2; // Kigali is UTC+2
                return diff >= 0 ? `+${diff}h` : `${diff}h`;
              })()}
            </span>
          </div>
        )}

        {/* Chili */}
        {suitability.probabilityOfChili && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-500">Probability of Chili™</span>
            <span className="text-charcoal">
              {suitability.probabilityOfChili.rating}
            </span>
          </div>
        )}

        {/* Bugs */}
        {suitability.creepyCrawlies && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-500">Mosquitoes</span>
            <span className="text-charcoal capitalize">
              {suitability.creepyCrawlies.mosquitoes}
            </span>
          </div>
        )}
      </div>

      {/* View Full Button */}
      {onViewFull && (
        <button
          onClick={onViewFull}
          className="w-full py-3 text-xs uppercase tracking-widest text-center border border-warm-200 hover:border-charcoal hover:bg-charcoal hover:text-white transition-colors"
        >
          View Full Suitability Index
        </button>
      )}
    </div>
  );
}
