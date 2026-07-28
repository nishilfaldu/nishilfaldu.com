/**
 * Standing engineering practices, appended to every scaffold prompt after
 * Phase 1 (the scaffold itself). Single source of truth — edit here, not
 * per-scaffold.
 */

/** Written verbatim into AGENTS.md by the agent — not paraphrased. */
export const AGENTS_PRACTICES_SECTION = `## Engineering practices

### Ship cadence
- Slices are vertical, not horizontal: each one cuts end-to-end through
  every layer it touches (e.g. UI → logic → storage) and lands a thin piece
  of real, demonstrable behavior — not "build all the models" then "all the
  services" then "all the UI" as separate slices. A vertical slice is
  independently testable and reviewable on its own; a horizontal one isn't
  until everything else lands too.
- Smallest coherent vertical slice; commit regularly.
- A slice that adds real behavior ships with tests. Exempt only for pure
  docs/config or trivial static markup — say so in the commit message when
  skipped.
- Before each commit: run the tests for what changed. If the change affects
  runtime or UI, run the app and exercise the affected path — don't claim a
  UI change works without having opened it.

### Code review
- Review at checkpoints, not every commit: end of a feature, before
  opening/merging a PR, and immediately for anything touching
  security-sensitive surface (secrets, auth, credential storage,
  process/command spawning, IPC or trust boundaries).
- Small refactors or docs-only slices: a careful self-read of the diff is
  enough, no formal review needed.

### Commits
- A commit that changes behavior states the why in 1-3 sentences in the
  body. Enforced by a commit-msg hook — don't bypass it.

### Structural learnings
- When a structural or architectural mistake surfaces (duplicated source of
  truth, boundary violation, bad seam), ask whether it should become a
  regression test and/or an ADR before writing prose about it elsewhere.
  Only write the ADR if the decision is hard-to-reverse AND surprising AND
  a genuine tradeoff — all three.

### CONTEXT.md
- Glossary only — term names and meanings, never decisions or
  implementation detail. Scaffolded empty at project init; add a term the
  first time it needs a name.

### plans/handoff.md
- Living state file: current task, what's done, what's next, open
  decisions. Overwrite in place, under ~40 lines — it's not a log.

### Module boundaries
- The moment this project gains more than one internal module/package
  boundary (a new package/, apps/*, packages/*, or a seam worth guarding),
  add or extend a dependency-cruiser config enforcing entry-point-only
  imports and no cycles — do this the moment the boundary appears, don't
  wait to be asked.

### Guard verification
- Any deterministic guard added to this repo (git hook, lint rule,
  dependency-cruiser rule, commit-msg check, etc.) must be proven before
  being considered installed: trigger the violation it's meant to catch,
  confirm it's blocked, revert, confirm a clean run passes. State this in
  the commit that adds the guard — including guards added later, not just
  during initial setup.`;

/**
 * One-time setup steps, numbered to continue from a scaffold's own last
 * step (pass the next free step number). Assumes AGENTS_PRACTICES_SECTION
 * was placed directly above this text in the same prompt.
 */
