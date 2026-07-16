import { colors, radius, STEPS, spacing, typography } from "@nishilfaldu/sunny";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Mark } from "@/components/mark";
import { brands, type Entry, foundations } from "@/lib/design-index";

export const metadata: Metadata = {
  title: "Sunny — Design System",
  description:
    "Sunny is the design system behind nishilfaldu.com: warm neutrals, one accent, and tokens verified against WCAG AA.",
};

const RAMPS = ["gray", "amber", "blue", "green", "red"] as const;

/**
 * Each specimen renders from the same tokens its page documents, so the index
 * shows the system rather than describing it — and can't go stale.
 */
function ColorsSpecimen() {
  return (
    <div className="flex flex-col gap-1">
      {RAMPS.map((name) => (
        <div key={name} className="flex gap-1">
          {STEPS.map((step) => (
            <div
              key={step}
              className="h-3 flex-1 rounded-[2px]"
              style={{ backgroundColor: colors.light[name][step] }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function TypographySpecimen() {
  return (
    <div className="flex items-baseline gap-4 overflow-hidden">
      <span
        className="text-gray-1000"
        style={{
          fontSize: typography["heading-64"].fontSize,
          lineHeight: `${typography["heading-64"].lineHeight}px`,
          fontWeight: typography["heading-64"].fontWeight,
          letterSpacing: `${typography["heading-64"].letterSpacing}px`,
        }}
      >
        Ag
      </span>
      <div className="flex flex-col gap-1">
        {(["heading-20", "copy-16", "label-13"] as const).map((name) => (
          <span
            key={name}
            className="whitespace-nowrap text-gray-900"
            style={{
              fontSize: typography[name].fontSize,
              lineHeight: `${typography[name].lineHeight}px`,
              fontWeight: typography[name].fontWeight,
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function LayoutSpecimen() {
  return (
    <div className="flex flex-col gap-2">
      {([2, 4, 6, 10, 16] as const).map((step) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className="h-2 rounded-[2px] bg-amber-700"
            style={{ width: spacing[step] * 2 }}
          />
          <span className="text-label-12-mono text-gray-900">
            {step} · {spacing[step]}px
          </span>
        </div>
      ))}
    </div>
  );
}

function ComponentsSpecimen() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <span
          className="inline-flex h-9 items-center bg-gray-1000 px-3 text-button-14 text-background-100"
          style={{ borderRadius: radius.sm }}
        >
          Primary
        </span>
        <span
          className="inline-flex h-9 items-center border border-gray-alpha-400 px-3 text-button-14 text-gray-1000"
          style={{ borderRadius: radius.sm }}
        >
          Secondary
        </span>
      </div>
      <div
        className="flex h-9 items-center border border-gray-alpha-400 px-3 text-label-14 text-gray-700"
        style={{ borderRadius: radius.sm }}
      >
        Input
      </div>
    </div>
  );
}

function BrandSpecimen() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Mark size={56} />
    </div>
  );
}

const SPECIMENS: Record<string, ReactNode> = {
  colors: <ColorsSpecimen />,
  typography: <TypographySpecimen />,
  layout: <LayoutSpecimen />,
  components: <ComponentsSpecimen />,
  nishilfaldu: <BrandSpecimen />,
};

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-40 items-center overflow-hidden rounded-md border border-gray-alpha-400 bg-background-200 px-5">
      <div className="w-full">{children}</div>
    </div>
  );
}

/**
 * A card without an href renders as a non-link. A card that looks clickable and
 * 404s is worse than one that's honest about not existing yet.
 */
function Sheet({ entry }: { entry: Entry }) {
  const specimen = SPECIMENS[entry.id];

  const body = (
    <>
      {specimen ? (
        <Frame>{specimen}</Frame>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-md border border-gray-alpha-400 border-dashed">
          <span className="text-label-13 text-gray-700">
            Nothing to show yet
          </span>
        </div>
      )}
      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-heading-16 text-gray-1000">{entry.title}</h3>
        {!entry.href && (
          <span className="rounded-full border border-gray-alpha-400 px-2 py-0.5 text-label-12 text-gray-700">
            Soon
          </span>
        )}
      </div>
      <p className="mt-1 text-copy-14 text-gray-900">{entry.blurb}</p>
    </>
  );

  if (!entry.href) {
    return <div className="opacity-55">{body}</div>;
  }

  return (
    <Link
      href={entry.href}
      className="group rounded-sm transition-opacity hover:opacity-90"
    >
      {body}
    </Link>
  );
}

export default function DesignSystemPage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="max-w-measure">
        <Link
          href="/design"
          className="text-label-13 text-gray-900 hover:text-gray-1000"
        >
          ← Design
        </Link>
        <h1 className="mt-4 text-heading-48 text-gray-1000">Sunny</h1>
        <p className="mt-4 text-copy-20 text-gray-900">
          The design system behind nishilfaldu.com, and everything built after
          it. One accent, one neutral, four scales, and a bias toward getting
          out of the way of the content.
        </p>
        <p className="mt-6 text-copy-16 text-gray-900">
          The name sets the temperature. Sunny’s neutrals aren’t pure gray —
          they carry a trace of warmth, so surfaces read like paper in daylight
          rather than like a screen.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/design.md"
            className="inline-flex h-10 items-center rounded-sm bg-gray-1000 px-3 text-button-14 text-background-100 hover:bg-gray-900"
          >
            Read design.md
          </a>
          <a
            href="/design.dark.md"
            className="inline-flex h-10 items-center rounded-sm border border-gray-alpha-400 bg-background-100 px-3 text-button-14 text-gray-1000 hover:bg-gray-100"
          >
            Dark theme
          </a>
          <p className="text-label-13 text-gray-900">
            or press{" "}
            <kbd className="rounded-[4px] border border-gray-alpha-400 bg-background-200 px-1.5 py-0.5 text-label-12-mono text-gray-1000">
              ⌘K
            </kbd>{" "}
            to jump anywhere
          </p>
        </div>
      </section>

      <section>
        <div className="max-w-measure">
          <h2 className="text-heading-24 text-gray-1000">Foundations</h2>
          <p className="mt-2 text-copy-16 text-gray-900">
            Every specimen below is rendered live from the tokens its page
            documents — not a screenshot, not a description. Change a token and
            this index changes with it, which is the whole reason the system is
            built this way.
          </p>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
          {foundations.map((entry) => (
            <Sheet key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      <section>
        <div className="max-w-measure">
          <h2 className="text-heading-24 text-gray-1000">Brands</h2>
          <p className="mt-2 text-copy-16 text-gray-900">
            The brand sits inside the system rather than beside it, because a
            mark is made of the same colours and type as everything else. Sunny
            is meant to be worn by more than one thing, so there’s one entry per
            app: its mark, and how it wears the system — including where it had
            to bend it, which is usually the more useful half.
          </p>
          <p className="mt-4 text-copy-16 text-gray-900">
            The mark is the monogram and one amber dot. The dot is the only
            amber on it, which is the point — Sunny’s warmth arrives as a single
            deliberate spot of colour against a neutral, not as a yellow
            interface. It sits on the baseline, tight to the{" "}
            <span className="text-gray-1000">f</span>, close enough to read as
            part of the word rather than as something parked beside it.
          </p>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2">
          {brands.map((entry) => (
            <Sheet key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}
