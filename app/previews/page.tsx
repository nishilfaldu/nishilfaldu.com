import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { PreviewsList } from "@/components/previews-list";

/**
 * In-flight branch previews. Everything it does lives in <PreviewsList />.
 */

export const metadata: Metadata = pageMetadata({
  title: "In the works",
  description:
    "Live Vercel previews of branches that haven’t landed yet — what’s cooking, and where to open it.",
  path: "/previews",
});

export default function PreviewsPage() {
  return <PreviewsList />;
}
