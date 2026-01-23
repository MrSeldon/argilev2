export default function OpportunitiesLoading() {
  return (
    <div>
      {/* Hero Skeleton */}
      <section className="relative h-[60vh] w-full bg-gradient-to-br from-amber-800 via-stone-800 to-stone-900">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-64 bg-white/10 animate-pulse" />
        </div>
      </section>

      {/* Filter Tabs Skeleton */}
      <section className="py-12 border-b border-warm-100">
        <div className="flex justify-center items-center gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-16 bg-warm-100 animate-pulse" />
          ))}
        </div>
      </section>

      {/* Grid Skeleton */}
      <section className="py-12">
        <div className="container-content">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-warm-100 mb-4" />
                <div className="h-4 bg-warm-100 w-3/4 mx-auto mb-2" />
                <div className="h-3 bg-warm-100 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
