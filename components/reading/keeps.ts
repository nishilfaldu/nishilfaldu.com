import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

/**
 * The site's only read path into the reading-list deployment.
 *
 * Server-side over HTTP rather than convex/react: the page is static-first and
 * has no reason to hold a websocket open for a list that changes when I paste
 * something. Revalidation is the page's job — see components/reading/reading-page.
 */

export type Keep = {
  id: string;
  dayId: string;
  url: string;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  note: string | null;
};

export type KeepsResult = {
  keeps: Keep[];
  /**
   * False when the archive could not be read. An outage and an empty list are
   * the same array, and the page must not tell you the same thing about both.
   */
  ok: boolean;
};

export function convexUrl(): string | null {
  return process.env.NEXT_PUBLIC_CONVEX_URL ?? null;
}

export async function fetchKeeps(): Promise<KeepsResult> {
  const url = convexUrl();
  if (!url) {
    console.error("reading: NEXT_PUBLIC_CONVEX_URL is not set.");
    return { keeps: [], ok: false };
  }

  try {
    const keeps = await new ConvexHttpClient(url).query(api.keeps.list, {});
    return { keeps, ok: true };
  } catch (error) {
    // A reading list is not worth a 500. The page says it couldn't load and the
    // rest of the site carries on — but it says so out loud, in both places.
    console.error(
      "reading: archive query failed:",
      error instanceof Error ? error.message : error,
    );
    return { keeps: [], ok: false };
  }
}
