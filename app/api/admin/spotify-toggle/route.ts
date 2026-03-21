// FILE: app/api/admin/spotify-toggle/route.ts

import { Redis } from "@upstash/redis";
import { NextRequest } from "next/server";

/* ============================================================
   SPOTIFY TOGGLE API — Option A only
   
   Redis key: "portfolio:spotify-live"
   Value:     "1" = live on | "0" = live off
   
   GET  /api/admin/spotify-toggle — read current state
   POST /api/admin/spotify-toggle — set { isLive: boolean }
   ============================================================ */

const TOGGLE_KEY = "portfolio:spotify-live";

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

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  const redis = getRedis();
  if (!redis) return Response.json({ isLive: false });

  try {
    const val = await redis.get<string>(TOGGLE_KEY);
    return Response.json({ isLive: val === "1" });
  } catch {
    return Response.json({ isLive: false });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  let body: { isLive: boolean };
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const redis = getRedis();
  if (!redis) return Response.json({ error: "Redis not configured" }, { status: 500 });

  try {
    await redis.set(TOGGLE_KEY, body.isLive ? "1" : "0");
    return Response.json({ ok: true, isLive: body.isLive });
  } catch (error) {
    console.error("Redis write failed:", error);
    return Response.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

