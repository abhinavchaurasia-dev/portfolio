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

      {/* Native PDF embed — toolbar hidden, starts at top */}
      <object
        data={`${PDF_PATH}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
        type="application/pdf"
        className="rp-object"
        aria-label="Abhinav Chaurasia Resume"
      >
        <div className="rp-fallback">
          <p className="rp-fallback-text">PDF preview not available.</p>
          <a
            href={PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="rp-fallback-link"
          >
            Open resume →
          </a>
        </div>
      </object>

      <style>{`
        .rp-object {
          display: block;
          width: 100%;
          height: 700px;
          border: none;
        }
        .rp-fallback {
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .rp-fallback-text {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
        }
        .rp-fallback-link {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-primary, #F0F0F0);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        @media (max-width: 767px) {
          .rp-object { height: 500px; }
        }
      `}</style>
    </div>
  );
}