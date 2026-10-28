"use client";

import { useMemo, useState } from "react";
import { SuitabilityMonthlyClimate } from "@/lib/types";

interface ClimateChartProps {
  climate: SuitabilityMonthlyClimate[];
  comfortZone?: { min: number; max: number };
  showRainfall?: boolean;
  height?: number;
}

const MONTH_ABBREV = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// Winnie's comfort zone (in Celsius)
const DEFAULT_COMFORT_ZONE = { min: 21, max: 28 };

export function ClimateChart({
  climate,
  comfortZone = DEFAULT_COMFORT_ZONE,
  showRainfall = true,
  height = 240,
}: ClimateChartProps) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Fixed dimensions for consistent proportions
  const width = 600;
  const padding = { top: 30, right: 40, bottom: 50, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate temperature range
  const { tempMin, tempMax, rainMax } = useMemo(() => {
    let tMin = Infinity;
    let tMax = -Infinity;
    let rMax = 0;

    for (const month of climate) {
      tMin = Math.min(tMin, month.tempLow);
      tMax = Math.max(tMax, month.tempHigh);
      rMax = Math.max(rMax, month.rainfall);
    }

    // Add padding to temp range
    tMin = Math.floor(tMin / 5) * 5 - 5;
    tMax = Math.ceil(tMax / 5) * 5 + 5;

    return { tempMin: tMin, tempMax: tMax, rainMax: rMax };
  }, [climate]);

  // Scale functions
  const tempToY = (temp: number) => {
    const range = tempMax - tempMin;
    return padding.top + chartHeight - ((temp - tempMin) / range) * chartHeight;
  };

  const monthToX = (index: number) => {
    // Add margin so first and last months aren't at the edge
    const margin = chartWidth * 0.04;
    return padding.left + margin + (index / 11) * (chartWidth - 2 * margin);
  };

  // Generate temperature path (smooth curve through high temps)
  const tempHighPath = useMemo(() => {
    const points = climate.map((m, i) => ({
      x: monthToX(i),
      y: tempToY(m.tempHigh),
    }));

    // Create smooth bezier curve
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpx2 = prev.x + ((curr.x - prev.x) * 2) / 3;
      path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  }, [climate]);

  // Generate temperature band path (area between high and low)
  const tempBandPath = useMemo(() => {
    const highPoints = climate.map((m, i) => ({
      x: monthToX(i),
      y: tempToY(m.tempHigh),
    }));
    const lowPoints = climate.map((m, i) => ({
      x: monthToX(i),
      y: tempToY(m.tempLow),
    }));

    // Create path going around the band
    let path = `M ${highPoints[0].x} ${highPoints[0].y}`;

    // Top edge (high temps)
    for (let i = 1; i < highPoints.length; i++) {
      const prev = highPoints[i - 1];
      const curr = highPoints[i];
      const cpx1 = prev.x + (curr.x - prev.x) / 3;
      const cpx2 = prev.x + ((curr.x - prev.x) * 2) / 3;
      path += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Line to last low point
    path += ` L ${lowPoints[lowPoints.length - 1].x} ${lowPoints[lowPoints.length - 1].y}`;

    // Bottom edge (low temps) - reversed
    for (let i = lowPoints.length - 2; i >= 0; i--) {
      const next = lowPoints[i + 1];
      const curr = lowPoints[i];
      const cpx1 = next.x - (next.x - curr.x) / 3;
      const cpx2 = next.x - ((next.x - curr.x) * 2) / 3;
      path += ` C ${cpx1} ${next.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    path += " Z";
    return path;
  }, [climate]);

  // Current month
  const currentMonthIndex = new Date().getMonth();

  // Check if temperature is in comfort zone
  const isInComfort = (temp: number) => temp >= comfortZone.min && temp <= comfortZone.max;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto"
      >
        {/* Comfort Zone Band */}
        <rect
          x={padding.left}
          y={tempToY(comfortZone.max)}
          width={chartWidth}
          height={tempToY(comfortZone.min) - tempToY(comfortZone.max)}
          fill="rgba(196, 167, 125, 0.15)"
        />

        {/* Comfort zone labels on left */}
        <text
          x={padding.left - 8}
          y={tempToY(comfortZone.max)}
          textAnchor="end"
          dominantBaseline="middle"
          className="text-[11px] fill-warm-400"
        >
          {comfortZone.max}°
        </text>
        <text
          x={padding.left - 8}
          y={tempToY(comfortZone.min)}
          textAnchor="end"
          dominantBaseline="middle"
          className="text-[11px] fill-warm-400"
        >
          {comfortZone.min}°
        </text>

        {/* Rainfall blocks */}
        {showRainfall &&
          climate.map((month, i) => {
            const x = monthToX(i);
            const barWidth = 16;
            const maxBarHeight = 30;
            const barHeight = (month.rainfall / (rainMax || 1)) * maxBarHeight;
            return (
              <rect
                key={`rain-${i}`}
                x={x - barWidth / 2}
                y={height - padding.bottom - barHeight}
                width={barWidth}
                height={barHeight}
                fill="rgba(147, 197, 253, 0.4)"
                rx="2"
              />
            );
          })}

        {/* Temperature band */}
        <path d={tempBandPath} fill="rgba(87, 83, 78, 0.1)" />

        {/* Temperature line */}
        <path
          d={tempHighPath}
          fill="none"
          stroke="#57534E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current month indicator */}
        <line
          x1={monthToX(currentMonthIndex)}
          y1={padding.top - 10}
          x2={monthToX(currentMonthIndex)}
          y2={height - padding.bottom + 10}
          stroke="#C4A77D"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Month labels */}
        {MONTH_ABBREV.map((abbrev, i) => (
          <text
            key={abbrev + i}
            x={monthToX(i)}
            y={height - padding.bottom + 25}
            textAnchor="middle"
            className={`text-[13px] ${
              i === currentMonthIndex
                ? "fill-amber-700 font-medium"
                : "fill-warm-400"
            }`}
          >
            {abbrev}
          </text>
        ))}

        {/* Data points on the temperature line */}
        {climate.map((month, i) => (
          <circle
            key={`point-${i}`}
            cx={monthToX(i)}
            cy={tempToY(month.tempHigh)}
            r={hoveredMonth === i ? 6 : 4}
            fill={isInComfort(month.tempHigh) ? "#C4A77D" : "#57534E"}
            className="transition-all duration-150"
          />
        ))}

        {/* Interactive hover areas */}
        {climate.map((month, i) => (
          <rect
            key={`hover-${i}`}
            x={monthToX(i) - 25}
            y={0}
            width={50}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHoveredMonth(i)}
                                onClick={() => setHoveredMonth(i)}
            onMouseLeave={() => setHoveredMonth(null)}
            style={{ cursor: "pointer" }}
          />
        ))}

        {/* Hover tooltip */}
        {hoveredMonth !== null && (
          <g>
            <rect
              x={monthToX(hoveredMonth) - 55}
              y={padding.top - 5}
              width={110}
              height={70}
              fill="white"
              stroke="#E5E3DF"
              strokeWidth="1"
              rx="4"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
            />
            <text
              x={monthToX(hoveredMonth)}
              y={padding.top + 15}
              textAnchor="middle"
              className="text-[13px] fill-charcoal font-medium"
            >
              {climate[hoveredMonth].month}
            </text>
            <text
              x={monthToX(hoveredMonth)}
              y={padding.top + 32}
              textAnchor="middle"
              className="text-[12px] fill-charcoal"
            >
              {climate[hoveredMonth].tempHigh}° / {climate[hoveredMonth].tempLow}°C
              {isInComfort(climate[hoveredMonth].tempHigh) && (
                <tspan className="fill-amber-700"> · in comfort</tspan>
              )}
            </text>
            <text
              x={monthToX(hoveredMonth)}
              y={padding.top + 48}
              textAnchor="middle"
              className="text-[11px] fill-warm-500"
            >
              {climate[hoveredMonth].rainfall}mm rain · {climate[hoveredMonth].daylightHours}h daylight
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs text-warm-400">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-3 rounded-sm"
            style={{ backgroundColor: "rgba(196, 167, 125, 0.3)" }}
          />
          <span>Comfort zone (21-28°C)</span>
        </div>
        {showRainfall && (
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-3 rounded-sm"
              style={{ backgroundColor: "rgba(147, 197, 253, 0.5)" }}
            />
            <span>Rainfall</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-charcoal" />
          <span>High temperature</span>
        </div>
      </div>
    </div>
  );
}
