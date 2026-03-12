"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

interface Command {
  id: string;
  label: string;
  description: string;
  shortcut?: string;
  action: () => void;
}

/* ============================================================
   COMMAND PALETTE
   Listens for "openCommandPalette" custom event (fired by Nav)
   Also opens on Ctrl+K / Cmd+K
   ============================================================ */

export default function CommandPalette() {
  const router                        = useRouter();
  const [open, setOpen]               = useState(false);
  const [query, setQuery]             = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef                      = useRef<HTMLInputElement>(null);

  /* Build command list */
  const commands: Command[] = [
    { id: "home",    label: "Go to Home",    description: "Navigate to the homepage",            shortcut: "H", action: () => router.push("/")        },
    { id: "work",    label: "Go to Work",    description: "View projects and case studies",       shortcut: "W", action: () => router.push("/work")     },
    { id: "writing", label: "Go to Writing", description: "Browse all blog posts",               shortcut: "B", action: () => router.push("/writing")  },
    { id: "about",   label: "Go to About",   description: "Learn about Abhinav",                 shortcut: "A", action: () => router.push("/about")    },
    { id: "github",  label: "Open GitHub",   description: "github.com/abhinavchaurasia-dev",              action: () => window.open("https://github.com/abhinavchaurasia-dev", "_blank")   },
    { id: "linkedin",label: "Open LinkedIn", description: "linkedin.com/in/abhinavchaurasia-dev",         action: () => window.open("https://linkedin.com/in/abhinavchaurasia-dev", "_blank") },
    { id: "email",   label: "Send Email",    description: "abhinavc037@gmail.com",                        action: () => window.open("mailto:abhinavc037@gmail.com")                          },
  ];

  /* Filter by query */
  const filtered = query.trim() === ""
    ? commands
    : commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
      );

  /* Open/close */
  const openPalette  = useCallback(() => { setOpen(true);  setQuery(""); setActiveIndex(0); }, []);
  const closePalette = useCallback(() => { setOpen(false); setQuery(""); }, []);

  const runCommand = useCallback((cmd: Command) => {
    cmd.action();
    closePalette();
  }, [closePalette]);

  /* Listen for custom event from Nav */
  useEffect(() => {
    window.addEventListener("openCommandPalette", openPalette);
    return () => window.removeEventListener("openCommandPalette", openPalette);
  }, [openPalette]);

  /* Ctrl+K / Cmd+K global shortcut */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        open ? closePalette() : openPalette();
      }
      if (e.key === "Escape" && open) closePalette();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, openPalette, closePalette]);

  /* Focus input when opened */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  /* Arrow key + Enter navigation */
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        runCommand(filtered[activeIndex]);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, activeIndex, runCommand]);

  /* Reset active index when query changes */
  useEffect(() => { setActiveIndex(0); }, [query]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cp-backdrop" onClick={closePalette} aria-hidden="true" />

      {/* Panel */}
      <div
        className="cp-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search input row */}
        <div className="cp-input-row">
          <Search size={14} strokeWidth={1.5} className="cp-search-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            className="cp-input"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search commands"
            autoComplete="off"
            spellCheck={false}
          />
          <button className="cp-close-btn" onClick={closePalette} aria-label="Close palette">
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Results */}
        <ul className="cp-list" role="listbox">
          {filtered.length === 0 ? (
            <li className="cp-empty">No results for &ldquo;{query}&rdquo;</li>
          ) : (
            filtered.map((cmd, i) => (
              <li
                key={cmd.id}
                className={`cp-item${i === activeIndex ? " cp-item--active" : ""}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => runCommand(cmd)}
              >
                <span className="cp-item-label">{cmd.label}</span>
                <span className="cp-item-desc">{cmd.description}</span>
                {cmd.shortcut && (
                  <kbd className="cp-item-shortcut">{cmd.shortcut}</kbd>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      <style>{`
        .cp-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          background-color: rgba(8, 8, 8, 0.7);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: cpFadeIn var(--duration-base, 250ms) var(--ease-out) forwards;
        }

        @keyframes cpFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .cp-panel {
          position: fixed;
          top: 20vh;
          left: 50%;
          transform: translateX(-50%);
          z-index: 90;
          width: min(580px, 92vw);
          background-color: var(--color-bg-elevated, #0F0F0F);
          border: 1px solid var(--color-border-default, #2A2A2A);
          border-radius: 10px;
          overflow: hidden;
          animation: cpSlideIn var(--duration-base, 250ms) var(--ease-out) forwards;
        }

        @keyframes cpSlideIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) scale(1); }
        }

        .cp-input-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--color-border-subtle, #1F1F1F);
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
        }

        .cp-input::placeholder {
          color: var(--color-text-muted, #444444);
        }

        .cp-close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          color: var(--color-text-muted, #444444);
          background: transparent;
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 4px;
          cursor: pointer;
          flex-shrink: 0;
          transition: color var(--duration-fast, 150ms) ease,
                      border-color var(--duration-fast, 150ms) ease;
        }
        .cp-close-btn:hover {
          color: var(--color-text-primary, #F0F0F0);
          border-color: var(--color-border-default, #2A2A2A);
        }

        .cp-list {
          list-style: none;
          margin: 0;
          padding: 6px;
          max-height: 340px;
          overflow-y: auto;
        }

        .cp-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color var(--duration-fast, 150ms) ease;
        }

        .cp-item--active {
          background-color: var(--color-bg-overlay, #141414);
        }

        .cp-item-label {
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary, #F0F0F0);
          flex-shrink: 0;
        }

        .cp-item-desc {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .cp-item-shortcut {
          font-family: var(--font-geist-mono, "Geist Mono", monospace);
          font-size: 11px;
          color: var(--color-text-muted, #444444);
          background-color: var(--color-bg-inset, #1A1A1A);
          border: 1px solid var(--color-border-subtle, #1F1F1F);
          border-radius: 3px;
          padding: 1px 5px;
          flex-shrink: 0;
        }

        .cp-empty {
          padding: 20px 16px;
          font-family: var(--font-geist, "Geist", sans-serif);
          font-size: 13px;
          color: var(--color-text-muted, #444444);
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .cp-backdrop { animation: none; }
          .cp-panel    { animation: none; }
        }
      `}</style>
    </>
  );
}