import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getInspirations } from "@/lib/data";

interface InspirationItem {
  id: string;
  name: string;
  origin?: string;
  period?: string;
  hasImage?: boolean;
  imageUrl?: string;
  fallbackColor?: string;
  visualCaption?: string;
  story?: {
    hook?: string;
    body?: string;
    reflection?: string;
  };
  connections?: string[];
  techniques?: string[];
  tags?: string[];
  sourceUrl?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const data = await getInspirations();
  const categoryData = data[category as keyof typeof data] as InspirationItem[] | undefined;
  const item = categoryData?.find((i) => i.id === id);

  if (!item) {
    return { title: "Not Found" };
  }

  return {
    title: `${item.name} | Inspirations | Le Four Argile`,
    description: item.story?.hook || item.visualCaption,
  };
}

export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const data = await getInspirations();
  const categoryData = data[category as keyof typeof data] as InspirationItem[] | undefined;
  const item = categoryData?.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  const categoryLabels: Record<string, string> = {
    traditions: "Tradition",
    artists: "Artist",
    places: "Place",
    surfaces: "Surface",
    techniques: "Technique",
    ideas: "Idea",
    moments: "Moment",
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative">
        {/* Image */}
        <div
          className="h-[40vh] min-h-[300px] relative"
          style={{ backgroundColor: item.fallbackColor || "#e8ddd2" }}
        >
          {item.hasImage && item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container-content pb-12">
              {/* Breadcrumb */}
              <nav className="mb-4">
                <Link
                  href={`/inspirations?category=${category}`}
                  className="text-body-sm text-white/80 hover:text-white"
                >
                  &larr; Back to {categoryLabels[category] || category}s
                </Link>
              </nav>

              <span className="tag bg-white/90 text-clay-700 mb-4">
                {categoryLabels[category] || category}
              </span>

              <h1 className="text-display-md text-white text-balance mb-2">
                {item.name}
              </h1>

              {(item.origin || item.period) && (
                <p className="text-body-lg text-white/80">
                  {[item.origin, item.period].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-content">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Visual Caption */}
              {item.visualCaption && (
                <p className="text-heading-md text-clay-700 italic border-l-4 border-glaze-400 pl-6">
                  {item.visualCaption}
                </p>
              )}

              {/* Story */}
              {item.story && (
                <div className="space-y-6">
                  {item.story.hook && (
                    <p className="text-body-lg text-clay-800 font-medium">
                      {item.story.hook}
                    </p>
                  )}

                  {item.story.body && (
                    <div className="prose-custom whitespace-pre-line">
                      {item.story.body}
                    </div>
                  )}

                  {item.story.reflection && (
                    <blockquote className="text-body-lg text-glaze-700 italic bg-glaze-50 p-6 rounded-lg border-l-4 border-glaze-400">
                      {item.story.reflection}
                    </blockquote>
                  )}
                </div>
              )}

              {/* Techniques */}
              {item.techniques && item.techniques.length > 0 && (
                <div>
                  <h2 className="text-heading-md mb-4">Techniques</h2>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {item.techniques.map((technique, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-body-md text-clay-700"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-glaze-500" />
                        {technique}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source */}
              {item.sourceUrl && (
                <div className="pt-6 border-t border-ash-200">
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-glaze-600 hover:text-glaze-700"
                  >
                    Learn more at source &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Connections */}
              {item.connections && item.connections.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-heading-sm mb-4">Connected To</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.connections.map((connection) => (
                      <span key={connection} className="tag">
                        {connection}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/inspirations/connections"
                    className="inline-block mt-4 text-body-sm text-glaze-600 hover:text-glaze-700"
                  >
                    View connections graph &rarr;
                  </Link>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-heading-sm mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag text-caption">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div className="card p-6">
                <h3 className="text-heading-sm mb-4">Quick Info</h3>
                <dl className="space-y-4">
                  {item.origin && (
                    <div>
                      <dt className="text-caption text-clay-500 uppercase tracking-wide">
                        Origin
                      </dt>
                      <dd className="text-body-md text-clay-900">
                        {item.origin}
                      </dd>
                    </div>
                  )}
                  {item.period && (
                    <div>
                      <dt className="text-caption text-clay-500 uppercase tracking-wide">
                        Period
                      </dt>
                      <dd className="text-body-md text-clay-900">
                        {item.period}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-caption text-clay-500 uppercase tracking-wide">
                      Category
                    </dt>
                    <dd className="text-body-md text-clay-900">
                      {categoryLabels[category] || category}
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
