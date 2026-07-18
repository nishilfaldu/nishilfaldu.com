import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A small book — lines that shouldn’t live in Notes.";

export default function Image() {
  return renderOgCard({
    title: "A small book",
    description:
      "A place for lines that shouldn’t live in Notes — pages you can turn.",
  });
}
