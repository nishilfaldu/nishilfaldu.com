import type { Metadata } from "next";
import { Mark } from "@/components/mark";
import { pageMetadata } from "@/components/page-metadata";
import { ProseLink } from "@/components/prose-link";

/**
 * Atlas's story — built the verification engine, measured it, killed the thesis.
 */

export const metadata: Metadata = pageMetadata({
  title: "Atlas",
  description:
    "A local-first verification layer for AI-assisted development — and an honest write-up of what the benchmark actually taught me.",
  path: "/projects/atlas",
  ogType: "article",
});

export default function AtlasPage() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36 [&_p]:mb-[1.6rem]">
      <a
        href="/projects"
        aria-label="Projects"
        className="inline-block no-underline"
      >
        <Mark className="mb-10" />
      </a>

      <p className="mb-3 text-[0.92rem] text-ink-muted">
        <ProseLink href="/projects">Projects</ProseLink>
        {" · "}
        Atlas
      </p>

      <h1 className="mb-[1.6rem] font-medium tracking-[0.01em]">Atlas</h1>

      <p>Hey — Nishil here.</p>

      <p>
        AI writes more of our code every week, and it makes a particular kind of
        mistake: it edits one spot and quietly breaks something connected that
        it never looked at. Types and tests often miss that, because the broken
        thing wasn’t what you were checking.
      </p>

      <p>
        So I built Atlas — a deterministic verification engine. Change code, and
        it figures out which parts of the running app the change reaches, checks
        those for real (HTTP + a headless browser), and hands back a verdict:
        clean, changed, or broken. No AI opinion in the loop.
      </p>

      <p>
        The engine got finished. Then I did the honest thing and{" "}
        <em>measured</em> it. Same bugs, three setups: no checks, the usual
        checks, and the usual checks plus Atlas. What I cared about was the fake
        fix — everything green while the bug is still there.
      </p>

      <p>
        On the bugs where the AI was “fixing” something in one place and
        silently wrecking a shared feed somewhere else, Atlas actually helped.
        On the ones where normal checks already caught the problem, it added
        nothing. The score that mattered wasn’t the win rate. It was{" "}
        <em>what the score was made of</em>.
      </p>

      <p>
        Catching breaks after the fact was promising as a heads-up and not worth
        it as a product. The part that knew two routes shared a function — the
        dependency graph — was the real asset. Prevention before the edit beats
        grading after.
      </p>

      <p>
        So Atlas, the verification engine, stops here. The repo is the record of
        that journey. What I want to build next is different: an architectural,
        design-principle linter for AI-generated code — hygiene on every change,
        so the codebase stays well-designed by construction, not cleaned up
        later.
      </p>

      <p>
        If that story resonates, the write-up and the engine live on{" "}
        <ProseLink href="https://github.com/nishilfaldu/atlas">
          GitHub
        </ProseLink>
        . Stars help. Issues and PRs do too.
      </p>
    </main>
  );
}
