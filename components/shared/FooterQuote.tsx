// FILE: components/shared/FooterQuote.tsx

"use client";

import { useEffect, useState } from "react";

/* ============================================================
   FOOTER QUOTE WIDGET
   Fetches /api/quotes on mount, picks one at random.
   A new quote is picked every page load / navigation.
   Hidden while loading — no layout shift.
   ============================================================ */

interface Quote {
  id:      string;
  text:    string;
  author:  string;
  source?: string;
}

export default function FooterQuote() {
  const [quote, setQuote]   = useState<Quote | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quotes")
      .then((r) => r.json())
      .then((data: { quotes: Quote[] }) => {
        if (cancelled) return;
        const list = data.quotes ?? [];
        if (list.length > 0) {
          // Pick a random quote on every mount (= every page load / navigation)
          const pick = list[Math.floor(Math.random() * list.length)];
          setQuote(pick);
        }
        setLoaded(true);
      })
      .catch(() => { if (!cancelled) setLoaded(true); });
    return () => { cancelled = true; };
  }, []);

  // Render nothing until loaded — avoids height jump
  if (!loaded || !quote) return null;

  return (
    <div className="fq-card" aria-label="Closing quote">
      <div className="fq-marks" aria-hidden="true">&ldquo;</div>
      <blockquote className="fq-text">{quote.text}</blockquote>
      <cite className="fq-attr">
        — {quote.author}
        {quote.source && (
          <span className="fq-source">, {quote.source}</span>
        )}
      </cite>

      <style>{`
        .fq-card {
          position: relative;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          padding: 32px 40px 28px;
          margin-bottom: 40px;
          overflow: hidden;
          background: var(--color-bg-elevated, #0F0F0F);
        }

        /* Large decorative opening marks in the background */
        .fq-marks {
          position: absolute;
          top: -16px;
          left: 24px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 120px;
          font-weight: 700;
          line-height: 1;
          color: var(--color-border-default, #2A2A2A);
          pointer-events: none;
          user-select: none;
          letter-spacing: -8px;
        }

        .fq-text {
          position: relative;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 14px;
          font-style: italic;
          color: var(--color-text-secondary, #888888);
          line-height: 1.7;
          margin: 0 0 12px;
          padding-top: 20px;
        }

        .fq-attr {
          display: block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          font-style: normal;
          color: var(--color-text-muted, #444444);
          text-align: right;
        }

        .fq-source {
          color: var(--color-text-muted, #444444);
        }

        @media (max-width: 560px) {
          .fq-card  { padding: 24px 20px 20px; }
          .fq-marks { font-size: 80px; top: -10px; left: 16px; }
          .fq-text  { font-size: 13px; padding-top: 12px; }
        }
      `}</style>
    </div>
  );
}

