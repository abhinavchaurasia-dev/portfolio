"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/mdx";

/* ── helpers ─────────────────────────────────────────────── */

function formatPreciseDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

/* ── Filter pill ─────────────────────────────────────────── */

function FilterPill({ label, active, onClick }: {
  label: string; active: boolean; onClick: () => void;
}) {
  return (
    <>
      <button className={`fp ${active ? "fp--on" : ""}`} onClick={onClick} aria-pressed={active}>
        {label}
      </button>
      <style>{`
        .fp {
          font-family: var(--font-geist-mono,"Geist Mono",monospace);
          font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
          padding: 4px 12px; border-radius: 100px;
          border: 1px solid var(--color-border-subtle,#1F1F1F);
          background: transparent; color: var(--color-text-muted,#444444);
          cursor: pointer; transition: border-color 150ms ease, color 150ms ease, background 150ms ease;
        }
        .fp:hover { border-color: var(--color-border-default,#2A2A2A); color: var(--color-text-secondary,#888888); }
        .fp--on { border-color: var(--color-border-strong,#3A3A3A); background: var(--color-bg-elevated,#0F0F0F); color: var(--color-text-primary,#F0F0F0); }
      `}</style>
    </>
  );
}

/* ── Post row ────────────────────────────────────────────── */

function PostRow({ post, isLast }: { post: PostMeta; isLast: boolean }) {
  return (
    <>
      <Link href={`/writing/${post.slug}`} className="pr" aria-label={post.title}>

        {/* 120×80 thumbnail */}
        <div
          className="pr-thumb"
          style={{ background: post.coverGradient ?? "var(--color-bg-inset,#1A1A1A)" }}
          aria-hidden="true"
        >
          <span className="pr-thumb-cat">{post.category.slice(0, 2).toUpperCase()}</span>
        </div>

        {/* Content */}
        <div className="pr-body">
          <div className="pr-meta-row">
            <span className="pr-cat">{post.category}</span>
            <div className="pr-meta-right">
              <time className="pr-date" dateTime={post.date}>{formatPreciseDate(post.date)}</time>
              <span className="pr-sep" aria-hidden="true">·</span>
              <span className="pr-read">{post.readingTime}</span>
            </div>
          </div>
          <h2 className="pr-title">{post.title}</h2>
          <p className="pr-excerpt">{post.excerpt}</p>
        </div>
      </Link>

      {!isLast && <div className="pr-divider" aria-hidden="true" />}

      <style>{`
        .pr {
          display: flex; gap: 20px; align-items: flex-start;
          padding: 24px 0; text-decoration: none;
        }
        .pr:hover .pr-title { color: var(--color-accent,#4AFF91); }

        /* Thumbnail */
        .pr-thumb {
          width: 120px; height: 80px; flex-shrink: 0; border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--color-border-subtle,#1F1F1F);
        }
        .pr-thumb-cat {
          font-family: var(--font-geist-mono,"Geist Mono",monospace);
          font-size: 20px; font-weight: 700;
          color: rgba(255,255,255,0.10); user-select: none;
        }

        /* Body */
        .pr-body { flex: 1; min-width: 0; }

        .pr-meta-row {
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px; margin-bottom: 8px;
        }

        .pr-cat {
          font-family: var(--font-geist-mono,"Geist Mono",monospace);
          font-size: 10px; font-weight: 500; text-transform: uppercase;
          letter-spacing: 0.08em; color: var(--color-text-muted,#444444);
          background: var(--color-bg-inset,#1A1A1A);
          border: 1px solid var(--color-border-subtle,#1F1F1F);
          padding: 2px 7px; border-radius: 3px;
        }

        .pr-meta-right {
          display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }
        .pr-date, .pr-read {
          font-family: var(--font-geist-mono,"Geist Mono",monospace);
          font-size: 11px; color: var(--color-text-muted,#444444);
          white-space: nowrap;
        }
        .pr-read { opacity: 0.6; }
        .pr-sep { font-size: 11px; color: var(--color-text-muted,#444444); opacity: 0.4; }

        .pr-title {
          font-family: var(--font-geist,"Geist",sans-serif);
          font-size: 16px; font-weight: 600;
          color: var(--color-text-primary,#F0F0F0);
          line-height: 1.35; margin: 0 0 8px;
          transition: color 150ms ease;
        }

        .pr-excerpt {
          font-family: var(--font-geist,"Geist",sans-serif);
          font-size: 13px; color: var(--color-text-muted,#444444);
          line-height: 1.65; margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        .pr-divider { height: 1px; background: var(--color-border-subtle,#1F1F1F); }

        @media (max-width: 560px) {
          .pr { gap: 14px; }
          .pr-thumb { width: 80px; height: 56px; }
          .pr-thumb-cat { font-size: 14px; }
          .pr-meta-right { display: none; }
          .pr-title { font-size: 14px; }
        }
        @media (prefers-reduced-motion: reduce) { .pr-title { transition: none; } }
      `}</style>
    </>
  );
}

/* ── Main ─────────────────────────────────────────────────── */

export default function WritingList({ posts }: { posts: PostMeta[] }) {
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category))).sort();
    return ["All", ...cats];
  }, [posts]);

  const filtered = useMemo(
    () => active === "All" ? posts : posts.filter((p) => p.category === active),
    [posts, active]
  );

  return (
    <div className="wl">
      <div className="wl-filters" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <FilterPill key={cat} label={cat} active={active === cat} onClick={() => setActive(cat)} />
        ))}
      </div>

      <div className="wl-rule" aria-hidden="true" />

      <div role="list">
        {filtered.length === 0 ? (
          <p className="wl-empty">No posts in this category yet.</p>
        ) : (
          filtered.map((post, i) => (
            <div key={post.slug} role="listitem">
              <PostRow post={post} isLast={i === filtered.length - 1} />
            </div>
          ))
        )}
      </div>

      {filtered.length > 0 && <div className="wl-rule" aria-hidden="true" />}

      <style>{`
        .wl-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
        .wl-rule { height: 1px; background: var(--color-border-subtle,#1F1F1F); }
        .wl-empty {
          font-family: var(--font-geist-mono,"Geist Mono",monospace);
          font-size: 13px; color: var(--color-text-muted,#444444); padding: 40px 0;
        }
      `}</style>
    </div>
  );
}

