import { NextRequest } from "next/server";

/* ============================================================
   PORTFOLIO AI ASSISTANT — API ROUTE
   
   Uses OpenRouter directly via fetch (no ai SDK dependency).
   This is the most compatible approach — works regardless of
   which version of 'ai' or '@ai-sdk/*' is installed.
   
   ENV VARS REQUIRED:
     OPENROUTER_API_KEY   — from openrouter.ai/keys
   
   OPTIONAL (rate limiting):
     UPSTASH_REDIS_REST_URL
     UPSTASH_REDIS_REST_TOKEN
   ============================================================ */

/* ── Rate limiter (optional) ── */
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; error?: string }> {
  const url   = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return { allowed: true }; // skip if not configured

  try {
    const key    = `rl:assistant:${ip}`;
    const window = 3600; // 1 hour in seconds
    const limit  = 20;

    // INCR + EXPIRE in one pipeline
    const res = await fetch(`${url}/pipeline`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, window],
      ]),
    });

    const data = await res.json() as [{ result: number }, unknown];
    const count = data[0].result;

    if (count > limit) {
      return { allowed: false, error: "Rate limit reached — max 20 messages/hour." };
    }
    return { allowed: true };
  } catch (e) {
    // If Redis fails, let the request through rather than blocking users
    console.warn("[assistant] Rate limit check failed:", e);
    return { allowed: true };
  }
}

/* ── System prompt ── */
const SYSTEM_PROMPT = `You are Abhinav Chaurasia's portfolio assistant. Answer concisely and technically.

IMPORTANT DISTINCTION: Northern Railway Portal is professional work experience (an internship), NOT a personal project. Never refer to it as a project. Always describe it as an internship or work experience.

Work Experience (internship — NOT a project):
- Northern Railway Portal: Software Development Intern at Northern Railway WTC. Built a production trainee-management system — Node.js layered API (routes/controllers/services), PostgreSQL, React MUI, automated PDF certificate generation, 5-state trainee lifecycle state machine.

Personal Projects (built independently, separate from work experience):
- PeerCampus: Django REST 6 apps 57 endpoints, CLIP embeddings for lost-item image search, GPT-4o-mini via OpenRouter, JWT + Google OAuth + OTP auth.
- CivicBridge: Gemini AI for description generation, GPS + photo pipeline, complaint lifecycle state machine, municipality ranking leaderboard.
- SentiGenix: VADER NLP classification, DeepSeek API for sentiment-guided text rewriting, real-time feedback.

Stack: React, Django, Node.js, PostgreSQL, OpenAI, Gemini, CLIP, VADER, DeepSeek, JWT
Status: Final year CSE, University of Lucknow, 2026
Open to: SWE internships and 2026 graduate roles

Keep answers under 80 words. Be specific. Cite actual implementation details.`;

/* ============================================================
   POST handler
   ============================================================ */
export async function POST(req: NextRequest) {

  /* ── API key check ── */
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error("[assistant] OPENROUTER_API_KEY is not set");
    return Response.json(
      { error: "Server configuration error: API key missing." },
      { status: 500 }
    );
  }

  /* ── Rate limit ── */
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
          ?? req.headers.get("x-real-ip")
          ?? "local";
  const rl = await checkRateLimit(ip);
  if (!rl.allowed) {
    return Response.json({ error: rl.error }, { status: 429 });
  }

  /* ── Parse body ── */
  let messages: { role: string; content: string }[];
  try {
    const body = await req.json() as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("bad body");
    messages = body.messages as { role: string; content: string }[];
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  /* ── Call OpenRouter ── */
  let openRouterRes: Response;
  try {
    openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization":  `Bearer ${apiKey}`,
        "Content-Type":   "application/json",
        "HTTP-Referer":   "https://abhinavchaurasia.in",
        "X-Title":        "Abhinav Chaurasia Portfolio",
      },
      body: JSON.stringify({
        model:       "openai/gpt-4o-mini",
        stream:      true,
        max_tokens:  150,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
      }),
    });
  } catch (err) {
    console.error("[assistant] OpenRouter fetch failed:", err);
    return Response.json({ error: "Failed to reach AI service." }, { status: 502 });
  }

  if (!openRouterRes.ok) {
    const text = await openRouterRes.text();
    console.error("[assistant] OpenRouter error:", openRouterRes.status, text);
    return Response.json(
      { error: `AI service error (${openRouterRes.status})` },
      { status: openRouterRes.status }
    );
  }

  /* ── Stream OpenRouter SSE → client as Vercel AI data stream ── 
     OpenRouter returns standard SSE: data: {"choices":[{"delta":{"content":"hi"}}]}
     We re-encode as Vercel AI SDK data stream format: 0:"hi"\n
     so the client's stream parser works correctly.
  ── */
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader  = openRouterRes.body!.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // keep incomplete last line

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === "data: [DONE]") continue;
            if (!trimmed.startsWith("data: ")) continue;

            try {
              const json    = JSON.parse(trimmed.slice(6)) as {
                choices?: { delta?: { content?: string } }[];
              };
              const content = json.choices?.[0]?.delta?.content;
              if (content) {
                // Vercel AI data stream format: 0:"token"\n
                const encoded = `0:${JSON.stringify(content)}\n`;
                controller.enqueue(encoder.encode(encoded));
              }
            } catch { /* malformed SSE chunk, skip */ }
          }
        }
      } catch (err) {
        console.error("[assistant] stream read error:", err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":      "text/event-stream; charset=utf-8",
      "Cache-Control":     "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}