export function buildPracticesSteps(startStep: number): string {
  const sAgents = startStep;
  const sHook = startStep + 1;
  const sPreCommit = startStep + 2;
  const sAdr = startStep + 3;
  const sContext = startStep + 4;
  const sHandoff = startStep + 5;
  const sDeps = startStep + 6;
  const sProve = startStep + 7;

  return `Now set up standing project practices. Work from what you just scaffolded — don't ask questions the stack already answered.

${sAgents}. Write the "Engineering practices" section above into AGENTS.md verbatim (create the file if the CLI didn't scaffold one, append if it did).

${sHook}. Install a git safety hook blocking \`git push\` (incl. \`--force\`), \`git reset --hard\`, \`git clean -f\`/\`-fd\`, \`git branch -D\`, \`git checkout .\` / \`git restore .\`. This is a Claude Code \`PreToolUse\` hook on the \`Bash\` tool, not a native git hook — it stops the agent from running these, it doesn't lock the user out of their own terminal, and there's no bypass phrase; the user runs the command themselves if they really want it.

   - Write \`.claude/hooks/block-dangerous-git.sh\`:
     \`\`\`bash
     #!/bin/bash
     INPUT=$(cat)
     COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')
     DANGEROUS_PATTERNS=(
       "git push"
       "git reset --hard"
       "git clean -fd"
       "git clean -f"
       "git branch -D"
       "git checkout \\."
       "git restore \\."
       "push --force"
       "reset --hard"
     )
     for pattern in "\${DANGEROUS_PATTERNS[@]}"; do
       if echo "$COMMAND" | grep -qE "$pattern"; then
         echo "BLOCKED: '$COMMAND' matches dangerous pattern '$pattern'. The user has prevented you from doing this." >&2
         exit 2
       fi
     done
     exit 0
     \`\`\`
     \`chmod +x .claude/hooks/block-dangerous-git.sh\`
   - Merge into \`.claude/settings.json\` (project scope — don't overwrite other keys already in the file):
     \`\`\`json
     {
       "hooks": {
         "PreToolUse": [
           {
             "matcher": "Bash",
             "hooks": [
               {
                 "type": "command",
                 "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/block-dangerous-git.sh"
               }
             ]
           }
         ]
       }
     }
     \`\`\`

${sPreCommit}. Install a pre-commit chain (current, non-legacy commands — Husky v9+ has no \`husky-init\`/\`husky set\`/\`husky add\`; hooks are plain scripts written into \`.husky/\`):

   \`\`\`bash
   pnpm add -D husky lint-staged
   pnpm exec husky init
   \`\`\`
   \`husky init\` creates \`.husky/pre-commit\` (default contents \`pnpm test\`) and adds a \`prepare\` script to \`package.json\`. Replace the generated \`.husky/pre-commit\` body with:
   \`\`\`bash
   pnpm exec lint-staged
   \`\`\`
   Add a \`lint-staged\` key to \`package.json\` wired to this stack's formatter/linter and typecheck, e.g.:
   \`\`\`json
   "lint-staged": {
     "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
   }
   \`\`\`
   (swap in the stack's actual formatter/linter — Biome's \`biome check --write\`, etc.)

   Add \`.husky/commit-msg\` rejecting an empty body when the diff touches non-trivial files (skip for docs/config-only commits):
   \`\`\`bash
   #!/bin/bash
   commit_msg_file="$1"
   body=$(tail -n +3 "$commit_msg_file" | grep -v '^#' | grep -v '^\\s*$')
   if [ -z "$body" ]; then
     changed=$(git diff --cached --name-only | grep -vE '\\.(md)$|^docs/')
     if [ -n "$changed" ]; then
       echo "BLOCKED: commit body is empty but the diff touches non-trivial files. State the why in 1-3 sentences." >&2
       exit 1
     fi
   fi
   exit 0
   \`\`\`
   \`chmod +x .husky/commit-msg\`

${sAdr}. Create docs/adr/ with a one-paragraph README stating the gate from the AGENTS.md section above.

${sContext}. Create CONTEXT.md, empty except a one-line header noting it's a project glossary (term → meaning), no terms yet.

${sHandoff}. Create plans/handoff.md from the template described above.

${sDeps}. If the project already has more than one internal module boundary at scaffold time, set up dependency-cruiser now. \`depcruise --init\` is interactive (asks questions, no flag to answer them non-interactively) — don't run it from an agent. Install and write the config directly instead:
   \`\`\`bash
   pnpm add -D dependency-cruiser
   \`\`\`
   \`.dependency-cruiser.cjs\`, extending the maintained preset rather than hand-writing rules from scratch:
   \`\`\`js
   /** @type {import('dependency-cruiser').IConfiguration} */
   module.exports = {
     extends: "dependency-cruiser/configs/recommended",
     forbidden: [
       // add entry-point-only / no-cross-boundary-import rules for this
       // project's actual boundaries here
     ],
     options: {
       tsPreCompilationDeps: true,
     },
   };
   \`\`\`
   Add a \`lint:deps\` (or similar) script running \`depcruise --config .dependency-cruiser.cjs <src-dirs>\` and wire it into the pre-commit chain from step ${sPreCommit}.
   Otherwise leave it — the AGENTS.md rule above means it gets added automatically whenever a boundary appears later, without needing this prompt again.

${sProve}. Prove every guard installed in steps ${sHook}-${sPreCommit} (and ${sDeps}, if run): trigger the violation, confirm blocked, revert, confirm clean. Report what was installed, what was deferred and why, and confirm each guard was proven.`;
}

/** Heading + AGENTS.md block + numbered steps, ready to append after a scaffold's own steps. */
export function buildPracticesPhase(startStep: number): string {
  return `## Standing project practices

Add this section to AGENTS.md:

${AGENTS_PRACTICES_SECTION}

${buildPracticesSteps(startStep)}`;
}
