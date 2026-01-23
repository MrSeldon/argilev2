"use client";

import { SuitabilityBeachAccess } from "@/lib/types";

interface BeachAccessProps {
  beachAccess: SuitabilityBeachAccess;
}

export function BeachAccess({ beachAccess }: BeachAccessProps) {
  const isLandlocked =
    beachAccess.distance === "N/A" || beachAccess.type === "Landlocked";
  const hasFlightInfo = beachAccess.nearestBeachFlight;

  return (
    <div className="p-6 bg-warm-50">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          {isLandlocked ? (
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 3l14 9-14 9V3z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          {!isLandlocked ? (
            // Nearby beach
            <>
              <div className="flex items-baseline justify-between mb-2">
                <h4 className="text-charcoal font-medium">{beachAccess.type}</h4>
                <span className="text-sm text-blue-700 font-medium">
                  {beachAccess.distance}
                </span>
              </div>

              {beachAccess.beaches && beachAccess.beaches.length > 0 && (
                <p className="text-sm text-warm-600 mb-2">
                  {beachAccess.beaches.join(" · ")}
                </p>
              )}

              {beachAccess.swimmable && (
                <p className="text-sm text-warm-500">{beachAccess.swimmable}</p>
              )}

              {beachAccess.notes && (
                <p className="text-sm text-warm-500 mt-2">{beachAccess.notes}</p>
              )}
            </>
          ) : hasFlightInfo ? (
            // Flight to nearest beach
            <>
              <p className="text-xs uppercase tracking-widest text-warm-400 mb-2">
                Nearest Beach by Flight
              </p>

              <h4 className="text-charcoal font-medium mb-1">
                {hasFlightInfo.beach}
              </h4>

              <p className="text-sm text-warm-600 mb-3">
                {hasFlightInfo.destination}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-warm-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-warm-600">
                    {hasFlightInfo.flightDuration}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-warm-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-warm-600">
                    {hasFlightInfo.approximateCost}
                  </span>
                </div>
              </div>

              {hasFlightInfo.notes && (
                <p className="text-sm text-warm-500 mt-3 italic">
                  {hasFlightInfo.notes}
                </p>
              )}
            </>
          ) : (
            // Landlocked with no flight info
            <div className="text-warm-500">
              <p className="font-medium text-charcoal mb-1">Landlocked Location</p>
              <p className="text-sm">No nearby beaches available</p>
              {beachAccess.notes && (
                <p className="text-sm mt-2">{beachAccess.notes}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
