# nishilfaldu.com

Nishil Faldu's personal site. The front page is an essay about how he got
here, with twenty-one projects linked inside the sentences that explain why
they exist.

On the essay, the work only means anything in the order it happened. So it has
no project grid, no cards, no filters — anything that lifts a project out of
the narrative and into a tile is working against that page. Hovering a project
link previews it; the dash stack on the right indexes it; neither breaks the
prose.

`/projects` is the one deliberate exception: a curated list of work he's proud
of — name, one sentence, a link. No carousel, no dock, no GitHub OG cards.
The list lives in `components/showcase-projects.ts`; editing that file is the
whole workflow. Featured projects can grow a short story page under
`/projects/<slug>` (Sediment is the first: `/projects/sediment`, same voice as
its welcome email, with the Mac download form talking to Convex).

`/tinkerletter` is the interactive-letter section: issues you can touch, not
just read. The index lists issues from `components/tinkerletter/issues.ts`;
each issue lives under `/tinkerletter/<slug>`. First issue is the Shoe Buyer’s
Field Guide. Issues use a blog-style prose column; interactives open in modals
from links in the prose so the scroll stays simple — diagrams you can play with
don’t sit inline like labs.

`/scaffolds` is a catalog of agent prompts that scaffold projects the way he
always wants them — run the current official CLI with fixed flags, don’t clone
a stale template. Recipes live in `components/scaffolds/recipes.ts`. Each ready
recipe can open in Cursor via a prompt deeplink, or be copied. Ready recipes are
Next.js app-only and Next.js + Convex (CLI + remind to install the Convex
Cursor plugin). TanStack Start is an interactive builder: pick add-ons, get a
customized prompt; TanStack Intent is on by default so agents can load
versioned skills from installed packages.

**A page file holds the page component and nothing else.** Everything else goes
in `components/`, however small or single-use.

The whole theme is a few variables at the top of `app/globals.css`. Neutrals
and type are Geist’s (Sans + Mono), borrowed for our own stylesheet — not ours
to republish as a system of our own.

Live at **nishilfaldu.site**, deployed from `main` by Vercel. `www` redirects to
the apex. The repo is named `.com`, but **that domain isn't registered** — the
name is aspirational, and nothing should point at it until someone buys it.
