// A tiny graticule (lines of latitude and longitude) with a single dot where
// the place is. Used on cards and detail pages when there is no photograph, so
// the card carries a real piece of information instead of an empty image.

export function LocationMark({
  lat,
  lng,
  color = "#B4633F",
  className = "",
  label,
}: {
  lat?: number;
  lng?: number;
  color?: string;
  className?: string;
  label?: string;
}) {
  const has = typeof lat === "number" && typeof lng === "number";
  const x = has ? lng! + 180 : 0;
  const y = has ? 90 - lat! : 0;
  const meridians = [60, 120, 180, 240, 300];
  const parallels = [45, 135];
  return (
    <svg
      viewBox="0 0 360 180"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" fill="none" opacity="0.3" strokeDasharray="2 4">
        {meridians.map((m) => (
          <line key={`m${m}`} x1={m} y1="0" x2={m} y2="180" vectorEffect="non-scaling-stroke" />
        ))}
        {parallels.map((p) => (
          <line key={`p${p}`} x1="0" y1={p} x2="360" y2={p} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <line x1="0" y1="90" x2="360" y2="90" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.5" />
      <rect x="0.5" y="0.5" width="359" height="179" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.35" />
      {has && (
        <>
          <line x1={x} y1="0" x2={x} y2="180" stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.45" />
          <line x1="0" y1={y} x2="360" y2={y} stroke={color} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.45" />
          <circle cx={x} cy={y} r="22" fill={color} opacity="0.16" />
          <circle cx={x} cy={y} r="9" fill={color} />
        </>
      )}
    </svg>
  );
}

export function coordText(lat?: number, lng?: number): string | undefined {
  if (typeof lat !== "number" || typeof lng !== "number") return undefined;
  const f = (v: number, p: string, n: string) => `${Math.abs(v).toFixed(1)}°${v >= 0 ? p : n}`;
  return `${f(lat, "N", "S")} ${f(lng, "E", "W")}`;
}
