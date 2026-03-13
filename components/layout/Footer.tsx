// FILE: components/layout/Footer.tsx

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import VisitorCounter from "@/components/shared/VisitorCounter";
import CurrentlyInto from "@/components/shared/CurrentlyInto";

/*
 * OPTION A — Spotify Premium widget
 * Uncomment this import when ready to activate.
 * See full setup instructions in components/shared/SpotifyWidget.tsx
 *
 * import SpotifyWidget from "@/components/shared/SpotifyWidget";
 */

export default function Footer() {
  return (
    <footer className="ft" aria-label="Site footer">

      {/*
       * ── CURRENTLY INTO (Option C — active) ──────────────────
       * Updated via: /admin/currently-into?key=YOUR_SECRET
       * Shows: reading / watching / building / listening items
       * Update maybe once a month. No tracking, no API needed.
       */}
      <div className="ft-currently-into">
        <CurrentlyInto />
      </div>

      {/*
       * ── SPOTIFY WIDGET (Option A — inactive) ─────────────────
       * Requires Spotify Premium + env vars.
       * Full setup: see components/shared/SpotifyWidget.tsx
       * Toggle:     /admin/spotify-toggle?key=YOUR_SECRET
       *
       * To activate:
       *   1. Complete Spotify setup in SpotifyWidget.tsx comments
       *   2. Uncomment the Spotify block in app/api/spotify/route.ts
       *   3. Comment out the Currently Into block above
       *   4. Uncomment the SpotifyWidget block below
       *
       * <div className="ft-spotify">
       *   <SpotifyWidget />
       * </div>
       */}

      <div className="ft-divider" />

      {/* Main row */}
      <div className="ft-row">
        <span className="ft-name">Abhinav Chaurasia</span>
        <span className="ft-built">Built with Next.js · Deployed on Vercel</span>
        <nav className="ft-links" aria-label="Social links">
          <a
            href="https://github.com/abhinavchaurasia-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="ft-link"
            aria-label="GitHub"
          >
            <Github size={16} strokeWidth={1.5} />
          </a>
          <a
            href="https://linkedin.com/in/abhinavchaurasia-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="ft-link"
            aria-label="LinkedIn"
          >
            <Linkedin size={16} strokeWidth={1.5} />
          </a>
          <Link href="mailto:abhinavc037@gmail.com" className="ft-link" aria-label="Email">
            <Mail size={16} strokeWidth={1.5} />
          </Link>
        </nav>
      </div>

      {/* Visitor counter */}
      <div className="ft-counter">
        <VisitorCounter />
      </div>

      <style>{`
        .ft {
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          padding: 40px clamp(24px, 5vw, 80px) 32px;
        }
        .ft-currently-into { max-width: 400px; margin-bottom: 32px; }
        .ft-spotify { display: flex; justify-content: center; margin-bottom: 24px; }
        .ft-divider { height: 1px; background: var(--color-border-subtle, #1F1F1F); margin-bottom: 24px; }
        .ft-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .ft-name { font-family: var(--font-geist-mono, "Geist Mono", monospace); font-size: 12px; color: var(--color-text-muted, #444444); }
        .ft-built { font-family: var(--font-geist-mono, "Geist Mono", monospace); font-size: 11px; color: var(--color-text-muted, #444444); flex: 1; text-align: center; }
        .ft-links { display: flex; align-items: center; gap: 16px; }
        .ft-link { display: flex; align-items: center; color: var(--color-text-muted, #444444); text-decoration: none; transition: color 150ms ease; }
        .ft-link:hover { color: var(--color-text-primary, #F0F0F0); }
        .ft-counter { margin-top: 16px; display: flex; justify-content: center; }
        @media (max-width: 560px) {
          .ft-row { flex-direction: column; align-items: flex-start; gap: 12px; }
          .ft-built { text-align: left; flex: none; }
        }
        @media (prefers-reduced-motion: reduce) { .ft-link { transition: none; } }
      `}</style>
    </footer>
  );
}