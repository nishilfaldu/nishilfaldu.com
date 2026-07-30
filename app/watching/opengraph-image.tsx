import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Watching — things I don’t want to find out about late.";

export default function Image() {
  return renderOgCard({
    title: "Watching",
    description:
      "Not ideas I want to build — things I don’t want to find out about late, and where I’d see them first.",
  });
}
