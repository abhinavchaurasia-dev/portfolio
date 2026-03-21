// FILE: app/api/quotes/route.ts

import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

/* ============================================================
   QUOTES API

   Stores a list of curated quotes shown randomly in the footer.

   Redis key: "portfolio:quotes"
   Value: JSON array of Quote[]

   GET    /api/quotes          — public, returns all quotes
   POST   /api/quotes          — protected, sets full list
   DELETE /api/quotes?id=xx    — protected, removes one quote
   ============================================================ */

export const revalidate = 60;

const REDIS_KEY = "portfolio:quotes";
const MAX_ITEMS = 30;

export interface Quote {
  id:     string;
  text:   string;   // the quote body
  author: string;   // attribution
  source?: string;  // optional — book/talk/essay title
}

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) return null;
  return Redis.fromEnv();
}

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) return false;
  const headerKey = req.headers.get("x-admin-key");
  if (headerKey === secret) return true;
  return new URL(req.url).searchParams.get("key") === secret;
}

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

/* ── GET — public ── */
export async function GET() {
  const redis = getRedis();
  if (!redis) return Response.json({ quotes: getDefaults() });

  try {
    const quotes = await redis.get<Quote[]>(REDIS_KEY);
    return Response.json({ quotes: quotes ?? getDefaults() });
  } catch {
    return Response.json({ quotes: getDefaults() });
  }
}

/* ── POST — replace full list ── */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  let quotes: Quote[];
  try {
    const body = await req.json() as { quotes: Quote[] };
    quotes = body.quotes;
    if (!Array.isArray(quotes)) throw new Error();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const valid = quotes
    .filter((q) => q.text?.trim() && q.author?.trim())
    .slice(0, MAX_ITEMS)
    .map((q) => ({
      id:      q.id ?? crypto.randomUUID().slice(0, 6),
      text:    q.text.trim(),
      author:  q.author.trim(),
      source:  q.source?.trim() || undefined,
    }));

  const redis = getRedis();
  if (!redis) return Response.json({ error: "Redis not configured" }, { status: 500 });

  await redis.set(REDIS_KEY, valid);
  return Response.json({ ok: true, quotes: valid });
}

/* ── DELETE — remove single quote by id ── */
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return Response.json({ error: "Redis not configured" }, { status: 500 });

  try {
    const quotes = await redis.get<Quote[]>(REDIS_KEY) ?? [];
    const updated = quotes.filter((q) => q.id !== id);
    await redis.set(REDIS_KEY, updated);
    return Response.json({ ok: true, quotes: updated });
  } catch {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

/* ── Defaults shown before first admin update ── */
function getDefaults(): Quote[] {
  return [
    {
      id:     "q1",
      text:   "Make it work, make it right, make it fast.",
      author: "Kent Beck",
    },
    {
      id:     "q2",
      text:   "The most powerful tool we have as developers is automation.",
      author: "Scott Hanselman",
    },
    {
      id:     "q3",
      text:   "First, solve the problem. Then, write the code.",
      author: "John Johnson",
    },
    {
      id:     "q4",
      text:   "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      author: "Martin Fowler",
    },
    {
      id:     "q5",
      text:   "The function of good software is to make the complex appear simple.",
      author: "Grady Booch",
    },
    {
      id:     "q6",
      text:   "Simplicity is a prerequisite for reliability.",
      author: "Edsger W. Dijkstra",
    },
    {
      id:     "q7",
      text:   "Programs must be written for people to read, and only incidentally for machines to execute.",
      author: "Harold Abelson",
      source: "SICP",
    },
    {
      id:     "q8",
      text:   "Weeks of coding can save you hours of planning.",
      author: "Unknown",
    },
  ];
}

