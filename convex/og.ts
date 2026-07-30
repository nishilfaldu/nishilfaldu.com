"use node";

import { load } from "cheerio";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

/*
 * Ported from Sediment's convex/og.ts. Runs in the Node runtime because cheerio
 * needs it, and off the write path because a slow site shouldn't hold up a
 * paste. Every failure here is non-fatal: a link with no title still renders,
 * it just renders as its URL.
 */

const USER_AGENT = "Mozilla/5.0 (compatible; nishilfaldu.site/1.0)";
const TIMEOUT_MS = 8_000;

type Metadata = {
  title: string | null;
  description: string | null;
  thumbnail: string | null;
};

const EMPTY: Metadata = { title: null, description: null, thumbnail: null };

function clean(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  const text = await fetchText(url);
  if (!text) return null;
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/*
 * X blocks unauthenticated scrapers, so og: tags never arrive. oEmbed still
 * answers, and gives back the author plus the post text — which is exactly the
 * title/description pair a card wants.
 */
async function twitterMetadata(url: string): Promise<Metadata> {
  const endpoint = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`;
  const data = await fetchJson(endpoint);
  if (!data) return EMPTY;

  const author = clean(data.author_name as string | undefined);
  const html = clean(data.html as string | undefined);
  const text = html ? clean(load(html)("blockquote > p").first().text()) : null;

  return {
    title: author ? `@${author}` : null,
    description: text,
    thumbnail: null,
  };
}

async function vimeoMetadata(url: string): Promise<Metadata> {
  const endpoint = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
  const data = await fetchJson(endpoint);
  if (!data) return EMPTY;
  return {
    title: clean(data.title as string | undefined),
    description: clean(data.description as string | undefined),
    thumbnail: clean(data.thumbnail_url as string | undefined),
  };
}

async function genericMetadata(url: string): Promise<Metadata> {
  const html = await fetchText(url);
  if (!html) return EMPTY;

  const $ = load(html);
  const meta = (...names: string[]): string | null => {
    for (const name of names) {
      const value =
        $(`meta[property="${name}"]`).attr("content") ??
        $(`meta[name="${name}"]`).attr("content");
      const cleaned = clean(value);
      if (cleaned) return cleaned;
    }
    return null;
  };

  return {
    title:
      meta("og:title", "twitter:title") ?? clean($("title").first().text()),
    description: meta("og:description", "twitter:description", "description"),
    thumbnail: meta("og:image", "twitter:image"),
  };
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

async function readMetadata(url: string): Promise<Metadata> {
  const host = hostOf(url);
  if (host === "x.com" || host === "twitter.com") return twitterMetadata(url);
  if (host === "vimeo.com") return vimeoMetadata(url);
  return genericMetadata(url);
}

export const fetchAndPatch = internalAction({
  args: { id: v.id("links"), url: v.string() },
  handler: async (ctx, { id, url }) => {
    const metadata = await readMetadata(url);
    if (!metadata.title && !metadata.description && !metadata.thumbnail) return;
    await ctx.runMutation(internal.keeps.patchMetadata, { id, ...metadata });
  },
});
