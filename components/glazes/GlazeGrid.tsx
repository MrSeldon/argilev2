import Link from "next/link";
import { Glaze } from "@/lib/types";

interface GlazeGridProps {
  glazes: Glaze[];
}

export function GlazeGrid({ glazes }: GlazeGridProps) {
  if (glazes.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-warm-500">No glazes match your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {glazes.map((glaze) => (
        <GlazeCard key={glaze.code} glaze={glaze} />
      ))}
    </div>
  );
}

function GlazeCard({ glaze }: { glaze: Glaze }) {
  const bgColor = getGlazeColor(glaze);

  return (
    <Link href={`/glazes/${glaze.code}`} className="group block">
      {/* Square color placeholder */}
      <div className="aspect-square overflow-hidden mb-3">
        <div
          className={`w-full h-full ${bgColor} transition-transform duration-500 group-hover:scale-[1.02]`}
        >
          {/* Cone badge in corner */}
          {glaze.cone && (
            <div className="p-3 flex justify-end">
              <span className="text-white/40 text-xs">
                c{glaze.cone}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-center text-sm tracking-wide mb-1 line-clamp-2">
        {glaze.name}
      </h3>

      {/* Surface type */}
      {glaze.surface && (
        <p className="text-center text-xs text-warm-400">
          {glaze.surface}
        </p>
      )}
    </Link>
  );
}

function getGlazeColor(glaze: Glaze): string {
  // Generate a color based on surface type and name
  const surface = glaze.surface?.toLowerCase() || "";
  const name = glaze.name.toLowerCase();

  // Check for specific color mentions in the name
  if (name.includes("blue") || name.includes("cobalt") || name.includes("rutile blue")) {
    return "bg-gradient-to-br from-blue-600 via-blue-700 to-slate-800";
  }
  if (name.includes("green") || name.includes("celadon") || name.includes("copper")) {
    return "bg-gradient-to-br from-emerald-600 via-emerald-700 to-stone-800";
  }
  if (name.includes("red") || name.includes("iron") || name.includes("rust")) {
    return "bg-gradient-to-br from-red-700 via-red-800 to-stone-900";
  }
  if (name.includes("yellow") || name.includes("amber") || name.includes("honey")) {
    return "bg-gradient-to-br from-amber-500 via-amber-600 to-stone-800";
  }
  if (name.includes("white") || name.includes("snow") || name.includes("cream")) {
    return "bg-gradient-to-br from-stone-200 via-stone-300 to-stone-400";
  }
  if (name.includes("black") || name.includes("tenmoku") || name.includes("dark")) {
    return "bg-gradient-to-br from-stone-700 via-stone-800 to-stone-950";
  }
  if (name.includes("brown") || name.includes("tea") || name.includes("shino")) {
    return "bg-gradient-to-br from-amber-700 via-stone-700 to-stone-800";
  }
  if (name.includes("ash") || name.includes("wood")) {
    return "bg-gradient-to-br from-stone-500 via-stone-600 to-stone-700";
  }
  if (name.includes("purple") || name.includes("manganese")) {
    return "bg-gradient-to-br from-purple-700 via-purple-800 to-stone-900";
  }
  if (name.includes("orange") || name.includes("sunset")) {
    return "bg-gradient-to-br from-orange-500 via-orange-600 to-stone-800";
  }

  // Surface-based colors
  if (surface.includes("matte")) {
    return "bg-gradient-to-br from-stone-400 via-stone-500 to-stone-600";
  }
  if (surface.includes("satin")) {
    return "bg-gradient-to-br from-stone-500 via-stone-600 to-stone-700";
  }
  if (surface.includes("gloss")) {
    return "bg-gradient-to-br from-slate-600 via-slate-700 to-stone-800";
  }
  if (surface.includes("crystal")) {
    return "bg-gradient-to-br from-cyan-600 via-slate-700 to-stone-800";
  }

  // Default neutral
  return "bg-gradient-to-br from-stone-500 via-stone-600 to-stone-700";
}
