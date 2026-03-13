// FILE: components/shared/CurrentlyInto.tsx

"use client";

import { useEffect, useState } from "react";

/* ============================================================
   CURRENTLY INTO WIDGET
   Fetches /api/currently-into on mount.
   Displays up to 6 items grouped by category.
   Hidden if no items returned.
   ============================================================ */

type Category = "reading" | "watching" | "building" | "listening";

interface Item {
  id:       string;
  category: Category;
  label:    string;
  sub?:     string;
}

const CATEGORY_LABEL: Record<Category, string> = {
  reading:   "reading",
  watching:  "watching",
  building:  "building",
  listening: "listening",
};

export default function CurrentlyInto() {
  const [items, setItems]   = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/currently-into")
      .then((r) => r.json())
      .then((data: { items: Item[] }) => {
        if (!cancelled) {
          setItems(data.items ?? []);
          setLoaded(true);
        }
      })
      .catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  if (!loaded || items.length === 0) return null;

  return (
    <div className="ci" aria-label="Currently into">
      <span className="ci-heading">currently into</span>
      <div className="ci-list">
        {items.map((item) => (
          <div key={item.id} className="ci-item">
            <span className="ci-cat">{CATEGORY_LABEL[item.category]}</span>
            <div className="ci-info">
              <span className="ci-label">{item.label}</span>
              {item.sub && (
                <span className="ci-sub">{item.sub}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .ci {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .ci-heading {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
        }

        .ci-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ci-item {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .ci-cat {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          color: var(--color-text-muted, #444444);
          width: 64px;
          flex-shrink: 0;
          text-align: right;
        }

        .ci-info {
          display: flex;
          align-items: baseline;
          gap: 6px;
          min-width: 0;
          flex-wrap: wrap;
        }

        .ci-label {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.4;
        }

        .ci-sub {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}