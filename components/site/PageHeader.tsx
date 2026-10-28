import Link from "next/link";
import { Photo, type PhotoLike } from "./Photo";

/**
 * Editorial page header: a small eyebrow, a light serif title, one line of
 * context, and (when there is one) a photograph beside it on laptops and
 * beneath it on phones. Never a gradient band with a word on it.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  photo,
  photoOnPhone = true,
  back,
  children,
}: {
  eyebrow?: string;
  title: string;
  lede?: React.ReactNode;
  photo?: PhotoLike;
  photoOnPhone?: boolean;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <header className="wrap pt-6 md:pt-14">
      <div className={photo ? "md:grid md:grid-cols-12 md:gap-10 md:items-end" : ""}>
        <div className={photo ? "md:col-span-6 lg:col-span-6 md:pb-2" : ""}>
          {back && (
            <Link href={back.href} className="link-quiet -mt-2 mb-2 text-ink-3">
              <span aria-hidden="true">←</span> {back.label}
            </Link>
          )}
          {eyebrow && <p className="eyebrow reveal">{eyebrow}</p>}
          <h1 className="display text-[2.6rem] leading-[1.02] md:text-display-lg mt-2 reveal reveal-1 text-balance">{title}</h1>
          {lede && <p className="lede mt-3 md:mt-4 max-w-prose reveal reveal-2 text-pretty">{lede}</p>}
        </div>
        {photo && (
          <div className={`md:col-span-6 lg:col-span-5 lg:col-start-8 mt-6 md:mt-0 reveal reveal-2 ${photoOnPhone ? "" : "hidden md:block"}`}>
            <Photo photo={photo} ratio="16 / 10" sizes="(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw" priority />
          </div>
        )}
      </div>
      {children && <div className="mt-6 md:mt-10">{children}</div>}
    </header>
  );
}

/**
 * Underlined text tabs for moving between sibling pages (e.g. Opportunities /
 * Inspiration, Describe / My shelf). Scrolls sideways on narrow screens.
 */
export function SubNav({
  items,
  active,
  label,
}: {
  items: { href: string; label: string; count?: number }[];
  active: string;
  label: string;
}) {
  return (
    <nav aria-label={label} className="border-b border-line">
      <ul className="flex gap-7 overflow-x-auto scrollbar-hide -mb-px">
        {items.map((it) => {
          const on = it.href === active || it.href.startsWith(active + "/");   // "/opportunities" is active on "/opportunities/map" too
          return (
            <li key={it.href} className="shrink-0">
              <Link
                href={it.href}
                aria-current={on ? "page" : undefined}
                className={`inline-flex items-baseline gap-1.5 min-h-12 pt-3 pb-3 border-b transition-colors duration-400 text-body-sm ${
                  on ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink"
                }`}
              >
                {it.label}
                {typeof it.count === "number" && <span className="text-caption text-ink-3 tabular-nums">{it.count}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Two-way switch rendered as links (e.g. List | Map). */
export function Switch({
  items,
  active,
  label,
}: {
  items: { href: string; label: string; icon?: React.ReactNode }[];
  active: string;
  label: string;
}) {
  return (
    <nav aria-label={label} className="inline-flex p-1 rounded-full bg-oat/80 border border-line">
      {items.map((it) => {
        const on = it.href === active || it.href.startsWith(active + "/");   // "/opportunities" is active on "/opportunities/map" too
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={on ? "page" : undefined}
            className={`inline-flex items-center gap-2 min-h-11 px-4 md:px-5 rounded-full text-body-sm transition-colors duration-400 ${
              on ? "bg-paper-soft text-ink shadow-subtle" : "text-ink-3 hover:text-ink"
            }`}
          >
            {it.icon}
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
