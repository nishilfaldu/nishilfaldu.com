import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Ideas — open loops on the site, not a notes dump.";

export default function Image() {
  return renderOgCard({
    title: "Ideas",
    description:
      "Open loops I’m willing to put on the site — a public tray instead of a notes dump.",
  });
}
