"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";

/* ============================================================
   SECTION REVEAL
   Lightweight IntersectionObserver wrapper.
   No Framer Motion dep — keeps server component tree clean.
   ============================================================ */

interface SectionRevealProps {
  children: ReactNode;
  delay?: number; /* seconds */
  className?: string;
}

export default function SectionReveal({
  children,
  delay = 0,
  className,
}: SectionRevealProps) {
  const ref     = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Respect prefers-reduced-motion at the JS level too */
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = {
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(20px)",
    transition: visible
      ? `opacity 400ms cubic-bezier(0,0,0.2,1) ${delay}s,
         transform 400ms cubic-bezier(0,0,0.2,1) ${delay}s`
      : "none",
  };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}