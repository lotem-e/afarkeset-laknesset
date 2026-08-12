// =========================================================
// Color safety for all 25 seat maps at once.
//
// Every Knesset's parties are laid out as wedges, so each pair
// of NEIGHBORS in display order must stay distinguishable - for
// colorblind readers too. This script rebuilds each Knesset's
// display order ( the same rule as src/lib/blocs.ts - keep them
// in sync ), resolves the colors, and feeds the ordered list to
// scripts/validate_palette.js ( the dataviz six-checks validator ).
//
//   npm run validate:colors            compact per-Knesset verdicts
//   npm run validate:colors -- --verbose   full validator tables
//
// It also hard-fails when two parties in the SAME Knesset resolve
// to the same hex - that would make two wedges indistinguishable
// no matter how good the palette is.
// =========================================================
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SURFACE = "#fdfcf9"; // --surface in src/index.css - the card the charts sit on
const verbose = process.argv.includes("--verbose");

const read = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), "utf8"));
const knessets = read("../src/content/knessets.json");
const palette = read("../src/content/palette.json");
const validator = fileURLToPath(new URL("./validate_palette.js", import.meta.url));

const color = (p) => palette.parties[p.slug] ?? palette.families[p.family];

// Mirror of displayParties() in src/lib/blocs.ts.
function displayOrder(k) {
  const coalition = new Map(
    (k.firstGovernment?.coalition ?? []).map((c) => [c.slug, c.seatsInCoalition ?? null])
  );
  const all = k.parties.map((p) => ({
    ...p,
    coalitionSeats: coalition.has(p.slug) ? coalition.get(p.slug) ?? p.seats : 0,
  }));
  const bySeats = (a, b) => b.seats - a.seats;
  return [
    ...all.filter((p) => p.coalitionSeats === p.seats && p.coalitionSeats > 0).sort(bySeats),
    ...all.filter((p) => p.coalitionSeats > 0 && p.coalitionSeats < p.seats).sort(bySeats),
    ...all.filter((p) => p.coalitionSeats === 0).sort(bySeats),
  ];
}

let failures = 0;
for (const k of knessets) {
  const ordered = displayOrder(k);

  // Same hex twice in one chart = two wedges nobody can tell apart.
  const byHex = new Map();
  for (const p of ordered) {
    const hex = color(p);
    if (byHex.has(hex)) {
      console.error(`K${k.n}: DUPLICATE color ${hex} - "${byHex.get(hex)}" and "${p.slug}"`);
      failures++;
    }
    byHex.set(hex, p.slug);
  }

  const hexes = ordered.map(color).join(",");
  try {
    const out = execFileSync(
      "node",
      [validator, hexes, "--mode", "light", "--surface", SURFACE],
      { encoding: "utf8" }
    );
    console.log(`K${k.n}: PASS ( ${ordered.length} lists )`);
    if (verbose) console.log(out);
  } catch (e) {
    failures++;
    console.error(`K${k.n}: FAIL`);
    const out = String(e.stdout ?? "");
    // Show only the failing lines unless --verbose asked for everything.
    const lines = out
      .split("\n")
      .filter((l) => verbose || /FAIL|WARN/.test(l));
    // Translate slot indexes back to party slugs for readable reports.
    console.error(lines.join("\n"));
    console.error("  order: " + ordered.map((p, i) => `${i + 1}=${p.slug}`).join(" "));
  }
}

if (failures) {
  console.error(`\n${failures} Knesset(s) failed - fix palette.json and rerun.`);
  process.exit(1);
}
console.log("\nAll seat maps pass the color checks.");
