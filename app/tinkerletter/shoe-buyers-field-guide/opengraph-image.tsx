import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "The Shoe Buyer’s Field Guide — your shoes already know something about your body that you probably don’t.";

export default function Image() {
  return renderOgCard({
    eyebrow: "Tinkerletter · Issue 01",
    title: "The Shoe Buyer’s Field Guide",
    description:
      "Your shoes already know something about your body that you probably don’t.",
  });
}
