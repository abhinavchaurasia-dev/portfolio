import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

/* ============================================================
   CASE STUDY LAYOUT
   Shared shell for all 4 project case studies.
   Server component — all interactivity lives in children.
   ============================================================ */

export interface CaseStudyLayoutProps {
  title: string;
  oneLiner: string;
  thumbnail: "railway" | "peercampus" | "civicbridge" | "sentigenix";
  tags: string[];
  timeline: string;
  role: string;
  team: string;
  status: "PRODUCTION" | "SHIPPED";
  liveHref?: string;
  sourceHref?: string;
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
  children: ReactNode;
}

/* ── Thumbnail gradients (per spec) ── */
const GRADIENTS: Record<CaseStudyLayoutProps["thumbnail"], string> = {
  railway:    "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #091820 100%)",
  peercampus: "linear-gradient(135deg, #120a24 0%, #0d1a3c 50%, #071a24 100%)",
  civicbridge:"linear-gradient(135deg, #200a12 0%, #1a0d28 50%, #0a1020 100%)",
  sentigenix: "linear-gradient(135deg, #0a1c14 0%, #091828 50%, #120a18 100%)",
};

/* ── Simple SVG patterns per project ── */
function ThumbnailPattern({ type }: { type: CaseStudyLayoutProps["thumbnail"] }) {
  const stroke = "var(--color-border-default, #2A2A2A)";

  if (type === "railway") {
    // Horizontal rail lines
    return (
      <svg width="200" height="80" viewBox="0 0 200 80" fill="none" aria-hidden="true">
        {[10, 26, 42, 58, 74].map((y) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} stroke={stroke} strokeWidth="1" />
        ))}
        {[20, 60, 100, 140, 180].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="80" stroke={stroke} strokeWidth="1" strokeDasharray="4 6" />
        ))}
      </svg>
    );
  }

  if (type === "peercampus") {
    // Connected node graph
    const nodes = [[40,40],[100,20],[160,40],[100,60],[70,70],[130,70]] as const;
    const edges = [[0,1],[1,2],[2,3],[3,0],[0,4],[2,5],[4,5],[1,3]] as const;
    return (
      <svg width="200" height="80" viewBox="0 0 200 80" fill="none" aria-hidden="true">
        {edges.map(([a,b], i) => (
          <line key={i}
            x1={nodes[a][0]} y1={nodes[a][1]}
            x2={nodes[b][0]} y2={nodes[b][1]}
            stroke={stroke} strokeWidth="1"
          />
        ))}
        {nodes.map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={stroke} />
        ))}
      </svg>
    );
  }

  if (type === "civicbridge") {
    // Location pin outline
    return (
      <svg width="200" height="80" viewBox="0 0 200 80" fill="none" aria-hidden="true">
        <circle cx="100" cy="32" r="18" stroke={stroke} strokeWidth="1" />
        <circle cx="100" cy="32" r="5" stroke={stroke} strokeWidth="1" />
        <path d="M100 50 L92 66 Q100 72 108 66 Z" stroke={stroke} strokeWidth="1" fill="none" />
        {[40,60,70,130,140,160].map((x,i) => (
          <circle key={i} cx={x} cy={i % 2 === 0 ? 20 : 60} r="2" fill={stroke} />
        ))}
      </svg>
    );
  }

  // sentigenix — waveform
  const pts = [0,8,16,24,32,40,48,56,64,72,80,88,96,104,112,120,128,136,144,152,160,168,176,184,192,200];
  const amps = [0,4,-4,12,-12,20,-20,14,-14,7,-7,18,-18,10,-10,3,-3,16,-16,8,-8,5,-5,2,-2,0];
  const d = pts.map((x,i) => `${i===0?"M":"L"}${x} ${40 + amps[i]}`).join(" ");
  return (
    <svg width="200" height="80" viewBox="0 0 200 80" fill="none" aria-hidden="true">
      <path d={d} stroke={stroke} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* ── Status badge ── */
const STATUS_COLOR: Record<string, string> = {
  PRODUCTION: "var(--color-accent, #4AFF91)",
  SHIPPED:    "var(--color-accent, #4AFF91)",
};

export default function CaseStudyLayout({
  title,
  oneLiner,
  thumbnail,
  tags,
  timeline,
  role,
  team,
  status,
  liveHref,
  sourceHref,
  prev,
  next,
  children,
}: CaseStudyLayoutProps) {
  const statusColor = STATUS_COLOR[status] ?? "var(--color-accent, #4AFF91)";

  const meta = [
    { label: "Timeline", value: timeline },
    { label: "Role",     value: role     },
    { label: "Team",     value: team     },
    { label: "Status",   value: status   },
  ];

  return (
    <article className="cs">

      {/* ── Back link ── */}
      <Link href="/work" className="cs-back" aria-label="Back to all work">
        ← Work
      </Link>

      {/* ── Thumbnail ── */}
      <div
        className="cs-thumb"
        style={{ background: GRADIENTS[thumbnail] }}
        role="img"
        aria-label={`${title} project thumbnail`}
      >
        <span className="cs-thumb-label">
          {title}
        </span>
        <ThumbnailPattern type={thumbnail} />
      </div>

      {/* ── Tech tags ── */}
      <ul className="cs-tags" role="list" aria-label="Technologies">
        {tags.map((t) => (
          <li key={t} className="cs-tag">{t}</li>
        ))}
      </ul>

      {/* ── Title ── */}
      <h1 className="cs-title">{title}</h1>

      {/* ── One-liner ── */}
      <p className="cs-oneliner">{oneLiner}</p>

      {/* ── Meta row ── */}
      <dl className="cs-meta">
        {meta.map(({ label, value }, i) => (
          <div key={label} className={`cs-meta-cell${i === meta.length - 1 ? " cs-meta-cell--last" : ""}`}>
            <dt className="cs-meta-label">{label}</dt>
            <dd
              className="cs-meta-value"
              style={label === "Status" ? { color: statusColor } : undefined}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {/* ── Divider ── */}
      <div className="cs-divider" role="separator" />

      {/* ── CTA links ── */}
      {(liveHref || sourceHref) && (
        <div className="cs-ctas">
          {liveHref && (
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-cta-link"
              aria-label={`${title} live demo, opens in new tab`}
            >
              Live Demo
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}
          {sourceHref && (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-cta-link"
              aria-label={`${title} source code, opens in new tab`}
            >
              Source Code
              <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {/* ── Body content (sections injected by page) ── */}
      <div className="cs-body">
        {children}
      </div>

      {/* ── Prev / Next navigation ── */}
      {(prev || next) && (
        <nav className="cs-nav" aria-label="Project navigation">
          <div className="cs-nav-side cs-nav-side--left">
            {prev && (
              <Link href={prev.href} className="cs-nav-link">
                <span className="cs-nav-direction">← Previous Project</span>
                <span className="cs-nav-name">{prev.label}</span>
              </Link>
            )}
          </div>
          <div className="cs-nav-side cs-nav-side--right">
            {next && (
              <Link href={next.href} className="cs-nav-link cs-nav-link--right">
                <span className="cs-nav-direction">Next Project →</span>
                <span className="cs-nav-name">{next.label}</span>
              </Link>
            )}
          </div>
        </nav>
      )}

      {/* ── Scoped styles ── */}
      <style>{`
        .cs {
          padding-top: 64px;
          padding-bottom: 80px;
        }

        /* Back link */
        .cs-back {
          display: inline-block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          margin-bottom: 40px;
          transition: color 150ms ease;
        }

        .cs-back:hover { color: var(--color-text-primary, #F0F0F0); }

        /* Thumbnail */
        .cs-thumb {
          width: 100%;
          height: 240px;
          border-radius: 8px;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          margin-bottom: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          overflow: hidden;
        }

        .cs-thumb-label {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
          letter-spacing: 0.04em;
        }

        /* Tags */
        .cs-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          list-style: none;
          margin: 0 0 20px;
          padding: 0;
        }

        .cs-tag {
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

        /* Title */
        .cs-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 30px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0 0 8px;
          line-height: 1.2;
        }

        /* One-liner */
        .cs-oneliner {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          margin: 0 0 24px;
          line-height: 1.6;
        }

        /* Meta row */
        .cs-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin: 0;
          padding: 0;
        }

        .cs-meta-cell {
          padding-right: 24px;
          margin-right: 24px;
          border-right: 1px solid var(--color-border-subtle, #1F1F1F);
        }

        .cs-meta-cell--last {
          border-right: none;
          padding-right: 0;
          margin-right: 0;
        }

        .cs-meta-label {
          display: block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
          margin-bottom: 4px;
        }

        .cs-meta-value {
          display: block;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          white-space: nowrap;
        }

        /* Divider */
        .cs-divider {
          height: 1px;
          background: var(--color-border-subtle, #1F1F1F);
          margin: 28px 0 24px;
        }

        /* CTA links */
        .cs-ctas {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 48px;
        }

        .cs-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          transition: color 150ms ease;
        }

        .cs-cta-link:hover { color: var(--color-text-primary, #F0F0F0); }

        /* Body */
        .cs-body {
          margin-top: 48px;
        }

        /* Prev/next nav */
        .cs-nav {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          padding-top: 40px;
          margin-top: 32px;
          gap: 24px;
        }

        .cs-nav-side { flex: 1; }
        .cs-nav-side--right { text-align: right; }

        .cs-nav-link {
          display: inline-flex;
          flex-direction: column;
          gap: 4px;
          text-decoration: none;
          transition: color 150ms ease;
        }

        .cs-nav-link:hover .cs-nav-direction {
          color: var(--color-accent, #4AFF91);
        }

        .cs-nav-direction {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          transition: color 150ms ease;
        }

        .cs-nav-name {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-muted, #444444);
        }

        /* Section label utility (used by page children) */
        .cs-section-label {
          display: inline-block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted, #444444);
          background-color: var(--color-bg-inset, #1A1A1A);
          border-left: 2px solid var(--color-border-strong, #333333);
          padding: 2px 8px;
          margin-bottom: 16px;
        }

        /* Prose paragraphs (case study body text) */
        .cs-prose {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.75;
          margin-bottom: 48px;
        }

        .cs-prose p { margin: 0; }
        .cs-prose p + p { margin-top: 16px; }

        /* Impact metric list */
        .cs-metrics {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 48px;
          list-style: none;
          padding: 0;
          margin-top: 0;
        }

        .cs-metric {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .cs-metric-dash {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          color: var(--color-text-muted, #444444);
          font-size: 14px;
          flex-shrink: 0;
        }

        .cs-metric-text {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.5;
        }

        /* Code block */
        .cs-code {
          background-color: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 6px;
          padding: 16px 20px;
          margin-bottom: 24px;
          overflow-x: auto;
        }

        .cs-code pre {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.7;
          margin: 0;
          white-space: pre;
        }

        @media (max-width: 560px) {
          .cs-meta { gap: 12px; }
          .cs-meta-cell {
            border-right: none;
            padding-right: 0;
            margin-right: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cs-back, .cs-cta-link, .cs-nav-link,
          .cs-nav-direction { transition: none; }
        }
      `}</style>
    </article>
  );
}