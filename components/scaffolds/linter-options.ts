import type { NextLinter } from "@/components/scaffolds/next-prompt";

/** Shared Biome/ESLint radio options for every scaffold's picker. */
export const LINTERS: {
  id: NextLinter;
  name: string;
  blurb: string;
}[] = [
  {
    id: "biome",
    name: "Biome",
    blurb: "Single fast tool for lint + format. My usual default.",
  },
  {
    id: "eslint",
    name: "ESLint",
    blurb: "The ecosystem default, kept for stacks that expect it.",
  },
];
