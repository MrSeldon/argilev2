import Link from "next/link";
import { getOpportunities } from "@/lib/data";
import type { Opportunity } from "@/lib/types";
import { PageHeader } from "@/components/site/PageHeader";
import { PHOTOS } from "@/components/site/photos";
import { ChipScroller } from "@/components/site/ChipScroller";
import { ExploreNav } from "@/components/opportunities/ExploreNav";
import { ViewSwitch } from "@/components/opportunities/ViewSwitch";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { CountrySelect } from "@/components/opportunities/CountrySelect";
import { countryOf, isPast, typeLabel } from "@/components/opportunities/facts";
import { typeColor } from "@/components/design/palette";
import { inScope, isCeramics, type MapScope } from "@/lib/opportunity-map";

export const metadata = {
  title: "Opportunities | Le Four Argile",
  description: "Residencies, schools, grants, studios and suppliers for ceramics, around the world and around the Bay.",
};

interface SearchParams {
  type?: string;
  country?: string;
  past?: string;
  making?: string;   // "all" shows weaving, print, wood, museums...; default is ceramics
  scope?: string;    // bay (default) | colombia | east-africa | world, as on the map
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
  const allMaking = params.making === "all";
  const crafted = allMaking ? all : all.filter((o) => isCeramics(o as { discipline?: string }));
  const scope: MapScope = (["bay", "colombia", "east-africa", "world"] as MapScope[]).find((r) => r === params.scope) || "bay";
  const regional = crafted.filter((o) => {
    if (scope === "world") return true;
    const c = typeof o.location === "object" ? o.location.coordinates : undefined;
    return !!c && inScope(scope, c.lat, c.lng);
  });
  const visible = showPast ? regional : regional.filter((o) => !isPast(o));

  // Type counts follow the country filter; country counts follow the type filter.
  const country = scope === "world" ? params.country : undefined;   // the country menu only shows under World
  const inCountry = country ? visible.filter((o) => countryOf(o) === country) : visible;
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
          <ViewSwitch active="list" />
          <Seg
            label="Area"
            items={[
              { v: undefined, label: "Bay Area", on: scope === "bay" },
              { v: "colombia", label: "Colombia", on: scope === "colombia" },
              { v: "east-africa", label: "East Africa", on: scope === "east-africa" },
              { v: "world", label: "World", on: scope === "world" },
            ].map((o) => ({ ...o, href: href(params, { scope: o.v, type: undefined, country: undefined }) }))}
          />
          <Seg
            label="Craft"
            items={[
              { v: undefined, label: "Ceramics", on: params.making !== "all" },
              { v: "all", label: "All making", on: params.making === "all" },
            ].map((o) => ({ ...o, href: href(params, { making: o.v, type: undefined }) }))}
          />
          {scope === "world" && <CountrySelect countries={countryCounts} value={params.country} />}
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
            {country ? <> in {country}</> : <> {REGION_PHRASE[scope]}</>}
          </p>
          <div className="flex gap-5">
            {(params.type || country) && (
              <Link href={href({ past: params.past, scope: params.scope, making: params.making }, {})} className="link-quiet" scroll={false}>
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

const REGION_PHRASE: Record<MapScope, string> = { bay: "in the Bay Area", colombia: "in Colombia", "east-africa": "in East Africa", world: "worldwide" };

/** The map's segmented control, as links (so the list stays server-rendered and shareable). */
function Seg({ label, items }: { label: string; items: { label: string; href: string; on: boolean }[] }) {
  return (
    <div role="group" aria-label={label} className="inline-flex p-1 rounded-full bg-oat/80 border border-line max-w-full overflow-x-auto">
      {items.map((o) => (
        <Link
          key={o.label}
          href={o.href}
          scroll={false}
          aria-current={o.on ? "page" : undefined}
          className={`inline-flex items-center min-h-11 px-2.5 sm:px-5 rounded-full text-[13px] sm:text-body-sm whitespace-nowrap transition-colors duration-400 ${
            o.on ? "bg-paper-soft text-ink shadow-subtle" : "text-ink-3 hover:text-ink"
          }`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}
