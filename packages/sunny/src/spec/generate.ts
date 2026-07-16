import { colors, colorsP3, semantic, type Theme } from "../tokens/colors.ts";
import { components, focusRing } from "../tokens/components.ts";
import { SYSTEM } from "../tokens/index.ts";
import {
  breakpoints,
  container,
  motion,
  radius,
  SPACING_BASE,
  shadows,
  spacing,
} from "../tokens/layout.ts";
import { STEPS } from "../tokens/ramp.ts";
import { typography } from "../tokens/typography.ts";

const q = (s: string) => `"${s}"`;

function frontmatter(theme: Theme): string {
  const c = colors[theme];
  const s = semantic[theme];
  const lines: string[] = [];

  lines.push("---");
  lines.push(`version: ${SYSTEM.version}`);
  lines.push(`name: ${SYSTEM.name}`);
  lines.push(
    `description: ${SYSTEM.name}, Nishil Faldu's design system, ${theme} theme (the ${
      theme === "light" ? "dark" : "light"
    } theme is documented at /design${theme === "light" ? ".dark" : ""}.md).`,
  );

  lines.push("colors:");
  for (const [k, v] of Object.entries(s)) lines.push(`  ${k}: ${q(v)}`);
  lines.push(`  background-100: ${q(c.background[100])}`);
  lines.push(`  background-200: ${q(c.background[200])}`);
  for (const [name, ramp] of [
    ["gray", c.gray],
    ["gray-alpha", c.grayAlpha],
    ["amber", c.amber],
    ["blue", c.blue],
    ["red", c.red],
    ["green", c.green],
  ] as const) {
    for (const step of STEPS) lines.push(`  ${name}-${step}: ${q(ramp[step])}`);
  }
  lines.push(
    "  # Wide-gamut accent variants in oklch for P3 displays (sRGB hex above is the fallback)",
  );
  for (const [name, ramp] of Object.entries(colorsP3[theme])) {
    for (const step of STEPS)
      lines.push(`  ${name}-${step}-p3: ${q(ramp[step as never])}`);
  }

  lines.push("typography:");
  for (const [name, t] of Object.entries(typography)) {
    lines.push(`  ${name}:`);
    lines.push(`    fontFamily: ${t.fontFamily}`);
    lines.push(`    fontSize: ${t.fontSize}px`);
    lines.push(`    fontWeight: ${t.fontWeight}`);
    lines.push(`    lineHeight: ${t.lineHeight}px`);
    if ("letterSpacing" in t && t.letterSpacing) {
      lines.push(`    letterSpacing: ${t.letterSpacing}px`);
    }
  }

  lines.push("spacing:");
  for (const [k, v] of Object.entries(spacing)) lines.push(`  ${k}: ${v}px`);
  lines.push(`  base: ${SPACING_BASE}px`);

  lines.push("container:");
  for (const [k, v] of Object.entries(container)) lines.push(`  ${k}: ${v}px`);

  lines.push("breakpoints:");
  for (const [k, v] of Object.entries(breakpoints))
    lines.push(`  ${q(k)}: ${v}px`);

  lines.push("rounded:");
  for (const [k, v] of Object.entries(radius)) lines.push(`  ${k}: ${v}px`);

  lines.push("shadows:");
  for (const [k, v] of Object.entries(shadows[theme]))
    lines.push(`  ${k}: ${q(v)}`);

  lines.push("motion:");
  lines.push(`  easing: ${q(motion.easing)}`);
  for (const [k, v] of Object.entries(motion.duration))
    lines.push(`  ${k}: ${v}ms`);

  lines.push("components:");
  for (const [name, spec] of Object.entries(components)) {
    lines.push(`  ${name}:`);
    for (const [k, v] of Object.entries(spec)) {
      lines.push(
        `    ${k}: ${typeof v === "number" ? `${v}px` : q(String(v))}`,
      );
    }
  }
  lines.push(`  focus-ring: ${q(focusRing[theme])}`);

  lines.push("---");
  return lines.join("\n");
}

