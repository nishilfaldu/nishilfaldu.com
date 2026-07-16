import {
  breakpoints,
  container,
  motion,
  radius,
  SPACING_BASE,
  spacing,
} from "@nishilfaldu/sunny";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Layout & Spacing — Sunny",
  description:
    "A 4px base, three containers, five breakpoints, four radii. Space is the cheapest way to show what belongs together.",
};

/** What each radius is actually for, grounded in what the site uses it on. */
const RADIUS_USE: Record<string, string> = {
  sm: "Buttons, inputs, tags. The default.",
  md: "Cards, specimen frames, the ⌘K overlay.",
  lg: "The two cards on the /design hub, and nothing else yet.",
  full: "Pills and dots — the mark’s amber dot, badges.",
};

/**
 * Shadows named by the job rather than the blur radius. Geist calls this a
 * Material and bundles radius + stroke + shadow behind one name, which is the
 * same move as a type token bundling size/weight/leading: pick the role, get
 * the metrics.
 *
 * Not tokenised here yet, on purpose. The site has exactly two elevation roles
 * in real use and one dead shadow — inventing eight to look complete is how
 * eight type tokens ended up with no job. Promote this to real `elevation`
 * tokens when the portfolio produces the roles.
 */
const ELEVATION = [
  {
    shadow: "md",
    role: "raised",
    what: "A card lifting toward you on hover.",
    where: "The /design hub cards.",
  },
  {
    shadow: "lg",
    role: "overlay",
    what: "Something above the page rather than on it.",
    where: "The ⌘K menu.",
  },
  {
    shadow: "sm",
    role: null,
    what: "Nothing uses it.",
    where: "No job yet — see the empty cells on Typography for the same story.",
  },
] as const;

function Section({
  title,
  children,
  prose,
}: {
  title: string;
  prose: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section>
      <div className="max-w-measure">
        <h2 className="text-heading-24 text-gray-1000">{title}</h2>
        {prose}
      </div>
      {children}
    </section>
  );
}

/** The bar is the actual token value, so the picture can't disagree with the number. */
function SpacingRow({ step, px }: { step: string; px: number }) {
  return (
    <div className="flex items-center gap-4 border-gray-alpha-400 border-b py-3">
      <code className="w-10 shrink-0 text-label-12-mono text-gray-900">
        {step}
      </code>
      <code className="w-14 shrink-0 text-label-12-mono text-gray-700">
        {px}px
      </code>
      <div className="h-3 rounded-[2px] bg-amber-700" style={{ width: px }} />
    </div>
  );
}

const RHYTHM = [
  ["8px", "2", "Inside a group — a label and the input it names."],
  ["16px", "4", "Between groups — one field and the next."],
  ["32–40px", "8 / 10", "Between sections — where the subject changes."],
] as const;

