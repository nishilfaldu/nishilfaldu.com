import { colors, semantic } from "../src/tokens/colors.ts";
import { components, disabled } from "../src/tokens/components.ts";
import { contrast, DARK_INK, LIGHT_INK } from "../src/tokens/ramp.ts";
import { resolve } from "../src/tokens/resolve.ts";

/**
 * Fails the build if any pairing drops below WCAG AA. The spec claims every
 * pairing is verified rather than eyeballed; this is what makes that true.
 *
 * Inks are theme-independent on purpose: gray-1000 flips to near-white in the
 * dark theme, so a solid fill's label has to be chosen from fixed inks.
 */

const BODY = 4.5;
const UI = 3;

let failures = 0;

function check(ok: boolean, msg: string) {
  if (!ok) failures++;
  console.log(`${ok ? "pass" : "FAIL"}  ${msg}`);
}

for (const theme of ["light", "dark"] as const) {
  const c = colors[theme];
  const s = semantic[theme];
  console.log(`\n${theme} — background-100 ${c.background[100]}`);

  const text: [string, string, number][] = [
    ["primary", s.primary, BODY],
    ["secondary", s.secondary, BODY],
    ["link", s.link, BODY],
    // a hover state is still body text and still has to clear AA
    ["link-hover", s["link-hover"], BODY],
    ["accent", s.accent, BODY],
    ["success", s.success, BODY],
    ["warning", s.warning, BODY],
    ["error", s.error, BODY],
    ["gray-700 (disabled)", c.gray[700], UI],
    // The focus ring isn't text, so it answers to the 3:1 UI bar rather than
    // 4.5:1 — but it does have to clear it. For someone navigating by keyboard
    // this ring is the entire interface, and it was the one role nothing checked.
    ["focus (ring)", s.focus, UI],
  ];

  for (const [name, fg, min] of text) {
    for (const [surface, bg] of [
      ["bg-100", c.background[100]],
      ["bg-200", c.background[200]],
    ] as const) {
      const r = contrast(fg, bg);
      check(
        r >= min,
        `${`${name} on ${surface}`.padEnd(28)} ${fg}  ${r.toFixed(2)}:1`,
      );
    }
  }

  for (const scale of ["amber", "blue", "red", "green"] as const) {
    for (const step of [700, 800] as const) {
      const fill = c[scale][step];
      const light = contrast(LIGHT_INK, fill);
      const dark = contrast(DARK_INK, fill);
      const best = Math.max(light, dark);
      const ink = light > dark ? "light ink" : "dark ink";
      check(
        best >= BODY,
        `${`${scale}-${step} fill`.padEnd(28)} ${fill}  ${ink} ${best.toFixed(2)}:1`,
      );
    }
  }

  /**
   * The loop above proves a legible ink *exists* for each fill. It does not
   * prove the components chose it — `button-accent` shipped gray-1000 on amber
   * (1.72:1 in dark) while this file happily reported amber-700 as fine with
   * dark ink. Check what the contract actually says.
   */
  for (const [name, spec] of Object.entries(components)) {
    if (!("backgroundColor" in spec) || !("textColor" in spec)) continue;
    const fg = resolve(spec.textColor, theme);

    // Rest, hover and active all carry the label, so all three face the same
    // bar. A hover state that drops below AA is a button that goes unreadable
    // exactly when you're about to press it.
    const fills: [string, string][] = [["", spec.backgroundColor]];
    if ("hoverBackgroundColor" in spec)
      fills.push([":hover", spec.hoverBackgroundColor]);
    if ("activeBackgroundColor" in spec)
      fills.push([":active", spec.activeBackgroundColor]);

    for (const [state, ref] of fills) {
      const bg = resolve(ref, theme);
      const r = contrast(fg, bg);
      check(
        r >= BODY,
        `${`${name}${state}`.padEnd(28)} ${fg} on ${bg}  ${r.toFixed(2)}:1`,
      );
    }
  }

  // Disabled is exempt from AA by design, but still has to be *seen*.
  const dbg = resolve(disabled.backgroundColor, theme);
  const dfg = resolve(disabled.textColor, theme);
  check(
    contrast(dfg, dbg) >= UI,
    `${"disabled".padEnd(28)} ${dfg} on ${dbg}  ${contrast(dfg, dbg).toFixed(2)}:1 (UI bar)`,
  );
}

if (failures > 0) {
  console.error(`\n${failures} pairing(s) below WCAG AA`);
  process.exit(1);
}
console.log("\nAll pairings meet WCAG AA.");
