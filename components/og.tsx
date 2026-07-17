import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Share cards stay on light paper on purpose. iMessage, Slack, X, etc. fetch a
 * static PNG — they don’t follow prefers-color-scheme — and a light card reads
 * cleanly in both light and dark chats. A dark thumbnail often looks like a
 * black rectangle in Messages.
 */
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
    {
      name: "Geist",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Geist",
      data: medium,
      weight: 500 as const,
      style: "normal" as const,
    },
  ];
}

export type OgCardInput = {
  /** Large headline (or the home essay line when used alone). */
  title: string;
  /** Supporting line under the title. */
  description?: string;
  /**
   * Small line above the title. When set, replaces the Nishil Faldu mark
   * (e.g. “Tinkerletter · Issue 01”).
   */
  eyebrow?: string;
  /** Nishil Faldu + amber dot. Default on when there’s no eyebrow. */
  mark?: boolean;
};

/** One composition for every share card — light paper, Geist, amber address. */
export async function renderOgCard({
  title,
  description,
  eyebrow,
  mark = !eyebrow,
}: OgCardInput): Promise<ImageResponse> {
  const fonts = await geistFonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: OG.paper,
        color: OG.ink,
        fontFamily: "Geist",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 110px",
      }}
    >
      {mark ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
          <span style={{ fontSize: 30, fontWeight: 500 }}>Nishil Faldu</span>
          {/* Satori has no baseline alignment — nudge the dot by hand. */}
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 8,
              background: OG.dot,
              marginTop: 17,
            }}
          />
        </div>
      ) : null}

      {eyebrow ? (
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: OG.muted,
            letterSpacing: "0.02em",
          }}
        >
          {eyebrow}
        </div>
      ) : null}

      <div
        style={{
          fontSize: description ? 64 : 66,
          fontWeight: description ? 500 : 400,
          lineHeight: 1.22,
          letterSpacing: "-0.02em",
          marginTop: mark || eyebrow ? 28 : 0,
          maxWidth: 960,
        }}
      >
        {title}
      </div>

      {description ? (
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.4,
            color: OG.ink,
            marginTop: 28,
            maxWidth: 880,
            opacity: 0.72,
          }}
        >
          {description}
        </div>
      ) : null}

      <div style={{ fontSize: 24, color: OG.accent, marginTop: 48 }}>
        nishilfaldu.site
      </div>
    </div>,
    { ...OG_SIZE, fonts },
  );
}
