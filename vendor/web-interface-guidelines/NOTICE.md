# Notice

This directory contains a third-party work, vendored verbatim.

- **Source:** https://github.com/vercel-labs/web-interface-guidelines
- **Upstream site:** https://vercel.com/design/guidelines
- **License:** MIT — see `LICENSE` (Copyright (c) 2025 Vercel Labs)
- **Retrieved:** 2026-07-15

## Files

| File            | Upstream        | Purpose                                          |
| --------------- | --------------- | ------------------------------------------------ |
| `guidelines.md` | `README.md`     | Prose version, rendered at `/design/guidelines`   |
| `AGENTS.md`     | `AGENTS.md`     | Terse MUST/SHOULD/NEVER version, served at `/design/guidelines.md` |
| `LICENSE`       | `LICENSE`       | MIT license text, required to travel with the copy |

**The files here are unmodified.** Keep them that way — it makes the diff against
upstream meaningful, so this can be re-pulled without losing local edits.

## Modifications at render time

`lib/guidelines.ts` omits three upstream sections when rendering `/design/guidelines`.
MIT permits modification; these are recorded here for honesty, not obligation.

- **`# Vercel-specific`** — Vercel's own brand and copywriting preferences. Upstream
  labels these as not universal. Sunny's Voice & Content section in `/design.md`
  covers the same ground with different opinions, and shipping both would contradict.
- **`# Integrate with Agents`** — instructions for installing Vercel's
  `/web-interface-guidelines` command. Our equivalent is `/design/guidelines.md`.
- **`# Join Vercel`** — a hiring ad for another company.

Everything else, including the contributor credits, renders verbatim.
