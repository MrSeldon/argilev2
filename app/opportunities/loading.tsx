export default function OpportunitiesLoading() {
  return (
    <div className="wrap pt-6 md:pt-14" aria-busy="true" aria-label="Loading">
      <div className="h-3 w-16 bg-oat animate-breathe" />
      <div className="h-10 w-64 bg-oat mt-4 animate-breathe" />
      <div className="h-4 w-full max-w-md bg-oat mt-5 animate-breathe" />
      <div className="mt-14 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-8 sm:gap-y-14">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 sm:block py-4 sm:py-0">
            <div className="w-[5.25rem] h-[5.25rem] sm:w-auto sm:h-auto sm:aspect-[4/3] bg-oat animate-breathe" />
            <div className="flex-1 sm:pt-4 space-y-2">
              <div className="h-5 w-3/4 bg-oat animate-breathe" />
              <div className="h-3 w-1/2 bg-oat animate-breathe" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
