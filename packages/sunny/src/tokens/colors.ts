import {
  buildAlphaRamp,
  buildRamp,
  buildRampP3,
  inkOn,
  type Ramp,
  type RampShape,
  type Step,
} from "./ramp.ts";

/**
 * Sunny's neutrals carry a small amount of warmth (hue 75, the orange-yellow
 * side) rather than sitting at zero chroma. It reads as daylight-on-paper
 * instead of screen-gray, and it is the system's quietest brand signal.
 */
const GRAY_HUE = 75;

const grayLight: RampShape = {
  hue: GRAY_HUE,
  lightness: {
    100: 0.968,
    200: 0.945,
    300: 0.921,
    400: 0.9,
    500: 0.848,
    600: 0.775,
    700: 0.63,
    800: 0.558,
    900: 0.442,
    1000: 0.221,
  },
  chroma: {
    100: 0.004,
    200: 0.005,
    300: 0.006,
    400: 0.006,
    500: 0.008,
    600: 0.009,
    700: 0.011,
    800: 0.011,
    900: 0.009,
    1000: 0.006,
  },
};

const grayDark: RampShape = {
  hue: GRAY_HUE,
  lightness: {
    100: 0.235,
    200: 0.271,
    300: 0.31,
    400: 0.355,
    500: 0.42,
    600: 0.49,
    700: 0.6,
    800: 0.67,
    900: 0.775,
    1000: 0.949,
  },
  chroma: {
    100: 0.006,
    200: 0.007,
    300: 0.008,
    400: 0.009,
    500: 0.01,
    600: 0.011,
    700: 0.012,
    800: 0.011,
    900: 0.008,
    1000: 0.004,
  },
};

/**
 * Amber is the brand accent. Yellow cannot be both dark and saturated in sRGB,
 * so this ramp peaks in chroma near 600–700 while staying light there, and
 * leans on 900–1000 for anything that has to carry text contrast.
 */
const amberLight: RampShape = {
  hue: 72,
  lightness: {
    100: 0.977,
    200: 0.961,
    300: 0.938,
    400: 0.902,
    500: 0.86,
    600: 0.822,
    700: 0.79,
    800: 0.72,
    900: 0.52,
    1000: 0.3,
  },
  chroma: {
    100: 0.019,
    200: 0.032,
    300: 0.052,
    400: 0.086,
    500: 0.13,
    600: 0.16,
    700: 0.175,
    800: 0.168,
    900: 0.13,
    1000: 0.08,
  },
};

const amberDark: RampShape = {
  hue: 72,
  lightness: {
    100: 0.26,
    200: 0.305,
    300: 0.35,
    400: 0.42,
    500: 0.5,
    600: 0.62,
    700: 0.79,
    800: 0.84,
    900: 0.87,
    1000: 0.96,
  },
  chroma: {
    100: 0.035,
    200: 0.05,
    300: 0.066,
    400: 0.085,
    500: 0.105,
    600: 0.135,
    700: 0.175,
    800: 0.155,
    900: 0.13,
    1000: 0.04,
  },
};

const blueLight: RampShape = {
  hue: 252,
  lightness: {
    100: 0.973,
    200: 0.955,
    300: 0.932,
    400: 0.895,
    500: 0.82,
    600: 0.715,
    700: 0.545,
    800: 0.5,
    900: 0.46,
    1000: 0.28,
  },
  chroma: {
    100: 0.012,
    200: 0.02,
    300: 0.032,
    400: 0.05,
    500: 0.1,
    600: 0.16,
    700: 0.235,
    800: 0.23,
    900: 0.205,
    1000: 0.115,
  },
};

const blueDark: RampShape = {
  hue: 252,
  lightness: {
    100: 0.255,
    200: 0.3,
    300: 0.35,
    400: 0.415,
    500: 0.5,
    600: 0.6,
    700: 0.62,
    800: 0.7,
    900: 0.79,
    1000: 0.93,
  },
  chroma: {
    100: 0.045,
    200: 0.065,
    300: 0.085,
    400: 0.11,
    500: 0.14,
    600: 0.19,
    700: 0.23,
    800: 0.19,
    900: 0.15,
    1000: 0.05,
  },
};

const redLight: RampShape = {
  hue: 27,
  lightness: {
    100: 0.968,
    200: 0.95,
    300: 0.928,
    400: 0.89,
    500: 0.82,
    600: 0.71,
    700: 0.585,
    800: 0.54,
    900: 0.49,
    1000: 0.28,
  },
  chroma: {
    100: 0.014,
    200: 0.024,
    300: 0.038,
    400: 0.06,
    500: 0.105,
    600: 0.17,
    700: 0.21,
    800: 0.205,
    900: 0.185,
    1000: 0.105,
  },
};

const redDark: RampShape = {
  hue: 27,
  lightness: {
    100: 0.25,
    200: 0.295,
    300: 0.345,
    400: 0.41,
    500: 0.495,
    600: 0.59,
    700: 0.655,
    800: 0.71,
    900: 0.79,
    1000: 0.93,
  },
  chroma: {
    100: 0.045,
    200: 0.065,
    300: 0.088,
    400: 0.112,
    500: 0.145,
    600: 0.185,
    700: 0.21,
    800: 0.175,
    900: 0.14,
    1000: 0.05,
  },
};

