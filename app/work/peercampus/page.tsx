import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";
import ADRBlock from "@/components/work/ADRBlock";
import Reflection from "@/components/work/Reflection";

export const metadata: Metadata = {
  title: "PeerCampus",
  description:
    "AI-assisted campus super-app with CLIP image matching, GPT-4o-mini, and 57-endpoint Django REST API.",
};

export default function PeerCampusPage() {
  return (
    <PageWrapper>
      <CaseStudyLayout
        title="PeerCampus"
        oneLiner="AI-assisted campus super-app: events, forums, lost-and-found with CLIP image matching, and a skills marketplace."
        thumbnail="peercampus"
        tags={["React", "Django", "PostgreSQL", "CLIP", "GPT-4o-mini", "JWT"]}
        timeline="3 months"
        role="Full Stack"
        team="Solo"
        status="SHIPPED"
        prev={{ label: "Trainee Management Portal", href: "/work/railway" }}
        next={{ label: "CivicBridge", href: "/work/civicbridge" }}
      >

        {/* ── THE PROBLEM ── */}
        <div className="cs-section-label">the problem</div>
        <div className="cs-prose">
          <p>
            Campus life is fragmented across WhatsApp groups, notice boards, and
            word-of-mouth. Events go unnoticed, lost items are never reunited with
            owners, and students with skills to offer have no structured way to connect
            with students who need them.
          </p>
          <p>
            The challenge was building a unified platform without making it feel like
            another institutional portal — it needed to be fast, useful, and actually
            used.
          </p>
        </div>

        {/* ── ARCHITECTURE ── */}
        <div className="cs-section-label">architecture</div>

        <ADRBlock
          system="Campus platform — 6 Django apps, 57 REST endpoints, AI image + text pipelines"
          stack="React  →  Django REST Framework  →  PostgreSQL  +  CLIP  +  GPT-4o-mini"
          decisions={[
            {
              title: "Django REST Framework over Node.js",
              because:
                "CLIP and GPT-4o-mini integrations required Python — keeping the ML pipeline in the same runtime eliminated a cross-language API boundary",
            },
            {
              title: "CLIP embeddings for lost-and-found matching",
              because:
                "text search fails when descriptions are vague; CLIP encodes both image and text into the same vector space, enabling cross-modal similarity without labelled training data",
            },
            {
              title: "JWT + Google OAuth dual auth",
              because:
                "students expect Google sign-in; staff need service-account tokens — supporting both without a third-party auth service kept the dependency surface small",
            },
            {
              title: "6 isolated Django apps over a monolithic models.py",
              because:
                "each feature (events, forums, lost-found, marketplace, auth, notifications) has independent migrations, making it safe to iterate one app without touching others",
            },
          ]}
        />

        <div style={{ marginBottom: "48px" }} />

        {/* ── IMPLEMENTATION ── */}
        <div className="cs-section-label">implementation</div>
        <div className="cs-prose">
          <p>
            The hardest part was the lost-and-found matching pipeline. A user uploads a
            photo of a found item; the system runs it through CLIP to produce a
            512-dimension embedding stored in PostgreSQL. When someone reports a lost
            item with a text description, CLIP encodes the text into the same embedding
            space and a cosine similarity query returns ranked candidates. The pipeline
            runs synchronously on upload — median latency under 400ms on the test server.
          </p>
          <p>
            GPT-4o-mini is used to auto-generate structured event descriptions from a
            short prompt, reducing the friction of posting. The prompt is templated with
            strict output constraints (JSON schema) so the response can be parsed
            directly into the event model without validation gymnastics.
          </p>
        </div>

        {/* ── IMPACT ── */}
        <div className="cs-section-label">impact</div>
        <ul className="cs-metrics" aria-label="Project outcomes">
          {[
            "57 REST endpoints across 6 Django apps",
            "Cross-modal image-text search via CLIP embeddings",
            "GPT-4o-mini event description generation with JSON schema output",
            "Dual auth: JWT session tokens + Google OAuth for student accounts",
            "Skills marketplace connecting students for peer learning",
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
            I&rsquo;d move the CLIP inference off the request thread into a task queue
            (Celery + Redis) from the start. Running it synchronously works at low
            volume but blocks a worker for 300–400ms per upload — that compounds badly
            under concurrent load. The upload endpoint should return immediately and
            push matching results via a WebSocket or polling endpoint.
          </p>
          <p>
            I&rsquo;d also version the embedding model in the database schema. CLIP
            embeddings from different model checkpoints aren&rsquo;t comparable — if I
            ever upgrade the model, every stored embedding needs recomputation. A
            model_version column on the embeddings table makes that migration explicit
            rather than silently breaking search quality.
          </p>
        </Reflection>

      </CaseStudyLayout>
    </PageWrapper>
  );
}