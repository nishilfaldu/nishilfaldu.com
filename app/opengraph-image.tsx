import { ImageResponse } from "next/og";
import { geistFonts, OG, OG_SIZE } from "@/components/og";

/**
 * Share card for the homepage — name, line, address, one spot of amber.
 */
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt =
  "Nishil Faldu — the story of how I got here, and the small things I build to take a mess and make it sit still.";

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
      {/* Satori has no baseline alignment, so the dot is pushed down by hand.
          At 30px with a 1.2 line box: 3px half-leading + ~22px ascent puts the
          baseline ~25px down, so an 8px dot resting on it starts at 17. */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
        <span style={{ fontSize: 30, fontWeight: 500 }}>Nishil Faldu</span>
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

      <div
        style={{
          fontSize: 66,
          lineHeight: 1.26,
          letterSpacing: "-0.02em",
          marginTop: 34,
          maxWidth: 900,
        }}
      >
        The story of how I got here, and the small things I build to take a mess
        and make it sit still.
      </div>

      <div style={{ fontSize: 24, color: OG.accent, marginTop: 44 }}>
        nishilfaldu.site
      </div>
    </div>,
    { ...size, fonts },
  );
}
