"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A single row of chips that scrolls sideways when it doesn't fit. Edges fade
 * where there is more to see, and a small arrow button appears on that side,
 * so nothing ever looks cut off. Bleeds to the screen edge on phones.
 */
export function ChipScroller({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    // keep the active chip in view on load
    const active = el.querySelector<HTMLElement>("[aria-pressed='true'],[aria-current='page']");
    if (active && active.offsetLeft + active.offsetWidth > el.clientWidth) {
      el.scrollLeft = active.offsetLeft - 20;
    }
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: reduce ? "auto" : "smooth" });
  };

  const mask = `linear-gradient(to right, ${edges.left ? "transparent 0, #000 2.5rem" : "#000 0"}, ${
    edges.right ? "#000 calc(100% - 3.5rem), transparent 100%" : "#000 100%"
  })`;

  return (
    <div className={`relative -mx-5 md:mx-0 ${className}`}>
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-5 md:px-0 py-1"
        style={{ WebkitMaskImage: mask, maskImage: mask }}
      >
        {children}
        <span className="shrink-0 w-3" aria-hidden="true" />
      </div>
      {edges.left && (
        <ArrowButton side="left" onClick={() => nudge(-1)} />
      )}
      {edges.right && (
        <ArrowButton side="right" onClick={() => nudge(1)} />
      )}
    </div>
  );
}

function ArrowButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Scroll back" : "More filters"}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-1 md:-left-3" : "right-1 md:-right-3"} w-11 h-11 flex items-center justify-center rounded-full bg-paper-soft/95 border border-line text-ink-2 shadow-subtle transition-colors duration-400 hover:text-ink`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {side === "left" ? <path d="M8.5 3L4.5 7l4 4" /> : <path d="M5.5 3l4 4-4 4" />}
      </svg>
    </button>
  );
}
