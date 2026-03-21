// FILE: app/api/currently-into/route.ts

import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

/* ============================================================
   CURRENTLY INTO API
   
   Stores a list of up to 6 items across 4 categories:
   reading / watching / building / listening
   
   Redis key: "portfolio:currently-into"
   Value: JSON array of CurrentlyIntoItem[]
   
   GET    /api/currently-into          — public, returns items
   POST   /api/currently-into          — protected, sets full list
   DELETE /api/currently-into?id=xx    — protected, removes one item
   ============================================================ */

export const revalidate = 60;

const REDIS_KEY = "portfolio:currently-into";
const MAX_ITEMS = 6;

export type Category = "reading" | "watching" | "building" | "listening";

export interface CurrentlyIntoItem {
  id:       string;   // short unique id e.g. "r1", "w2"
  category: Category;
  label:    string;   // e.g. "Designing Data-Intensive Applications"
  sub?:     string;   // optional subtitle e.g. "Martin Kleppmann"
}

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) return null;
  return Redis.fromEnv();
}

function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get("x-admin-key");
  return authHeader === process.env.ADMIN_SECRET;
}

function unauthorized() {
  return new Response("Unauthorized", { status: 401 });
}

/* ── GET — public, no auth ── */
export async function GET() {
  const redis = getRedis();
  if (!redis) return Response.json({ items: getDefaults() });

  try {
    // Upstash REST client auto-parses JSON — get as the actual type directly
    const items = await redis.get<CurrentlyIntoItem[]>(REDIS_KEY);
    return Response.json({ items: items ?? getDefaults() });
  } catch {
    return Response.json({ items: getDefaults() });
  }
}

/* ── POST — replace full list ── */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  let items: CurrentlyIntoItem[];
  try {
    const body = await req.json() as { items: CurrentlyIntoItem[] };
    items = body.items;
    if (!Array.isArray(items)) throw new Error();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  // Validate and cap
  const valid = items
    .filter((i) => i.label?.trim() && i.category)
    .slice(0, MAX_ITEMS)
    .map((i) => ({
      id:       i.id ?? crypto.randomUUID().slice(0, 6),
      category: i.category,
      label:    i.label.trim(),
      sub:      i.sub?.trim() || undefined,
    }));

  const redis = getRedis();
  if (!redis) return Response.json({ error: "Redis not configured" }, { status: 500 });

  try {
    // Store as native JSON (Upstash handles serialization)
    await redis.set(REDIS_KEY, valid);
    return Response.json({ ok: true, items: valid });
  } catch (error) {
    console.error("Redis write failed:", error);
    return Response.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

/* ── DELETE — remove single item by id ── */
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });

  const redis = getRedis();
  if (!redis) return Response.json({ error: "Redis not configured" }, { status: 500 });

  try {
    const items = await redis.get<CurrentlyIntoItem[]>(REDIS_KEY) ?? [];
    const updated = items.filter((i) => i.id !== id);
    await redis.set(REDIS_KEY, updated);
    return Response.json({ ok: true, items: updated });
  } catch (error) {
    console.error("Redis write failed:", error);
    return Response.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

/* ── Defaults shown before first admin update ── */
function getDefaults(): CurrentlyIntoItem[] {
  return [
    {
      id:       "d1",
      category: "reading",
      label:    "Designing Data-Intensive Applications",
      sub:      "Martin Kleppmann",
    },
    {
      id:       "d2",
      category: "building",
      label:    "This portfolio",
      sub:      "Next.js 15 + AI integrations",
    },
    {
      id:       "d3",
      category: "watching",
      label:    "Mr. Robot",
      sub:      "Season 2",
    },
  ];
}

