"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Copy, Check, ArrowUpRight } from "lucide-react";

/* ============================================================
   CONTACT LINE
   Copy-to-clipboard with 2s success state.
   ============================================================ */

const EMAIL    = "abhinavc037@gmail.com";
const LINKEDIN = "https://linkedin.com/in/abhinavchaurasia-dev";
const REVERT_MS = 2000;

export default function ContactLine() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), REVERT_MS);
    } catch {
      /* Fallback for browsers without clipboard API */
      const el = document.createElement("textarea");
      el.value = EMAIL;
      el.style.position = "fixed";
      el.style.opacity  = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), REVERT_MS);
    }
  }, []);

  return (
    <section
      className="cl"
      aria-label="Contact"
    >
      <p className="cl-heading">Let&rsquo;s build something.</p>

      <div className="cl-actions">
        <button
          className="cl-btn-primary"
          onClick={handleCopy}
          aria-label={copied ? "Email copied" : `Copy email address: ${EMAIL}`}
          aria-live="polite"
        >
          {copied ? (
            <Check size={16} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Copy size={16} strokeWidth={1.5} aria-hidden="true" />
          )}
          {copied ? "Copied ✓" : "Copy email"}
        </button>

        <Link
          href={LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
          className="cl-btn-secondary"
          aria-label="Open LinkedIn profile (new tab)"
        >
          LinkedIn
          <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>

      <style>{`
        .cl {
          margin-top: 64px;
          margin-bottom: 96px;
          padding-top: 48px;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .cl-heading {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 19px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.3;
        }

        .cl-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* Primary button */
        .cl-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 16px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          background: transparent;
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 150ms ease;
        }

        .cl-btn-primary:hover {
          border-color: var(--color-accent-border, #4AFF9130);
        }

        /* Secondary button */
        .cl-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          height: 36px;
          padding: 0 12px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 400;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: color 150ms ease;
        }

        .cl-btn-secondary:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-btn-primary   { transition: none; }
          .cl-btn-secondary { transition: none; }
        }
      `}</style>
    </section>
  );
}

