import Image from "next/image";
import Link from "next/link";
import { getInspirations, getOpportunities } from "@/lib/data";
import { inBayArea } from "@/lib/opportunity-map";
import { CloudBackground } from "@/components/CloudBackground";
import { PHOTOS, type SitePhoto } from "@/components/site/photos";
import { Credit } from "@/components/site/Photo";
import { InspirationCard } from "@/components/inspirations/InspirationCard";
import { allItems } from "@/components/inspirations/model";
import { isPast } from "@/components/opportunities/facts";

export const metadata = {
  title: "Le Four Argile",
  description: "Winnie's studio companion: describe a glaze, find places to work and learn, ask a mentor.",
};

// Re-render daily so the inspiration picks change.
export const revalidate = 86400;

interface Doorway {
  n: string;
  title: string;
  line: string;
  href?: string;
  cta?: string;
  photo: SitePhoto;
  soon?: boolean;
}

const DOORWAYS: Doorway[] = [
  {
    n: "01",
    title: "Make",
    line: "Sketch a form and see it rendered in clay and glaze before the wheel turns.",
    photo: PHOTOS.wheel,
    soon: true,
  },
  {
    n: "02",
    title: "Glazes",
    line: "Describe the glaze you want in your own words. Keep your shelf, see what you can mix today.",
    href: "/glazes",
    cta: "Find a glaze",
    photo: PHOTOS.shino,
  },
  {
    n: "03",
    title: "Explore",
    line: "Residencies, schools, grants and studios, on a list or a map. Plus a long shelf of inspiration.",
    href: "/opportunities",
    cta: "Explore",
    photo: PHOTOS.earthen,
  },
  {
    n: "04",
    title: "Ask",
    line: "A mentor for technique, chemistry and the kiln, whenever a question comes up.",
    href: "/mentor",
    cta: "Ask a question",
    photo: PHOTOS.hands,
  },
];

