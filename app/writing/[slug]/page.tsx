import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import {
  getAllSlugs,
  getAllPosts,
  getPost,
  formatDate,
  parseLinksSection,
} from "@/lib/mdx";
import PageWrapper from "@/components/layout/PageWrapper";
import { mdxComponents, ProseStyles } from "@/components/mdx";
import PostClient from "./PostClient";

/* ============================================================
   STATIC PARAMS + METADATA
   ============================================================ */

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { meta } = getPost(slug);
    return { title: meta.title, description: meta.excerpt };
  } catch {
    return { title: "Post not found" };
  }
}

/* ============================================================
   SOCIAL LINKS — only platforms Abhinav actively uses
   ============================================================ */

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/abhinavchaurasia-dev/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/abhinavchaurasia-dev",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://x.com/abhinavc_dev",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.636L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@AbhinavChaurasia22",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/abhinavc_dev/",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: "Medium",
    href: "https://medium.com/@abhinavchaurasia-dev",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
  {
    label: "Hashnode",
    href: "https://hashnode.com/@abhinavchaurasia-dev",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.75 20.5 7.875v8.25L12 21.25 3.5 16.125v-8.25L12 2.75z" />
        <path d="M12 9v6" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:abhinavc037@gmail.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
];

/* ============================================================
   POST PAGE
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

  const allPosts   = getAllPosts();
  const currentIdx = allPosts.findIndex((p) => p.slug === slug);
  const related    = allPosts
    .filter((p) => p.slug !== slug && p.category === meta.category)
    .slice(0, 2);
  const prevPost = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1] : null;
  const nextPost = currentIdx > 0 ? allPosts[currentIdx - 1] : null;
  const links    = parseLinksSection(content);
  const postUrl  = `https://abhinavchaurasia.in/writing/${slug}`;

  return (
    <PageWrapper>
      <PostClient title={meta.title} slug={slug} postUrl={postUrl} content={content} />

      <ProseStyles />

      <article className="post">

        {/* ── Top bar ── */}
        <div className="post-topbar">
          <Link href="/writing" className="post-back">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M8.5 2L3.5 7L8.5 12" stroke="currentColor" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Blogs
          </Link>
          <div id="post-share-anchor" />
        </div>

        {/* ── Header ── */}
        <div className="post-cat-row">
          <span className="post-cat">{meta.category}</span>
        </div>

        <h1 className="post-title">{meta.title}</h1>

        {meta.excerpt && (
          <p className="post-subtitle">{meta.excerpt}</p>
        )}

        <div className="post-meta">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1 6h14" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          <span className="post-sep" aria-hidden="true">·</span>
          <span>{meta.readingTime}</span>
        </div>

        <div className="post-divider" role="separator" />

        {/* ── MDX body ── */}
        <div className="post-prose" id="post-prose">
          <MDXRemote source={content} components={mdxComponents} />
        </div>

        {/* ══════════════════════════════════════════
            FOOTER — exact Ram order:
            1. Connect (mono label + icon row)
            2. divider
            3. Links / Resources (if any)
            4. divider (if links exist)
            5. Related posts (if any)
            6. divider (if related exist)
            7. Prev / Next
            8. View All Blogs
        ══════════════════════════════════════════ */}
        <footer className="post-footer">

          {/* 1 ── Connect ── */}
          <div className="pf-connect">
            <p className="pf-eyebrow">Connect with me</p>
            <div className="pf-socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={s.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="pf-social-btn"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="pf-rule" />

          {/* 2 ── Links / Resources ── */}
          {links.length > 0 && (
            <>
              <div className="pf-links">
                <p className="pf-eyebrow">Links / Resources</p>
                <ul className="pf-link-list">
                  {links.map((link, i) => (
                    <li key={link.url} className="pf-link-item">
                      <span className="pf-link-num">{String(i + 1).padStart(2, "0")}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pf-link-anchor"
                      >
                        {link.label}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pf-rule" />
            </>
          )}

          {/* 3 ── Related posts ── */}
          {related.length > 0 && (
            <>
              <div className="pf-related">
                <p className="pf-eyebrow">Related posts</p>
                <div className="pf-related-list">
                  {related.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/writing/${p.slug}`}
                      className="pf-related-row"
                    >
                      <div
                        className="pf-related-thumb"
                        style={{
                          background: p.coverGradient ?? "var(--color-bg-inset,#1A1A1A)",
                        }}
                        aria-hidden="true"
                      >
                        <span className="pf-related-initial">
                          {p.category.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="pf-related-body">
                        <span className="pf-related-cat">{p.category}</span>
                        <span className="pf-related-title">{p.title}</span>
                        <span className="pf-related-date">{formatDate(p.date)}</span>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                        aria-hidden="true" className="pf-related-arrow"
                      >
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor"
                          strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pf-rule" />
            </>
          )}

          {/* 4 ── Prev / Next ── */}
          {(prevPost || nextPost) && (
            <>
              <div className="pf-prevnext">
                <div className="pf-pn-slot">
                  {prevPost && (
                    <Link href={`/writing/${prevPost.slug}`} className="pf-pn-link">
                      <span className="pf-pn-dir">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                          <path d="M7 2L4 5.5L7 9" stroke="currentColor" strokeWidth="1.3"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Previous
                      </span>
                      <span className="pf-pn-title">{prevPost.title}</span>
                    </Link>
                  )}
                </div>
                <div className="pf-pn-slot pf-pn-slot--r">
                  {nextPost && (
                    <Link href={`/writing/${nextPost.slug}`} className="pf-pn-link pf-pn-link--r">
                      <span className="pf-pn-dir pf-pn-dir--r">
                        Next
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                          <path d="M4 2L7 5.5L4 9" stroke="currentColor" strokeWidth="1.3"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="pf-pn-title pf-pn-title--r">{nextPost.title}</span>
                    </Link>
                  )}
                </div>
              </div>
              <div className="pf-rule" />
            </>
          )}

          {/* 5 ── View All Blogs ── */}
          <div className="pf-viewall">
            <Link href="/writing" className="pf-viewall-btn">
              View all blogs
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor"
                  strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

        </footer>
      </article>

      <style>{`
        /* ── Layout ── */
        .post {
          padding-top: 48px;
          padding-bottom: 96px;
          max-width: 680px;
        }

        /* ── Top bar ── */
        .post-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .post-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          transition: color 150ms ease;
        }
        .post-back:hover { color: var(--color-text-primary, #F0F0F0); }

        /* ── Category ── */
        .post-cat-row { margin-bottom: 12px; }
        .post-cat {
          display: inline-block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          padding: 2px 7px;
          border-radius: 3px;
        }

        /* ── Title ── */
        .post-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 28px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.25;
          margin: 0 0 12px;
        }

        /* ── Subtitle ── */
        .post-subtitle {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.65;
          margin: 0 0 20px;
        }

        /* ── Meta row ── */
        .post-meta {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          margin-bottom: 28px;
        }
        .post-meta svg { color: var(--color-text-muted, #444444); flex-shrink: 0; }
        .post-sep { opacity: 0.4; }

        /* ── Divider ── */
        .post-divider {
          height: 1px;
          background: var(--color-border-subtle, #1F1F1F);
          margin-bottom: 40px;
        }

        /* ════════════════════════════════
           PROSE
        ════════════════════════════════ */
        .post-prose { max-width: 65ch; }

        .post-prose p, .mdx-p {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.85;
          margin: 0 0 20px;
        }
        .mdx-h2 {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 20px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          margin: 48px 0 14px;
          line-height: 1.3;
          scroll-margin-top: 80px;
        }
        .mdx-h3 {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 16px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          margin: 32px 0 10px;
          line-height: 1.3;
          scroll-margin-top: 80px;
        }
        .mdx-a {
          color: var(--color-text-primary, #F0F0F0);
          text-underline-offset: 3px;
          text-decoration-color: var(--color-border-strong, #3A3A3A);
          transition: text-decoration-color 150ms ease;
        }
        .mdx-a:hover { text-decoration-color: var(--color-accent, #4AFF91); }
        .mdx-blockquote {
          border-left: 2px solid var(--color-border-strong, #3A3A3A);
          padding: 2px 0 2px 16px;
          margin: 24px 0;
          font-style: italic;
          color: var(--color-text-muted, #444444);
        }
        .mdx-code-inline {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-secondary, #888888);
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 3px;
          padding: 1px 5px;
        }
        .mdx-ul { list-style: none; margin: 0 0 20px; padding: 0; }
        .mdx-ol { list-style: decimal; margin: 0 0 20px; padding-left: 20px; }
        .mdx-li {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
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

        /* ════════════════════════════════
           FOOTER
        ════════════════════════════════ */
        .post-footer {
          margin-top: 80px;
          max-width: 65ch;
        }

        /* Shared rule */
        .pf-rule {
          height: 1px;
          background: var(--color-border-subtle, #1F1F1F);
          margin: 40px 0;
        }

        /* Shared eyebrow label */
        .pf-eyebrow {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted, #444444);
          margin: 0 0 16px;
        }

        /* ── 1. Connect ── */
        .pf-connect {}

        .pf-socials {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pf-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          transition: border-color 150ms ease, color 150ms ease,
                      background 150ms ease;
        }
        .pf-social-btn:hover {
          border-color: var(--color-border-strong, #3A3A3A);
          color: var(--color-text-primary, #F0F0F0);
          background: var(--color-bg-elevated, #0F0F0F);
        }

        /* ── 2. Links ── */
        .pf-link-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .pf-link-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
        }
        .pf-link-item:first-child {
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
        }

        .pf-link-num {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
          min-width: 20px;
        }

        .pf-link-anchor {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          transition: color 150ms ease;
        }
        .pf-link-anchor:hover { color: var(--color-text-primary, #F0F0F0); }
        .pf-link-anchor svg { flex-shrink: 0; opacity: 0.5; }

        /* ── 3. Related ── */
        .pf-related-list {
          display: flex;
          flex-direction: column;
        }

        .pf-related-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
          text-decoration: none;
        }
        .pf-related-row:first-child {
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
        }
        .pf-related-row:hover .pf-related-title {
          color: var(--color-accent, #4AFF91);
        }
        .pf-related-row:hover .pf-related-arrow {
          color: var(--color-text-primary, #F0F0F0);
          transform: translateX(2px);
        }

        .pf-related-thumb {
          width: 56px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
        }
        .pf-related-initial {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.12);
          user-select: none;
        }

        .pf-related-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .pf-related-cat {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
        }
        .pf-related-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.35;
          transition: color 150ms ease;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pf-related-date {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          color: var(--color-text-muted, #444444);
        }
        .pf-related-arrow {
          flex-shrink: 0;
          color: var(--color-text-muted, #444444);
          transition: color 150ms ease, transform 150ms ease;
        }

        /* ── 4. Prev / Next ── */
        .pf-prevnext {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .pf-pn-slot { display: flex; }
        .pf-pn-slot--r { justify-content: flex-end; }

        .pf-pn-link {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-decoration: none;
          max-width: 240px;
        }
        .pf-pn-dir {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted, #444444);
          transition: color 150ms ease;
        }
        .pf-pn-dir--r { justify-content: flex-end; }
        .pf-pn-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary, #888888);
          line-height: 1.4;
          transition: color 150ms ease;
        }
        .pf-pn-title--r { text-align: right; }
        .pf-pn-link:hover .pf-pn-title,
        .pf-pn-link:hover .pf-pn-dir {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* ── 5. View All ── */
        .pf-viewall {
          display: flex;
          justify-content: center;
        }
        .pf-viewall-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary, #888888);
          background: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          padding: 10px 24px;
          text-decoration: none;
          transition: color 150ms ease, border-color 150ms ease;
        }
        .pf-viewall-btn:hover {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-default, #2A2A2A);
        }

        /* ── Responsive ── */
        @media (max-width: 560px) {
          .post-title { font-size: 22px; }
          .pf-prevnext { grid-template-columns: 1fr; }
          .pf-pn-slot--r { justify-content: flex-start; }
          .pf-pn-title--r { text-align: left; }
        }

        @media (prefers-reduced-motion: reduce) {
          .post-back, .mdx-a, .pf-pn-link, .pf-social-btn,
          .pf-viewall-btn, .pf-related-title, .pf-link-anchor,
          .pf-related-arrow { transition: none; }
        }
      `}</style>
    </PageWrapper>
  );
}