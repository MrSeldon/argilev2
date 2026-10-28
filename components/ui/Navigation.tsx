"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/glazes", label: "Glazes" },
  { href: "/inspirations", label: "Inspiration" },
  { href: "/mentor", label: "Mentor" },
  { href: "/argile-sky-complete.html", label: "Clouds" },
];

// Routes that have no dark hero behind the nav (cream page background), so the
// white nav text needs its own dark backing.
const SOLID_NAV_ROUTES = [
  "/opportunities/map",
  "/inspirations/connections",
  "/glazes/my-materials",
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Close the phone menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = SOLID_NAV_ROUTES.some((r) => pathname.startsWith(r));
  // On phones the bar gets a dark backing once the page scrolls (or the menu is
  // open) so the white text never sits on cream content.
  const barBg =
    solid || open
      ? "bg-charcoal-dark/95 backdrop-blur"
      : scrolled
      ? "bg-charcoal-dark/85 backdrop-blur max-md:shadow-subtle"
      : "bg-transparent";

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1200] transition-colors duration-300 ${barBg}`}>
      <nav className="flex items-center justify-between h-14 md:h-auto px-5 md:px-8 md:py-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl text-white hover:opacity-70 transition-opacity whitespace-nowrap py-2 md:py-0"
        >
          Le Four Argile
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-70 py-2 -my-2 ${
                isActive(item.href) ? "opacity-100" : "opacity-80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Phone menu button */}
        <button
          type="button"
          className="md:hidden -mr-3 w-12 h-12 flex items-center justify-center text-white"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block w-6 h-4" aria-hidden="true">
            <span
              className={`absolute left-0 right-0 h-px bg-current transition-all duration-300 ${
                open ? "top-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-1/2 h-px bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-px bg-current transition-all duration-300 ${
                open ? "top-1/2 -rotate-45" : "top-full"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Phone menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="md:hidden bg-charcoal-dark/95 backdrop-blur border-t border-white/10 px-5 pb-6 pt-2"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center min-h-[52px] text-sm uppercase tracking-widest text-white border-b border-white/10 last:border-b-0 ${
                isActive(item.href) ? "opacity-100" : "opacity-70"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
