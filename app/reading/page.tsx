import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { ReadingPage } from "@/components/reading/reading-page";

/**
 * Things I read and kept, by the day I found them. Everything it does lives in
 * <ReadingPage />.
 */

export const metadata: Metadata = pageMetadata({
  title: "Reading",
  description:
    "Links I read and kept, filed under the day I found them — plus the few people whose next piece I don’t want to miss.",
  path: "/reading",
});

/*
 * Rendered per request, always. Two reasons, and both are load-bearing:
 * the archive changes whenever I paste something, and the owner form must be
 * decided from the cookie on this request rather than baked in at build time.
 * Without this the page prerenders — the gate short-circuits before it reads
 * cookies when AGENT_ACCESS_SECRET is unset, so build-time env would silently
 * decide whether the page is live or frozen.
 */
export const dynamic = "force-dynamic";

export default function Reading() {
  return <ReadingPage />;
}
