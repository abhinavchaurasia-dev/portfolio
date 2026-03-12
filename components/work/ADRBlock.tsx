/* ============================================================
   ADR BLOCK — Architecture Decision Records
   Server component — no interactivity needed.
   ============================================================ */

export interface Decision {
  title: string;
  because: string;
}

export interface ADRBlockProps {
  system: string;
  stack: string;
  decisions: Decision[];
}

export default function ADRBlock({ system, stack, decisions }: ADRBlockProps) {
  return (
    <div className="adr">
      {/* System line */}
      <div className="adr-system">
        <span className="adr-system-label">System:</span>
        <span className="adr-system-value">{system}</span>
      </div>

      {/* Stack diagram */}
      <div className="adr-stack">{stack}</div>

      {/* Dashed divider */}
      <div className="adr-divider" role="separator" />

      {/* Key decisions */}
      <div className="adr-decisions-label">Key decisions:</div>

      <ul className="adr-decisions" role="list">
        {decisions.map((d, i) => (
          <li key={i} className="adr-decision">
            <span className="adr-bullet" aria-hidden="true">•</span>
            <span className="adr-decision-body">
              <span className="adr-decision-title">{d.title}</span>
              <br />
              <span className="adr-decision-because">
                <span className="adr-because-word">because </span>
                {d.because}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <style>{`
        .adr {
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-strong, #333333);
          border-left: 3px solid var(--color-border-strong, #333333);
          border-radius: 6px;
          padding: 20px 24px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
        }

        /* System line */
        .adr-system {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 14px;
        }

        .adr-system-label {
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
        }

        .adr-system-value {
          font-size: 11px;
          color: var(--color-text-secondary, #888888);
        }

        /* Stack diagram */
        .adr-stack {
          font-size: 12px;
          color: var(--color-text-secondary, #888888);
          margin-bottom: 4px;
          line-height: 1.5;
        }

        /* Dashed divider */
        .adr-divider {
          height: 0;
          border-top: 1px dashed var(--color-border-subtle, #1F1F1F);
          /* border-dashed via shorthand: */ 
          border-style: dashed;
          border-color: var(--color-border-subtle, #1F1F1F);
          border-width: 1px 0 0 0;
          margin: 16px 0;
        }

        /* "Key decisions:" label */
        .adr-decisions-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
          margin-bottom: 12px;
        }

        /* Decision list */
        .adr-decisions {
          display: flex;
          flex-direction: column;
          gap: 10px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .adr-decision {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .adr-bullet {
          color: var(--color-text-muted, #444444);
          font-size: 12px;
          flex-shrink: 0;
          line-height: 1.6;
        }

        .adr-decision-body {
          font-size: 12px;
          line-height: 1.6;
        }

        .adr-decision-title {
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
        }

        .adr-decision-because {
          color: var(--color-text-secondary, #888888);
        }

        .adr-because-word {
          color: var(--color-text-muted, #444444);
        }
      `}</style>
    </div>
  );
}