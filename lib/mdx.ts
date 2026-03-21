import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

/* ============================================================
   TYPES
   ============================================================ */

export interface PostLink {
  label: string;
  url: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  readingTime: string;
  category: string;
  excerpt: string;
  coverGradient?: string;
}

export interface Post {
  meta: PostMeta;
  content: string;
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const CONTENT_DIR = path.join(process.cwd(), "content", "writing");

/* ============================================================
   HELPERS
   ============================================================ */

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

/**
 * Parses a ## Links / Resources / References section from MDX body.
 * Looks for markdown links: - [Label](url) or * [Label](url)
 * Returns an empty array if no such section exists.
 */
export function parseLinksSection(content: string): PostLink[] {
  // Find the Links/Resources/References heading
  const headingMatch = content.match(
    /^#{1,3}\s+(?:Links?|Resources?|References?)[^\n]*/im
  );
  if (!headingMatch || headingMatch.index === undefined) return [];

  // Grab everything after that heading until the next heading or end of file
  const afterHeading = content.slice(
    headingMatch.index + headingMatch[0].length
  );
  const nextHeading = afterHeading.search(/^#{1,3}\s/m);
  const section =
    nextHeading === -1 ? afterHeading : afterHeading.slice(0, nextHeading);

  // Extract markdown links
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const links: PostLink[] = [];
  let match;
  while ((match = linkRegex.exec(section)) !== null) {
    links.push({ label: match[1], url: match[2] });
  }
  return links;
}

function parsePost(slug: string): Post {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);

  const meta: PostMeta = {
    slug,
    title:         String(data.title        ?? "Untitled"),
    date:          String(data.date          ?? new Date().toISOString().slice(0, 10)),
    readingTime:   rt.text,
    category:      String(data.category     ?? "General"),
    excerpt:       String(data.excerpt       ?? ""),
    coverGradient: data.coverGradient ? String(data.coverGradient) : undefined,
  };

  return { meta, content };
}

/* ============================================================
   PUBLIC API
   ============================================================ */

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = slugFromFilename(file);
      try { return parsePost(slug).meta; }
      catch { console.warn(`[mdx] Failed to parse ${file}`); return null; }
    })
    .filter((m): m is PostMeta => m !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post {
  return parsePost(slug);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map(slugFromFilename);
}

export function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

