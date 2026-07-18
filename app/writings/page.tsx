import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { WritingsBook } from "@/components/writings-book";

/**
 * Writings as a book. Everything interactive lives in <WritingsBook />.
 */

export const metadata: Metadata = pageMetadata({
  title: "A small book",
  description:
    "A place for lines that shouldn’t live in Notes — pages you can turn.",
  path: "/writings",
});

export default function WritingsPage() {
  return <WritingsBook />;
}
