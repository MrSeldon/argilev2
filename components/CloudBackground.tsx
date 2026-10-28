"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Looping cloud video (Bunny stream) over a still poster. The poster shows
 * first and stays for people who prefer reduced motion.
 *
 * `contained` fills its positioned parent instead of the whole viewport and
 * only starts the video once the band scrolls near view.
 */
export function CloudBackground({ contained = false }: { contained?: boolean }) {
  const [videoReady, setVideoReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [near, setNear] = useState(!contained);
  const rootRef = useRef<HTMLDivElement>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // In a band: wait until it is close to the viewport before loading video
  useEffect(() => {
    if (!contained || near) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [contained, near]);

  // Show video after a short delay to ensure it's buffered
  useEffect(() => {
    if (prefersReducedMotion || !near) return;
    const timer = setTimeout(() => setVideoReady(true), 2000);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion, near]);

  const frame = contained
    ? {
        // cover the band, whatever its shape (container query units)
        width: "max(100%, calc(100cqh * 16 / 9))",
        height: "max(100%, calc(100cqw * 9 / 16))",
      }
    : {
        width: "177.77777778vh",
        height: "56.25vw",
        minWidth: "100%",
        minHeight: "100%",
      };

  return (
    <div
      ref={rootRef}
      className={contained ? "absolute inset-0 overflow-hidden" : "fixed inset-0 -z-10 overflow-hidden"}
      style={contained ? { containerType: "size" } : undefined}
      aria-hidden="true"
    >
      {/* Poster image - always present, fades out when video ready */}
      <picture>
        <source srcSet="/clouds/poster_01_lg.jpg" media="(min-width: 1024px)" />
        <img
          src="/clouds/poster_01.jpg"
          alt=""
          loading={contained ? "lazy" : "eager"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
        />
      </picture>

      {/* Video iframe - hidden until ready */}
      {!prefersReducedMotion && near && (
        <iframe
          src="https://iframe.mediadelivery.net/embed/585214/73be0261-7de4-421c-bf8f-20a721273f38?autoplay=true&loop=true&muted=true&preload=true&responsive=true"
          loading="lazy"
          title="Clouds"
          tabIndex={-1}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 border-0 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          style={{
            pointerEvents: "none",
            ...frame,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
}
