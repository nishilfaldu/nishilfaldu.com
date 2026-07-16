import { colors, semantic, type Theme } from "./colors.ts";
import { radius, shadows, spacing } from "./layout.ts";
import type { Step } from "./ramp.ts";
import { type TypeName, typography } from "./typography.ts";

/**
 * Turns a `{group.name}` reference from `components.ts` into a real value for a
 * theme.
 *
 * The point is that there is exactly one way to read the component contract.
 * The docs page renders through this and the contrast audit checks through it,
 * so a component whose documented value differs from its rendered one isn't
 * expressible — which is the same anti-drift property the rest of Sunny has,
 * extended to the layer that had been getting it on the honour system.
 */
const REF = /^\{([a-z]+)\.([a-z0-9-]+)\}$/i;

/** A ramp name plus a step, e.g. `gray-1000` or `background-100`. */
function colorValue(theme: Theme, name: string): string | undefined {
  const c = colors[theme];
  const match = name.match(/^(.*)-(\d+)$/);
  if (!match) return undefined;
  const [, ramp, rawStep] = match;
  const step = Number(rawStep) as Step;

  const table: Record<string, Partial<Record<Step, string>>> = {
    background: c.background,
    gray: c.gray,
    "gray-alpha": c.grayAlpha,
    amber: c.amber,
    blue: c.blue,
    green: c.green,
    red: c.red,
  };
  return table[ramp]?.[step];
}

export function resolve(ref: string, theme: Theme): string {
  const match = ref.match(REF);
  // Literals pass through: `padding: "0 12px"` is already a value.
  if (!match) return ref;

  const [, group, name] = match;
  const value = (() => {
    switch (group) {
      case "colors":
        return colorValue(theme, name);
      case "semantic":
        return (semantic[theme] as Record<string, string>)[name];
      case "radius":
        return radius[name as keyof typeof radius] !== undefined
          ? `${radius[name as keyof typeof radius]}px`
          : undefined;
      case "spacing":
        return spacing[Number(name) as keyof typeof spacing] !== undefined
          ? `${spacing[Number(name) as keyof typeof spacing]}px`
          : undefined;
      case "shadows":
        return shadows[theme][name as keyof (typeof shadows)["light"]];
      case "typography":
        return typography[name as TypeName] ? name : undefined;
      default:
        return undefined;
    }
  })();

  if (value === undefined) {
    // A silently unresolved reference would render as the literal string
    // `{colors.amber-750}` and look like a styling bug three files away.
    throw new Error(`Unresolvable token reference: ${ref} (theme: ${theme})`);
  }
  return value;
}

/** Every `{...}` reference inside a string, resolved. For the focus ring. */
export function resolveAll(value: string, theme: Theme): string {
  return value.replace(/\{[a-z]+\.[a-z0-9-]+\}/gi, (ref) =>
    resolve(ref, theme),
  );
}

/**
 * The same reference as a CSS variable rather than a value for one theme.
 *
 * `resolve()` has to pick a theme, so anything rendered through it is frozen in
 * whichever theme was passed. The docs page renders once and must flip with the
 * reader's, so it goes through here — and still reads the value off the
 * contract, which is the part that matters.
 */
export function cssVar(ref: string): string {
  const match = ref.match(REF);
  if (!match) return ref;
  const [, group, name] = match;

  switch (group) {
    // `semantic` and `colors` share the --color-* namespace, exactly as
    // build-theme.mts emits them.
    case "colors":
    case "semantic":
      return `var(--color-${name})`;
    case "radius":
      return `var(--radius-${name})`;
    case "shadows":
      return `var(--shadow-${name})`;
    case "spacing":
      return `var(--spacing-${name})`;
    default:
      throw new Error(`No CSS variable for token reference: ${ref}`);
  }
}

/** Every `{...}` reference inside a string, as CSS variables. */
export function cssVarAll(value: string): string {
  return value.replace(/\{[a-z]+\.[a-z0-9-]+\}/gi, (ref) => cssVar(ref));
}
