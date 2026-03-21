"use client";

import { useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import {
  Check,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Code2,
  Copy,
  Download,
  FileText,
  Settings,
  Terminal,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

type StepBadgeProps = { num: string };
type KbdProps = { children: React.ReactNode };
type FileCardProps = { filename: string; subtitle: string; href?: string };
type CodeRevealProps = { filename: string; icon?: React.ReactNode; code: string };

/* ============================================================
   ATOMS
   ============================================================ */

function StepBadge({ num }: StepBadgeProps) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "32px",
      height: "20px",
      padding: "0 6px",
      borderRadius: "4px",
      border: "1px solid var(--color-border-default, #2A2A2A)",
      fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
      fontSize: "10px",
      fontWeight: 500,
      color: "var(--color-text-muted, #444444)",
      flexShrink: 0,
      letterSpacing: "0.02em",
    }}>
      {num}
    </span>
  );
}

function Kbd({ children }: KbdProps) {
  return (
    <kbd style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "3px",
      padding: "3px 8px",
      borderRadius: "5px",
      border: "1px solid var(--color-border-default, #2A2A2A)",
      background: "var(--color-bg-inset, #1A1A1A)",
      fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
      fontSize: "12px",
      color: "var(--color-text-secondary, #888888)",
      whiteSpace: "nowrap" as const,
    }}>
      {children}
    </kbd>
  );
}

function FileCard({ filename, subtitle, href }: FileCardProps) {
  return (
    <a
      href={href ?? "#"}
      download={!!href}
      onClick={href ? undefined : (e) => e.preventDefault()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid var(--color-border-default, #2A2A2A)",
        background: "var(--color-bg-elevated, #0F0F0F)",
        textDecoration: "none",
        transition: "border-color 150ms ease",
        cursor: href ? "pointer" : "default",
        marginTop: "12px",
      }}
      className="file-card"
    >
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        borderRadius: "5px",
        border: "1px solid var(--color-border-default, #2A2A2A)",
        color: "var(--color-text-muted, #444444)",
      }}>
        <Download size={13} strokeWidth={1.5} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{
          fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--color-text-primary, #F0F0F0)",
        }}>
          {filename}
        </span>
        <span style={{
          fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
          fontSize: "11px",
          color: "var(--color-text-muted, #444444)",
        }}>
          {subtitle}
        </span>
      </span>
      <style>{`.file-card:hover { border-color: var(--color-border-strong, #3A3A3A) !important; }`}</style>
    </a>
  );
}

function CodeReveal({ filename, icon, code }: CodeRevealProps) {
  const [open, setOpen]       = useState(false);
  const [copied, setCopied]   = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      el.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{
      marginTop: "12px",
      borderRadius: "6px",
      border: "1px solid var(--color-border-default, #2A2A2A)",
      overflow: "hidden",
    }}>
      {/* ── Toggle bar ── */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: "var(--color-bg-elevated, #0F0F0F)",
          border: "none",
          cursor: "pointer",
          transition: "background-color 150ms ease",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "28px", height: "28px", borderRadius: "5px",
            border: "1px solid var(--color-border-default, #2A2A2A)",
            color: "var(--color-text-muted, #444444)",
          }}>
            {icon ?? <FileText size={13} strokeWidth={1.5} />}
          </span>
          <span style={{
            fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
            fontSize: "12px", fontWeight: 500,
            color: "var(--color-text-primary, #F0F0F0)",
          }}>
            {filename}
          </span>
        </span>
        <span style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
          fontSize: "12px", color: "var(--color-text-muted, #444444)",
        }}>
          {open ? "Hide" : "Show"}
          {open
            ? <ChevronUp   size={13} strokeWidth={1.5} />
            : <ChevronDown size={13} strokeWidth={1.5} />
          }
        </span>
      </button>

      {/* ── Code body ── */}
      {open && (
        <div style={{ position: "relative" }}>
          {/* Copy button */}
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            style={{
              position: "absolute",
              top: "10px",
              right: "12px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid var(--color-border-default, #2A2A2A)",
              background: "var(--color-bg-overlay, #141414)",
              cursor: "pointer",
              transition: "border-color 150ms ease, color 150ms ease",
              fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
              fontSize: "10px",
              color: copied
                ? "var(--color-accent, #4AFF91)"
                : "var(--color-text-muted, #444444)",
              zIndex: 1,
            }}
          >
            {copied
              ? <><Check  size={11} strokeWidth={2} /> Copied</>
              : <><Copy   size={11} strokeWidth={1.5} /> Copy</>
            }
          </button>

          <pre style={{
            margin: 0,
            padding: "16px",
            paddingRight: "80px",          /* prevent text hiding behind button */
            background: "var(--color-bg-inset, #1A1A1A)",
            borderTop: "1px solid var(--color-border-subtle, #1F1F1F)",
            fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
            fontSize: "11px",
            lineHeight: 1.7,
            color: "var(--color-text-secondary, #888888)",
            overflowX: "auto",
            whiteSpace: "pre",
          }}>
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   SECTION HEADER
   ============================================================ */

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "24px",
    }}>
      <span style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        height: "32px",
        borderRadius: "6px",
        border: "1px solid var(--color-border-default, #2A2A2A)",
        background: "var(--color-bg-elevated, #0F0F0F)",
        color: "var(--color-text-secondary, #888888)",
        flexShrink: 0,
      }}>
        {icon}
      </span>
      <h2 style={{
        fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
        fontSize: "18px",
        fontWeight: 600,
        color: "var(--color-text-primary, #F0F0F0)",
        margin: 0,
      }}>
        {title}
      </h2>
    </div>
  );
}

