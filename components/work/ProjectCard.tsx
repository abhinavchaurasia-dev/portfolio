"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Github, ExternalLink, ArrowRight } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

export type ThumbnailVariant = "peercampus" | "civicbridge" | "sentigenix" | "railway";

export interface ProjectCardProps {
  title: string;
  description: string;
  status: "SHIPPED" | "BUILDING" | "PRODUCTION";
  tags: string[];
  thumbnail: ThumbnailVariant;
  projectHref: string;
  liveHref?: string;
  githubHref?: string;
  screenshotSrc?: string;
  /** true = horizontal layout used for a hero/featured slot */
  featured?: boolean;
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const MAX_ICONS = 5;

const GRADIENTS: Record<ThumbnailVariant, string> = {
  peercampus:  "linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #0d1b69 100%)",
  civicbridge: "linear-gradient(135deg, #1a0a0a 0%, #3d0a1e 50%, #1a0a2e 100%)",
  sentigenix:  "linear-gradient(135deg, #0a1a0a 0%, #0d3d1e 50%, #0a1a2e 100%)",
  railway:     "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #091820 100%)",
};

const STATUS_CFG = {
  PRODUCTION: { dot: "#4AFF91", text: "#4AFF91", label: "All Systems Operational" },
  SHIPPED:    { dot: "#4AFF91", text: "#4AFF91", label: "All Systems Operational" },
  BUILDING:   { dot: "#FFB84A", text: "#FFB84A", label: "In Development"          },
} as const;

const ICON_MAP: Record<string, { src: string; label: string }> = {
  "react":       { src: "https://cdn.simpleicons.org/react/61DAFB",      label: "React"      },
  "django":      { src: "https://cdn.simpleicons.org/django/44B78B",     label: "Django"     },
  "postgresql":  { src: "https://cdn.simpleicons.org/postgresql/4169E1", label: "PostgreSQL" },
  "postgres":    { src: "https://cdn.simpleicons.org/postgresql/4169E1", label: "PostgreSQL" },
  "node.js":     { src: "https://cdn.simpleicons.org/nodedotjs/339933",  label: "Node.js"    },
  "nodejs":      { src: "https://cdn.simpleicons.org/nodedotjs/339933",  label: "Node.js"    },
  "express":     { src: "https://cdn.simpleicons.org/express/ffffff",    label: "Express"    },
  "openai":      { src: "https://cdn.simpleicons.org/openai/ffffff",     label: "OpenAI"     },
  "clip":        { src: "https://cdn.simpleicons.org/openai/ffffff",     label: "CLIP"       },
  "gpt-4o-mini": { src: "https://cdn.simpleicons.org/openai/ffffff",     label: "GPT-4o"     },
  "python":      { src: "https://cdn.simpleicons.org/python/3776AB",     label: "Python"     },
  "typescript":  { src: "https://cdn.simpleicons.org/typescript/3178C6", label: "TypeScript" },
  "gemini ai":   { src: "https://cdn.simpleicons.org/google/4285F4",     label: "Gemini AI"  },
  "gps api":     { src: "https://cdn.simpleicons.org/googlemaps/4285F4", label: "GPS API"    },
  "vader":       { src: "https://cdn.simpleicons.org/python/3776AB",     label: "VADER"      },
  "deepseek":    { src: "https://cdn.simpleicons.org/python/3776AB",     label: "DeepSeek"   },
  "mui":         { src: "https://cdn.simpleicons.org/mui/007FFF",        label: "MUI"        },
};

/* ============================================================
   PROJECT CARD
   ============================================================ */

export default function ProjectCard({
  title,
  description,
  status,
  tags,
  thumbnail,
  projectHref,
  liveHref,
  githubHref,
  screenshotSrc,
  featured = false,
}: ProjectCardProps) {
  const router        = useRouter();
  const cfg           = STATUS_CFG[status];
  const gradient      = GRADIENTS[thumbnail];
  const initials      = title.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const iconsToShow   = tags.slice(0, MAX_ICONS);
  const overflowCount = tags.length - MAX_ICONS;

  function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a, button")) return;
    router.push(projectHref);
  }

