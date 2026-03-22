"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { resumeConfig } from "../../lib/resume";

const PDF_PATH = "/AbhinavChaurasia_Resume.pdf";

export default function ResumePDFViewer() {
  const [showFallback, setShowFallback] = useState(false);

  return (
    <div className="rp-card">
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

      <iframe
        src={resumeConfig.url}
        className="rp-frame"
        title="Abhinav Chaurasia Resume Preview"
        loading="lazy"
        onLoad={() => setShowFallback(false)}
        onError={() => setShowFallback(true)}
      />

      {showFallback ? (
        <div className="rp-fallback" role="status" aria-live="polite">
          <a
            href={PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="rp-fallback-link"
          >
            Open resume
          </a>
        </div>
      ) : null}

      <style>{`
        .rp-frame {
          display: block;
          width: 100%;
          height: clamp(900px, 86vh, 1160px);
          border: none;
          background: #111;
        }
        @media (max-width: 1024px) {
          .rp-frame {
            height: clamp(680px, 80vh, 960px);
          }
        }
        .rp-fallback {
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          padding: 10px 12px;
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
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
          .rp-frame {
            height: clamp(380px, 55vh, 520px);
          }
          .rp-fallback-link {
            width: 100%;
            text-align: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .rp-fallback-link {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
