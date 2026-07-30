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

export function convexUrl(): string | null {
  return process.env.NEXT_PUBLIC_CONVEX_URL ?? null;
}

export async function fetchKeeps(): Promise<Keep[]> {
  const url = convexUrl();
  if (!url) return [];

  try {
    return await new ConvexHttpClient(url).query(api.keeps.list, {});
  } catch {
    // A reading list is not worth a 500. The page renders its empty state and
    // the rest of the site carries on.
    return [];
  }
}
