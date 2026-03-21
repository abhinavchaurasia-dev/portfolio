"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";

/* ============================================================
   FILE: components/mdx/CodeBlock.tsx

   Syntax highlighting via highlight.js (loaded from CDN once).
   Token colours match the dark design system — no external
   theme import needed, overridden inline below.
   ============================================================ */

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
}

/* Load hljs once into window */
let hljsLoaded = false;
let hljsLoading = false;
const hljsCallbacks: Array<() => void> = [];

function loadHljs(cb: () => void) {
  if (hljsLoaded) { cb(); return; }
  hljsCallbacks.push(cb);
  if (hljsLoading) return;
  hljsLoading = true;

  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
  script.onload = () => {
    hljsLoaded = true;
    hljsLoading = false;
    hljsCallbacks.forEach((fn) => fn());
    hljsCallbacks.length = 0;
  };
  document.head.appendChild(script);
}

export default function CodeBlock({ children, language, filename }: CodeBlockProps) {
  const [copied, setCopied]       = useState(false);
  const [highlighted, setHighlighted] = useState<string>("");
  const codeRef = useRef<HTMLElement>(null);

  const raw = typeof children === "string" ? children.trimEnd() : "";
  const label = filename ?? language ?? "";

  /* Highlight after hljs loads */
  useEffect(() => {
    loadHljs(() => {
      const hljs = (window as any).hljs;
      if (!hljs) return;

      let result: string;
      if (language && hljs.getLanguage(language)) {
        result = hljs.highlight(raw, { language }).value;
      } else {
        result = hljs.highlightAuto(raw).value;
      }
      setHighlighted(result);
    });
  }, [raw, language]);

  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(raw); }
    catch {
      const el = document.createElement("textarea");
      el.value = raw;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [raw]);

  return (
    <div className="cb">
      {/* Header */}
      <div className="cb-header">
        <span className="cb-lang">{label || "code"}</span>
        <button
          className={`cb-copy-btn ${copied ? "cb-copy-btn--ok" : ""}`}
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
        >
          {copied ? <Check size={12} strokeWidth={1.5} /> : <Copy size={12} strokeWidth={1.5} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      {/* Code */}
      <pre className="cb-pre">
        <code
          ref={codeRef}
          className={`cb-code ${highlighted ? "cb-code--hl" : ""}`}
          dangerouslySetInnerHTML={highlighted ? { __html: highlighted } : undefined}
        >
          {!highlighted ? raw : undefined}
        </code>
      </pre>

      {/* Syntax token colours — mapped to design system */}
      <style>{`
        .cb {
          position: relative;
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          margin: 28px 0;
          overflow: hidden;
        }

        /* Header */
        .cb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
          background: var(--color-bg-overlay, #141414);
        }

        .cb-lang {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-text-muted, #444444);
          user-select: none;
        }

        .cb-copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px 6px;
          border-radius: 3px;
          transition: color 150ms ease;
        }
        .cb-copy-btn:hover { color: var(--color-text-secondary, #888888); }
        .cb-copy-btn--ok   { color: var(--color-accent, #4AFF91) !important; }

        /* Pre / code */
        .cb-pre {
          margin: 0;
          padding: 18px 20px;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--color-border-default, #2A2A2A) transparent;
        }
        .cb-pre::-webkit-scrollbar        { height: 4px; }
        .cb-pre::-webkit-scrollbar-thumb  { background: var(--color-border-default,#2A2A2A); border-radius:2px; }

        .cb-code {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12.5px;
          line-height: 1.75;
          white-space: pre;
          background: transparent;
          color: var(--color-text-secondary, #888888);
        }

        /* ── Highlight.js token overrides ──
           Mapped to design system colours.
           Base text:    #888888 (--text-secondary)
           Keywords:     #4AFF91 (accent)
           Strings:      #98C379 (soft green)
           Numbers:      #E5C07B (amber)
           Comments:     #444444 (--text-muted) italic
           Functions:    #61AFEF (blue)
           Builtins:     #C678DD (purple)
           Params/attrs: #ABB2BF
           Tags:         #E06C75 (red)
        ── */
        .cb-code--hl .hljs-keyword,
        .cb-code--hl .hljs-selector-tag,
        .cb-code--hl .hljs-built_in,
        .cb-code--hl .hljs-name          { color: #4AFF91; }

        .cb-code--hl .hljs-string,
        .cb-code--hl .hljs-attr          { color: #98C379; }

        .cb-code--hl .hljs-number,
        .cb-code--hl .hljs-literal       { color: #E5C07B; }

        .cb-code--hl .hljs-comment,
        .cb-code--hl .hljs-quote         { color: #444444; font-style: italic; }

        .cb-code--hl .hljs-title,
        .cb-code--hl .hljs-section,
        .cb-code--hl .hljs-function      { color: #61AFEF; }

        .cb-code--hl .hljs-variable,
        .cb-code--hl .hljs-template-variable { color: #E06C75; }

        .cb-code--hl .hljs-type,
        .cb-code--hl .hljs-class         { color: #C678DD; }

        .cb-code--hl .hljs-params,
        .cb-code--hl .hljs-meta          { color: #ABB2BF; }

        .cb-code--hl .hljs-symbol,
        .cb-code--hl .hljs-bullet        { color: #E5C07B; }

        .cb-code--hl .hljs-addition      { color: #98C379; background: #98c37920; }
        .cb-code--hl .hljs-deletion      { color: #E06C75; background: #e06c7520; }

        @media (prefers-reduced-motion: reduce) {
          .cb-copy-btn { transition: none; }
        }
      `}</style>
    </div>
  );
}

