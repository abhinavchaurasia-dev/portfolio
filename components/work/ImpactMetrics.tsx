/* ============================================================
   IMPACT METRICS — bullet list of production outcomes.
   Server component.
   ============================================================ */

export interface ImpactMetricsProps {
  items: string[];
}

export default function ImpactMetrics({ items }: ImpactMetricsProps) {
  return (
    <div className="im-wrapper">
      <ul className="im-list" role="list">
        {items.map((item, i) => (
          <li key={i} className="im-item">
            <span className="im-dash" aria-hidden="true">—</span>
            <span className="im-text">{item}</span>
          </li>
        ))}
      </ul>

      <style>{`
        .im-wrapper {
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 6px;
          padding: 20px 24px;
        }

        .im-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .im-item {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .im-dash {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 13px;
          color: var(--color-accent, #4AFF91);
          flex-shrink: 0;
          line-height: 1.65;
        }

        .im-text {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.65;
        }
      `}</style>
    </div>
  );
}

