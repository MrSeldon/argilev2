import Link from "next/link";
import { Opportunity } from "@/lib/types";
import { formatLocation } from "@/lib/utils";

interface OpportunityGalleryProps {
  opportunities: Opportunity[];
  suitabilityScores?: Record<string, number>;
}

export function OpportunityGallery({
  opportunities,
  suitabilityScores = {},
}: OpportunityGalleryProps) {
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-warm-500">No opportunities match your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      {opportunities.map((opportunity) => (
        <OpportunityCard
          key={opportunity.id}
          opportunity={opportunity}
          suitabilityScore={suitabilityScores[opportunity.id]}
        />
      ))}
    </div>
  );
}

function OpportunityCard({
  opportunity,
  suitabilityScore,
}: {
  opportunity: Opportunity;
  suitabilityScore?: number;
}) {
  // Generate a gradient based on the opportunity type for placeholder
  const gradients: Record<string, string> = {
    school: "from-blue-800 via-slate-800 to-slate-900",
    residency: "from-emerald-800 via-stone-800 to-stone-900",
    grant: "from-purple-800 via-stone-800 to-stone-900",
    scholarship: "from-pink-800 via-stone-800 to-stone-900",
    fellowship: "from-indigo-800 via-stone-800 to-stone-900",
    apprenticeship: "from-amber-800 via-stone-800 to-stone-900",
    mentorship: "from-rose-800 via-stone-800 to-stone-900",
    workshop: "from-orange-800 via-stone-800 to-stone-900",
  };

  const gradient =
    gradients[opportunity.type] || "from-stone-700 via-stone-800 to-stone-900";

  // Get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-emerald-500/90 text-white";
    if (score >= 50) return "bg-amber-500/90 text-white";
    return "bg-stone-500/90 text-white";
  };

  return (
    <Link href={`/opportunities/${opportunity.id}`} className="group block">
      {/* Image placeholder */}
      <div
        className={`aspect-[4/3] overflow-hidden bg-gradient-to-br ${gradient} mb-4 relative`}
      >
        <div className="w-full h-full flex items-end justify-between p-4 transition-transform duration-500 group-hover:scale-[1.02]">
          <span className="text-white/40 text-xs uppercase tracking-wider">
            {opportunity.type}
          </span>

          {/* Suitability Score Badge */}
          {suitabilityScore !== undefined && (
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium ${getScoreColor(
                suitabilityScore
              )}`}
              title={`Suitability Score: ${suitabilityScore}`}
            >
              {suitabilityScore}
            </span>
          )}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-center text-sm tracking-wide uppercase mb-1">
        {opportunity.name}
      </h3>

      {/* Location */}
      <p className="text-center text-xs text-warm-500">
        {formatLocation(opportunity.location)}
      </p>
    </Link>
  );
}