const greenLight: RampShape = {
  hue: 150,
  lightness: {
    100: 0.972,
    200: 0.955,
    300: 0.932,
    400: 0.895,
    500: 0.83,
    600: 0.745,
    700: 0.605,
    800: 0.545,
    900: 0.48,
    1000: 0.28,
  },
  chroma: {
    100: 0.016,
    200: 0.028,
    300: 0.045,
    400: 0.07,
    500: 0.115,
    600: 0.155,
    700: 0.15,
    800: 0.135,
    900: 0.115,
    1000: 0.07,
  },
};

const greenDark: RampShape = {
  hue: 150,
  lightness: {
    100: 0.25,
    200: 0.295,
    300: 0.345,
    400: 0.41,
    500: 0.495,
    600: 0.6,
    700: 0.68,
    800: 0.74,
    900: 0.82,
    1000: 0.94,
  },
  chroma: {
    100: 0.03,
    200: 0.042,
    300: 0.055,
    400: 0.07,
    500: 0.09,
    600: 0.12,
    700: 0.145,
    800: 0.13,
    900: 0.1,
    1000: 0.035,
  },
};

/** Neutral anchors for the alpha ramps: black in light theme, white in dark. */
const ALPHA_STEPS: Record<Step, number> = {
  100: 0.05,
  200: 0.08,
  300: 0.1,
  400: 0.13,
  500: 0.21,
  600: 0.24,
  700: 0.44,
  800: 0.51,
  900: 0.7,
  1000: 0.91,
};

export type Theme = "light" | "dark";

export type ColorTokens = {
  background: { 100: string; 200: string };
  gray: Ramp;
  grayAlpha: Ramp;
  amber: Ramp;
  blue: Ramp;
  red: Ramp;
  green: Ramp;
};

const shapes = {
  light: {
    gray: grayLight,
    amber: amberLight,
    blue: blueLight,
    red: redLight,
    green: greenLight,
  },
  dark: {
    gray: grayDark,
    amber: amberDark,
    blue: blueDark,
    red: redDark,
    green: greenDark,
  },
} satisfies Record<Theme, Record<string, RampShape>>;

function build(theme: Theme): ColorTokens {
  const s = shapes[theme];
  return {
    background:
      theme === "light"
        ? { 100: "#ffffff", 200: "#fbfaf9" }
        : { 100: "#111110", 200: "#191817" },
    gray: buildRamp(s.gray),
    grayAlpha: buildAlphaRamp(
      theme === "light" ? "#000000" : "#ffffff",
      ALPHA_STEPS,
    ),
    amber: buildRamp(s.amber),
    blue: buildRamp(s.blue),
    red: buildRamp(s.red),
    green: buildRamp(s.green),
  };
}

function buildP3(theme: Theme) {
  const s = shapes[theme];
  return {
    amber: buildRampP3(s.amber),
    blue: buildRampP3(s.blue),
    red: buildRampP3(s.red),
    green: buildRampP3(s.green),
  };
}

export const colors: Record<Theme, ColorTokens> = {
  light: build("light"),
  dark: build("dark"),
};

export const colorsP3 = {
  light: buildP3("light"),
  dark: buildP3("dark"),
};

/**
 * The scrim behind a modal. Deliberately identical in both themes and NOT drawn
 * from `gray-alpha`, which flips to white-based in dark mode — a scrim has to
 * darken whatever is behind it, so it can't be a colour that changes direction
 * with the theme. Same trap the contrast audit hit with `gray-1000`.
 *
 * Warm-tinted to match the neutrals, like the shadows.
 */
const SCRIM = "rgba(28, 26, 24, 0.6)";

/** Semantic aliases. Everything else in the system points at these, not at raw steps. */
export const semantic = {
  light: {
    primary: colors.light.gray[1000],
    secondary: colors.light.gray[900],
    accent: colors.light.amber[900],
    link: colors.light.blue[700],
    // one step along the same scale — never amber, which can't carry text
    "link-hover": colors.light.blue[800],
    focus: colors.light.blue[700],
    success: colors.light.green[900],
    warning: colors.light.amber[900],
    error: colors.light.red[800],
    scrim: SCRIM,
    // Ink for a label sitting ON the fill of the same name, derived from the
    // fill so it can't be hand-picked wrong. See `inkOn`.
    "on-accent": inkOn(colors.light.amber[700]),
    "on-error": inkOn(colors.light.red[800]),
    "on-primary": colors.light.background[100],
  },
  dark: {
    primary: colors.dark.gray[1000],
    secondary: colors.dark.gray[900],
    accent: colors.dark.amber[700],
    link: colors.dark.blue[900],
    "link-hover": colors.dark.blue[1000],
    focus: colors.dark.blue[700],
    success: colors.dark.green[900],
    warning: colors.dark.amber[900],
    error: colors.dark.red[900],
    scrim: SCRIM,
    "on-accent": inkOn(colors.dark.amber[700]),
    "on-error": inkOn(colors.dark.red[800]),
    "on-primary": colors.dark.background[100],
  },
} satisfies Record<Theme, Record<string, string>>;
