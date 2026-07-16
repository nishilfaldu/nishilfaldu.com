import { ImageResponse } from "next/og";

/**
 * The share card. Same idea as the page: the name, the line, the address, and
 * one spot of amber.
 *
 * Rendered from the theme's own values rather than committed as a PNG, so it
 * can't quietly drift from the site the way an exported image does. The layout
 * is the one the hand-written site used — it was already right.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Nishil Faldu — the story of how I got here, and the small things I build to take a mess and make it sit still.";

const PAPER = "#ffffff";
const INK = "#171717";
const ACCENT = "#aa4d00";
const DOT = "#ffae00";

/**
 * Satori needs real font bytes; it can't use next/font. Google's CSS endpoint
 * hands back a versioned .ttf URL, so ask it each build rather than pinning a
 * path that expires.
 */
async function newsreader(weight: 400 | 500) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Newsreader:wght@${weight}`,
    { headers: { "User-Agent": "Mozilla/5.0 (Macintosh)" } },
  ).then((r) => r.text());

  const url = css.match(/https:\/\/[^)]+\.ttf/)?.[0];
  if (!url) throw new Error(`No Newsreader ${weight} in Google's CSS response`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function Image() {
  const [regular, medium] = await Promise.all([
    newsreader(400),
    newsreader(500),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: PAPER,
        color: INK,
        fontFamily: "Newsreader",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 110px",
      }}
    >
      {/* The name, then the dot — the mark's idea at full length: warmth as a
          full stop rather than a colour the whole card wears. */}
      {/* Satori has no baseline alignment, so the dot is pushed down by hand.
          At 30px with a 1.2 line box: 3px half-leading + ~22px ascent puts the
          baseline ~25px down, so an 8px dot resting on it starts at 17.
          Centre-aligning instead leaves it hovering mid-word like a bullet. */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
        <span style={{ fontSize: 30, fontWeight: 500 }}>Nishil Faldu</span>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            background: DOT,
            marginTop: 17,
          }}
        />
      </div>

      <div
        style={{
          fontSize: 66,
          lineHeight: 1.26,
          letterSpacing: "-0.01em",
          marginTop: 34,
          maxWidth: 900,
        }}
      >
        The story of how I got here, and the small things I build to take a mess
        and make it sit still.
      </div>

      <div style={{ fontSize: 24, color: ACCENT, marginTop: 44 }}>
        nishilfaldu.site
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: regular, weight: 400, style: "normal" },
        { name: "Newsreader", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
