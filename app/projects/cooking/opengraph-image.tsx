import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Cooking — open PRs, previews, and releases across watched GitHub repos.";

export default function Image() {
  return renderOgCard({
    eyebrow: "Projects",
    title: "Cooking",
    description:
      "A quiet corner of this site that shows what’s in flight across the repos I’m watching.",
  });
}
