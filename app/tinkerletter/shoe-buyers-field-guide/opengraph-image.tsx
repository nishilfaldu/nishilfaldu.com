import { ImageResponse } from "next/og";
import { geistFonts, OG, OG_SIZE } from "@/components/og";

/**
 * Share card for the Shoe Buyer’s Field Guide — its own title and line,
 * so iMessage / Slack don’t show the personal-site card.
 */
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "The Shoe Buyer’s Field Guide — your shoes already know something about your body that you probably don’t.";

export default async function Image() {
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
      <div
        style={{
          display: "flex",
          fontSize: 26,
          color: OG.muted,
          letterSpacing: "0.02em",
        }}
      >
        Tinkerletter · Issue 01
      </div>

      <div
        style={{
          fontSize: 64,
          fontWeight: 500,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          marginTop: 28,
          maxWidth: 960,
        }}
      >
        The Shoe Buyer’s Field Guide
      </div>

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
        Your shoes already know something about your body that you probably
        don’t.
      </div>

      <div style={{ fontSize: 24, color: OG.accent, marginTop: 48 }}>
        nishilfaldu.site
      </div>
    </div>,
    { ...size, fonts },
  );
}
