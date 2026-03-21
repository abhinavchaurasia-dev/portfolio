import PageWrapper from "@/components/layout/PageWrapper";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";
import ADRBlock from "@/components/work/ADRBlock";
import Reflection from "@/components/work/Reflection";
import ImpactMetrics from "@/components/work/ImpactMetrics";

export const metadata = {
  title: "PeerCampus — Abhinav Chaurasia",
  description:
    "AI-assisted campus super-app with events, forums, lost-and-found using CLIP image matching, and skills marketplace.",
};

export default function PeerCampusCaseStudy() {
  return (
    <PageWrapper>
      <CaseStudyLayout
        gradient="linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #0d1b69 100%)"
        tags={["React", "Django", "PostgreSQL", "CLIP", "GPT-4o-mini", "JWT", "OAuth"]}
        title="PeerCampus"
        subtitle="AI-assisted campus super-app — events, forums, lost-and-found, skills marketplace"
        meta={[
          { label: "Timeline", value: "3 months" },
          { label: "Role", value: "Full Stack" },
          { label: "Team", value: "Solo" },
          { label: "Status", value: "Shipped", badge: true },
        ]}
        liveHref="https://peercampus.abhinavchaurasia.in"
        sourceHref="https://github.com/abhinavchaurasia-dev/peercampus"
        backHref="/projects"
        backLabel="Back to Projects"
        nextProject={{ label: "CivicBridge", href: "/projects/civicbridge" }}
      >
        <section aria-labelledby="pc-problem">
          <h2 id="pc-problem" className="cs-section-title">The Problem</h2>
          <div className="cs-prose">
            <p>
              Campus life generates a constant stream of fragmented activity, events posted on notice boards,
              lost items announced over WhatsApp groups, and skills traded through personal contacts. There
              was no unified surface for any of it.
            </p>
            <p>
              The lost-and-found problem was particularly acute. Text descriptions of lost items are unreliable,
              so visual similarity search was the core requirement.
            </p>
          </div>
        </section>

        <section aria-labelledby="pc-arch">
          <h2 id="pc-arch" className="cs-section-title">Architecture</h2>
          <ADRBlock
            system="React -> Django REST API (6 apps, 57 endpoints) -> PostgreSQL"
            stack="React  ->  Django REST  ->  PostgreSQL  +  CLIP embeddings"
            decisions={[
              {
                title: "Django over Node.js",
                because:
                  "CLIP and GPT-4o-mini integrations required Python's ML ecosystem; Django REST Framework provided robust validation for a large endpoint surface.",
              },
              {
                title: "6-app Django architecture",
                because:
                  "Splitting users, events, forums, lost-and-found, skills, and notifications into separate apps kept boundaries explicit and maintainable.",
              },
              {
                title: "CLIP embeddings over text search",
                because:
                  "CLIP enables image-to-image similarity matching, which performs better than text matching for visually similar lost items.",
              },
            ]}
          />
        </section>

        <section aria-labelledby="pc-impact">
          <h2 id="pc-impact" className="cs-section-title">Impact</h2>
          <ImpactMetrics
            items={[
              "Shipped and deployed at peercampus.abhinavchaurasia.in",
              "57 REST endpoints across 6 Django apps",
              "CLIP image similarity search for lost-and-found",
              "Multiple auth flows: JWT, Google OAuth, OTP",
            ]}
          />
        </section>

        <section aria-labelledby="pc-reflection">
          <h2 id="pc-reflection" className="cs-section-title">What I&rsquo;d Do Differently</h2>
          <Reflection>
            <p>
              I&rsquo;d use a dedicated task queue for embedding generation from day one and adopt vector indexing
              earlier to avoid scan-heavy similarity queries as data grows.
            </p>
          </Reflection>
        </section>
      </CaseStudyLayout>
    </PageWrapper>
  );
}
