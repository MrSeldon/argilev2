import { notFound } from "next/navigation";
import Link from "next/link";
import { getOpportunities, getOpportunityById, getRelatedOpportunities } from "@/lib/data";
import { formatLocation } from "@/lib/utils";
import {
  getSuitabilityForOpportunity,
  calculateSuitabilityScore,
  getSuitabilitySummary,
} from "@/lib/suitability";
import { OpportunityDetailClient } from "@/components/opportunities/OpportunityDetailClient";

export async function generateStaticParams() {
  const opportunities = await getOpportunities();
  return opportunities.map((opp) => ({ slug: opp.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const opportunity = await getOpportunityById(slug);

  if (!opportunity) {
    return { title: "Opportunity Not Found" };
  }

  return {
    title: `${opportunity.name} | Le Four Argile`,
    description: opportunity.description,
  };
}

// Get gradient based on opportunity type
function getTypeGradient(type: string): string {
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
  return gradients[type] || "from-stone-700 via-stone-800 to-stone-900";
}

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opportunity = await getOpportunityById(slug);

  if (!opportunity) {
    notFound();
  }

  // Try to find matching suitability data for this location
  const suitability = await getSuitabilityForOpportunity(
    opportunity.location.city,
    opportunity.location.region,
    opportunity.location.country
  );

  // Calculate score and summary if suitability data exists
  const suitabilityScore = suitability ? calculateSuitabilityScore(suitability) : null;
  const suitabilitySummary = suitability ? getSuitabilitySummary(suitability) : null;

  const gradient = getTypeGradient(opportunity.type);

  // Get related opportunities (grants/scholarships that could fund this, or vice versa)
  const relatedOpportunities = await getRelatedOpportunities(opportunity, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative h-[50vh] w-full bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 flex items-end justify-center pb-16">
          <span className="text-white/40 text-xs uppercase tracking-widest">
            {opportunity.type}
          </span>
        </div>
      </section>

      {/* Title Section */}
      <section className="py-16 border-b border-warm-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">
            {opportunity.name}
          </h1>
          <p className="text-sm uppercase tracking-widest text-warm-500">
            {formatLocation(opportunity.location)}
          </p>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-5 gap-16 md:gap-24">
            {/* Left Column - Main Content (wider) */}
            <div className="md:col-span-3 space-y-16">
              {/* Description */}
              {opportunity.description && (
                <div>
                  <p className="text-lg leading-relaxed text-warm-700">
                    {opportunity.description}
                  </p>
                </div>
              )}

              {/* About the Program */}
              {opportunity.details && (
                <div>
                  <h2 className="font-serif text-2xl mb-6">About the Program</h2>
                  <p className="leading-relaxed text-warm-600">
                    {opportunity.details}
                  </p>
                </div>
              )}

              {/* Good For */}
              {opportunity.goodFor && (
                <div>
                  <h2 className="font-serif text-2xl mb-6">Best For</h2>
                  <p className="leading-relaxed text-warm-600">
                    {opportunity.goodFor}
                  </p>
                </div>
              )}

              {/* Facilities */}
              {opportunity.facilities && opportunity.facilities.length > 0 && (
                <div>
                  <h2 className="font-serif text-2xl mb-6">Facilities</h2>
                  <ul className="space-y-2">
                    {opportunity.facilities.map((facility, i) => (
                      <li key={i} className="text-warm-600">
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Details (narrower) */}
            <aside className="md:col-span-2 space-y-12">
              {/* Key Details */}
              <div>
                <h3 className="text-xs uppercase tracking-widest text-warm-400 mb-6">
                  Details
                </h3>
                <dl className="space-y-6">
                  {opportunity.duration?.display && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                        Duration
                      </dt>
                      <dd className="text-charcoal">
                        {opportunity.duration.display}
                      </dd>
                    </div>
                  )}

                  {opportunity.level && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                        Level
                      </dt>
                      <dd className="text-charcoal capitalize">
                        {opportunity.level}
                      </dd>
                    </div>
                  )}

                  {opportunity.eligibility && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                        Eligibility
                      </dt>
                      <dd className="text-charcoal">
                        {opportunity.eligibility}
                      </dd>
                    </div>
                  )}

                  {opportunity.deadline && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                        Application Deadline
                      </dt>
                      <dd className="text-charcoal">
                        {opportunity.deadline}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Cost */}
              {opportunity.cost && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-warm-400 mb-6">
                    Cost
                  </h3>
                  {opportunity.cost.tuition && (
                    <p className="text-charcoal mb-2">
                      {opportunity.cost.tuition}
                    </p>
                  )}
                  {opportunity.cost.estimate && (
                    <p className="text-sm text-warm-500">
                      Estimated: ${opportunity.cost.estimate.low.toLocaleString()} – $
                      {opportunity.cost.estimate.high.toLocaleString()}{" "}
                      {opportunity.cost.estimate.currency}
                    </p>
                  )}
                </div>
              )}

              {/* Funding */}
              {opportunity.funding?.available && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-warm-400 mb-6">
                    Funding Available
                  </h3>
                  {opportunity.funding.stipend && (
                    <p className="text-charcoal mb-2">
                      {opportunity.funding.stipend}
                    </p>
                  )}
                  {opportunity.funding.notes && (
                    <p className="text-sm text-warm-500">
                      {opportunity.funding.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Housing */}
              {opportunity.housing && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-warm-400 mb-6">
                    Housing
                  </h3>
                  <p className="text-charcoal mb-1">
                    {opportunity.housing.included
                      ? "Included"
                      : opportunity.housing.type || "Not included"}
                  </p>
                  {opportunity.housing.notes && (
                    <p className="text-sm text-warm-500">
                      {opportunity.housing.notes}
                    </p>
                  )}
                </div>
              )}

              {/* Focus Areas */}
              {opportunity.focusAreas && opportunity.focusAreas.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase tracking-widest text-warm-400 mb-6">
                    Focus Areas
                  </h3>
                  <p className="text-charcoal">
                    {opportunity.focusAreas.join(", ")}
                  </p>
                </div>
              )}

              {/* Call to Action */}
              {opportunity.website && (
                <div className="pt-8 border-t border-warm-100">
                  <a
                    href={opportunity.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hit-area inline-block text-sm uppercase tracking-widest border-b border-charcoal pb-1 hover:opacity-60 transition-opacity"
                  >
                    Visit Website →
                  </a>
                </div>
              )}

              {/* Suitability Preview */}
              {suitability && suitabilityScore !== null && suitabilitySummary && (
                <OpportunityDetailClient
                  suitability={suitability}
                  score={suitabilityScore}
                  summary={suitabilitySummary}
                />
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Related Opportunities */}
      {relatedOpportunities.length > 0 && (
        <section className="py-16 bg-warm-50">
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-warm-400 mb-8">
              {["school", "residency", "workshop", "apprenticeship"].includes(opportunity.type)
                ? "Funding Opportunities"
                : "Programs to Fund"}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedOpportunities.map((related) => (
                <Link
                  key={related.id}
                  href={`/opportunities/${related.id}`}
                  className="group block bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <span className="inline-block text-[9px] uppercase tracking-wider text-warm-400 mb-2">
                    {related.type}
                  </span>
                  <h3 className="text-sm font-medium text-charcoal group-hover:text-warm-700 transition-colors mb-2 line-clamp-2">
                    {related.name}
                  </h3>
                  <p className="text-xs text-warm-500">
                    {formatLocation(related.location)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Link */}
      <section className="pb-24 pt-12">
        <div className="max-w-6xl mx-auto px-8">
          <Link
            href="/opportunities"
            className="inline-block py-3 -my-3 text-sm text-warm-500 hover:text-charcoal transition-colors"
          >
            ← Back to Opportunities
          </Link>
        </div>
      </section>
    </div>
  );
}
