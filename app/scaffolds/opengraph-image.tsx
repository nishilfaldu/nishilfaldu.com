import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Scaffolds — prompts that run official CLIs the way I always set projects up.";

export default function Image() {
  return renderOgCard({
    title: "Scaffolds",
    description:
      "Prompts that scaffold Next.js, TanStack Start, Electron, and Expo the way I always set projects up.",
  });
}
