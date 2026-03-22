"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Briefcase,
  Copy,
  Cpu,
  Download,
  Folder,
  Github,
  Home,
  Linkedin,
  Moon,
  PenLine,
  Search,
  Sun,
  User,
  Wrench,
} from "lucide-react";

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.636L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function MediumIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

function HashnodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.75 20.5 7.875v8.25L12 21.25 3.5 16.125v-8.25L12 2.75z" />
      <path d="M12 9v6" />
      <path d="M9 12h6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

/* ============================================================
   CONTEXT — allows Nav (and any component) to open the palette
   without prop-drilling
   ============================================================ */

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue>({
  open: false,
  setOpen: () => {},
});

export function useCommandPalette(): CommandPaletteContextValue {
  return useContext(CommandPaletteContext);
}

/* ============================================================
   TYPES
   ============================================================ */

type CommandItem =
  | {
      id: string;
      label: string;
      icon: React.ReactNode;
      shortcut?: string;
      href: string;
      action?: never;
    }
  | {
      id: string;
      label: string;
      icon: React.ReactNode;
      shortcut?: string;
      href?: never;
      action: () => void;
    };

interface CommandGroup {
  heading: string;
  items: CommandItem[];
}

/* ============================================================
   THEME TOGGLE HELPER
   Reads/writes the same data-theme attribute as Nav.tsx
   ============================================================ */

function toggleTheme(): void {
  const html    = document.documentElement;
  const current = html.getAttribute("data-theme") ?? "dark";
  const next    = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  try { localStorage.setItem("theme-preference", next); } catch {}
}

function getCurrentTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return (document.documentElement.getAttribute("data-theme") as "dark" | "light") ?? "dark";
}

/* ============================================================
   COMMAND PALETTE
   ============================================================ */

