import type { Metadata } from "next";
import { Mark } from "@/components/mark";
import { ShoeBuyersFieldGuide } from "@/components/tinkerletter/shoe-buyers-field-guide";

export const metadata: Metadata = {
  title: "The Shoe Buyer’s Field Guide — Tinkerletter",
  description:
    "Your shoes already know something about your body that you probably don’t. An interactive field guide to arches, wear, and the right pair.",
  alternates: {
    canonical: "/tinkerletter/shoe-buyers-field-guide",
  },
};

export default function ShoeBuyersFieldGuidePage() {
  return (
    <>
      <div className="mx-auto max-w-[42rem] px-6 pt-22 sm:px-8 sm:pt-32">
        <a
          href="/tinkerletter"
          aria-label="Tinkerletter"
          className="inline-block no-underline"
        >
          <Mark className="mb-8" size={16} />
        </a>
      </div>
      <ShoeBuyersFieldGuide />
    </>
  );
}
