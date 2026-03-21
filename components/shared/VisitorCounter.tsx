"use client";

import { useEffect, useState } from "react";

/* ============================================================
   VISITOR COUNTER
   Unique visitor tracking — uses localStorage to check if this
   browser has been counted before. On first visit, POSTs to
   /api/visitors to increment. On return visits, GETs the
   current count without incrementing.
   The count number is highlighted in accent color.
   ============================================================ */

const STORAGE_KEY = "visitor-counted";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function trackVisit() {
      try {
        const alreadyCounted = localStorage.getItem(STORAGE_KEY) === "1";

        let res: Response;
        if (alreadyCounted) {
          /* Return visitor — just GET the current count */
          res = await fetch("/api/visitors", { method: "GET" });
        } else {
          /* First visit — increment and mark as counted */
          res = await fetch("/api/visitors", { method: "POST" });
          if (res.ok) localStorage.setItem(STORAGE_KEY, "1");
        }

        if (!res.ok) return;
        const data = (await res.json()) as { count: number };
        if (!cancelled) setCount(data.count);
      } catch {
        // Fail silently — counter is non-critical
      }
    }

    trackVisit();
    return () => { cancelled = true; };
  }, []);

  if (count === null) return null;

  return (
    <span className="vc" aria-label={`Unique visitor count: ${count}`}>
      You&apos;re the{" "}
      <strong className="vc-num">
        {count.toLocaleString()}
        <sup className="vc-sup">th</sup>
      </strong>
      {" "}visitor

      <style>{`
        .vc {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          display: block;
          text-align: right;
        }

        /* Highlighted count number */
        .vc-num {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          font-style: normal;
        }

        .vc-sup {
          font-size: 8px;
          font-weight: 500;
          vertical-align: super;
          color: var(--color-text-secondary, #888888);
        }
      `}</style>
    </span>
  );
}

