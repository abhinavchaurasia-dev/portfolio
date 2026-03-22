import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import ResumePDFViewer from "@/components/resume/ResumePDFViewer";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume",
  description: "View and download Abhinav Chaurasia's professional resume.",
};

const PDF_PATH = "/AbhinavChaurasia_Resume.pdf";

export default function ResumePage() {
  return (
    <PageWrapper>
      <div className="rp">

        <div className="rp-header">
          <h1 className="rp-heading">Resume</h1>
          <p className="rp-sub">View and download my professional resume.</p>
        </div>

        <ResumePDFViewer />

        <div className="rp-actions">
          <a
            href={PDF_PATH}
            download="AbhinavChaurasia_Resume.pdf"
            className="rp-download-btn"
            aria-label="Download resume as PDF"
          >
            <Download size={15} strokeWidth={1.5} aria-hidden="true" />
            Download PDF
          </a>
        </div>

      </div>

      <style>{`
        .rp {
          padding-top: 80px;
          padding-bottom: 24px;
        }
        .rp-header { margin-bottom: 40px; }
        .rp-heading {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 30px; font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0 0 8px; line-height: 1.2;
        }
        .rp-sub {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          margin: 0;
        }
        /* PDF card styles consumed by ResumePDFViewer */
        .rp-card {
          position: relative;
          background: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .rp-external-btn {
          position: absolute; top: 12px; right: 12px; z-index: 2;
          display: flex; align-items: center; justify-content: center;
          width: 32px; height: 32px;
          background: var(--color-bg-overlay, #141414);
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 6px;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          transition: color 150ms ease, border-color 150ms ease;
        }
        .rp-external-btn:hover {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-strong, #3A3A3A);
        }
        /* Download */
        .rp-actions {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 40px;
        }
        .rp-download-btn {
          display: inline-flex; align-items: center; gap: 6px;
          height: 34px; padding: 0 14px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px; font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          background: transparent;
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 6px; text-decoration: none;
          transition: border-color 150ms ease; white-space: nowrap;
        }
        .rp-download-btn:hover { border-color: var(--color-border-strong, #3A3A3A); }
        @media (max-width: 767px) {
          .rp { padding-top: 48px; }
          .rp-heading { font-size: 24px; }
          .rp-actions { justify-content: stretch; }
          .rp-download-btn { flex: 1; justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rp-external-btn, .rp-download-btn { transition: none; }
        }
      `}</style>
    </PageWrapper>
  );
}