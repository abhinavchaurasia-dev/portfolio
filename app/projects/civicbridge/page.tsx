import PageWrapper from "@/components/layout/PageWrapper";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";
import ADRBlock from "@/components/work/ADRBlock";
import Reflection from "@/components/work/Reflection";
import ImpactMetrics from "@/components/work/ImpactMetrics";

export const metadata = {
  title: "CivicBridge — Abhinav Chaurasia",
  description:
    "Civic complaint platform with AI-generated descriptions, GPS detection, and municipality performance leaderboard.",
};

export default function CivicBridgeCaseStudy() {
  return (
    <PageWrapper>
      <CaseStudyLayout
        gradient="linear-gradient(135deg, #1a0a0a 0%, #3d0a1e 50%, #1a0a2e 100%)"
        tags={["React", "Django", "Gemini AI", "GPS API", "PostgreSQL"]}
        title="CivicBridge"
        subtitle="Civic complaint platform with AI-generated descriptions and municipality performance tracking"
        meta={[
          { label: "Timeline", value: "2 months" },
          { label: "Role", value: "Full Stack" },
          { label: "Team", value: "Solo" },
          { label: "Status", value: "Shipped", badge: true },
        ]}
        liveHref="https://civicbridge.abhinavchaurasia.in"
        sourceHref="https://github.com/abhinavchaurasia-dev/civicbridge"
        backHref="/projects"
        backLabel="Back to Projects"
        prevProject={{ label: "PeerCampus", href: "/projects/peercampus" }}
        nextProject={{ label: "SentiGenix", href: "/projects/sentigenix" }}
      >
        <section aria-labelledby="cb-problem">
          <h2 id="cb-problem" className="cs-section-title">The Problem</h2>
          <div className="cs-prose">
            <p>
              Citizen complaints often fail due to unclear descriptions, weak location data, and no transparency
              in progress tracking for municipalities.
            </p>
          </div>
        </section>

        <section aria-labelledby="cb-arch">
          <h2 id="cb-arch" className="cs-section-title">Architecture</h2>
          <ADRBlock
            system="React -> Django REST API -> PostgreSQL + Gemini AI + GPS API"
            stack="React  ->  Django REST  ->  PostgreSQL  +  Gemini AI  +  GPS pipeline"
            decisions={[
              {
                title: "Gemini for structured complaint text",
                because:
                  "The model converts informal user input into actionable complaint content with better municipal readability.",
              },
              {
                title: "State-machine complaint lifecycle",
                because:
                  "Explicit transitions improve consistency and make status tracking dependable for citizens.",
              },
              {
                title: "GPS-first location capture",
                because:
                  "GPS coordinates reduce ambiguity and improve complaint clustering and routing.",
              },
            ]}
          />
        </section>

        <section aria-labelledby="cb-impact">
          <h2 id="cb-impact" className="cs-section-title">Impact</h2>
          <ImpactMetrics
            items={[
              "Shipped and deployed at civicbridge.abhinavchaurasia.in",
              "AI-generated structured complaint descriptions",
              "GPS-based location with reverse geocoding",
              "Municipality leaderboard for accountability",
            ]}
          />
        </section>

        <section aria-labelledby="cb-reflection">
          <h2 id="cb-reflection" className="cs-section-title">What I&rsquo;d Do Differently</h2>
          <Reflection>
            <p>
              I&rsquo;d integrate multimodal prompts earlier and add status push notifications to reduce user effort
              for follow-up checks.
            </p>
          </Reflection>
        </section>
      </CaseStudyLayout>
    </PageWrapper>
  );
}
