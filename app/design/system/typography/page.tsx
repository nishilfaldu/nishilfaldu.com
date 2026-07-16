import {
  fontStacks,
  type TypeName,
  type TypeToken,
  typography,
} from "@nishilfaldu/sunny";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Typography — Sunny",
  description:
    "Four roles — heading, copy, label, button. Each token bundles size, weight, line height and tracking, so you pick a job rather than four numbers.",
};

/** Turns a token into the style it describes. The page can't drift from the CSS. */
function styleOf(t: TypeToken): React.CSSProperties {
  return {
    fontFamily: fontStacks[t.fontFamily],
    fontSize: t.fontSize,
    lineHeight: `${t.lineHeight}px`,
    fontWeight: t.fontWeight,
    letterSpacing:
      "letterSpacing" in t && t.letterSpacing !== undefined
        ? `${t.letterSpacing}px`
        : undefined,
  };
}

/**
 * What each token is actually for. An em dash means there's nothing useful to
 * say — which, read honestly, is the page admitting the token has no job yet.
 * Don't invent a use to fill a cell; the blank is the information.
 *
 * These are grounded in how the site really uses them, not in what the scale
 * implies. Eight of the twenty-two are unused today and say so.
 */
const USAGE: Partial<Record<TypeName, string>> = {
  "heading-48": "Page titles. Every h1 under /design.",
  "heading-32": "The h1 of a rendered markdown page — the guidelines.",
  "heading-24": "Section headings. The most-used heading in the system.",
  "heading-20": "Card and specimen titles.",
  "heading-16": "Small section heads inside a page.",
  "copy-20": "The intro line under an h1.",
  "copy-16": "Body text. The default, and by far the most-used token.",
  "copy-14": "Secondary body, inside cards and specimens.",
  "label-14": "Form labels and controls.",
  "label-13": "The workhorse: nav, metadata, captions.",
  "label-12": "Tertiary text — tags, swatch captions, step numbers.",
  "button-14": "The default button.",
  "label-13-mono": "Tokens and hex values inline.",
  "label-12-mono": "Swatch captions and metrics.",
};

const ROLES = [
  {
    name: "heading",
    what: "Section and page titles. Semibold, tight line height, and tracking that gets tighter as the size grows — big text needs less air between letters than small text does.",
    names: [
      "heading-64",
      "heading-48",
      "heading-40",
      "heading-32",
      "heading-24",
      "heading-20",
      "heading-16",
    ],
    // Short on purpose: at 64px anything longer truncates in the Example
    // column, and a clipped specimen reads as a bug rather than as a size.
    sample: "How it works",
  },
  {
    name: "copy",
    what: "Body text — anything that runs to more than one line. Regular weight and a taller line height, because the eye needs a clear path back to the start of the next line.",
    names: ["copy-20", "copy-18", "copy-16", "copy-14"],
    sample:
      "Good typography is invisible. You notice it only when it fights you.",
  },
  {
    name: "label",
    what: "Single-line text you scan rather than read: nav, form labels, metadata. Line height is nearly the size itself — a label never wraps, so the extra space would just push things apart.",
    names: ["label-16", "label-14", "label-13", "label-12"],
    sample: "Last deployed 4 minutes ago",
  },
  {
    name: "button",
    what: "Labels on controls. Medium weight — heavier than copy so it reads as something you press, lighter than a heading so it doesn’t shout.",
    names: ["button-16", "button-14", "button-12"],
    sample: "Deploy",
  },
] as const;

const MONO: TypeName[] = [
  "copy-16-mono",
  "copy-14-mono",
  "label-13-mono",
  "label-12-mono",
];

/**
 * Which tokens the page shows, and which of them have no stated job — both
 * derived from the tables above rather than counted by hand. "The empty cells"
 * makes a claim about the Usage column, so it has to read the same map the
 * column does; a hand-typed list would contradict the table the moment a token
 * earns a note.
 */
const ALL_TOKENS: TypeName[] = [...ROLES.flatMap((r) => [...r.names]), ...MONO];
const UNUSED = ALL_TOKENS.filter((name) => !USAGE[name]);

