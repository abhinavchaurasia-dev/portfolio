import { Redis } from "@upstash/redis";

/* ============================================================
   VISITOR COUNTER API
   POST /api/visitors  — increments counter, returns { count }
   GET  /api/visitors  — reads current count, returns { count }
   
   Key: "portfolio:visitors" (simple integer in Redis)
   ============================================================ */

const REDIS_KEY = "portfolio:visitors";
const COUNT_WINDOW = 60 * 60; // 1 hour in seconds
const MAX_INCREMENTS = 3; // max 3 increments per IP per hour

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
export async function POST(req: Request) {
  const redis = getRedis();

  if (!redis) {
    // Return a plausible dev count so UI still renders
    return Response.json({ count: 42 });
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")?.trim()
    ?? "unknown";

  const rateLimitKey = `visitor_ratelimit:${ip}`;

  try {
    const current = await redis.get<number>(rateLimitKey);

    if (current !== null && current >= MAX_INCREMENTS) {
      const count = (await redis.get<number>(REDIS_KEY)) ?? 0;
      return Response.json({ count });
    }

    const pipe = redis.pipeline();
    pipe.incr(rateLimitKey);
    pipe.expire(rateLimitKey, COUNT_WINDOW);
    pipe.incr(REDIS_KEY);

    const results = await pipe.exec();
    const countFromPipeline = results[2];
    const count = typeof countFromPipeline === "number"
      ? countFromPipeline
      : (await redis.get<number>(REDIS_KEY)) ?? 0;

    return Response.json({ count });
  } catch (error) {
    console.error("Visitor counter error:", error);
    try {
      const count = (await redis.get<number>(REDIS_KEY)) ?? 0;
      return Response.json({ count });
    } catch {
      return Response.json({ count: 0 });
    }
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

