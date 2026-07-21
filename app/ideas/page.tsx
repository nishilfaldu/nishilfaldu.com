import type { Metadata } from "next";
import { Suspense } from "react";
import { IdeasTray } from "@/components/ideas-tray";
import { pageMetadata } from "@/components/page-metadata";

/**
 * Open ideas. Everything interactive lives in <IdeasTray />.
 * Deep link: /ideas?idea=<slug>
 */

export const metadata: Metadata = pageMetadata({
  title: "Ideas",
  description:
    "Open loops I’m willing to put on the site — a public tray instead of a notes dump.",
  path: "/ideas",
});

export default function IdeasPage() {
  return (
    <Suspense fallback={null}>
      <IdeasTray />
    </Suspense>
  );
}
