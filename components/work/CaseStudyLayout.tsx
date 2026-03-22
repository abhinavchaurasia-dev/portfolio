import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

export type CaseStudyStatus = "PRODUCTION" | "SHIPPED" | "BUILDING";

export interface MetaItem {
  label: string;
  value: string;
  badge?: boolean; // renders value as a coloured status badge
}

export interface NavLink {
  label: string;
  href: string;
}

export interface CaseStudyLayoutProps {
  /* Hero */
  gradient: string;          // CSS gradient string for banner
  tags: string[];            // pill tags shown below banner

  /* Header */
  title: string;
  subtitle?: string;

  /* Metadata row */
  meta: MetaItem[];          // e.g. Timeline, Role, Team, Status

  /* Action buttons */
  liveHref?: string;
  sourceHref?: string;

  /* Navigation */
  backHref?: string;         // defaults to /projects
  backLabel?: string;
  prevProject?: NavLink;
  nextProject?: NavLink;

  /* Body content */
  children: ReactNode;
}

const STATUS_BADGE: Record<string, { color: string; bg: string; border: string }> = {
  PRODUCTION: { color: "#4AFF91", bg: "#4AFF9115", border: "#4AFF9130" },
  SHIPPED:    { color: "#4AFF91", bg: "#4AFF9115", border: "#4AFF9130" },
  BUILDING:   { color: "#FFB84A", bg: "rgba(255,184,74,0.08)", border: "rgba(255,184,74,0.2)" },
  COMPLETED:  { color: "#4AFF91", bg: "#4AFF9115", border: "#4AFF9130" },
};

/* ============================================================
   COMPONENT
   ============================================================ */

