import type { Metadata } from "next";
import Image from "next/image";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionReveal from "@/components/shared/AnimatedReveal";
import ExperienceAccordion from "@/components/about/ExperienceAccordion";
import TechStackTable from "@/components/about/TechStackTable";
import Timeline from "@/components/about/Timeline";

/* ============================================================
   METADATA
   ============================================================ */

export const metadata: Metadata = {
  title: "About",
  description:
    "Final-year CSE student at University of Lucknow building full-stack systems with AI as an architectural component.",
};

/* ============================================================
   ABOUT PAGE — Server Component
   Only ExperienceAccordion is client-side (Framer Motion).
   ============================================================ */

export default function AboutPage() {
  return (
    <PageWrapper>
      <div className="ab">

        {/* ── Page header ── */}
        <SectionReveal>
          <h1 className="ab-heading">About</h1>
        </SectionReveal>

        {/* ── Photo ── */}
        <SectionReveal delay={0.02}>
          <div className="ab-photo-wrap" aria-hidden="true">
            <Image
              src="/abhinav.jpg"
              alt="Abhinav Chaurasia"
              width={72}
              height={72}
              className="ab-photo"
              priority
            />
          </div>
        </SectionReveal>

        {/* ── Bio block ── */}
        <SectionReveal delay={0.04}>
          <div className="ab-bio">
            <p className="ab-bio-p">
              I&rsquo;m a final-year CSE student at University of Lucknow (graduating
              2026), building full-stack systems that integrate AI as an architectural
              component — not a feature bolted on afterward.
            </p>
            <p className="ab-bio-p">
              My projects use CLIP embeddings, GPT-4o, Gemini, and VADER because those
              were the right tools for specific problems. I document the decisions,
              the tradeoffs, and what I&rsquo;d change.
            </p>
          </div>
        </SectionReveal>

        {/* ── Experience ── */}
        <SectionReveal delay={0.04}>
          <section aria-labelledby="exp-heading" className="ab-section">
            <div
              id="exp-heading"
              className="ab-section-label"
              aria-label="Experience section"
            >
              experience
            </div>
            <ExperienceAccordion />
          </section>
        </SectionReveal>

        {/* ── Tech stack ── */}
        <SectionReveal delay={0.04}>
          <section aria-labelledby="stack-heading" className="ab-section ab-section--stack">
            <div
              id="stack-heading"
              className="ab-section-label"
            >
              stack
            </div>
            <TechStackTable />
          </section>
        </SectionReveal>

        {/* ── Timeline ── */}
        <SectionReveal delay={0.04}>
          <section
            aria-labelledby="timeline-heading"
            className="ab-section ab-section--timeline"
            style={{ marginBottom: "96px" }}
          >
            <div
              id="timeline-heading"
              className="ab-section-label"
            >
              timeline
            </div>
            <Timeline />
          </section>
        </SectionReveal>

      </div>

      {/* ── Page-scoped styles ── */}
      <style>{`
        .ab {
          padding-top: 80px;
        }

        /* Page heading */
        .ab-heading {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 30px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0 0 32px;
          line-height: 1.2;
        }

        /* Photo */
        .ab-photo-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 2px solid var(--color-border-subtle, #1F1F1F);
          overflow: hidden;
          margin-bottom: 24px;
          flex-shrink: 0;
        }

        .ab-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          /* center top = anchor to top of image, crop from bottom.
             Keeps the face/head in frame regardless of photo aspect ratio. */
          object-position: center top;
          display: block;
          border-radius: 50%;
        }

        /* Bio */
        .ab-bio {
          max-width: 600px;
          margin-bottom: 40px;
        }

        .ab-bio-p {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.75;
          margin: 0;
        }

        .ab-bio-p + .ab-bio-p {
          margin-top: 16px;
        }

        /* Section wrapper */
        .ab-section {
          margin-top: 40px;
        }

        .ab-section--stack    { margin-top: 40px; }
        .ab-section--timeline { margin-top: 40px; }

        /* Section label — consistent with whole site */
        .ab-section-label {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
          margin-bottom: 16px;
          user-select: none;
        }

        /* Mobile */
        @media (max-width: 767px) {
          .ab { padding-top: 48px; }
          .ab-heading { font-size: 24px; margin-bottom: 24px; }
        }
      `}</style>
    </PageWrapper>
  );
}

