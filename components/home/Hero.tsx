"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight, Github, Linkedin,
  Mail, Volume2, MapPin, Copy, Check, Clock,
} from "lucide-react";

/* ============================================================
   ROLE FLIPPER — cycles through roles with flip-down animation
   ============================================================ */

const ROLES = [
  "Full-Stack Engineer",
  "AI Integrations",
  "Django · React · Node.js",
  "Open to 2026 Roles",
] as const;

/* ============================================================
   INLINE SVG ICONS for brands not in lucide
   ============================================================ */

function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function MediumIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

/* ============================================================
   ANIMATION VARIANTS
   ============================================================ */

const EASE_OUT = [0, 0, 0.2, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  }),
};

/* ============================================================
   TYPES
   ============================================================ */

interface SocialLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  newTab: boolean;
}

/* ============================================================
   HERO COMPONENT
   ============================================================ */

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [showTzTooltip, setShowTzTooltip] = useState(false);

  const EMAIL = "abhinavc037@gmail.com";
  const TZ = "Asia/Kolkata";
  const TZ_LABEL = "UTC+5:30";

  /* Role flipper — swap every 2.5s with flip-out/flip-in */
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIndex(i => (i + 1) % ROLES.length);
        setRoleVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  /* Live clock in IST */
  useEffect(() => {
    function tick() {
      const now = new Date().toLocaleTimeString("en-IN", {
        timeZone: TZ,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setCurrentTime(now);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const socialLinks: SocialLink[] = [
    {
      label: "GitHub",
      href: "https://github.com/abhinavchaurasia-dev",
      icon: <Github size={15} strokeWidth={1.5} aria-hidden="true" />,
      newTab: true,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/abhinavchaurasia-dev",
      icon: <Linkedin size={15} strokeWidth={1.5} aria-hidden="true" />,
      newTab: true,
    },
    {
      label: "Twitter",
      href: "https://twitter.com/abhinavchaurasia",
      icon: <TwitterIcon />,
      newTab: true,
    },
    {
      label: "YouTube",
      href: "https://youtube.com/@abhinavchaurasia",
      icon: <YouTubeIcon />,
      newTab: true,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/abhinavchaurasia",
      icon: <InstagramIcon />,
      newTab: true,
    },
    {
      label: "Medium",
      href: "https://medium.com/@abhinavchaurasia",
      icon: <MediumIcon />,
      newTab: true,
    },
    {
      label: "Email",
      href: `mailto:${EMAIL}`,
      icon: <Mail size={15} strokeWidth={1.5} aria-hidden="true" />,
      newTab: false,
    },
  ];

  function playPronunciation() {
    const audio = new Audio("/name-pronunciation.mp3");
    audio.play();
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const el = document.createElement("textarea");
      el.value = EMAIL;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  }

  return (
    <motion.section
      className="hero"
      variants={reduceMotion ? undefined : sectionVariants}
      initial={reduceMotion ? undefined : "hidden"}
      animate={reduceMotion ? undefined : "visible"}
      aria-label="Introduction"
    >
      {/* ── ROW 1: Availability ── */}
      <div className="hero-availability" aria-label="Availability status">
        <span className="hero-dot" aria-hidden="true" />
        <span className="hero-availability-text">Open to SWE roles · 2026</span>
      </div>

      {/* ── ROW 2: Photo standalone ── */}
      <div className="hero-photo-wrap" aria-hidden="true">
        <div className="hero-photo-ring" />
        <Image
          src="/abhinav.jpg"
          alt="Abhinav Chaurasia"
          width={80}
          height={80}
          className="hero-photo"
          priority
        />
      </div>

      {/* ── ROW 3: Name + pronunciation ── */}
      <div className="hero-name-line">
        <h1 className="hero-name" aria-label="Abhinav Chaurasia">
          <motion.span
            className="hero-name-word"
            variants={reduceMotion ? undefined : wordVariants}
            initial={reduceMotion ? undefined : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            custom={0}
          >
            Abhinav
          </motion.span>
          {" "}
          <motion.span
            className="hero-name-word"
            variants={reduceMotion ? undefined : wordVariants}
            initial={reduceMotion ? undefined : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            custom={0.08}
          >
            Chaurasia
          </motion.span>
        </h1>
        <button
          className="hero-pronounce-btn"
          onClick={playPronunciation}
          aria-label="Hear pronunciation"
          title="Hear pronunciation"
          type="button"
        >
          <Volume2 size={13} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      {/* ── ROW 4: Flipping role ── */}
      <div className="hero-role-flip-wrap" aria-live="polite" aria-label="Current role">
        <AnimatePresence mode="wait">
          {roleVisible && (
            <motion.span
              key={ROLES[roleIndex]}
              className="hero-role-flip"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
            >
              {ROLES[roleIndex]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── ROW 5: Bio ── */}
      <p className="hero-bio">
        I build full-stack systems that use AI as an architectural component —
        CLIP embeddings, GPT-4o, Gemini — not features bolted on afterward.
      </p>

      {/* ── ROW 6: Info grid ── */}
      <div className="hero-info-grid">
        <div className="hero-info-item">
          <MapPin size={13} strokeWidth={1.5} className="hero-info-icon" aria-hidden="true" />
          <span className="hero-info-value">Lucknow, India</span>
        </div>

        <div
          className="hero-info-item hero-info-item--tz"
          onMouseEnter={() => setShowTzTooltip(true)}
          onMouseLeave={() => setShowTzTooltip(false)}
        >
          <Clock size={13} strokeWidth={1.5} className="hero-info-icon" aria-hidden="true" />
          <span className="hero-info-value hero-info-tz">
            {currentTime || "—"}
            <span className="hero-tz-sep">//</span>
            <span className="hero-tz-offset">{TZ_LABEL}</span>
          </span>
          <AnimatePresence>
            {showTzTooltip && (
              <motion.span
                className="hero-tz-tooltip"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                role="tooltip"
              >
                {TZ}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div
          className={`hero-info-item hero-info-item--email${emailCopied ? " hero-info-item--copied" : ""}`}
          onClick={copyEmail}
          role="button"
          tabIndex={0}
          aria-label={emailCopied ? "Email copied" : "Copy email address"}
          onKeyDown={e => e.key === "Enter" && copyEmail()}
        >
          <Mail size={13} strokeWidth={1.5} className="hero-info-icon" aria-hidden="true" />
          <a
            href={`mailto:${EMAIL}`}
            className="hero-info-email-link"
            onClick={e => e.stopPropagation()}
          >
            {EMAIL}
          </a>
          <span className="hero-info-copy-icon" aria-hidden="true">
            {emailCopied
              ? <Check size={12} strokeWidth={2} />
              : <Copy size={12} strokeWidth={1.5} />
            }
          </span>
        </div>
      </div>

      {/* ── ROW 7: CTAs ── */}
      <div className="hero-ctas" role="group" aria-label="Primary actions">
        <Link href="/resume" className="hero-btn" aria-label="View Resume">
          Resume
          <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
        </Link>
        <Link href="/work" className="hero-btn" aria-label="View work">
          View Work
          <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>

      {/* ── ROW 8: Icon-only socials — no Email ── */}
      <nav className="hero-social" aria-label="Social links">
        {socialLinks
          .filter(s => s.label !== "Email")
          .map(({ label, href, icon, newTab }) => (
            <a
              key={label}
              href={href}
              className="hero-social-link"
              aria-label={label}
              title={label}
              {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {icon}
            </a>
          ))}
      </nav>

      {/* ── Scoped styles ── */}
      <style>{`
        .hero {
          padding-top: 56px;
          padding-bottom: 40px;
        }

        /* ── Row 1: Availability ── */
        .hero-availability {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 20px;
        }
        .hero-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background-color: var(--color-accent, #4AFF91);
          flex-shrink: 0;
        }
        .hero-availability-text {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          letter-spacing: 0.04em;
        }

        /* ── Row 2: Photo standalone ── */
        .hero-photo-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 16px;
          flex-shrink: 0;
        }
        .hero-photo-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 2px solid transparent;
          transition: border-color 200ms ease, box-shadow 200ms ease;
          pointer-events: none;
          z-index: 1;
        }
        .hero-photo-wrap:hover .hero-photo-ring {
          border-color: var(--color-accent, #4AFF91);
          box-shadow:
            0 0 0 3px var(--color-accent-dim, #4AFF9114),
            0 0 20px 4px var(--color-accent-dim, #4AFF9114);
        }
        .hero-photo {
          width: 80px; height: 80px;
          border-radius: 50%;
          object-fit: cover;
          object-position: center top;
          display: block;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          transition: border-color 200ms ease;
        }
        .hero-photo-wrap:hover .hero-photo {
          border-color: transparent;
        }

        /* ── Row 3: Name + pronounce ── */
        .hero-name-line {
          display: flex;
          align-items: flex-end;
          gap: 10px;
          margin-bottom: 10px;
        }
        .hero-name {
          font-family: var(--font-instrument-serif, "Instrument Serif", serif);
          font-size: 56px;
          font-weight: 400;
          font-style: italic;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.0;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .hero-name-word { display: inline-block; }
        .hero-pronounce-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          min-width: 28px; min-height: 28px;
          background: none; border: none;
          padding: 4px;
          margin-bottom: 8px;
          color: var(--color-text-muted, #444444);
          cursor: pointer;
          transition: color 150ms ease;
        }
        .hero-pronounce-btn:hover { color: var(--color-text-primary, #F0F0F0); }
        .hero-pronounce-btn:focus-visible {
          outline: 1px solid var(--color-accent-border, #4AFF9130);
          border-radius: 3px; outline-offset: 2px;
        }

        /* ── Row 4: Flipping role ── */
        .hero-role-flip-wrap {
          height: 22px;
          overflow: hidden;
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .hero-role-flip {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1;
          display: block;
        }

        /* ── Row 5: Bio ── */
        .hero-bio {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.65;
          margin: 0 0 20px;
          max-width: 520px;
        }

        /* ── Row 6: Info grid ── */
        .hero-info-grid {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
        }
        .hero-info-item {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          position: relative;
        }
        .hero-info-icon {
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
        }
        .hero-info-value {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-secondary, #888888);
          line-height: 1;
        }
        /* Timezone */
        .hero-info-item--tz { cursor: default; }
        .hero-info-tz {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .hero-tz-sep {
          color: var(--color-text-muted, #444444);
          font-size: 11px;
        }
        .hero-tz-offset {
          font-size: 11px;
          color: var(--color-text-muted, #444444);
        }
        .hero-tz-tooltip {
          position: absolute;
          left: 0;
          top: calc(100% + 6px);
          background: var(--color-bg-overlay, #141414);
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 5px;
          padding: 4px 8px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-secondary, #888888);
          white-space: nowrap;
          z-index: 10;
          pointer-events: none;
        }
        /* Email */
        .hero-info-item--email { cursor: pointer; }
        .hero-info-item--email:hover .hero-info-copy-icon { opacity: 1; }
        .hero-info-item--copied .hero-info-copy-icon {
          opacity: 1;
          color: var(--color-accent, #4AFF91);
        }
        .hero-info-email-link {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 12px;
          color: var(--color-text-secondary, #888888);
          text-decoration: none;
          transition: color 150ms ease;
        }
        .hero-info-item--email:hover .hero-info-email-link {
          color: var(--color-text-primary, #F0F0F0);
        }
        .hero-info-copy-icon {
          display: inline-flex;
          align-items: center;
          color: var(--color-text-muted, #444444);
          opacity: 0;
          transition: opacity 150ms ease, color 150ms ease;
          flex-shrink: 0;
        }

        /* ── Row 7: CTAs ── */
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 34px;
          padding: 0 14px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          background: transparent;
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 6px;
          text-decoration: none;
          cursor: pointer;
          transition: border-color 150ms ease;
          white-space: nowrap;
        }
        .hero-btn:hover { border-color: var(--color-border-strong, #3A3A3A); }

        /* ── Row 8: Icon-only social links ── */
        .hero-social {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .hero-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          transition: color 150ms ease;
          /* 44px touch target */
          min-width: 44px;
          min-height: 44px;
        }
        .hero-social-link:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* ── Mobile ≤767px ── */
        @media (max-width: 767px) {
          .hero { padding-top: 36px; padding-bottom: 32px; }
          .hero-photo-wrap { width: 64px; height: 64px; margin-bottom: 12px; }
          .hero-photo { width: 64px; height: 64px; }
          .hero-name { font-size: 38px; }
          .hero-role-flip-wrap { height: 20px; margin-bottom: 12px; }
          .hero-role-flip { font-size: 14px; }
          .hero-bio { font-size: 13px; margin-bottom: 16px; }
          .hero-info-grid { padding-top: 16px; margin-bottom: 20px; }
          .hero-ctas { gap: 8px; margin-bottom: 16px; }
          .hero-btn { flex: 1 1 auto; justify-content: center; min-width: 0; }
          .hero-social { gap: 8px; }
          .hero-social-link { min-width: 40px; min-height: 40px; }
          /* Always show copy icon on mobile */
          .hero-info-copy-icon { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-btn, .hero-social-link, .hero-pronounce-btn,
          .hero-photo-ring, .hero-photo,
          .hero-info-copy-icon { transition: none; }
        }
      `}</style>

    </motion.section>
  );
}