export default function CaseStudyLayout({
  gradient,
  tags,
  title,
  subtitle,
  meta,
  liveHref,
  sourceHref,
  backHref = "/projects",
  backLabel = "Back to Projects",
  prevProject,
  nextProject,
  children,
}: CaseStudyLayoutProps) {
  return (
    <article className="cs">

      {/* ── BACK LINK ── */}
      <div className="cs-back-wrap">
        <Link href={backHref} className="cs-back">
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          {backLabel}
        </Link>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="cs-hero" style={{ background: gradient }} aria-hidden="true" />

      {/* ── TAG PILLS ── */}
      <div className="cs-tags" aria-label="Project tags">
        {tags.map((tag) => (
          <span key={tag} className="cs-tag">{tag}</span>
        ))}
      </div>

      {/* ── TITLE + SUBTITLE ── */}
      <h1 className="cs-title">{title}</h1>
      {subtitle && <p className="cs-subtitle">{subtitle}</p>}

      {/* ── METADATA ROW ── */}
      <div className="cs-meta-row" role="list">
        {meta.map((m) => {
          const badge = m.badge ? STATUS_BADGE[m.value.toUpperCase()] ?? null : null;
          return (
            <div key={m.label} className="cs-meta-item" role="listitem">
              <span className="cs-meta-label">{m.label}</span>
              {badge ? (
                <span
                  className="cs-meta-badge"
                  style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.border}` }}
                >
                  {m.value}
                </span>
              ) : (
                <span className="cs-meta-value">{m.value}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── ACTION BUTTONS ── */}
      {(liveHref || sourceHref) && (
        <div className="cs-actions">
          {liveHref && (
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-btn cs-btn--primary"
            >
              <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
              Live Demo
            </a>
          )}
          {sourceHref && (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-btn cs-btn--secondary"
            >
              <Github size={14} strokeWidth={1.5} aria-hidden="true" />
              Source Code
            </a>
          )}
        </div>
      )}

      {/* ── DIVIDER ── */}
      <div className="cs-divider" role="separator" />

      {/* ── BODY CONTENT ── */}
      <div className="cs-body">
        {children}
      </div>

      {/* ── NEXT PROJECT NAV ── */}
      {(prevProject || nextProject) && (
        <div className="cs-nav">
          {prevProject ? (
            <Link href={prevProject.href} className="cs-nav-link cs-nav-link--prev">
              <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
              <span className="cs-nav-dir">Previous Project</span>
              <span className="cs-nav-name">{prevProject.label}</span>
            </Link>
          ) : <div />}

          {nextProject && (
            <Link href={nextProject.href} className="cs-nav-link cs-nav-link--next">
              <span className="cs-nav-dir">Next Project</span>
              <span className="cs-nav-name">{nextProject.label}</span>
              <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          )}
        </div>
      )}

      {/* ── STYLES ── */}
      <style>{`
        .cs {
          max-width: var(--layout-max-width, 1120px);
          margin: 0 auto;
          padding: 48px 0 96px;
        }

        /* Back link */
        .cs-back-wrap {
          margin-bottom: 24px;
        }

        .cs-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          transition: color 150ms ease;
        }

        .cs-back:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* Hero banner */
        .cs-hero {
          width: 100%;
          height: 260px;
          border-radius: 12px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        /* Tag pills */
        .cs-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .cs-tag {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-secondary, #888888);
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 20px;
          padding: 4px 12px;
          white-space: nowrap;
          line-height: 1;
        }

        /* Title */
        .cs-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 32px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .cs-subtitle {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.6;
          margin: 0 0 20px 0;
        }

        /* Metadata row */
        .cs-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin-bottom: 20px;
          background: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          overflow: hidden;
        }

        .cs-meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 14px 20px;
          border-right: 1px solid var(--color-border-subtle, #1F1F1F);
          flex: 1;
          min-width: 100px;
        }

        .cs-meta-item:last-child {
          border-right: none;
        }

        .cs-meta-label {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
        }

        .cs-meta-value {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
        }

        .cs-meta-badge {
          display: inline-block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-radius: 20px;
          padding: 3px 8px;
          line-height: 1.4;
          width: fit-content;
        }

        /* Action buttons */
        .cs-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        .cs-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          border-radius: 7px;
          padding: 9px 16px;
          text-decoration: none;
          transition: opacity 150ms ease, border-color 150ms ease;
          white-space: nowrap;
        }

        .cs-btn--primary {
          color: #080808;
          background: var(--color-accent, #4AFF91);
          border: 1px solid var(--color-accent, #4AFF91);
        }

        .cs-btn--primary:hover { opacity: 0.88; }

        .cs-btn--secondary {
          color: var(--color-text-secondary, #888888);
          background: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-default, #2A2A2A);
        }

        .cs-btn--secondary:hover {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-strong, #3A3A3A);
        }

        /* Divider */
        .cs-divider {
          height: 1px;
          background: var(--color-border-subtle, #1F1F1F);
          margin-bottom: 40px;
        }

        /* Body prose */
        .cs-body {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* ── Section heading used inside body ── */
        .cs-section-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 20px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0 0 16px 0;
          line-height: 1.3;
        }

        /* ── Body prose paragraphs ── */
        .cs-prose p {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.75;
          margin: 0;
        }

        .cs-prose p + p {
          margin-top: 16px;
        }

        /* Next/Prev nav */
        .cs-nav {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          gap: 16px;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          padding-top: 32px;
          margin-top: 16px;
        }

        .cs-nav-link {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-decoration: none;
          padding: 16px 20px;
          background: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          transition: border-color 150ms ease;
          max-width: 280px;
        }

        .cs-nav-link:hover {
          border-color: var(--color-border-default, #2A2A2A);
        }

        .cs-nav-link--next {
          align-items: flex-end;
          margin-left: auto;
        }

        .cs-nav-dir {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
        }

        .cs-nav-name {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
        }

        /* Responsive */
        @media (max-width: 640px) {
          .cs-hero       { height: 180px; }
          .cs-title      { font-size: 26px; }
          .cs-meta-row   { flex-direction: column; }
          .cs-meta-item  { border-right: none; border-bottom: 1px solid var(--color-border-subtle, #1F1F1F); }
          .cs-meta-item:last-child { border-bottom: none; }
          .cs-nav        { flex-direction: column; }
          .cs-nav-link   { max-width: 100%; }
          .cs-nav-link--next { align-items: flex-start; margin-left: 0; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .cs-back    { transition: none; }
          .cs-btn     { transition: none; }
          .cs-nav-link { transition: none; }
        }
      `}</style>
    </article>
  );
}

