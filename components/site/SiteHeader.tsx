"use client";

import Link from "next/link";
import { AccountControl } from "@/components/auth/AccountControl";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { href: string; label: string; match: string[]; icon: (p: { active: boolean }) => JSX.Element };

const ITEMS: Item[] = [
  { href: "/", label: "Home", match: ["/"], icon: IconHome },
  { href: "/glazes", label: "Glazes", match: ["/glazes"], icon: IconGlaze },
  { href: "/opportunities", label: "Explore", match: ["/opportunities", "/inspirations"], icon: IconExplore },
  { href: "/mentor", label: "Ask", match: ["/mentor"], icon: IconAsk },
];

function isActive(pathname: string, item: Item) {
  return item.match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));
}

/**
 * Laptop: a quiet top bar (wordmark left, three words right). Over the home
 * photograph it is transparent with light type and settles onto paper once
 * the page scrolls. Phones: the wordmark scrolls away with the page and a
 * fixed tab bar sits at the bottom, within thumb reach.
 */
export function SiteHeader() {
  const pathname = usePathname() || "/";
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const light = overHero && !scrolled;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1400] focus:bg-paper focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header
        className={[
          "z-[1200] w-full transition-colors duration-700 ease-soft",
          overHero ? "absolute md:fixed top-0 left-0 right-0" : "relative md:sticky md:top-0",
          light
            ? "bg-transparent"
            : "bg-paper/90 backdrop-blur-md md:border-b md:border-line/70",
        ].join(" ")}
      >
        <nav className="wrap flex items-center justify-between h-14 md:h-[4.5rem]" aria-label="Main">
          <Link
            href="/"
            className={`font-serif text-[1.3rem] md:text-[1.4rem] leading-none tracking-tight transition-colors duration-700 py-3 ${
              light ? "text-paper" : "text-ink"
            }`}
          >
            Le Four Argile
          </Link>

          <ul className="hidden md:flex items-center gap-10">
            {ITEMS.slice(1).map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative inline-flex items-center min-h-11 text-label uppercase transition-colors duration-400 ${
                      light ? "text-paper/85 hover:text-paper" : active ? "text-ink" : "text-ink-3 hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 right-[0.16em] -bottom-0 h-px transition-opacity duration-400 ${
                        light ? "bg-paper" : "bg-terracotta"
                      } ${active ? "opacity-100" : "opacity-0"}`}
                    />
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href="/argile-sky-complete.html"
                className={`inline-flex items-center min-h-11 text-label uppercase transition-colors duration-400 ${
                  light ? "text-paper/70 hover:text-paper" : "text-ink-3/80 hover:text-ink"
                }`}
              >
                Clouds
              </a>
            </li>
            <li>
              <AccountControl tone={light ? "light" : "dark"} compact />
            </li>
          </ul>
          <AccountControl tone={light ? "light" : "dark"} compact className="md:hidden" />
        </nav>
      </header>

      <TabBar pathname={pathname} />
    </>
  );
}

function TabBar({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Main"
      className="md:hidden fixed bottom-0 inset-x-0 z-[1300] bg-paper/95 backdrop-blur-md border-t border-line"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4 h-[3.75rem]">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`h-full flex flex-col items-center justify-center gap-1 transition-colors duration-400 ${
                  active ? "text-ink" : "text-ink-3"
                }`}
              >
                <Icon active={active} />
                <span className="text-[10px] uppercase tracking-[0.14em]">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* Icons: thin, hand-drawn-feeling line marks ------------------------------- */

const stroke = (active: boolean) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth: active ? 1.5 : 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

function IconHome({ active }: { active: boolean }) {
  // a small vessel
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke(active)}>
      <path d="M9 3.5h6M9.5 3.5c0 2-3.5 3.6-3.5 8.2 0 4.5 2.7 8.3 6 8.3s6-3.8 6-8.3c0-4.6-3.5-6.2-3.5-8.2" />
      {active && <path d="M7 13.5c3 1 7 1 10 0" />}
    </svg>
  );
}

function IconGlaze({ active }: { active: boolean }) {
  // a drip
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke(active)}>
      <path d="M12 3.5c3.2 4.3 5.5 7.6 5.5 10.4a5.5 5.5 0 01-11 0c0-2.8 2.3-6.1 5.5-10.4z" />
      {active && <path d="M9.4 14.6a2.7 2.7 0 002.4 2.6" />}
    </svg>
  );
}

function IconExplore({ active }: { active: boolean }) {
  // a compass
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke(active)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.8 9.2l-1.7 3.9-3.9 1.7 1.7-3.9z" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}

function IconAsk({ active }: { active: boolean }) {
  // a speech mark
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" {...stroke(active)}>
      <path d="M4.5 11.5c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5-3.4 6.5-7.5 6.5c-1 0-2-.1-2.9-.4L5.5 19.5l.9-3.3c-1.2-1.2-1.9-2.8-1.9-4.7z" />
      {active && <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" strokeWidth="2" />}
    </svg>
  );
}
