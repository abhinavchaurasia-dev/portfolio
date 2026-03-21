import PageWrapper from "@/components/layout/PageWrapper";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";
import ADRBlock from "@/components/work/ADRBlock";
import Reflection from "@/components/work/Reflection";
import ImpactMetrics from "@/components/work/ImpactMetrics";

export const metadata = {
  title: "Northern Railway Portal — Abhinav Chaurasia",
  description:
    "Trainee management portal for Northern Railway with layered Node.js APIs, PostgreSQL, and automated PDF workflows.",
};

export default function RailwayCaseStudy() {
  return (
    <PageWrapper>
      <CaseStudyLayout
        gradient="linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #091820 100%)"
        tags={["Node.js", "Express", "PostgreSQL", "React", "MUI"]}
        title="Northern Railway Portal"
        subtitle="Production trainee-management system replacing paper workflows at Northern Railway WTC"
        meta={[
          { label: "Timeline", value: "3 months" },
          { label: "Role", value: "Software Development Intern" },
          { label: "Team", value: "Department + Solo Delivery" },
          { label: "Status", value: "Production", badge: true },
        ]}
        backHref="/work"
        backLabel="Back to Work"
      >
        <section aria-labelledby="rw-problem">
          <h2 id="rw-problem" className="cs-section-title">The Problem</h2>
          <div className="cs-prose">
            <p>
              Trainee records, attendance, and certificate workflows were managed
              entirely on paper, which created delays, duplicate records, and poor
              traceability across departments.
            </p>
          </div>
        </section>

        <section aria-labelledby="rw-arch">
          <h2 id="rw-arch" className="cs-section-title">Architecture</h2>
          <ADRBlock
            system="React + MUI -> Node.js/Express layered API -> PostgreSQL"
            stack="React  ->  Express routes/controllers/services  ->  PostgreSQL  +  PDF generation"
            decisions={[
              {
                title: "Layered API architecture",
                because:
                  "Separating routes, controllers, and services reduced coupling and made business logic easier to test and evolve.",
              },
              {
                title: "State-machine trainee lifecycle",
                because:
                  "A five-state model prevented invalid transitions and created consistent records for training progress.",
              },
              {
                title: "Automated certificate generation",
                because:
                  "Generating PDFs from structured data removed manual formatting and reduced administrative workload.",
              },
            ]}
          />
        </section>

        <section aria-labelledby="rw-impact">
          <h2 id="rw-impact" className="cs-section-title">Impact</h2>
          <ImpactMetrics
            items={[
              "Replaced paper-based trainee workflows with a centralized portal",
              "Implemented a 5-state trainee lifecycle model",
              "Automated attendance and certificate generation",
              "Supported concurrent usage across training operations",
            ]}
          />
        </section>

        <section aria-labelledby="rw-reflection">
          <h2 id="rw-reflection" className="cs-section-title">
            What I&rsquo;d Do Differently
          </h2>
          <Reflection>
            <p>
              I&rsquo;d add a full audit trail and role-based analytics dashboards
              earlier so supervisors can track bottlenecks and compliance without
              manual exports.
            </p>
          </Reflection>
        </section>
      </CaseStudyLayout>
    </PageWrapper>
  );
}