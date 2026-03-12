import CodeBlock from "./CodeBlock";
import Callout from "./Callout";
import ADRBlock from "@/components/work/ADRBlock";
import type { MDXComponents } from "mdx/types";

/* ============================================================
   MDX COMPONENT MAP
   Passed to <MDXRemote components={mdxComponents} />
   
   HTML element overrides give every MDX post the correct
   prose styling without wrapping everything in a .prose class.
   ============================================================ */

export const mdxComponents: MDXComponents = {
  /* ── Custom components (used as JSX in MDX files) ── */
  CodeBlock,
  Callout,
  ADRBlock,

  /* ── HTML element overrides ── */

  h2: ({ children }) => (
    <h2 className="mdx-h2">{children}</h2>
  ),

  h3: ({ children }) => (
    <h3 className="mdx-h3">{children}</h3>
  ),

  p: ({ children }) => (
    <p className="mdx-p">{children}</p>
  ),

  a: ({ href, children }) => (
    <a href={href} className="mdx-a" target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="mdx-blockquote">{children}</blockquote>
  ),

  code: ({ children, className }) => {
    // Fenced code block: className = "language-js" etc.
    const language = className?.replace("language-", "");
    if (language) {
      return (
        <CodeBlock language={language}>
          {String(children)}
        </CodeBlock>
      );
    }
    // Inline code
    return <code className="mdx-code-inline">{children}</code>;
  },

  // pre wraps code blocks from rehype — suppress default wrapper
  // since CodeBlock handles its own container
  pre: ({ children }) => <>{children}</>,

  ul: ({ children }) => (
    <ul className="mdx-ul">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="mdx-ol">{children}</ol>
  ),

  li: ({ children }) => (
    <li className="mdx-li">{children}</li>
  ),

  hr: () => <hr className="mdx-hr" />,

  strong: ({ children }) => (
    <strong className="mdx-strong">{children}</strong>
  ),
};