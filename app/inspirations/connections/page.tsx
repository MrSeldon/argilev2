import { getInspirations } from "@/lib/data";
import { ConnectionsGraph } from "@/components/inspirations/ConnectionsGraph";
import Link from "next/link";

export const metadata = {
  title: "Connections | Inspirations | Le Four Argile",
  description: "Explore the web of connections between ceramics traditions, artists, and ideas",
};

interface InspirationItem {
  id: string;
  name: string;
  connections?: string[];
  fallbackColor?: string;
}

interface GraphNode {
  id: string;
  name: string;
  category: string;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
}

export default async function ConnectionsPage() {
  const data = await getInspirations();

  const categories = [
    { key: "traditions", color: "#8f7359" },
    { key: "artists", color: "#5da088" },
    { key: "places", color: "#3b82f6" },
    { key: "surfaces", color: "#a855f7" },
    { key: "techniques", color: "#f59e0b" },
    { key: "ideas", color: "#ec4899" },
    { key: "moments", color: "#6366f1" },
  ];

  // Build nodes and links
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeIds = new Set<string>();

  for (const cat of categories) {
    const items = data[cat.key as keyof typeof data] as InspirationItem[] | undefined;
    if (!items) continue;

    for (const item of items) {
      nodes.push({
        id: item.id,
        name: item.name,
        category: cat.key,
        color: item.fallbackColor || cat.color,
      });
      nodeIds.add(item.id);
    }
  }

  // Add links
  for (const cat of categories) {
    const items = data[cat.key as keyof typeof data] as InspirationItem[] | undefined;
    if (!items) continue;

    for (const item of items) {
      if (item.connections) {
        for (const connection of item.connections) {
          // Only add link if target exists
          if (nodeIds.has(connection)) {
            links.push({
              source: item.id,
              target: connection,
            });
          }
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <section className="py-8 border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Link
                href="/inspirations"
                className="text-sm text-warm-500 hover:text-charcoal transition-colors mb-2 inline-block"
              >
                ← Back to Inspirations
              </Link>
              <h1 className="font-serif text-2xl md:text-3xl tracking-tight">
                Connections
              </h1>
              <p className="text-sm text-warm-500 mt-1">
                {nodes.length} items · {links.length} connections
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <div key={cat.key} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs text-warm-500 capitalize">
                    {cat.key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Graph */}
      <section className="flex-1 bg-warm-50">
        <ConnectionsGraph nodes={nodes} links={links} />
      </section>
    </div>
  );
}
