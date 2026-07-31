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
const MAX_REDIRECTS = 3;
const MAX_BYTES = 2_000_000;

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

/**
 * Somewhere this fetch must never end up. The URLs I paste are mine, but the
 * redirects off them aren't — a page can bounce us at a cloud metadata service
 * or something else on Convex's own network, and whatever answered would be
 * stored as the title of a public card.
 */
function isPublicHost(host: string): boolean {
  if (!host) return false;
  if (host === "localhost" || host.endsWith(".localhost")) return false;
  if (host.endsWith(".local") || host.endsWith(".internal")) return false;
  // IPv6 literals: no link worth keeping is one, and the private-range rules
  // are fiddly enough that turning them all away is the honest option.
  if (host.startsWith("[")) return false;

  const octets = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!octets) return true;

  const first = Number(octets[1]);
  const second = Number(octets[2]);
  if (first === 0 || first === 10 || first === 127) return false;
  if (first === 169 && second === 254) return false;
  if (first === 172 && second >= 16 && second <= 31) return false;
  if (first === 192 && second === 168) return false;
  return true;
}

function isFetchable(url: URL): boolean {
  const scheme = url.protocol === "http:" || url.protocol === "https:";
  return scheme && isPublicHost(url.hostname.toLowerCase());
}

/**
 * Redirects are followed by hand so every hop gets checked, not just the one I
 * pasted. One deadline covers the whole chain, so a site that redirects four
 * times can't buy four timeouts.
 */
async function fetchText(target: string): Promise<string | null> {
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return null;
  }

  const deadline = AbortSignal.timeout(TIMEOUT_MS);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isFetchable(url)) return null;

    let response: Response;
    try {
      response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        redirect: "manual",
        signal: deadline,
      });
    } catch {
      return null;
    }

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      try {
        url = new URL(location, url);
        continue;
      } catch {
        return null;
      }
    }

    if (!response.ok) return null;
    if (Number(response.headers.get("content-length")) > MAX_BYTES) return null;
    try {
      return (await response.text()).slice(0, MAX_BYTES);
    } catch {
      return null;
    }
  }

  return null;
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

/**
 * og:image is very often a site-relative path. Stored as written it would
 * resolve against nishilfaldu.site and render as a broken card, so make it
 * absolute against the page it came from.
 */
function absolute(value: string | null, base: string): string | null {
  if (!value) return null;
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
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
    thumbnail: absolute(meta("og:image", "twitter:image"), url),
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
