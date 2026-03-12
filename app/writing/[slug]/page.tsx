import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { getAllSlugs, getPost, formatDate } from "@/lib/mdx";
import PageWrapper from "@/components/layout/PageWrapper";
import { mdxComponents } from "@/components/mdx";

/* ============================================================
   STATIC PARAMS — pre-render all known slugs at build time
   ============================================================ */

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/* ============================================================
   METADATA — dynamic per post
   ============================================================ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getPost(slug);
    return {
      title: meta.title,
      description: meta.excerpt,
    };
  } catch {
    return { title: "Post not found" };
  }
}

/* ============================================================
   POST PAGE — Server Component
   MDXRemote (RSC version) compiles MDX server-side.
   ============================================================ */

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  const { meta, content } = post;

  return (
    <PageWrapper>
      <article className="post">

        {/* ── Back link ── */}
        <Link href="/writing" className="post-back">
          ← Writing
        </Link>

        {/* ── Category tag ── */}
        <span className="post-cat">{meta.category}</span>

        {/* ── Title ── */}
        <h1 className="post-title">{meta.title}</h1>

        {/* ── Meta row ── */}
        <div className="post-meta" aria-label="Post metadata">
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          <span className="post-meta-sep" aria-hidden="true">·</span>
          <span>{meta.readingTime}</span>
        </div>

        {/* ── Divider ── */}
        <div className="post-divider" role="separator" />

        {/* ── MDX content ── */}
        <div className="post-prose">
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {/* ── Post footer ── */}
        <footer className="post-footer">
          <p className="post-byline">Written by Abhinav Chaurasia</p>
          <div className="post-nav">
            <Link href="/writing" className="post-nav-link">
              ← All posts
            </Link>
          </div>
        </footer>

      </article>

      {/* ── Scoped prose styles ── */}
      <style>{`
        .post {
          padding-top: 64px;
          padding-bottom: 96px;
          max-width: 680px;
        }

        /* Back link */
        .post-back {
          display: inline-block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          margin-bottom: 32px;
          transition: color 150ms ease;
        }
        .post-back:hover { color: var(--color-text-primary, #F0F0F0); }

        /* Category tag */
        .post-cat {
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
          margin-bottom: 16px;
        }

        /* Title */
        .post-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 30px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.2;
          margin: 0 0 12px;
        }

        /* Meta row */
        .post-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          margin-bottom: 40px;
        }
        .post-meta-sep { opacity: 0.5; }

        /* Divider */
        .post-divider {
          height: 1px;
          background: var(--color-border-subtle, #1F1F1F);
          margin-bottom: 40px;
        }

        /* ── Prose content ── */
        .post-prose p,
        .mdx-p {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 16px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.8;
          margin: 0 0 20px;
        }

        .mdx-h2 {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 22px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          margin: 40px 0 16px;
          line-height: 1.3;
        }

        .mdx-h3 {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 18px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          margin: 32px 0 12px;
          line-height: 1.3;
        }

        .mdx-a {
          color: var(--color-text-primary, #F0F0F0);
          text-underline-offset: 3px;
          text-decoration-color: var(--color-border-strong, #333333);
          transition: text-decoration-color 150ms ease;
        }
        .mdx-a:hover {
          text-decoration-color: var(--color-accent, #4AFF91);
        }

        .mdx-blockquote {
          border-left: 2px solid var(--color-border-strong, #333333);
          padding-left: 16px;
          margin: 24px 0;
          font-style: italic;
          color: var(--color-text-muted, #444444);
        }

        .mdx-code-inline {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          background-color: var(--color-bg-inset, #1A1A1A);
          border-radius: 3px;
          padding: 2px 5px;
        }

        .mdx-ul {
          list-style: none;
          margin: 0 0 20px;
          padding: 0;
        }

        .mdx-ol {
          list-style: decimal;
          margin: 0 0 20px;
          padding-left: 20px;
        }

        .mdx-li {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 16px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.75;
          margin-bottom: 8px;
          padding-left: 16px;
          position: relative;
        }

        .mdx-ul .mdx-li::before {
          content: "—";
          position: absolute;
          left: 0;
          color: var(--color-text-muted, #444444);
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
        }

        .mdx-hr {
          border: none;
          height: 1px;
          background: var(--color-border-subtle, #1F1F1F);
          margin: 40px 0;
        }

        .mdx-strong {
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
        }

        /* ── Footer ── */
        .post-footer {
          margin-top: 64px;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          padding-top: 32px;
        }

        .post-byline {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          margin: 0 0 16px;
        }

        .post-nav { display: flex; justify-content: space-between; }

        .post-nav-link {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          text-decoration: none;
          transition: color 150ms ease;
        }
        .post-nav-link:hover { color: var(--color-accent, #4AFF91); }

        @media (prefers-reduced-motion: reduce) {
          .post-back, .mdx-a, .post-nav-link { transition: none; }
        }
      `}</style>
    </PageWrapper>
  );
}