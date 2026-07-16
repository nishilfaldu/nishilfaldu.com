/**
 * Screenshots deployed showcase projects into public/showcase/.
 *
 * Dormant for the current /projects list (text-first, no carousel). Keep for
 * future detail pages that want a capture. Reads `url` entries from
 * components/showcase-projects.ts.
 *
 * Uses the system Chrome (playwright-core's `channel: "chrome"`), so nothing
 * downloads a browser.
 *
 *   node scripts/capture-showcase.mjs
 */
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const src = await readFile(
  new URL("../components/showcase-projects.ts", import.meta.url),
  "utf8",
);

// Pull { slug, url } pairs out of the TS source rather than importing it —
// node can't import TS, and a parser dependency is overkill for two fields.
// Split at each `slug:` so an entry without a `url` can't swallow the next
// entry's, then keep only the segments that declare one.
const targets = src
  .split(/(?=slug: ")/)
  .map((seg) => ({
    slug: seg.match(/^slug: "([^"]+)"/)?.[1],
    url: seg.match(/url: "([^"]+)"/)?.[1],
  }))
  .filter((t) => t.slug && t.url);

if (targets.length === 0) {
  console.error("No deployed projects (entries with `url`) found.");
  process.exit(1);
}

const outDir = new URL("../public/showcase/", import.meta.url);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

for (const { slug, url } of targets) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  // Fonts and hero images often land just after network idle.
  await page.waitForTimeout(1500);
  const path = new URL(`${slug}.png`, outDir).pathname;
  await page.screenshot({ path });
  console.log(`${slug} ← ${url}`);
}

await browser.close();