export default function LayoutPage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="max-w-measure">
        <Link
          href="/design/system"
          className="text-label-13 text-gray-900 hover:text-gray-1000"
        >
          ← Sunny
        </Link>
        <h1 className="mt-4 text-heading-48 text-gray-1000">
          Layout & Spacing
        </h1>
        <p className="mt-4 text-copy-20 text-gray-900">
          Space is the cheapest way to show what belongs together. Before a
          border, before a background, before a heading — move the things that
          are related closer to each other than they are to anything else, and
          most of the structure explains itself.
        </p>
      </section>

      <Section
        title="The 4px base"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              Every gap in Sunny is a multiple of{" "}
              <code className="text-label-13-mono text-gray-1000">
                {SPACING_BASE}px
              </code>
              . Not because 4 is magic, but because a fixed grid removes a
              question you would otherwise answer freshly every time. Is this
              gap 13px or 14px? Neither. It’s 12 or 16, and you pick in a second
              instead of a minute.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              The key <em className="text-gray-1000 not-italic">is</em> the
              multiplier —{" "}
              <code className="text-label-13-mono">spacing[6]</code> is 24px —
              so the arithmetic stays checkable in your head. The scale thins
              out as it grows: you need 4 and 8 to be distinct, but nobody can
              tell 96px from 100px, so above 24 it jumps.
            </p>
          </>
        }
      >
        <div className="mt-6 border-gray-alpha-400 border-t">
          {Object.entries(spacing).map(([step, px]) => (
            <SpacingRow key={step} step={step} px={px} />
          ))}
        </div>
      </Section>

      <Section
        title="Rhythm"
        prose={
          <p className="mt-2 text-copy-16 text-gray-900">
            Having a scale doesn’t tell you which step to reach for. This does —
            three distances, each roughly double the last, because a difference
            has to be obvious to read as a grouping at all.
          </p>
        }
      >
        <dl className="mt-6 flex flex-col gap-4">
          {RHYTHM.map(([size, token, what]) => (
            <div
              key={size}
              className="border-gray-alpha-400 border-b pb-4 sm:flex sm:gap-6"
            >
              <dt className="flex shrink-0 items-baseline gap-2 sm:w-56">
                <span className="text-heading-16 text-gray-1000">{size}</span>
                <code className="text-label-12-mono text-gray-700">
                  spacing[{token}]
                </code>
              </dt>
              <dd className="text-copy-16 text-gray-900">{what}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 rounded-md border border-gray-alpha-400 bg-background-200 p-6">
          <div className="flex flex-col" style={{ gap: spacing[10] }}>
            <div className="flex flex-col" style={{ gap: spacing[4] }}>
              <div className="flex flex-col" style={{ gap: spacing[2] }}>
                <span className="text-label-13 text-gray-900">Name</span>
                <div className="h-9 rounded-sm border border-gray-alpha-400 bg-background-100" />
              </div>
              <div className="flex flex-col" style={{ gap: spacing[2] }}>
                <span className="text-label-13 text-gray-900">Email</span>
                <div className="h-9 rounded-sm border border-gray-alpha-400 bg-background-100" />
              </div>
            </div>
            <div className="flex flex-col" style={{ gap: spacing[2] }}>
              <span className="text-label-13 text-gray-900">Notes</span>
              <div className="h-20 rounded-sm border border-gray-alpha-400 bg-background-100" />
            </div>
          </div>
        </div>
        <p className="mt-3 max-w-measure text-copy-14 text-gray-900">
          Nothing above is grouped by a box or a rule. The two name/email fields
          read as a pair only because 16px sits between them and 40px sits
          below.
        </p>
      </Section>

      <Section
        title="Containers"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              A container caps how wide content gets on a large screen. Reading
              needs the tightest cap: past roughly 75 characters a line gets
              long enough that your eye loses its place travelling back to the
              start of the next one. That limit is about the reader, not the
              screen, so it doesn’t move when the monitor gets bigger.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              <span className="text-gray-1000">Measure</span> is the typographic
              name for that line length, and it’s what this column is set to.
              Specimens break out to{" "}
              <code className="text-label-13-mono text-gray-1000">content</code>{" "}
              because a grid of swatches isn’t read left to right, and{" "}
              <code className="text-label-13-mono text-gray-1000">wide</code>{" "}
              exists for the rare thing that needs the whole window.
            </p>
          </>
        }
      >
        <div className="mt-6 flex flex-col gap-3">
          {Object.entries(container).map(([name, px]) => (
            <div key={name} className="flex items-center gap-4">
              <code className="w-20 shrink-0 text-label-12-mono text-gray-900">
                {name}
              </code>
              <code className="w-16 shrink-0 text-label-12-mono text-gray-700">
                {px}px
              </code>
              <div className="min-w-0 flex-1">
                <div
                  className="h-8 rounded-[2px] border border-gray-alpha-400 bg-background-200"
                  style={{ width: `${(px / container.wide) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Breakpoints"
        prose={
          <p className="mt-2 text-copy-16 text-gray-900">
            The widths where the layout is allowed to change its mind. They’re
            named after sizes rather than devices on purpose — “tablet” stopped
            meaning a specific width years ago, and a phone in landscape is
            wider than a small window on a laptop. Design for the width, not the
            hardware.
          </p>
        }
      >
        <div className="mt-6 border-gray-alpha-400 border-t">
          {Object.entries(breakpoints).map(([name, px]) => (
            <div
              key={name}
              className="flex items-center gap-4 border-gray-alpha-400 border-b py-3"
            >
              <code className="w-12 shrink-0 text-label-12-mono text-gray-900">
                {name}
              </code>
              <code className="text-label-12-mono text-gray-700">{px}px</code>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Radius"
        prose={
          <p className="mt-2 text-copy-16 text-gray-900">
            Four radii, and the rule matters more than the values: one radius
            family per view. Mixing a 6px button into a 16px card reads as an
            accident, because in the physical world things made by the same
            process share the same corners.
          </p>
        }
      >
        <div className="mt-6 flex flex-wrap gap-6">
          {Object.entries(radius).map(([name, px]) => (
            <div key={name} className="flex w-40 flex-col gap-2">
              <div
                className="size-24 border border-gray-alpha-400 bg-background-200"
                style={{ borderRadius: px }}
              />
              <div className="flex items-baseline gap-2">
                <code className="text-label-12-mono text-gray-1000">
                  {name}
                </code>
                <code className="text-label-12-mono text-gray-700">{px}px</code>
              </div>
              <p className="text-label-13 text-gray-900">{RADIUS_USE[name]}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Elevation"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              A shadow says one thing: this surface is closer to you than that
              one. So the useful name is the role, not the blur radius — three
              shadows, and the system has two jobs for them. Each is a stack of
              layers rather than a single blur, because real light casts a tight
              contact shadow plus a wide soft one.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              Hierarchy comes from surface and border first, so they stay quiet.
              They’re tinted warm to match the neutrals and are stronger in dark
              mode, where a soft shadow on a dark surface is invisible. The
              swatches name{" "}
              <code className="text-label-13-mono text-gray-1000">
                var(--shadow-*)
              </code>
              , so they’re showing your theme;{" "}
              <a href="/design.md" className="text-link hover:text-link-hover">
                design.md
              </a>{" "}
              has the raw values.
            </p>
          </>
        }
      >
        <div className="mt-6 flex flex-wrap gap-6">
          {ELEVATION.map(({ shadow, role, what, where }) => (
            <div key={shadow} className="flex w-56 flex-col gap-3">
              <div
                className="flex size-32 items-center justify-center rounded-md bg-background-100"
                style={{ boxShadow: `var(--shadow-${shadow})` }}
              >
                <code className="text-label-12-mono text-gray-900">
                  {shadow}
                </code>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-heading-16 text-gray-1000">
                    {role ?? <span className="text-gray-700">unused</span>}
                  </span>
                  <code className="text-label-12-mono text-gray-700">
                    shadow-{shadow}
                  </code>
                </div>
                <p className="mt-1 text-label-13 text-gray-900">{what}</p>
                <p className="mt-1 text-label-13 text-gray-700">{where}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Motion"
        prose={
          <>
            <p className="mt-2 text-copy-16 text-gray-900">
              Motion clarifies a change or it does not happen. If you can’t say
              what an animation is explaining — where a thing came from, what
              caused it, where it went — then{" "}
              <code className="text-label-13-mono text-gray-1000">instant</code>{" "}
              is the honest answer, and it’s in the scale for exactly that
              reason.
            </p>
            <p className="mt-4 text-copy-16 text-gray-900">
              Duration tracks distance: a colour changing under your cursor is
              150ms, a full-screen overlay is 300ms, because the bigger the
              movement the longer it takes to be believable. Everything
              non-essential is dropped under{" "}
              <code className="text-label-13-mono text-gray-1000">
                prefers-reduced-motion
              </code>
              , which is a setting real people turn on to stop feeling sick.
            </p>
          </>
        }
      >
        <div className="mt-6 border-gray-alpha-400 border-t">
          {Object.entries(motion.duration).map(([name, ms]) => (
            <div
              key={name}
              className="flex items-center gap-4 border-gray-alpha-400 border-b py-3"
            >
              <code className="w-20 shrink-0 text-label-12-mono text-gray-900">
                {name}
              </code>
              <code className="w-14 shrink-0 text-label-12-mono text-gray-700">
                {ms}ms
              </code>
            </div>
          ))}
        </div>
        <div className="mt-6 max-w-measure">
          <p className="text-copy-16 text-gray-900">
            The easing curve overshoots slightly and settles back, which is what
            makes a movement read as a physical thing arriving rather than a
            value being assigned.
          </p>
          <code className="mt-2 block break-all text-label-12-mono text-gray-1000">
            {motion.easing}
          </code>
        </div>
      </Section>
    </div>
  );
}
