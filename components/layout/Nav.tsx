"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, Sun, Moon, Search } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

interface NavLink {
  label: string;
  href: string;
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const NAV_LINKS: NavLink[] = [
  { label: "Home",    href: "/"        },
  { label: "Work",    href: "/work"    },
  { label: "Projects",href: "/projects"},
  { label: "Blogs",   href: "/writing" },
  { label: "About",   href: "/about"   },
  { label: "Resume",  href: "/resume"  },
];

const STORAGE_KEY = "theme-preference";

/* ============================================================
   HELPERS
   ============================================================ */

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

/* ============================================================
   NAV COMPONENT
   ============================================================ */

export default function Nav() {
  const pathname                      = usePathname();
  const [theme, setTheme]             = useState<"dark" | "light">(getInitialTheme);
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const drawerRef                     = useRef<HTMLDivElement>(null);
  const hamburgerRef                  = useRef<HTMLButtonElement>(null);

  /* Apply theme to <html> data-theme attribute */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  /* Close drawer on route change */
  useEffect(() => {
    if (!drawerOpen) return;
    const id = requestAnimationFrame(() => setDrawerOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname, drawerOpen]);

  /* Close drawer on outside click */
  useEffect(() => {
    if (!drawerOpen) return;

    function handleOutsideClick(e: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setDrawerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [drawerOpen]);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /* Close drawer on Escape key */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && drawerOpen) setDrawerOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const openCommandPalette = useCallback(() => {
    window.dispatchEvent(new CustomEvent("openCommandPalette"));
  }, []);

  /* Active link detection — match exact or sub-paths */
  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* ====================================================
          NAV BAR
          ==================================================== */}
      <header className="nav-bar">
        <nav className="nav-inner" aria-label="Main navigation">

          {/* ---------- LEFT: Logomark ---------- */}
          <Link href="/" className="nav-logo" aria-label="Abhinav Chaurasia — home">
            <Image
              src="/logo.svg"
              alt="Abhinav Chaurasia"
              width={40}
              height={40}
              className="nav-logo-img"
              priority
            />
          </Link>

          {/* ---------- CENTER: Desktop links ---------- */}
          <ul className="nav-links" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`nav-link${isActive(href) ? " nav-link--active" : ""}`}
                  aria-current={isActive(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ---------- RIGHT: Actions ---------- */}
          <div className="nav-actions">
            {/* Search / Command Palette trigger */}
            <button
              className="nav-search-btn"
              onClick={openCommandPalette}
              aria-label="Open command palette"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Search size={12} strokeWidth={1.5} aria-hidden="true" />
              <span className="nav-search-label">Search</span>
              <kbd className="nav-search-kbd">⌘K</kbd>
            </button>

            {/* Theme toggle */}
            <button
              className="nav-icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun  size={16} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Moon size={16} strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              ref={hamburgerRef}
              className="nav-hamburger"
              onClick={() => setDrawerOpen((prev) => !prev)}
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen ? "true" : "false"}
              aria-controls="mobile-drawer"
            >
              {drawerOpen ? (
                <X    size={18} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Menu size={18} strokeWidth={1.5} aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* ====================================================
          MOBILE DRAWER OVERLAY
          ==================================================== */}
      {drawerOpen && (
        <div
          className="drawer-overlay"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ====================================================
          MOBILE DRAWER
          ==================================================== */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`mobile-drawer${drawerOpen ? " mobile-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav aria-label="Mobile navigation">
          <ul className="drawer-links" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`drawer-link${isActive(href) ? " drawer-link--active" : ""}`}
                  aria-current={isActive(href) ? "page" : undefined}
                  onClick={() => setDrawerOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ====================================================
          SCOPED STYLES
          ==================================================== */}
      <style>{`
        /* --- Nav bar shell — glassmorphism --- */
        .nav-bar {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 52px;
          /* Stronger glass: semi-transparent bg + blur + saturation */
          background-color: color-mix(in srgb, var(--color-bg-base, #080808) 70%, transparent);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          /* Subtle bottom border that acts as the glass edge */
          border-bottom: 1px solid color-mix(in srgb, var(--color-border-subtle, #1F1F1F) 60%, transparent);
        }

        /* Light theme glass */
        [data-theme="light"] .nav-bar {
          background-color: color-mix(in srgb, #FAFAFA 70%, transparent);
          border-bottom-color: color-mix(in srgb, #E0E0E0 60%, transparent);
        }

        /* --- Nav inner — 720px column, mirrors .page-wrapper --- */
        .nav-inner {
          height: 100%;
          max-width: 720px;
          width: 100%;
          margin-inline: auto;
          padding-inline: clamp(24px, 5vw, 80px);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* --- Logomark --- */
        .nav-logo {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-primary, #F0F0F0);
          letter-spacing: -0.01em;
          flex-shrink: 0;
          transition: opacity 150ms ease;
          /* 44px touch target height via line-height trick */
          display: flex;
          align-items: center;
          min-height: 44px;
        }
        .nav-logo:hover { opacity: 0.7; }

        /* Logo image sizing */
        .nav-logo-img {
          display: block;
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        /* --- Desktop nav links --- */
        .nav-links {
          display: none;
          align-items: center;
          gap: 24px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        @media (min-width: 768px) {
          .nav-links { display: flex; }
        }

        .nav-link {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 400;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          padding-bottom: 2px;
          transition: color 150ms ease;
          position: relative;
        }

        .nav-link:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        .nav-link--active {
          color: var(--color-text-primary, #F0F0F0);
          text-decoration: underline;
          text-decoration-color: var(--color-accent, #4AFF91);
          text-decoration-thickness: 1px;
          text-underline-offset: 4px;
        }

        /* --- Right actions cluster --- */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        /* --- Search button --- */
        .nav-search-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          background: transparent;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 4px;
          cursor: pointer;
          transition: border-color 150ms ease, color 150ms ease;
          white-space: nowrap;
          height: 28px;
        }
        .nav-search-btn:hover {
          color: var(--color-text-secondary, #888888);
          border-color: var(--color-border-default, #2A2A2A);
        }

        .nav-search-label {
          display: none;
        }
        @media (min-width: 480px) {
          .nav-search-label { display: inline; }
        }

        .nav-search-kbd {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          background: none;
          border: none;
          padding: 0;
        }

        /* --- Icon buttons (theme toggle) — 44×44 touch target --- */
        .nav-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          color: var(--color-text-secondary, #888888);
          background: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: color 150ms ease;
          flex-shrink: 0;
        }
        .nav-icon-btn:hover { color: var(--color-text-primary, #F0F0F0); }

        /* --- Hamburger button — mobile only, 44×44 touch target --- */
        .nav-hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          /* 44×44 minimum touch target per WCAG 2.5.5 */
          width: 44px;
          height: 44px;
          color: var(--color-text-secondary, #888888);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 150ms ease;
          flex-shrink: 0;
        }
        .nav-hamburger:hover { color: var(--color-text-primary, #F0F0F0); }

        @media (min-width: 768px) {
          .nav-hamburger { display: none; }
        }

        /* --- Drawer overlay --- */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          z-index: 40;
          background-color: rgba(8, 8, 8, 0.6);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          animation: overlayIn 150ms ease forwards;
        }

        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* --- Mobile drawer --- */
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 50;
          width: min(280px, 80vw);
          background-color: var(--color-bg-elevated, #0F0F0F);
          border-left: 1px solid var(--color-border-subtle, #1F1F1F);
          padding: 72px 32px 40px;
          transform: translateX(100%);
          transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
          /* Prevent content overflow on 375px */
          overflow-y: auto;
        }

        .mobile-drawer--open {
          transform: translateX(0);
        }

        @media (min-width: 768px) {
          .mobile-drawer { display: none; }
        }

        /* --- Drawer nav links — 44px tap targets --- */
        .drawer-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .drawer-link {
          display: flex;
          align-items: center;
          /* Enforces 44px minimum touch target height */
          min-height: 44px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 18px;
          font-weight: 500;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          padding: 0 4px;
          transition: color 150ms ease;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
        }
        .drawer-link:hover  { color: var(--color-text-primary, #F0F0F0); }

        .drawer-link--active {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* --- Reduced motion --- */
        @media (prefers-reduced-motion: reduce) {
          .mobile-drawer  { transition: none; }
          .drawer-overlay { animation: none; }
        }
      `}</style>
    </>
  );
}