  function handleCardKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(projectHref);
    }
  }

  return (
    <div
      className={`pc${featured ? " pc--featured" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`View ${title} project`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      {/* ══ THUMBNAIL ══ */}
      <div className="pc-thumb" style={{ background: gradient }}>
        {screenshotSrc ? (
          <div className="pc-shot-wrap">
            <Image
              src={screenshotSrc}
              alt={`${title} screenshot`}
              fill
              className="pc-shot-img"
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          </div>
        ) : (
          <span className="pc-initials" aria-hidden="true">{initials}</span>
        )}
      </div>

      {/* ══ BODY ══ */}
      <div className="pc-body">

        {/* Title + GitHub / Live anchor buttons */}
        <div className="pc-title-row">
          <h3 className="pc-title">{title}</h3>

          <div className="pc-link-btns">
            {githubHref && (
              <a
                href={githubHref}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-link-btn"
                aria-label={`${title} GitHub repository`}
              >
                <Github size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
            {liveHref && (
              <a
                href={liveHref}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-link-btn"
                aria-label={`${title} live demo`}
              >
                <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="pc-desc">{description}</p>

        {/* Tech icons */}
        <div className="pc-techs" aria-label="Technologies used">
          {iconsToShow.map((tag) => {
            const icon = ICON_MAP[tag.toLowerCase()];
            return icon ? (
              <Image
                key={tag}
                src={icon.src}
                alt={icon.label}
                title={icon.label}
                width={20}
                height={20}
                className="pc-tech-icon"
                unoptimized
              />
            ) : (
              <span key={tag} className="pc-tech-pill">{tag}</span>
            );
          })}
          {overflowCount > 0 && (
            <span className="pc-tech-more">+{overflowCount}</span>
          )}
        </div>

        {/* Footer */}
        <div className="pc-footer">
          <div className="pc-status-pill" aria-label={`Status: ${cfg.label}`}>
            <span className="pc-status-dot" style={{ backgroundColor: cfg.dot }} />
            <span className="pc-status-text" style={{ color: cfg.text }}>{cfg.label}</span>
          </div>

          <span className="pc-cta" aria-hidden="true">
            View Details
            <ArrowRight size={12} strokeWidth={1.5} />
          </span>
        </div>
      </div>

      {/* ══ STYLES ══ */}
      <style>{`
        /* ─── Card shell ─── */
        .pc {
          display: flex;
          flex-direction: column;
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 12px;
          overflow: hidden;
          color: inherit;
          cursor: pointer;
          transition: border-color 150ms ease, transform 150ms ease;
          will-change: transform;
          outline: none;
          /* Full width by default — parent grid controls sizing */
          width: 100%;
        }

        .pc:hover {
          border-color: var(--color-border-default, #2A2A2A);
          transform: translateY(-2px);
        }

        .pc:focus-visible {
          outline: 2px solid var(--color-accent, #4AFF91);
          outline-offset: 2px;
        }

        /* ─── Featured horizontal variant ─── */
        .pc--featured {
          flex-direction: row;
        }
        .pc--featured .pc-thumb {
          width: 42%;
          height: auto;
          min-height: 220px;
          flex-shrink: 0;
          border-radius: 12px 0 0 12px;
        }
        .pc--featured .pc-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        /* On mobile: featured card reverts to vertical stack */
        @media (max-width: 767px) {
          .pc--featured {
            flex-direction: column;
          }
          .pc--featured .pc-thumb {
            width: 100%;
            height: 180px;
            min-height: unset;
            border-radius: 12px 12px 0 0;
          }
          .pc--featured .pc-body {
            justify-content: flex-start;
          }
        }

        /* ─── Thumbnail ─── */
        .pc-thumb {
          position: relative;
          height: 180px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Angled screenshot */
        .pc-shot-wrap {
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 75%;
          height: 110%;
          border-radius: 8px 0 0 0;
          overflow: hidden;
          box-shadow: -8px -8px 32px rgba(0, 0, 0, 0.4);
          transform: perspective(1000px) rotateX(2deg) rotateY(-4deg);
          transform-origin: bottom right;
        }

        .pc-shot-img {
          object-fit: cover;
          object-position: top left;
        }

        /* Fallback initials */
        .pc-initials {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 32px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.08);
          user-select: none;
          letter-spacing: -0.02em;
        }

        /* ─── Body ─── */
        .pc-body {
          padding: 16px 20px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          /* Prevent body from overflowing on 375px */
          min-width: 0;
        }

        /* Title row */
        .pc-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          gap: 8px;
        }

        .pc-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0;
          line-height: 1.3;
          min-width: 0;
          /* Prevent title overflow on small screens */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* GitHub / Live icon buttons */
        .pc-link-btns {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .pc-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          /* 44×44 touch target */
          width: 44px;
          height: 44px;
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 6px;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          transition: color 150ms ease, border-color 150ms ease;
          flex-shrink: 0;
        }

        .pc-link-btn:hover {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-strong, #3A3A3A);
        }

        /* Description */
        .pc-desc {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.6;
          margin: 0 0 14px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Tech icons — allow wrap on 375px */
        .pc-techs {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .pc-tech-icon {
          width: 20px;
          height: 20px;
          object-fit: contain;
          opacity: 0.8;
          flex-shrink: 0;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
        }

        .pc-tech-pill {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          color: var(--color-text-muted, #444444);
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 3px;
          padding: 2px 6px;
          line-height: 1.4;
          white-space: nowrap;
        }

        .pc-tech-more {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
        }

        /* Footer — wraps on very narrow viewports */
        .pc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: auto;
          flex-wrap: wrap;
        }

        .pc-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 20px;
          padding: 4px 10px;
          /* Don't let it overflow at 375px */
          max-width: 100%;
          overflow: hidden;
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
          letter-spacing: 0.08em;
          line-height: 1;
          /* Allow truncation on very tight viewports */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .pc-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 12px;
          font-weight: 500;
          color: var(--color-text-secondary, #888888);
          transition: color 150ms ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pc:hover .pc-cta {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .pc          { transform: none !important; transition: border-color 150ms ease; }
          .pc-link-btn { transition: none; }
          .pc-cta      { transition: none; }
        }
      `}</style>
    </div>
  );
}

