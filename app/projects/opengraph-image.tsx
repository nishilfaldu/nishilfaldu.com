import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Projects — the projects I’m proud of, short notes and where they live.";

export default function Image() {
  return renderOgCard({
    title: "Projects",
    description: "The projects I’m proud of — short notes and where they live.",
  });
}
