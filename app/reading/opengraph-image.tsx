import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Reading — links I kept, filed under the day I found them.";

export default function Image() {
  return renderOgCard({
    title: "Reading",
    description:
      "Links I read and kept, filed under the day I found them — plus the few people whose next piece I don’t want to miss.",
  });
}
