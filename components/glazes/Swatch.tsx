// A painted test-tile stand-in: base colour from the colour family, with a
// "break" colour toward the edges when the glaze is described as breaking.

const FAMILY: Record<string, [string, string]> = {
  clear: ["#e9e4da", "#cfc6b6"],
  white: ["#f1ede4", "#d9d1c3"],
  green: ["#8fae8b", "#5f7f5c"],
  turquoise: ["#5fb3ad", "#2f7f7a"],
  blue: ["#4f6fa3", "#2c4470"],
  brown: ["#8a5a35", "#4f321d"],
  black: ["#2a2420", "#120f0d"],
  rust: ["#a4532a", "#5e2a12"],
  red: ["#9e2d2a", "#5b1513"],
  yellow: ["#d8b45a", "#a8812e"],
  amber: ["#b97a2e", "#7a4b18"],
  purple: ["#6f4a78", "#3e2645"],
  pink: ["#d79aa0", "#b06a73"],
  grey: ["#9a9893", "#64625d"],
  orange: ["#d58a4a", "#9b5523"],
  variegated: ["#6f8597", "#a07a4e"],
};
const BREAK: Record<string, string> = {
  green: "#7a5532",
  blue: "#7a5532",
  black: "#9a4a1f",
  brown: "#c08a4a",
  rust: "#2a1a10",
  amber: "#5a3415",
  turquoise: "#c9b98a",
};

export function swatchStyle(family: string, description = "", tags: string[] = []) {
  const [a, b] = FAMILY[family] || FAMILY.clear;
  const breaks = /break|thins/i.test(description);
  let base = a;
  if (tags.includes("celadon")) base = family === "blue" ? "#9db8c4" : "#a9c3a2";
  if (tags.includes("tenmoku")) base = "#241a14";
  const edge = breaks ? BREAK[family] || b : b;
  return {
    background: `radial-gradient(120% 95% at 35% 30%, ${base} 0%, ${base} 38%, ${b} 70%, ${edge} 100%)`,
  };
}

export function Swatch({
  family,
  description,
  tags,
  className = "",
  label,
}: {
  family: string;
  description?: string;
  tags?: string[];
  className?: string;
  label?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={swatchStyle(family, description, tags)} aria-hidden={!label} aria-label={label}>
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0)_38%)]" />
    </div>
  );
}
