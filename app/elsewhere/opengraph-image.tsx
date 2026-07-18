import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Elsewhere — the other rooms on this site.";

export default function Image() {
  return renderOgCard({
    title: "Elsewhere",
    description:
      "The other rooms on this site — ideas, scaffolds, what’s in the works.",
  });
}
