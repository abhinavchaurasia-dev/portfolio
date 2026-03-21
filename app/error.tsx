"use client";

import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  void error;

  return (
    <PageWrapper>
      <section className="err" aria-labelledby="error-heading">
        <h1 id="error-heading" className="err-heading">Something went wrong.</h1>
        <p className="err-subtext">An unexpected error occurred.</p>

        <button type="button" className="err-try" onClick={reset}>
          Try again
        </button>

        <Link href="/" className="err-home">
          {"<- Home"}
        </Link>
      </section>

      <style>{`
        .err {
          padding-top: 80px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .err-heading {
          margin: 0;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
          color: var(--color-text-primary, #F0F0F0);
        }

        .err-subtext {
          margin: 12px 0 0;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          line-height: 1.75;
          color: var(--color-text-secondary, #888888);
        }

        .err-try {
          margin-top: 32px;
          height: 38px;
          padding: 0 16px;
          border: none;
          border-radius: 6px;
          background: var(--color-accent, #4AFF91);
          color: var(--color-bg-base, #080808);
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          line-height: 1;
          transition: opacity 150ms ease;
        }

        .err-try:hover {
          opacity: 0.86;
        }

        .err-home {
          margin-top: 16px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary, #888888);
          transition: color 150ms ease;
        }

        .err-home:hover {
          color: var(--color-text-primary, #F0F0F0);
        }
      `}</style>
    </PageWrapper>
  );
}
