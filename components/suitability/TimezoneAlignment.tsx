"use client";

import { useMemo } from "react";

interface TimezoneAlignmentProps {
  destinationOffset: number;
  destinationTimezone?: string;
}

// Kigali, Rwanda (home base)
const HOME_OFFSET = 2;
const HOME_NAME = "Kigali";

export function TimezoneAlignment({
  destinationOffset,
  destinationTimezone,
}: TimezoneAlignmentProps) {
  const { diff, homeTime, destTime, alignment, overlapHours } = useMemo(() => {
    const now = new Date();
    const homeHours = (now.getUTCHours() + HOME_OFFSET + 24) % 24;
    const destHours = (now.getUTCHours() + destinationOffset + 24) % 24;

    const formatTime = (hours: number) => {
      const h = hours % 12 || 12;
      const ampm = hours < 12 ? "am" : "pm";
      const mins = now.getMinutes().toString().padStart(2, "0");
      return `${h}:${mins} ${ampm}`;
    };

    const difference = destinationOffset - HOME_OFFSET;
    const absDiff = Math.abs(difference);

    // Calculate working hours overlap (assuming 9am-5pm)
    const overlapHours = Math.max(0, 8 - absDiff);

    let alignment: "same" | "close" | "moderate" | "challenging";
    if (absDiff === 0) alignment = "same";
    else if (absDiff <= 3) alignment = "close";
    else if (absDiff <= 6) alignment = "moderate";
    else alignment = "challenging";

    return {
      diff: difference,
      homeTime: formatTime(homeHours),
      destTime: formatTime(destHours),
      alignment,
      overlapHours,
    };
  }, [destinationOffset]);

  // Generate 24-hour visualization bars
  const generateTimeBar = (offset: number) => {
    const now = new Date();
    const currentHour = (now.getUTCHours() + offset + 24) % 24;

    return Array.from({ length: 24 }, (_, i) => {
      const isDaytime = i >= 6 && i < 18;
      const isCurrent = i === currentHour;
      const isWorkingHours = i >= 9 && i < 17;

      return {
        hour: i,
        isDaytime,
        isCurrent,
        isWorkingHours,
      };
    });
  };

  const homeBar = generateTimeBar(HOME_OFFSET);
  const destBar = generateTimeBar(destinationOffset);

  const alignmentLabels = {
    same: { label: "Same timezone", color: "text-emerald-600" },
    close: { label: "Easy calls", color: "text-emerald-600" },
    moderate: { label: "Some overlap", color: "text-amber-600" },
    challenging: { label: "Challenging", color: "text-red-600" },
  };

  return (
    <div className="space-y-6">
      {/* Time Comparison */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-warm-400 mb-1">
            {HOME_NAME}
          </p>
          <p className="text-2xl font-light text-charcoal">{homeTime}</p>
          <p className="text-xs text-warm-500">UTC+{HOME_OFFSET}</p>
        </div>

        <div className="text-center px-6">
          <div
            className={`text-3xl font-light ${
              diff >= 0 ? "text-charcoal" : "text-charcoal"
            }`}
          >
            {diff >= 0 ? `+${diff}` : diff}h
          </div>
          <p className={`text-xs ${alignmentLabels[alignment].color}`}>
            {alignmentLabels[alignment].label}
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-warm-400 mb-1">
            Destination
          </p>
          <p className="text-2xl font-light text-charcoal">{destTime}</p>
          <p className="text-xs text-warm-500">
            {destinationTimezone ||
              `UTC${destinationOffset >= 0 ? "+" : ""}${destinationOffset}`}
          </p>
        </div>
      </div>

      {/* Day/Night Alignment Visualization */}
      <div className="space-y-3">
        {/* Home Bar */}
        <div>
          <p className="text-xs text-warm-400 mb-1">{HOME_NAME}</p>
          <div className="flex h-6 rounded overflow-hidden">
            {homeBar.map((hour) => (
              <div
                key={hour.hour}
                className={`flex-1 relative ${
                  hour.isDaytime
                    ? "bg-amber-100"
                    : "bg-slate-700"
                } ${hour.isCurrent ? "ring-2 ring-amber-500 ring-inset" : ""}`}
                title={`${hour.hour}:00`}
              >
                {hour.isWorkingHours && (
                  <div className="absolute inset-0 bg-amber-300/30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Destination Bar */}
        <div>
          <p className="text-xs text-warm-400 mb-1">Destination</p>
          <div className="flex h-6 rounded overflow-hidden">
            {destBar.map((hour) => (
              <div
                key={hour.hour}
                className={`flex-1 relative ${
                  hour.isDaytime
                    ? "bg-blue-100"
                    : "bg-slate-700"
                } ${hour.isCurrent ? "ring-2 ring-blue-500 ring-inset" : ""}`}
                title={`${hour.hour}:00`}
              >
                {hour.isWorkingHours && (
                  <div className="absolute inset-0 bg-blue-300/30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-warm-400 pt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-amber-300/50" />
            <span>Working hours overlap</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-slate-700" />
            <span>Night</span>
          </div>
        </div>
      </div>

      {/* Working Hours Overlap */}
      <div className="p-4 bg-warm-50 rounded-lg text-center">
        <p className="text-sm text-warm-600">
          {overlapHours > 0 ? (
            <>
              <span className="font-medium text-charcoal">{overlapHours} hours</span>{" "}
              of working day overlap
            </>
          ) : (
            <>
              <span className="font-medium text-red-600">No overlap</span> during
              typical working hours (9am-5pm)
            </>
          )}
        </p>
        {alignment === "challenging" && (
          <p className="text-xs text-warm-500 mt-1">
            Best times to call home: early morning or late evening
          </p>
        )}
      </div>
    </div>
  );
}
