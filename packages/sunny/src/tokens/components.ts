/**
 * Ready-to-use values per element, expressed as token references rather than
 * literals so the spec can resolve them and the docs can show the lineage.
 * `resolve()` turns a reference into the value for a theme; the docs page and
 * the contrast audit both go through it, so a component that documents one
 * value and renders another isn't expressible.
 *
 * Variants below are the default medium (40px) size; -small is 32px and
 * -large is 48px.
 *
 * States are tokens, not prose. They used to be a paragraph here saying hover
 * steps 100 -> 200 -> 300 and borders 400 -> 500 -> 600, which no code read and
 * no audit checked, so `hoverBackgroundColor` and friends are declared per
 * variant and the audit holds every one of them to the same contrast bar as the
 * resting state. A hover you can't read is not a hover.
 *
 * A label on a fill names an `on-*` role rather than a step. `button-accent`
 * once said `{colors.gray-1000}`, which is near-black in light (8.70:1) and
 * near-white in dark (1.72:1) while amber-700 never moved — the contract was
 * unreadable in one theme and nothing caught it, because the audit checked the
 * palette rather than the components.
 */
export const components = {
  "button-primary": {
    backgroundColor: "{colors.gray-1000}",
    // The neutral fill sits at 1000 rather than the 700 the step contract
    // reserves for fills, because a near-black button is the point. It steps
    // *down* on hover for the same reason a 700 fill steps up: away from rest.
    hoverBackgroundColor: "{colors.gray-900}",
    activeBackgroundColor: "{colors.gray-800}",
    textColor: "{semantic.on-primary}",
    typography: "{typography.button-14}",
    rounded: "{radius.sm}",
    padding: "0 12px",
    height: 40,
  },
  "button-secondary": {
    backgroundColor: "{colors.background-100}",
    // An outlined button has no fill to darken, so the background steps up from
    // the surface and the border walks its own 400 -> 500 -> 600 track.
    hoverBackgroundColor: "{colors.gray-100}",
    activeBackgroundColor: "{colors.gray-200}",
    textColor: "{colors.gray-1000}",
    borderColor: "{colors.gray-alpha-400}",
    hoverBorderColor: "{colors.gray-alpha-500}",
    activeBorderColor: "{colors.gray-alpha-600}",
    typography: "{typography.button-14}",
    rounded: "{radius.sm}",
    padding: "0 12px",
    height: 40,
  },
  "button-tertiary": {
    backgroundColor: "{colors.background-100}",
    hoverBackgroundColor: "{colors.gray-100}",
    activeBackgroundColor: "{colors.gray-200}",
    textColor: "{colors.gray-1000}",
    typography: "{typography.button-14}",
    rounded: "{radius.sm}",
    padding: "0 12px",
    height: 40,
  },
  "button-accent": {
    backgroundColor: "{colors.amber-700}",
    // 700 -> 800 is the step contract's own answer: solid fill, then fill hover.
    hoverBackgroundColor: "{colors.amber-800}",
    activeBackgroundColor: "{colors.amber-800}",
    textColor: "{semantic.on-accent}",
    typography: "{typography.button-14}",
    rounded: "{radius.sm}",
    padding: "0 12px",
    height: 40,
  },
  "button-error": {
    backgroundColor: "{colors.red-800}",
    hoverBackgroundColor: "{colors.red-900}",
    activeBackgroundColor: "{colors.red-900}",
    textColor: "{semantic.on-error}",
    typography: "{typography.button-14}",
    rounded: "{radius.sm}",
    padding: "0 12px",
    height: 40,
  },
  "button-small": {
    typography: "{typography.button-12}",
    rounded: "{radius.sm}",
    padding: "0 8px",
    height: 32,
  },
  "button-large": {
    typography: "{typography.button-16}",
    rounded: "{radius.sm}",
    padding: "0 16px",
    height: 48,
  },
  input: {
    backgroundColor: "{colors.background-100}",
    textColor: "{colors.gray-1000}",
    placeholderColor: "{colors.gray-700}",
    borderColor: "{colors.gray-alpha-400}",
    hoverBorderColor: "{colors.gray-alpha-500}",
    typography: "{typography.label-14}",
    rounded: "{radius.sm}",
    padding: "0 12px",
    height: 40,
  },
  "input-error": {
    backgroundColor: "{colors.background-100}",
    textColor: "{colors.gray-1000}",
    borderColor: "{semantic.error}",
    typography: "{typography.label-14}",
    rounded: "{radius.sm}",
    padding: "0 12px",
    height: 40,
  },
  "input-small": {
    typography: "{typography.label-13}",
    rounded: "{radius.sm}",
    padding: "0 10px",
    height: 32,
  },
  "input-large": {
    typography: "{typography.label-16}",
    rounded: "{radius.sm}",
    padding: "0 14px",
    height: 48,
  },
  card: {
    backgroundColor: "{colors.background-100}",
    borderColor: "{colors.gray-alpha-400}",
    rounded: "{radius.md}",
    padding: "24px",
    shadow: "{shadows.sm}",
  },
} as const;

/**
 * One disabled look for every control, because "you can't use this" is one
 * message and shouldn't arrive in five different colors.
 *
 * `gray-700` on `gray-100` is deliberately the weakest text pairing in Sunny
 * that still clears the 3:1 UI bar. Disabled text is exempt from WCAG's 4.5:1
 * contrast minimum, and that exemption is the one place where being harder to
 * read carries the meaning.
 */
export const disabled = {
  backgroundColor: "{colors.gray-100}",
  textColor: "{colors.gray-700}",
  borderColor: "{colors.gray-alpha-300}",
  cursor: "not-allowed",
} as const;

/**
 * Two layers: a gap in the surface color, then the focus ring. The gap keeps
 * the ring legible when the control sits on a same-colored fill.
 *
 * Both themes say `{semantic.focus}` rather than `{colors.blue-700}` — focus is
 * a role, and a role is what the app should be free to move.
 */
export const focusRing = {
  light: "0 0 0 2px {colors.background-100}, 0 0 0 4px {semantic.focus}",
  dark: "0 0 0 2px {colors.background-100}, 0 0 0 4px {semantic.focus}",
} as const;
