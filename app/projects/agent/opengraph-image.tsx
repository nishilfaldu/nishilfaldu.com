import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Agent — notice something on this site, spin a Cursor cloud agent on the repo.";

export default function Image() {
  return renderOgCard({
    eyebrow: "Projects",
    title: "Agent",
    description:
      "Notice something, type a prompt, and a Cursor cloud agent goes off on this repo.",
  });
}
