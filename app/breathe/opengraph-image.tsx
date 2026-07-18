import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Breathe — a tiny gap when agent-pace overwhelm shows up.";

export default function Image() {
  return renderOgCard({
    title: "Breathe",
    description:
      "A tiny gap when agent-pace overwhelm shows up — a few physiological sighs, then back.",
  });
}
