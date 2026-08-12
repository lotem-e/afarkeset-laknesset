// =========================================================
// Data sanity checks for knessets.json - the invariants that
// keep the site honest:
//   1. Knesset numbers are unique and contiguous from 1.
//   2. Every Knesset's seats sum to exactly 120.
//   3. Every coalition slug points at an elected list.
//   4. Partial coalition seats stay within the list's seats.
//   5. Government numbers only ever go up, with no duplicates.
//   6. No em/en dashes anywhere ( the workspace writing rule ).
//
// Run directly:  npm run validate:data
// Also imported by scripts/merge-data.mjs before it writes.
// =========================================================
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export function validateKnessets(knessets) {
  const problems = [];
  const say = (n, msg) => problems.push(`K${n}: ${msg}`);

  // 1. unique + contiguous numbering
  const numbers = knessets.map((k) => k.n).sort((a, b) => a - b);
  numbers.forEach((n, i) => {
    if (n !== i + 1) say(n, `numbering gap or duplicate ( expected ${i + 1} )`);
  });

  let lastGov = 0;
  for (const k of [...knessets].sort((a, b) => a.n - b.n)) {
    // 2. seats sum to 120
    const sum = k.parties.reduce((s, p) => s + p.seats, 0);
    if (sum !== 120) say(k.n, `seats sum to ${sum}, not 120`);

    // 3 + 4. coalition references and bounds
    const bySlug = new Map(k.parties.map((p) => [p.slug, p]));
    for (const c of k.firstGovernment?.coalition ?? []) {
      const p = bySlug.get(c.slug);
      if (!p) {
        say(k.n, `coalition slug "${c.slug}" is not an elected list`);
        continue;
      }
      if (c.seatsInCoalition !== undefined) {
        if (c.seatsInCoalition < 1 || c.seatsInCoalition >= p.seats)
          say(k.n, `"${c.slug}" seatsInCoalition ${c.seatsInCoalition} out of range ( 1..${p.seats - 1} )`);
      }
    }

    // 5. government numbering marches forward across the decades
    for (const g of k.governments) {
      if (g.govNumber <= lastGov) say(k.n, `government ${g.govNumber} out of order ( after ${lastGov} )`);
      lastGov = g.govNumber;
    }
    if (k.firstGovernment && k.governments[0]?.govNumber !== k.firstGovernment.govNumber)
      say(k.n, `firstGovernment ${k.firstGovernment.govNumber} is not the first entry in governments`);

    // 6. the workspace writing rule - no em/en dashes in any text
    const text = JSON.stringify(k);
    if (/[–—]/.test(text)) say(k.n, "contains an em/en dash - use ' - ' instead");
  }

  return problems;
}

// CLI mode: validate the committed data file.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dataUrl = new URL("../src/content/knessets.json", import.meta.url);
  const knessets = JSON.parse(readFileSync(dataUrl, "utf8"));
  const problems = validateKnessets(knessets);
  if (problems.length) {
    console.error(`FAIL - ${problems.length} problem(s):`);
    for (const p of problems) console.error("  " + p);
    process.exit(1);
  }
  const govs = knessets.reduce((s, k) => s + k.governments.length, 0);
  console.log(`OK - ${knessets.length} Knessets, ${govs} governments, every sum = 120.`);
}
