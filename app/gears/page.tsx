"use client";

import PageWrapper from "@/components/layout/PageWrapper";
import {
  Monitor,
  Globe,
  AppWindow,
  ExternalLink,
  Cpu,
  MemoryStick,
  HardDrive,
  Keyboard,
  Mouse,
  Headphones,
  Lamp,
  Server,
} from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

type GearItem = {
  name: string;
  href?: string;
  dimmed?: boolean;
  icon?: React.ReactNode;
};

type GearSection = {
  id: string;
  icon: React.ReactNode;
  title: string;
  numbered?: boolean;
  items: GearItem[];
};

/* ============================================================
   DATA
   ============================================================ */

const GEAR_SECTIONS: GearSection[] = [
  {
    id: "devices",
    icon: <Monitor size={15} strokeWidth={1.5} />,
    title: "Devices & Accessories",
    items: [
      { name: "Custom Built PC — Windows 11", href: "https://www.microsoft.com/en-in/windows/windows-11", icon: <Server    size={14} strokeWidth={1.5} /> },
      { name: "16GB DDR4 RAM",                href: "https://www.crucial.com/memory",                     icon: <MemoryStick size={14} strokeWidth={1.5} /> },
      { name: "512GB NVMe SSD",               href: "https://www.samsung.com/semiconductor/minisite/ssd/", icon: <HardDrive  size={14} strokeWidth={1.5} /> },
      { name: "1080p Monitor (24 inch)",      href: "https://www.lg.com/in/monitors",                     icon: <Monitor    size={14} strokeWidth={1.5} /> },
      { name: "Mechanical Keyboard",          href: "https://www.keychron.com",                           icon: <Keyboard   size={14} strokeWidth={1.5} /> },
      { name: "Logitech G402 Mouse",          href: "https://www.logitechg.com/en-in/products/gaming-mice/g402-hyperion-fury-fps-gaming-mouse.html", icon: <Mouse      size={14} strokeWidth={1.5} /> },
      { name: "USB Headset",                                                                                                                           icon: <Headphones size={14} strokeWidth={1.5} /> },
      { name: "Desk Lamp",                                                                                                                             icon: <Lamp       size={14} strokeWidth={1.5} /> },
      { name: "Intel Core i5 CPU",            href: "https://www.intel.com/content/www/us/en/products/details/processors.html",                       icon: <Cpu        size={14} strokeWidth={1.5} /> },
    ],
  },
  {
    id: "extensions",
    icon: <Globe size={15} strokeWidth={1.5} />,
    title: "Web Extensions",
    numbered: true,
    items: [
      { name: "uBlock Origin",         href: "https://ublockorigin.com" },
      { name: "React Developer Tools", href: "https://react.dev/learn/react-developer-tools" },
      { name: "daily.dev",             href: "https://daily.dev" },
      { name: "Grammarly",             href: "https://grammarly.com" },
      { name: "Wappalyzer",            href: "https://wappalyzer.com" },
      { name: "ColorZilla",            href: "https://colorzilla.com" },
      { name: "JSON Formatter",        href: "https://chrome.google.com/webstore/detail/json-formatter" },
    ],
  },
  {
    id: "software",
    icon: <AppWindow size={15} strokeWidth={1.5} />,
    title: "Software",
    numbered: true,
    items: [
      { name: "VS Code",          href: "https://code.visualstudio.com" },
      { name: "Cursor",           href: "https://cursor.sh" },
      { name: "Notion",           href: "https://notion.so" },
      { name: "Postman",          href: "https://postman.com" },
      { name: "TablePlus",        href: "https://tableplus.com" },
      { name: "OBS Studio",       href: "https://obsproject.com" },
      { name: "VLC",              href: "https://videolan.org" },
      { name: "Windows Terminal", href: "https://github.com/microsoft/terminal" },
    ],
  },
];

/* ============================================================
   SECTION HEADER
   ============================================================ */

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
      <span style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "32px", height: "32px", borderRadius: "6px",
        border: "1px solid var(--color-border-default, #2A2A2A)",
        background: "var(--color-bg-elevated, #0F0F0F)",
        color: "var(--color-text-secondary, #888888)", flexShrink: 0,
      }}>
        {icon}
      </span>
      <h2 style={{
        fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
        fontSize: "18px", fontWeight: 600,
        color: "var(--color-text-primary, #F0F0F0)", margin: 0,
      }}>
        {title}
      </h2>
    </div>
  );
}

/* ============================================================
   GEAR ITEM ROW
   ============================================================ */

function GearRow({ item, index, numbered }: { item: GearItem; index: number; numbered?: boolean }) {
  const rowContent = (
    <div
      className="gear-row"
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        height: "44px",
        borderBottom: "1px solid var(--color-border-subtle, #1F1F1F)",
        paddingLeft: "0", paddingRight: "0",
        transition: "background-color 150ms ease, padding 150ms ease",
        borderRadius: "4px",
        cursor: item.href ? "pointer" : "default",
        textDecoration: "none",
      }}
    >
      {/* Left slot: number OR icon badge */}
      {numbered ? (
        <span style={{
          fontFamily: "var(--font-geist-mono, 'Geist Mono', monospace)",
          fontSize: "11px", color: "var(--color-text-muted, #444444)",
          minWidth: "16px", flexShrink: 0,
        }}>
          {index + 1}
        </span>
      ) : item.icon ? (
        <span style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "26px", height: "26px", borderRadius: "5px",
          border: "1px solid var(--color-border-default, #2A2A2A)",
          background: "var(--color-bg-inset, #1A1A1A)",
          color: "var(--color-text-muted, #444444)", flexShrink: 0,
        }}>
          {item.icon}
        </span>
      ) : null}

      <span style={{
        fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
        fontSize: "14px", fontWeight: 400,
        color: item.dimmed ? "var(--color-text-muted, #444444)" : "var(--color-text-primary, #F0F0F0)",
        flex: 1,
      }}>
        {item.name}
      </span>

      {item.href && (
        <ExternalLink size={13} strokeWidth={1.5}
          style={{ color: "var(--color-text-muted, #444444)", flexShrink: 0 }} />
      )}

      <style>{`
        .gear-row:hover {
          background-color: var(--color-bg-elevated, #0f0f0f);
          padding-left: 10px;
          padding-right: 10px;
        }
      `}</style>
    </div>
  );

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}>
        {rowContent}
      </a>
    );
  }

  return <div>{rowContent}</div>;
}

/* ============================================================
   PAGE
   ============================================================ */

export default function GearsPage() {
  return (
    <PageWrapper>
      <div style={{ paddingTop: "80px", maxWidth: "640px" }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: "56px" }}>
          <h1 style={{
            fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
            fontSize: "30px", fontWeight: 700,
            color: "var(--color-text-primary, #F0F0F0)",
            marginBottom: "8px", lineHeight: 1.2,
          }}>
            Gears
          </h1>
          <p style={{
            fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)",
            fontSize: "15px", color: "var(--color-text-secondary, #888888)", lineHeight: 1.5,
          }}>
            My gears and tools I use to get my work done.
          </p>
        </div>

        {/* ── Sections ── */}
        {GEAR_SECTIONS.map((section) => (
          <div key={section.id} style={{ marginBottom: "52px" }}>
            <SectionHeader icon={section.icon} title={section.title} />
            <div style={{ borderTop: "1px solid var(--color-border-subtle, #1F1F1F)" }}>
              {section.items.map((item, i) => (
                <GearRow key={item.name} item={item} index={i} numbered={section.numbered} />
              ))}
            </div>
          </div>
        ))}

      </div>
    </PageWrapper>
  );
}

