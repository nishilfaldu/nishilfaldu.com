"use client";

import { useEffect, useRef, useState } from "react";
import { ProseLink } from "@/components/prose-link";
import { LabModal } from "@/components/tinkerletter/lab-modal";
import { initShoeGuide } from "@/components/tinkerletter/shoe-guide/init-shoe-guide";
import { labArchHtml } from "@/components/tinkerletter/shoe-guide/labs/labArch";
import { labCaseHtml } from "@/components/tinkerletter/shoe-guide/labs/labCase";
import { labDefsHtml } from "@/components/tinkerletter/shoe-guide/labs/labDefs";
import { labFasciaHtml } from "@/components/tinkerletter/shoe-guide/labs/labFascia";
import { labPronHtml } from "@/components/tinkerletter/shoe-guide/labs/labPron";
import { labStepHtml } from "@/components/tinkerletter/shoe-guide/labs/labStep";
import { labWearHtml } from "@/components/tinkerletter/shoe-guide/labs/labWear";
import "@/components/tinkerletter/shoe-guide/shoe-guide.css";
import "@/components/tinkerletter/tinker-article.css";

type LabId = "step" | "arch" | "wear" | "pron" | null;

/** Pieces I read before writing this — not exhaustive, just the trail. */
const REFERENCES: { href: string; title: string; source: string }[] = [
  {
    href: "https://marathonhandbook.com/tennis-shoes-vs-running-shoes/",
    title: "Tennis shoes vs running shoes",
    source: "Marathon Handbook",
  },
  {
    href: "https://treadlabs.com/blogs/insoles-reach-your-stride/arch-height-101-how-to-tell-if-you-have-high-arches",
    title: "Arch height 101",
    source: "Tread Labs",
  },
  {
    href: "https://heelthatpain.com/foot-arch-type-test/",
    title: "Foot arch type test",
    source: "Heel That Pain",
  },
  {
    href: "https://heelthatpain.com/pronation/over-pronation/",
    title: "Overpronation",
    source: "Heel That Pain",
  },
  {
    href: "https://www.mayoclinic.org/diseases-conditions/plantar-fasciitis/symptoms-causes/syc-20354846",
    title: "Plantar fasciitis",
    source: "Mayo Clinic",
  },
  {
    href: "https://www.henryford.com/blog/2024/12/high-arches-or-flat-feet",
    title: "High arches or flat feet",
    source: "Henry Ford Health",
  },
  {
    href: "https://www.henryford.com/blog/2023/08/stretching-done-right-easy-tips-to-stay-limber",
    title: "Stretching done right",
    source: "Henry Ford Health",
  },
];

function LabMount({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    delete root.dataset.shoeGuideReady;
    initShoeGuide(root);
  }, []);

  return (
    <div
      ref={ref}
      className="shoe-guide lab-mount"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static lab markup we authored
      dangerouslySetInnerHTML={{ __html: labDefsHtml + html }}
    />
  );
}

/**
 * Vercel-shaped Tinkerletter issue: Geist prose in one column; toys open in modals.
 */
