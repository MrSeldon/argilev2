import Link from "next/link";
import { getOpportunities } from "@/lib/data";
import type { Opportunity } from "@/lib/types";
import { PageHeader } from "@/components/site/PageHeader";
import { PHOTOS } from "@/components/site/photos";
import { ChipScroller } from "@/components/site/ChipScroller";
import { ExploreNav, ListMapSwitch } from "@/components/opportunities/ExploreNav";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { CountrySelect } from "@/components/opportunities/CountrySelect";
import { countryOf, isPast, typeLabel } from "@/components/opportunities/facts";
import { typeColor } from "@/components/design/palette";

export const metadata = {
  title: "Opportunities | Le Four Argile",
  description: "Residencies, schools, grants, studios and suppliers for ceramics, around the world and around the Bay.",
};

interface SearchParams {
  type?: string;
  country?: string;
  past?: string;
}

function href(params: SearchParams, patch: Partial<SearchParams>) {
  const p = new URLSearchParams();
  const next = { ...params, ...patch };
  for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
  const qs = p.toString();
  return `/opportunities${qs ? `?${qs}` : ""}`;
}

export default async function OpportunitiesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const all = await getOpportunities();

  const showPast = params.past === "1";
  const pastCount = all.filter(isPast).length;
  const visible = showPast ? all : all.filter((o) => !isPast(o));

  // Type counts follow the country filter; country counts follow the type filter.
  const inCountry = params.country ? visible.filter((o) => countryOf(o) === params.country) : visible;
  const ofType = params.type ? visible.filter((o) => o.type === params.type) : visible;
  const filtered = params.type ? inCountry.filter((o) => o.type === params.type) : inCountry;

  const typeCounts = count(inCountry, (o) => o.type);
  const countryCounts = count(ofType, (o) => countryOf(o)).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div>
      <PageHeader
        eyebrow="Explore"
        title="Opportunities"
        lede="Residencies, schools, grants, studios and suppliers. Places to learn, work and fire, from Kigali to the Bay."
        photo={PHOTOS.earthen}
        photoOnPhone={false}
      >
        <ExploreNav active="/opportunities" />
      </PageHeader>

      <section className="wrap mt-6 md:mt-8" aria-label="Filters">
        <div className="flex flex-wrap items-center gap-3">
          <ListMapSwitch active="list" />
          <CountrySelect countries={countryCounts} value={params.country} />
        </div>

        <ChipScroller label="Filter by type" className="mt-4">
          <Link
            href={href(params, { type: undefined })}
            aria-current={!params.type ? "page" : undefined}
            className={`chip ${!params.type ? "chip-on" : "chip-off"}`}
            scroll={false}
          >
            All <span className="opacity-60 tabular-nums">{inCountry.length}</span>
          </Link>
          {typeCounts.map(([t, n]) => {
            const on = params.type === t;
            return (
              <Link
                key={t}
                href={href(params, { type: on ? undefined : t })}
                aria-current={on ? "page" : undefined}
                className={`chip ${on ? "chip-on" : "chip-off"}`}
                scroll={false}
              >
                <span className="block w-1.5 h-1.5 rounded-full" style={{ background: typeColor(t) }} aria-hidden="true" />
                {typeLabel(t)} <span className="opacity-60 tabular-nums">{n}</span>
              </Link>
            );
          })}
        </ChipScroller>

        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mt-5 pb-3 border-b border-line">
          <p className="text-body-sm text-ink-2" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "place" : "places"}
            {params.type && <> · {typeLabel(params.type).toLowerCase()}</>}
            {params.country && <> in {params.country}</>}
          </p>
          <div className="flex gap-5">
            {(params.type || params.country) && (
              <Link href={href({ past: params.past }, {})} className="link-quiet" scroll={false}>
                Clear filters
              </Link>
            )}
            {pastCount > 0 && (
              <Link href={href(params, { past: showPast ? undefined : "1" })} className="link-quiet text-ink-3" scroll={false}>
                {showPast ? "Hide past events" : `Show past events (${pastCount})`}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="wrap mt-2 sm:mt-10">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-heading-lg">Nothing here with these filters.</p>
            <Link href="/opportunities" className="btn-secondary mt-6">
              See everything
            </Link>
          </div>
        ) : (
          <div className="sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-8 sm:gap-y-14">
            {filtered.map((o, i) => (
              <OpportunityCard key={o.id} opportunity={o} priority={i < 3} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function count(list: Opportunity[], key: (o: Opportunity) => string | undefined): [string, number][] {
  const m = new Map<string, number>();
  for (const o of list) {
    const k = key(o);
    if (k) m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
