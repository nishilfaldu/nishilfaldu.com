import { colors } from "@nishilfaldu/sunny";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Design",
  description:
    "The design system and the interface guidelines behind everything Nishil Faldu builds.",
};

function PaletteMark() {
  const strip = [
    colors.light.amber[700],
    colors.light.amber[500],
    colors.light.gray[300],
    colors.light.blue[700],
    colors.light.gray[1000],
  ];
  return (
    <div className="flex h-full w-full items-center justify-center gap-2">
      {strip.map((c) => (
        <span
          key={c}
          className="size-8 rounded-full ring-1 ring-gray-alpha-200"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

function GuidelinesMark() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-2 px-12">
      {[100, 78, 92, 64].map((w, i) => (
        <span
          key={w}
          className="h-2 rounded-full"
          style={{
            width: `${w}%`,
            backgroundColor:
              i === 1 ? colors.light.amber[500] : colors.light.gray[300],
          }}
        />
      ))}
    </div>
  );
}

type CardProps = {
  title: string;
  description: string;
  href?: string;
  visual: ReactNode;
};

function Card({ title, description, href, visual }: CardProps) {
  const body = (
    <>
      <div className="h-40 rounded-md bg-background-200 ring-1 ring-gray-alpha-200 ring-inset">
        {visual}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-3">
        <h2 className="text-heading-20 text-gray-1000">{title}</h2>
        {!href && (
          <span className="shrink-0 rounded-full bg-gray-alpha-100 px-2 py-0.5 text-label-12 text-gray-900">
            Soon
          </span>
        )}
      </div>
      <p className="mt-2 text-copy-14 text-gray-900">{description}</p>
    </>
  );

  const shell =
    "rounded-lg border border-gray-alpha-400 bg-background-100 p-5 transition-shadow duration-state";

  if (!href) {
    return <div className={`${shell} opacity-70`}>{body}</div>;
  }

  return (
    <Link href={href} className={`${shell} block hover:shadow-md`}>
      {body}
    </Link>
  );
}

export default function DesignPage() {
  return (
    <div className="flex flex-col gap-12">
      <section className="max-w-measure">
        <h1 className="text-heading-48 text-gray-1000">Design</h1>
        <p className="mt-4 text-copy-20 text-gray-900">
          The design system and the interface guidelines behind everything I
          build. Written down so the decisions only have to be made once.
        </p>
        <p className="mt-6 text-copy-16 text-gray-900">
          Two things, because they answer two different questions. Sunny decides
          what an interface is made of; the guidelines decide how it has to
          behave. The brand lives inside Sunny rather than beside it — a mark is
          made of the same colours and type as everything else.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card
          title="Sunny"
          description="The design system. Warm neutrals, one accent, four scales, and tokens verified against WCAG AA. Includes the brand, and publishes a machine-readable spec at /design.md."
          href="/design/system"
          visual={<PaletteMark />}
        />
        <Card
          title="Web Interface Guidelines"
          description="The rules for building interfaces: focus, keyboard, forms, motion, performance. Vercel's, reproduced under MIT, because they're already right."
          href="/design/guidelines"
          visual={<GuidelinesMark />}
        />
      </section>
    </div>
  );
}
