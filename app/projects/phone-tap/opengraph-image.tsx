import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Phone Tap — tap phones to share a job packet into a place that keeps it.";

export default function Image() {
  return renderOgCard({
    eyebrow: "Projects",
    title: "Phone Tap",
    description:
      "Tap two phones and hand over a job packet — resume, LinkedIn, the professional stuff.",
  });
}
