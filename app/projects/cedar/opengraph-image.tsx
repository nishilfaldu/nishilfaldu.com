import { OG_SIZE, renderOgCard } from "@/components/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Cedar — a statically-typed language with a compiler written from scratch in Go.";

export default function Image() {
  return renderOgCard({
    eyebrow: "Projects",
    title: "Cedar",
    description:
      "A compiler from scratch in Go — source all the way down to native executables.",
  });
}
