import Link from "next/link";
import { getInspirations } from "@/lib/data";
import { ConnectionsGraph } from "@/components/inspirations/ConnectionsGraph";
import { CATEGORIES, allItems } from "@/components/inspirations/model";
import { categoryColor } from "@/components/design/palette";

export const metadata = {
  title: "Connections | Inspiration | Le Four Argile",
  description: "The web of connections between ceramics traditions, artists, places and ideas.",
};

export default async function ConnectionsPage() {
  const data = await getInspirations();
  const items = allItems(data);

  // Each node takes its category colour so the legend means something.
  const nodes = items.map((i) => ({ id: i.id, name: i.name, category: i.category, color: categoryColor(i.category) }));
  const ids = new Set(nodes.map((n) => n.id));
  const links = items.flatMap((i) => (i.connections || []).filter((c) => ids.has(c)).map((c) => ({ source: i.id, target: c })));

  return (
    <div className="h-view flex flex-col overflow-hidden">
      <div className="wrap shrink-0 py-3 md:py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link href="/inspirations" className="link-quiet text-ink-3 -mt-2">
              <span aria-hidden="true">←</span> Inspiration
            </Link>
            <h1 className="font-serif text-[1.8rem] md:text-display-sm leading-none">How they connect</h1>
            <p className="text-caption text-ink-3 mt-1.5">
              {nodes.length} entries · {links.length} threads between them
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-3" aria-label="Legend">
          {CATEGORIES.map((c) => (
            <li key={c.key} className="flex items-center gap-1.5 text-caption text-ink-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColor(c.key) }} aria-hidden="true" />
              {c.label}
            </li>
          ))}
        </ul>
      </div>

      <section className="flex-1 min-h-0 bg-oat/50 border-t border-line overflow-hidden">
        <ConnectionsGraph nodes={nodes} links={links} />
      </section>
    </div>
  );
}
