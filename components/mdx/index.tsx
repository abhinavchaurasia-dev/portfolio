import CodeBlock from "./CodeBlock";
import Callout from "./Callout";
import ADRBlock from "@/components/work/ADRBlock";
import type { MDXComponents } from "mdx/types";

/* ============================================================
   FILE: components/mdx/index.tsx

   Complete MDX component map.
   Every HTML element MDX can produce is overridden here
   so prose styling is 100% controlled — no Tailwind prose
   class or global stylesheet needed.
   ============================================================ */

export const mdxComponents: MDXComponents = {

  /* ── Custom JSX components ── */
  CodeBlock,
  Callout,
  ADRBlock,

  /* ════════════════════════════════════
     HEADINGS
  ════════════════════════════════════ */

  h1: ({ children }) => (
    <h1 className="mdx-h1">{children}</h1>
  ),

  h2: ({ children }) => (
    <h2 className="mdx-h2">{children}</h2>
  ),

  h3: ({ children }) => (
    <h3 className="mdx-h3">{children}</h3>
  ),

  h4: ({ children }) => (
    <h4 className="mdx-h4">{children}</h4>
  ),

  /* ════════════════════════════════════
     BODY TEXT
  ════════════════════════════════════ */

  p: ({ children }) => (
    <p className="mdx-p">{children}</p>
  ),

  strong: ({ children }) => (
    <strong className="mdx-strong">{children}</strong>
  ),

  em: ({ children }) => (
    <em className="mdx-em">{children}</em>
  ),

  /* ════════════════════════════════════
     LINKS
  ════════════════════════════════════ */

  a: ({ href, children }) => (
    <a
      href={href}
      className="mdx-a"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),

  /* ════════════════════════════════════
     BLOCKQUOTE
  ════════════════════════════════════ */

  blockquote: ({ children }) => (
    <blockquote className="mdx-blockquote">
      {children}
    </blockquote>
  ),

  /* ════════════════════════════════════
     CODE
  ════════════════════════════════════ */

  code: ({ children, className }) => {
    const language = className?.replace("language-", "");
    if (language) {
      return (
        <CodeBlock language={language}>
          {String(children)}
        </CodeBlock>
      );
    }
    return <code className="mdx-code-inline">{children}</code>;
  },

  /* Suppress default <pre> — CodeBlock renders its own */
  pre: ({ children }) => <>{children}</>,

  /* ════════════════════════════════════
     LISTS
  ════════════════════════════════════ */

  ul: ({ children }) => (
    <ul className="mdx-ul">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="mdx-ol">{children}</ol>
  ),

  li: ({ children }) => (
    <li className="mdx-li">{children}</li>
  ),

  /* ════════════════════════════════════
     IMAGES
  ════════════════════════════════════ */

  img: ({ src, alt }) => (
    <span className="mdx-img-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt ?? ""}
        className="mdx-img"
        loading="lazy"
        decoding="async"
      />
      {alt && <span className="mdx-img-caption">{alt}</span>}
    </span>
  ),

  /* ════════════════════════════════════
     TABLE
  ════════════════════════════════════ */

  table: ({ children }) => (
    <div className="mdx-table-wrap">
      <table className="mdx-table">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="mdx-thead">{children}</thead>
  ),

  tbody: ({ children }) => (
    <tbody>{children}</tbody>
  ),

  tr: ({ children }) => (
    <tr className="mdx-tr">{children}</tr>
  ),

  th: ({ children }) => (
    <th className="mdx-th">{children}</th>
  ),

  td: ({ children }) => (
    <td className="mdx-td">{children}</td>
  ),

  /* ════════════════════════════════════
     MISC
  ════════════════════════════════════ */

  hr: () => <hr className="mdx-hr" />,
};

/* ============================================================
   GLOBAL PROSE STYLES
   Injected once via a style tag in a wrapper component.
   These are referenced by the classNames above.
   ============================================================ */

