import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

/* ============================================================
   ADMIN TRACK API — Two-key privacy model
   
   "portfolio:now-playing"  — live track (cleared when you stop)
   "portfolio:last-played"  — frozen last track (never auto-clears)
   
   POST   /api/admin/track  — set both keys (go live)
   DELETE /api/admin/track  — clear now-playing only (keep last)
   GET    /api/admin/track  — read both keys (for admin UI)
   ============================================================ */

const KEY_LIVE = "portfolio:now-playing";
const KEY_LAST = "portfolio:last-played";

export interface TrackData {
  title:    string;
  artist:   string;
  albumArt: string;
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
  const queryKey = new URL(req.url).searchParams.get("key");
  return queryKey === secret;
}

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

/* ── POST — go live (writes both keys) ── */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  let body: Partial<TrackData>;
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { title, artist, albumArt = "" } = body;
  if (!title?.trim() || !artist?.trim()) {
    return Response.json({ error: "title and artist required" }, { status: 400 });
  }

  const redis = getRedis();
  if (!redis) return Response.json({ error: "Redis not configured" }, { status: 500 });

  const track: TrackData = {
    title:    title.trim(),
    artist:   artist.trim(),
    albumArt: albumArt.trim(),
  };

  // Store as native JSON — Upstash handles serialization
  await Promise.all([
    redis.set(KEY_LIVE, track),
    redis.set(KEY_LAST, track),
  ]);

  return Response.json({ ok: true, track, isLive: true });
}

/* ── DELETE — stop live, keep last played ── */
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const redis = getRedis();
  if (!redis) return Response.json({ error: "Redis not configured" }, { status: 500 });

  // Only clear the live key — last-played stays frozen
  await redis.del(KEY_LIVE);
  return Response.json({ ok: true, isLive: false });
}

/* ── GET — read both keys (admin UI state) ── */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const redis = getRedis();
  if (!redis) return Response.json({ live: null, last: null });

  try {
    const [live, last] = await Promise.all([
      redis.get<TrackData>(KEY_LIVE),
      redis.get<TrackData>(KEY_LAST),
    ]);

    return Response.json({ live: live ?? null, last: last ?? null });
  } catch {
    return Response.json({ live: null, last: null });
  }
}