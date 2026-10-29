import { getHighlights } from "@/lib/highlights";
import { HighlightCard } from "@/components/highlights/HighlightCard";
import { PageHeader } from "@/components/site/PageHeader";
import { ExploreNav } from "@/components/opportunities/ExploreNav";

export const metadata = {
  title: "Highlights | Le Four Argile",
  description: "Hand-picked finds around the Bay and beyond: what's on, what's due, and places worth the time.",
};
export const revalidate = 3600; // dated finds drop off on their own

export default async function HighlightsPage() {
  const all = await getHighlights();
  const soon = all.filter((h) => h.until);
  const always = all.filter((h) => !h.until);
  return (
    <div className="pb-24">
      <PageHeader eyebrow="Explore" title="Highlights" lede="Hand-picked finds: what's on and what's due soon, then the places worth knowing. A few of these change on the home page each day.">
        <ExploreNav active="/highlights" />
      </PageHeader>
      {soon.length > 0 && (
        <section className="wrap mt-10 md:mt-14" aria-labelledby="soon">
          <h2 id="soon" className="eyebrow border-b border-line pb-3">Coming up</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {soon.map((h) => (
              <HighlightCard key={h.id} h={h} />
            ))}
          </div>
        </section>
      )}
      <section className="wrap mt-20" aria-labelledby="always">
        <h2 id="always" className="eyebrow border-b border-line pb-3">Worth knowing</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {always.map((h) => (
            <HighlightCard key={h.id} h={h} />
          ))}
        </div>
      </section>
    </div>
  );
}