export function ProseStyles() {
  return (
    <style>{`
      /* ── Headings ── */
      .mdx-h1 {
        font-family: var(--font-geist, "Geist", sans-serif);
        font-size: 26px; font-weight: 700;
        color: var(--color-text-primary, #F0F0F0);
        margin: 48px 0 16px; line-height: 1.25;
        scroll-margin-top: 80px;
      }
      .mdx-h2 {
        font-family: var(--font-geist, "Geist", sans-serif);
        font-size: 20px; font-weight: 600;
        color: var(--color-text-primary, #F0F0F0);
        margin: 48px 0 14px; line-height: 1.3;
        scroll-margin-top: 80px;
      }
      .mdx-h3 {
        font-family: var(--font-geist, "Geist", sans-serif);
        font-size: 16px; font-weight: 600;
        color: var(--color-text-primary, #F0F0F0);
        margin: 32px 0 10px; line-height: 1.3;
        scroll-margin-top: 80px;
      }
      .mdx-h4 {
        font-family: var(--font-geist, "Geist", sans-serif);
        font-size: 14px; font-weight: 600;
        color: var(--color-text-primary, #F0F0F0);
        margin: 24px 0 8px; line-height: 1.3;
      }

      /* ── Body ── */
      .mdx-p {
        font-family: var(--font-geist, "Geist", sans-serif);
        font-size: 15px; color: var(--color-text-secondary, #888888);
        line-height: 1.85; margin: 0 0 20px;
      }
      .mdx-strong {
        font-weight: 600;
        color: var(--color-text-primary, #F0F0F0);
      }
      .mdx-em { font-style: italic; }

      /* ── Links ── */
      .mdx-a {
        color: var(--color-text-primary, #F0F0F0);
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-color: var(--color-border-strong, #3A3A3A);
        transition: text-decoration-color 150ms ease;
      }
      .mdx-a:hover {
        text-decoration-color: var(--color-accent, #4AFF91);
      }

      /* ── Blockquote ── */
      .mdx-blockquote {
        border-left: 3px solid var(--color-border-strong, #3A3A3A);
        background: var(--color-bg-elevated, #0F0F0F);
        border-radius: 0 6px 6px 0;
        padding: 14px 20px;
        margin: 28px 0;
      }
      .mdx-blockquote p {
        font-family: var(--font-geist, "Geist", sans-serif);
        font-size: 14px;
        color: var(--color-text-secondary, #888888);
        line-height: 1.75;
        margin: 0;
        font-style: italic;
      }
      .mdx-blockquote p + p { margin-top: 8px; }
      .mdx-blockquote strong {
        font-weight: 600;
        color: var(--color-text-primary, #F0F0F0);
        font-style: normal;
      }

      /* ── Inline code ── */
      .mdx-code-inline {
        font-family: var(--font-geist-mono, "Geist Mono", monospace);
        font-size: 12px;
        color: var(--color-text-secondary, #888888);
        background: var(--color-bg-inset, #1A1A1A);
        border: 1px solid var(--color-border-subtle, #1F1F1F);
        border-radius: 3px;
        padding: 1px 5px;
      }

      /* ── Lists ── */
      .mdx-ul { list-style: none; margin: 0 0 20px; padding: 0; }
      .mdx-ol { list-style: decimal; margin: 0 0 20px; padding-left: 20px; }
      .mdx-li {
        font-family: var(--font-geist, "Geist", sans-serif);
        font-size: 15px; color: var(--color-text-secondary, #888888);
        line-height: 1.75; margin-bottom: 8px;
        padding-left: 16px; position: relative;
      }
      .mdx-ul .mdx-li::before {
        content: "—";
        position: absolute; left: 0;
        color: var(--color-text-muted, #444444);
        font-family: var(--font-geist-mono, "Geist Mono", monospace);
      }
      .mdx-ol .mdx-li { padding-left: 4px; }

      /* ── Images ── */
      .mdx-img-wrap {
        display: block;
        margin: 32px 0;
      }
      .mdx-img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 8px;
        border: 1px solid var(--color-border-subtle, #1F1F1F);
        background: var(--color-bg-inset, #1A1A1A);
      }
      .mdx-img-caption {
        display: block;
        font-family: var(--font-geist-mono, "Geist Mono", monospace);
        font-size: 11px;
        color: var(--color-text-muted, #444444);
        text-align: center;
        margin-top: 8px;
        line-height: 1.5;
      }

      /* ── Table ── */
      .mdx-table-wrap {
        overflow-x: auto;
        margin: 28px 0;
        border: 1px solid var(--color-border-subtle, #1F1F1F);
        border-radius: 6px;
      }
      .mdx-table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--font-geist, "Geist", sans-serif);
        font-size: 13px;
      }
      .mdx-thead { background: var(--color-bg-elevated, #0F0F0F); }
      .mdx-th {
        text-align: left;
        padding: 10px 16px;
        font-weight: 600;
        color: var(--color-text-primary, #F0F0F0);
        border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
        white-space: nowrap;
        font-size: 12px;
      }
      .mdx-td {
        padding: 10px 16px;
        color: var(--color-text-secondary, #888888);
        border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
        line-height: 1.6;
      }
      .mdx-tr:last-child .mdx-td { border-bottom: none; }
      .mdx-tr:hover .mdx-td { background: var(--color-bg-elevated, #0F0F0F); }

      /* ── HR ── */
      .mdx-hr {
        border: none; height: 1px;
        background: var(--color-border-subtle, #1F1F1F);
        margin: 40px 0;
      }

      @media (prefers-reduced-motion: reduce) {
        .mdx-a { transition: none; }
      }
    `}</style>
  );
}

