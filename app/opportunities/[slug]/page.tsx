import { notFound } from "next/navigation";
import Link from "next/link";
import { getOpportunities, getOpportunityById, getRelatedOpportunities } from "@/lib/data";
import {
  getSuitabilityForOpportunity,
  calculateSuitabilityScore,
  getSuitabilitySummary,
} from "@/lib/suitability";
import { OpportunityDetailClient } from "@/components/opportunities/OpportunityDetailClient";
import { imageOf } from "@/components/media/image";
import { Photo } from "@/components/site/Photo";
import { LocationMark, coordText } from "@/components/design/LocationMark";
import { typeColor, tint } from "@/components/design/palette";
import { factsOf, hostOf, isPast, isUnconfirmed, prettyDate, typeLabel, type Fact } from "@/components/opportunities/facts";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";

export async function generateStaticParams() {
  const opportunities = await getOpportunities();
  return opportunities.map((opp) => ({ slug: opp.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const opportunity = await getOpportunityById(slug);
  if (!opportunity) return { title: "Not found | Le Four Argile" };
  return {
    title: `${opportunity.name} | Le Four Argile`,
    description: opportunity.description,
  };
}

export default async function OpportunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const o = await getOpportunityById(slug);
  if (!o) notFound();

  const f = factsOf(o);
  const img = imageOf(o);
  const color = typeColor(o.type);
  const hasCoords = typeof f.place.lat === "number";

  const suitability =
    f.place.city || f.place.country
      ? await getSuitabilityForOpportunity(
          f.place.city || "",
          f.place.region || "",
          f.place.country || "",
          hasCoords ? { lat: f.place.lat as number, lng: f.place.lng as number } : undefined
        )
      : null;
  const suitabilityScore = suitability ? calculateSuitabilityScore(suitability) : null;
  const suitabilitySummary = suitability ? getSuitabilitySummary(suitability) : null;

  const related = await getRelatedOpportunities(o, 3);
  const fundingFirst = ["school", "residency", "workshop", "apprenticeship"].includes(o.type);

  // Short facts go in the band up top; long prose answers move to the side column.
  const short = (x?: Fact) => !!x && x.value.length <= 48;
  const keyFacts = [f.when, f.deadline, f.cost, f.apply].filter(short) as Fact[];
  const moreFacts = [f.apply && !short(f.apply) ? f.apply : undefined, f.when && !short(f.when) ? f.when : undefined, f.cost && !short(f.cost) ? f.cost : undefined, f.deadline && !short(f.deadline) ? f.deadline : undefined, f.funding, f.visa, f.housing, f.level, f.eligibility].filter(Boolean) as Fact[];
  const facilities = (o.facilities || []).filter((x) => typeof x === "string" && x.trim());
  const focus = (o.focusAreas || []).filter(Boolean);

  return (
    <article>
      {/* Header */}
      <header className="wrap pt-4 md:pt-12">
        <Link href="/opportunities" className="link-quiet text-ink-3">
          <span aria-hidden="true">←</span> Opportunities
        </Link>
        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <p className="eyebrow inline-flex items-center gap-2 reveal">
              <span className="block w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />
              {typeLabel(o.type)}
              {f.place.country && <span>· {f.place.country}</span>}
            </p>
            <h1 className="display text-[2.4rem] leading-[1.04] md:text-display-lg mt-3 reveal reveal-1 text-balance">{o.name}</h1>
            {o.nameEnglish && <p className="font-serif italic text-heading-md text-ink-2 mt-2 reveal reveal-1">{o.nameEnglish}</p>}
            <p className="text-body-md text-ink-2 mt-3 reveal reveal-2">{f.place.line}</p>

            {(isUnconfirmed(o) || isPast(o)) && (
              <p className="mt-5 inline-flex items-start gap-2.5 text-body-sm text-ink-2 bg-oat/70 px-4 py-3 max-w-prose">
                <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-terracotta shrink-0" aria-hidden="true" />
                {isPast(o)
                  ? "This was a 2026 event and has already happened. Kept here for reference."
                  : "Not recently confirmed. Details come from older or secondhand sources, so check with them directly before planning around it."}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Photograph, when there is one */}
      {img && (
        <div className="wrap mt-8 md:mt-12">
          <Photo photo={img} ratio="16 / 9" sizes="(min-width: 1200px) 1120px, 100vw" priority frameClassName="max-h-[70vh]" />
        </div>
      )}

      {/* Key facts */}
      <section aria-label="Key facts" className="wrap mt-8 md:mt-12">
        <div className="border-y border-line md:grid md:grid-cols-12 md:gap-10">
          <dl className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4">
            <FactCell fact={{ label: "Where", value: f.place.local || f.place.line || "", note: f.place.country }} />
            {keyFacts.map((k) => (
              <FactCell key={k.label} fact={k} />
            ))}
          </dl>
          <div className="md:col-span-4 flex flex-col justify-center gap-2 py-5 md:py-6 md:border-l md:border-line md:pl-10 border-t md:border-t-0">
            {f.website && (
              <a href={f.website} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                Visit {hostOf(f.website)} <span aria-hidden="true">↗</span>
              </a>
            )}
            {hasCoords && (
              <Link href={`/opportunities/map?focus=${encodeURIComponent(o.id)}`} className="btn-ghost w-full">
                See on the map
              </Link>
            )}
            {suitability && suitabilityScore !== null && suitabilitySummary && (
              <OpportunityDetailClient suitability={suitability} score={suitabilityScore} summary={suitabilitySummary} compact />
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="wrap mt-12 md:mt-16 md:grid md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7 space-y-12">
          {(o.description || o.details) && (
            <section>
              <h2 className="eyebrow mb-4">About</h2>
              {o.description && <p className="font-serif text-[1.45rem] md:text-[1.6rem] leading-snug text-ink text-pretty">{o.description}</p>}
              {o.details && <p className="text-body-md text-ink-2 mt-5 max-w-prose leading-relaxed">{o.details}</p>}
              {o.descriptionOriginal && (
                <p className="text-body-sm italic text-ink-3 mt-4 max-w-prose" lang="es">
                  “{o.descriptionOriginal}”
                </p>
              )}
            </section>
          )}

          {o.goodFor && (
            <section>
              <h2 className="eyebrow mb-3">Good for</h2>
              <p className="text-body-lg text-ink-2 max-w-prose">{o.goodFor}</p>
            </section>
          )}

          {facilities.length > 0 && (
            <section>
              <h2 className="eyebrow mb-3">In the studio</h2>
              <ul className="grid sm:grid-cols-2 gap-x-8">
                {facilities.map((x, i) => (
                  <li key={i} className="py-2.5 border-b border-line text-body-md text-ink-2">
                    {x.charAt(0).toUpperCase() + x.slice(1)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {focus.length > 0 && (
            <section>
              <h2 className="eyebrow mb-3">Focus</h2>
              <ul className="flex flex-wrap gap-2">
                {focus.map((x) => (
                  <li key={x} className="tag">
                    {x.charAt(0).toUpperCase() + x.slice(1)}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="md:col-span-4 md:col-start-9 mt-12 md:mt-0 space-y-10">
          {moreFacts.length > 0 && (
            <dl className="space-y-6">
              {moreFacts.map((m) => (
                <div key={m.label}>
                  <dt className="eyebrow mb-1.5">{m.label}</dt>
                  <dd className="text-body-md text-ink">{m.value}</dd>
                  {m.note && <dd className="text-body-sm text-ink-3 mt-1">{m.note}</dd>}
                </div>
              ))}
            </dl>
          )}

          {hasCoords && !img && (
            <figure className="p-5" style={{ background: tint(color, 0.12) }}>
              <LocationMark lat={f.place.lat} lng={f.place.lng} color={color} className="w-full text-ink-3" label={`Location: ${f.place.line}`} />
              <figcaption className="flex justify-between mt-3 text-caption text-ink-3">
                <span>{f.place.city || f.place.country}</span>
                <span className="tabular-nums">
                  {coordText(f.place.lat, f.place.lng)}
                  {f.place.approximate ? " approx." : ""}
                </span>
              </figcaption>
            </figure>
          )}

          {suitability && suitabilityScore !== null && suitabilitySummary && (
            <OpportunityDetailClient suitability={suitability} score={suitabilityScore} summary={suitabilitySummary} />
          )}
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="wrap mt-20 md:mt-28">
          <h2 className="font-serif text-display-sm">{fundingFirst ? "Ways to fund it" : "Programmes it could fund"}</h2>
          <p className="text-body-sm text-ink-3 mt-1">
            {fundingFirst ? "Grants and scholarships in the same country or region." : "Schools and residencies nearby."}
          </p>
          <div className="mt-6 sm:mt-10 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-8 sm:gap-y-12">
            {related.map((r) => (
              <OpportunityCard key={r.id} opportunity={r} />
            ))}
          </div>
        </section>
      )}

      {/* Provenance */}
      {(f.sourceUrl || f.lastVerified) && (
        <footer className="wrap mt-16 md:mt-20">
          <p className="text-caption text-ink-3 border-t border-line pt-4">
            {f.sourceUrl && (
              <>
                Source:{" "}
                <a href={f.sourceUrl} target="_blank" rel="noopener noreferrer" className="link">
                  {f.sourceLabel}
                </a>
              </>
            )}
            {f.sourceUrl && f.lastVerified && " · "}
            {f.lastVerified && <>Last verified {prettyDate(f.lastVerified)}</>}
          </p>
        </footer>
      )}
    </article>
  );
}

function FactCell({ fact }: { fact: Fact }) {
  if (!fact.value) return null;
  return (
    <div className="py-5 pr-4">
      <dt className="eyebrow mb-1.5">{fact.label}</dt>
      <dd className="text-body-md text-ink leading-snug">{fact.value}</dd>
      {fact.note && <dd className="text-caption text-ink-3 mt-1">{fact.note}</dd>}
    </div>
  );
}
