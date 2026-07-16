# nishilfaldu.com

Personal site for Nishil Faldu: projects + background. The design system came
first and the portfolio gets built on top of it.

## Commands

| Command         | What it does                                                     |
| --------------- | ---------------------------------------------------------------- |
| `pnpm dev`      | Dev server. Runs `pnpm theme` first via `predev`.                 |
| `pnpm build`    | Production build. Runs `pnpm theme` first via `prebuild`.         |
| `pnpm theme`    | Regenerates `packages/sunny/src/theme.generated.css` from tokens. |
| `pnpm contrast` | Fails if any colour pairing drops below WCAG AA. **Not** `pnpm audit` — that's pnpm's built-in security audit. |
| `pnpm glue`     | Fails if any JSX uses an HTML entity. Runs in `prebuild`. See Gotchas. |
| `pnpm lint`     | `biome check`. `pnpm exec biome check --write` to fix.           |

Stack: Next 16 (App Router, Turbopack, React Compiler), React 19, Tailwind v4,
Biome, pnpm workspaces, Node 25.

## Sunny (the design system)

Lives in `packages/sunny/`, published as `@nishilfaldu/sunny`, consumed by the
app like any other app would consume it.

**`src/tokens/*.ts` is the only source of truth.** Everything else derives from it:

```
tokens.ts ──┬──> design.md / design.dark.md   (app/design[.dark].md/route.ts)
            ├──> theme.generated.css @theme   (scripts/build-theme.mts)
            ├──> /design/** docs pages        (render live from tokens)
            └──> pnpm contrast                (audits what the tokens claim)
```

`components.ts` states each component as `{group.name}` references, and
`resolve.ts` is the **only** way to read them: `resolve(ref, theme)` gives a
value for one theme (the audit), `cssVar(ref)` gives a CSS variable that flips
with the reader's (the docs page). One contract, two readers, no third copy.

This is the whole point: docs cannot drift from code. If you add a way to
express a token that bypasses `tokens.ts`, you've broken the design.

- Author colours in **OKLCH**, emit sRGB hex + `*-p3` variants. culori handles
  gamut mapping — don't hand-write hex.
- Every scale runs `100`–`1000` and **the step encodes the job, not the shade**:
  100 default bg, 200 hover bg, 300 active bg, 400 default border, 500 hover
  border, 600 active border, 700 solid fill, 800 fill hover, 900 secondary text,
  1000 primary text. Same meaning in every scale, every app.
- Neutrals are **warm** (hue 75, low chroma). `#f6f4f1`, not `#f2f2f2`. This is
  the system's quietest brand signal and the reason it's called Sunny.
- Four accent scales only: `amber` (brand), `blue` (link/focus/info), `green`
  (success), `red` (error). No teal/purple/pink — a scale whose job you can't
  name isn't needed yet.
- **Amber is the brand colour but never the link colour.** Yellow can't be both
  saturated and dark enough for 4.5:1 body text. Amber leads with fills; blue
  does the contrast work. Don't "fix" this by darkening amber into brown.
- **Name the role, not the step, whenever a role exists.** `text-link` /
  `var(--color-link)`, never `text-blue-700` — the link role is blue-700 in
  light but blue-**900** in dark (900 is the text step), so hardcoding a step
  renders the wrong colour in one theme and silently contradicts `design.md`.
  `semantic` is emitted as `--color-<role>` by `build-theme.mts`, so CSS and
  Tailwind utilities can both say the role.
- Run `pnpm contrast` after touching colours. It tests both themes on both
  surfaces. Note it uses theme-independent inks: `gray-1000` flips to near-white
  in dark mode, so a fill's label can't be chosen from it.
- **A label on a fill names an `on-*` role, never a step.** `on-accent`,
  `on-error` and `on-primary` are *derived* via `inkOn(fill)`, which picks
  whichever theme-independent ink the fill can actually carry. `button-accent`
  once hardcoded `{colors.gray-1000}` on amber: 8.70:1 light, **1.72:1 dark**,
  because amber-700 is the same hex in both themes while the ink flipped.