function prose(theme: Theme): string {
  const other = theme === "light" ? "dark" : "light";
  const otherPath = theme === "light" ? "/design.dark.md" : "/design.md";
  const s = semantic[theme];

  return `
# ${SYSTEM.name}

## Overview

${SYSTEM.name} is the design system behind nishilfaldu.com and everything Nishil Faldu builds after it. It is deliberately small: one accent, one neutral, four scales, and a bias toward getting out of the way of the content.

The name sets the temperature. ${SYSTEM.name}'s neutrals are not pure gray — they carry a trace of warmth, so surfaces read like paper in daylight rather than like a screen. Colour is used to mean something, never to decorate. If a page can carry an idea with type and space alone, it should.

This is the ${theme} theme. The ${other} theme uses the same token names with different values and lives at \`${otherPath}\`. Colors are sRGB hex, with Display P3 equivalents for accent scales.

## Colors

Every non-background scale runs ten steps (\`100\`–\`1000\`), and the step encodes intent rather than shade:

- \`100\` default background
- \`200\` hover background
- \`300\` active background
- \`400\` default border
- \`500\` hover border
- \`600\` active border
- \`700\` solid fill, high contrast
- \`800\` solid fill, hover
- \`900\` secondary text and icons
- \`1000\` primary text and icons

The number tells you the job. The border gray is always \`400\`, in every scale, in every app — so you never have to stop and choose.

\`background-100\` is the primary page and card surface; \`background-200\` is a secondary surface for subtle separation, not a general fill. The \`gray-alpha-*\` tokens are translucent and layer over anything, which makes them right for borders, dividers, overlays, and hover states. Solid \`gray-*\` holds its contrast on any surface, so it belongs on text and opaque fills. Don't swap one for the other; they are separate scales.

Four accent scales carry meaning. \`amber\` is the brand accent and the system's signature. \`blue\` is links, focus, and information. \`green\` is success, \`red\` is error. There is deliberately no teal, purple, or pink: a scale you cannot describe the job of is a scale you don't need yet.

One consequence worth stating plainly: amber is the brand colour but **not** the link colour. Yellow cannot be both saturated and dark enough in sRGB to carry 4.5:1 body text, so forcing amber into that role produces either an inaccessible link or a muddy brown. Amber leads with fills and marks, where it can be bright; blue does the work that needs contrast. Every pairing in this file is verified against WCAG AA on both \`background-100\` and \`background-200\` rather than approved by eye.

## Typography

${SYSTEM.name} Sans sets UI and prose; ${SYSTEM.name} Mono sets code, data, and figures that need to line up. Both currently resolve to Geist Sans and Geist Mono, which are open source under the SIL Open Font License. The system names the *role* rather than the vendor, so changing typeface later is one line.

The tokens carry concrete \`fontFamily\`, \`fontSize\`, \`fontWeight\`, \`lineHeight\`, and \`letterSpacing\`. Four roles:

- **Headings**, \`heading-64\` to \`heading-16\`, title pages and sections. Letter spacing tightens as size grows, because type set large looks loose at the same tracking that reads well small.
- **Copy**, \`copy-20\` to \`copy-14\`, sets multi-line body text with a taller line height for reading.
- **Labels**, \`label-16\` to \`label-12\`, carry single-line scannable text: navigation, form labels, metadata.
- **Buttons**, \`button-16\` to \`button-12\`, are medium-weight labels for controls.

\`copy-16\` and \`label-14\` cover most text. Use the tokens rather than setting size, weight, or line height by hand.

## Layout

Spacing is a ${SPACING_BASE}px base, and the key is the multiplier — \`spacing.6\` is 24px — so the arithmetic stays checkable. Keep a three-step rhythm: 8px inside a group, 16px between groups, 32–40px between sections. Cards take 24px of padding, 16px when compact, 32px for hero areas.

Prose sits in a ${container.measure}px column, because a line much longer than that is measurably harder to read. General content uses ${container.content}px. Breakpoints are \`sm\` ${breakpoints.sm}px, \`md\` ${breakpoints.md}px, \`lg\` ${breakpoints.lg}px, \`xl\` ${breakpoints.xl}px, \`2xl\` ${breakpoints["2xl"]}px. Every layout works on mobile and desktop.

## Elevation & Depth

Hierarchy comes from surface and border first, so shadows stay quiet. Shadows are tinted with the warm neutral rather than pure black — a black shadow over a warm surface reads as a smudge.

- \`sm\` raised cards
- \`md\` popovers and menus
- \`lg\` modals and dialogs

Tooltips take the lightest. Pair each elevation with the matching radius.

## Motion

Motion clarifies a change or it doesn't happen. Most interactions should feel instant — \`0ms\` is frequently the right answer and always worth considering first. When motion genuinely helps, keep it short and physical with \`${motion.easing}\`: ${motion.duration.state}ms for state changes, ${motion.duration.popover}ms for popovers and tooltips, ${motion.duration.overlay}ms for overlays and modals. Nothing loops, nothing asks for attention, and \`prefers-reduced-motion\` drops anything non-essential.

## Shapes

Radii stay tight: ${radius.sm}px for everyday surfaces and controls, ${radius.md}px for menus and modals, ${radius.lg}px for fullscreen surfaces. Reserve \`full\` for pills, avatars, and circular controls. One radius family per view — don't mix rounded and sharp corners.

## Components

The \`components\` tokens above give ready values per element, expressed as references (\`{colors.gray-1000}\`) so you can trace where a value came from.

- **Primary button**: solid \`gray-1000\` fill with a \`background-100\` label, for the single most important action on a view.
- **Secondary button**: \`background-100\` fill with a translucent \`gray-alpha-400\` border.
- **Tertiary button**: transparent, \`gray-1000\` text, for low-emphasis actions; tints with \`gray-alpha\` on hover.
- **Accent button**: solid \`amber-700\` with dark text. Bright enough that it takes dark ink, not white.
- **Error button**: solid \`red-800\` with white text, for destructive actions.
- **Input**: \`background-100\` fill, translucent border, ${radius.sm}px radius.

Variants are the default medium (40px) size; \`-small\` is 32px and \`-large\` is 48px, which steps up to \`button-16\`. States step the scale: a \`100\` fill becomes \`200\` on hover and \`300\` on active; borders move \`400\` → \`500\` → \`600\`. Disabled uses a \`gray-100\` fill, \`gray-700\` text, and \`cursor: not-allowed\`. Focus shows a two-layer ring — a 2px gap in the surface colour, then a 2px \`blue-700\` ring — so it stays visible even on a same-coloured fill.

## Voice & Content

Copy is part of the design.

- Sentence case for body, helper text, and toasts. Title Case for buttons, labels, and tabs.
- Name actions with a verb and a noun (\`Send Message\`, \`Copy Link\`), never \`Confirm\`, \`OK\`, or a bare verb.
- Errors say what happened and what to do next: \`Couldn't load projects. Check your connection and retry.\`
- Toasts name the thing that changed, drop the trailing period, and never say "successfully": \`Link copied\`.
- Empty states point at the first action.
- Present participle with an ellipsis for in-progress states: \`Loading…\`, \`Saving…\`.
- Numerals (\`3 projects\`), curly quotes, real ellipses. No "please", no superlatives.

## Do's and Don'ts

- Use the gray scale to rank information: \`1000\` primary text (${s.primary}), \`900\` secondary (${s.secondary}), \`700\` disabled.
- Keep solid accent for state and the single most important action on a view.
- Hold WCAG AA (4.5:1 for body text) and verify it, don't eyeball it.
- Show a focus ring on every interactive element at \`:focus-visible\`, and never remove an outline without a visible replacement.
- Apply typography tokens instead of setting size, line height, or weight by hand.
- Don't signal state with colour alone; pair it with an icon or text.
- Don't use \`background-200\` as a general fill; it exists for subtle separation.
- Don't mix rounded and sharp corners, or more than two font weights, in one view.
- Don't reach for a new colour. If the four scales can't say it, the design probably isn't clear yet.
`.trimStart();
}

export function generateSpec(theme: Theme): string {
  return `${frontmatter(theme)}\n\n${prose(theme)}`;
}
