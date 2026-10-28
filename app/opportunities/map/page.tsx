import { getOpportunities } from "@/lib/data";
import { OpportunityMap } from "@/components/opportunities/OpportunityMap";
import { ListMapSwitch } from "@/components/opportunities/ExploreNav";
import { inBayArea } from "@/lib/opportunity-map";
import { isPast } from "@/components/opportunities/facts";

export const metadata = {
  title: "Opportunities map | Le Four Argile",
  description: "Ceramics studios, schools, residencies and suppliers on a map: the Bay Area and the world.",
};

export default async function OpportunitiesMapPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string; focus?: string }>;
}) {
  const { scope, focus } = await searchParams;
  const opportunities = await getOpportunities();

  const mappable = opportunities.filter(
    (o) =>
      !isPast(o) &&
      typeof o.location === "object" &&
      o.location.coordinates?.lat !== undefined &&
      o.location.coordinates?.lng !== undefined
  );

  // A focused place outside the Bay opens the world view.
  const focused = focus ? mappable.find((o) => o.id === focus) : undefined;
  const c = focused?.location.coordinates;
  const initialScope = scope === "world" || (c && !inBayArea(c.lat, c.lng)) ? "world" : "bay";

  return (
    <div className="h-view flex flex-col">
      <div className="wrap shrink-0 flex items-center justify-between gap-4 py-2.5 md:py-4">
        <h1 className="font-serif text-[1.6rem] md:text-display-sm leading-none">Opportunities</h1>
        <ListMapSwitch active="map" />
      </div>
      <OpportunityMap opportunities={mappable} initialScope={initialScope} initialSelected={focused?.id} />
    </div>
  );
}
