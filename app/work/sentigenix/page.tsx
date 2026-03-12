import type { Metadata } from "next";
import PageWrapper from "@/components/layout/PageWrapper";
import CaseStudyLayout from "@/components/work/CaseStudyLayout";
import ADRBlock from "@/components/work/ADRBlock";
import Reflection from "@/components/work/Reflection";

export const metadata: Metadata = {
  title: "SentiGenix",
  description:
    "Sentiment analysis platform with VADER NLP classification and DeepSeek AI-guided text rewriting.",
};

export default function SentiGenixPage() {
  return (
    <PageWrapper>
      <CaseStudyLayout
        title="SentiGenix"
        oneLiner="Sentiment analysis platform with VADER NLP classification and DeepSeek AI-guided text rewriting."
        thumbnail="sentigenix"
        tags={["React", "Django", "VADER", "DeepSeek API", "PostgreSQL"]}
        timeline="3 weeks"
        role="Full Stack"
        team="Solo"
        status="SHIPPED"
        prev={{ label: "CivicBridge", href: "/work/civicbridge" }}
      >

        <div className="cs-section-label">the problem</div>
        <div className="cs-prose">
          <p>
            Writers, support teams, and marketers often produce text without knowing
            how it lands emotionally. Sentiment is hard to self-assess — people are
            poor judges of how their own writing reads to others.
          </p>
          <p>
            The goal was a tool that classifies text sentiment in real time and, if the
            sentiment is unintended, suggests a rewrite that preserves meaning while
            shifting tone.
          </p>
        </div>

        <div className="cs-section-label">architecture</div>

        <ADRBlock
          system="Real-time sentiment classification with AI-guided tone rewriting"
          stack="React  →  Django REST  →  VADER NLP  +  DeepSeek API  →  PostgreSQL"
          decisions={[
            {
              title: "VADER over a fine-tuned transformer for classification",
              because:
                "VADER runs in-process with zero inference latency and no GPU requirement — at this problem scale (short social-style text), its rule-based approach matches transformer accuracy while keeping the stack simple",
            },
            {
              title: "DeepSeek for rewriting, not classification",
              because:
                "rewriting requires language generation which rule-based NLP can't do; DeepSeek handles the generative step while VADER handles the cheaper classification step — right tool for each task",
            },
            {
              title: "Synchronous classification pipeline",
              because:
                "VADER classification is sub-millisecond; making it async would add queue overhead with no throughput benefit at this request volume",
            },
            {
              title: "History stored per session in PostgreSQL",
              because:
                "storing classification history lets users compare before/after rewrites and track sentiment drift across a document revision cycle",
            },
          ]}
        />

        <div style={{ marginBottom: "48px" }} />

        <div className="cs-section-label">implementation</div>
        <div className="cs-prose">
          <p>
            VADER returns a compound score between -1 and 1. I mapped this to three
            bands — Negative (&lt; -0.05), Neutral (-0.05 to 0.05), Positive (&gt; 0.05)
            — with the raw score surfaced alongside the label so users can see
            borderline cases rather than just a categorical result.
          </p>
          <p>
            The DeepSeek rewrite prompt is structured with three parameters: original
            text, detected sentiment, and target sentiment. The model is instructed to
            preserve factual content and sentence structure while shifting only the
            emotional register. Output is returned as a single revised block with no
            preamble — enforced by the system prompt.
          </p>
        </div>

        <div className="cs-section-label">impact</div>
        <ul className="cs-metrics" aria-label="Project outcomes">
          {[
            "Real-time VADER classification with compound score and band label",
            "DeepSeek-powered tone rewriting preserving original meaning",
            "Session-based revision history for before/after comparison",
            "Sub-millisecond classification latency — no async queue needed",
            "Three-band sentiment output: Negative / Neutral / Positive",
          ].map((metric) => (
            <li key={metric} className="cs-metric">
              <span className="cs-metric-dash" aria-hidden="true">—</span>
              <span className="cs-metric-text">{metric}</span>
            </li>
          ))}
        </ul>

        <Reflection>
          <p>
            I&rsquo;d replace the three-band output with a continuous sentiment axis
            shown as a visual slider, not just a label. The compound score already
            exists — surfacing it as -1 to +1 on a spectrum communicates nuance that
            &ldquo;Neutral&rdquo; doesn&rsquo;t. Borderline scores are the most
            interesting cases and the current UI hides them.
          </p>
          <p>
            I&rsquo;d also add sentence-level highlighting — showing which specific
            sentences are pulling the overall score negative rather than classifying
            the whole block. That requires splitting the VADER pipeline per sentence,
            which is trivial to implement but changes the UX from a summary tool to a
            diagnostic one.
          </p>
        </Reflection>

      </CaseStudyLayout>
    </PageWrapper>
  );
}