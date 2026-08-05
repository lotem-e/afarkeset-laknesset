// =========================================================
// How big is the site, under Lotem's editorial rule?
// =========================================================
// The rule: "only bills that passed a preliminary reading
// enter the site."
//
// This counts every bill of the 25th Knesset and sorts it into
// buckets, so the rule can be judged against real numbers
// instead of a feeling. It also measures the one case the rule
// does not cover: government and committee bills never HAVE a
// preliminary reading - they skip it by law - so a literal
// reading of the rule would delete them all from the site.
//
// Run it:  node scripts/measure-policy.mjs

import { knesset } from "./knesset-api.mjs";
import { OFF_PIPELINE, STATUS_PASSED, stageForStatus, stageIndex } from "./status-map.mjs";

const KNESSET = 25;

// The status a private bill sits at before anyone has voted on
// it: tabled, awaiting its preliminary reading.
const STATUS_TABLED_FOR_PRELIMINARY = 104;

async function main() {
  console.log(`Fetching every bill of Knesset ${KNESSET}. This walks the API page by page.`);
  const started = Date.now();

  const bills = await knesset.parliament("KNS_Bill", {
    $filter: `KnessetNum eq ${KNESSET}`,
    $select: "BillID,Name,SubTypeDesc,StatusID,CommitteeID",
  });

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`Got ${bills.length} bills in ${elapsed}s\n`);

  // ─── By type ─────────────────────────────────────────────
  const byType = {};
  for (const b of bills) {
    const t = b.SubTypeDesc ?? "( no type )";
    byType[t] = (byType[t] ?? 0) + 1;
  }
  console.log("BY TYPE");
  for (const [type, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(5)}  ${type}`);
  }

  // ─── By where they stand ─────────────────────────────────
  const buckets = {
    tabled: [], // still waiting for a preliminary reading
    inPipeline: [], // past the preliminary, still moving
    passed: [], // became law
    offPipeline: [], // merged / stopped / split / carried over
    unknown: [], // a status our map does not cover
  };

  for (const b of bills) {
    if (b.StatusID === STATUS_PASSED) buckets.passed.push(b);
    else if (b.StatusID === STATUS_TABLED_FOR_PRELIMINARY) buckets.tabled.push(b);
    else if (OFF_PIPELINE[b.StatusID]) buckets.offPipeline.push(b);
    else if (stageForStatus(b.StatusID)) buckets.inPipeline.push(b);
    else buckets.unknown.push(b);
  }

  console.log("\nBY WHERE THEY STAND ( current status )");
  console.log(`  ${String(buckets.tabled.length).padStart(5)}  הונחו ומחכות לדיון מוקדם   -> the rule EXCLUDES these`);
  console.log(`  ${String(buckets.inPipeline.length).padStart(5)}  בתהליך, אחרי הטרומית        -> the rule INCLUDES these`);
  console.log(`  ${String(buckets.passed.length).padStart(5)}  התקבלו והפכו לחוק           -> the rule INCLUDES these`);
  console.log(`  ${String(buckets.offPipeline.length).padStart(5)}  ירדו מהמסלול                -> needs your ruling`);
  console.log(`  ${String(buckets.unknown.length).padStart(5)}  סטטוס שלא מיפינו            -> needs mapping`);

  const included = buckets.inPipeline.length + buckets.passed.length;
  const pct = ((included / bills.length) * 100).toFixed(1);
  console.log(`\n  => THE SITE WOULD HOLD ${included} bills ( ${pct}% of ${bills.length} )`);

  // ─── The edge case the rule does not cover ───────────────
  // Government and committee bills never have a preliminary
  // reading. Do any of them pass the rule as written?
  const skipPreliminary = bills.filter(
    (b) => b.SubTypeDesc === "ממשלתית" || b.SubTypeDesc === "ועדה",
  );
  const skipInSite = skipPreliminary.filter(
    (b) => b.StatusID === STATUS_PASSED || (stageForStatus(b.StatusID) && b.StatusID !== STATUS_TABLED_FOR_PRELIMINARY),
  );
  console.log("\nTHE EDGE CASE");
  console.log(`  ${skipPreliminary.length} bills are ממשלתית / ועדה, which SKIP the preliminary reading by law.`);
  console.log(`  ${skipInSite.length} of them are past their first hurdle and would look wrong to exclude.`);
  console.log(`  Recommendation: read the rule as "cleared its first real hurdle" - a preliminary`);
  console.log(`  reading for private bills, a first reading for the ones that skip it.`);

  // ─── The statuses we still have not mapped ───────────────
  if (buckets.unknown.length > 0) {
    const counts = {};
    for (const b of buckets.unknown) counts[b.StatusID] = (counts[b.StatusID] ?? 0) + 1;
    console.log("\nUNMAPPED STATUSES ( id: how many bills )");
    for (const [id, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(5)}  status ${id}`);
    }
  }

  // ─── What the off-pipeline bills actually are ────────────
  if (buckets.offPipeline.length > 0) {
    const counts = {};
    for (const b of buckets.offPipeline) {
      const label = OFF_PIPELINE[b.StatusID];
      counts[label] = (counts[label] ?? 0) + 1;
    }
    console.log("\nOFF-PIPELINE, BY REASON");
    for (const [label, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(n).padStart(5)}  ${label}`);
    }
  }

  // Keep the linter honest about an import we use indirectly.
  void stageIndex;
}

main().catch((err) => {
  console.error("MEASURE FAILED:", err.message);
  process.exit(1);
});
