// FILE: app/api/spotify/route.ts

import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

/* ============================================================
   NOW PLAYING API
   
   Currently active: Redis manual control (no tracking)
   
   To switch to Spotify Premium live tracking:
   1. Complete the Spotify setup in SpotifyWidget.tsx comments
   2. Comment out the "ACTIVE: Redis block" below
   3. Uncomment the "OPTION A: Spotify Premium block" below
   4. Add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET,
      SPOTIFY_REFRESH_TOKEN to .env.local
   ============================================================ */

export const revalidate = 30;

/* ============================================================
   ACTIVE: Redis two-key model (no tracking, manual control)
   Remove this block when switching to Spotify Premium.
   ============================================================ */

const KEY_LIVE = "portfolio:now-playing";
const KEY_LAST = "portfolio:last-played";

interface TrackData {
  title:    string;
  artist:   string;
  albumArt: string;
}

export async function GET() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return NextResponse.json({ track: null, isLive: false });
  }

  try {
    const redis = Redis.fromEnv();
    const [live, last] = await Promise.all([
      redis.get<TrackData>(KEY_LIVE),
      redis.get<TrackData>(KEY_LAST),
    ]);

    if (live) {
      return NextResponse.json({ track: live, isLive: true });
    }
    if (last) {
      return NextResponse.json({ track: last, isLive: false });
    }
    return NextResponse.json({ track: null, isLive: false });
  } catch (err) {
    console.error("[now-playing] Redis error:", err);
    return NextResponse.json({ track: null, isLive: false });
  }
}

/* ============================================================
   OPTION A: Spotify Premium — uncomment this entire block
   and delete the Redis GET function above when ready.
   
   Also requires: Redis key "portfolio:spotify-live" = "1" | "0"
   Set via /admin/spotify-toggle page.
   ============================================================

const TOKEN_URL   = "https://accounts.spotify.com/api/token";
const NOW_PLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY    = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken(): Promise<string> {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization:  `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type:    "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Token error: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function GET() {
  // Check toggle — if off, fall through to last-played from Redis
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis     = Redis.fromEnv();
    const liveMode  = await redis.get<string>("portfolio:spotify-live");

    if (liveMode !== "1") {
      // Live mode OFF — return last played from Redis cache
      const lastRaw = await redis.get<string>("portfolio:spotify-last");
      if (lastRaw) {
        return NextResponse.json({ track: JSON.parse(lastRaw), isLive: false });
      }
      return NextResponse.json({ track: null, isLive: false });
    }
  }

  // Live mode ON — fetch from Spotify API
  if (
    !process.env.SPOTIFY_CLIENT_ID ||
    !process.env.SPOTIFY_CLIENT_SECRET ||
    !process.env.SPOTIFY_REFRESH_TOKEN
  ) {
    return NextResponse.json({ track: null, isLive: false });
  }

  try {
    const token   = await getAccessToken();
    const headers = { Authorization: `Bearer ${token}` };

    // Try currently playing first
    const nowRes = await fetch(NOW_PLAYING, { headers, cache: "no-store" });
    if (nowRes.status === 200) {
      const nowData = await nowRes.json();
      if (nowData?.item && nowData.currently_playing_type === "track") {
        const track = parseTrack(nowData.item, nowData.is_playing);
        // Cache as last-played in Redis
        if (process.env.UPSTASH_REDIS_REST_URL) {
          const redis = Redis.fromEnv();
          await redis.set("portfolio:spotify-last", JSON.stringify(track));
        }
        return NextResponse.json({ track, isLive: true });
      }
    }

    // Fall back to recently played
    const recentRes = await fetch(RECENTLY, { headers, cache: "no-store" });
    if (recentRes.ok) {
      const recentData = await recentRes.json();
      const items = recentData?.items;
      if (items?.length > 0) {
        const track = parseTrack(items[0].track, false);
        return NextResponse.json({ track, isLive: false });
      }
    }

    return NextResponse.json({ track: null, isLive: false });
  } catch (err) {
    console.error("[spotify] error:", err);
    return NextResponse.json({ track: null, isLive: false });
  }
}

function parseTrack(item: Record<string, unknown>, isPlaying: boolean) {
  const album = item.album as { images: { url: string }[] };
  return {
    title:     item.name as string,
    artist:    (item.artists as { name: string }[]).map((a) => a.name).join(", "),
    albumArt:  album.images[0]?.url ?? "",
    isPlaying,
  };
}

============================================================ */