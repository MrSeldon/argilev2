"use client";

import { useState } from "react";
import { SuitabilityCreepyCrawlies } from "@/lib/types";

interface CreepyCrawliesProps {
  creepyCrawlies: SuitabilityCreepyCrawlies;
}

// Muted, warm-toned colors aligned with the design spec
const LEVEL_CONFIG = {
  low: {
    color: "bg-stone-100 text-stone-600 border-stone-200",
    bgColor: "bg-warm-50",
    label: "Low",
    icon: "✓",
  },
  moderate: {
    color: "bg-amber-100/60 text-amber-800 border-amber-200/60",
    bgColor: "bg-warm-50",
    label: "Moderate",
    icon: "~",
  },
  high: {
    color: "bg-rose-100/60 text-rose-800 border-rose-200/60",
    bgColor: "bg-warm-50",
    label: "High",
    icon: "!",
  },
  seasonal: {
    color: "bg-stone-100 text-stone-600 border-stone-200",
    bgColor: "bg-warm-50",
    label: "Seasonal",
    icon: "◐",
  },
};

function getLevelConfig(level: string) {
  return LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.moderate;
}

export function CreepyCrawlies({ creepyCrawlies }: CreepyCrawliesProps) {
  const [showSnakes, setShowSnakes] = useState(false);

  const mosquitoConfig = getLevelConfig(creepyCrawlies.mosquitoes);
  const spiderConfig = getLevelConfig(creepyCrawlies.spiders);
  const snakeConfig = getLevelConfig(creepyCrawlies.snakes);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Mosquitoes */}
        <div className={`p-4 rounded-lg ${mosquitoConfig.bgColor}`}>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/60 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-warm-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-wider text-warm-500 mb-2">
              Mosquitoes
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm border ${mosquitoConfig.color}`}
            >
              {mosquitoConfig.label}
            </span>
          </div>
        </div>

        {/* Spiders */}
        <div className={`p-4 rounded-lg ${spiderConfig.bgColor}`}>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/60 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-warm-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-wider text-warm-500 mb-2">
              Spiders
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm border ${spiderConfig.color}`}
            >
              {spiderConfig.label}
            </span>
          </div>
        </div>

        {/* Snakes - Hidden by default */}
        <div className={`p-4 rounded-lg ${showSnakes ? snakeConfig.bgColor : "bg-stone-100"}`}>
          <div className="text-center">
            {!showSnakes ? (
              <button
                onClick={() => setShowSnakes(true)}
                className="w-full py-4 text-center"
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-stone-200 flex items-center justify-center">
                  <span className="text-stone-500">?</span>
                </div>
                <p className="text-xs uppercase tracking-wider text-warm-500 mb-2">
                  Snakes
                </p>
                <span className="text-xs text-warm-400 underline">
                  Tap to reveal
                </span>
              </button>
            ) : (
              <>
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/60 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-warm-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-xs uppercase tracking-wider text-warm-500 mb-2">
                  Snakes
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm border ${snakeConfig.color}`}
                >
                  {snakeConfig.label}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Other hazards */}
      {creepyCrawlies.other && (
        <div className="px-4 py-3 bg-warm-50 rounded-lg">
          <p className="text-sm text-warm-600">
            <span className="font-medium">Note:</span> {creepyCrawlies.other}
          </p>
        </div>
      )}
    </div>
  );
}
