import { getOpportunities } from "@/lib/data";
import { OpportunityMap } from "@/components/opportunities/OpportunityMap";
import Link from "next/link";

export const metadata = {
  title: "Opportunities Map | Le Four Argile",
  description: "Explore ceramics opportunities in the Bay Area and around the world",
};

export default async function OpportunitiesMapPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  const { scope } = await searchParams;
  const opportunities = await getOpportunities();

  // Filter opportunities with valid coordinates
  const mappableOpportunities = opportunities.filter(
    (opp) =>
      opp.location.coordinates?.lat !== undefined &&
      opp.location.coordinates?.lng !== undefined
  );

  return (
    // Fills the screen below the fixed nav (56px on phones, ~76px on desktop)
    <div className="h-[100dvh] flex flex-col pt-14 md:pt-[76px]">
      {/* Header */}
      <section className="py-2 md:py-5 border-b border-warm-100 shrink-0">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-serif text-xl md:text-3xl tracking-tight">
              Opportunities Map
            </h1>
            <Link
              href="/opportunities"
              className="inline-flex items-center min-h-11 -mr-2 px-2 text-sm text-warm-500 hover:text-charcoal transition-colors whitespace-nowrap"
            >
              ← Back to List
            </Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <OpportunityMap
        opportunities={mappableOpportunities}
        initialScope={scope === "world" ? "world" : "bay"}
      />
    </div>
  );
}
