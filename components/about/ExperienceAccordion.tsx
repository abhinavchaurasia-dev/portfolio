"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

/* ============================================================
   EXPERIENCE ACCORDION
   Uses Framer Motion AnimatePresence for smooth height 0→auto.
   The [+] icon rotates 45° when the entry is expanded.
   ============================================================ */

interface Bullet {
  text: string;
}

interface ExperienceEntry {
  id: string;
  initials: string;
  role: string;
  company: string;
  date: string;
  bullets: Bullet[];
  tags: string[];
}

const ENTRIES: ExperienceEntry[] = [
  {
    id: "northern-railway",
    initials: "NR",
    role: "Software Development Intern",
    company: "Northern Railway",
    date: "Jun 2025 – Aug 2025 · Lucknow, India",
    bullets: [
      { text: "Built full-stack trainee management portal (production deployment)" },
      { text: "Designed layered REST API: routes/controllers/services" },
      { text: "Engineered PostgreSQL schema for trainee and attendance data" },
      { text: "Built automated PDF certificate generation with QR verification" },
      { text: "Implemented 5-state trainee status state machine" },
    ],
    tags: ["Node.js", "Express", "PostgreSQL", "React", "Material UI"],
  },
];

export default function ExperienceAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="ea">
      {/* Top divider */}
      <div className="ea-top-divider" role="separator" />

      {ENTRIES.map((entry) => {
        const isOpen = openId === entry.id;

        return (
          <div key={entry.id} className="ea-item">
            {/* ── Header row (always visible) ── */}
            <button
              className="ea-header"
              onClick={() => toggle(entry.id)}
              aria-expanded={isOpen}
              aria-controls={`ea-body-${entry.id}`}
            >
              {/* Left: logo + text */}
              <div className="ea-left">
                <div className="ea-logo" aria-hidden="true">
                  {entry.initials}
                </div>
                <div className="ea-text">
                  <span className="ea-role">{entry.role}</span>
                  <span className="ea-company">{entry.company}</span>
                </div>
              </div>

              {/* Right: date + icon */}
              <div className="ea-right">
                <time className="ea-date">{entry.date}</time>
                <motion.span
                  className="ea-icon"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  aria-hidden="true"
                >
                  <Plus size={16} strokeWidth={1.5} />
                </motion.span>
              </div>
            </button>

            {/* ── Expanded content ── */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`ea-body-${entry.id}`}
                  className="ea-body"
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="ea-body-inner">
                    {/* Date — shown here on mobile since header hides it */}
                    <time className="ea-body-date">{entry.date}</time>

                    {/* Bullet points */}
                    <ul className="ea-bullets" role="list">
                      {entry.bullets.map((b, i) => (
                        <li key={i} className="ea-bullet">
                          <span className="ea-dash" aria-hidden="true">—</span>
                          <span className="ea-bullet-text">{b.text}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech tags */}
                    <ul className="ea-tags" role="list" aria-label="Technologies used">
                      {entry.tags.map((tag) => (
                        <li key={tag} className="ea-tag">{tag}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <style>{`
        /* Top divider above first item */
        .ea-top-divider {
          height: 1px;
          background-color: var(--color-border-subtle, #1F1F1F);
        }

        /* ── Header ── */
        .ea-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          /* 44px minimum tap target height */
          min-height: 44px;
          /* Allow header to grow taller on mobile when content wraps */
          height: auto;
          padding: 10px 4px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
          cursor: pointer;
          gap: 12px;
          text-align: left;
          transition: background-color 150ms ease;
          border-radius: 0;
        }

        .ea-header:hover {
          background-color: var(--color-bg-elevated, #0F0F0F);
        }

        /* Left block */
        .ea-left {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 0;
          flex: 1;
        }

        .ea-logo {
          width: 32px;
          height: 32px;
          background-color: var(--color-bg-inset, #1A1A1A);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
          user-select: none;
        }

        .ea-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .ea-role {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          /* Allow wrapping on narrow viewports instead of truncating */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ea-company {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Right block */
        .ea-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .ea-date {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          white-space: nowrap;
        }

        .ea-icon {
          display: flex;
          align-items: center;
          /* 44×44 touch target for the icon */
          min-width: 44px;
          min-height: 44px;
          justify-content: center;
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
        }

        /* Mobile: hide the date text (too long for 375px), keep icon */
        @media (max-width: 480px) {
          .ea-date {
            display: none;
          }
          /* Show date inside body instead */
          .ea-body-date {
            display: block;
          }
          /* Compact company label so role doesn't get truncated too aggressively */
          .ea-role {
            font-size: 13px;
          }
          .ea-company {
            font-size: 12px;
          }
        }

        /* ── Expanded body ── */
        .ea-body-inner {
          padding: 16px 4px 20px 52px;
          /* 52px left = 32px logo + 16px gap + 4px header padding */
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
        }

        /* Date shown inside body on mobile */
        .ea-body-date {
          display: none;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          margin-bottom: 12px;
        }

        @media (max-width: 480px) {
          .ea-body-inner {
            /* Reduce left indent on 375px to avoid squishing content */
            padding-left: 16px;
          }
          .ea-body-date {
            display: block;
          }
        }

        /* Bullets */
        .ea-bullets {
          display: flex;
          flex-direction: column;
          gap: 8px;
          list-style: none;
          margin: 0 0 16px;
          padding: 0;
        }

        .ea-bullet {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .ea-dash {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          color: var(--color-text-muted, #444444);
          font-size: 13px;
          flex-shrink: 0;
          line-height: 1.6;
        }

        .ea-bullet-text {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.6;
        }

        /* Tags */
        .ea-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .ea-tag {
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

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ea-header { transition: none; }
        }
      `}</style>
    </div>
  );
}

