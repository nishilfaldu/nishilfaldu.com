import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { ReportIssue } from "@/components/report-issue";
import "./globals.css";

/*
 * One reading face: Geist Sans (Vercel’s), with Geist Mono for code and
 * labels. The neutrals were already Geist’s; the typeface matches.
 */
const DESCRIPTION =
  "The story of how I got here, and the small things I build to take a mess and make it sit still.";

export const metadata: Metadata = {
  // The repo is named .com; the site ships to .site. Only one of those is a
  // registered domain — pointing canonical at the other tells crawlers the real
  // page lives at an address that doesn't resolve.
  metadataBase: new URL("https://nishilfaldu.site"),
  title: "Nishil Faldu",
  description: DESCRIPTION,
  authors: [{ name: "Nishil Faldu" }],
  alternates: { canonical: "/" },
  // No `images` here on purpose: app/opengraph-image.tsx is a file convention,
  // and Next injects og:image and twitter:image from it. Naming a path as well
  // means two cards to keep in step, and the hand-written one wins.
  openGraph: {
    type: "website",
    url: "/",
    title: "Nishil Faldu",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@FalduNishil",
    title: "Nishil Faldu",
    description: DESCRIPTION,
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
        {children}
        <ReportIssue />
      </body>
    </html>
  );
}
