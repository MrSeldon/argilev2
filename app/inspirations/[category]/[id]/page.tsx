import { notFound } from "next/navigation";
import Link from "next/link";
import { getInspirations } from "@/lib/data";
import { imageOf } from "@/components/media/image";
import { Photo } from "@/components/site/Photo";
import { categoryColor, tint } from "@/components/design/palette";
import { InspirationCard } from "@/components/inspirations/InspirationCard";
import { allItems, categoryLabel } from "@/components/inspirations/model";
import { hostOf } from "@/components/opportunities/facts";

async function find(category: string, id: string) {
  const data = await getInspirations();
  const all = allItems(data);
  const item = all.find((i) => i.category === category && i.id === id);
  return { all, item };
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = await params;
  const { item } = await find(category, id);
  if (!item) return { title: "Not found | Le Four Argile" };
  return {
    title: `${item.name} | Inspiration | Le Four Argile`,
    description: item.story?.hook || item.visualCaption,
  };
}

export default async function InspirationDetailPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  const { category, id } = await params;
  const { all, item } = await find(category, id);
  if (!item) notFound();

  const img = imageOf(item);
  const color = categoryColor(category);
  const byId = new Map(all.map((i) => [i.id, i]));
  const connected = (item.connections || []).map((c) => byId.get(c)).filter(Boolean) as typeof all;
  const unlinked = (item.connections || []).filter((c) => !byId.has(c));
  const meta = [item.origin, item.period].filter(Boolean).join(" · ");
  const paragraphs = (item.story?.body || "").split(/\n{2,}/).filter((p) => p.trim());
  const extra = item as typeof item & { tryIt?: string; links?: { label: string; url: string }[] };

  return (
    <article>
      <header className="wrap pt-4 md:pt-12">
        <Link href={`/inspirations?category=${category}`} className="link-quiet text-ink-3">
          <span aria-hidden="true">←</span> {categoryLabel(category)}
        </Link>

        <div className="mt-4 md:mt-6 md:grid md:grid-cols-12 md:gap-10 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow inline-flex items-center gap-2 reveal">
              <span className="block w-1.5 h-1.5 rounded-full" style={{ background: color }} aria-hidden="true" />
              {categoryLabel(category, true)}
              {meta && <span>· {meta}</span>}
            </p>
            <h1 className="display text-[2.6rem] leading-[1.02] md:text-hero mt-3 reveal reveal-1 text-balance">{item.name}</h1>
            {item.visualCaption && (
              <p className="font-serif italic font-light text-[1.5rem] md:text-[1.9rem] leading-snug text-ink-2 mt-4 reveal reveal-2 text-pretty">
                {item.visualCaption}
              </p>
            )}
          </div>

          {/* Without a photograph: a colour study, the entry's own swatch beside its category */}
          {!img && (
            <div className="md:col-span-4 md:col-start-9 mt-8 md:mt-0 reveal reveal-2" aria-hidden="true">
              <div className="flex h-24 md:h-40">
                <div className="flex-[3]" style={{ background: item.fallbackColor || color }} />
                <div className="flex-[2]" style={{ background: tint(item.fallbackColor || color, 0.45) }} />
                <div className="flex-1" style={{ background: tint(color, 0.18) }} />
              </div>
            </div>
          )}
        </div>
      </header>

      {img && (
        <div className="wrap mt-8 md:mt-12">
          <Photo photo={img} ratio="3 / 2" sizes="(min-width: 1200px) 1120px, 100vw" priority frameClassName="max-h-[75vh]" />
        </div>
      )}

      <div className="wrap mt-12 md:mt-20 md:grid md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7">
          {item.story?.hook && (
            <p className="font-serif text-[1.55rem] md:text-[1.85rem] leading-snug text-ink text-pretty">{item.story.hook}</p>
          )}
          {paragraphs.length > 0 && (
            <div className="mt-6 space-y-5 text-body-lg text-ink-2 leading-[1.8] max-w-prose">
              {paragraphs.map((p, k) => (
                <p key={k}>{p}</p>
              ))}
            </div>
          )}
          {item.story?.reflection && (
            <blockquote className="mt-12 pl-6 border-l border-terracotta">
              <p className="font-serif italic text-[1.45rem] md:text-[1.6rem] leading-snug text-ink-2">{item.story.reflection}</p>
            </blockquote>
          )}
          {extra.tryIt && (
            <section className="mt-12 p-5 md:p-6 bg-paper-soft border border-line">
              <h2 className="eyebrow mb-2">Try it in the studio</h2>
              <p className="text-body-md text-ink-2 leading-relaxed">{extra.tryIt}</p>
            </section>
          )}
        </div>

        <aside className="md:col-span-4 md:col-start-9 mt-14 md:mt-2 space-y-10">
          {extra.links && extra.links.length > 0 && (
            <section>
              <h2 className="eyebrow mb-2">Explore further</h2>
              <ul>
                {extra.links.map((l) => (
                  <li key={l.url} className="border-b border-line">
                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 py-3 min-h-11 text-body-md text-ink-2 hover:text-terracotta-deep transition-colors duration-400">
                      <span>{l.label}</span>
                      <span aria-hidden="true" className="text-ink-3">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {item.techniques && item.techniques.length > 0 && (
            <section>
              <h2 className="eyebrow mb-2">Techniques</h2>
              <ul>
                {item.techniques.map((t) => (
                  <li key={t} className="py-2.5 border-b border-line text-body-md text-ink-2">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(item.origin || item.period) && (
            <dl className="grid grid-cols-2 gap-6">
              {item.origin && (
                <div>
                  <dt className="eyebrow mb-1">Origin</dt>
                  <dd className="text-body-md">{item.origin}</dd>
                </div>
              )}
              {item.period && (
                <div>
                  <dt className="eyebrow mb-1">Period</dt>
                  <dd className="text-body-md">{item.period}</dd>
                </div>
              )}
            </dl>
          )}

          {item.tags && item.tags.length > 0 && (
            <section>
              <h2 className="eyebrow mb-3">Threads</h2>
              <ul className="flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
                {unlinked.map((t) => (
                  <li key={t} className="tag">
                    {t.replace(/-/g, " ")}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {connected.length > 0 && (
        <section className="wrap mt-20 md:mt-28">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="font-serif text-display-sm">Connected to</h2>
            <Link href="/inspirations/connections" className="link-quiet">
              See the web <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-8">
            {connected.slice(0, 8).map((c) => (
              <InspirationCard key={`${c.category}-${c.id}`} item={c} />
            ))}
          </div>
        </section>
      )}

      {item.sourceUrl && (
        <footer className="wrap mt-16 md:mt-20">
          <p className="text-caption text-ink-3 border-t border-line pt-4">
            {item.sourceUrl && (
              <>
                Further reading:{" "}
                <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="link">
                  {hostOf(item.sourceUrl)}
                </a>
              </>
            )}
          </p>
        </footer>
      )}
    </article>
  );
}
