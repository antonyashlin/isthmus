#!/usr/bin/env node
/**
 * The deck is not part of the website.
 *
 * Both are built from one Next app, because they share the brand tokens, the
 * fonts and the chart layer. But they are different audiences and different
 * deployments: the site is public, the deck is a confidential founding-partner
 * document. Shipping them together put a CONFIDENTIAL deck on the marketing
 * domain, which is exactly what this script exists to prevent.
 *
 *   node scripts/split-build.mjs site   -> strips the deck out of out/
 *   node scripts/split-build.mjs deck   -> writes deck-dist/ with ONLY the deck
 *
 * Run after `next build`. The site target is wired into CI; the deck target is
 * deliberately manual.
 */
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const target = process.argv[2];
const OUT = "out";
const DECK_DIST = "deck-dist";
const DECK_FILES = ["deck", "deck.html", "deck.txt"];

if (!existsSync(OUT)) {
  console.error("no out/ — run `next build` first");
  process.exit(1);
}

if (target === "site") {
  for (const f of DECK_FILES) {
    await rm(join(OUT, f), { recursive: true, force: true });
  }
  const left = (await readdir(OUT)).filter((f) => f.startsWith("deck"));
  if (left.length) {
    console.error("deck files survived the strip:", left);
    process.exit(1);
  }
  console.log("site: deck stripped from out/");
} else if (target === "deck") {
  await rm(DECK_DIST, { recursive: true, force: true });
  await mkdir(DECK_DIST, { recursive: true });
  // The deck is the whole site at this origin, so it becomes index.html.
  await cp(join(OUT, "deck.html"), join(DECK_DIST, "index.html"));
  await cp(join(OUT, "_next"), join(DECK_DIST, "_next"), { recursive: true });
  if (existsSync(join(OUT, "favicon.svg"))) {
    await cp(join(OUT, "favicon.svg"), join(DECK_DIST, "favicon.svg"));
  }
  // No robots.txt, no sitemap.xml, no og.png — nothing that invites a crawler
  // or leaks the deck's existence.
  const size = (await stat(join(DECK_DIST, "index.html"))).size;
  console.log(`deck: deck-dist/ written (index.html ${size} bytes)`);
} else {
  console.error("usage: split-build.mjs <site|deck>");
  process.exit(1);
}
