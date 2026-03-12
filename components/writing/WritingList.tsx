"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

/* ============================================================
   WRITING LIST
   Client island — receives serialised PostMeta[] from server.
   Handles: category filter pills + animated post rows.
   ============================================================ */

const ALL = "All";

interface WritingListProps {
  posts: PostMeta[];
}

export default function WritingList({ posts }: WritingListProps) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL);

  /* Derive unique categories from posts */
  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category))).sort();
    return [ALL, ...cats];
  }, [posts]);

  const filtered = useMemo(
    () =>
      activeCategory === ALL
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory]
  );

  /* Format date "2025-11-15" → "Nov 2025" (compact for list) */
  function shortDate(dateStr: string): string {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  }

  return (
    <div className="wl">
      {/* ── Category filter pills ── */}
      <div className="wl-filters" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`wl-pill${activeCategory === cat ? " wl-pill--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Post list ── */}
      <div className="wl-list" role="list">
        {filtered.length === 0 && (
          <p className="wl-empty">No posts in this category yet.</p>
        )}

        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="wl-row"
            role="listitem"
          >
            {/* Left column */}
            <div className="wl-left">
              <span className="wl-cat-pill">{post.category}</span>
              <span className="wl-title">{post.title}</span>
              {post.excerpt && (
                <span className="wl-excerpt">{post.excerpt}</span>
              )}
            </div>

            {/* Right column */}
            <div className="wl-right">
              <time className="wl-date" dateTime={post.date}>
                {shortDate(post.date)}
              </time>
              <span className="wl-read">{post.readingTime}</span>
              <span className="wl-arrow" aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        /* ── Filter pills ── */
        .wl-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .wl-pill {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          background: transparent;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 20px;
          padding: 4px 12px;
          cursor: pointer;
          transition: color 150ms ease, border-color 150ms ease;
          white-space: nowrap;
        }

        .wl-pill:hover {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-default, #2A2A2A);
        }

        .wl-pill--active {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-accent-border, #4AFF9130);
        }

        /* ── Post rows ── */
        .wl-list {
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
        }

        .wl-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          min-height: 64px;
          padding: 16px 0;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 150ms ease, padding 150ms ease;
        }

        .wl-row:hover {
          background-color: var(--color-bg-elevated, #0F0F0F);
          padding-left: 12px;
          padding-right: 12px;
        }

        /* Left */
        .wl-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .wl-cat-pill {
          display: inline-block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted, #444444);
          background-color: var(--color-bg-inset, #1A1A1A);
          border-radius: 3px;
          padding: 2px 6px;
          width: fit-content;
          margin-bottom: 2px;
        }

        .wl-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .wl-excerpt {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.5;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-top: 1px;
        }

        /* Right */
        .wl-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
          min-width: 100px;
        }

        .wl-date {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          white-space: nowrap;
        }

        .wl-read {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          color: var(--color-text-muted, #444444);
          white-space: nowrap;
        }

        .wl-arrow {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
          opacity: 0;
          transition: opacity 150ms ease;
          margin-top: 2px;
        }

        .wl-row:hover .wl-arrow { opacity: 1; }

        /* Empty state */
        .wl-empty {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-muted, #444444);
          padding: 32px 0;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .wl-pill, .wl-row, .wl-arrow { transition: none; }
        }
      `}</style>
    </div>
  );
}