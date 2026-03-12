"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Download, ArrowRight, Github, Linkedin, Mail } from "lucide-react";

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

  const socialLinks: SocialLink[] = [
    {
      label: "GitHub",
      href: "https://github.com/abhinavchaurasia-dev",
      icon: <Github size={18} strokeWidth={1.5} aria-hidden="true" />,
      newTab: true,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/abhinavchaurasia-dev",
      icon: <Linkedin size={18} strokeWidth={1.5} aria-hidden="true" />,
      newTab: true,
    },
    {
      label: "Email",
      href: "mailto:abhinavc037@gmail.com",
      icon: <Mail size={18} strokeWidth={1.5} aria-hidden="true" />,
      newTab: false,
    },
  ];

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
        <span className="hero-availability-text">
          Open to SWE roles · 2026
        </span>
      </div>

      {/* ── ROW 2: Name ── */}
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

      {/* ── ROW 3: Role ── */}
      <p className="hero-role">
        Full-Stack Engineer · AI Integrations · Django · React
      </p>

      {/* ── ROW 4: CTAs ── */}
      <div className="hero-ctas" role="group" aria-label="Primary actions">
        <a
          href="/Abhinav_Chaurasia_Resume.pdf"
          download
          className="hero-btn"
          aria-label="Download Resume / CV"
        >
          <Download size={16} strokeWidth={1.5} aria-hidden="true" />
          Resume / CV
        </a>

        <Link href="/work" className="hero-btn" aria-label="View work">
          View Work
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </Link>
      </div>

      {/* ── ROW 5: Social links ── */}
      <nav className="hero-social" aria-label="Social links">
        {socialLinks.map(({ label, href, icon, newTab }) => (
          <a
            key={label}
            href={href}
            className="hero-social-link"
            aria-label={label}
            {...(newTab
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {icon}
          </a>
        ))}
      </nav>

      {/* ── Scoped styles ── */}
      <style>{`
        .hero {
          padding-top: 80px;
          padding-bottom: 64px;
        }

        /* Row 1 — availability */
        .hero-availability {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }

        .hero-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-accent, #4AFF91);
          flex-shrink: 0;
        }

        .hero-availability-text {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          letter-spacing: 0.02em;
        }

        /* Row 2 — name */
        .hero-name {
          font-family: var(--font-instrument-serif, "Instrument Serif", serif);
          font-size: 56px;
          font-weight: 400;
          font-style: italic;
          color: var(--color-text-primary, #F0F0F0);
          line-height: 1.0;
          margin-bottom: 16px;
          letter-spacing: -0.01em;
        }

        .hero-name-word {
          display: inline-block;
        }

        @media (max-width: 767px) {
          .hero-name {
            font-size: 38px;
          }
          .hero {
            padding-top: 48px;
          }
        }

        /* Row 3 — role */
        .hero-role {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 15px;
          color: var(--color-text-secondary, #888888);
          line-height: 1.75;
          margin-bottom: 32px;
        }

        /* Row 4 — CTAs */
        .hero-ctas {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 36px;
          padding: 0 16px;
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

        .hero-btn:hover {
          border-color: var(--color-accent-border, #4AFF9130);
        }

        /* Row 5 — social links */
        .hero-social {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .hero-social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-muted, #444444);
          text-decoration: none;
          transition: color 150ms ease;
        }

        .hero-social-link:hover {
          color: var(--color-text-primary, #F0F0F0);
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-btn {
            transition: none;
          }
          .hero-social-link {
            transition: none;
          }
        }
      `}</style>
    </motion.section>
  );
}