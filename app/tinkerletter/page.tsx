import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { TinkerletterList } from "@/components/tinkerletter/tinkerletter-list";

export const metadata: Metadata = pageMetadata({
  title: "Tinkerletter",
  description:
    "Interactive issues — ideas you can touch instead of only reading about.",
  path: "/tinkerletter",
});

export default function TinkerletterPage() {
  return <TinkerletterList />;
}
