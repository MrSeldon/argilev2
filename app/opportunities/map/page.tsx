import { getOpportunities } from "@/lib/data";
import { OpportunityMap } from "@/components/opportunities/OpportunityMap";
import Link from "next/link";

export const metadata = {
  title: "Opportunities Map | Le Four Argile",
  description: "Explore ceramics opportunities around the world",
};

export default async function OpportunitiesMapPage() {
  const opportunities = await getOpportunities();

  // Filter opportunities with valid coordinates
  const mappableOpportunities = opportunities.filter(
    (opp) =>
      opp.location.coordinates?.lat !== undefined &&
      opp.location.coordinates?.lng !== undefined
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <section className="py-8 border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/opportunities"
                className="text-sm text-warm-500 hover:text-charcoal transition-colors mb-2 inline-block"
              >
                ← Back to List
              </Link>
              <h1 className="font-serif text-2xl md:text-3xl tracking-tight">
                Opportunities Map
              </h1>
              <p className="text-sm text-warm-500 mt-1">
                {mappableOpportunities.length} locations worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="flex-1">
        <OpportunityMap opportunities={mappableOpportunities} />
      </section>
    </div>
  );
}
