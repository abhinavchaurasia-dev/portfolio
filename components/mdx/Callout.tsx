import type { ReactNode } from "react";

/* ============================================================
   CALLOUT
   Usage in MDX:
   <Callout>Informational note.</Callout>
   <Callout variant="warning">Important caveat.</Callout>
   ============================================================ */

interface CalloutProps {
  children: ReactNode;
  variant?: "info" | "warning";
}

const CONFIG = {
  info: {
    border: "var(--color-accent, #4AFF91)",
    bg:     "#4AFF9112",
    label:  "note",
  },
  warning: {
    border: "#FFB84A",
    bg:     "#FFB84A12",
    label:  "warning",
  },
} as const;

export default function Callout({
  children,
  variant = "info",
}: CalloutProps) {
  const cfg = CONFIG[variant];

  return (
    <div
      className="callout"
      role={variant === "warning" ? "note" : "note"}
      aria-label={cfg.label}
      style={{
        background:  cfg.bg,
        borderColor: cfg.border,
      }}
    >
      <span className="callout-label" style={{ color: cfg.border }}>
        {cfg.label}
      </span>
      <div className="callout-body">{children}</div>

      <style>{`
        .callout {
          border: 1px solid;
          border-left-width: 3px;
          border-radius: 6px;
          padding: 12px 16px;
          margin: 24px 0;
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
          line-height: 1.65;
        }

        .callout-body p {
          margin: 0;
        }

        .callout-body p + p {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}