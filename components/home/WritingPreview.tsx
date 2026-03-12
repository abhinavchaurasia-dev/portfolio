"use client";

import Link from "next/link";

/* ============================================================
   WRITING PREVIEW
   Placeholder rows — will be replaced with real MDX data.
   Isolated as a client component for future data-fetching
   and hover state management.
   ============================================================ */

interface PostRow {
  title: string;
  date: string;
  href: string;
}

const PLACEHOLDER_POSTS: PostRow[] = [
  {
    title: "Why I used CLIP embeddings instead of text search",
    date:  "2025",
    href:  "/writing/clip-embeddings",
  },
  {
    title: "Building a layered REST API with Node.js",
    date:  "2025",
    href:  "/writing/layered-rest-api",
  },
  {
    title: "How Gemini AI generates complaint descriptions",
    date:  "2025",
    href:  "/writing/gemini-complaint-descriptions",
  },
];

export default function WritingPreview() {
  return (
    <nav aria-label="Recent posts">
      {PLACEHOLDER_POSTS.map((post, i) => (
        <Link key={post.href} href={post.href} className="wp-row">
          <span className="wp-title">{post.title}</span>
          <time className="wp-date" dateTime={post.date}>{post.date}</time>

          {i === PLACEHOLDER_POSTS.length - 1 ? null : (
            <span className="wp-border" aria-hidden="true" />
          )}
        </Link>
      ))}

      <style>{`
        .wp-row {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 48px;
          padding: 0 12px;
          margin: 0 -12px;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 150ms ease;
          gap: 16px;
        }

        .wp-row:hover {
          background-color: var(--color-bg-elevated, #0F0F0F);
        }

        .wp-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.4;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wp-date {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .wp-row { transition: none; }
        }
      `}</style>
    </nav>
  );
}