export function ShoeBuyersFieldGuide() {
  const [lab, setLab] = useState<LabId>(null);

  return (
    <article className="tinker-article">
      <header className="tinker-article-header">
        <p className="tinker-meta">Tinkerletter · July 2026</p>
        <h1>The Shoe Buyer’s Field Guide</h1>
        <p className="tinker-lead">
          Your shoes already know something about your body that you probably
          don’t. Let’s see if you can read it.
        </p>
      </header>

      <section>
        <h2>A step, slowed down</h2>
        <p>
          I went down this rabbit hole because I wanted to make a better buying
          decision. It starts with the most ordinary thing you do all day: the
          heel lands slightly on its outer side, the arch squashes and the foot
          rolls inward a little, then you push off from the big-toe side.
        </p>
        <p>
          <button
            type="button"
            className="tinker-lab-link"
            onClick={() => setLab("step")}
          >
            See a step slowed down →
          </button>
        </p>
      </section>

      <section>
        <h2>Your arch</h2>
        <p>
          Wet your foot, step on a paper bag with your full weight. Where the
          foot pressed down, the paper is wet. The dry patch on the inside is
          your arch — the part that stayed lifted.
        </p>
        <p>
          Arch height changes how much cushioning versus structure you need.
          Flat presses edge to edge. High barely connects heel to ball. Most
          people land somewhere in the middle.
        </p>
        <p>
          <button
            type="button"
            className="tinker-lab-link"
            onClick={() => setLab("arch")}
          >
            Try the wet-print slider →
          </button>
        </p>
      </section>

      <section>
        <h2>Your old soles</h2>
        <p>
          Rubber only disappears where your foot pressed. A common pattern: a
          lightweight running shoe worn for court sports — heavy damage up front
          from lunges and stops, clean edges and heel. Neutral stride, wrong
          shoe for the sport.
        </p>
        <p>
          Inner edge worn at toe and heel → inward roll. Outer edge, front to
          back → outer-edge loading. Even forefoot, balanced heel → neutral.
          Front wrecked but edges clean → your gait is probably fine; the sport
          ate the shoe.
        </p>
        <p>
          <button
            type="button"
            className="tinker-lab-link"
            onClick={() => setLab("wear")}
          >
            Inspect the wear map →
          </button>
        </p>
      </section>

      <section>
        <h2>The inward roll</h2>
        <p>
          That little inward roll after landing has a name:{" "}
          <strong>pronation</strong>. It’s supposed to happen — it’s your arch
          absorbing the landing. Rolls too far → <strong>overpronation</strong>.
          Barely rolls → <strong>supination</strong>. The corrective-shoe aisle
          is built around those two words — and your soles already hint which,
          if either, applies to you.
        </p>
        <p>
          <button
            type="button"
            className="tinker-lab-link"
            onClick={() => setLab("pron")}
          >
            Compare ankle tilts →
          </button>
        </p>
      </section>

      <section>
        <h2>There’s a cable under your foot</h2>
        <p>
          Cross one ankle over the other knee, pull your toes back toward your
          shin, and press the sole just in front of the heel — that tight band
          is the plantar fascia, holding the arch up like a bowstring holds a
          bow. Every step stretches it.
        </p>
        <div
          className="tinker-figure shoe-guide"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static fascia figure
          dangerouslySetInnerHTML={{ __html: labFasciaHtml }}
        />
        <p>
          When that bowstring gets overworked — arch extremes, dead foam, the
          wrong shoe for the job — it complains loudest on your first steps out
          of bed. That injury has a name you’ve probably heard:{" "}
          <strong>plantar fasciitis</strong>. Fresh, well-matched shoes and a
          break from impact are the first-line fix; if sharp morning heel pain
          persists for weeks, that’s a podiatrist visit, not a shoe purchase.
        </p>
      </section>

      <section>
        <h2>One shoe, two jobs</h2>
        <p>
          Here’s the part that actually decided my buy. Court sports ask a shoe
          to survive sideways force — cuts, stops, lunges. Running asks it to
          survive straight-down force, thousands of times in a row. Those briefs
          fight each other. Soft and tall for miles tips over on a hard cut. Low
          and braced for the court is stiff and heavy on a run.
        </p>
        <p>
          So everyday sneakers aren’t court shoes. A running shoe isn’t a squash
          or tennis shoe. Standing all day is closer to the running problem than
          the court problem. And a “do-everything” pair usually isn’t a
          compromise — it’s mediocre at both.
        </p>
        <p>
          That was the whole rabbit hole: match the shoe to your foot{" "}
          <em>and</em> to your week. Not the wall of boxes.
        </p>
      </section>

      <section className="tinker-refs">
        <h2>References</h2>
        <p>
          A few of the pieces I read while going down this rabbit hole — not
          exhaustive, just the trail.
        </p>
        <ol>
          {REFERENCES.map((ref) => (
            <li key={ref.href}>
              <ProseLink href={ref.href}>{ref.title}</ProseLink>
              <span className="tinker-ref-source"> — {ref.source}</span>
            </li>
          ))}
        </ol>
      </section>

      <footer className="tinker-footer">
        Tinkerletter · The Shoe Buyer’s Field Guide
      </footer>

      <LabModal
        open={lab === "step"}
        title="A step, slowed down"
        onClose={() => setLab(null)}
      >
        {lab === "step" ? <LabMount key="step" html={labStepHtml} /> : null}
      </LabModal>
      <LabModal
        open={lab === "arch"}
        title="Wet-print slider"
        onClose={() => setLab(null)}
      >
        {lab === "arch" ? <LabMount key="arch" html={labArchHtml} /> : null}
      </LabModal>
      <LabModal
        open={lab === "wear"}
        title="Wear map"
        onClose={() => setLab(null)}
      >
        {lab === "wear" ? (
          <LabMount key="wear" html={labWearHtml + labCaseHtml} />
        ) : null}
      </LabModal>
      <LabModal
        open={lab === "pron"}
        title="Ankle tilts"
        onClose={() => setLab(null)}
      >
        {lab === "pron" ? <LabMount key="pron" html={labPronHtml} /> : null}
      </LabModal>
    </article>
  );
}
