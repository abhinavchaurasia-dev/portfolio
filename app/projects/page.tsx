"use client";

import { useState } from "react";
import ProjectCard from "@/components/work/ProjectCard";
import PageWrapper from "@/components/layout/PageWrapper";

/* ============================================================
   DATA
   ============================================================ */

const PROJECTS = [
  {
    title:       "PeerCampus",
    description: "AI-assisted campus super-app with events, forums, lost-and-found using CLIP image matching, and skills marketplace.",
    status:      "SHIPPED"     as const,
    tags:        ["React", "Django", "PostgreSQL", "CLIP", "GPT-4o-mini"],
    thumbnail:   "peercampus"  as const,
    projectHref: "/projects/peercampus",
    liveHref:    "https://peercampus.abhinavchaurasia.in",
    githubHref:  "https://github.com/abhinavchaurasia-dev/peercampus",
    filterStatus: "Shipped" as FilterStatus,
  },
  {
    title:       "CivicBridge",
    description: "Civic complaint platform with AI-generated descriptions, GPS detection, and municipality performance leaderboard.",
    status:      "SHIPPED"     as const,
    tags:        ["React", "Django", "Gemini AI", "PostgreSQL"],
    thumbnail:   "civicbridge" as const,
    projectHref: "/projects/civicbridge",
    liveHref:    "https://civicbridge.abhinavchaurasia.in",
    githubHref:  "https://github.com/abhinavchaurasia-dev/civicbridge",
    filterStatus: "Shipped" as FilterStatus,
  },
  {
    title:       "SentiGenix",
    description: "Sentiment analysis platform with VADER NLP classification and DeepSeek AI-guided text rewriting.",
    status:      "SHIPPED"     as const,
    tags:        ["React", "Django", "VADER", "DeepSeek"],
    thumbnail:   "sentigenix"  as const,
    projectHref: "/projects/sentigenix",
    liveHref:    "https://sentigenix.abhinavchaurasia.in",
    githubHref:  "https://github.com/abhinavchaurasia-dev/sentigenix",
    filterStatus: "Shipped" as FilterStatus,
  },
] as const;

type FilterStatus = "Shipped" | "Building";
type Filter = "All" | FilterStatus;

const FILTERS: Filter[] = ["All", "Shipped", "Building"];

/* count per filter */
const counts: Record<FilterStatus, number> = {
  Shipped:  PROJECTS.filter(p => p.filterStatus === "Shipped").length,
  Building: PROJECTS.filter(p => p.filterStatus === "Building").length,
};

/* ============================================================
   PAGE
   ============================================================ */

export default function ProjectsPage() {
  const [active, setActive] = useState<Filter>("All");

  const visible = active === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.filterStatus === active);

  return (
    <PageWrapper>
      <div className="proj-page">

        {/* ── HEADER — centered like Ram ── */}
        <header className="proj-header">
          <h1 className="proj-title">Projects</h1>
          <p className="proj-subtitle">
            My projects and work across AI, full-stack, and systems engineering.
          </p>
        </header>

        {/* ── FILTER BY STATUS ── */}
        <div className="proj-filter-section">
          <span className="proj-filter-label">Filter by Status</span>
          <div className="proj-pills" role="group" aria-label="Filter by status">
            {FILTERS.map((f) => {
              const count = f === "All" ? null : counts[f as FilterStatus];
              return (
                <button
                  key={f}
                  className={`proj-pill${active === f ? " proj-pill--active" : ""}`}
                  onClick={() => setActive(f)}
                >
                  {f}
                  {count !== null && (
                    <span className="proj-pill-count">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ALL PROJECTS LABEL + COUNT ── */}
        <div className="proj-count-row">
          <span className="proj-count-label">
            All Projects
            <span className="proj-count-badge">({visible.length} projects)</span>
          </span>
        </div>

        {/* ── GRID ── */}
        {visible.length > 0 ? (
          <div className="proj-grid">
            {visible.map((p) => (
              <ProjectCard
                key={p.title}
                title={p.title}
                description={p.description}
                status={p.status}
                tags={[...p.tags]}
                thumbnail={p.thumbnail}
                projectHref={p.projectHref}
                liveHref={"liveHref" in p ? p.liveHref : undefined}
                githubHref={"githubHref" in p ? p.githubHref : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="proj-empty">No projects match this filter yet.</p>
        )}

      </div>

      {/* ── STYLES ── */}
      <style>{`
        .proj-page {
          padding-top: 64px;
          padding-bottom: 96px;
        }

        /* ── Header — centered ── */
        .proj-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .proj-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 36px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0 0 10px 0;
          line-height: 1.15;
        }

        .proj-subtitle {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          margin: 0;
          line-height: 1.6;
        }

        /* ── Filter section ── */
        .proj-filter-section {
          margin-bottom: 24px;
        }

        .proj-filter-label {
          display: block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted, #444444);
          margin-bottom: 10px;
        }

        .proj-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .proj-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          font-weight: 500;
          color: var(--color-text-muted, #444444);
          background: transparent;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 20px;
          padding: 5px 14px;
          cursor: pointer;
          transition: color 150ms ease, border-color 150ms ease,
                      background-color 150ms ease;
          line-height: 1;
        }

        .proj-pill:hover {
          color: var(--color-text-secondary, #888888);
          border-color: var(--color-border-default, #2A2A2A);
        }

        .proj-pill--active {
          color: var(--color-accent, #4AFF91);
          border-color: var(--color-accent-border, #4AFF9130);
          background: var(--color-accent-dim, #4AFF9115);
        }

        .proj-pill--active:hover {
          color: var(--color-accent, #4AFF91);
        }

        .proj-pill-count {
          font-size: 10px;
          opacity: 0.7;
        }

        /* ── Count row ── */
        .proj-count-row {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
        }

        .proj-count-label {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .proj-count-badge {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          font-weight: 400;
          color: var(--color-text-muted, #444444);
        }

        /* ── Grid ── */
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        /* ── Empty state ── */
        .proj-empty {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
          padding: 48px 0;
          text-align: center;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .proj-title { font-size: 28px; }

          .proj-grid {
            grid-template-columns: 1fr;
          }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .proj-pill { transition: none; }
        }
      `}</style>
    </PageWrapper>
  );
}

