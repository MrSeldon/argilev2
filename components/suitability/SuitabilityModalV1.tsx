"use client";

import { useState, useEffect } from "react";
import { ForWinnie, PlaceLife, type PlaceLifeData } from "./PlaceLife";
import { SuitabilityLocation } from "@/lib/types";

interface SuitabilityModalV1Props {
  locationData: SuitabilityLocation;
  onClose: () => void;
}

// V1 modal code extracted from LegacyApp.tsx
// DO NOT MODIFY except to fix imports and TypeScript types
export function SuitabilityModalV1({ locationData, onClose }: SuitabilityModalV1Props) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedKigaliHour, setSelectedKigaliHour] = useState<number | null>(null);
  const [ccMode, setCcMode] = useState(false);
  const life = locationData as unknown as PlaceLifeData;
  const fashion = (locationData as { cc?: { fashionEcosystem?: { clothingMfg?: string; fabricSourcing?: string; vintageThrift?: string; danceTheatre?: string; places?: { name: string; kind?: string; what?: string; neighborhood?: string; notes?: string; url?: string }[] } } } | undefined)?.cc?.fashionEcosystem;
  const trim = (locationData as { cc?: { trimWorkOpportunities?: { available?: boolean; season?: string; notes?: string } } } | undefined)?.cc?.trimWorkOpportunities;
  const weed = (locationData as { cc?: { probabilityOfWeed?: { score?: number; status?: string; notes?: string } } } | undefined)?.cc?.probabilityOfWeed;
  const [hoveredChili, setHoveredChili] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [hoveredBeach, setHoveredBeach] = useState(false);
  const [snekRevealStep, setSnekRevealStep] = useState(0);
  const [localColorOpen, setLocalColorOpen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Helper to get temperature from either V1 or V2 format
  const getTempHigh = (month: { avgHigh?: number; tempHigh?: number }) => month.tempHigh ?? month.avgHigh ?? 20;
  const getTempLow = (month: { avgLow?: number; tempLow?: number }) => month.tempLow ?? month.avgLow ?? 10;

  // Calculate suitability score
  const calculateScore = () => {
    let score = 0;
    let factors = 0;

    // Climate comfort (0-25 points)
    if (locationData?.climate && Array.isArray(locationData.climate)) {
      const comfortMonths = locationData.climate.filter((m) => {
        const high = getTempHigh(m);
        return high >= 21 && high <= 28;
      }).length;
      score += Math.round((comfortMonths / 12) * 25);
      factors++;
    }

    // Ceramics ecosystem (0-25 points)
    if (locationData?.ceramicsEcosystem) {
      const eco = locationData.ceramicsEcosystem;
      let ecoScore = 0;
      if (eco.studios) ecoScore += typeof eco.studios === 'string' ? 8 : (Array.isArray(eco.studios) ? Math.min(eco.studios.length * 2, 8) : 8);
      if (eco.suppliers) ecoScore += typeof eco.suppliers === 'string' ? 8 : (Array.isArray(eco.suppliers) ? Math.min(eco.suppliers.length * 2, 8) : 8);
      if (eco.galleries) ecoScore += typeof eco.galleries === 'string' ? 8 : (Array.isArray(eco.galleries) ? Math.min(eco.galleries.length * 2, 8) : 8);
      score += Math.min(ecoScore, 25);
      factors++;
    }

    // Time zone overlap with Kigali (0-25 points)
    if (locationData?.utcOffset !== undefined) {
      const kigaliOffset = 2;
      const destOffset = typeof locationData.utcOffset === 'number' ? locationData.utcOffset : parseInt(locationData.utcOffset as string) || 0;
      const diff = Math.abs(destOffset - kigaliOffset);
      // Perfect overlap = 25, each hour difference = -3 points
      score += Math.max(0, 25 - (diff * 3));
      factors++;
    }

    // Probability of Chili (0-10 points)
    if (locationData?.probabilityOfChili) {
      const chiliScore = locationData.probabilityOfChili.score;
      // Handle both string (V1) and number (V2) formats
      if (typeof chiliScore === 'string') {
        if (chiliScore === 'A') score += 10;
        else if (chiliScore === 'B') score += 7;
        else if (chiliScore === 'C') score += 5;
        else if (chiliScore === 'D') score += 2;
      } else if (typeof chiliScore === 'number') {
        // V2 format - numeric score
        score += Math.min(Math.round(chiliScore / 10), 10);
      }
      factors++;
    }

    // Beach access (0-15 points)
    if (locationData?.beachAccess) {
      const beach = locationData.beachAccess;
      const distStr = (beach as { drivingDistance?: string }).drivingDistance ?? beach.distance;
      if (distStr) {
        const dist = parseInt(distStr);
        if (dist <= 30) score += 15;
        else if (dist <= 60) score += 12;
        else if (dist <= 120) score += 8;
        else score += 4;
        factors++;
      }
    }

    // Normalize to 100 if we have factors
    if (factors > 0) {
      return Math.round(score);
    }

    return 72; // Default
  };

  const score = calculateScore();

  // Generate a summary based on the data
  const generateSummary = () => {
    const parts: string[] = [];

    if (locationData?.ceramicsEcosystem?.community) {
      const community = locationData.ceramicsEcosystem.community;
      if (typeof community === 'string') {
        parts.push(community);
      } else if (Array.isArray(community) && community.length > 0) {
        const firstItem = community[0];
        if (typeof firstItem === 'string') {
          parts.push(firstItem);
        } else if (firstItem?.notes) {
          parts.push(firstItem.notes);
        }
      }
    }

    if (locationData?.practicalInfo) {
      const info = locationData.practicalInfo;
      // Build a summary from available practical info fields
      const infoParts: string[] = [];
      if (info.language) infoParts.push(`Language: ${info.language}`);
      if (info.visaInfo) infoParts.push(info.visaInfo);
      if (infoParts.length > 0) {
        parts.push(infoParts.join('. '));
      }
    }

    if (parts.length > 0) {
      return parts.join(' ');
    }

    // Default summary
    return `A destination with unique characteristics for ceramics exploration and creative work.`;
  };

  const summary = generateSummary();

  // Month abbreviations for climate chart
  const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

  // Helper to normalize localColor data to array format
  type LocalColorItem = { event?: string; name?: string; description?: string; notes?: string; timing?: string; month?: string; season?: string; color?: string };
  const getLocalColorArray = (): LocalColorItem[] => {
    const lc = locationData?.localColor;
    if (!lc) return [];
    // V1 format: array
    if (Array.isArray(lc)) return lc;
    // V2 format: object with blooms/festivals/naturalPhenomena
    const items: LocalColorItem[] = [];
    const lcObj = lc as { blooms?: { name: string; month?: string; notes?: string }[]; festivals?: { name: string; month?: string; notes?: string }[]; naturalPhenomena?: { name: string; season?: string; notes?: string }[] };
    if (lcObj.blooms) {
      lcObj.blooms.forEach(b => items.push({ event: b.name, description: b.notes, timing: b.month, color: '#f472b6' }));
    }
    if (lcObj.festivals) {
      lcObj.festivals.forEach(f => items.push({ event: f.name, description: f.notes, timing: f.month, color: '#fbbf24' }));
    }
    if (lcObj.naturalPhenomena) {
      lcObj.naturalPhenomena.forEach(n => items.push({ event: n.name, description: n.notes, timing: n.season, color: '#34d399' }));
    }
    return items;
  };

  const localColorItems = getLocalColorArray();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#faf8f5',
          borderRadius: '8px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e7e5e4', position: 'sticky', top: 0, backgroundColor: '#faf8f5', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
            <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: 0 }}>SUITABILITY INDEX</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
              {/* Score Badge */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#F5EFE6',
                border: '1px solid #D4C8B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#292524' }}>{score}</span>
              </div>
              {/* CC Mode Toggle */}
              <button
                onClick={() => setCcMode(!ccMode)}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.625rem',
                  backgroundColor: ccMode ? '#e0f2f1' : 'transparent',
                  border: `1px solid ${ccMode ? '#80cbc4' : '#e7e5e4'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  color: ccMode ? '#00695c' : '#78716c'
                }}
              >
                CC Mode
              </button>
              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#a8a29e',
                  padding: '0.25rem'
                }}
              >
                &times;
              </button>
            </div>
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#292524', margin: '0.5rem 0 0', lineHeight: 1.2 }}>
            {locationData.location}
          </h2>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {summary && !life.forWinnie && (   /* places with a note for Winnie open on that instead; the practical details follow below */
            <p style={{ fontSize: '0.875rem', color: '#57534e', margin: '0 0 2rem', lineHeight: 1.65 }}>{summary}</p>
          )}
          {(() => {
            return (
              <>
                {!ccMode && <ForWinnie data={life} />}
                {/* Climate Almanac - Tufte-inspired */}
                {locationData?.climate && Array.isArray(locationData.climate) && locationData.climate.length > 0 && (() => {
                  const climate = locationData.climate;

                  // Chart dimensions
                  const chartWidth = 680;
                  const chartHeight = 180;
                  const padding = { top: 20, right: 30, bottom: 45, left: 35 };
                  const graphWidth = chartWidth - padding.left - padding.right;
                  const graphHeight = chartHeight - padding.top - padding.bottom;

                  // Temperature range
                  const allTemps = climate.flatMap((m) => [getTempHigh(m), getTempLow(m)]);
                  const minTemp = Math.min(...allTemps, 0);
                  const maxTemp = Math.max(...allTemps, 35);
                  const tempRange = maxTemp - minTemp;

                  // Comfort zone: 21-28°C
                  const comfortLow = 21;
                  const comfortHigh = 28;

                  // Scale functions
                  const xScale = (i: number) => padding.left + (i / 11) * graphWidth;
                  const yScale = (temp: number) => padding.top + graphHeight - ((temp - minTemp) / tempRange) * graphHeight;

                  // Build average temperature path
                  const tempPath = climate.map((m, i: number) => {
                    const avgTemp = (getTempHigh(m) + getTempLow(m)) / 2;
                    const x = xScale(i);
                    const y = yScale(avgTemp);
                    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                  }).join(' ');

                  // Build high/low area path (the gradient fill area)
                  const areaPath = [
                    ...climate.map((m, i: number) => {
                      const x = xScale(i);
                      const y = yScale(getTempHigh(m));
                      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                    }),
                    ...climate.slice().reverse().map((m, i: number) => {
                      const x = xScale(11 - i);
                      const y = yScale(getTempLow(m));
                      return `L ${x} ${y}`;
                    }),
                    'Z'
                  ].join(' ');

                  // Event colors for local color markers
                  const eventColors: Record<string, string> = {
                    bloom: '#D4A5A5',
                    festival: '#C4A77D',
                    foliage: '#C9A86C',
                    default: '#a8a29e'
                  };

                  return (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: '0 0 1rem' }}>CLIMATE ALMANAC</p>

                      {/* SVG Chart */}
                      <svg width="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: 'visible' }}>
                        {/* Comfort zone band */}
                        <rect
                          x={padding.left}
                          y={yScale(comfortHigh)}
                          width={graphWidth}
                          height={Math.max(0, yScale(comfortLow) - yScale(comfortHigh))}
                          fill="#C4A77D"
                          opacity={0.12}
                        />
                        <text x={chartWidth - padding.right + 4} y={yScale((comfortLow + comfortHigh) / 2)} fontSize="8" fill="#a8a29e" dominantBaseline="middle">comfort</text>

                        {/* Y-axis labels and grid lines */}
                        {[0, 10, 20, 30].filter(t => t >= minTemp && t <= maxTemp).map(temp => (
                          <g key={temp}>
                            <text x={padding.left - 8} y={yScale(temp)} fontSize="9" fill="#a8a29e" textAnchor="end" dominantBaseline="middle">{temp}°</text>
                            <line x1={padding.left} y1={yScale(temp)} x2={padding.left + graphWidth} y2={yScale(temp)} stroke="#e7e5e4" strokeWidth="0.5" strokeDasharray="2,4" />
                          </g>
                        ))}

                        {/* Temperature range area (subtle gradient fill) */}
                        <path d={areaPath} fill="#8B7355" opacity={0.08} />

                        {/* Temperature curve (main line) */}
                        <path d={tempPath} fill="none" stroke="#57534e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                        {/* Data points with hover and rainfall */}
                        {climate.map((m, i: number) => {
                          const avgTemp = (getTempHigh(m) + getTempLow(m)) / 2;
                          const x = xScale(i);
                          const y = yScale(avgTemp);
                          const isHovered = hoveredMonth === i;
                          const inComfort = avgTemp >= comfortLow && avgTemp <= comfortHigh;

                          // Rainfall as countable squares
                          const rainBlocks = Math.round((m.rainfall || 0) / 20);
                          const blockSize = 6;
                          const blockGap = 2;

                          // Check for events in this month
                          const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                          const monthEvents = localColorItems.filter((event) => {
                            const timing = (event.timing || event.month || event.season || '').toUpperCase();
                            return timing.includes(monthNames[i]) || timing === 'YEAR-ROUND';
                          });

                          return (
                            <g key={i}>
                              {/* Hover target area */}
                              <rect
                                x={x - graphWidth / 24}
                                y={padding.top}
                                width={graphWidth / 12}
                                height={graphHeight}
                                fill="transparent"
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={() => setHoveredMonth(i)}
                                onClick={() => setHoveredMonth(i)}
                                onMouseLeave={() => setHoveredMonth(null)}
                              />

                              {/* Rainfall blocks */}
                              {Array.from({ length: rainBlocks }).map((_, bi) => (
                                <rect
                                  key={bi}
                                  x={x - blockSize / 2}
                                  y={padding.top + graphHeight - (bi + 1) * (blockSize + blockGap)}
                                  width={blockSize}
                                  height={blockSize}
                                  rx={1}
                                  fill="#93C5FD"
                                  opacity={0.5}
                                />
                              ))}

                              {/* Temperature point */}
                              <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? 5 : 3}
                                fill={inComfort ? '#C4A77D' : '#57534e'}
                                stroke={isHovered ? '#292524' : 'none'}
                                strokeWidth={isHovered ? 1.5 : 0}
                                style={{ transition: 'r 0.15s' }}
                              />

                              {/* Event markers above chart */}
                              {monthEvents.map((ev, ei) => (
                                <circle
                                  key={ei}
                                  cx={x}
                                  cy={padding.top - 8}
                                  r={4}
                                  fill={ev.color || eventColors.default}
                                />
                              ))}
                            </g>
                          );
                        })}

                        {/* Month labels */}
                        {MONTHS.map((m, i) => (
                          <text
                            key={i}
                            x={xScale(i)}
                            y={chartHeight - 8}
                            fontSize="10"
                            fill={hoveredMonth === i ? '#57534e' : '#a8a29e'}
                            textAnchor="middle"
                            fontWeight={hoveredMonth === i ? 500 : 400}
                          >{m}</text>
                        ))}
                      </svg>

                      {/* Hover tooltip */}
                      {hoveredMonth !== null && (() => {
                        const m = climate[hoveredMonth];
                        const avgTemp = (getTempHigh(m) + getTempLow(m)) / 2;
                        const inComfort = avgTemp >= comfortLow && avgTemp <= comfortHigh;
                        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                        const monthName = (m as { month?: string }).month || monthNames[hoveredMonth];

                        return (
                          <div style={{
                            position: 'relative',
                            marginTop: '-0.5rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: '#faf8f5',
                            borderLeft: `3px solid ${inComfort ? '#C4A77D' : '#a8a29e'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                          }}>
                            <div>
                              <span style={{ fontSize: '0.875rem', color: '#292524', fontWeight: 500 }}>{monthName}</span>
                              <span style={{ fontSize: '0.75rem', color: '#78716c', marginLeft: '0.75rem' }}>
                                {getTempHigh(m)}° / {getTempLow(m)}°C
                              </span>
                              {inComfort && (
                                <span style={{ fontSize: '0.625rem', color: '#8B7355', marginLeft: '0.5rem' }}>• in comfort zone</span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.6875rem', color: '#78716c' }}>
                              {m.rainfall || 0}mm rain{(m as { daylightHours?: number }).daylightHours ? ` · ${(m as { daylightHours?: number }).daylightHours}h daylight` : ''}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Legend */}
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.5625rem', color: '#a8a29e', marginTop: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ width: 16, height: 8, backgroundColor: '#C4A77D', opacity: 0.2 }} /> Comfort zone (21-28°C)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ width: 6, height: 6, backgroundColor: '#93C5FD', opacity: 0.5 }} /> 20mm rain
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#D4A5A5' }} /> Event
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Seasonal Rhythm */}
                {locationData?.seasons && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: '0 0 1rem' }}>SEASONAL RHYTHM</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#e7e5e4' }}>
                      {(['winter', 'spring', 'summer', 'autumn'] as const).map((season) => {
                        const seasonData = locationData.seasons?.[season];
                        const dates: Record<string, string> = { winter: 'Dec-Feb', spring: 'Mar-May', summer: 'Jun-Aug', autumn: 'Sep-Nov' };
                        return (
                          <div key={season} style={{ padding: '1rem', backgroundColor: '#faf8f5' }}>
                            <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.25rem', letterSpacing: '0.1em' }}>{season.toUpperCase()}</p>
                            <p style={{ fontSize: '0.625rem', color: '#78716c', margin: '0 0 0.5rem' }}>{dates[season]}</p>
                            {seasonData && (
                              <p style={{ fontSize: '0.75rem', color: '#57534e', margin: 0, lineHeight: 1.5 }}>
                                {seasonData.summary || 'Data coming soon'}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Local Color - Hidden in CC Mode, Collapsible */}
                {!ccMode && localColorItems.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <button
                      onClick={() => setLocalColorOpen(!localColorOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        marginBottom: localColorOpen ? '1rem' : 0
                      }}
                    >
                      <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: 0 }}>LOCAL COLOR</p>
                      <span style={{ fontSize: '0.625rem', color: '#a8a29e', transform: localColorOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
                      <span style={{ fontSize: '0.5625rem', color: '#a8a29e' }}>({localColorItems.length})</span>
                    </button>
                    {localColorOpen && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {localColorItems.map((item, index: number) => (
                          <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: item.color || '#C4A77D',
                              marginTop: '0.375rem',
                              flexShrink: 0
                            }} />
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.8125rem', color: '#292524', margin: '0 0 0.25rem', fontWeight: 500 }}>{item.event || item.name}</p>
                              <p style={{ fontSize: '0.75rem', color: '#78716c', margin: 0, lineHeight: 1.5 }}>{item.description || item.notes}</p>
                            </div>
                            <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: 0, whiteSpace: 'nowrap' }}>{item.timing || item.month || item.season}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Ceramics Ecosystem / Fashion Ecosystem in CC Mode */}
                {locationData?.ceramicsEcosystem && !ccMode && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: '0 0 1rem' }}>CERAMICS ECOSYSTEM</p>
                    {(locationData.ceramicsEcosystem.studios || locationData.ceramicsEcosystem.suppliers || locationData.ceramicsEcosystem.galleries) ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', backgroundColor: '#e7e5e4' }}>
                        {locationData.ceramicsEcosystem.studios && (
                          <div style={{ padding: '1rem', backgroundColor: '#faf8f5' }}>
                            <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>STUDIOS</p>
                            {Array.isArray(locationData.ceramicsEcosystem.studios) ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                {locationData.ceramicsEcosystem.studios.slice(0, 3).map((studio: string | { name: string; url?: string }, i: number) => {
                                  const name = typeof studio === 'string' ? studio : studio.name;
                                  const url = typeof studio === 'object' ? studio.url : null;
                                  return url ? (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#292524', textDecoration: 'underline' }}>{name}</a>
                                  ) : (
                                    <p key={i} style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>{name}</p>
                                  );
                                })}
                              </div>
                            ) : (
                              <p style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>{typeof locationData.ceramicsEcosystem.studios === 'string' ? locationData.ceramicsEcosystem.studios : ''}</p>
                            )}
                          </div>
                        )}
                        {locationData.ceramicsEcosystem.suppliers && (
                          <div style={{ padding: '1rem', backgroundColor: '#faf8f5' }}>
                            <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>SUPPLIERS</p>
                            {Array.isArray(locationData.ceramicsEcosystem.suppliers) ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                {locationData.ceramicsEcosystem.suppliers.slice(0, 3).map((supplier: string | { name: string; url?: string }, i: number) => {
                                  const name = typeof supplier === 'string' ? supplier : supplier.name;
                                  const url = typeof supplier === 'object' ? supplier.url : null;
                                  return url ? (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#292524', textDecoration: 'underline' }}>{name}</a>
                                  ) : (
                                    <p key={i} style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>{name}</p>
                                  );
                                })}
                              </div>
                            ) : (
                              <p style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>{typeof locationData.ceramicsEcosystem.suppliers === 'string' ? locationData.ceramicsEcosystem.suppliers : ''}</p>
                            )}
                          </div>
                        )}
                        {locationData.ceramicsEcosystem.galleries && (
                          <div style={{ padding: '1rem', backgroundColor: '#faf8f5' }}>
                            <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>GALLERIES</p>
                            {Array.isArray(locationData.ceramicsEcosystem.galleries) ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                {locationData.ceramicsEcosystem.galleries.slice(0, 3).map((gallery: string | { name: string; url?: string }, i: number) => {
                                  const name = typeof gallery === 'string' ? gallery : gallery.name;
                                  const url = typeof gallery === 'object' ? gallery.url : null;
                                  return url ? (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8125rem', color: '#292524', textDecoration: 'underline' }}>{name}</a>
                                  ) : (
                                    <p key={i} style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>{name}</p>
                                  );
                                })}
                              </div>
                            ) : (
                              <p style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>
                                {typeof locationData.ceramicsEcosystem.galleries === 'string'
                                  ? locationData.ceramicsEcosystem.galleries
                                  : ''}
                              </p>
                            )}
                          </div>
                        )}
                        {locationData.ceramicsEcosystem.community && (
                          <div style={{ padding: '1rem', backgroundColor: '#faf8f5' }}>
                            <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>COMMUNITY</p>
                            <p style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>
                              {typeof locationData.ceramicsEcosystem.community === 'string'
                                ? locationData.ceramicsEcosystem.community
                                : Array.isArray(locationData.ceramicsEcosystem.community)
                                  ? locationData.ceramicsEcosystem.community.map(c => typeof c === 'string' ? c : c.name).join(', ')
                                  : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ padding: '1rem', backgroundColor: '#faf8f5', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.75rem', color: '#a8a29e', margin: 0, fontStyle: 'italic' }}>Data coming soon</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Fashion Ecosystem - CC Mode only */}
                {ccMode && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '0.5625rem', color: '#00695c', letterSpacing: '0.15em', margin: '0 0 1rem' }}>FASHION ECOSYSTEM</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1px', backgroundColor: '#80cbc4' }}>
                      {/* Clothing Manufacturing */}
                      <div style={{ padding: '1rem', backgroundColor: '#e0f2f1' }}>
                        <p style={{ fontSize: '0.5rem', color: '#00695c', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>CLOTHING MFG</p>
                        <p style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>
                          {fashion?.clothingMfg || (locationData?.country === 'Italy' || locationData?.country === 'France' ? 'High-end ateliers' :
                           locationData?.country === 'Japan' ? 'Precision craftwork' :
                           locationData?.country === 'USA' ? 'Indie designers' : 'Local production')}
                        </p>
                      </div>

                      {/* Fabric Sourcing */}
                      <div style={{ padding: '1rem', backgroundColor: '#e0f2f1' }}>
                        <p style={{ fontSize: '0.5rem', color: '#00695c', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>FABRIC SOURCING</p>
                        <p style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>
                          {fashion?.fabricSourcing || (locationData?.country === 'Japan' ? 'Premium denim, indigo' :
                           locationData?.country === 'Italy' ? 'Silk, wool, leather' :
                           locationData?.country === 'India' ? 'Cotton, textiles' : 'Local materials')}
                        </p>
                      </div>

                      {/* Vintage/Thrift */}
                      <div style={{ padding: '1rem', backgroundColor: '#e0f2f1' }}>
                        <p style={{ fontSize: '0.5rem', color: '#00695c', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>VINTAGE & THRIFT</p>
                        <p style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>
                          {fashion?.vintageThrift || (locationData?.country === 'Japan' ? 'Excellent selection' :
                           locationData?.country === 'USA' || locationData?.country === 'UK' ? 'Strong scene' : 'Growing')}
                        </p>
                      </div>

                      {/* Dance/Theatre */}
                      <div style={{ padding: '1rem', backgroundColor: '#e0f2f1' }}>
                        <p style={{ fontSize: '0.5rem', color: '#00695c', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>DANCE & THEATRE</p>
                        <p style={{ fontSize: '0.8125rem', color: '#292524', margin: 0 }}>
                          {fashion?.danceTheatre || (locationData?.city?.includes('New York') || locationData?.city?.includes('London') ? 'World-class' :
                           locationData?.country === 'Japan' ? 'Traditional & contemporary' : 'Local scene')}
                        </p>
                      </div>
                    </div>
                    {fashion?.places && fashion.places.length > 0 && (
                      <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0' }}>
                        {fashion.places.map((pl) => (
                          <li key={pl.name} style={{ padding: '0.5rem 0', borderTop: '1px solid #b2dfdb', fontSize: '0.8125rem', lineHeight: 1.5 }}>
                            {pl.url ? <a href={pl.url} target="_blank" rel="noopener noreferrer" style={{ color: '#004d40', textDecoration: 'underline', textUnderlineOffset: 3 }}>{pl.name}</a> : <span style={{ color: '#004d40' }}>{pl.name}</span>}
                            {(pl.notes || pl.what || pl.neighborhood) && <span style={{ color: '#4f6f6a' }}> · {pl.notes || [pl.what, pl.neighborhood].filter(Boolean).join(' · ')}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {!ccMode && <PlaceLife data={life} />}
                {/* Beach & Escape */}
                {locationData?.beachAccess && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: '0 0 1rem' }}>BEACH & ESCAPE</p>
                    <div
                      style={{ padding: '1.25rem', backgroundColor: '#faf8f5', borderLeft: '3px solid #60a5fa', position: 'relative' }}
                      onMouseEnter={() => setHoveredBeach(true)}
                      onClick={() => setHoveredBeach(true)}
                      onMouseLeave={() => setHoveredBeach(false)}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#292524' }}>{locationData.beachAccess.distance}</span>
                        <span style={{ fontSize: '0.875rem', color: '#78716c' }}>{locationData.beachAccess.type}</span>
                      </div>
                      {locationData.beachAccess.beaches && locationData.beachAccess.beaches.length > 0 && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                          {locationData.beachAccess.beaches.slice(0, 3).map((beach, i) => (
                            <span key={i} style={{ fontSize: '0.75rem', color: '#57534e', padding: '0.25rem 0.5rem', backgroundColor: '#e0f2fe', borderRadius: '2px' }}>{beach}</span>
                          ))}
                        </div>
                      )}
                      {locationData.beachAccess.swimmable && (
                        <p style={{ fontSize: '0.75rem', color: '#78716c', margin: '0 0 0.5rem' }}>
                          Swimmable: {locationData.beachAccess.swimmable}
                        </p>
                      )}
                      {locationData.beachAccess.notes && (
                        <p style={{ fontSize: '0.75rem', color: '#78716c', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                          {locationData.beachAccess.notes}
                        </p>
                      )}
                      {locationData.beachAccess.nearestBeachFlight && (
                        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e7e5e4' }}>
                          <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.05em' }}>NEAREST BEACH ESCAPE</p>
                          <p style={{ fontSize: '0.8125rem', color: '#292524', margin: '0 0 0.25rem' }}>
                            {locationData.beachAccess.nearestBeachFlight.destination} &rarr; {locationData.beachAccess.nearestBeachFlight.beach}
                          </p>
                          <p style={{ fontSize: '0.6875rem', color: '#78716c', margin: 0 }}>
                            {locationData.beachAccess.nearestBeachFlight.flightDuration} &middot; ~{locationData.beachAccess.nearestBeachFlight.approximateCost}
                          </p>
                        </div>
                      )}
                      {hoveredBeach && (
                        <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, backgroundColor: '#292524', color: 'white', padding: '0.875rem', fontSize: '0.6875rem', zIndex: 10, marginBottom: '4px' }}>
                          <p style={{ margin: '0 0 0.5rem', fontWeight: 500, fontSize: '0.75rem' }}>Beach Escape</p>
                          <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.6 }}>
                            Winnie needs occasional ocean therapy. This measures access to beach getaways for creative reset.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Probability of Chili / Probability of Weed in CC Mode */}
                {locationData?.probabilityOfChili && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <p style={{ fontSize: '0.5625rem', color: ccMode ? '#00695c' : '#a8a29e', letterSpacing: '0.15em', margin: '0 0 1rem' }}>
                      {ccMode ? 'PROBABILITY OF WEED' : 'PROBABILITY OF CHILI\u2122'}
                    </p>
                    <div
                      style={{ padding: '1.25rem', backgroundColor: ccMode ? '#e0f2f1' : '#faf8f5', borderLeft: `3px solid ${ccMode ? '#22c55e' : '#C4A77D'}`, position: 'relative' }}
                      onMouseEnter={() => setHoveredChili(true)}
                      onClick={() => setHoveredChili(true)}
                      onMouseLeave={() => setHoveredChili(false)}
                    >
                      {ccMode ? (
                        <>
                          {/* CC Mode: Weed Probability */}
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#292524' }}>
                              {weedGrade(weed?.score)}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: '#78716c' }}>{weed?.status || 'Not researched yet'}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: '#78716c', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                            {weed?.notes || 'Research local laws carefully before arrival.'}
                          </p>
                        </>
                      ) : (
                        <>
                          {/* Normal Mode: Chili Probability */}
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <span style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#292524' }}>{locationData.probabilityOfChili.score}</span>
                            <span style={{ fontSize: '0.875rem', color: '#78716c' }}>{locationData.probabilityOfChili.rating}</span>
                          </div>
                          {locationData.probabilityOfChili.nearest && (
                            <p style={{ fontSize: '0.75rem', color: '#57534e', margin: '0 0 0.5rem' }}>
                              Nearest: {locationData.probabilityOfChili.nearest}
                            </p>
                          )}
                          {locationData.probabilityOfChili.notes && (
                            <p style={{ fontSize: '0.75rem', color: '#78716c', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                              {locationData.probabilityOfChili.notes}
                            </p>
                          )}
                        </>
                      )}
                      {hoveredChili && !ccMode && (
                        <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, backgroundColor: '#292524', color: 'white', padding: '0.875rem', fontSize: '0.6875rem', zIndex: 10, marginBottom: '4px' }}>
                          <p style={{ margin: '0 0 0.5rem', fontWeight: 500, fontSize: '0.75rem' }}>What is this?</p>
                          <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.6 }}>
                            Probability of Chili&trade; began with Winnie&apos;s first taste at The River Time bar in Guerneville.
                            That single bite became her favorite food discovery. The score represents likelihood of finding
                            a satisfying bowl within reasonable distance.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Food Constellation - Numeric Scores */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: '0 0 1rem' }}>FOOD CONSTELLATION</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1px', backgroundColor: '#e7e5e4' }}>
                    {/* Probability of Chili - Score 1 */}
                    <div style={{ padding: '1rem', backgroundColor: '#faf8f5' }}>
                      <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>CHILI</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#292524' }}>
                          {(() => {
                            const chiliScore = locationData?.probabilityOfChili?.score;
                            if (typeof chiliScore === 'string') {
                              return chiliScore === 'A' ? '95' : chiliScore === 'B' ? '75' : chiliScore === 'C' ? '55' : '35';
                            }
                            if (typeof chiliScore === 'number') {
                              return chiliScore;
                            }
                            return '50';
                          })()}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#78716c' }}>
                          {locationData?.probabilityOfChili?.rating || 'Moderate'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0.25rem 0 0', fontStyle: 'italic' }}>Bowl of red</p>
                    </div>

                    {/* Chocolate Cake - Score 2 */}
                    <div style={{ padding: '1rem', backgroundColor: '#faf8f5' }}>
                      <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>CHOCOLATE CAKE</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#292524' }}>
                          {locationData?.country === 'USA' || locationData?.country === 'France' || locationData?.country === 'Belgium' ? '90' :
                           locationData?.country === 'Japan' || locationData?.country === 'UK' || locationData?.country === 'Austria' ? '85' :
                           locationData?.country === 'Italy' || locationData?.country === 'Germany' ? '80' : '70'}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#78716c' }}>
                          {locationData?.country === 'USA' || locationData?.country === 'France' || locationData?.country === 'Belgium' ? 'Excellent' :
                           locationData?.country === 'Japan' || locationData?.country === 'UK' ? 'Good' : 'Available'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0.25rem 0 0', fontStyle: 'italic' }}>Flourless preferred</p>
                    </div>

                    {/* Location-specific specialty - Score 3 */}
                    <div style={{ padding: '1rem', backgroundColor: '#faf8f5' }}>
                      <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>
                        {locationData?.country === 'Japan' ? 'WAGASHI' :
                         locationData?.country === 'France' ? 'PATISSERIE' :
                         locationData?.country === 'Italy' ? 'GELATO' :
                         locationData?.country === 'Mexico' ? 'PAN DULCE' :
                         locationData?.country === 'Portugal' ? 'PASTÉIS' :
                         locationData?.country === 'Austria' ? 'TORTE' : 'LOCAL SWEET'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#292524' }}>
                          {locationData?.country === 'France' || locationData?.country === 'Austria' || locationData?.country === 'Belgium' ? '95' :
                           locationData?.country === 'Japan' || locationData?.country === 'Italy' ? '90' :
                           locationData?.country === 'Portugal' || locationData?.country === 'Mexico' ? '85' : '75'}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#78716c' }}>
                          {locationData?.country === 'Japan' ? 'Traditional & artisan' :
                           locationData?.country === 'France' ? 'World-class' :
                           locationData?.country === 'Italy' ? 'Artisanal' : 'Local specialty'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CC Overlap - Time Zone */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '0.6875rem', color: '#a8a29e', letterSpacing: '0.1em', margin: '0 0 1rem' }}>CC OVERLAP</h3>
                  <div style={{ padding: '1.25rem', backgroundColor: 'white', border: '1px solid #e7e5e4' }}>
                    {(() => {
                      const kigaliOffset = 2;
                      const destinationOffset = typeof locationData?.utcOffset === 'number' ? locationData.utcOffset : parseInt(locationData?.utcOffset as string) || 0;
                      const utcHours = currentTime.getUTCHours();
                      const utcMinutes = currentTime.getUTCMinutes();
                      const currentKigaliHour = (utcHours + kigaliOffset + 24) % 24;
                      const timeDiff = destinationOffset - kigaliOffset;

                      const displayKigaliHour = selectedKigaliHour !== null ? selectedKigaliHour : currentKigaliHour;
                      const displayDestHour = (displayKigaliHour + timeDiff + 24) % 24;
                      const displayMinutes = selectedKigaliHour !== null ? 0 : utcMinutes;

                      return (
                        <>
                          {/* Interactive time display with slider */}
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '1rem' }}>
                              <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.5625rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.05em' }}>KIGALI (WINNIE)</p>
                                <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#292524', margin: 0 }}>
                                  {displayKigaliHour.toString().padStart(2, '0')}:{displayMinutes.toString().padStart(2, '0')}
                                </p>
                                <p style={{ fontSize: '0.625rem', color: '#78716c', margin: '0.25rem 0 0' }}>
                                  {displayKigaliHour >= 6 && displayKigaliHour < 12 ? 'Morning' :
                                   displayKigaliHour >= 12 && displayKigaliHour < 18 ? 'Afternoon' :
                                   displayKigaliHour >= 18 && displayKigaliHour < 22 ? 'Evening' : 'Night'}
                                </p>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.75rem', color: '#a8a29e', margin: 0 }}>{timeDiff >= 0 ? '+' : ''}{timeDiff}h</p>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.5625rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.05em' }}>DESTINATION (YOU)</p>
                                <p style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: '#292524', margin: 0 }}>
                                  {displayDestHour.toString().padStart(2, '0')}:{displayMinutes.toString().padStart(2, '0')}
                                </p>
                                <p style={{ fontSize: '0.625rem', color: '#78716c', margin: '0.25rem 0 0' }}>
                                  {displayDestHour >= 6 && displayDestHour < 12 ? 'Morning' :
                                   displayDestHour >= 12 && displayDestHour < 18 ? 'Afternoon' :
                                   displayDestHour >= 18 && displayDestHour < 22 ? 'Evening' : 'Night'}
                                </p>
                              </div>
                            </div>

                            {/* Slider */}
                            <div style={{ padding: '0 0.5rem' }}>
                              <input
                                type="range"
                                min="0"
                                max="23"
                                value={selectedKigaliHour !== null ? selectedKigaliHour : currentKigaliHour}
                                onChange={(e) => setSelectedKigaliHour(parseInt(e.target.value))}
                                style={{ width: '100%', cursor: 'pointer' }}
                              />
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                                <button
                                  onClick={() => setSelectedKigaliHour(null)}
                                  style={{
                                    fontSize: '0.5625rem',
                                    color: selectedKigaliHour === null ? '#292524' : '#a8a29e',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: selectedKigaliHour === null ? 'underline' : 'none'
                                  }}
                                >
                                  &larr; Now
                                </button>
                                <span style={{ fontSize: '0.5625rem', color: '#a8a29e' }}>Drag to pick a time</span>
                              </div>
                            </div>
                          </div>

                          {/* Day/Night visualization */}
                          <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: '1rem' }}>
                            <p style={{ fontSize: '0.5625rem', color: '#a8a29e', margin: '0 0 0.75rem', letterSpacing: '0.05em' }}>DAY & NIGHT ALIGNMENT</p>

                            {/* Kigali bar */}
                            <div style={{ marginBottom: '0.375rem' }}>
                              <p style={{ fontSize: '0.5rem', color: '#78716c', margin: '0 0 0.25rem' }}>Kigali</p>
                              <div style={{ display: 'flex', height: '20px', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                                {Array.from({ length: 24 }, (_, hour) => {
                                  const isDay = hour >= 6 && hour < 22;
                                  const isSelected = hour === displayKigaliHour;
                                  return (
                                    <div
                                      key={hour}
                                      style={{
                                        flex: 1,
                                        backgroundColor: isDay ? '#fef3c7' : '#1e293b',
                                        borderLeft: hour > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                        position: 'relative'
                                      }}
                                    >
                                      {isSelected && (
                                        <div style={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          border: '2px solid #ef4444',
                                          borderRadius: '2px'
                                        }} />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Destination bar */}
                            <div style={{ marginBottom: '0.5rem' }}>
                              <p style={{ fontSize: '0.5rem', color: '#78716c', margin: '0 0 0.25rem' }}>Destination</p>
                              <div style={{ display: 'flex', height: '20px', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
                                {Array.from({ length: 24 }, (_, hour) => {
                                  const destHour = (hour + timeDiff + 24) % 24;
                                  const isDay = destHour >= 6 && destHour < 22;
                                  const isSelected = hour === displayKigaliHour;
                                  return (
                                    <div
                                      key={hour}
                                      style={{
                                        flex: 1,
                                        backgroundColor: isDay ? '#fef3c7' : '#1e293b',
                                        borderLeft: hour > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                        position: 'relative'
                                      }}
                                    >
                                      {isSelected && (
                                        <div style={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          border: '2px solid #ef4444',
                                          borderRadius: '2px'
                                        }} />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Time labels */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.5rem', color: '#a8a29e', marginBottom: '0.75rem' }}>
                              <span>12am</span>
                              <span>6am</span>
                              <span>12pm</span>
                              <span>6pm</span>
                              <span>12am</span>
                            </div>

                            {/* Legend */}
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.5625rem', color: '#78716c' }}>
                              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#fef3c7', marginRight: '4px', border: '1px solid #e7e5e4' }}></span>Awake (6am-10pm)</span>
                              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: '#1e293b', marginRight: '4px' }}></span>Sleeping</span>
                              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', border: '2px solid #ef4444', marginRight: '4px' }}></span>Selected time</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* CC Mode: everything here comes from data/suitability/ccMode.json for this place */}
                {ccMode && (
                  <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#e0f2f1', border: '1px solid #80cbc4' }}>
                    <h3 style={{ fontSize: '0.6875rem', color: '#00695c', letterSpacing: '0.1em', margin: '0 0 1rem' }}>CC MODE &mdash; FOR CECE&apos;S VISIT</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <p style={{ fontSize: '0.5625rem', color: '#00695c', margin: '0 0 0.375rem', letterSpacing: '0.05em' }}>CANNABIS FRIENDLINESS</p>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.5rem', color: '#292524' }}>{weedGrade(weed?.score)}</span>
                          <span style={{ fontSize: '0.75rem', color: '#78716c' }}>{weed?.status || 'Not researched yet'}</span>
                        </div>
                      </div>
                      {(fashion?.fabricSourcing || fashion?.vintageThrift) && (
                        <div>
                          <p style={{ fontSize: '0.5625rem', color: '#00695c', margin: '0 0 0.375rem', letterSpacing: '0.05em' }}>FABRIC & FASHION</p>
                          {fashion?.fabricSourcing && <p style={{ fontSize: '0.8125rem', color: '#44403c', margin: 0, lineHeight: 1.5 }}>{fashion.fabricSourcing}</p>}
                          {fashion?.vintageThrift && <p style={{ fontSize: '0.75rem', color: '#78716c', margin: '0.375rem 0 0', lineHeight: 1.5 }}>{fashion.vintageThrift}</p>}
                        </div>
                      )}
                    </div>

                    {weed?.notes && (
                      <div style={{ borderTop: '1px solid #80cbc4', paddingTop: '1rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.5625rem', color: '#00695c', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>THE LOCAL RULES</p>
                        <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', color: '#57534e', lineHeight: 1.6 }}>{weed.notes}</p>
                      </div>
                    )}

                    <div style={{ borderTop: '1px solid #80cbc4', paddingTop: '1rem' }}>
                      <p style={{ fontSize: '0.5625rem', color: '#00695c', margin: '0 0 0.5rem', letterSpacing: '0.05em' }}>TRIM WORK</p>
                      <p style={{ margin: 0, padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', color: '#57534e', lineHeight: 1.6 }}>
                        {trim?.notes || (trim?.available === false ? 'Not available here.' : 'Not researched for this place.')}
                        {locationData?.country === 'USA' && (
                          <span style={{ display: 'block', marginTop: '0.375rem', color: '#78716c', fontStyle: 'italic' }}>
                            Paid work, including seasonal trimming, needs US work authorization, so it isn&apos;t an option on a visitor visa.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {/* Personal Care */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: '0 0 1rem' }}>PERSONAL CARE</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {/* Pilates/Yoga */}
                    <div style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #e7e5e4', borderRadius: '4px' }}>
                      <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>PILATES & YOGA</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#292524' }}>
                          {locationData?.country === 'USA' || locationData?.country === 'UK' || locationData?.country === 'Australia' ? 'A' :
                           locationData?.country === 'Japan' || locationData?.country === 'Germany' || locationData?.country === 'Netherlands' ? 'B+' : 'B'}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#78716c' }}>
                          {locationData?.city?.includes('San Francisco') || locationData?.city?.includes('Los Angeles') || locationData?.city?.includes('New York') ? 'Studio culture' :
                           locationData?.country === 'Japan' ? 'Growing scene' : 'Available'}
                        </span>
                      </div>
                    </div>

                    {/* Hair Care */}
                    <div style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #e7e5e4', borderRadius: '4px' }}>
                      <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>HAIR CARE (TEXTURED)</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#292524' }}>
                          {locationData?.country === 'USA' || locationData?.country === 'UK' || locationData?.country === 'France' ? 'A' :
                           locationData?.country === 'Japan' || locationData?.country === 'South Korea' ? 'C' : 'B'}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#78716c' }}>
                          {locationData?.country === 'USA' ? 'Many options' :
                           locationData?.country === 'Japan' || locationData?.country === 'South Korea' ? 'Limited, plan ahead' : 'Moderate'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0.25rem 0 0', fontStyle: 'italic' }}>Natural/curly specialists</p>
                    </div>

                    {/* Spa/Wellness */}
                    <div style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #e7e5e4', borderRadius: '4px' }}>
                      <p style={{ fontSize: '0.5rem', color: '#a8a29e', margin: '0 0 0.375rem', letterSpacing: '0.1em' }}>SPA & WELLNESS</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                        <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#292524' }}>
                          {locationData?.country === 'Japan' || locationData?.country === 'Thailand' || locationData?.country === 'South Korea' ? 'A+' :
                           locationData?.country === 'USA' || locationData?.country === 'UK' ? 'A' : 'B'}
                        </span>
                        <span style={{ fontSize: '0.6875rem', color: '#78716c' }}>
                          {locationData?.country === 'Japan' ? 'Onsen culture' :
                           locationData?.country === 'Thailand' ? 'Massage paradise' : 'Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practical Info */}
                {locationData?.practicalInfo && (
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: '0 0 0.75rem' }}>PRACTICAL INFO</p>
                    <div style={{ padding: '1rem', backgroundColor: '#faf8f5', borderLeft: '3px solid #a8a29e' }}>
                      {locationData.practicalInfo.language && (
                        <p style={{ fontSize: '0.8125rem', color: '#57534e', margin: '0 0 0.5rem', lineHeight: 1.7 }}>
                          <strong>Language:</strong> {locationData.practicalInfo.language}
                        </p>
                      )}
                      {locationData.practicalInfo.visaInfo && (
                        <p style={{ fontSize: '0.8125rem', color: '#57534e', margin: '0 0 0.5rem', lineHeight: 1.7 }}>
                          <strong>Visa:</strong> {locationData.practicalInfo.visaInfo}
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#a8a29e', fontStyle: 'italic' }}>
                            General guidance; what applies to a Rwandan passport can differ. Check the country&apos;s official site before planning.
                          </span>
                        </p>
                      )}
                      {locationData.practicalInfo.healthcareAccess && (
                        <p style={{ fontSize: '0.8125rem', color: '#57534e', margin: '0 0 0.5rem', lineHeight: 1.7 }}>
                          <strong>Healthcare:</strong> {locationData.practicalInfo.healthcareAccess}
                        </p>
                      )}
                      {locationData.practicalInfo.internetQuality && (
                        <p style={{ fontSize: '0.8125rem', color: '#57534e', margin: 0, lineHeight: 1.7 }}>
                          <strong>Internet:</strong> {locationData.practicalInfo.internetQuality}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Creepy Crawlies */}
                {locationData?.creepyCrawlies && (
                  <div style={{ marginBottom: '1rem', opacity: 0.85 }}>
                    <h3 style={{ fontSize: '0.5625rem', color: '#a8a29e', letterSpacing: '0.15em', margin: '0 0 0.75rem', textTransform: 'uppercase' }}>Creepy Crawlies</h3>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {locationData.creepyCrawlies.mosquitoes && (
                        <div>
                          <p style={{ fontSize: '0.6875rem', color: '#57534e', margin: 0, fontWeight: 500 }}>Mosquitoes</p>
                          <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0.125rem 0 0', textTransform: 'capitalize' }}>{locationData.creepyCrawlies.mosquitoes}</p>
                        </div>
                      )}
                      {locationData.creepyCrawlies.snakes && (
                        <div>
                          {snekRevealStep === 0 && (
                            <button onClick={() => setSnekRevealStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
                              <p style={{ fontSize: '0.6875rem', color: '#57534e', margin: 0, fontWeight: 500, opacity: 0.4 }}>Snakes</p>
                              <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0.125rem 0 0' }}>Tap to reveal</p>
                            </button>
                          )}
                          {snekRevealStep === 1 && (
                            <div>
                              <p style={{ fontSize: '0.6875rem', color: '#78716c', margin: '0 0 0.375rem' }}>Sure you want to know?</p>
                              <div style={{ display: 'flex', gap: '0.375rem' }}>
                                <button onClick={() => setSnekRevealStep(2)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.5625rem', backgroundColor: '#57534e', color: 'white', border: 'none', cursor: 'pointer' }}>Yes</button>
                                <button onClick={() => setSnekRevealStep(0)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.5625rem', backgroundColor: 'transparent', color: '#78716c', border: '1px solid #d6d3d1', cursor: 'pointer' }}>No</button>
                              </div>
                            </div>
                          )}
                          {snekRevealStep === 2 && (
                            <div>
                              <p style={{ fontSize: '0.6875rem', color: '#78716c', margin: '0 0 0.375rem', fontStyle: 'italic' }}>Devin says turn back...</p>
                              <button onClick={() => setSnekRevealStep(3)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.5625rem', backgroundColor: '#57534e', color: 'white', border: 'none', cursor: 'pointer' }}>I must know</button>
                            </div>
                          )}
                          {snekRevealStep === 3 && (
                            <div>
                              <p style={{ fontSize: '0.6875rem', color: '#57534e', margin: 0, fontWeight: 500 }}>Snakes</p>
                              <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0.125rem 0 0', textTransform: 'capitalize' }}>{locationData.creepyCrawlies.snakes}</p>
                            </div>
                          )}
                        </div>
                      )}
                      {locationData.creepyCrawlies.spiders && (
                        <div>
                          <p style={{ fontSize: '0.6875rem', color: '#57534e', margin: 0, fontWeight: 500 }}>Spiders</p>
                          <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0.125rem 0 0', textTransform: 'capitalize' }}>{locationData.creepyCrawlies.spiders}</p>
                        </div>
                      )}
                      {locationData.creepyCrawlies.other && (
                        <div>
                          <p style={{ fontSize: '0.6875rem', color: '#57534e', margin: 0, fontWeight: 500 }}>Other</p>
                          <p style={{ fontSize: '0.625rem', color: '#a8a29e', margin: '0.125rem 0 0' }}>{locationData.creepyCrawlies.other}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/** CC mode's cannabis grade from the researched score (0-100): walk-in legal shops are an A. */
function weedGrade(score?: number): string {
  if (typeof score !== "number") return "?";
  return score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : score >= 25 ? "D" : "F";
}
