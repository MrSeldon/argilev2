import Link from "next/link";
import { Opportunity, formatLocation, getOpportunityTypeColor } from "@/lib/data";

interface OpportunityGridProps {
  opportunities: Opportunity[];
}

export function OpportunityGrid({ opportunities }: OpportunityGridProps) {
  if (opportunities.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-body-lg text-clay-500 mb-4">
          No opportunities match your filters
        </p>
        <p className="text-body-sm text-clay-400">
          Try adjusting your search or clearing some filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid-cards">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const typeColor = getOpportunityTypeColor(opportunity.type);

  return (
    <Link
      href={`/opportunities/${opportunity.id}`}
      className="card p-6 group flex flex-col"
    >
      {/* Type Badge */}
      <div className="mb-3">
        <span className={`tag ${typeColor}`}>
          {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-heading-sm group-hover:text-glaze-600 transition-colors mb-1 line-clamp-2">
        {opportunity.name}
      </h3>

      {/* Location */}
      <p className="text-body-sm text-clay-500 mb-3">
        {formatLocation(opportunity.location)}
      </p>

      {/* Description */}
      {opportunity.description && (
        <p className="text-body-sm text-clay-600 line-clamp-3 mb-4 flex-1">
          {opportunity.description}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-ash-100">
        {opportunity.duration?.display && (
          <span className="text-caption text-clay-500">
            {opportunity.duration.display}
          </span>
        )}
        {opportunity.deadline && (
          <span className="text-caption text-clay-500">
            Deadline: {opportunity.deadline}
          </span>
        )}
        {opportunity.funding?.available && (
          <span className="text-caption text-glaze-600 font-medium">
            Funding available
          </span>
        )}
      </div>
    </Link>
  );
}
