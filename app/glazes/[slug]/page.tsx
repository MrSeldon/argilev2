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
    <article>
      <header className="wrap-narrow !max-w-[46rem] pt-4 md:pt-12">
        <Link href="/glazes" className="link-quiet text-ink-3">
          <span aria-hidden="true">←</span> Glazes
        </Link>
        <div className="mt-4 md:mt-6 flex gap-5 md:gap-8 items-start">
          {/* the glaze as a test tile */}
          <Swatch
            family={r.family}
            description={r.description}
            tags={r.tags}
            className="shrink-0 w-24 h-28 md:w-36 md:h-44 rounded-t-[999px] shadow-card reveal"
          />
          <div className="min-w-0">
            <p className="eyebrow reveal">
              {r.source === "glazy" ? "Glazy" : "Digitalfire"} · {r.code}
            </p>
            <h1 className="display text-[2rem] md:text-display-md leading-[1.08] mt-2 reveal reveal-1 text-balance">{r.name}</h1>
            <p className="text-caption uppercase tracking-wider text-ink-3 mt-3 reveal reveal-2">
              {coneText(r.cone)}
              {r.atmosphere?.length ? ` · ${r.atmosphere.join(" / ")}` : ""}
              {r.surface ? ` · ${r.surface}` : ""}
              {r.transparency ? ` · ${r.transparency}` : ""}
            </p>
          </div>
        </div>
        <p className="lede mt-6 md:mt-8">{r.description}</p>
        {r.subtype && <p className="text-body-sm text-ink-3 mt-1">Listed as: {r.subtype}</p>}
      </header>

      <div className="wrap-narrow !max-w-[46rem] mt-12 md:mt-16 space-y-14">
        <section>
          <h2 className="font-serif text-display-sm mb-5">Recipe and batch</h2>
          <RecipeDetailClient ingredients={r.ingredients} />
        </section>

        {oxides.length > 0 && (
          <section>
            <h2 className="font-serif text-display-sm mb-1">Chemistry</h2>
            <p className="text-body-sm text-ink-3 mb-4">
              Calculated fired oxide analysis from typical material analyses
              {chem.siAl !== undefined && <> · silica:alumina {chem.siAl}</>}
              {chem.unknownPct > 0 && <> · {chem.unknownPct}% of the batch has no known analysis</>}
              {chem.variablePct > 0 && <> · {chem.variablePct}% from variable local materials (test tile first)</>}
            </p>
            <dl className="grid grid-cols-3 sm:grid-cols-4 gap-x-6 gap-y-1 text-body-sm">
              {oxides.map((k) => (
                <div key={k} className="flex justify-between border-b border-line py-1.5">
                  <dt className="text-ink-3">{k}</dt>
                  <dd className="tabular-nums">{chem.oxides[k].toFixed(1)}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {(r.longNote || r.note) && (
          <section>
            <h2 className="font-serif text-display-sm mb-3">Notes from the source</h2>
            <p className="text-body-md text-ink-2 leading-relaxed">{r.longNote || r.note}</p>
          </section>
        )}

        <div className="flex flex-wrap items-center gap-x-6 text-body-sm">
          {r.url && (
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center min-h-11">
              {r.source === "glazy" ? "Photos, firings and comments on Glazy ↗" : "Full notes on Digitalfire ↗"}
            </a>
          )}
          {r.author && <span className="text-ink-3">Recipe by {r.author} on Glazy</span>}
        </div>

        <GlazeCredits className="border-t border-line pt-6" />
      </div>
    </article>
  );
}
