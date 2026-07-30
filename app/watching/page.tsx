import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { WatchList } from "@/components/radar/watch-list";

/**
 * Things I’m waiting on. Everything it does lives in <WatchList />.
 */

export const metadata: Metadata = pageMetadata({
  title: "Watching",
  description:
    "Not ideas I want to build — things I don’t want to find out about late, and where I’d see them first.",
  path: "/watching",
});

export default function WatchingPage() {
  return <WatchList />;
}
