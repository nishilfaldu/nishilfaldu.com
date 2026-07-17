import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Theme values for OG cards — match app/globals.css light paper. */
export const OG = {
  paper: "#ffffff",
  ink: "#171717",
  accent: "#aa4d00",
  muted: "#737373",
  dot: "#ffae00",
} as const;

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Satori needs real font bytes; it can't use next/font. Load Geist from the
 * installed package so cards match the site face.
 */
export async function geistFonts() {
  const [regular, medium] = await Promise.all([
    readFile(
      join(
        process.cwd(),
        "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf",
      ),
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules/geist/dist/fonts/geist-sans/Geist-Medium.ttf",
      ),
    ),
  ]);
  return [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
  ];
}
