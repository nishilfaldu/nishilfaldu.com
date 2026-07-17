import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Tinkerletter — interactive issues you can touch instead of only reading about.";

export default function Image() {
  return renderOgCard({
    title: "Tinkerletter",
    description:
      "Interactive issues — ideas you can touch instead of only reading about.",
  });
}
