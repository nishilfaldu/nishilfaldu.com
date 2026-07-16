import { colors, STEPS, type Step } from "@nishilfaldu/sunny";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Colors — Sunny",
  description:
    "Six scales, ten steps each, authored in OKLCH and verified against WCAG AA on both themes.",
};

/**
 * Section list matches Geist's: Scales, Backgrounds, then one per job group.
 * Nothing else. The page carried three sections Geist doesn't have — Gray alpha
 * (a scale, so it belongs in Scales), Contrast (a table of ratios proving an
 * invariant `pnpm contrast` already fails the build over), and the rationale,
 * which is now one deferred PRACTICES block. Long-form reasoning is AGENTS.md's
 * job.
 *
 * Within a job group the grid runs steps across, scales down, so the 400 column
 * *is* the border column — the argument for job order, made by the layout
 * instead of by a paragraph.
 *
 * Specimens name colours as `var(--color-*)`, never `colors.light[...]`, so
 * they render in the reader's theme. The Scales table is the deliberate
 * exception: it prints light-theme hexes and says so.
 */
const ACCENTS = ["gray", "amber", "blue", "green", "red"] as const;
type Ramp = (typeof ACCENTS)[number];

/**
 * Every scale, for the Scales section. `gray-alpha` is one of them — it had its
 * own section and its own demo until it turned out to be a scale like the rest,
 * with the same ten jobs and the same numbering. A sixth row in the table says
 * that better than a section claiming it.
 *
 * `key` indexes the tokens, `name` is the token prefix you actually type. They
 * differ for exactly one scale, which is why this can't just be a string.
 */
const SCALES = [
  { key: "gray", name: "gray", note: "Neutrals. Warm, not pure gray." },
  {
    key: "grayAlpha",
    name: "gray-alpha",
    note: "Translucent. The right border on any surface.",
  },
  {
    key: "amber",
    name: "amber",
    note: "Brand. Leads with fills, never links.",
  },
  { key: "blue", name: "blue", note: "Links, focus, information." },
  { key: "green", name: "green", note: "Success." },
  { key: "red", name: "red", note: "Error." },
] as const;

const INTENT: Record<Step, string> = {
  100: "Default background",
  200: "Hover background",
  300: "Active background",
  400: "Default border",
  500: "Hover border",
  600: "Active border",
  700: "Solid fill, high contrast",
  800: "Solid fill, hover",
  900: "Secondary text and icons",
  1000: "Primary text and icons",
};

/**
 * The rules worth stating, kept in one block at the bottom rather than spread
 * through the page as intros and captions. Each one is a constraint someone
 * would otherwise "fix" — every entry here is a bug that already happened.
 */
const PRACTICES: [string, string][] = [
  [
    "Reach for a step by its job, not by eye.",
    "amber-400 because you need an amber border — not because you liked that swatch.",
  ],
  [
    "Amber leads with fills, never links.",
    "Yellow can’t be both saturated and dark enough for 4.5:1 body text; darkening it makes brown. Blue does the contrast work.",
  ],
  [
    "Label a fill with an on-* role, never a step.",
    "amber-700 is the same hex in both themes but gray-1000 flips to near-white — hand-picking it shipped a button at 1.72:1 in the dark.",
  ],
  [
    "Border with gray-alpha-400, not gray-400.",
    "A solid gray only looks right on the surface it was picked against, and a border doesn’t know what it sits on.",
  ],
  [
    "A scrim is semantic.scrim, never gray-alpha.",
    "gray-alpha is white-based in the dark theme, so a gray-alpha scrim lightens the page instead of dimming it.",
  ],
  [
    "Keep the neutrals warm.",
    "Hue 75, barely any chroma: gray-100 is #f6f4f1, not #f2f2f2. It reads as paper rather than screen, and it’s why the system is called Sunny.",
  ],
];

function v(ramp: Ramp | "gray-alpha", step: Step): string {
  return `var(--color-${ramp}-${step})`;
}

