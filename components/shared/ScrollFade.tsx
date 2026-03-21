"use client";

import { useEffect, useState } from "react";

/* ============================================================
   SCROLL FADE — Glassmorphism style
   Two-layer approach:
   1. backdrop-filter: blur(12px) — frosted glass effect
   2. gradient overlay — fades from transparent to bg color
   Together they create the glass dissolve Ram's portfolio uses.
   Scroll-aware: fades out when .fq-card enters viewport.
   ============================================================ */

function isDark(): boolean {
  if (typeof document === "undefined") return true;
  return document.documentElement.getAttribute("data-theme") !== "light";
}

export default function ScrollFade() {
  const [opacity, setOpacity] = useState(1);
  const [dark, setDark]       = useState(() => isDark());

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDark()));
    observer.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ["data-theme"],
    });

    function handleScroll() {
      const target =
        document.querySelector<HTMLElement>(".fq-card") ??
        document.querySelector<HTMLElement>("footer");

      if (!target) { setOpacity(1); return; }

      const rect      = target.getBoundingClientRect();
      const vh        = window.innerHeight;
      /* Start fading when quote card is 200px from viewport bottom */
      const fadeStart = vh - 200;
      /* Fully gone when quote card top is 400px from viewport bottom */
      const fadeEnd   = vh - 400;

      if (rect.top >= fadeStart) {
        setOpacity(1);
      } else if (rect.top <= fadeEnd) {
        setOpacity(0);
      } else {
        const t = (fadeStart - rect.top) / (fadeStart - fadeEnd);
        setOpacity(Math.max(0, 1 - t));
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  if (opacity === 0) return null;

  const bg   = dark ? "#080808" : "#FAFAFA";
  const rgba = dark
    ? "rgba(8,8,8,"
    : "rgba(250,250,250,";

  return (
    <>
      {/* Layer 1 — backdrop blur (the glass) */}
      <div
        aria-hidden="true"
        style={{
          position:       "fixed",
          bottom:         0,
          left:           0,
          right:          0,
          height:         "72px",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%)",
          pointerEvents:  "none",
          zIndex:         20,
          opacity,
          transition:     "opacity 350ms ease",
        }}
      />

      {/* Layer 2 — color gradient (blends blur into bg) */}
      <div
        aria-hidden="true"
        style={{
          position:      "fixed",
          bottom:        0,
          left:          0,
          right:         0,
          height:        "72px",
          background:    `linear-gradient(to bottom,
            transparent          0%,
            ${rgba}0.08)        30%,
            ${rgba}0.30)        58%,
            ${rgba}0.65)        78%,
            ${bg}               100%
          )`,
          pointerEvents: "none",
          zIndex:        21,
          opacity,
          transition:    "opacity 350ms ease",
        }}
      />
    </>
  );
}

