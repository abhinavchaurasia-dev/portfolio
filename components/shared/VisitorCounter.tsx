"use client";

import { useEffect, useState } from "react";

/* ============================================================
   VISITOR COUNTER
   POSTs to /api/visitors on mount to increment and get count.
   Displays "You are visitor #N" in monospace muted text.
   Placed in footer — renders nothing until count resolves.
   ============================================================ */

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function increment() {
      try {
        const res = await fetch("/api/visitors", { method: "POST" });
        if (!res.ok) return;
        const data = (await res.json()) as { count: number };
        if (!cancelled) setCount(data.count);
      } catch {
        // Fail silently — counter is non-critical
      }
    }

    increment();
    return () => { cancelled = true; };
  }, []);

  if (count === null) return null;

  return (
    <span className="vc" aria-label={`Site visitor count: ${count}`}>
      You are visitor #{count.toLocaleString()}

      <style>{`
        .vc {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          display: block;
          text-align: center;
        }
      `}</style>
    </span>
  );
}