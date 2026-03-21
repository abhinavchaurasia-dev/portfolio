// FILE: components/layout/Footer.tsx

import Link from "next/link";
import VisitorCounter from "@/components/shared/VisitorCounter";

/* ── Brand SVG icons not in lucide ── */
function TwitterIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function YouTubeIcon()   { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>; }
function InstagramIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>; }
function MediumIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>; }
function GithubIcon()    { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>; }
function LinkedinIcon()  { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>; }
function MailIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>; }

const NAVIGATE_LINKS = [
  { label: "Home",      href: "/"        },
  { label: "Work",      href: "/work"    },
  { label: "Projects",  href: "/projects"},
  { label: "Blogs",     href: "/writing" },
  { label: "About",     href: "/about"   },
  { label: "Resume",    href: "/resume" },
  { label: "Setup",     href: "/uses"    },
  { label: "Gears",     href: "/gears"   },
];

const CONNECT_LINKS = [
  { label: "Twitter",   href: "https://twitter.com/abhinavchaurasia",           icon: <TwitterIcon />   },
  { label: "LinkedIn",  href: "https://linkedin.com/in/abhinavchaurasia-dev",   icon: <LinkedinIcon />  },
  { label: "GitHub",    href: "https://github.com/abhinavchaurasia-dev",        icon: <GithubIcon />    },
  { label: "YouTube",   href: "https://youtube.com/@abhinavchaurasia",          icon: <YouTubeIcon />   },
  { label: "Instagram", href: "https://instagram.com/abhinavchaurasia",         icon: <InstagramIcon /> },
  { label: "Medium",    href: "https://medium.com/@abhinavchaurasia",           icon: <MediumIcon />    },
  { label: "Email",     href: "mailto:abhinavc037@gmail.com",                   icon: <MailIcon />      },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="ft" aria-label="Site footer">
      <div className="ft-inner">

        {/* ── Top section: NAVIGATE + CONNECT ── */}
        <div className="ft-top">

          {/* NAVIGATE */}
          <div className="ft-col">
            <p className="ft-col-heading">Navigate</p>
            <ul className="ft-nav-list" role="list">
              {NAVIGATE_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="ft-nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONNECT */}
          <div className="ft-col">
            <p className="ft-col-heading">Connect</p>
            <div className="ft-connect-grid" role="list">
              {CONNECT_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="ft-connect-btn"
                  aria-label={label}
                  role="listitem"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom row: copyright + visitor counter ── */}
        <div className="ft-bottom">
          <span className="ft-copy">© {year} Abhinav Chaurasia. All rights reserved.</span>
          <VisitorCounter />
        </div>

      </div>

      <style>{`
        .ft {
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          padding-top: 48px;
          padding-bottom: 32px;
          margin-top: 80px;
        }

        .ft-inner {
          max-width: 720px;
          width: 100%;
          margin-inline: auto;
          padding-inline: clamp(24px, 5vw, 80px);
        }

        /* ── Top: two columns ── */
        .ft-top {
          display: flex;
          justify-content: space-between;
          gap: 48px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .ft-col {
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-width: 120px;
        }

        .ft-col-heading {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted, #444444);
          margin: 0;
        }

        /* NAVIGATE list */
        .ft-nav-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px 24px;
          list-style: none;
          margin: 0;
          padding: 0;
          max-width: 340px;
        }

        .ft-nav-link {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          transition: color 150ms ease;
          white-space: nowrap;
        }
        .ft-nav-link:hover { color: var(--color-text-primary, #F0F0F0); }

        /* CONNECT grid — 2×N icon buttons */
        .ft-connect-grid {
          display: grid;
          grid-template-columns: repeat(4, 36px);
          gap: 8px;
        }

        .ft-connect-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 8px;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          transition: color 150ms ease, border-color 150ms ease;
        }
        .ft-connect-btn:hover {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-default, #2A2A2A);
        }

        /* ── Bottom row ── */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
        }

        .ft-copy {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
        }

        @media (max-width: 560px) {
          .ft-top { flex-direction: column; gap: 32px; }
          .ft-connect-grid { grid-template-columns: repeat(4, 36px); }
          .ft-bottom { flex-direction: column; align-items: flex-start; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ft-nav-link, .ft-connect-btn { transition: none; }
        }
      `}</style>
    </footer>
  );
}

