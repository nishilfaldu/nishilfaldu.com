import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { ProjectList } from "@/components/project-list";

/**
 * Curated projects. Everything it does lives in <ProjectList />; a page file
 * holds the page component and nothing else.
 */

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: "The projects I'm proud of — short notes and where they live.",
  path: "/projects",
});

export default function Projects() {
  return <ProjectList />;
}
