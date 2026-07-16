/**
 * A 4px base. The numeric key is the multiplier, so `spacing[6]` is 24px and
 * the arithmetic stays checkable in your head.
 *
 * Rhythm: 8px inside a group, 16px between groups, 32–40px between sections.
 */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  24: 96,
  32: 128,
} as const;

export const SPACING_BASE = 4;

/**
 * Content column. Reading wants a narrower column than a full app layout.
 *
 * `measure` is the typographic term for line length, and it's the name here for
 * a second reason: Tailwind ships its own `.max-w-prose` (65ch), and a
 * `--container-prose` token loses to it silently — the token read 720px while
 * every page rendered 690. A key that generates a utility Tailwind already owns
 * is a token that does nothing, so don't reintroduce one.
 */
export const container = {
  measure: 720,
  content: 1100,
  wide: 1400,
} as const;

export const breakpoints = {
  sm: 480,
  md: 640,
  lg: 960,
  xl: 1200,
  "2xl": 1400,
} as const;

/** Tight radii. One radius family per view; never mix rounded and sharp. */
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 9999,
} as const;

/**
 * Hierarchy comes from surface and border first, so shadows stay quiet.
 * Warm-tinted rather than pure black, to match the neutrals.
 */
export const shadows = {
  light: {
    sm: "0 2px 2px rgba(28, 26, 24, 0.04)",
    md: "0 1px 1px rgba(28, 26, 24, 0.02), 0 4px 8px -4px rgba(28, 26, 24, 0.05), 0 16px 24px -8px rgba(28, 26, 24, 0.06)",
    lg: "0 1px 1px rgba(28, 26, 24, 0.02), 0 8px 16px -4px rgba(28, 26, 24, 0.05), 0 24px 32px -8px rgba(28, 26, 24, 0.07)",
  },
  dark: {
    sm: "0 2px 2px rgba(0, 0, 0, 0.3)",
    md: "0 1px 1px rgba(0, 0, 0, 0.2), 0 4px 8px -4px rgba(0, 0, 0, 0.4), 0 16px 24px -8px rgba(0, 0, 0, 0.5)",
    lg: "0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 16px -4px rgba(0, 0, 0, 0.4), 0 24px 32px -8px rgba(0, 0, 0, 0.55)",
  },
} as const;

/**
 * Motion clarifies a change or it does not happen. 0ms is often the right
 * answer. Honor prefers-reduced-motion by dropping anything non-essential.
 */
export const motion = {
  easing: "cubic-bezier(0.175, 0.885, 0.32, 1.1)",
  duration: {
    instant: 0,
    state: 150,
    popover: 200,
    overlay: 300,
  },
} as const;
