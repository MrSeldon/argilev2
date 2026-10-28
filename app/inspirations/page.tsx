import Link from "next/link";
import Image from "next/image";
import { getInspirations } from "@/lib/data";

export const metadata = {
  title: "Inspirations | Le Four Argile",
  description: "A curated collection of ceramics traditions, artists, techniques, and ideas",
};

interface InspirationItem {
  id: string;
  name: string;
  origin?: string;
  period?: string;
  hasImage?: boolean;
  imageUrl?: string;
  fallbackColor?: string;
  visualCaption?: string;
  story?: {
    hook?: string;
  };
  tags?: string[];
}

interface SearchParams {
  category?: string;
}

export default async function InspirationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const data = await getInspirations();

  const categories = [
    { key: "traditions", label: "Traditions" },
    { key: "artists", label: "Artists" },
    { key: "places", label: "Places" },
    { key: "surfaces", label: "Surfaces" },
    { key: "techniques", label: "Techniques" },
    { key: "ideas", label: "Ideas" },
    { key: "moments", label: "Moments" },
  ];

  // Get all items or filter by category
  let items: Array<InspirationItem & { category: string }> = [];

  if (params.category && params.category !== "all") {
    const categoryData = data[params.category as keyof typeof data] as InspirationItem[] | undefined;
    if (categoryData) {
      items = categoryData.map((item) => ({ ...item, category: params.category! }));
    }
  } else {
    // Get all items from all categories
    for (const cat of categories) {
      const categoryData = data[cat.key as keyof typeof data] as InspirationItem[] | undefined;
      if (categoryData) {
        items.push(...categoryData.map((item) => ({ ...item, category: cat.key })));
      }
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] w-full bg-gradient-to-br from-stone-600 via-stone-700 to-stone-800">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-white tracking-tight">
            Inspirations
          </h1>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 border-b border-warm-100">
        <div className="flex justify-center items-center gap-4 text-xs uppercase tracking-widest flex-wrap px-5 md:px-8">
          <Link
            href="/inspirations"
            className={`py-3 -my-3 px-2 md:px-0 transition-opacity hover:opacity-100 ${
              !params.category || params.category === "all"
                ? "opacity-100"
                : "opacity-40"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <span key={cat.key} className="flex items-center gap-4">
              <span className="text-warm-200">|</span>
              <Link
                href={`/inspirations?category=${cat.key}`}
                className={`py-3 -my-3 px-2 md:px-0 transition-opacity hover:opacity-100 ${
                  params.category === cat.key ? "opacity-100" : "opacity-40"
                }`}
              >
                {cat.label}
              </Link>
            </span>
          ))}
          <span className="text-warm-200">|</span>
          <Link
            href="/inspirations/connections"
            className="py-3 -my-3 px-2 md:px-0 opacity-40 hover:opacity-100 transition-opacity"
          >
            Connections
          </Link>
        </div>
      </section>

      {/* Results Count */}
      <section className="pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-center text-sm text-warm-500">
            {items.length} inspirations
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-24 pt-4">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {items.map((item) => (
              <InspirationCard key={`${item.category}-${item.id}`} item={item} />
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-24">
              <p className="text-warm-500">No items found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InspirationCard({
  item,
}: {
  item: InspirationItem & { category: string };
}) {
  // Category-based gradients
  const categoryGradients: Record<string, string> = {
    traditions: "from-amber-700 via-stone-700 to-stone-800",
    artists: "from-rose-700 via-stone-700 to-stone-800",
    places: "from-emerald-700 via-stone-700 to-stone-800",
    surfaces: "from-slate-600 via-stone-700 to-stone-800",
    techniques: "from-orange-700 via-stone-700 to-stone-800",
    ideas: "from-purple-700 via-stone-700 to-stone-800",
    moments: "from-blue-700 via-stone-700 to-stone-800",
  };

  const gradient = categoryGradients[item.category] || "from-stone-600 via-stone-700 to-stone-800";

  return (
    <Link
      href={`/inspirations/${item.category}/${item.id}`}
      className="group block"
    >
      {/* Image or Color Block */}
      <div className="aspect-[4/3] overflow-hidden mb-4 relative">
        {item.hasImage && item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-[1.02]`}
            style={item.fallbackColor ? { backgroundColor: item.fallbackColor } : undefined}
          >
            <div className="w-full h-full flex items-end p-4">
              <span className="text-white/40 text-xs uppercase tracking-wider">
                {item.category}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="text-center text-sm tracking-wide uppercase mb-1">
        {item.name}
      </h3>

      {(item.origin || item.period) && (
        <p className="text-center text-xs text-warm-500">
          {[item.origin, item.period].filter(Boolean).join(" · ")}
        </p>
      )}
    </Link>
  );
}
