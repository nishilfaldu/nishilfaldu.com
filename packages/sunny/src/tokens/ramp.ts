import { converter, formatHex, toGamut, wcagContrast } from "culori";

/**
 * Every scale runs 100–1000, and the step encodes intent rather than shade:
 *
 *   100 default background   600 active border
 *   200 hover background     700 solid fill, high contrast
 *   300 active background    800 solid fill, hover
 *   400 default border       900 secondary text and icons
 *   500 hover border        1000 primary text and icons
 */
export const STEPS = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
] as const;

export type Step = (typeof STEPS)[number];
export type Ramp = Record<Step, string>;

/** Lightness (0–1) and chroma per step, in OKLCH. */
export type RampShape = {
  hue: number;
  lightness: Record<Step, number>;
  chroma: Record<Step, number>;
};

const toOklch = converter("oklch");
const fitToSrgb = toGamut("rgb", "oklch");

/**
 * OKLCH is perceptual: equal lightness steps look equally spaced, which plain
 * hex or HSL cannot promise. We author there and emit hex for compatibility.
 */
export function oklch(l: number, c: number, h: number) {
  return { mode: "oklch" as const, l, c, h };
}

/** sRGB hex, gamut-mapped. Colors outside sRGB are folded back in, not clipped. */
export function hex(l: number, c: number, h: number): string {
  return formatHex(fitToSrgb(oklch(l, c, h)));
}

/** Wide-gamut value for P3 displays, kept as authored since P3 covers more than sRGB. */
export function p3(l: number, c: number, h: number): string {
  const round = (n: number, places: number) =>
    Number(n.toFixed(places)).toString();
  return `oklch(${round(l * 100, 2)}% ${round(c, 4)} ${round(h, 2)})`;
}

export function buildRamp(shape: RampShape): Ramp {
  const ramp = {} as Ramp;
  for (const step of STEPS) {
    ramp[step] = hex(shape.lightness[step], shape.chroma[step], shape.hue);
  }
  return ramp;
}

export function buildRampP3(shape: RampShape): Ramp {
  const ramp = {} as Ramp;
  for (const step of STEPS) {
    ramp[step] = p3(shape.lightness[step], shape.chroma[step], shape.hue);
  }
  return ramp;
}

/**
 * Translucent variant of a ramp. Alpha tokens layer over any surface, so they
 * survive theme changes that solid tokens do not — use them for borders,
 * dividers, and hover states.
 */
export function buildAlphaRamp(
  hueColor: string,
  alphas: Record<Step, number>,
): Ramp {
  const ramp = {} as Ramp;
  for (const step of STEPS) {
    const a = Math.round(alphas[step] * 255)
      .toString(16)
      .padStart(2, "0");
    ramp[step] = `${hueColor}${a}`;
  }
  return ramp;
}

export function contrast(a: string, b: string): number {
  return wcagContrast(a, b);
}

/** WCAG AA: 4.5:1 for body text, 3:1 for large text and UI boundaries. */
export function meetsAA(fg: string, bg: string, large = false): boolean {
  return contrast(fg, bg) >= (large ? 3 : 4.5);
}

/**
 * The two inks a label on a solid fill is allowed to use. Theme-independent on
 * purpose: `gray-1000` flips to near-white in the dark theme, so a fill's label
 * can't be chosen from it.
 */
export const LIGHT_INK = "#ffffff";
export const DARK_INK = "#1c1a18";

/**
 * The legible ink for text on a solid fill, derived rather than declared.
 *
 * Hand-picking this is how `button-accent` shipped `gray-1000` on amber: fine in
 * light at 8.70:1, and 1.72:1 in dark once the ink flipped to near-white while
 * amber stayed put. The fill decides the ink, so ask the fill.
 */
export function inkOn(fill: string): string {
  return contrast(LIGHT_INK, fill) >= contrast(DARK_INK, fill)
    ? LIGHT_INK
    : DARK_INK;
}

export { toOklch };
