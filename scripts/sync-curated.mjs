// =========================================================
// Re-sync every curated bill - the ones with editorial.
// =========================================================
// The nightly job runs sync-all for the long tail, but the
// curated bills are sync-bill's territory ( they carry vote
// tallies from the undocumented votes API ). This walks them
// one by one, with a breath between bills - polite pacing for
// that API, which rate-limited us once already.
//
// Run it:  node scripts/sync-curated.mjs
import { readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const EDITORIAL_DIR = resolve(HERE, "../src/content/bills/editorial");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ids = [];
for (const file of await readdir(EDITORIAL_DIR)) {
  if (!file.endsWith(".ts")) continue;
  const source = await readFile(resolve(EDITORIAL_DIR, file), "utf8");
  const match = source.match(/billId:\s*(\d+)/);
  if (match) ids.push(Number(match[1]));
}

console.log(`Re-syncing ${ids.length} curated bills...`);
let failures = 0;
for (const id of ids) {
  try {
    execFileSync("node", [resolve(HERE, "sync-bill.mjs"), String(id)], {
      stdio: "inherit",
    });
  } catch {
    // One bill failing ( a flaky API moment ) must not kill the
    // night - the rest still sync, and tomorrow retries.
    failures++;
    console.error(`  bill ${id} failed - continuing`);
  }
  await sleep(4000);
}
console.log(`Curated sync done${failures ? ` ( ${failures} failed )` : ""}.`);
process.exit(failures === ids.length && ids.length > 0 ? 1 : 0);
