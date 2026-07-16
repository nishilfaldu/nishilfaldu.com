import type { Metadata } from "next";
import { ProjectList } from "@/components/project-list";

/**
 * Curated projects. Everything it does lives in <ProjectList />; a page file
 * holds the page component and nothing else.
 */

export const metadata: Metadata = {
  title: "Projects — Nishil Faldu",
  description: "The projects I'm proud of — short notes and where they live.",
  alternates: { canonical: "/projects" },
};

export default function Projects() {
  return <ProjectList />;
}
