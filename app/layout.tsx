import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import "./globals.css";

/*
 * One reading face. The site is an essay, so the face that sets the essay is
 * the entire type system — there is no second role to name.
 *
 * Italic ships because the prose actually uses it. Geist Sans is gone with the
 * design system: it was the strongest signal the site was Vercel-adjacent, and
 * we're already borrowing their neutrals.
 */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const DESCRIPTION =
  "The story of how I got here, and the small things I build to take a mess and make it sit still.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nishilfaldu.com"),
  title: "Nishil Faldu",
  description: DESCRIPTION,
  authors: [{ name: "Nishil Faldu" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Nishil Faldu",
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@FalduNishil",
    title: "Nishil Faldu",
    description: DESCRIPTION,
    images: ["/og-image.png"],
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
    <html lang="en" className={`${newsreader.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
