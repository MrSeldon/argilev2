"use client";

import { SuitabilityLocalColor } from "@/lib/types";

interface LocalColorProps {
  localColor: SuitabilityLocalColor;
}

export function LocalColor({ localColor }: LocalColorProps) {
  const hasContent =
    (localColor.blooms && localColor.blooms.length > 0) ||
    (localColor.festivals && localColor.festivals.length > 0) ||
    (localColor.naturalPhenomena && localColor.naturalPhenomena.length > 0);

  if (!hasContent) return null;

  return (
    <div className="space-y-8">
      {/* Blooms */}
      {localColor.blooms && localColor.blooms.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-warm-100 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-warm-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4 className="text-xs uppercase tracking-widest text-warm-400">
              Blooms
            </h4>
          </div>
          <div className="space-y-3 pl-9">
            {localColor.blooms.map((bloom, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-charcoal">{bloom.name}</p>
                  {bloom.notes && (
                    <p className="text-sm text-warm-500 mt-0.5">{bloom.notes}</p>
                  )}
                </div>
                <span className="text-xs uppercase tracking-wider text-warm-400 bg-warm-50 px-2 py-1 flex-shrink-0">
                  {bloom.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Festivals */}
      {localColor.festivals && localColor.festivals.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-warm-100 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-warm-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4 className="text-xs uppercase tracking-widest text-warm-400">
              Festivals
            </h4>
          </div>
          <div className="space-y-3 pl-9">
            {localColor.festivals.map((festival, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-charcoal">{festival.name}</p>
                  {festival.notes && (
                    <p className="text-sm text-warm-500 mt-0.5">
                      {festival.notes}
                    </p>
                  )}
                </div>
                <span className="text-xs uppercase tracking-wider text-warm-400 bg-warm-50 px-2 py-1 flex-shrink-0">
                  {festival.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Natural Phenomena */}
      {localColor.naturalPhenomena && localColor.naturalPhenomena.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-warm-100 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-warm-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h4 className="text-xs uppercase tracking-widest text-warm-400">
              Natural Phenomena
            </h4>
          </div>
          <div className="space-y-3 pl-9">
            {localColor.naturalPhenomena.map((phenomenon, i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-charcoal">{phenomenon.name}</p>
                  {phenomenon.notes && (
                    <p className="text-sm text-warm-500 mt-0.5">
                      {phenomenon.notes}
                    </p>
                  )}
                </div>
                <span className="text-xs uppercase tracking-wider text-warm-400 bg-warm-50 px-2 py-1 flex-shrink-0">
                  {phenomenon.season || phenomenon.month || "Year-round"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
