"use client";

import { useState, useEffect, useRef } from "react";

export function CloudBackground() {
  const [videoReady, setVideoReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Show video after a short delay to ensure it's buffered
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setTimeout(() => setVideoReady(true), 2000);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Poster image - always present, fades out when video ready */}
      <picture>
        <source
          srcSet="/clouds/poster_01_lg.jpg"
          media="(min-width: 1024px)"
        />
        <img
          src="/clouds/poster_01.jpg"
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady ? "opacity-0" : "opacity-100"
          }`}
        />
      </picture>

      {/* Video iframe - hidden until ready */}
      {!prefersReducedMotion && (
        <iframe
          ref={iframeRef}
          src="https://iframe.mediadelivery.net/embed/585214/73be0261-7de4-421c-bf8f-20a721273f38?autoplay=true&loop=true&muted=true&preload=true&responsive=true"
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 border-0 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          style={{
            pointerEvents: "none",
            // Scale up to ensure cover behavior with iframe
            width: "177.77777778vh", // 16:9 ratio
            height: "56.25vw", // 16:9 ratio
            minWidth: "100%",
            minHeight: "100%",
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
