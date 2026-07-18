import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import {
  personJsonLd,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/components/page-metadata";
import { SiteToolbar } from "@/components/site-toolbar";
import "./globals.css";

/*
 * One reading face: Geist Sans (Vercel’s), with Geist Mono for code and
 * labels. The neutrals were already Geist’s; the typeface matches.
 */

export const metadata: Metadata = {
  // The repo is named .com; the site ships to .site. Only one of those is a
  // registered domain — pointing canonical at the other tells crawlers the real
  // page lives at an address that doesn't resolve.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  // No `images` here on purpose: app/opengraph-image.tsx is a file convention,
  // and Next injects og:image and twitter:image from it. Naming a path as well
  // means two cards to keep in step, and the hand-written one wins.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@FalduNishil",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/** Matches --color-paper in both themes, so the browser chrome joins the page. */
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistSans.className} antialiased`}
    >
      <body>
        <script
          type="application/ld+json"
          // Person schema for the whole site — one identity, every page.
          dangerouslySetInnerHTML={{ __html: personJsonLd() }}
        />
        {children}
        <SiteToolbar />
      </body>
    </html>
  );
}
