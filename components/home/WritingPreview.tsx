import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

function formatPreciseDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function WritingPreview() {
  const posts = getAllPosts().slice(0, 2);

  return (
    <nav aria-label="Recent blogs">
      <div className="wp-rule" aria-hidden="true" />
      {posts.map((post) => (
        <Link key={post.slug} href={`/writing/${post.slug}`} className="wp-row">
          <div
            className="wp-thumb"
            style={{ background: post.coverGradient ?? "var(--color-bg-inset,#1A1A1A)" }}
            aria-hidden="true"
          >
            <span className="wp-initial">{post.category.slice(0, 2).toUpperCase()}</span>
          </div>
          <div className="wp-body">
            <span className="wp-cat">{post.category}</span>
            <span className="wp-title">{post.title}</span>
          </div>
          <time className="wp-date" dateTime={post.date}>{formatPreciseDate(post.date)}</time>
        </Link>
      ))}
      <div className="wp-rule" aria-hidden="true" />

      <style>{`
        .wp-rule { height:1px; background:var(--color-border-subtle,#1F1F1F); }
        .wp-row { display:flex; align-items:center; gap:14px; padding:14px 0; border-bottom:1px solid var(--color-border-subtle,#1F1F1F); text-decoration:none; }
        .wp-row:last-of-type { border-bottom:none; }
        .wp-row:hover .wp-title { color:var(--color-accent,#4AFF91); }
        .wp-thumb { width:48px; height:34px; flex-shrink:0; border-radius:3px; display:flex; align-items:center; justify-content:center; border:1px solid var(--color-border-subtle,#1F1F1F); }
        .wp-initial { font-family:var(--font-geist-mono,"Geist Mono",monospace); font-size:11px; font-weight:700; color:rgba(255,255,255,0.15); user-select:none; }
        .wp-body { flex:1; min-width:0; display:flex; flex-direction:column; gap:3px; }
        .wp-cat { font-family:var(--font-geist-mono,"Geist Mono",monospace); font-size:9px; font-weight:500; text-transform:uppercase; letter-spacing:0.08em; color:var(--color-text-muted,#444444); }
        .wp-title { font-family:var(--font-geist,"Geist",sans-serif); font-size:13px; font-weight:500; color:var(--color-text-primary,#F0F0F0); line-height:1.35; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; transition:color 150ms ease; }
        .wp-date { font-family:var(--font-geist-mono,"Geist Mono",monospace); font-size:11px; color:var(--color-text-muted,#444444); flex-shrink:0; white-space:nowrap; }
        @media(max-width:560px){ .wp-date{display:none;} }
        @media(prefers-reduced-motion:reduce){ .wp-title{transition:none;} }
      `}</style>
    </nav>
  );
}

