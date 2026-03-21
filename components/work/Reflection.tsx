import type { ReactNode } from "react";

/* ============================================================
   REFLECTION BLOCK
   "What I'd do differently" — the maturity signal.
   Server component.
   ============================================================ */

export interface ReflectionProps {
  children: ReactNode;
}

export default function Reflection({ children }: ReflectionProps) {
  return (
    <div className="rf-wrapper">
      {/* Label sits above the box */}
      <div className="rf-label" aria-hidden="true">
        what i&rsquo;d do differently
      </div>

      <div className="rf-box" role="note" aria-label="Reflection: what I'd do differently">
        {children}
      </div>

      <style>{`
        .rf-wrapper {
          margin-bottom: 48px;
        }

        /* Label */
        .rf-label {
          display: inline-block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted, #444444);
          border-left: 2px solid var(--color-border-strong, #333333);
          padding-left: 8px;
          margin-bottom: 12px;
        }

        /* Content box */
        .rf-box {
          background-color: #4AFF9115;
          border: 1px solid #4AFF9130;
          border-radius: 6px;
          padding: 16px 20px;
        }

        /* Prose inside Reflection */
        .rf-box p {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.7;
          margin: 0;
        }

        .rf-box p + p {
          margin-top: 14px;
        }
      `}</style>
    </div>
  );
}

