/*
 * FILE: app/admin/spotify-toggle/page.tsx
 * PAGE URL: /admin/spotify-toggle?key=YOUR_SECRET
 * ============================================================
 * SPOTIFY TOGGLE ADMIN — Option A (Spotify Premium) ONLY
 * It does nothing until you:
 *   1. Complete Spotify Premium setup (see SpotifyWidget.tsx)
 *   2. Uncomment the Spotify block in app/api/spotify/route.ts
 *
 * Once active:
 *   - Toggle ON  → live tracking enabled, widget shows real-time
 *   - Toggle OFF → live tracking disabled, widget shows last played
 *
 * Bookmark: https://yourdomain.com/admin/spotify-toggle?key=SECRET
 * ============================================================
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ExternalLink } from "lucide-react";

export default function SpotifyTogglePage() {
  const searchParams          = useSearchParams();
  const secretKey             = searchParams.get("key") ?? "";
  const [isLive, setIsLive]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState("");

  const fetchState = useCallback(async () => {
    if (!secretKey) return;
    try {
      const res  = await fetch(`/api/admin/spotify-toggle?key=${secretKey}`);
      if (res.status === 401) return;
      const data = await res.json() as { isLive: boolean };
      setIsLive(data.isLive);
    } catch { /* silent */ }
  }, [secretKey]);

  useEffect(() => { fetchState(); }, [fetchState]);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/spotify-toggle", {
        method:  "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key":  secretKey,
        },
        body: JSON.stringify({ isLive: !isLive }),
      });

      if (res.status === 401) { setStatus("Invalid secret key"); return; }
      if (!res.ok)            { setStatus("Failed");              return; }

      const data = await res.json() as { isLive: boolean };
      setIsLive(data.isLive);
      setStatus(data.isLive ? "Live tracking ON" : "Live tracking OFF");
      setTimeout(() => setStatus(""), 3000);
    } catch {
      setStatus("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!secretKey) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center",
        justifyContent:"center", background:"#080808", color:"#444",
        fontFamily:"monospace", fontSize:"13px" }}>
        Access denied. Secret key required.
      </div>
    );
  }

  return (
    <div className="st">
      <div className="st-header">
        <span className="st-title">Spotify Live Toggle</span>
        <a href="/" className="st-back" target="_blank" rel="noopener noreferrer">
          View Portfolio <ExternalLink size={11} strokeWidth={1.5} />
        </a>
      </div>

      <div className="st-note">
        Option A — requires Spotify Premium + env vars configured.
        See comments in <code>SpotifyWidget.tsx</code> for setup.
      </div>

      <div className="st-card">
        {/* Status indicator */}
        <div className="st-state">
          <div className={`st-dot${isLive ? " st-dot--live" : ""}`} />
          <div className="st-state-info">
            <span className="st-state-label">
              {isLive ? "Live tracking ON" : "Live tracking OFF"}
            </span>
            <span className="st-state-sub">
              {isLive
                ? "Widget shows what you're currently playing on Spotify"
                : "Widget shows last played track — no active tracking"}
            </span>
          </div>
        </div>

        {/* Toggle button */}
        <button
          className={`st-toggle${isLive ? " st-toggle--on" : " st-toggle--off"}`}
          onClick={handleToggle}
          disabled={loading}
        >
          {loading ? "Updating..." : isLive ? "Turn OFF" : "Turn ON"}
        </button>

        {status && (
          <div className="st-status">{status}</div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { background: #080808; margin: 0; font-family: "Geist", -apple-system, sans-serif; }

        .st { max-width: 400px; margin: 0 auto; padding: 48px 24px; display: flex; flex-direction: column; gap: 24px; }

        .st-header { display: flex; align-items: center; justify-content: space-between; }
        .st-title  { font-size: 15px; font-weight: 600; color: #F0F0F0; }
        .st-back   { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #444; text-decoration: none; }
        .st-back:hover { color: #888; }

        .st-note {
          font-family: "Geist Mono", monospace;
          font-size: 11px;
          color: #444;
          background: #FFB84A12;
          border: 1px solid #FFB84A25;
          border-radius: 6px;
          padding: 10px 12px;
          line-height: 1.6;
        }
        .st-note code { color: #FFB84A; }

        .st-card {
          background: #0F0F0F;
          border: 1px solid #1F1F1F;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .st-state { display: flex; align-items: flex-start; gap: 12px; }

        .st-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #333; flex-shrink: 0; margin-top: 4px;
          transition: background 300ms;
        }
        .st-dot--live { background: #1DB954; animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

        .st-state-info  { display: flex; flex-direction: column; gap: 4px; }
        .st-state-label { font-size: 14px; font-weight: 500; color: #F0F0F0; }
        .st-state-sub   { font-size: 12px; color: #444; line-height: 1.5; }

        .st-toggle {
          font-family: "Geist", sans-serif;
          font-size: 13px; font-weight: 500;
          border: none; border-radius: 6px;
          padding: 10px 16px; cursor: pointer;
          transition: opacity 150ms; width: 100%;
        }
        .st-toggle--off { color: #080808; background: #1DB954; }
        .st-toggle--on  { color: #F0F0F0; background: #1F1F1F; border: 1px solid #333; }
        .st-toggle:hover:not(:disabled) { opacity: 0.85; }
        .st-toggle:disabled { opacity: 0.3; cursor: default; }

        .st-status {
          font-family: "Geist Mono", monospace;
          font-size: 11px; color: #888; text-align: center;
        }
      `}</style>
    </div>
  );
}