/* ============================================================
   STEP ROW
   ============================================================ */

function StepRow({
  num,
  children,
}: {
  num: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "10px 0",
      borderBottom: "1px solid var(--color-border-subtle, #1F1F1F)",
    }}>
      <StepBadge num={num} />
      <div style={{
        fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
        fontSize: "14px",
        color: "var(--color-text-secondary, #888888)",
        lineHeight: 1.6,
        display: "flex",
        flexWrap: "wrap" as const,
        alignItems: "center",
        gap: "6px",
        paddingTop: "1px",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   SECTION BLOCK
   ============================================================ */

function SectionBlock({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      marginBottom: "56px",
      borderTop: "1px solid var(--color-border-subtle, #1F1F1F)",
      paddingTop: "0",
    }}>
      {children}
    </div>
  );
}

/* ============================================================
   SETTINGS.JSON CONTENT
   ============================================================ */

const SETTINGS_JSON = `{
  "editor.fontFamily": "Geist Mono, Fira Code, monospace",
  "editor.fontSize": 13,
  "editor.lineHeight": 1.7,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "boundary",
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.smoothScrolling": true,
  "workbench.colorTheme": "One Dark Pro Darker",
  "workbench.startupEditor": "none",
  "terminal.integrated.fontFamily": "Geist Mono",
  "terminal.integrated.fontSize": 12,
  "files.autoSave": "onFocusChange",
  "explorer.confirmDelete": false,
  "breadcrumbs.enabled": false
}`;

/* ============================================================
   PAGE
   ============================================================ */

