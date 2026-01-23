"use client";

import { useEffect } from "react";
import { SuitabilityLocation } from "@/lib/types";
import { ClimateChart } from "./ClimateChart";
import { LocalColor } from "./LocalColor";
import { BeachAccess } from "./BeachAccess";
import { TimezoneAlignment } from "./TimezoneAlignment";

interface SuitabilityModalProps {
  suitability: SuitabilityLocation;
  score: number;
  summary: string;
  onClose: () => void;
}

// Season date ranges
const SEASON_DATES: Record<string, string> = {
  winter: "Dec-Feb",
  spring: "Mar-May",
  summer: "Jun-Aug",
  autumn: "Sep-Nov",
};

export function SuitabilityModal({
  suitability,
  score,
  summary,
  onClose,
}: SuitabilityModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const getSeasonComfortColor = (comfort?: string) => {
    switch (comfort) {
      case "comfortable":
        return "text-emerald-700";
      case "cool":
        return "text-blue-700";
      case "cold":
        return "text-slate-600";
      case "warm":
        return "text-amber-700";
      case "hot":
        return "text-orange-700";
      default:
        return "text-stone-600";
    }
  };

  // Get bug severity for footnote display
  const getBugLabel = (level?: string) => {
    switch (level) {
      case "low":
        return "Low";
      case "moderate":
        return "Moderate";
      case "high":
        return "High";
      case "seasonal":
        return "Seasonal";
      default:
        return level || "—";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-cream rounded-sm shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cream border-b border-warm-200 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-2">
                Suitability Index
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
                {suitability.location}
              </h2>
              {/* Summary below location */}
              <p className="mt-3 text-sm text-warm-600 leading-relaxed max-w-lg">
                {summary}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Score Badge - Cream/tan color per V1 */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[#F5EFE6] border border-[#D4C8B8]">
                <span className="text-2xl font-serif text-charcoal">{score}</span>
              </div>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-warm-400 hover:text-charcoal transition-colors p-2"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-12">
          {/* Climate Chart */}
          {suitability.climate && Array.isArray(suitability.climate) && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-6 pb-2 border-b border-warm-100">
                Climate Almanac
              </h3>
              <ClimateChart climate={suitability.climate} height={260} />
            </section>
          )}

          {/* Seasonal Rhythm */}
          {suitability.seasons && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-6 pb-2 border-b border-warm-100">
                Seasonal Rhythm
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-warm-200">
                {(["winter", "spring", "summer", "autumn"] as const).map(
                  (season) => {
                    const data = suitability.seasons?.[season];
                    if (!data) return null;
                    return (
                      <div key={season} className="px-4 first:pl-0 last:pr-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-1">
                          {season}
                        </p>
                        <p className="text-[10px] text-warm-300 mb-3">
                          {SEASON_DATES[season]}
                        </p>
                        <p className="text-sm text-warm-600 leading-relaxed mb-2">
                          {data.summary}
                        </p>
                        {data.comfort && (
                          <span
                            className={`text-xs capitalize ${getSeasonComfortColor(
                              data.comfort
                            )}`}
                          >
                            {data.comfort}
                          </span>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* Local Color */}
          {suitability.localColor && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-6 pb-2 border-b border-warm-100">
                Local Color
              </h3>
              <LocalColor localColor={suitability.localColor} />
            </section>
          )}

          {/* Ceramics Ecosystem */}
          {suitability.ceramicsEcosystem && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-6 pb-2 border-b border-warm-100">
                Ceramics Ecosystem
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {suitability.ceramicsEcosystem.studios &&
                  suitability.ceramicsEcosystem.studios.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-3">
                        Studios
                      </p>
                      <ul className="space-y-2">
                        {suitability.ceramicsEcosystem.studios
                          .slice(0, 5)
                          .map((studio, i) => {
                            const name = typeof studio === "string" ? studio : studio.name;
                            const url = typeof studio === "object" ? studio.url : null;
                            return (
                              <li key={i} className="text-sm text-warm-600">
                                {url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-charcoal transition-colors"
                                  >
                                    {name}
                                  </a>
                                ) : (
                                  name
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}

                {suitability.ceramicsEcosystem.suppliers &&
                  suitability.ceramicsEcosystem.suppliers.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-3">
                        Suppliers
                      </p>
                      <ul className="space-y-2">
                        {suitability.ceramicsEcosystem.suppliers
                          .slice(0, 5)
                          .map((supplier, i) => {
                            const name = typeof supplier === "string" ? supplier : supplier.name;
                            const url = typeof supplier === "object" ? supplier.url : null;
                            return (
                              <li key={i} className="text-sm text-warm-600">
                                {url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-charcoal transition-colors"
                                  >
                                    {name}
                                  </a>
                                ) : (
                                  name
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}

                {suitability.ceramicsEcosystem.galleries &&
                  suitability.ceramicsEcosystem.galleries.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-3">
                        Galleries
                      </p>
                      <ul className="space-y-2">
                        {suitability.ceramicsEcosystem.galleries
                          .slice(0, 5)
                          .map((gallery, i) => {
                            const name = typeof gallery === "string" ? gallery : gallery.name;
                            const url = typeof gallery === "object" ? gallery.url : null;
                            return (
                              <li key={i} className="text-sm text-warm-600">
                                {url ? (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline hover:text-charcoal transition-colors"
                                  >
                                    {name}
                                  </a>
                                ) : (
                                  name
                                )}
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  )}
              </div>
            </section>
          )}

          {/* Food Constellation */}
          {(suitability.probabilityOfChili || suitability.probabilityOfCoffee) && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-6 pb-2 border-b border-warm-100">
                Food Constellation
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {suitability.probabilityOfChili && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-2">
                      Probability of Chili™
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-light text-charcoal">
                        {suitability.probabilityOfChili.score}
                      </span>
                      <span className="text-warm-600">
                        {suitability.probabilityOfChili.rating}
                      </span>
                    </div>
                    {suitability.probabilityOfChili.nearest && (
                      <p className="text-sm text-warm-500 mt-2">
                        Nearest: {suitability.probabilityOfChili.nearest}
                      </p>
                    )}
                  </div>
                )}

                {suitability.probabilityOfCoffee && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-2">
                      Specialty Coffee
                    </p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-light text-charcoal">
                        {suitability.probabilityOfCoffee.score}
                      </span>
                      <span className="text-warm-600">
                        {suitability.probabilityOfCoffee.rating}
                      </span>
                    </div>
                    {suitability.probabilityOfCoffee.notes && (
                      <p className="text-sm text-warm-500 mt-2">
                        {suitability.probabilityOfCoffee.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Beach Access */}
          {suitability.beachAccess && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-6 pb-2 border-b border-warm-100">
                Beach & Escape
              </h3>
              <BeachAccess beachAccess={suitability.beachAccess} />
            </section>
          )}

          {/* Timezone */}
          {suitability.utcOffset !== undefined && (
            <section>
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-6 pb-2 border-b border-warm-100">
                Time Zone Alignment
              </h3>
              <TimezoneAlignment
                destinationOffset={
                  typeof suitability.utcOffset === "number"
                    ? suitability.utcOffset
                    : parseInt(suitability.utcOffset as string) || 0
                }
                destinationTimezone={suitability.timezone}
              />
            </section>
          )}
        </div>

        {/* Footer with Creepy Crawlies as small footnote */}
        <div className="bg-warm-50 border-t border-warm-200 px-8 py-5">
          {/* Creepy Crawlies - Small footnote style */}
          {suitability.creepyCrawlies && (
            <div className="flex items-center justify-center gap-8 text-xs text-warm-400 mb-4">
              <span>
                Mosquitoes: <span className="text-warm-500">{getBugLabel(suitability.creepyCrawlies.mosquitoes)}</span>
              </span>
              <span className="text-warm-200">·</span>
              <span>
                Spiders: <span className="text-warm-500">{getBugLabel(suitability.creepyCrawlies.spiders)}</span>
              </span>
              <span className="text-warm-200">·</span>
              <span>
                Snakes: <span className="text-warm-500">{getBugLabel(suitability.creepyCrawlies.snakes)}</span>
              </span>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 text-xs uppercase tracking-widest text-center bg-charcoal text-white hover:bg-charcoal/90 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
