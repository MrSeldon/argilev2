import { Suspense } from "react";
import Link from "next/link";
import { getGlazes } from "@/lib/data";
import { GlazeFilters } from "@/components/glazes/GlazeFilters";
import { GlazeGrid } from "@/components/glazes/GlazeGrid";

export const metadata = {
  title: "Glazes | Le Four Argile",
  description: "Explore thousands of glaze recipes from Digital Fire and Glazy",
};

interface SearchParams {
  source?: string;
  cone?: string;
  surface?: string;
  atmosphere?: string;
  q?: string;
}

export default async function GlazesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Load glazes from the selected source (default to digitalfire)
  const source = (params.source === "glazy" ? "glazy" : "digitalfire") as "digitalfire" | "glazy";
  const allGlazes = await getGlazes(source);

  // Extract unique values for filters
  const cones = [...new Set(allGlazes.map((g) => g.cone).filter(Boolean))].sort((a, b) => {
    const numA = parseInt(a || "0");
    const numB = parseInt(b || "0");
    return numA - numB;
  });
  const surfaces = [...new Set(allGlazes.map((g) => g.surface).filter(Boolean))].sort();
  const atmospheres = [...new Set(allGlazes.map((g) => g.atmosphere).filter(Boolean))].sort();

  // Filter glazes based on search params
  let filtered = allGlazes;

  if (params.cone) {
    filtered = filtered.filter((g) => g.cone === params.cone);
  }

  if (params.surface) {
    filtered = filtered.filter((g) => g.surface === params.surface);
  }

  if (params.atmosphere) {
    filtered = filtered.filter((g) => g.atmosphere === params.atmosphere);
  }

  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(
      (g) =>
        g.name.toLowerCase().includes(query) ||
        g.code?.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query) ||
        g.ingredients?.some((i) => i.material.toLowerCase().includes(query))
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full bg-gradient-to-br from-slate-700 via-stone-700 to-stone-800">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight">
            Glazes
          </h1>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-12 border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-8">
          <GlazeFilters
            cones={cones as string[]}
            surfaces={surfaces as string[]}
            atmospheres={atmospheres as string[]}
            currentParams={params}
          />
        </div>
      </section>

      {/* Results Count */}
      <section className="pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-warm-500">
              {filtered.length} recipes from {source === "digitalfire" ? "Digital Fire" : "Glazy"}
            </p>
            <Link
              href="/glazes/my-materials"
              className="text-sm uppercase tracking-widest text-warm-500 hover:text-charcoal transition-colors"
            >
              My Materials →
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="pb-24 pt-8">
        <div className="max-w-6xl mx-auto px-8">
          <Suspense fallback={<GlazeGridSkeleton />}>
            <GlazeGrid glazes={filtered} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function GlazeGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-warm-100 mb-3" />
          <div className="h-4 bg-warm-100 w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
}
