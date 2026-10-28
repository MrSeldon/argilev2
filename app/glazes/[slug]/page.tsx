import { notFound } from "next/navigation";
import Link from "next/link";
import { getRecipe, loadIndex } from "@/lib/glazes/server";
import { chemistry } from "@/lib/glazes/math";
import { coneText } from "@/lib/glazes/types";
import { Swatch } from "@/components/glazes/Swatch";
import { RecipeDetailClient } from "@/components/glazes/RecipeDetailClient";
import { GlazeCredits } from "@/components/glazes/GlazeCredits";

// Recipes come from the prebuilt index (data/glaze-index), never from the raw 12 MB source.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRecipe(decodeURIComponent(slug));
  if (!r) return { title: "Glaze Not Found" };
  return { title: `${r.name} | Le Four Argile`, description: r.description };
}

const OX_ORDER = ["SiO2", "Al2O3", "B2O3", "Li2O", "Na2O", "K2O", "MgO", "CaO", "SrO", "BaO", "ZnO", "PbO", "P2O5", "Fe2O3", "TiO2", "MnO", "CuO", "CoO", "Cr2O3", "NiO", "SnO2", "ZrO2"];

export default async function GlazePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRecipe(decodeURIComponent(slug));
  if (!r) notFound();
  const chem = chemistry(r.ingredients, loadIndex().glossary);
  const oxides = OX_ORDER.filter((k) => (chem.oxides[k] || 0) >= 0.05);

  return (
    <div className="min-h-screen">
      <div className="relative">
        <Swatch family={r.family} description={r.description} tags={r.tags} className="h-48 md:h-72 w-full" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
      </div>
      <section className="py-8 md:py-12 border-b border-warm-100">
        <div className="max-w-narrow mx-auto px-4 md:px-8">
          <p className="text-label uppercase text-warm-500">
            {r.source === "glazy" ? "Glazy" : "Digitalfire"} · {r.code}
          </p>
          <h1 className="font-serif text-display-sm md:text-display-md leading-tight mt-2">{r.name}</h1>
          <p className="text-caption uppercase tracking-wider text-warm-500 mt-2">
            {coneText(r.cone)}
            {r.atmosphere?.length ? ` · ${r.atmosphere.join(" / ")}` : ""}
            {r.surface ? ` · ${r.surface}` : ""}
            {r.transparency ? ` · ${r.transparency}` : ""}
          </p>
          <p className="text-body-md text-warm-700 mt-4">{r.description}</p>
          {r.subtype && <p className="text-body-sm text-warm-500 mt-1">Listed as: {r.subtype}</p>}
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-narrow mx-auto px-4 md:px-8 space-y-10">
          <div>
            <h2 className="font-serif text-heading-lg mb-4">Recipe & batch</h2>
            <RecipeDetailClient ingredients={r.ingredients} />
          </div>

          {oxides.length > 0 && (
            <div>
              <h2 className="font-serif text-heading-lg mb-1">Chemistry (calculated)</h2>
              <p className="text-body-sm text-warm-500 mb-3">
                Fired oxide analysis from typical material analyses
                {chem.siAl !== undefined && <> · silica:alumina {chem.siAl}</>}
                {chem.unknownPct > 0 && <> · {chem.unknownPct}% of the batch has no known analysis</>}
                {chem.variablePct > 0 && <> · {chem.variablePct}% from variable local materials (test tile first)</>}
              </p>
              <dl className="grid grid-cols-3 sm:grid-cols-4 gap-x-4 gap-y-1 text-body-sm">
                {oxides.map((k) => (
                  <div key={k} className="flex justify-between border-b border-warm-50 py-1">
                    <dt className="text-warm-500">{k}</dt>
                    <dd className="tabular-nums">{chem.oxides[k].toFixed(1)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {(r.longNote || r.note) && (
            <div>
              <h2 className="font-serif text-heading-lg mb-3">Notes from the source</h2>
              <p className="text-body-md text-warm-700 leading-relaxed">{r.longNote || r.note}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-body-sm">
            {r.url && (
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline">
                {r.source === "glazy" ? "Photos, firings & comments on Glazy ↗" : "Full notes on Digitalfire ↗"}
              </a>
            )}
            {r.author && <span className="text-warm-500">Recipe by {r.author} on Glazy</span>}
          </div>

          <Link href="/glazes" className="inline-block text-body-sm text-warm-500 hover:text-charcoal">
            ← Back to Describe it
          </Link>
          <GlazeCredits className="border-t border-warm-100 pt-6" />
        </div>
      </section>
    </div>
  );
}
