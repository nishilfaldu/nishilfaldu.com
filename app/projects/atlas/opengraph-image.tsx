import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Atlas — a verification engine for AI-written code, and an honest write-up of what the benchmark taught me.";

export default function Image() {
  return renderOgCard({
    eyebrow: "Projects",
    title: "Atlas",
    description:
      "Built a verification engine for AI-written code. Measured it. Killed the thesis.",
  });
}