export default function UsesPage() {
  return (
    <PageWrapper>
      <div style={{ paddingTop: "80px", maxWidth: "640px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "56px" }}>
          <h1 style={{
            fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
            fontSize: "30px",
            fontWeight: 700,
            color: "var(--color-text-primary, #F0F0F0)",
            marginBottom: "8px",
            lineHeight: 1.2,
          }}>
            Setup
          </h1>
          <p style={{
            fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
            fontSize: "15px",
            color: "var(--color-text-secondary, #888888)",
            lineHeight: 1.5,
          }}>
            Complete guide to setting up VS Code / Cursor with my settings.
          </p>
        </div>

        {/* ══════════════════════════════════════════
            SECTION 1 — Download necessary files
            ══════════════════════════════════════════ */}
        <SectionBlock>
          <SectionHeader icon={<Download size={15} strokeWidth={1.5} />} title="Download necessary files" />

          <StepRow num="1.1">
            Download the font file below
          </StepRow>
          <FileCard filename="Fira-code.zip" subtitle="Unzip the font's file" />

          <StepRow num="1.2">
            Select all the fonts, right click, and click to Install
          </StepRow>

          <StepRow num="1.3">
            Download the extensions list below
          </StepRow>
          <FileCard filename="vsc-extensions.txt" subtitle="Place this file in downloads" />

          <StepRow num="1.4">
            Open VS Code / Cursor in downloads directory
          </StepRow>

          <StepRow num="1.5">
            Install <strong style={{ color: "var(--color-text-primary, #F0F0F0)", fontWeight: 500 }}>VSC Export &amp; Import</strong> extension in VS Code / Cursor.
          </StepRow>
        </SectionBlock>

        {/* ══════════════════════════════════════════
            SECTION 2 — Installing extensions
            ══════════════════════════════════════════ */}
        <SectionBlock>
          <SectionHeader icon={<FileText size={15} strokeWidth={1.5} />} title="Installing all the extensions" />

          <StepRow num="2.1">
            Open Command Palette by pressing the keyboard shortcut
          </StepRow>
          <div style={{ padding: "10px 0 4px 44px" }}>
            <Kbd>Ctrl + ⌘ + P</Kbd>
          </div>

          <StepRow num="2.2">
            Type <Kbd>Import Extensions</Kbd> in prompt and press Enter ↵
          </StepRow>

          <StepRow num="2.3">
            Select <code style={{
              fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
              fontSize: "12px",
              color: "var(--color-text-primary, #F0F0F0)",
              background: "var(--color-bg-inset, #1A1A1A)",
              padding: "2px 6px",
              borderRadius: "3px",
            }}>vsc-extensions.txt</code> from the downloads folder
          </StepRow>

          <StepRow num="2.4">
            All extensions will start to install
          </StepRow>
        </SectionBlock>

        {/* ══════════════════════════════════════════
            SECTION 3 — VS Code / Cursor Settings
            ══════════════════════════════════════════ */}
        <SectionBlock>
          <SectionHeader icon={<Settings size={15} strokeWidth={1.5} />} title="VS Code / Cursor Settings" />

          <StepRow num="3.1">
            Open Command Palette by pressing the keyboard shortcut
          </StepRow>
          <div style={{ padding: "10px 0 4px 44px" }}>
            <Kbd>Ctrl + ⌘ + P</Kbd>
          </div>

          <StepRow num="3.2">
            Enter the text in prompt and press Enter ↵
          </StepRow>
          <div style={{ padding: "10px 0 4px 44px" }}>
            <Kbd>Preferences: Open Settings (JSON)</Kbd>
          </div>

          <StepRow num="3.3">
            Copy the <code style={{
              fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
              fontSize: "12px",
              color: "var(--color-text-primary, #F0F0F0)",
              background: "var(--color-bg-inset, #1A1A1A)",
              padding: "2px 6px",
              borderRadius: "3px",
            }}>settings.json</code> from the window below
          </StepRow>
          <CodeReveal
            filename="settings.json"
            icon={<Code2 size={13} strokeWidth={1.5} />}
            code={SETTINGS_JSON}
          />
        </SectionBlock>

        {/* ══════════════════════════════════════════
            SECTION 4 — Complete Setup
            ══════════════════════════════════════════ */}
        <SectionBlock>
          <SectionHeader icon={<CheckCircle size={15} strokeWidth={1.5} />} title="Complete Setup" />

          <StepRow num="1">
            Paste the code in the <code style={{
              fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
              fontSize: "12px",
              color: "var(--color-text-primary, #F0F0F0)",
              background: "var(--color-bg-inset, #1A1A1A)",
              padding: "2px 6px",
              borderRadius: "3px",
            }}>settings.json</code> file in VS Code / Cursor
          </StepRow>

          <StepRow num="2">
            Save the settings.json file with <Kbd>Ctrl + S</Kbd> and restart VS Code / Cursor
          </StepRow>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "20px",
            padding: "12px 14px",
            borderRadius: "6px",
            border: "1px solid var(--color-border-subtle, #1F1F1F)",
            background: "var(--color-bg-elevated, #0F0F0F)",
          }}>
            <CheckCircle size={14} strokeWidth={1.5} style={{ color: "var(--color-accent, #4AFF91)", flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
              fontSize: "13px",
              color: "var(--color-text-secondary, #888888)",
            }}>
              Done! Your editor is now configured.
            </span>
          </div>
        </SectionBlock>

        {/* ── Terminal section ── */}
        <SectionBlock>
          <SectionHeader icon={<Terminal size={15} strokeWidth={1.5} />} title="Terminal Setup" />

          <StepRow num="1">
            Install <strong style={{ color: "var(--color-text-primary, #F0F0F0)", fontWeight: 500 }}>Windows Terminal</strong> from the Microsoft Store
          </StepRow>

          <StepRow num="2">
            Set <strong style={{ color: "var(--color-text-primary, #F0F0F0)", fontWeight: 500 }}>PowerShell 7</strong> as the default profile
          </StepRow>

          <StepRow num="3">
            Install <strong style={{ color: "var(--color-text-primary, #F0F0F0)", fontWeight: 500 }}>Git for Windows</strong> to get Git Bash alongside PowerShell
          </StepRow>

          <StepRow num="4">
            Set font to <Kbd>Geist Mono</Kbd> or <Kbd>Fira Code</Kbd> in terminal settings
          </StepRow>
        </SectionBlock>

      </div>
    </PageWrapper>
  );
}

