import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Sediment — an inspiration dashboard for the pieces you already know matter.";

export default function Image() {
  return renderOgCard({
    eyebrow: "Projects",
    title: "Sediment",
    description:
      "An inspiration dashboard for the pieces you already know matter. Copy something, find it later.",
  });
}
