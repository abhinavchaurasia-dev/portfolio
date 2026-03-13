import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Nav from "@/components/layout/Nav";
import CommandPalette from "@/components/shared/CommandPalette";
import AIAssistant from "@/components/shared/AIAssistant";
import "./globals.css";

/* ============================================================
   FONT LOADING
   ============================================================ */

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: "italic",
});

/* ============================================================
   METADATA
   ============================================================ */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abhinavchaurasia.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Abhinav Chaurasia",
    template: "%s · Abhinav Chaurasia",
  },

  description:
    "Full-Stack Engineer · AI Integrations. Building production systems with React, Django, Node.js and AI APIs. Final year CSE, University of Lucknow 2026.",

  keywords: [
    "Abhinav Chaurasia",
    "Full-Stack Engineer",
    "AI Integrations",
    "React",
    "Django",
    "Node.js",
    "PostgreSQL",
    "Software Engineer",
    "Portfolio",
  ],

  authors: [{ name: "Abhinav Chaurasia", url: siteUrl }],
  creator: "Abhinav Chaurasia",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Abhinav Chaurasia",
    title: "Abhinav Chaurasia · Full-Stack Engineer",
    description:
      "Full-Stack Engineer · AI Integrations. React, Django, Node.js, PostgreSQL.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Abhinav Chaurasia · Full-Stack Engineer · AI Integrations",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Abhinav Chaurasia · Full-Stack Engineer",
    description:
      "Full-Stack Engineer · AI Integrations. React, Django, Node.js, PostgreSQL.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",
};

/* ============================================================
   VIEWPORT
   ============================================================ */

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* ============================================================
   ROOT LAYOUT
   ============================================================ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <Nav />
        <main>{children}</main>
        <CommandPalette />
        <AIAssistant />
      </body>
    </html>
  );
}