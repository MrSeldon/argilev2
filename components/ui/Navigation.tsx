"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/glazes", label: "Glazes" },
  { href: "/inspirations", label: "Inspiration" },
  { href: "/mentor", label: "Mentor" },
  { href: "/argile-sky-complete.html", label: "Clouds" },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="flex items-center justify-between px-8 py-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl text-white hover:opacity-70 transition-opacity"
        >
          Le Four Argile
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs uppercase tracking-widest text-white transition-opacity hover:opacity-70 ${
                isActive(item.href) ? "opacity-100" : "opacity-80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
