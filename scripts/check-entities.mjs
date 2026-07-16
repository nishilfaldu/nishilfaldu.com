/**
 * Fails if any JSX file uses an HTML entity.
 *
 * Next 16's SWC drops the leading space of any JSXText node that contains one,
 * so `<span>font</span> is one … &ldquo;Geist&rdquo;` ships as `fontis one`.
 * The entity can sit lines away from the damage, which makes it near-invisible
 * in review — the rendered page just quietly loses a space.
 *
 * Literal characters (— ’ “ ⌘) compile correctly and read better in source.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "lib"];
const ENTITY = /&(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#[xX][0-9a-fA-F]+);/g;

/** What to write instead. Anything else: use the literal character. */
const SUGGEST = {
  "&mdash;": "—",
  "&ndash;": "–",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&ldquo;": "“",
  "&rdquo;": "”",
  "&larr;": "←",
  "&rarr;": "→",
  "&middot;": "·",
  "&hellip;": "…",
  "&#8984;": "⌘",
  "&nbsp;": "a literal non-breaking space",
};

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (p.endsWith(".tsx") || p.endsWith(".jsx")) yield p;
  }
}

let failures = 0;
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const src = readFileSync(file, "utf8");
    src.split("\n").forEach((line, i) => {
      for (const m of line.matchAll(ENTITY)) {
        failures++;
        const fix = SUGGEST[m[0]] ?? "the literal character";
        console.log(`${file}:${i + 1}  ${m[0]}  ->  use ${fix}`);
      }
    });
  }
}

if (failures) {
  console.log(
    `\n${failures} HTML ${failures === 1 ? "entity" : "entities"} in JSX. ` +
      "SWC eats the leading space of any text node containing one — write the character literally.",
  );
  process.exit(1);
}
console.log("No HTML entities in JSX.");
