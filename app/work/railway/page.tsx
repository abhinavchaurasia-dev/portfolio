import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";
import ADRBlock from "@/components/work/ADRBlock";
import Reflection from "@/components/work/Reflection";

/* ============================================================
   METADATA
   ============================================================ */

export const metadata: Metadata = {
  title: "Trainee Management Portal",
  description:
    "Full-stack case study: replacing paper-based trainee registration, attendance, and certificate generation at Northern Railway Workshop Training Center.",
};

/* ============================================================
   PAGE — SERVER COMPONENT
   ============================================================ */

export default function RailwayPage() {
  return (
    <PageWrapper>
      <CaseStudyLayout
        title="Trainee Management Portal"
        oneLiner="Full-stack portal replacing paper-based registration, attendance, and certificate generation at Northern Railway Workshop Training Center."
        thumbnail="railway"
        tags={["Node.js", "Express", "PostgreSQL", "React", "MUI", "PDFKit"]}
        timeline="2 months"
        role="Full Stack"
        team="Solo"
        status="PRODUCTION"
        next={{ label: "PeerCampus", href: "/work/peercampus" }}
      >

        {/* ── THE PROBLEM ── */}
        <div className="cs-section-label">the problem</div>
        <div className="cs-prose">
          <p>
            Northern Railway&rsquo;s Workshop Training Center managed 100+ trainees per
            cycle through paper-based registration, handwritten attendance sheets, and
            manually typed certificates.
          </p>
          <p>
            This created processing delays, transcription errors, and no reliable way
            to query historical trainee data or generate compliance reports.
          </p>
        </div>

        {/* ── ARCHITECTURE ── */}
        <div className="cs-section-label">architecture</div>

        <ADRBlock
          system="Internal trainee lifecycle management — registration through certification"
          stack="React + MUI  →  Express REST API  →  PostgreSQL"
          decisions={[
            {
              title: "Node.js over Django",
              because:
                "team velocity on CRUD-heavy REST APIs was faster; no NLP libraries needed for this problem domain",
            },
            {
              title: "Layered architecture (routes → controllers → services)",
              because:
                "service-layer isolation allows unit testing without HTTP overhead, and keeps business logic independent of transport",
            },
            {
              title: "PDF generation server-side (not client-side)",
              because:
                "certificate formatting must be pixel-consistent across all browsers and print contexts — PDFKit with fixed coordinates guarantees this",
            },
            {
              title: "PostgreSQL over MySQL",
              because:
                "JSON column support enables flexible trainee metadata without schema migrations for each new training program",
            },
          ]}
        />

        {/* spacer between ADR and next section */}
        <div style={{ marginBottom: "48px" }} />

        {/* ── IMPLEMENTATION ── */}
        <div className="cs-section-label">implementation</div>
        <div className="cs-prose">
          <p>
            The core challenge was the trainee status state machine. A trainee moves
            through: Registered → Active → Completed → Certified. Paper-based processes
            allowed illegal transitions — marking someone Certified before Completed.
            I implemented this as an explicit state machine in the service layer,
            rejecting invalid transitions at the API level before any database write.
          </p>
          <p>
            The PDF certificate generation required server-side rendering with exact
            positioning — trainee photo, name, dates, and a QR code linking to a
            verification endpoint. I used PDFKit with a fixed coordinate system to
            ensure pixel-consistent output regardless of server environment.
          </p>
        </div>

        {/* State machine code illustration */}
        <div className="cs-code" style={{ marginBottom: "48px" }}>
          <pre>{`// service/trainee.service.js
const VALID_TRANSITIONS = {
  Registered: ["Active"],
  Active:     ["Completed"],
  Completed:  ["Certified"],
  Certified:  [],           // terminal — no further transitions
};

function assertValidTransition(current, next) {
  const allowed = VALID_TRANSITIONS[current] ?? [];
  if (!allowed.includes(next)) {
    throw new AppError(
      \`Invalid transition: \${current} → \${next}\`,
      400
    );
  }
}`}</pre>
        </div>

        {/* ── IMPACT ── */}
        <div className="cs-section-label">impact</div>
        <ul className="cs-metrics" aria-label="Project outcomes">
          {[
            "Production deployment at Northern Railway Workshop Training Center",
            "Eliminated manual certificate generation workflow entirely",
            "Automated trainee status computation across 5 lifecycle states",
            "PDF generation with QR-code verification endpoint per certificate",
            "Queryable attendance and registration history replacing paper records",
          ].map((metric) => (
            <li key={metric} className="cs-metric">
              <span className="cs-metric-dash" aria-hidden="true">—</span>
              <span className="cs-metric-text">{metric}</span>
            </li>
          ))}
        </ul>

        {/* ── REFLECTION ── */}
        <Reflection>
          <p>
            I&rsquo;d add an audit log table from day one. Government systems need full
            traceability — which user changed which record and when. Retrofitting audit
            logging after the schema exists means touching every service function.
            Building it as a service-layer decorator from the start would cost 4 hours
            and save 4 days of retrofit work.
          </p>
          <p>
            I&rsquo;d also implement a message queue for any future async operations
            (email notifications, report generation). The current synchronous
            architecture works at this scale but would require significant refactoring
            above 500 concurrent users.
          </p>
        </Reflection>

      </CaseStudyLayout>
    </PageWrapper>
  );
}