export default async function Home() {
  const [insp, opps] = await Promise.all([getInspirations(), getOpportunities()]);

  // Three inspiration entries, a different trio each day.
  const items = allItems(insp);
  const day = Math.floor(Date.now() / 86_400_000);
  const picks = [0, 1, 2].map((k) => items[(day * 7 + k * 47) % items.length]);

  const bay = opps.filter((o) => {
    const c = typeof o.location === "object" ? o.location.coordinates : undefined;
    return !isPast(o) && c && inBayArea(c.lat, c.lng);
  }).length;

  const hero = PHOTOS.bottles;

  return (
    <div>
      {/* Hero ------------------------------------------------------------- */}
      <section className="relative h-[86svh] min-h-[540px] md:h-[100svh] w-full overflow-hidden bg-matte">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover animate-fade-in"
          style={{ objectPosition: hero.position }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte/75 via-matte/15 to-matte/35" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="wrap pb-10 md:pb-16">
            <p className="text-label uppercase text-paper/80 reveal">Laini Studio · Kigali, then San Francisco</p>
            <h1 className="font-serif font-light text-paper text-[3.1rem] leading-[0.98] md:text-hero mt-3 reveal reveal-1">
              Le Four Argile
            </h1>
            <p className="text-paper/90 text-body-lg md:text-[1.2rem] leading-relaxed max-w-[30rem] mt-4 reveal reveal-2 text-pretty">
              Winnie’s studio companion. A quiet place to chase a glaze, find somewhere to work and learn, and ask
              what the kiln is trying to say.
            </p>
          </div>
        </div>
        <Credit photo={hero} light className="absolute right-5 bottom-3 md:right-6 md:bottom-4" />
      </section>

      {/* Doorways --------------------------------------------------------- */}
      <section className="wrap mt-16 md:mt-28" aria-labelledby="doorways">
        <div className="md:grid md:grid-cols-12 md:gap-10 items-end">
          <h2 id="doorways" className="md:col-span-6 font-serif font-light text-[2.1rem] md:text-display-lg leading-[1.05] text-balance">
            For the existential alchemist, four doors.
          </h2>
          <p className="md:col-span-5 md:col-start-8 mt-4 md:mt-0 text-body-lg text-ink-2 text-pretty">
            Everything here is for the work: the surface you’re imagining, the next place to make, and a second
            opinion when something comes out of the kiln strange.
          </p>
        </div>

        <ul className="mt-10 md:mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {DOORWAYS.map((d) => (
            <li key={d.n}>
              <DoorwayCard d={d} />
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[11px] text-ink-3">
          Photographs:{" "}
          {DOORWAYS.map((d, i) => (
            <span key={d.n}>
              <a href={d.photo.creditUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-current/30 underline-offset-2 hover:decoration-current">
                {d.photo.credit}
              </a>{" "}
              ({d.photo.license}){i < DOORWAYS.length - 1 ? ", " : "."}
            </span>
          ))}
        </p>
      </section>

      {/* Inspiration, quietly --------------------------------------------- */}
      <section className="wrap mt-24 md:mt-36" aria-labelledby="today">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-4">
          <div>
            <p className="eyebrow">From the inspiration shelf</p>
            <h2 id="today" className="font-serif text-display-sm mt-1">
              Today
            </h2>
          </div>
          <Link href="/inspirations" className="link-quiet">
            All {items.length} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 sm:gap-x-8">
          {picks.map((p, i) => (
            <div key={p.id} className={i === 2 ? "hidden lg:block" : ""}>
              <InspirationCard item={p} />
            </div>
          ))}
        </div>
      </section>

      {/* The Bay ----------------------------------------------------------- */}
      {bay > 0 && (
        <section className="wrap mt-24 md:mt-36">
          <div className="bg-teal text-paper px-6 py-10 md:px-14 md:py-16 md:grid md:grid-cols-12 md:gap-10 md:items-end">
            <div className="md:col-span-7">
              <p className="text-label uppercase text-paper/70">Next: San Francisco</p>
              <p className="font-serif font-light text-[2rem] md:text-display-md leading-[1.08] mt-3 text-balance">
                {bay} studios, classes, suppliers and clubs around the Bay, already on the map.
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9 mt-8 md:mt-0 flex md:justify-end">
              <Link
                href="/opportunities/map"
                className="btn border border-paper/70 text-paper hover:bg-paper hover:text-teal"
              >
                Open the Bay map
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Clouds ------------------------------------------------------------ */}
      <section className="relative mt-24 md:mt-36 h-[62svh] min-h-[420px] overflow-hidden bg-[#c9cfd4]" aria-labelledby="clouds">
        <CloudBackground contained />
        <div className="absolute inset-0 bg-gradient-to-t from-matte/45 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="wrap pb-10 md:pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 id="clouds" className="font-serif font-light text-paper text-[2.4rem] md:text-display-lg leading-none">
                Clouds
              </h2>
              <p className="text-paper/90 text-body-lg mt-3 max-w-md">A slow sky to keep you company while the pots dry.</p>
            </div>
            <a href="/argile-sky-complete.html" className="btn border border-paper/70 text-paper hover:bg-paper hover:text-ink self-start md:self-auto">
              Open the sky
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function DoorwayCard({ d }: { d: Doorway }) {
  const body = (
    <>
      <div className="relative overflow-hidden bg-oat aspect-[3/2] sm:aspect-[4/5]">
        <Image
          src={d.photo.src}
          alt={d.photo.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 92vw"
          className={`object-cover photo-zoom ${d.soon ? "saturate-[0.55] opacity-90" : ""}`}
          style={{ objectPosition: d.photo.position }}
        />
        {d.soon && (
          <span className="absolute left-3 top-3 bg-paper/95 text-ink-2 text-label uppercase px-2.5 py-1.5">Coming soon</span>
        )}
      </div>
      <div className="pt-5">
        <p className="flex items-baseline gap-3">
          <span className="text-caption text-ink-3 tabular-nums">{d.n}</span>
          <span className={`font-serif text-[1.9rem] leading-none transition-colors duration-400 ${d.href ? "group-hover:text-terracotta-deep" : ""}`}>
            {d.title}
          </span>
        </p>
        <p className="text-body-md text-ink-2 mt-3 text-pretty">{d.line}</p>
        {d.href ? (
          <span className="link-quiet mt-2 group-hover:text-terracotta-deep">
            {d.cta} <span aria-hidden="true">→</span>
          </span>
        ) : (
          <span className="inline-flex items-center min-h-11 mt-2 text-label uppercase text-ink-3">In the kiln</span>
        )}
      </div>
    </>
  );
  if (!d.href) return <div role="group" aria-label={`${d.title}, coming soon`}>{body}</div>;
  return (
    <Link href={d.href} className="group block">
      {body}
    </Link>
  );
}