- **The colors page is organised by job, not by scale**, and that ordering is
  the argument. Sorted by scale, a reader gets ten grays then ten ambers and has
  to *infer* that the fourth swatch in each row means the same thing — which
  buries the one idea the system runs on. Sorted by job, the four `400`s sit
  side by side. Each group shows its steps across all five scales, then shows
  them doing the work; the full ramps stay at the bottom as a lookup table.
  Geist does the same and it's the better call. Don't re-sort it by colour.
- **A step label goes outside its swatch, never inside it.** There is no ink
  that works inside: `ramp-1000` vanishes on the 1000 swatch, and `amber-100` on
  `amber-700` is ~1.5:1 — the amber constraint the page itself documents, met
  head-on. `pnpm dev` won't catch it; the browser suite asserts every step label
  clears 4.5:1 against what it actually sits on.
- **Component states are tokens, not prose.** `hoverBackgroundColor` /
  `activeBackgroundColor` / `hoverBorderColor` are declared per variant, and
  `pnpm contrast` holds every one of them to the same 4.5:1 bar as the resting
  state. They used to be a paragraph in a comment that no code read.

**Eight of the 22 type tokens have no job yet**, and the typography page says so
rather than hiding it: `heading-64`, `heading-40`, `copy-18`, `label-16`,
`button-16`, `button-12`, `copy-16-mono`, `copy-14-mono` are used nowhere on the
site. A hero plausibly wants `heading-64`; the rest exist because a scale looks
incomplete without them — the instinct this system rejects for colour ("a scale
whose job you can't name isn't needed yet") and never applied to type. Decide
per token as the portfolio lands: earn a Usage note, or get deleted.

The Usage column is hand-written prose (judgment, not derivable), but **the
"empty cells" count and list are derived from that same map** — a hand-typed
"eight of twenty-two" contradicts the table the moment a token earns a note.
The browser suite asserts the sentence's number equals the rendered blanks.

`SYSTEM` name/version live in `packages/sunny/src/tokens/index.ts`.

## Information architecture

Everything under `/design`. Nishil is one person — no team page, no separately
branded system — so Vercel's `/design` + `/geist` split is collapsed.

```
/design                  hub — two cards: Sunny, Guidelines
/design.md               machine-readable spec (light)
/design.dark.md          machine-readable spec (dark)
/design/system           Sunny: contact sheet index (Foundations + Brands)
/design/system/colors    organised by job (see below), then the ramps, then contrast
/design/system/typography  the four roles, the scale, mono, the typeface, what's unused
/design/system/layout    the 4px base, rhythm, containers, radius, elevation, motion
/design/system/components  buttons + inputs, every state, live from the contract
/design/guidelines       Web Interface Guidelines (vendored, MIT)
/design/guidelines.md    terse agent version of the above
```

**Two cards, not three: brand lives inside Sunny.** Checked against the real
thing — `/geist/brands` is a *section of the Geist sidebar* (Foundations /
Brands / Components), not a separate top-level doc. Vercel's standalone
`/design` is their design *team* page, which doesn't apply to one person. Geist
has one Brands entry per product (Vercel, Next.js, Turbo…); Sunny has one per
app. Don't re-promote Brand to a third card without re-checking upstream.

**Docs pages state; they don't lecture.** One prose block per section, and a
caption under a specimen only where it makes a claim you can't see by looking
(why an ink is derived; what the alpha border is doing). The colors page once
ran ~1,160 words against Geist's ~155 for the same material, because every
section had an intro paragraph *and* a caption explaining the same idea — it
read as an essay and Nishil said so. A docs page is read once as a tutorial and
a hundred times as a lookup. Let the specimen carry it.

Borrowing Geist's *page structure* is fine and deliberate — an organising scheme
is an idea, and it's the same call as borrowing their `design.md` format. Their
sentences and their token values are not ours to take. See Third-party content.

`lib/design-index.ts` is the **one registry** of every destination — the contact
sheet renders from it and the ⌘K menu searches it, so the menu can't offer a
page the sheet doesn't show. `href: null` means unbuilt; nothing renders it as a
link. Add a route there or it exists in neither place.

Cards for unbuilt sections render dimmed with a "Soon" tag and **no link**. A
card that looks clickable and 404s is worse than one that's honest.

**No Materials page, and no Components section — both on purpose.**

Geist's *Materials* bundles radius + fill + stroke + shadow behind one name per
elevation role (`material-modal`, `material-tooltip`…). That's the right idea —
it's the same move as a type token bundling size/weight/leading, or a colour
step encoding a job. We already have the ingredients; they were organised by
property. So `/design/system/layout` names **Elevation** by role instead, and
that section *is* Materials. Don't add a Materials page: Geist has eight
materials because they have eight real elevation roles. This site has two —
`raised` (hub card hover, `shadow-md`) and `overlay` (⌘K, `shadow-lg`) — plus
`shadow-sm`, which nothing uses. Promote to real `elevation` tokens when the
portfolio produces the roles, not to look complete.

Geist's *Components* is a library reference: ~65 pages because there are ~65
importable components. We have none — `components.ts` is a token contract, and
**nothing outside its own docs page consumes it.** Every button on the site is
hand-rolled Tailwind that happens to match the contract (`h-10` next to
`height: 40`), kept in sync by luck. That's the real gap, not the page. Order:
build the portfolio → let it say which components are real → extract those →
*then* the page documents a library and can split per component. Sunny is
tokens; behaviour (focus traps, ARIA, keyboard) is what a headless primitive
library is for — Base UI or Radix, not something to re-derive here.

## Third-party content

**Never republish someone else's design documentation as ours.** `public/design.md`
was once `vercel.com/design.md` copied verbatim, including "Vercel's Geist design
system" — it was deleted. Vercel's *format* (YAML frontmatter for machines, prose
for humans) is fair to borrow; their token values encode their brand, not ours.