function Metrics({ t }: { t: TypeToken }) {
  const parts = [
    `${t.fontSize}/${t.lineHeight}`,
    `w${t.fontWeight}`,
    "letterSpacing" in t && t.letterSpacing !== undefined
      ? `${t.letterSpacing}`
      : null,
  ].filter(Boolean);
  return (
    <span className="shrink-0 text-label-12-mono text-gray-700">
      {parts.join("  ")}
    </span>
  );
}

/**
 * Example, class name, usage — the three things a reader needs, named. The
 * columns used to be unlabelled, so `label-14 | sample | 14/20 w500` left you
 * to work out what you were looking at.
 */
function Head() {
  return (
    <div className="hidden border-gray-alpha-400 border-b pb-2 sm:flex sm:gap-6">
      <span className="min-w-0 flex-1 text-label-12 text-gray-900">
        Example
      </span>
      <span className="w-40 shrink-0 text-label-12 text-gray-900">
        Class name
      </span>
      <span className="w-56 shrink-0 text-label-12 text-gray-900">Usage</span>
    </div>
  );
}

function Row({ name, sample }: { name: TypeName; sample: string }) {
  const t = typography[name];
  const usage = USAGE[name];
  return (
    <div className="flex flex-col gap-2 border-gray-alpha-400 border-b py-5 sm:flex-row sm:items-baseline sm:gap-6">
      <span
        className="min-w-0 flex-1 truncate text-gray-1000"
        style={styleOf(t)}
      >
        {sample}
      </span>
      <span className="flex w-40 shrink-0 flex-col gap-1">
        <code className="text-label-12-mono text-gray-1000">text-{name}</code>
        <Metrics t={t} />
      </span>
      <span className="w-56 shrink-0 text-label-13 text-gray-900">
        {usage ?? <span className="text-gray-700">—</span>}
      </span>
    </div>
  );
}

