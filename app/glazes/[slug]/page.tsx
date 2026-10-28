import { notFound } from "next/navigation";
import Link from "next/link";
import { getGlazes } from "@/lib/data";
import { Glaze } from "@/lib/types";

export async function generateStaticParams() {
  const digitalfire = await getGlazes("digitalfire");
  return digitalfire.map((glaze) => ({ slug: glaze.code }));
}

async function getGlazeByCode(code: string): Promise<Glaze | undefined> {
  // Try digitalfire first
  const digitalfire = await getGlazes("digitalfire");
  let glaze = digitalfire.find((g) => g.code === code);

  if (!glaze) {
    // Try glazy
    const glazy = await getGlazes("glazy");
    glaze = glazy.find((g) => g.code === code);
  }

  return glaze;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const glaze = await getGlazeByCode(slug);

  if (!glaze) {
    return { title: "Glaze Not Found" };
  }

  return {
    title: `${glaze.name} | Le Four Argile`,
    description: glaze.description,
  };
}

// Generate color gradient based on glaze name
function getGlazeGradient(glaze: Glaze): string {
  const name = glaze.name.toLowerCase();

  if (name.includes("blue") || name.includes("cobalt")) {
    return "from-blue-600 via-blue-700 to-slate-800";
  }
  if (name.includes("green") || name.includes("celadon") || name.includes("copper")) {
    return "from-emerald-600 via-emerald-700 to-stone-800";
  }
  if (name.includes("red") || name.includes("iron") || name.includes("rust")) {
    return "from-red-700 via-red-800 to-stone-900";
  }
  if (name.includes("yellow") || name.includes("amber") || name.includes("honey")) {
    return "from-amber-500 via-amber-600 to-stone-800";
  }
  if (name.includes("white") || name.includes("snow") || name.includes("cream")) {
    return "from-stone-200 via-stone-300 to-stone-500";
  }
  if (name.includes("black") || name.includes("tenmoku") || name.includes("dark")) {
    return "from-stone-700 via-stone-800 to-stone-950";
  }
  if (name.includes("brown") || name.includes("tea") || name.includes("shino")) {
    return "from-amber-700 via-stone-700 to-stone-800";
  }

  return "from-slate-600 via-stone-700 to-stone-800";
}

export default async function GlazePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const glaze = await getGlazeByCode(slug);

  if (!glaze) {
    notFound();
  }

  const totalPercentage = glaze.ingredients?.reduce((sum, ing) => sum + ing.amount, 0) || 0;
  const gradient = getGlazeGradient(glaze);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative h-[40vh] w-full bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          {glaze.cone && (
            <span className="text-white/40 text-xs uppercase tracking-widest">
              Cone {glaze.cone}
            </span>
          )}
        </div>
      </section>

      {/* Title Section */}
      <section className="py-16 border-b border-warm-100">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <span className="text-xs text-warm-400 font-mono block mb-4">
            {glaze.code}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
            {glaze.name}
          </h1>
          <div className="flex justify-center gap-6 text-xs uppercase tracking-widest text-warm-500">
            {glaze.surface && <span>{glaze.surface}</span>}
            {glaze.surface && glaze.atmosphere && <span>·</span>}
            {glaze.atmosphere && <span>{glaze.atmosphere}</span>}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-5 gap-16 md:gap-24">
            {/* Left Column - Recipe */}
            <div className="md:col-span-3">
              <h2 className="font-serif text-2xl mb-8">Recipe</h2>

              {glaze.ingredients && glaze.ingredients.length > 0 ? (
                <div className="space-y-4">
                  {glaze.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-warm-100"
                    >
                      <span className="text-charcoal">{ing.material}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-1 bg-warm-100 overflow-hidden">
                          <div
                            className="h-full bg-warm-300"
                            style={{
                              width: `${(ing.amount / totalPercentage) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-mono text-warm-500 w-12 text-right">
                          {ing.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-xs uppercase tracking-widest text-warm-400">Total</span>
                    <span className="text-sm font-mono text-charcoal">
                      {totalPercentage}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-warm-500">No recipe data available</p>
              )}

              {/* Notes */}
              {glaze.notes && (
                <div className="mt-16">
                  <h2 className="font-serif text-2xl mb-6">Notes</h2>
                  <p className="text-warm-600 leading-relaxed whitespace-pre-wrap">
                    {glaze.notes}
                  </p>
                </div>
              )}

              {/* Description */}
              {glaze.description && (
                <div className="mt-16">
                  <h2 className="font-serif text-2xl mb-6">Description</h2>
                  <p className="text-warm-600 leading-relaxed">
                    {glaze.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <aside className="md:col-span-2 space-y-12">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-warm-400 mb-6">
                  Specifications
                </h3>
                <dl className="space-y-6">
                  {glaze.cone && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                        Firing Temperature
                      </dt>
                      <dd className="text-charcoal">Cone {glaze.cone}</dd>
                    </div>
                  )}
                  {glaze.surface && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                        Surface
                      </dt>
                      <dd className="text-charcoal">{glaze.surface}</dd>
                    </div>
                  )}
                  {glaze.atmosphere && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                        Atmosphere
                      </dt>
                      <dd className="text-charcoal">{glaze.atmosphere}</dd>
                    </div>
                  )}
                  {glaze.transparency && (
                    <div>
                      <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                        Transparency
                      </dt>
                      <dd className="text-charcoal">{glaze.transparency}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs uppercase tracking-widest text-warm-400 mb-1">
                      Materials
                    </dt>
                    <dd className="text-charcoal">
                      {glaze.ingredients?.length || 0} ingredients
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Source Link */}
              {glaze.url && (
                <div className="pt-8 border-t border-warm-100">
                  <a
                    href={glaze.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hit-area inline-block text-sm uppercase tracking-widest border-b border-charcoal pb-1 hover:opacity-60 transition-opacity"
                  >
                    View Source →
                  </a>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Back Link */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-8">
          <Link
            href="/glazes"
            className="inline-block py-3 -my-3 text-sm text-warm-500 hover:text-charcoal transition-colors"
          >
            ← Back to Glazes
          </Link>
        </div>
      </section>
    </div>
  );
}
