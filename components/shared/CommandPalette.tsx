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
  const [theme, setTheme]         = useState<"dark" | "light">("dark");
  const [mounted, setMounted]     = useState(false);
  const containerRef              = useRef<HTMLDivElement>(null);

  /* Sync theme label after mount */
  useEffect(() => {
    setMounted(true);
    setTheme(getCurrentTheme());
  }, []);

  /* ── Open helpers ── */
  const openPalette  = useCallback(() => setOpen(true),  []);
  const closePalette = useCallback(() => setOpen(false), []);

  /* ── Keyboard: ⌘K / Ctrl+K ── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

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
          id: "action-github",
          label: "Open GitHub",
          icon: <Github size={16} strokeWidth={1.5} />,
          shortcut: "G",
          action: () => window.open("https://github.com/abhinavchaurasia-dev", "_blank"),
        },
        {
          id: "action-linkedin",
          label: "Open LinkedIn",
          icon: <Linkedin size={16} strokeWidth={1.5} />,
          shortcut: "L",
          action: () => window.open("https://linkedin.com/in/abhinavchaurasia-dev", "_blank"),
        },
      ],
    },
    {
      heading: "Theme",
      items: [
        {
          id: "toggle-theme",
          label: mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
          icon: mounted && theme === "dark"
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
          <div className="cp-container" ref={containerRef}>
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

