import { Redis } from "@upstash/redis";

/* ============================================================
   VISITOR COUNTER API
   POST /api/visitors  — increments counter, returns { count }
   GET  /api/visitors  — reads current count, returns { count }
   
   Key: "portfolio:visitors" (simple integer in Redis)
   ============================================================ */

const REDIS_KEY = "portfolio:visitors";

function getRedis(): Redis | null {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null; // graceful degradation in local dev
  }
  return Redis.fromEnv();
}

/* ── POST — increment and return new total ── */
export async function POST() {
  const redis = getRedis();

  if (!redis) {
    // Return a plausible dev count so UI still renders
    return Response.json({ count: 42 });
  }

  try {
    const count = await redis.incr(REDIS_KEY);
    return Response.json({ count });
  } catch (error) {
    console.error("Redis write failed:", error);
    return Response.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

/* ── GET — read current total without incrementing ── */
export async function GET() {
  const redis = getRedis();

  if (!redis) {
    return Response.json({ count: 42 });
  }

  try {
    const raw = await redis.get<number>(REDIS_KEY);
    const count = raw ?? 0;
    return Response.json({ count });
  } catch (err) {
    console.error("[visitors] GET error:", err);
    return Response.json({ count: 0 }, { status: 500 });
  }
}

