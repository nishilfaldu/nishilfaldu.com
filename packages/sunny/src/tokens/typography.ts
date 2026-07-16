export type TypeToken = {
  fontFamily: "Sunny Sans" | "Sunny Mono";
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: number;
};

const sans = "Sunny Sans" as const;
const mono = "Sunny Mono" as const;

/**
 * Four roles, and the role picks the metrics for you:
 *
 *   heading  section and page titles; tracking tightens as size grows
 *   copy     multi-line body text, taller line height for reading
 *   label    single-line scannable text: nav, form labels, metadata
 *   button   medium-weight labels for controls
 *
 * copy-16 and label-14 carry most of the system.
 */
export const typography = {
  "heading-64": {
    fontFamily: sans,
    fontSize: 64,
    fontWeight: 600,
    lineHeight: 64,
    letterSpacing: -2.56,
  },
  "heading-48": {
    fontFamily: sans,
    fontSize: 48,
    fontWeight: 600,
    lineHeight: 52,
    letterSpacing: -1.92,
  },
  "heading-40": {
    fontFamily: sans,
    fontSize: 40,
    fontWeight: 600,
    lineHeight: 44,
    letterSpacing: -1.4,
  },
  "heading-32": {
    fontFamily: sans,
    fontSize: 32,
    fontWeight: 600,
    lineHeight: 38,
    letterSpacing: -0.96,
  },
  "heading-24": {
    fontFamily: sans,
    fontSize: 24,
    fontWeight: 600,
    lineHeight: 30,
    letterSpacing: -0.6,
  },
  "heading-20": {
    fontFamily: sans,
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  "heading-16": {
    fontFamily: sans,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 22,
    letterSpacing: -0.16,
  },

  "copy-20": {
    fontFamily: sans,
    fontSize: 20,
    fontWeight: 400,
    lineHeight: 32,
  },
  "copy-18": {
    fontFamily: sans,
    fontSize: 18,
    fontWeight: 400,
    lineHeight: 30,
  },
  "copy-16": {
    fontFamily: sans,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 26,
  },
  "copy-14": {
    fontFamily: sans,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 22,
  },
  "copy-16-mono": {
    fontFamily: mono,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 26,
  },
  "copy-14-mono": {
    fontFamily: mono,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 22,
  },

  "label-16": {
    fontFamily: sans,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 20,
  },
  "label-14": {
    fontFamily: sans,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 20,
  },
  "label-13": {
    fontFamily: sans,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 18,
  },
  "label-12": {
    fontFamily: sans,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 16,
  },
  "label-13-mono": {
    fontFamily: mono,
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 18,
  },
  "label-12-mono": {
    fontFamily: mono,
    fontSize: 12,
    fontWeight: 400,
    lineHeight: 16,
  },

  "button-16": {
    fontFamily: sans,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 20,
  },
  "button-14": {
    fontFamily: sans,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 20,
  },
  "button-12": {
    fontFamily: sans,
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 16,
  },
} satisfies Record<string, TypeToken>;

export type TypeName = keyof typeof typography;

/**
 * Geist Sans and Geist Mono are open source under the OFL and free to use
 * commercially. Sunny aliases them so the system names the role it needs
 * rather than the vendor, and swapping the typeface later touches one line.
 */
export const fontStacks = {
  "Sunny Sans": "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  "Sunny Mono":
    "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
} as const;
