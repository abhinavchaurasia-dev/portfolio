"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

export type ThumbnailVariant =
  | "railway"
  | "peercampus"
  | "civicbridge"
  | "sentigenix";

export interface ProjectCardProps {
  title: string;
  status: "PRODUCTION" | "SHIPPED" | "BUILDING";
  year: string;
  type: string;
  description: string;
  architecture: string;
  tags: string[];
  caseStudyHref: string;
  liveHref?: string;
  sourceHref?: string;
  thumbnail: ThumbnailVariant;
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const MAX_TAGS = 4;

const STATUS_CONFIG = {
  PRODUCTION: {
    color: "var(--color-accent, #4AFF91)",
    dot:   "var(--color-accent, #4AFF91)",
  },
  SHIPPED: {
    color: "var(--color-accent, #4AFF91)",
    dot:   "var(--color-accent, #4AFF91)",
  },
  BUILDING: {
    color: "var(--color-status-wip, #FFB84A)",
    dot:   "var(--color-status-wip, #FFB84A)",
  },
} as const;

const THUMBNAIL_GRADIENTS: Record<ThumbnailVariant, string> = {
  railway:     "linear-gradient(135deg, #0a1628, #0d2137, #091820)",
  peercampus:  "linear-gradient(135deg, #120a24, #0d1a3c, #071a24)",
  civicbridge: "linear-gradient(135deg, #200a12, #1a0d28, #0a1020)",
  sentigenix:  "linear-gradient(135deg, #0a1c14, #091828, #120a18)",
};

/* ============================================================
   PROJECT CARD
   ============================================================ */

export default function ProjectCard({
  title,
  status,
  year,
  type,
  description,
  architecture,
  tags,
  caseStudyHref,
  liveHref,
  sourceHref,
  thumbnail,
}: ProjectCardProps) {
  const statusCfg     = STATUS_CONFIG[status];
  const visibleTags   = tags.slice(0, MAX_TAGS);
  const overflowCount = tags.length - MAX_TAGS;
  const initial       = title.charAt(0).toUpperCase();
  const gradient      = THUMBNAIL_GRADIENTS[thumbnail];

  return (
    <motion.article
      className="pc"
      /*
       * FIX: useReducedMotion() was removed — it reads a media query only
       * on the client, producing different initial/whileInView values on
       * server vs client → hydration mismatch. Static values are safe;
       * prefers-reduced-motion is handled via CSS below instead.
       */
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      aria-label={`${title} — ${status}`}
    >
      {/* ── THUMBNAIL ── */}
      <div
        className="pc-thumbnail"
        aria-hidden="true"
        style={{ background: gradient }}
      >
        <span className="pc-thumb-letter">{initial}</span>
        <span className="pc-thumb-type">{type}</span>
      </div>

      {/* ── ROW A: Meta bar ── */}
      <div className="pc-meta">
        <div className="pc-status" aria-label={`Status: ${status}`}>
          <span
            className="pc-status-dot"
            style={{ backgroundColor: statusCfg.dot }}
            aria-hidden="true"
          />
          <span
            className="pc-status-text"
            style={{ color: statusCfg.color }}
          >
            {status}
          </span>
        </div>
        <time className="pc-year" dateTime={year}>
          {year}
        </time>
      </div>

      {/* ── ROW B: Title + type ── */}
      <div className="pc-title-row">
        <h3 className="pc-title">{title}</h3>
        <span className="pc-type" aria-label={`Type: ${type}`}>{type}</span>
      </div>

      {/* ── ROW C: Description ── */}
      <p className="pc-description">{description}</p>

      {/* ── ROW D: Architecture ── */}
      <div className="pc-arch" aria-label={`Architecture: ${architecture}`}>
        <span className="pc-arch-label" aria-hidden="true">arch</span>
        <span className="pc-arch-content">{architecture}</span>
      </div>

      {/* ── ROW E: Footer ── */}
      <footer className="pc-footer">
        {/* Tags */}
        <ul className="pc-tags" aria-label="Technologies used" role="list">
          {visibleTags.map((tag) => (
            <li key={tag} className="pc-tag">{tag}</li>
          ))}
          {overflowCount > 0 && (
            <li
              className="pc-tag"
              aria-label={`${overflowCount} more technologies`}
            >
              +{overflowCount}
            </li>
          )}
        </ul>

        {/* Links */}
        <nav className="pc-links" aria-label={`Links for ${title}`}>
          <Link href={caseStudyHref} className="pc-link">
            Case Study
            <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
          </Link>

          {liveHref && (
            <a
              href={liveHref}
              className="pc-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} live demo, opens in new tab`}
            >
              Live
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}

          {sourceHref && (
            <a
              href={sourceHref}
              className="pc-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} source code, opens in new tab`}
            >
              Source
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}
        </nav>
      </footer>

      <style>{`
        /* ── Container ── */
        .pc {
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          padding: 0 0 20px 0;
          transition: border-color 150ms ease;
          cursor: default;
          overflow: hidden;
        }

        .pc:hover {
          border-color: var(--color-border-default, #2A2A2A);
        }

        /* ── THUMBNAIL ── */
        .pc-thumbnail {
          height: 200px;
          width: 100%;
          border-radius: 6px 6px 0 0;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .pc-thumb-letter {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 48px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.06);
          line-height: 1;
          user-select: none;
        }

        .pc-thumb-type {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 4px 10px;
          border-radius: 3px;
          user-select: none;
        }

        /* ── ROW A: Meta ── */
        .pc-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 0 24px;
        }

        .pc-status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pc-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .pc-status-text {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .pc-year {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
        }

        /* ── ROW B: Title ── */
        .pc-title-row {
          display: flex;
          align-items: baseline;
          margin-bottom: 10px;
          padding: 0 24px;
        }

        .pc-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 18px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.3;
          margin: 0;
        }

        .pc-type {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          margin-left: 12px;
          flex-shrink: 0;
        }

        /* ── ROW C: Description ── */
        .pc-description {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.65;
          margin-bottom: 12px;
          padding: 0 24px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── ROW D: Architecture ── */
        .pc-arch {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 4px;
          padding: 8px 10px;
          margin: 0 24px 14px 24px;
        }

        .pc-arch-label {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted, #444444);
          background-color: var(--color-bg-base, #080808);
          padding: 2px 6px;
          border-radius: 3px;
          flex-shrink: 0;
          line-height: 1.4;
        }

        .pc-arch-content {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.5;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── ROW E: Footer ── */
        .pc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          padding: 0 24px;
        }

        /* Tags */
        .pc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          list-style: none;
          margin: 0;
          padding: 0;
          min-width: 0;
        }

        .pc-tag {
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

        /* Links */
        .pc-links {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .pc-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          transition: color 150ms ease;
          white-space: nowrap;
        }

        .pc-link:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* Honour reduced-motion via CSS — no JS hook needed */
        @media (prefers-reduced-motion: reduce) {
          .pc      { transition: none; }
          .pc-link { transition: none; }
        }
      `}</style>
    </motion.article>
  );
}