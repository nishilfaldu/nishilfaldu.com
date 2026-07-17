import { Mark } from "@/components/mark";
import { ProseLink } from "@/components/prose-link";
import { SCAFFOLDS } from "@/components/scaffolds/recipes";
import { ScaffoldActions } from "@/components/scaffolds/scaffold-actions";
import { TanstackBuilder } from "@/components/scaffolds/tanstack-builder";

/**
 * /scaffolds — recipes that open in Cursor with the prompt prefilled.
 */
export function ScaffoldList() {
  return (
    <main className="mx-auto max-w-measure px-6 pt-22 pb-28 sm:px-8 sm:pt-32 sm:pb-36">
      <a href="/" aria-label="Home" className="inline-block no-underline">
        <Mark className="mb-10" />
      </a>

      <h1 className="mb-[1.2rem] font-medium tracking-[0.01em]">Scaffolds</h1>
      <p className="mb-12 text-ink-muted">
        Prompts that run the current official CLIs the way I always want them —
        not a template repo to go stale. Open one in Cursor, press enter, get a
        project. <ProseLink href="/">Back to the story</ProseLink>.
      </p>

      <ul className="list-none p-0">
        {SCAFFOLDS.map((s) => (
          <li
            key={s.slug}
            className="border-t border-rule py-6 first:border-t-0 first:pt-0"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="m-0 text-[1.05rem] font-medium tracking-[0.01em]">
                {s.name}
              </h2>
              {s.status === "soon" ? (
                <span className="shrink-0 text-[0.92rem] text-ink-muted">
                  soon
                </span>
              ) : null}
            </div>
            <p className="mt-2 mb-0 text-ink-muted">{s.tagline}</p>
            {s.status === "builder" ? <TanstackBuilder /> : null}
            {s.status === "ready" && s.prompt ? (
              <>
                <ScaffoldActions prompt={s.prompt} />
                <details className="mt-4">
                  <summary className="cursor-pointer text-[0.92rem] text-ink-muted hover:text-accent">
                    Read the prompt
                  </summary>
                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[10px] border border-rule bg-paper-raised p-4 font-mono text-[0.78rem] leading-relaxed text-ink">
                    {s.prompt}
                  </pre>
                </details>
              </>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-14 text-ink-muted">
        The Next.js recipes intentionally leave out Next.js, React, and Vercel
        agent skills. I don’t usually start from optimization playbooks. If you
        want those, start at{" "}
        <ProseLink href="https://vercel.com/docs/agent-resources/skills">
          Vercel’s agent skills
        </ProseLink>
        . TanStack Start is different: pick add-ons in the builder, and Intent
        loads library skills from the packages you install.
      </p>
    </main>
  );
}
