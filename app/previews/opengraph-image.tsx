import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "In the works — live previews of branches that haven’t landed yet.";

export default function Image() {
  return renderOgCard({
    title: "In the works",
    description:
      "Live Vercel previews of branches that haven’t landed yet — what’s cooking, and where to open it.",
  });
}
