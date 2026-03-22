import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CommandPalette from "@/components/shared/CommandPalette";
import AIAssistant from "@/components/shared/AIAssistant";
import ScrollFade from "@/components/shared/ScrollFade";
import "./globals.css";

/* ============================================================
   FONTS
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
    default:  "Abhinav Chaurasia",
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
    "University of Lucknow",
  ],

  authors:   [{ name: "Abhinav Chaurasia", url: siteUrl }],
  creator:   "Abhinav Chaurasia",
  publisher: "Abhinav Chaurasia",

  alternates: { canonical: siteUrl },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:  true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         siteUrl,
    siteName:    "Abhinav Chaurasia",
    title:       "Abhinav Chaurasia · Full-Stack Engineer",
    description: "Full-Stack Engineer · AI Integrations. React, Django, Node.js, PostgreSQL.",
    images: [
      {
        url:    "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "Abhinav Chaurasia · Full-Stack Engineer · AI Integrations",
        type:   "image/png",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    site:        "@abhinavcdev",
    creator:     "@abhinavcdev",
    title:       "Abhinav Chaurasia · Full-Stack Engineer",
    description: "Full-Stack Engineer · AI Integrations. React, Django, Node.js, PostgreSQL.",
    images:      ["/og-image.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",
};

/* ============================================================
   VIEWPORT
   ============================================================ */

export const viewport: Viewport = {
  themeColor:   "#080808",
  colorScheme:  "dark",
  width:        "device-width",
  initialScale: 1,
};

/* ============================================================
   JSON-LD — Person schema
   ============================================================ */

const personJsonLd = {
  "@context":  "https://schema.org",
  "@type":     "Person",
  name:        "Abhinav Chaurasia",
  url:         siteUrl,
  image:       `${siteUrl}/og-image.png`,
  jobTitle:    "Full-Stack Engineer",
  description: "Final-year CSE student building full-stack systems with AI integrations.",
  email:       "abhinavc037@gmail.com",
  sameAs: [
    "https://www.linkedin.com/in/abhinavchaurasia-dev/",
    "https://github.com/abhinavchaurasia-dev",
    "https://x.com/abhinavc_dev",
    "https://www.youtube.com/@AbhinavChaurasia22",
    "https://www.instagram.com/abhinavc_dev/",
    "https://medium.com/@abhinavchaurasia-dev",
    "https://hashnode.com/@abhinavchaurasia-dev",
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name:    "University of Lucknow",
  },
  knowsAbout: [
    "React", "Django", "Node.js", "PostgreSQL",
    "CLIP embeddings", "OpenAI API", "Gemini AI",
    "Full-Stack Engineering", "AI Integration",
  ],
};

/* ============================================================
   ROOT LAYOUT
   ============================================================ */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="AbhinavChaurasia" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <CommandPalette />
        <AIAssistant />
        <ScrollFade />
      </body>
    </html>
  );
}