`vendor/` holds third-party work that we legitimately reuse. Rules:

- Vendored files stay **unmodified**, so diffing upstream stays meaningful.
- Ship the `LICENSE` alongside — MIT requires the notice travel with the copy.
- Write a `NOTICE.md`: source, retrieval date, licence, and any render-time
  modifications and why.
- Modify at render time (see `lib/guidelines.ts`), never by editing the vendored file.

Currently vendored: `vercel-labs/web-interface-guidelines` (MIT, © 2025 Vercel Labs).
Three sections are dropped when rendering — their brand copywriting rules, their
agent-install instructions, their hiring notice. Everything else is verbatim
because it's already right.

## Gotchas

- **Write `—` `’` `“` `⌘` literally in JSX. Never `&mdash;` `&rsquo;` `&ldquo;`.**
  Next 16's SWC drops the *leading space* of any JSXText node containing an HTML
  entity, so `<span>font</span> is one … &ldquo;Geist&rdquo;` renders as
  `fontis one`. The entity can be anywhere in the node — even lines later — and
  it silently glues the word onto the preceding element. Reproduced and
  bisected; entity-free nodes are fine. `pnpm glue` fails the build on it (wired into `prebuild`).

- **The generated `@theme` is `@theme static`, and must stay that way.** A plain
  `@theme` only emits the variables some utility happens to reference, so
  `--shadow-sm` was dropped from `:root` and `box-shadow: var(--shadow-sm)`
  computed to `none` — but *only in light mode*, because the dark values are
  emitted as ordinary `:root` rules and were never tree-shaken. A design system
  publishes variables for other code to name; it can't know which get used.
