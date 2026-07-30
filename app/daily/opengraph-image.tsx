import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Daily — the short list of sites that earn a check every day.";

export default function Image() {
  return renderOgCard({
    title: "Daily",
    description:
      "The short list of sites that earn a check every day — a long list is one nobody opens.",
  });
}
