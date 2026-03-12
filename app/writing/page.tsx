import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import PageWrapper from "@/components/layout/PageWrapper";
import WritingList from "@/components/writing/WritingList";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Technical writing on AI integration, system design, and full-stack engineering.",
};

export default function WritingPage() {
  const posts = getAllPosts();

  return (
    <PageWrapper>
      <div className="wr">
        <h1 className="wr-heading">Writing</h1>
        <p className="wr-sub">
          Technical writing on AI integration, system design, and full-stack
          engineering.
        </p>
        <WritingList posts={posts} />
      </div>

      <style>{`
        .wr { padding-top: 80px; padding-bottom: 96px; }
        .wr-heading {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 30px; font-weight: 700;
          color: var(--color-text-primary, #F0F0F0);
          margin: 0 0 8px; line-height: 1.2;
        }
        .wr-sub {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          margin: 0 0 40px;
        }
      `}</style>
    </PageWrapper>
  );
}