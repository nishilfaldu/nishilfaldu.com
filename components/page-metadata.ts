import type { Metadata } from "next";

export const SITE_URL = "https://nishilfaldu.site";
export const SITE_NAME = "Nishil Faldu";
export const SITE_DESCRIPTION =
  "The story of how I got here, and the small things I build to take a mess and make it sit still.";

/** Social profiles linked from the footer - used for Person JSON-LD. */
export const SITE_SAME_AS = [
  "https://x.com/FalduNishil",
  "https://github.com/nishilfaldu",
  "https://www.linkedin.com/in/nishilfaldu",
] as const;

type PageMetaInput = {
  /** Short title; root layout template appends " · Nishil Faldu". */
  title: string;
  description: string;
  path: "/" | `/${string}`;
  ogType?: "website" | "article";
  /** Direct mp4 for inline video link previews (Messages autoplays og:video, muted and looping, and it replaces the image preview). Keep the file small: icon + image + video share a 10MB budget before the link renders. */
  ogVideo?: { url: string; width: number; height: number };
};

/**
 * Per-page SEO: title, description, canonical, Open Graph, Twitter.
 * Each route has its own opengraph-image (light paper - scrapers don’t
 * follow dark mode).
 */
export function pageMetadata({
  title,
  description,
  path,
  ogType = "website",
  ogVideo,
}: PageMetaInput): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: ogType,
      url: path,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      ...(ogVideo && {
        videos: [
          {
            url: ogVideo.url,
            secureUrl: ogVideo.url,
            type: "video/mp4",
            width: ogVideo.width,
            height: ogVideo.height,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function personJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nishil Faldu",
    url: SITE_URL,
    sameAs: [...SITE_SAME_AS],
  });
}
