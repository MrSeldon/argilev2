import Link from "next/link";
import { getInspirations } from "@/lib/data";
import { PageHeader } from "@/components/site/PageHeader";
import { PHOTOS } from "@/components/site/photos";
import { ChipScroller } from "@/components/site/ChipScroller";
import { ExploreNav } from "@/components/opportunities/ExploreNav";
import { InspirationCard } from "@/components/inspirations/InspirationCard";
import { CATEGORIES, allItems, isCategory } from "@/components/inspirations/model";
import { categoryColor } from "@/components/design/palette";

export const metadata = {
  title: "Inspiration | Le Four Argile",
  description: "Traditions, artists, places, surfaces, techniques and ideas from the long history of clay.",
};

export default async function InspirationsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const data = await getInspirations();
  const everything = allItems(data);
  const active = isCategory(category) ? category! : undefined;
  const items = active ? everything.filter((i) => i.category === active) : everything;

  return (
    <div>
      <PageHeader
        eyebrow="Explore"
        title="Inspiration"
        lede="Traditions, makers, places and surfaces from sixteen thousand years of clay. A slow shelf to wander."
        photo={PHOTOS.onta}
        photoOnPhone={false}
      >
        <ExploreNav active="/inspirations" />
      </PageHeader>

      <section className="wrap mt-6 md:mt-8" aria-label="Filters">
        <ChipScroller label="Filter by category">
          <Link href="/inspirations" aria-current={!active ? "page" : undefined} className={`chip ${!active ? "chip-on" : "chip-off"}`} scroll={false}>
            All <span className="opacity-60 tabular-nums">{everything.length}</span>
          </Link>
          {CATEGORIES.map((c) => {
            const on = active === c.key;
            const n = everything.filter((i) => i.category === c.key).length;
            return (
              <Link
                key={c.key}
                href={`/inspirations?category=${c.key}`}
                aria-current={on ? "page" : undefined}
                className={`chip ${on ? "chip-on" : "chip-off"}`}
                scroll={false}
              >
                <span className="block w-1.5 h-1.5 rounded-full" style={{ background: categoryColor(c.key) }} aria-hidden="true" />
                {c.label} <span className="opacity-60 tabular-nums">{n}</span>
              </Link>
            );
          })}
        </ChipScroller>

        <div className="flex items-baseline justify-between gap-6 mt-5 pb-3 border-b border-line">
          <p className="text-body-sm text-ink-2">
            {items.length} {items.length === 1 ? "entry" : "entries"}
          </p>
          <Link href="/inspirations/connections" className="link-quiet">
            How they connect <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="wrap mt-8 md:mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-14">
          {items.map((item, i) => (
            <InspirationCard key={`${item.category}-${item.id}`} item={item} priority={i < 4} />
          ))}
        </div>
      </section>
    </div>
  );
}
