import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

/* ============================================================
   TYPES
   ============================================================ */

export interface PostMeta {
  slug: string;
  title: string;
  date: string;         // ISO string: "2025-11-15"
  readingTime: string;  // "5 min read"
  category: string;
  excerpt: string;
}

export interface Post {
  meta: PostMeta;
  content: string;      // raw MDX string — compiled by page
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

function parsePost(slug: string): Post {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const rt = readingTime(content);

  const meta: PostMeta = {
    slug,
    title:       String(data.title       ?? "Untitled"),
    date:        String(data.date         ?? new Date().toISOString().slice(0, 10)),
    readingTime: rt.text,                          // "5 min read"
    category:    String(data.category    ?? "General"),
    excerpt:     String(data.excerpt     ?? ""),
  };

  return { meta, content };
}

/* ============================================================
   PUBLIC API
   ============================================================ */

/**
 * Returns metadata for all posts, sorted newest-first.
 * Safe to call from Server Components — reads filesystem.
 */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((file) => {
      const slug = slugFromFilename(file);
      try {
        return parsePost(slug).meta;
      } catch {
        // Skip malformed files rather than crashing the build
        console.warn(`[mdx] Failed to parse ${file}`);
        return null;
      }
    })
    .filter((meta): meta is PostMeta => meta !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

/**
 * Returns full post data (meta + raw MDX content) for a slug.
 * Throws if the post doesn't exist — Next.js will 404.
 */
export function getPost(slug: string): Post {
  return parsePost(slug);
}

/**
 * Returns all slugs — used by generateStaticParams.
 */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map(slugFromFilename);
}

/**
 * Formats a date string ("2025-11-15") to "Nov 15, 2025".
 */
export function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
  });
}