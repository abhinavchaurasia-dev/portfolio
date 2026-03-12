import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";
import ADRBlock from "@/components/work/ADRBlock";
import Reflection from "@/components/work/Reflection";

export const metadata: Metadata = {
  title: "CivicBridge",
  description:
    "Civic complaint platform with Gemini AI descriptions, GPS detection, and municipality performance leaderboard.",
};

export default function CivicBridgePage() {
  return (
    <PageWrapper>
      <CaseStudyLayout
        title="CivicBridge"
        oneLiner="Complaint platform with AI-generated descriptions, GPS detection, and a municipality performance leaderboard."
        thumbnail="civicbridge"
        tags={["React", "Django", "Gemini AI", "GPS API", "PostgreSQL"]}
        timeline="6 weeks"
        role="Full Stack"
        team="Solo"
        status="SHIPPED"
        prev={{ label: "PeerCampus", href: "/work/peercampus" }}
        next={{ label: "SentiGenix", href: "/work/sentigenix" }}
      >

        <div className="cs-section-label">the problem</div>
        <div className="cs-prose">
          <p>
            Filing a civic complaint in India requires navigating department websites,
            filling long forms, and providing a precise written description of the
            issue — a barrier that prevents most people from reporting problems at all.
          </p>
          <p>
            The goal was to reduce that friction to: take a photo, confirm your
            location, submit. The platform handles description generation and
            department routing automatically.
          </p>
        </div>

        <div className="cs-section-label">architecture</div>

        <ADRBlock
          system="Civic complaint lifecycle — submission through resolution with AI augmentation"
          stack="React  →  Django REST  →  PostgreSQL  +  Gemini AI  +  GPS/Geolocation API"
          decisions={[
            {
              title: "Gemini AI for description generation",
              because:
                "users submit a photo and a 5-word prompt; Gemini generates a structured complaint description — reducing submission friction from a paragraph to a sentence",
            },
            {
              title: "Explicit complaint lifecycle state machine",
              because:
                "complaints move through Submitted → Acknowledged → In Progress → Resolved → Closed; encoding this as explicit valid transitions prevents illegal state changes at the API layer",
            },
            {
              title: "GPS auto-detection over manual address entry",
              because:
                "address transcription errors misroute complaints to wrong municipalities; coordinates are authoritative and map directly to the responsible department",
            },
            {
              title: "Municipality leaderboard as a public accountability layer",
              because:
                "public resolution-rate metrics create pressure to close complaints — departments can see their ranking relative to peers",
            },
          ]}
        />

        <div style={{ marginBottom: "48px" }} />

        <div className="cs-section-label">implementation</div>
        <div className="cs-prose">
          <p>
            The Gemini integration takes a base64-encoded photo and a short user
            prompt, then returns a structured JSON description with inferred category,
            severity, and a two-sentence complaint body. The prompt is templated with a
            strict JSON schema instruction — Gemini&rsquo;s output is parsed directly
            into the complaint model with a single validation step.
          </p>
          <p>
            The leaderboard aggregates resolution rate, median time-to-close, and
            complaint volume per municipality using a single PostgreSQL window function
            query — no separate analytics table needed at this scale. Rankings update
            on each complaint state transition.
          </p>
        </div>

        <div className="cs-section-label">impact</div>
        <ul className="cs-metrics" aria-label="Project outcomes">
          {[
            "AI-generated complaint descriptions from photo + short prompt",
            "GPS auto-detection eliminating manual address entry",
            "Complaint lifecycle state machine with 5 valid states",
            "Real-time municipality performance leaderboard",
            "Department routing based on GPS coordinates, not user-entered text",
          ].map((metric) => (
            <li key={metric} className="cs-metric">
              <span className="cs-metric-dash" aria-hidden="true">—</span>
              <span className="cs-metric-text">{metric}</span>
            </li>
          ))}
        </ul>

        <Reflection>
          <p>
            I&rsquo;d add a confidence score to the AI-generated description and surface
            it to the user before submission. Gemini occasionally misclassifies complaint
            category from ambiguous photos — a low-confidence flag prompts the user to
            add context rather than silently misrouting the complaint.
          </p>
          <p>
            The leaderboard is currently read-only for citizens. I&rsquo;d add a
            subscription model where users can watch a complaint category in their area
            and receive resolution updates — turning passive data into actionable
            civic engagement.
          </p>
        </Reflection>

      </CaseStudyLayout>
    </PageWrapper>
  );
}