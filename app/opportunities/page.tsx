import { Suspense } from "react";
import Link from "next/link";
import { getOpportunities } from "@/lib/data";
import { OpportunityGallery } from "@/components/opportunities/OpportunityGallery";
import {
  getSuitabilityForOpportunity,
  calculateSuitabilityScore,
} from "@/lib/suitability";

export const metadata = {
  title: "Opportunities | Le Four Argile",
  description: "Discover ceramics residencies, schools, grants, and workshops around the world",
};

interface SearchParams {
  type?: string;
  country?: string;
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const allOpportunities = await getOpportunities();

  // Extract unique types for filter tabs
  const types = [...new Set(allOpportunities.map((o) => o.type))].sort();

  // Filter opportunities based on search params
  let filtered = allOpportunities;

  if (params.type) {
    filtered = filtered.filter((o) => o.type === params.type);
  }

  if (params.country) {
    filtered = filtered.filter((o) => o.location.country === params.country);
  }

  // Load suitability scores for all filtered opportunities
  const suitabilityScores: Record<string, number> = {};
  await Promise.all(
    filtered.map(async (opp) => {
      const suitability = await getSuitabilityForOpportunity(
        opp.location.city,
        opp.location.region,
        opp.location.country
      );
      if (suitability) {
        suitabilityScores[opp.id] = calculateSuitabilityScore(suitability);
      }
    })
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight">
            Opportunities
          </h1>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-12 border-b border-warm-100">
        <div className="flex justify-center items-center gap-4 text-xs uppercase tracking-widest">
          <Link
            href="/opportunities"
            className={`transition-opacity hover:opacity-100 ${
              !params.type ? "opacity-100" : "opacity-40"
            }`}
          >
            All
          </Link>
          {types.map((type, index) => (
            <span key={type} className="flex items-center gap-4">
              <span className="text-warm-200">|</span>
              <Link
                href={`/opportunities?type=${type}`}
                className={`transition-opacity hover:opacity-100 ${
                  params.type === type ? "opacity-100" : "opacity-40"
                }`}
              >
                {type}
              </Link>
            </span>
          ))}
          <span className="text-warm-200">|</span>
          <Link
            href="/opportunities/map"
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            Map
          </Link>
        </div>
      </section>

      {/* Results Count */}
      <section className="pt-8 pb-4">
        <div className="container-content">
          <p className="text-center text-sm text-warm-500">
            {filtered.length} opportunities
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-24">
        <div className="container-content">
          <Suspense fallback={<OpportunityGridSkeleton />}>
            <OpportunityGallery
              opportunities={filtered}
              suitabilityScores={suitabilityScores}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function OpportunityGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/3] bg-warm-100 mb-4" />
          <div className="h-4 bg-warm-100 w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
}
