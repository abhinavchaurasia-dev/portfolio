"use client";

import { ExternalLink } from "lucide-react";

const PDF_PATH = "/resume.pdf";

export default function ResumePDFViewer() {
  return (
    <div className="rp-card">
      {/* Open in new tab */}
      <a
        href={PDF_PATH}
        target="_blank"
        rel="noopener noreferrer"
        className="rp-external-btn"
        aria-label="Open resume in new tab"
        title="Open in new tab"
      >
        <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
      </a>

      {/* Iframe is more reliable than <object> on mobile browsers. */}
      <iframe
        src={`${PDF_PATH}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
        className="rp-frame"
        title="Abhinav Chaurasia Resume"
      />

      <div className="rp-fallback" role="status" aria-live="polite">
        <p className="rp-fallback-text">
          If the inline preview does not load on your browser, open the resume directly.
        </p>
        <div className="rp-fallback-actions">
          <a
            href={PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="rp-fallback-link"
          >
            Open resume
          </a>
          <a href={PDF_PATH} download="resume.pdf" className="rp-fallback-link">
            Download PDF
          </a>
        </div>
      </div>

      <style>{`
        .rp-frame {
          display: block;
          width: 100%;
          height: 700px;
          border: none;
        }
        .rp-fallback {
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }
        .rp-fallback-text {
          margin: 0;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
        }
        .rp-fallback-actions {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .rp-fallback-link {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-primary, #F0F0F0);
          text-decoration: none;
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 6px;
          padding: 6px 10px;
          transition: border-color 150ms ease;
        }
        .rp-fallback-link:hover {
          border-color: var(--color-border-strong, #3A3A3A);
        }
        @media (max-width: 767px) {
          .rp-frame { height: 65vh; min-height: 420px; }
          .rp-fallback {
            flex-direction: column;
            align-items: stretch;
          }
          .rp-fallback-actions {
            width: 100%;
          }
          .rp-fallback-link {
            flex: 1;
            text-align: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rp-fallback-link { transition: none; }
        }
      `}</style>
    </div>
  );
}