/* ============================================================
   TIMELINE
   Server component. Left-border with dot indicators.
   Pseudo-elements can't be used in JSX/scoped styles on
   server components reliably across all browsers, so dots
   are rendered as positioned <span> elements.
   Entries in reverse chronological order.
   ============================================================ */

interface TimelineEntry {
  year: string;
  event: string;
  detail?: string;
}

const ENTRIES: TimelineEntry[] = [
  {
    year: "2026",
    event: "Expected B.Tech graduation",
    detail: "University of Lucknow — Computer Science",
  },
  {
    year: "2025",
    event: "Software Development Intern",
    detail: "Northern Railway Workshop Training Center",
  },
  {
    year: "2025",
    event: "Built PeerCampus · CivicBridge · SentiGenix",
    detail: "AI integrations across all 3 projects",
  },
  {
    year: "2024",
    event: "GeeksforGeeks Campus Ambassador",
    detail: "Organized developer community initiatives",
  },
  {
    year: "2022",
    event: "Enrolled in B.Tech CSE",
    detail: "University of Lucknow",
  },
];

export default function Timeline() {
  return (
    <ol className="tl" role="list" aria-label="Career and education timeline">
      {ENTRIES.map((entry, i) => (
        <li
          key={`${entry.year}-${i}`}
          className={`tl-item${i === ENTRIES.length - 1 ? " tl-item--last" : ""}`}
        >
          {/* Dot rendered as a span — avoids pseudo-element SSR quirks */}
          <span className="tl-dot" aria-hidden="true" />

          <time className="tl-year" dateTime={entry.year}>
            {entry.year}
          </time>
          <div className="tl-event">{entry.event}</div>
          {entry.detail && (
            <div className="tl-detail">{entry.detail}</div>
          )}
        </li>
      ))}

      <style>{`
        /* ── Timeline container ── */
        .tl {
          list-style: none;
          margin: 0;
          padding: 0;
          padding-left: 24px;
          border-left: 1px solid var(--color-border-subtle, #1F1F1F);
          position: relative;
        }

        /* ── Timeline item ── */
        .tl-item {
          position: relative;
          padding-left: 0;
          margin-bottom: 24px;
        }

        .tl-item--last {
          margin-bottom: 0;
        }

        /* ── Dot ── */
        .tl-dot {
          display: block;
          position: absolute;
          left: -31.5px; /* 24px padding-left + 1px border - 3px (half of 6px dot) - 4px fine-tune */
          top: 5px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-default, #2A2A2A);
          flex-shrink: 0;
        }

        /* ── Year ── */
        .tl-year {
          display: block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          margin-bottom: 2px;
          line-height: 1.4;
        }

        /* ── Event ── */
        .tl-event {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.4;
        }

        /* ── Detail ── */
        .tl-detail {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          margin-top: 2px;
          line-height: 1.4;
        }
      `}</style>
    </ol>
  );
}

