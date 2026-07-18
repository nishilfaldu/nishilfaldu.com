import type { Metadata } from "next";
import { Mark } from "@/components/mark";
import { pageMetadata } from "@/components/page-metadata";
import { ProseLink } from "@/components/prose-link";

/**
 * Cedar's story — favorite from-scratch compiler, before AI coding tools.
 */

export const metadata: Metadata = pageMetadata({
  title: "Cedar",
  description:
    "A statically-typed language with a compiler written from scratch in Go, lowering to LLVM IR and native executables.",
  path: "/projects/cedar",
  ogType: "article",
});

export default function CedarPage() {
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
        Cedar
      </p>

      <h1 className="mb-[1.6rem] font-medium tracking-[0.01em]">Cedar</h1>

      <p>Hey — Nishil here.</p>

      <p>
        Cedar is still one of my favorite things I’ve built. A small
        statically-typed language, and a compiler for it in Go — lexing,
        parsing, types, all the way down to LLVM IR and a real native
        executable.
      </p>

      <p>
        I built it before the AI-assisted era. No Cursor, no Copilot, and
        ChatGPT wasn’t yet something you could lean on for working compiler
        code. I had never written Go. I had never built a compiler. I didn’t
        really know what an AST was when I started. I learned all of it on the
        way.
      </p>

      <p>
        That’s why it stuck. Not because Cedar is a language anyone should
        adopt, but because I didn’t know if I could do it, and then I did —
        from source text to a binary I could run.
      </p>

      <p>
        The code and a longer walkthrough live on{" "}
        <ProseLink href="https://github.com/nishilfaldu/cedar-lang">
          GitHub
        </ProseLink>
        . If you like compilers, or you’re about to write your first one,
        starring the repo means a lot.
      </p>
    </main>
  );
}