/** Heading, one line, then the specimen. */
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-heading-24 text-gray-1000">{title}</h2>
      {children}
    </section>
  );
}

/** No caption slot on purpose — a specimen that needs explaining is the wrong specimen. */
function Demo({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-md border border-gray-alpha-400 bg-background-200 p-8">
      {children}
    </div>
  );
}

export default function ColorsPage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="max-w-measure">
        <Link
          href="/design/system"
          className="text-label-13 text-gray-900 hover:text-gray-1000"
        >
          ← Sunny
        </Link>
        <h1 className="mt-4 text-heading-48 text-gray-1000">Colors</h1>
        <p className="mt-4 text-copy-20 text-gray-900">
          Six scales, ten steps each, authored in OKLCH and gamut-mapped to
          sRGB. The step number is a job, and it means the same job in every
          scale. The build fails if any pairing misses WCAG AA.
        </p>
      </section>

      <section className="flex flex-col gap-10">
        <div className="max-w-measure">
          <h2 className="text-heading-24 text-gray-1000">Scales</h2>
          <p className="mt-2 text-copy-16 text-gray-900">
            Values are the light theme;{" "}
            <a
              href="/design.dark.md"
              className="text-link hover:text-link-hover"
            >
              design.dark.md
            </a>{" "}
            has the dark set.
          </p>
          {/* The step contract, stated once, next to the ramps it describes.
              It used to be repeated as column headers in every job section —
              which also meant every colour on the page rendered twice. */}
          <dl className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div key={step} className="flex gap-3">
                <dt className="w-10 shrink-0 text-label-13-mono text-gray-1000">
                  {step}
                </dt>
                <dd className="text-label-13 text-gray-900">{INTENT[step]}</dd>
              </div>
            ))}
          </dl>
        </div>
        {SCALES.map(({ key, name, note }) => (
          <section key={name}>
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <h3 className="text-heading-20 text-gray-1000">{name}</h3>
              <p className="text-label-13 text-gray-900">{note}</p>
            </div>
            <div className="overflow-x-auto">
              <div className="flex min-w-[640px] overflow-hidden rounded-sm border border-gray-alpha-400">
                {STEPS.map((step) => (
                  <div key={step} className="flex-1">
                    <div
                      className="h-16 w-full"
                      style={{ backgroundColor: colors.light[key][step] }}
                    />
                    <div className="border-gray-alpha-400 border-t bg-background-100 px-2 py-2">
                      <div className="text-label-12 text-gray-1000">{step}</div>
                      <div className="text-label-12-mono text-gray-900">
                        {colors.light[key][step]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </section>

      <section>
        <h2 className="text-heading-24 text-gray-1000">Backgrounds</h2>
        <p className="mt-2 max-w-measure text-copy-16 text-gray-900">
          The page itself, outside the scales.{" "}
          <code className="text-label-13-mono text-gray-1000">
            background-100
          </code>{" "}
          is the default surface;{" "}
          <code className="text-label-13-mono text-gray-1000">
            background-200
          </code>{" "}
          separates a region from it. Use it sparingly.
        </p>
        <Demo>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["100", "200"] as const).map((outer) => (
              <div
                key={outer}
                className="flex h-40 items-center justify-center rounded-sm border border-gray-alpha-400"
                style={{ backgroundColor: `var(--color-background-${outer})` }}
              >
                <div
                  className="flex h-24 w-32 items-center justify-center rounded-sm border border-gray-alpha-400"
                  style={{
                    backgroundColor: `var(--color-background-${
                      outer === "100" ? "200" : "100"
                    })`,
                  }}
                >
                  <span className="text-label-12-mono text-gray-900">
                    {outer === "100" ? "200" : "100"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Demo>
      </section>

      <Group title="100–300: Component backgrounds">
        <p className="mt-4 max-w-measure text-copy-16 text-gray-900">
          The fill behind a component that isn’t solid — a row, a badge, a ghost
          button. Hover and press the rows; they have no borders.
        </p>
        <Demo>
          <div className="grid gap-8 sm:grid-cols-2">
            <div className="flex flex-col">
              {["/projects", "/writing", "/about", "/design"].map((row) => (
                <button
                  key={row}
                  type="button"
                  className="flex items-center gap-3 rounded-sm bg-gray-100 px-3 py-2 text-left text-label-13-mono text-gray-900 transition-colors hover:bg-gray-200 active:bg-gray-300"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-gray-700"
                  />
                  {row}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-start gap-2">
              {(
                [
                  ["gray", "Draft"],
                  ["amber", "Building"],
                  ["blue", "Shipped"],
                  ["green", "Live"],
                  ["red", "Archived"],
                ] as const
              ).map(([ramp, label]) => (
                <span
                  key={ramp}
                  className="rounded-full px-2.5 py-1 text-label-12"
                  style={{
                    backgroundColor: v(ramp, 200),
                    color: v(ramp, 1000),
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Demo>
      </Group>

      <Group title="400–600: Borders">
        <p className="mt-4 max-w-measure text-copy-16 text-gray-900">
          The same three states, one layer out.
        </p>
        <Demo>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center rounded-sm border border-gray-alpha-400 bg-background-100 px-3 text-button-14 text-gray-1000 transition-colors hover:border-gray-alpha-500 active:border-gray-alpha-600"
            >
              New project
            </button>
            <input
              aria-label="Border demo"
              placeholder="Point at me"
              className="h-10 rounded-sm border border-gray-alpha-400 bg-background-100 px-3 text-label-14 text-gray-1000 transition-colors placeholder:text-gray-700 hover:border-gray-alpha-500"
            />
          </div>
        </Demo>
      </Group>

      <Group title="700–800: Solid fills">
        <p className="mt-4 max-w-measure text-copy-16 text-gray-900">
          Where a colour stops being a hint and becomes the element.
        </p>
        <Demo>
          <div className="flex flex-wrap gap-3">
            <span
              className="inline-flex h-10 items-center rounded-sm px-3 text-button-14"
              style={{
                backgroundColor: "var(--color-amber-700)",
                color: "var(--color-on-accent)",
              }}
            >
              Upgrade
            </span>
            <span
              className="inline-flex h-10 items-center rounded-sm px-3 text-button-14"
              style={{
                backgroundColor: "var(--color-red-800)",
                color: "var(--color-on-error)",
              }}
            >
              Delete
            </span>
            <span
              className="inline-flex h-10 items-center rounded-sm px-3 text-button-14"
              style={{
                backgroundColor: "var(--color-gray-1000)",
                color: "var(--color-on-primary)",
              }}
            >
              Deploy
            </span>
          </div>
        </Demo>
      </Group>

      <Group title="900–1000: Text and icons">
        <p className="mt-4 max-w-measure text-copy-16 text-gray-900">
          The two steps that clear 4.5:1. 1000 is what you read, 900 is
          everything supporting it.
        </p>
        <Demo>
          <div className="max-w-measure rounded-sm border border-gray-alpha-400 bg-background-100 p-6">
            <div className="flex items-baseline gap-2">
              <h3 className="text-heading-20 text-gray-1000">Sunny</h3>
              <span className="text-label-12-mono text-gray-900">v0.1.0</span>
            </div>
            <p className="mt-2 text-copy-14 text-gray-900">
              A design system with warm neutrals, one accent, and tokens
              verified against WCAG AA on both themes.
            </p>
            <div className="mt-4 flex gap-4">
              <span className="text-label-13 text-link">Read design.md</span>
              <span className="text-label-13 text-gray-900">Updated today</span>
            </div>
          </div>
        </Demo>
      </Group>

      <section className="max-w-measure">
        <h2 className="text-heading-24 text-gray-1000">Best practices</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {PRACTICES.map(([rule, why]) => (
            <li key={rule} className="flex flex-col gap-1">
              <span className="text-label-14 text-gray-1000">{rule}</span>
              <span className="text-copy-14 text-gray-900">{why}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
