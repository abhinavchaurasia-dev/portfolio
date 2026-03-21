import type { ReactNode } from "react";

/* ============================================================
   FILE: components/mdx/Callout.tsx
   ============================================================ */

interface CalloutProps {
  children: ReactNode;
  variant?: "info" | "warning" | "tip";
}

const CONFIG = {
  info: {
    border:    "var(--color-accent, #4AFF91)",
    bg:        "#4AFF9110",
    labelColor:"var(--color-accent, #4AFF91)",
    label:     "note",
  },
  tip: {
    border:    "#61AFEF",
    bg:        "#61AFEF10",
    labelColor:"#61AFEF",
    label:     "tip",
  },
  warning: {
    border:    "#FFB84A",
    bg:        "#FFB84A10",
    labelColor:"#FFB84A",
    label:     "warning",
  },
} as const;

export default function Callout({ children, variant = "info" }: CalloutProps) {
  const cfg = CONFIG[variant];

  return (
    <div
      className="callout"
      role="note"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <span className="callout-label" style={{ color: cfg.labelColor }}>
        {cfg.label}
      </span>
      <div className="callout-body">{children}</div>

      <style>{`
        .callout {
          border: 1px solid;
          border-left-width: 3px;
          border-radius: 6px;
          padding: 14px 18px;
          margin: 28px 0;
        }
        .callout-label {
          display: block;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
          user-select: none;
        }
        .callout-body {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.7;
        }
        .callout-body p  { margin: 0; }
        .callout-body p + p { margin-top: 8px; }
        .callout-body code {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          background: rgba(255,255,255,0.06);
          border-radius: 3px;
          padding: 1px 5px;
        }
      `}</style>
    </div>
  );
}

