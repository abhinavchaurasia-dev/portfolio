import PageWrapper from "@/components/layout/PageWrapper";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";
import ADRBlock from "@/components/work/ADRBlock";
import Reflection from "@/components/work/Reflection";
import ImpactMetrics from "@/components/work/ImpactMetrics";

export const metadata = {
  title: "SentiGenix — Abhinav Chaurasia",
  description:
    "Sentiment analysis platform with VADER NLP classification and DeepSeek AI-guided text rewriting.",
};

export default function SentiGenixCaseStudy() {
  return (
    <PageWrapper>
      <CaseStudyLayout
        gradient="linear-gradient(135deg, #0a1a0a 0%, #0d3d1e 50%, #0a1a2e 100%)"
        tags={["React", "Django", "VADER", "DeepSeek", "Python"]}
        title="SentiGenix"
        subtitle="Real-time sentiment analysis with VADER NLP classification and AI-guided text rewriting"
        meta={[
          { label: "Timeline", value: "6 weeks" },
          { label: "Role", value: "Full Stack" },
          { label: "Team", value: "Solo" },
          { label: "Status", value: "Shipped", badge: true },
        ]}
        liveHref="https://sentigenix.abhinavchaurasia.in"
        sourceHref="https://github.com/abhinavchaurasia-dev/sentigenix"
        backHref="/projects"
        backLabel="Back to Projects"
        prevProject={{ label: "CivicBridge", href: "/projects/civicbridge" }}
      >
        <section aria-labelledby="sg-problem">
          <h2 id="sg-problem" className="cs-section-title">The Problem</h2>
          <div className="cs-prose">
            <p>
              Teams often publish text with unintended tone. The gap was a tool that can classify sentiment
              quickly and propose rewrites while preserving meaning.
            </p>
          </div>
        </section>

        <section aria-labelledby="sg-arch">
          <h2 id="sg-arch" className="cs-section-title">Architecture</h2>
          <ADRBlock
            system="React -> Django REST API -> VADER NLP + DeepSeek API"
            stack="React  ->  Django REST  ->  VADER (classification)  +  DeepSeek (rewriting)"
            decisions={[
              {
                title: "VADER for low-latency classification",
                because:
                  "VADER provides near-instant sentiment feedback suitable for interactive typing workflows.",
              },
              {
                title: "Two-stage pipeline",
                because:
                  "Separating classify and rewrite keeps fast feedback independent from LLM generation latency.",
              },
            ]}
          />
        </section>

        <section aria-labelledby="sg-impact">
          <h2 id="sg-impact" className="cs-section-title">Impact</h2>
          <ImpactMetrics
            items={[
              "Shipped and deployed at sentigenix.abhinavchaurasia.in",
              "Sub-5ms sentiment classification via VADER",
              "DeepSeek rewrite suggestions preserving key facts",
            ]}
          />
        </section>

        <section aria-labelledby="sg-reflection">
          <h2 id="sg-reflection" className="cs-section-title">What I&rsquo;d Do Differently</h2>
          <Reflection>
            <p>
              I&rsquo;d add a domain-specific fine-tuned classifier and stream rewrite output for more responsive UX.
            </p>
          </Reflection>
        </section>
      </CaseStudyLayout>
    </PageWrapper>
  );
}
