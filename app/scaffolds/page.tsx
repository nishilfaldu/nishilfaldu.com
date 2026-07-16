import type { Metadata } from "next";
import { ScaffoldList } from "@/components/scaffolds/scaffold-list";

/**
 * Scaffold recipes. Everything it does lives in <ScaffoldList />.
 */

export const metadata: Metadata = {
  title: "Scaffolds — Nishil Faldu",
  description:
    "Prompts that scaffold Next.js (and more) the way I always set projects up — open in Cursor or copy.",
  alternates: { canonical: "/scaffolds" },
};

export default function ScaffoldsPage() {
  return <ScaffoldList />;
}
