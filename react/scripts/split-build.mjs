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
import { cp, mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const target = process.argv[2];
const OUT = "out";
const DECK_DIST = "deck-dist";
const DECK_FILES = ["deck", "deck.html", "deck.txt"];

if (!existsSync(OUT)) {
  console.error("no out/ — run `next build` first");
  process.exit(1);
}

/** Every file under a directory, as paths relative to `root`. */
async function walk(dir, root = dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, root)));
    else out.push(relative(root, p).split(sep).join("/"));
  }
  return out;
}

/**
 * Deleting deck.html is not enough.
 *
 * The deck's slide content — the equity split, the founding-partner asks — is
 * compiled into a chunk under _next/static, and removing the route that loads
 * it leaves that chunk sitting in the bundle. Nothing links to it, but Pages
 * serves everything it is given, so the deck was publicly fetchable on the
 * marketing domain at a URL that only looks unguessable.
 *
 * So: reach the assets the site actually uses, starting from the files a
 * browser can ask for by name, and follow references transitively. Anything
 * under _next/static that is never reached is a leftover of a route that no
 * longer exists, and goes. Matching is by filename — the build gives every
 * chunk a unique hashed name, so a bare basename is an unambiguous reference.
 */
async function pruneUnreachable(root) {
  const all = await walk(root);
  const assets = all.filter((f) => f.startsWith("_next/static/"));
  const byName = new Map();
  for (const a of assets) byName.set(a.split("/").pop(), a);

  // Fonts and images are referenced from inside compiled CSS/JS in forms this
  // scan would miss, and they cannot carry deck prose. Only code is pruned.
  const prunable = new Set(
    assets.filter((a) => /\.(js|css)$/.test(a) && !/\/media\//.test(a))
  );

  const reached = new Set();
  const queue = all.filter((f) => !f.startsWith("_next/static/"));
  while (queue.length) {
    const f = queue.pop();
    let text;
    try {
      text = await readFile(join(root, f), "utf8");
    } catch {
      continue; // binary, or unreadable — it cannot reference anything textually
    }
    for (const [name, path] of byName) {
      if (reached.has(path)) continue;
      if (text.includes(name)) {
        reached.add(path);
        queue.push(path);
      }
    }
  }

  const orphans = [...prunable].filter((a) => !reached.has(a));
  for (const o of orphans) await rm(join(root, o), { force: true });
  return orphans;
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

  const orphans = await pruneUnreachable(OUT);
  console.log(
    `site: deck stripped from out/ (${orphans.length} unreachable asset${
      orphans.length === 1 ? "" : "s"
    } pruned)`
  );

  // The strip is only worth anything if the deck's words are gone with it. This
  // is the assertion that actually protects the confidential document, so it
  // fails the build rather than warning.
  const TELLS = ["FOUNDING PARTNERS BRING", "ISTHMUS MERIDIAN BRINGS"];
  const leaked = [];
  for (const f of await walk(OUT)) {
    let text;
    try {
      text = await readFile(join(OUT, f), "utf8");
    } catch {
      continue;
    }
    if (TELLS.some((t) => text.includes(t))) leaked.push(f);
  }
  if (leaked.length) {
    console.error("deck content still present in the site bundle:", leaked);
    process.exit(1);
  }
  console.log("site: no deck content in the bundle");
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
