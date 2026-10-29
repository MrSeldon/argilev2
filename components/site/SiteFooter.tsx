"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Full-height tools (map, graph, chat) have no room for a footer.
const NO_FOOTER = ["/opportunities/map", "/inspirations/connections", "/mentor"];

export function SiteFooter() {
  const pathname = usePathname() || "/";
  if (NO_FOOTER.some((p) => pathname.startsWith(p))) return null;
  return (
    <footer className="mt-24 md:mt-32 border-t border-line">
      <div className="wrap py-10 md:py-14 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-[1.35rem] leading-none">Le Four Argile</p>
          <p className="mt-3 text-body-sm text-ink-3 max-w-xs">
            A studio companion for Laini Studio. Kigali, and soon San Francisco.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-6 text-body-sm">
          <FooterCol title="Glazes" links={[["Describe a glaze", "/glazes"], ["My shelf", "/glazes/my-materials"]]} />
          <FooterCol
            title="Explore"
            links={[
              ["Opportunities", "/opportunities"],
              ["Map", "/opportunities/map"],
              ["Inspiration", "/inspirations"],
            ]}
          />
          <FooterCol title="Elsewhere" links={[["Ask the mentor", "/mentor"], ["Clouds", "/argile-sky-complete.html"]]} />
        </nav>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="eyebrow mb-2">{title}</p>
      <ul>
        {links.map(([label, href]) => (
          <li key={href}>
            {href.endsWith(".html") ? (
              <a href={href} className="inline-flex items-center min-h-11 text-ink-2 hover:text-ink transition-colors duration-400">
                {label}
              </a>
            ) : (
              <Link href={href} className="inline-flex items-center min-h-11 text-ink-2 hover:text-ink transition-colors duration-400">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
