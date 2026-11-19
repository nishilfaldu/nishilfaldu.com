import type { Metadata } from "next";
import { pageMetadata } from "@/components/page-metadata";
import { ProjectList } from "@/components/project-list";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "The projects I’m proud of, with short notes and where they live.",
  path: "/",
  ogVideo: {
    path: "/showcase/homepage-loop.mp4",
    width: 1200,
    height: 630,
  },
});

export default function Home() {
  return <ProjectList />;
}
