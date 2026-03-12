"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

/* ============================================================
   CODE BLOCK
   Used in MDX content as <CodeBlock language="js">...</CodeBlock>
   and also accepts children as a string from MDX code fences.
   Copy button reverts after 2s.
   ============================================================ */

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({
  children,
  language,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const code = typeof children === "string" ? children.trimEnd() : "";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="cb">
      {/* Header bar — only shown when language or filename is present */}
      {(language || filename) && (
        <div className="cb-header">
          <span className="cb-lang">{filename ?? language}</span>
          <button
            className="cb-copy"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy code"}
          >
            {copied ? (
              <Check size={13} strokeWidth={1.5} />
            ) : (
              <Copy size={13} strokeWidth={1.5} />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      )}

      {/* No header — floating copy button in corner */}
      {!language && !filename && (
        <button
          className="cb-copy cb-copy--floating"
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? (
            <Check size={13} strokeWidth={1.5} />
          ) : (
            <Copy size={13} strokeWidth={1.5} />
          )}
        </button>
      )}

      <pre className="cb-pre">
        <code className="cb-code">{code}</code>
      </pre>

      <style>{`
        .cb {
          position: relative;
          background-color: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 6px;
          margin: 24px 0;
          overflow: hidden;
        }

        /* Header bar */
        .cb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
        }

        .cb-lang {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted, #444444);
          user-select: none;
        }

        /* Copy button */
        .cb-copy {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 3px;
          transition: color 150ms ease;
        }

        .cb-copy:hover { color: var(--color-text-secondary, #888888); }

        /* Floating copy (no header) */
        .cb-copy--floating {
          position: absolute;
          top: 10px;
          right: 12px;
          z-index: 1;
          opacity: 0;
          transition: opacity 150ms ease, color 150ms ease;
        }

        .cb:hover .cb-copy--floating { opacity: 1; }

        /* Code */
        .cb-pre {
          margin: 0;
          padding: 16px 20px;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--color-border-default, #2A2A2A) transparent;
        }

        .cb-code {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.7;
          white-space: pre;
          background: transparent;
        }

        @media (prefers-reduced-motion: reduce) {
          .cb-copy, .cb-copy--floating { transition: none; }
        }
      `}</style>
    </div>
  );
}