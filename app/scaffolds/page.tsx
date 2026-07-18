import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { ScaffoldList } from "@/components/scaffolds/scaffold-list";

/**
 * Scaffold recipes. Everything it does lives in <ScaffoldList />.
 */

export const metadata: Metadata = pageMetadata({
  title: "Scaffolds",
  description:
    "Prompts that scaffold Next.js, TanStack Start, Electron, and Expo the way I always set projects up — open in Cursor or copy.",
  path: "/scaffolds",
});

export default function ScaffoldsPage() {
  return <ScaffoldList />;
}
