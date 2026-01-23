"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CloudBackground } from "@/components/CloudBackground";

const sections = [
  {
    title: "Opportunities",
    description:
      "Residencies, schools, grants, and workshops around the world.",
    href: "/opportunities",
  },
  {
    title: "Glazes",
    description:
      "Thousands of recipes from Digital Fire, Glazy, and community sources.",
    href: "/glazes",
  },
  {
    title: "Inspirations",
    description:
      "Traditions, artists, techniques, and ideas to fuel your practice.",
    href: "/inspirations",
  },
  {
    title: "Mentor",
    description:
      "Personalized guidance from an AI who understands ceramics.",
    href: "/mentor",
  },
];

export default function Home() {
  const [tagline, setTagline] = useState<"default" | "winnie">("default");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // Show "For Winnie" briefly when scrolled 40-50% of viewport height
      if (scrollY > viewportHeight * 0.4 && scrollY < viewportHeight * 0.5) {
        setTagline("winnie");
      } else {
        setTagline("default");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Cloud Video Background */}
      <CloudBackground />

      {/* Hero Section - Full viewport */}
      <section className="relative h-screen w-full">
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 tracking-tight drop-shadow-lg">
            Le Four Argile
          </h1>
          <div className="h-6 relative overflow-hidden">
            <p
              className={`text-sm md:text-base uppercase tracking-widest drop-shadow-md transition-all duration-500 ${
                tagline === "default"
                  ? "text-white/80 opacity-100 translate-y-0"
                  : "text-white/0 opacity-0 -translate-y-4"
              }`}
            >
              A ceramics exploration portal
            </p>
            <p
              className={`text-sm md:text-base uppercase tracking-widest drop-shadow-md transition-all duration-500 absolute inset-0 flex items-center justify-center ${
                tagline === "winnie"
                  ? "text-white/80 opacity-100 translate-y-0"
                  : "text-white/0 opacity-0 translate-y-4"
              }`}
            >
              For Winnie
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-white/60" />
        </div>
      </section>

      {/* Sections */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group block"
              >
                <h2 className="font-serif text-3xl md:text-4xl mb-4 group-hover:opacity-60 transition-opacity">
                  {section.title}
                </h2>
                <p className="text-warm-500 leading-relaxed mb-4">
                  {section.description}
                </p>
                <span className="text-xs uppercase tracking-widest text-charcoal/40 group-hover:text-charcoal transition-colors">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pull Quote */}
      <section className="py-24 md:py-32 bg-warm-50">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <p className="font-serif text-2xl md:text-3xl italic text-warm-700 leading-relaxed">
            Built for curiosity — a personal ceramics resource
            designed for learning, exploration, and creative growth.
          </p>
        </div>
      </section>
    </div>
  );
}
