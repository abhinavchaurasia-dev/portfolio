/*
 * FILE: components/shared/SpotifyWidget.tsx
 * ============================================================
 * SPOTIFY WIDGET — Option A (Requires Spotify Premium)
 * ============================================================
 *
 * HOW TO ACTIVATE:
 * 1. Buy Spotify Premium
 * 2. Create app at developer.spotify.com/dashboard
 *    - App name: anything
 *    - Redirect URI: https://yourdomain.com/callback
 *    - Check: Web API only
 * 3. Get Client ID + Client Secret from dashboard
 * 4. Get refresh token:
 *    a. Visit in browser (replace CLIENT_ID):
 *       https://accounts.spotify.com/authorize
 *         ?client_id=CLIENT_ID
 *         &response_type=code
 *         &redirect_uri=https://yourdomain.com/callback
 *         &scope=user-read-currently-playing,user-read-recently-played
 *    b. After auth, copy the `code` from the redirect URL
 *    c. Run in terminal:
 *       curl -X POST https://accounts.spotify.com/api/token \
 *         -H "Content-Type: application/x-www-form-urlencoded" \
 *         -d "grant_type=authorization_code
 *             &code=YOUR_CODE
 *             &redirect_uri=https://yourdomain.com/callback" \
 *         -u "CLIENT_ID:CLIENT_SECRET"
 *    d. Copy `refresh_token` from the response
 * 5. Add to .env.local:
 *       SPOTIFY_CLIENT_ID=...
 *       SPOTIFY_CLIENT_SECRET=...
 *       SPOTIFY_REFRESH_TOKEN=...
 * 6. In app/api/spotify/route.ts — uncomment the Spotify Premium
 *    block and comment out the Redis block
 * 7. In Footer.tsx — swap <CurrentlyInto /> for <SpotifyWidget />
 *    OR keep both — CurrentlyInto in footer, SpotifyWidget above it
 * 8. In /admin/spotify-toggle — use the toggle to control
 *    when live tracking is on or off
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Track {
  title:     string;
  artist:    string;
  albumArt:  string;
  isPlaying: boolean;
}

export default function SpotifyWidget() {
  const [track, setTrack]   = useState<Track | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchTrack() {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) return;
        const data = await res.json() as { track: Track | null };
        if (!cancelled) { setTrack(data.track); setLoaded(true); }
      } catch {
        if (!cancelled) setLoaded(true);
      }
    }
    fetchTrack();
    return () => { cancelled = true; };
  }, []);

  if (!loaded || !track) return null;

  return (
    <div className="sw" aria-label={`${track.isPlaying ? "Now playing" : "Last played"}: ${track.title} by ${track.artist}`}>
      <div className="sw-art">
        {track.albumArt ? (
          <Image src={track.albumArt} alt={`${track.title} album art`}
            width={32} height={32} className="sw-img" unoptimized />
        ) : (
          <div className="sw-art-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="sw-info">
        <span className="sw-label">{track.isPlaying ? "now playing" : "last played"}</span>
        <span className="sw-title">{track.title}</span>
        <span className="sw-artist">{track.artist}</span>
      </div>
      <svg className="sw-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      <style>{`
        .sw { display:flex; align-items:center; gap:10px; width:280px; height:52px; padding:0 14px; background-color:var(--color-bg-elevated,#0F0F0F); border:1px solid var(--color-border-subtle,#1F1F1F); border-radius:8px; overflow:hidden; flex-shrink:0; }
        .sw-art { width:32px; height:32px; border-radius:50%; overflow:hidden; flex-shrink:0; }
        .sw-img { width:32px; height:32px; border-radius:50%; object-fit:cover; display:block; }
        .sw-art-placeholder { width:32px; height:32px; border-radius:50%; background:var(--color-bg-inset,#1A1A1A); }
        .sw-info { display:flex; flex-direction:column; gap:1px; min-width:0; flex:1; }
        .sw-label { font-family:var(--font-geist-mono,"Geist Mono",monospace); font-size:9px; text-transform:uppercase; letter-spacing:.06em; color:var(--color-text-muted,#444); line-height:1.2; }
        .sw-title { font-family:var(--font-geist-mono,"Geist Mono",monospace); font-size:11px; font-weight:500; color:var(--color-text-primary,#F0F0F0); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.3; }
        .sw-artist { font-family:var(--font-geist-mono,"Geist Mono",monospace); font-size:10px; color:var(--color-text-muted,#444); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.2; }
        .sw-logo { width:14px; height:14px; color:#1DB954; flex-shrink:0; opacity:.7; }
      `}</style>
    </div>
  );
}

