/* ============================================================
   TECH STACK TABLE
   Server component. Category label (100px) + flex-wrap tags.
   Each row separated by border-bottom border-subtle.
   ============================================================ */

interface StackRow {
  category: string;
  items: string[];
}

const STACK: StackRow[] = [
  {
    category: "Frontend",
    items: ["React.js", "HTML", "CSS", "Material UI"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "Django", "DRF"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "SQLite"],
  },
  {
    category: "AI / ML",
    items: ["OpenAI API", "Gemini", "CLIP", "VADER", "DeepSeek"],
  },
  {
    category: "Auth",
    items: ["JWT", "Google OAuth", "OTP flows"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "Postman"],
  },
];

export default function TechStackTable() {
  return (
    <div className="tst">
      {STACK.map((row, i) => (
        <div
          key={row.category}
          className={`tst-row${i === STACK.length - 1 ? " tst-row--last" : ""}`}
        >
          <span className="tst-label" aria-label={`${row.category} technologies`}>
            {row.category}
          </span>
          <ul className="tst-items" role="list" aria-label={`${row.category} stack`}>
            {row.items.map((item) => (
              <li key={item} className="tst-tag">{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* ── Certification block ── */}
      <div className="tst-cert" aria-label="Microsoft Azure AI Fundamentals certification">
        {/* Azure logo placeholder */}
        <div className="tst-cert-logo" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 2L2 14h5l2-4 2 4h5L9 2z"
              stroke="var(--color-text-muted, #444444)"
              strokeWidth="1.2"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div className="tst-cert-text">
          <span className="tst-cert-label">Microsoft Certified</span>
          <span className="tst-cert-name">Azure AI Fundamentals</span>
        </div>
      </div>

      <style>{`
        .tst {
          /* no outer padding — sits flush inside section */
        }

        /* ── Stack rows ── */
        .tst-row {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
          gap: 16px;
          flex-wrap: wrap;
        }

        .tst-row--last {
          /* last tech row still gets border — cert block below has margin-top */
        }

        .tst-label {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted, #444444);
          width: 100px;
          flex-shrink: 0;
          user-select: none;
        }

        .tst-items {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .tst-tag {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          background-color: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 4px;
          padding: 4px 8px;
          white-space: nowrap;
          line-height: 1;
        }

        /* ── Certification block ── */
        .tst-cert {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 6px;
          padding: 14px 16px;
        }

        .tst-cert-logo {
          width: 32px;
          height: 32px;
          background-color: var(--color-bg-inset, #1A1A1A);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tst-cert-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .tst-cert-label {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted, #444444);
        }

        .tst-cert-name {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
        }
      `}</style>
    </div>
  );
}