- **A token key that collides with a Tailwind built-in utility is a token that
  does nothing.** `--container-prose` lost silently to Tailwind's own
  `.max-w-prose` (65ch): the token read 720px and every page rendered 690. Hence
  `container.measure` — which is also the correct typographic term. `@utility`
  does *not* rescue this; Tailwind merges the two declarations into one rule and
  the built-in still lands last. Rename instead.
- **Base styles live in `@layer base` in `app/globals.css`, and must stay there.**
  Unlayered CSS beats every layered rule regardless of specificity, so an
  unlayered `:focus-visible` can't be overridden by *any* Tailwind utility —
  `focus-visible:shadow-none` silently does nothing. Same trap for any new
  global.
- **A scrim is `semantic.scrim`, never `gray-alpha`.** `gray-alpha` is
  white-based in dark mode, so a `gray-alpha` scrim *lightens* a dark page
  instead of dimming it. `scrim` is deliberately the same value in both themes —
  it always darkens. This is the `gray-1000` flip that bit the contrast audit,
  wearing a different hat.
- The ⌘K overlay is **portaled to `document.body` on purpose**. The `/design`
  header sets `backdrop-blur`, and `backdrop-filter` makes an element a
  containing block for fixed-position descendants — rendered in place, the
  overlay's `fixed inset-0` pins to the 56px header and only the header dims.
  Don't "simplify" the portal away.
- marked v18 emits **no heading ids** (moved to `marked-gfm-heading-id` in v5).
  `lib/guidelines.ts` adds them via a custom renderer. TOC and headings share one
  `slugify` so they can't disagree — keep it that way.
- Imports inside `packages/sunny` use explicit `.ts` extensions
  (`allowImportingTsExtensions` in tsconfig) so scripts run under
  `node --experimental-strip-types` without a build step.
- `theme.generated.css` is generated and excluded from Biome. Don't edit it.
- `!important` in the `prefers-reduced-motion` reset is correct and suppressed
  with a reason. It must outrank component styles.

## Roadmap

Done: the contact sheet index + ⌘K for `/design/system` (chosen over a
Geist-style sidebar: 260px is right for 65 components, silly for 4
foundations), plus `/design/system/colors`, `/design/system/typography` and
`/design/system/layout`, and `/design/system/components` (buttons + inputs, all
states). The index shows **live specimens**, not text links — cheap for us
because everything renders from tokens. All four foundations are built.

**Sunny is done.** What's left is the site it was built for.

1. **The portfolio.** `app/page.tsx` is still the create-next-app template —
   Next.js logo, `bg-zinc-50 dark:bg-black`, not one Sunny token. The homepage
   serves boilerplate while `/design` serves a finished design system. Fixing
   that is also the real test: five docs pages proving the tokens work is not
   the same as one page that has to be good. Content decisions are Nishil's.
2. **The Brands page.** The mark is settled — `nf` + amber dot,
   `components/mark.tsx`, Nishil's call. The card is still `href: null` because
   the *page* doesn't exist, not because the mark is open. It should cover the
   mark and how the site wears Sunny, including where it bends it.
3. **A real component library.** The contract exists and nothing imports it —
   see "No Materials page, and no Components section" above. This is the biggest
   honest gap in the system, and the portfolio is what should drive it: build
   the page, extract the components it actually needs, then let the docs follow.
   `card` is in the contract and undocumented for the same reason.
4. `README.md` is still create-next-app text.

Dead tokens, all found by asking what the site really uses. Decide each as the
portfolio lands — earn a job or get deleted; don't keep them for symmetry:
`heading-64`, `heading-40`, `copy-18`, `label-16`, `button-16`, `button-12`,
`copy-16-mono`, `copy-14-mono`, `shadow-sm`. (`radius.lg` is used exactly once.)

## Open question

The vendored guidelines say "prefer APCA over WCAG 2 for perceptual contrast".
`pnpm contrast` enforces WCAG 2. Real disagreement between our own two documents,
deliberately unresolved — APCA is better but still draft. Revisit when components exist.
