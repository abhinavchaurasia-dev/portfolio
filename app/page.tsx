import Hero from "@/components/home/Hero";
import ProjectCard from "@/components/work/ProjectCard";
import PageWrapper from "@/components/layout/PageWrapper";
import ContactLine from "@/components/home/ContactLine";
import WritingPreview from "@/components/home/WritingPreview";
import SectionReveal from "@/components/shared/AnimatedReveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ============================================================
   HOME PAGE — Server Component
   Interactive islands are isolated to client components:
     ContactLine  — copy-to-clipboard state
     WritingPreview — hover states (could be CSS-only but
                      isolated for future MDX data fetching)
   ============================================================ */

export default function HomePage() {
  return (
    <PageWrapper>

      {/* ── SECTION 1: Hero ── */}
      <Hero />

      {/* ── SECTION 2: Selected Work ── */}
      <SectionReveal>
        <section aria-labelledby="work-heading" style={{ marginTop: "80px" }}>
          {/* Header row */}
          <div className="home-section-header">
            <span id="work-heading" className="home-section-label">
              Selected Work
            </span>
            <Link href="/work" className="home-section-link">
              View all
              <ArrowRight size={12} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>

          <div className="home-divider" role="separator" />

          {/* Project cards */}
          <div className="home-cards">
            <ProjectCard
              title="Trainee Management Portal"
              status="PRODUCTION"
              year="2025"
              type="Full-Stack · Node.js · Internal Tool"
              description="Full-stack portal replacing paper-based registration, attendance, and certificate generation at Northern Railway Workshop Training Center."
              architecture="Layered Node.js API (routes/controllers/services) · PostgreSQL · Automated PDF pipeline · React MUI"
              tags={["Node.js", "Express", "PostgreSQL", "React"]}
              caseStudyHref="/work/railway"
            />
            <ProjectCard
              title="PeerCampus"
              status="SHIPPED"
              year="2025"
              type="Full-Stack · AI Integration · Django"
              description="AI-assisted campus super-app: events, forums, lost-and-found with CLIP image matching, skills marketplace."
              architecture="Django REST (6 apps · 57 endpoints) · CLIP embeddings · GPT-4o-mini · JWT + Google OAuth"
              tags={["React", "Django", "PostgreSQL", "CLIP"]}
              caseStudyHref="/work/peercampus"
              liveHref="#"
            />
            <ProjectCard
              title="CivicBridge"
              status="SHIPPED"
              year="2025"
              type="Full-Stack · Gemini AI · Civic Tech"
              description="Complaint platform with AI-generated descriptions, GPS detection, and municipality performance leaderboard."
              architecture="Gemini AI integration · GPS + photo pipeline · Complaint lifecycle state machine"
              tags={["React", "Django", "Gemini AI", "GPS API"]}
              caseStudyHref="/work/civicbridge"
              liveHref="#"
            />
            <ProjectCard
              title="SentiGenix"
              status="SHIPPED"
              year="2025"
              type="Full-Stack · NLP · Sentiment Analysis"
              description="Sentiment analysis platform with VADER NLP classification and DeepSeek AI-guided text rewriting."
              architecture="VADER NLP pipeline · DeepSeek API integration · Real-time classification · Django"
              tags={["React", "Django", "VADER", "DeepSeek"]}
              caseStudyHref="/work/sentigenix"
              liveHref="#"
            />
          </div>
        </section>
      </SectionReveal>

      {/* ── SECTION 3: Engineering Note ── */}
      <SectionReveal delay={0.05}>
        <section
          aria-label="Engineering approach"
          style={{ marginTop: "64px", maxWidth: "560px" }}
        >
          <span className="home-section-label home-approach-label">
            approach
          </span>
          <p className="home-approach-p1">
            I document architecture decisions, not just implementations. Every
            project here includes the tradeoffs I considered, the alternatives
            I rejected, and what I&rsquo;d change if I rebuilt it.
          </p>
          <p className="home-approach-p2">
            That&rsquo;s what separates shipping code from engineering it.
          </p>
        </section>
      </SectionReveal>

      {/* ── SECTION 4: Writing Preview ── */}
      <SectionReveal delay={0.05}>
        <section aria-labelledby="writing-heading" style={{ marginTop: "64px" }}>
          <div className="home-section-header">
            <span id="writing-heading" className="home-section-label">
              Writing
            </span>
            <Link href="/writing" className="home-section-link">
              All posts
              <ArrowRight size={12} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-divider" role="separator" />
          <WritingPreview />
        </section>
      </SectionReveal>

      {/* ── SECTION 5: Contact ── */}
      <SectionReveal delay={0.05}>
        <ContactLine />
      </SectionReveal>

      {/* ── Page-scoped styles ── */}
      <style>{`
        /* Section header row */
        .home-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .home-section-label {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
        }

        .home-section-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          transition: color 150ms ease;
        }

        .home-section-link:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* Divider */
        .home-divider {
          height: 1px;
          background-color: var(--color-border-subtle, #1F1F1F);
          margin-bottom: 32px;
        }

        /* Cards stack */
        .home-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Engineering note */
        .home-approach-label {
          display: block;
          margin-bottom: 16px;
          letter-spacing: 0.1em;
        }

        .home-approach-p1 {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.75;
        }

        .home-approach-p2 {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          margin-top: 12px;
        }

        @media (prefers-reduced-motion: reduce) {
          .home-section-link { transition: none; }
        }
      `}</style>

    </PageWrapper>
  );
}