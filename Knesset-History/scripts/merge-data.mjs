// =========================================================
// One-time builder: merges the per-era research JSONs into
// src/content/knessets.json, refusing to write anything that
// fails validation.
//
//   node scripts/merge-data.mjs <era1.json> <era2.json> ...
//
// Each input file is { "knessets": [ ... ] }. The output is a
// flat array sorted by Knesset number. After a successful write
// it also reports which party slugs have no explicit color in
// palette.json ( they render with the family fallback ), so a
// missing color is a visible fact, never a silent surprise.
// =========================================================
import { readFileSync, writeFileSync } from "node:fs";
import { validateKnessets } from "./validate-data.mjs";

const inputs = process.argv.slice(2);
if (inputs.length === 0) {
  console.error("usage: node scripts/merge-data.mjs <file.json> ...");
  process.exit(1);
}

const knessets = inputs
  .flatMap((f) => JSON.parse(readFileSync(f, "utf8")).knessets)
  .sort((a, b) => a.n - b.n);

const problems = validateKnessets(knessets);
if (problems.length) {
  console.error(`REFUSING to write - ${problems.length} problem(s):`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}

const outUrl = new URL("../src/content/knessets.json", import.meta.url);
writeFileSync(outUrl, JSON.stringify(knessets, null, 2) + "\n");

// Report the slug landscape against the palette.
const palette = JSON.parse(
  readFileSync(new URL("../src/content/palette.json", import.meta.url), "utf8")
);
const seen = new Map(); // slug -> { family, knessets: [] }
for (const k of knessets)
  for (const p of k.parties) {
    if (!seen.has(p.slug)) seen.set(p.slug, { family: p.family, ns: [] });
    seen.get(p.slug).ns.push(k.n);
  }

const missing = [...seen.entries()].filter(([slug]) => !palette.parties[slug]);
console.log(`Wrote ${knessets.length} Knessets, ${seen.size} distinct party slugs.`);
if (missing.length) {
  console.log(`\n${missing.length} slugs use the FAMILY FALLBACK color:`);
  for (const [slug, info] of missing)
    console.log(`  ${slug} ( ${info.family} ) in K${info.ns.join(", K")}`);
} else {
  console.log("Every slug has an explicit color in palette.json.");
}
