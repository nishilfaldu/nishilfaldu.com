import type { Metadata } from "next";
import { TinkerletterList } from "@/components/tinkerletter/tinkerletter-list";

export const metadata: Metadata = {
  title: "Tinkerletter — Nishil Faldu",
  description:
    "Interactive issues — ideas you can touch instead of only reading about.",
  alternates: { canonical: "/tinkerletter" },
};

export default function TinkerletterPage() {
  return <TinkerletterList />;
}