export default function CommandPalette() {
  const router                    = useRouter();
  const [open, setOpen]           = useState(false);
  const [theme, setTheme]         = useState<"dark" | "light">(getCurrentTheme);
  const containerRef              = useRef<HTMLDivElement>(null);
  const triggerRef                = useRef<HTMLElement | null>(null);

  /* ── Open helpers ── */
  const openPalette = useCallback(() => {
    triggerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => {
      if (triggerRef.current && document.contains(triggerRef.current)) {
        triggerRef.current.focus();
      }
    });
  }, []);

  /* ── Keyboard: ⌘K / Ctrl+K ── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) {
          triggerRef.current = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        }
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* ── Custom event from Nav search button ── */
  useEffect(() => {
    window.addEventListener("openCommandPalette", openPalette);
    return () => window.removeEventListener("openCommandPalette", openPalette);
  }, [openPalette]);

  /* ── Lock body scroll when open ── */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* ── Focus first command item and trap tab focus inside palette ── */
  useEffect(() => {
    if (!open) return;

    const container = containerRef.current;
    if (!container) return;

    const focusFirst = () => {
      const firstItem = container.querySelector<HTMLElement>("[cmdk-item]");
      if (firstItem) {
        firstItem.focus();
        return;
      }
      const input = container.querySelector<HTMLElement>("[cmdk-input]");
      input?.focus();
    };

    const getFocusable = (): HTMLElement[] => {
      const selectors = [
        "[cmdk-input]",
        "[cmdk-item]",
        "button",
        "a[href]",
        "input",
        "select",
        "textarea",
        "[tabindex]:not([tabindex='-1'])",
      ].join(",");

      return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter((el) => {
        if (el.hasAttribute("disabled")) return false;
        if (el.getAttribute("aria-hidden") === "true") return false;
        return true;
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePalette();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!active || !container.contains(active)) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }
    };

    requestAnimationFrame(focusFirst);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closePalette]);

  /* ── Run a command ── */
  const run = useCallback(
    (item: CommandItem) => {
      closePalette();
      if (item.href) {
        router.push(item.href);
      } else if (item.action) {
        item.action();
        if (item.id === "toggle-theme") {
          setTheme(getCurrentTheme());
        }
      }
    },
    [closePalette, router]
  );

  /* ── Command groups ── */
  const groups: CommandGroup[] = [
    {
      heading: "Navigation",
      items: [
        { id: "nav-home",    label: "Home",    icon: <Home      size={16} strokeWidth={1.5} />, shortcut: "H", href: "/"       },
        { id: "nav-work",    label: "Work",    icon: <Briefcase size={16} strokeWidth={1.5} />, shortcut: "W", href: "/work"   },
        { id: "nav-projects",label: "Projects",icon: <Folder    size={16} strokeWidth={1.5} />, shortcut: "P", href: "/projects"},
        { id: "nav-writing", label: "Blogs",   icon: <PenLine   size={16} strokeWidth={1.5} />, shortcut: "B", href: "/writing"},
        { id: "nav-setup",   label: "Setup",   icon: <Wrench    size={16} strokeWidth={1.5} />, shortcut: "S", href: "/uses"   },
        { id: "nav-gears",   label: "Gears",   icon: <Cpu       size={16} strokeWidth={1.5} />, shortcut: "G", href: "/gears"  },
        { id: "nav-about",   label: "About",   icon: <User      size={16} strokeWidth={1.5} />, shortcut: "A", href: "/about"  },
      ],
    },
    {
      heading: "Projects",
      items: [
        { id: "proj-peercampus", label: "PeerCampus",  icon: <Folder size={16} strokeWidth={1.5} />, href: "/projects/peercampus" },
        { id: "proj-civic",      label: "CivicBridge", icon: <Folder size={16} strokeWidth={1.5} />, href: "/projects/civicbridge" },
        { id: "proj-senti",      label: "SentiGenix",  icon: <Folder size={16} strokeWidth={1.5} />, href: "/projects/sentigenix" },
      ],
    },
    {
      heading: "Work",
      items: [
        { id: "work-railway", label: "Northern Railway", icon: <Briefcase size={16} strokeWidth={1.5} />, href: "/work/railway" },
      ],
    },
    {
      heading: "Actions",
      items: [
        {
          id: "action-email",
          label: "Copy email",
          icon: <Copy size={16} strokeWidth={1.5} />,
          shortcut: "E",
          action: async () => {
            try {
              await navigator.clipboard.writeText("abhinavc037@gmail.com");
            } catch {
              const el = document.createElement("textarea");
              el.value = "abhinavc037@gmail.com";
              el.style.cssText = "position:fixed;opacity:0";
              document.body.appendChild(el);
              el.select();
              document.execCommand("copy");
              document.body.removeChild(el);
            }
          },
        },
        {
          id: "action-cv",
          label: "Download CV",
          icon: <Download size={16} strokeWidth={1.5} />,
          shortcut: "R",
          action: () => window.open("/resume"),
        },
        {
          id: "action-linkedin",
          label: "Open LinkedIn",
          icon: <Linkedin size={16} strokeWidth={1.5} />,
          shortcut: "L",
          action: () => window.open("https://www.linkedin.com/in/abhinavchaurasia-dev/", "_blank"),
        },
        {
          id: "action-github",
          label: "Open GitHub",
          icon: <Github size={16} strokeWidth={1.5} />,
          shortcut: "G",
          action: () => window.open("https://github.com/abhinavchaurasia-dev", "_blank"),
        },
        {
          id: "action-twitter",
          label: "Open Twitter",
          icon: <TwitterIcon />,
          action: () => window.open("https://x.com/abhinavc_dev", "_blank"),
        },
        {
          id: "action-youtube",
          label: "Open YouTube",
          icon: <YouTubeIcon />,
          action: () => window.open("https://www.youtube.com/@AbhinavChaurasia22", "_blank"),
        },
        {
          id: "action-instagram",
          label: "Open Instagram",
          icon: <InstagramIcon />,
          action: () => window.open("https://www.instagram.com/abhinavc_dev/", "_blank"),
        },
        {
          id: "action-medium",
          label: "Open Medium",
          icon: <MediumIcon />,
          action: () => window.open("https://medium.com/@abhinavchaurasia-dev", "_blank"),
        },
        {
          id: "action-hashnode",
          label: "Open Hashnode",
          icon: <HashnodeIcon />,
          action: () => window.open("https://hashnode.com/@abhinavchaurasia-dev", "_blank"),
        },
        {
          id: "action-email-open",
          label: "Email me",
          icon: <MailIcon />,
          action: () => window.open("mailto:abhinavc037@gmail.com", "_self"),
        },
      ],
    },
    {
      heading: "Theme",
      items: [
        {
          id: "toggle-theme",
          label: theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
          icon: theme === "dark"
            ? <Sun  size={16} strokeWidth={1.5} />
            : <Moon size={16} strokeWidth={1.5} />,
          action: toggleTheme,
        },
      ],
    },
  ];

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <div
            className="cp-backdrop"
            onClick={closePalette}
            aria-hidden="true"
          />

          {/* ── Panel ── */}
          <div
            className="cp-container"
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <Command
              className="cp-root"
              label="Command palette"
              loop
            >
              {/* Input */}
              <div className="cp-input-row">
                <Search size={16} strokeWidth={1.5} className="cp-search-icon" aria-hidden="true" />
                <Command.Input
                  className="cp-input"
                  placeholder="Search pages, projects, actions…"
                  autoFocus
                />
              </div>

              <Command.List className="cp-list">
                <Command.Empty className="cp-empty">
                  No results found.
                </Command.Empty>

                {groups.map((group) => (
                  <Command.Group
                    key={group.heading}
                    heading={group.heading}
                    className="cp-group"
                  >
                    {group.items.map((item) => (
                      <Command.Item
                        key={item.id}
                        value={`${item.label} ${group.heading}`}
                        onSelect={() => run(item)}
                        className="cp-item"
                      >
                        <span className="cp-item-left">
                          <span className="cp-item-icon" aria-hidden="true">
                            {item.icon}
                          </span>
                          <span className="cp-item-label">{item.label}</span>
                        </span>
                        {item.shortcut && (
                          <kbd className="cp-item-shortcut" aria-label={`Shortcut: ${item.shortcut}`}>
                            {item.shortcut}
                          </kbd>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>

              {/* Footer */}
              <div className="cp-footer" aria-hidden="true">
                <span className="cp-footer-hint">
                  <kbd className="cp-footer-key">↵</kbd> select
                </span>
                <span className="cp-footer-hint">
                  <kbd className="cp-footer-key">↑↓</kbd> navigate
                </span>
                <span className="cp-footer-hint">
                  <kbd className="cp-footer-key">esc</kbd> close
                </span>
              </div>
            </Command>
          </div>
        </>
      )}

      <style>{`
        /* ── Backdrop ── */
        .cp-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          background-color: rgba(0, 0, 0, 0.70);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: cpBackdropIn 200ms ease forwards;
        }

        @keyframes cpBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Container — desktop ── */
        .cp-container {
          position: fixed;
          top: 20%;
          left: 50%;
          z-index: 90;
          /* Desktop: up to 560px wide; Mobile: 92vw spec */
          width: min(560px, 92vw);
          transform: translateX(-50%);
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 8px;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          animation: cpPanelIn 250ms cubic-bezier(0, 0, 0.2, 1) forwards;
        }

        /* On very small viewports, push down a bit from top */
        @media (max-width: 480px) {
          .cp-container {
            top: 12%;
          }
        }

        @keyframes cpPanelIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) scale(1);    }
        }

        /* ── cmdk root ── */
        .cp-root {
          display: flex;
          flex-direction: column;
        }

        /* ── Input row ── */
        .cp-input-row {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 52px;
          padding: 0 16px;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
          flex-shrink: 0;
        }

        .cp-search-icon {
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
        }

        .cp-input {
          flex: 1;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 14px;
          color: var(--color-text-primary, #F0F0F0);
          background: transparent;
          border: none;
          outline: none;
          caret-color: var(--color-accent, #4AFF91);
          min-width: 0;
        }

        .cp-input::placeholder {
          color: var(--color-text-muted, #444444);
        }

        /* ── Results list ── */
        .cp-list {
          overflow-y: auto;
          max-height: 360px;
          padding: 6px;
          scrollbar-width: thin;
          scrollbar-color: var(--color-border-default, #2A2A2A) transparent;
        }

        /* Tighten max-height on small screens so footer stays visible */
        @media (max-width: 480px) {
          .cp-list {
            max-height: 52vh;
          }
        }

        /* ── Group ── */
        .cp-group [cmdk-group-heading] {
          padding: 8px 8px 4px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--color-text-muted, #444444);
          user-select: none;
        }

        /* ── Item — 44px touch target on mobile ── */
        .cp-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          height: 40px;
          padding: 0 10px;
          border-radius: 5px;
          cursor: pointer;
          outline: none;
          user-select: none;
          transition: background-color 80ms ease;
        }

        @media (max-width: 767px) {
          .cp-item {
            height: 44px;
          }
        }

        .cp-item[aria-selected="true"],
        .cp-item:hover {
          background-color: var(--color-bg-overlay, #141414);
        }

        .cp-item-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .cp-item-icon {
          display: flex;
          align-items: center;
          color: var(--color-text-muted, #444444);
          flex-shrink: 0;
        }

        .cp-item-label {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-primary, #F0F0F0);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cp-item-shortcut {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          background: transparent;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 3px;
          padding: 2px 6px;
          flex-shrink: 0;
          line-height: 1;
          /* Hide keyboard shortcuts on mobile — not relevant for touch */
        }

        @media (max-width: 480px) {
          .cp-item-shortcut { display: none; }
        }

        /* ── Empty state ── */
        .cp-empty {
          padding: 24px 16px;
          text-align: center;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
        }

        /* ── Footer ── */
        .cp-footer {
          display: flex;
          align-items: center;
          gap: 16px;
          height: 36px;
          padding: 0 16px;
          border-top: 1px solid var(--color-border-subtle, #1F1F1F);
          flex-shrink: 0;
        }

        /* Hide footer hints on very small screens to save vertical space */
        @media (max-width: 380px) {
          .cp-footer { display: none; }
        }

        .cp-footer-hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          color: var(--color-text-muted, #444444);
          user-select: none;
        }

        .cp-footer-key {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 10px;
          color: var(--color-text-muted, #444444);
          background: transparent;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 3px;
          padding: 1px 4px;
          line-height: 1.4;
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .cp-backdrop  { animation: none; }
          .cp-container { animation: none; }
          .cp-item      { transition: none; }
        }
      `}</style>
    </CommandPaletteContext.Provider>
  );
}

