import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "People — writers whose next piece I don’t want to miss.";

export default function Image() {
  return renderOgCard({
    title: "People",
    description:
      "The few writers whose next piece I don’t want to miss, and every place each of them publishes.",
  });
}
