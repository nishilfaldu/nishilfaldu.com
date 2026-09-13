import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { ProjectList } from "@/components/project-list";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description: "The projects I’m proud of — short notes and where they live.",
  path: "/",
});

export default function Home() {
  return <ProjectList />;
}
