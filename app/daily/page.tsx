import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { DailyList } from "@/components/radar/daily-list";

/**
 * Sites worth a daily check. Everything it does lives in <DailyList />.
 */

export const metadata: Metadata = pageMetadata({
  title: "Daily",
  description:
    "The short list of sites that earn a check every day — a long list is one nobody opens.",
  path: "/daily",
});

export default function DailyPage() {
  return <DailyList />;
}
