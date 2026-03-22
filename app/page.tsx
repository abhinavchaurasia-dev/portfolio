import Hero from "@/components/home/Hero";
import ProjectCard from "@/components/work/ProjectCard";
import PageWrapper from "@/components/layout/PageWrapper";
import ContactLine from "@/components/home/ContactLine";
import WritingPreview from "@/components/home/WritingPreview";
import SectionReveal from "@/components/shared/AnimatedReveal";
import CurrentlyInto from "@/components/shared/CurrentlyInto";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

/* ============================================================
   HOME PAGE — Server Component
   ============================================================ */

export default function HomePage() {
  return (
    <PageWrapper>
      {/* ── SECTION 1: Hero ── */}
      <Hero />

      {/* ── SECTION 2: Projects ── */}
      <SectionReveal>
        <section aria-labelledby="projects-heading" style={{ marginTop: "80px" }}>

          {/* "Featured" label — same as Ram */}
          <p className="home-featured-label">Featured</p>

          {/* Section header */}
          <div className="home-section-header">
            <h2 id="projects-heading" className="home-section-title">Projects</h2>
          </div>

          {/* 2-col card grid */}
          <div className="home-cards">
            <ProjectCard
              thumbnail="peercampus"
              title="PeerCampus"
              status="SHIPPED"
              description="AI-assisted campus super-app: events, forums, lost-and-found with CLIP image matching, skills marketplace."
              tags={["React", "Django", "PostgreSQL", "CLIP", "GPT-4o-mini"]}
              projectHref="/projects/peercampus"
              liveHref="https://peercampus.example.com"
              githubHref="https://github.com/abhinavchaurasia-dev/peercampus"
            />
            <ProjectCard
              thumbnail="civicbridge"
              title="CivicBridge"
              status="SHIPPED"
              description="Complaint platform with AI-generated descriptions, GPS detection, and municipality performance leaderboard."
              tags={["React", "Django", "Gemini AI", "GPS API"]}
              projectHref="/projects/civicbridge"
              liveHref="https://civicbridge.example.com"
              githubHref="https://github.com/abhinavchaurasia-dev/civicbridge"
            />
            <ProjectCard
              thumbnail="sentigenix"
              title="SentiGenix"
              status="SHIPPED"
              description="Sentiment analysis platform with VADER NLP classification and DeepSeek AI-guided text rewriting."
              tags={["React", "Django", "VADER", "DeepSeek", "Python"]}
              projectHref="/projects/sentigenix"
              liveHref="https://sentigenix.example.com"
              githubHref="https://github.com/abhinavchaurasia-dev/sentigenix"
            />
          </div>

          {/* Show all projects link — below grid, centered */}
          <div className="home-show-all">
            <Link href="/projects" className="home-show-all-link">
              Show all projects
              <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </SectionReveal>

      {/* ── SECTION 3: Experience ── */}
      <SectionReveal delay={0.05}>
        <section
          aria-labelledby="experience-heading"
          style={{ marginTop: "80px" }}
        >
          <p className="home-featured-label">Featured</p>

          <div className="home-section-header" style={{ marginBottom: "24px" }}>
            <h2 id="experience-heading" className="home-section-title">
              Work Experience
            </h2>
          </div>

          {/* Experience card */}
          <div className="exp-card">
            {/* Top row: logo + company info + date/location */}
            <div className="exp-top">
              <div className="exp-logo-wrap">
                <div className="exp-logo" aria-hidden="true">NR</div>
              </div>

              <div className="exp-meta">
                <div className="exp-meta-left">
                  <div className="exp-company-row">
                    <span className="exp-company">Northern Railway</span>
                    {/* Status badge */}
                    <span className="exp-badge exp-badge--done">Completed</span>
                  </div>
                  <span className="exp-role">Software Development Intern</span>
                </div>

                <div className="exp-meta-right">
                  <time className="exp-date">Jun 2025 – Aug 2025</time>
                  <span className="exp-location">
                    <MapPin size={11} aria-hidden="true" />
                    Lucknow, India (On-site)
                  </span>
                </div>
              </div>
            </div>

            {/* Tech pills */}
            <div className="exp-tech-row" aria-label="Technologies used">
              {["Node.js", "Express", "PostgreSQL", "React", "MUI"].map((t) => (
                <span key={t} className="exp-tech-pill">{t}</span>
              ))}
            </div>

            {/* Bullet points */}
            <ul className="exp-bullets">
              <li>Built the complete Trainee Management Portal replacing all paper-based workflows — registration, attendance tracking, and PDF certificate generation.</li>
              <li>Implemented a 5-state state machine for trainee lifecycle management across enrollment, active, completed, deferred, and cancelled states.</li>
              <li>Designed layered Node.js API architecture (routes → controllers → services) with PostgreSQL, serving 200+ concurrent trainees.</li>
            </ul>

            {/* Footer links */}
            <div className="exp-footer">
              <Link href="/work/railway" className="exp-footer-link">
                View Project →
              </Link>
            </div>
          </div>

          {/* Show all work link */}
          <div className="home-show-all">
            <Link href="/about#experience" className="home-show-all-link">
              Show all work experiences
              <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </SectionReveal>

      {/* ── SECTION 4: Engineering Note ── */}
      <SectionReveal delay={0.05}>
        <section
          aria-label="Engineering approach"
          style={{ marginTop: "64px" }}
        >
          <span className="home-mono-label home-approach-label">approach</span>
          <p className="home-approach-p1">
            I document architecture decisions, not just implementations. Every
            project here includes the tradeoffs I considered, the alternatives I
            rejected, and what I&rsquo;d change if I rebuilt it.
          </p>
          <p className="home-approach-p2">
            That&rsquo;s what separates shipping code from engineering it.
          </p>
        </section>
      </SectionReveal>

      {/* ── SECTION 5: Writing Preview ── */}
      <SectionReveal delay={0.05}>
        <section
          aria-labelledby="writing-heading"
          style={{ marginTop: "80px" }}
        >
          <p className="home-featured-label">Featured</p>
          <div className="home-section-header">
            <h2 id="writing-heading" className="home-section-title">Blogs</h2>
            <Link href="/writing" className="home-section-link">
              Show all blogs
              <ArrowRight size={12} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-divider" role="separator" />
          <WritingPreview />
        </section>
      </SectionReveal>

      {/* ── SECTION 6: Contact ── */}
      <SectionReveal delay={0.05}>
        <ContactLine />
      </SectionReveal>

      {/* ── SECTION 7: Currently Into ── */}
      <SectionReveal delay={0.05}>
        <section
          aria-label="Currently into"
          style={{ marginTop: "64px" }}
        >
          <CurrentlyInto />
        </section>
      </SectionReveal>

      {/* ── Page-scoped styles ── */}
      <style>{`

        /* ── "Featured" eyebrow label (Ram uses this above every section) ── */
        .home-featured-label {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted, #444444);
          margin: 0 0 6px 0;
        }

        /* ── Section title (h2) ── */
        .home-section-title {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 22px;
          font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0;
          line-height: 1.2;
        }

        /* ── Section header row ── */
        .home-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        /* ── Mono label (approach section) ── */
        .home-mono-label {
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
        .home-section-link:hover { color: var(--color-text-primary, #F0F0F0); }

        /* ── Cards grid ── */
        .home-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (max-width: 600px) {
          .home-cards { grid-template-columns: 1fr; }
        }

        /* ── Show all link ── */
        .home-show-all {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }

        .home-show-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 6px;
          padding: 8px 16px;
          transition: color 150ms ease, border-color 150ms ease;
        }
        .home-show-all-link:hover {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-default, #2A2A2A);
        }

        /* ── Divider ── */
        .home-divider {
          height: 1px;
          background: var(--color-border-subtle, #1F1F1F);
          margin-bottom: 0;
        }

        /* ── Experience card ── */
        .exp-card {
          background: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 12px;
          padding: 20px 24px;
          transition: border-color 150ms ease;
        }

        .exp-card:hover {
          border-color: var(--color-border-default, #2A2A2A);
        }

        /* Top row */
        .exp-top {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 16px;
        }

        .exp-logo-wrap {
          flex-shrink: 0;
          padding-top: 2px;
        }

        .exp-logo {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-muted, #444444);
          letter-spacing: 0.04em;
          user-select: none;
        }

        .exp-meta {
          flex: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          min-width: 0;
        }

        .exp-meta-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .exp-company-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .exp-company {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.3;
        }

        /* Status badge */
        .exp-badge {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          border-radius: 20px;
          padding: 3px 9px;
          line-height: 1;
        }

        .exp-badge--done {
          color: var(--color-accent, #4AFF91);
          background: var(--color-accent-dim, #4AFF9115);
          border: 1px solid var(--color-accent-border, #4AFF9130);
        }

        .exp-badge--wip {
          color: #FFB84A;
          background: rgba(255, 184, 74, 0.08);
          border: 1px solid rgba(255, 184, 74, 0.2);
        }

        .exp-role {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.3;
        }

        .exp-meta-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          flex-shrink: 0;
        }

        .exp-date {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-secondary, #888888);
          white-space: nowrap;
        }

        .exp-location {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          white-space: nowrap;
        }

        /* Tech pills */
        .exp-tech-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }

        .exp-tech-pill {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-secondary, #888888);
          background: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 4px;
          padding: 3px 8px;
          line-height: 1.4;
          white-space: nowrap;
        }

        /* Bullet list */
        .exp-bullets {
          list-style: none;
          margin: 0 0 16px 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .exp-bullets li {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.65;
          padding-left: 14px;
          position: relative;
        }

        .exp-bullets li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: var(--color-text-muted, #444444);
        }

        /* Footer */
        .exp-footer {
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          padding-top: 14px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .exp-footer-link {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 12px;
          font-weight: 500;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          transition: color 150ms ease;
        }

        .exp-footer-link:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* ── Engineering note ── */
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

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .exp-meta {
            flex-direction: column;
            gap: 8px;
          }

          .exp-meta-right {
            align-items: flex-start;
          }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .home-section-link  { transition: none; }
          .home-show-all-link { transition: none; }
          .exp-card           { transition: none; }
          .exp-footer-link    { transition: none; }
        }
      `}</style>
    </PageWrapper>
  );
}

