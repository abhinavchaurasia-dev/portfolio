import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

/* ============================================================
   NEXT.JS CONFIG
   - Image optimisation (Spotify CDN + self-hosted)
   - Bundle analyser (ANALYZE=true npm run build)
   - Security headers
   - Font optimisation (already handled by next/font, 
     but we disable the legacy default here)
   ============================================================ */

const nextConfig: NextConfig = {
  /* ── Image optimisation ── */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,          // 1 hour for external images
    remotePatterns: [
      {
        // Spotify album art CDN
        protocol: "https",
        hostname: "i.scdn.co",
        pathname: "/image/**",
      },
      {
        // Spotify mosaic CDN
        protocol: "https",
        hostname: "mosaic.scdn.co",
      },
      {
        // Generic Spotify CDN variant
        protocol: "https",
        hostname: "*.spotifycdn.com",
      },
    ],
  },

  /* ── Compiler options ── */
  compiler: {
    // Remove console.log in production (keep warn/error)
    removeConsole: process.env.NODE_ENV === "production"
      ? { exclude: ["warn", "error"] }
      : false,
  },

  /* ── Experimental ── */
  experimental: {
    // Optimise CSS (requires critters package if using App Router CSS-in-JS)
    optimizeCss: false,
  },

  /* ── Security & perf headers ── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          /* Prevent MIME sniffing */
          { key: "X-Content-Type-Options",    value: "nosniff"          },
          /* Clickjacking protection */
          { key: "X-Frame-Options",           value: "DENY"             },
          /* XSS protection (legacy browsers) */
          { key: "X-XSS-Protection",          value: "1; mode=block"    },
          /* Referrer policy */
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          /* Content Security Policy */
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self'",
              "connect-src 'self' https://api.openai.com https://openrouter.ai https://*.upstash.io wss://*.upstash.io",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
          /* Permissions policy — disable unused APIs */
          {
            key:   "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          /* HSTS — only enable when fully on HTTPS */
          {
            key:   "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      /* Allow PDF to be embedded via <object> on the same origin */
      {
        source: "/resume.pdf",
        headers: [
          { key: "X-Frame-Options",       value: "SAMEORIGIN"                    },
          { key: "Content-Type",          value: "application/pdf"               },
          { key: "Content-Disposition",   value: "inline; filename=\"resume.pdf\"" },
        ],
      },
      /* Long-term cache for static assets */
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key:   "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      /* Font files */
      {
        source: "/fonts/(.*)",
        headers: [
          {
            key:   "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* ── Redirects ── */
  async redirects() {
    return [];
  },

};

/* ── Bundle analyser ── */
// Run: ANALYZE=true npm run build
// Requires: npm install -D @next/bundle-analyzer
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);