export default function TypographyPage() {
  return (
    <div className="flex flex-col gap-16">
      <section className="max-w-measure">
        <Link
          href="/design/system"
          className="text-label-13 text-gray-900 hover:text-gray-1000"
        >
          ← Sunny
        </Link>
        <h1 className="mt-4 text-heading-48 text-gray-1000">Typography</h1>
        <p className="mt-4 text-copy-20 text-gray-900">
          Four roles. Each token bundles size, weight, line height and tracking
          together, so you pick the job the text is doing and the metrics come
          with it.
        </p>
        <p className="mt-6 text-copy-16 text-gray-900">
          Every token is a Tailwind class — the token name with{" "}
          <code className="text-label-13-mono text-gray-1000">text-</code> in
          front. Nothing else needs setting:
        </p>
        <pre className="mt-3 overflow-x-auto rounded-sm border border-gray-alpha-400 bg-background-200 p-4">
          <code className="text-label-13-mono text-gray-1000">
            {'<p className="text-copy-16">Body text</p>'}
          </code>
        </pre>
      </section>

      <section className="max-w-measure">
        <h2 className="text-heading-24 text-gray-1000">The words, first</h2>
        <p className="mt-2 text-copy-16 text-gray-900">
          A <span className="text-gray-1000">typeface</span> is the design of
          the letters — the shapes themselves. A{" "}
          <span className="text-gray-1000">font</span> is one specific instance
          of it at a given weight and size. Geist is the typeface; “Geist
          Semibold at 48px” is a font. In practice everyone says “font” for both
          and nothing bad happens.
        </p>
        <p className="mt-4 text-copy-16 text-gray-900">
          Three numbers do most of the work, and they’re worth knowing by name:
        </p>
        <dl className="mt-4 flex flex-col gap-3">
          {[
            [
              "Size",
              "How tall the letters are. The obvious one, and the least interesting.",
            ],
            [
              "Line height",
              "The vertical distance from one line of text to the next. Too tight and lines blur together; too loose and they stop feeling like a paragraph.",
            ],
            [
              "Tracking",
              "The space between letters, also called letter-spacing. Large text looks gappy at its default spacing, so headings pull it tighter — that's why heading-64 uses a negative value and copy-16 uses none.",
            ],
            [
              "Weight",
              "How thick the strokes are. 400 is regular, 500 medium, 600 semibold.",
            ],
          ].map(([term, def]) => (
            <div key={term}>
              <dt className="text-heading-16 text-gray-1000">{term}</dt>
              <dd className="text-copy-16 text-gray-900">{def}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-copy-16 text-gray-900">
          The reason they live together in one token is that they’re not
          independent choices. A 48px heading with copy’s line height and no
          tracking looks wrong, and it looks wrong in a way that’s hard to name
          if you haven’t seen the two side by side. Bundling them means the
          wrong combination isn’t reachable by accident.
        </p>
      </section>

      {ROLES.map((role) => (
        <section key={role.name}>
          <div className="max-w-measure">
            <h2 className="text-heading-24 text-gray-1000">{role.name}</h2>
            <p className="mt-2 text-copy-16 text-gray-900">{role.what}</p>
          </div>
          <div className="mt-6">
            <Head />
            {role.names.map((name) => (
              <Row key={name} name={name} sample={role.sample} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <div className="max-w-measure">
          <h2 className="text-heading-24 text-gray-1000">Mono</h2>
          <p className="mt-2 text-copy-16 text-gray-900">
            In a <span className="text-gray-1000">monospace</span> typeface
            every character occupies the same width, so columns line up and{" "}
            <code className="text-label-13-mono text-gray-1000">1</code>,{" "}
            <code className="text-label-13-mono text-gray-1000">l</code> and{" "}
            <code className="text-label-13-mono text-gray-1000">I</code> stay
            told apart. Use it for anything you might copy and paste — hex
            values, tokens, code, IDs — and nothing else.
          </p>
        </div>
        <div className="mt-6">
          <Head />
          {MONO.map((name) => (
            <Row key={name} name={name} sample="#f6f4f1 · gray-100" />
          ))}
        </div>
      </section>

      <section className="max-w-measure">
        <h2 className="text-heading-24 text-gray-1000">The empty cells</h2>
        <p className="mt-2 text-copy-16 text-gray-900">
          {UNUSED.length} of the {ALL_TOKENS.length} tokens have nothing in the
          Usage column, because nothing on the site uses them:{" "}
          {UNUSED.map((name, i) => (
            <span key={name}>
              {i > 0 && ", "}
              <code className="text-label-13-mono text-gray-1000">{name}</code>
            </span>
          ))}
          . Some are waiting for a page that doesn’t exist yet — a hero wants{" "}
          <code className="text-label-13-mono text-gray-1000">heading-64</code>.
          The rest were drawn because a scale looks incomplete without them,
          which is the same instinct this system rejects one page over: a scale
          whose job you can’t name isn’t needed yet. The blanks stay visible
          until each one earns a sentence or gets deleted.
        </p>
      </section>

      <section className="max-w-measure">
        <h2 className="text-heading-24 text-gray-1000">The typeface</h2>
        <p className="mt-2 text-copy-16 text-gray-900">
          Sunny names two families,{" "}
          <span className="text-gray-1000">Sunny Sans</span> and{" "}
          <span className="text-gray-1000">Sunny Mono</span>. Both currently
          resolve to Geist, which Vercel released under the SIL Open Font
          License — free to use commercially, no attribution required in the
          interface.
        </p>
        <p className="mt-4 text-copy-16 text-gray-900">
          The aliasing is the point. Tokens name the role they need rather than
          the vendor supplying it, so replacing the typeface later edits one
          line in{" "}
          <code className="text-label-13-mono text-gray-1000">
            tokens/typography.ts
          </code>{" "}
          instead of every component. It also keeps the door open: Geist is a
          fine default, but it’s also the strongest visual signal that a site is
          Vercel-adjacent, and that’s worth revisiting once the brand has an
          opinion of its own.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {Object.entries(fontStacks).map(([name, stack]) => (
            <div key={name} className="border-gray-alpha-400 border-b pb-3">
              <div className="text-heading-16 text-gray-1000">{name}</div>
              <code className="text-label-12-mono text-gray-900">{stack}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
