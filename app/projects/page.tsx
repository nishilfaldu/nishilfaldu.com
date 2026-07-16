import type { Metadata } from "next";
import { Showcase } from "@/components/showcase";

/**
 * The showcase page. Everything it does lives in <Showcase />; a page file
 * holds the page component and nothing else.
 */

export const metadata: Metadata = {
  title: "Projects — Nishil Faldu",
  description:
    "The projects I'm proud of: a dock, a gallery, and the places they ship to.",
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return <Showcase />;
}
