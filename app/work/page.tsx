import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

const bullets: string[] = [
  "Developed full-stack trainee management portal digitizing registration, attendance tracking, and certificate generation",
  "Engineered REST APIs using Node.js, Express.js, PostgreSQL for trainee and attendance data",
  "Designed layered backend architecture (routes, controllers, services) for modular API development",
  "Built React.js + Material UI interfaces for trainee dashboards and reporting tools",
  "Implemented attendance tracking and automated trainee status updates",
  "Built PDF certificate generation and trainee photo upload system",
];

const tags: string[] = [
  "Node.js",
  "Express",
  "PostgreSQL",
  "React",
  "Material UI",
];

export default function WorkPage() {
  return (
    <PageWrapper>
      <div className="wp-root">

        {/* ── SECTION 1 — PAGE HEADER ─────────────────────────── */}
        <header className="wp-header">
          <h1 className="wp-heading">Work</h1>
          <p className="wp-subheading">
            Professional experience and internships.
          </p>
        </header>

        {/* ── SECTION 2 — EXPERIENCE ENTRY ────────────────────── */}
        <section className="wp-entry">

          {/* Entry header row */}
          <div className="wp-entry-header">

            {/* Left: logo + text stack */}
            <div className="wp-entry-left">
              <div className="wp-logo-box" aria-hidden="true">NR</div>
              <div className="wp-text-stack">
                <span className="wp-role">Software Development Intern</span>
                <span className="wp-org">Northern Railway</span>
                <span className="wp-location">
                  Workshop Training Center · Lucknow, India
                </span>
              </div>
            </div>

            {/* Right: dates + status */}
            <div className="wp-entry-right">
              <span className="wp-dates">Jun 2025 – Aug 2025</span>
              <span className="wp-duration">2 months</span>
              <div className="wp-status">
                <span className="wp-status-dot" aria-hidden="true" />
                <span className="wp-status-label">PRODUCTION</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="wp-divider" />

          {/* Tech tags */}
          <div className="wp-tags">
            {tags.map((tag) => (
              <span key={tag} className="wp-tag">{tag}</span>
            ))}
          </div>

          {/* Bullet points */}
          <ul className="wp-bullets">
            {bullets.map((text, i) => (
              <li key={i} className="wp-bullet-row">
                <span className="wp-bullet-dash" aria-hidden="true">—</span>
                <span className="wp-bullet-text">{text}</span>
              </li>
            ))}
          </ul>

          {/* Case study link */}
          <Link href="/work/railway" className="wp-case-link">
            <span className="wp-case-label">View full case study</span>
            <ArrowRight className="wp-case-arrow" size={14} aria-hidden="true" />
          </Link>

        </section>

        {/* ── SECTION 3 — MORE EXPERIENCE PLACEHOLDER ─────────── */}
        <div className="wp-more">
          <div className="wp-more-box" aria-hidden="true" />
          <div className="wp-more-text">
            <span className="wp-more-title">More experience coming</span>
            <span className="wp-more-sub">Currently building towards next role</span>
          </div>
        </div>

        {/* ── SECTION 4 — AVAILABILITY SIGNAL ─────────────────── */}
        <footer className="wp-availability">
          <p className="wp-avail-line">
            Open to SWE internships and 2026 graduate roles.
          </p>
          <p className="wp-avail-meta">
            Based in Lucknow, India · Available immediately
          </p>
        </footer>

      </div>

      <style>{`

        /* ── ROOT ──────────────────────────────────────────────── */
        .wp-root {
          padding-top: 80px;
          padding-bottom: 96px;
        }

        /* ── SECTION 1 — HEADER ───────────────────────────────── */
        .wp-header {
          text-align: left;
          margin-bottom: 48px;
        }

        .wp-heading {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 30px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .wp-subheading {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          margin: 0;
          line-height: 1.6;
        }

        /* ── SECTION 2 — ENTRY ────────────────────────────────── */
        .wp-entry {
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
          padding-bottom: 40px;
        }

        /* Entry header row */
        .wp-entry-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .wp-entry-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        /* Logo box */
        .wp-logo-box {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-muted, #444444);
          user-select: none;
        }

        /* Text stack */
        .wp-text-stack {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .wp-role {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.3;
        }

        .wp-org {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.3;
        }

        .wp-location {
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          line-height: 1.4;
        }

        /* Right side */
        .wp-entry-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }

        .wp-dates {
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 12px;
          color: var(--color-text-muted, #444444);
          white-space: nowrap;
        }

        .wp-duration {
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 11px;
          color: var(--color-text-muted, #444444);
        }

        .wp-status {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
        }

        .wp-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent, #4AFF91);
          flex-shrink: 0;
        }

        .wp-status-label {
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-accent, #4AFF91);
        }

        /* Divider */
        .wp-divider {
          height: 0;
          border: none;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          margin: 16px 0;
        }

        /* Tech tags */
        .wp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }

        .wp-tag {
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 4px;
          padding: 4px 8px;
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          white-space: nowrap;
        }

        /* Bullet points */
        .wp-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 24px;
        }

        .wp-bullet-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .wp-bullet-dash {
          font-family: "Geist Mono", ui-monospace, monospace;
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
          line-height: 1.65;
          font-size: 14px;
        }

        .wp-bullet-text {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.65;
        }

        /* Case study link */
        .wp-case-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 20px;
          text-decoration: none;
          color: var(--color-text-secondary, #888888);
          transition: color 150ms ease;
        }

        .wp-case-link:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        .wp-case-label {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
        }

        .wp-case-arrow {
          transition: transform 150ms ease;
          flex-shrink: 0;
        }

        .wp-case-link:hover .wp-case-arrow {
          transform: translateX(3px);
        }

        /* ── SECTION 3 — PLACEHOLDER ──────────────────────────── */
        .wp-more {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 32px;
          margin-bottom: 48px;
          width: fit-content;
        }

        .wp-more-box {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border: 1px dashed var(--color-border-subtle, #1F1F1F);
          border-radius: 6px;
        }

        .wp-more-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .wp-more-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-muted, #444444);
        }

        .wp-more-sub {
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 11px;
          color: var(--color-text-muted, #444444);
        }

        /* ── SECTION 4 — AVAILABILITY ─────────────────────────── */
        .wp-availability {
          margin-top: 16px;
          padding-top: 40px;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
        }

        .wp-avail-line {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          margin: 0;
          line-height: 1.6;
        }

        .wp-avail-meta {
          font-family: "Geist Mono", ui-monospace, monospace;
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          margin: 8px 0 0 0;
        }

        /* ── MOBILE ────────────────────────────────────────────── */
        @media (max-width: 540px) {
          .wp-entry-header {
            flex-direction: column;
            gap: 12px;
          }

          .wp-entry-right {
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
          }

          .wp-status {
            margin-top: 0;
          }
        }
      `}</style>
    </PageWrapper>
  );
}