import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <section className="nf" aria-labelledby="nf-heading">
        <p className="nf-code">404</p>
        <h1 id="nf-heading" className="nf-heading">Page not found.</h1>
        <p className="nf-subtext">The page you&apos;re looking for doesn&apos;t exist.</p>

        <Link href="/" className="nf-home">
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          <span>Back to home</span>
        </Link>
      </section>

      <style>{`
        .nf {
          padding-top: 80px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .nf-code {
          margin: 0 0 16px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 13px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted, #444444);
        }

        .nf-heading {
          margin: 0;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 30px;
          font-weight: 700;
          line-height: 1.2;
          color: var(--color-text-primary, #F0F0F0);
        }

        .nf-subtext {
          margin: 12px 0 32px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          line-height: 1.75;
          color: var(--color-text-secondary, #888888);
        }

        .nf-home {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary, #888888);
          transition: color 150ms ease;
        }

        .nf-home:hover {
          color: var(--color-text-primary, #F0F0F0);
        }
      `}</style>
    </PageWrapper>
  );
}
