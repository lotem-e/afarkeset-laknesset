// =========================================================
// SPIKE: pull one real bill from the Knesset and build our
// data model out of it, to find out what the full sync costs.
// =========================================================
// Run it:  node scripts/spike-sync.mjs [billId]
// Default bill: 2203845 - חוק זכויות מבצעים ומשדרים תיקון 10,
// Yosef Taieb's bill, the one that actually became law and is
// the descendant of the bill in Lotem's Figma.
//
// The interesting part is NOT the fetching. It is the
// DERIVATION: the API stores a bill's current status, not its
// history, so the stages[] array our UI needs has to be
// reconstructed from events:
//   - every plenum appearance carries the status at that
//     moment  -> that gives us the milestones and their dates
//   - every committee session linked to the bill has a date
//     -> each session belongs to whichever preparation stage
//        was open on that date
// That reconstruction is what this spike proves out.

import { knesset, anyOf } from "./knesset-api.mjs";
import {
  OFF_PIPELINE,
  STAGE_ORDER,
  STATUS_PASSED,
  stageForStatus,
  stageIndex,
} from "./status-map.mjs";

const BILL_ID = Number(process.argv[2] ?? 2203845);

// ─── Small helpers ─────────────────────────────────────────
const iso = (d) => (d ? String(d).slice(0, 10) : null);
const line = (s = "") => console.log(s);
const title = (s) => {
  line();
  line("=".repeat(60));
  line(s);
  line("=".repeat(60));
};

// ─── 1. The bill itself ────────────────────────────────────
async function loadBill(billId) {
  const [bill] = await knesset.parliament("KNS_Bill", {
    $filter: `BillID eq ${billId}`,
  });
  if (!bill) throw new Error(`No bill ${billId}`);
  return bill;
}

// ─── 2. Who leads it ───────────────────────────────────────
async function loadInitiators(billId) {
  const links = await knesset.parliament("KNS_BillInitiator", {
    $filter: `BillID eq ${billId}`,
  });
  if (links.length === 0) return [];

  const personIds = [...new Set(links.map((l) => l.PersonID))];
  const people = await knesset.parliament("KNS_Person", {
    $filter: anyOf("PersonID", personIds),
  });
  // A person's faction is stored as a POSITION they hold in a
  // given Knesset, so we ask for their Knesset-25 positions and
  // keep the one that names a faction.
  const positions = await knesset.parliament("KNS_PersonToPosition", {
    $filter: `(${anyOf("PersonID", personIds)}) and KnessetNum eq 25`,
  });

  return links
    .sort((a, b) => (a.Ordinal ?? 99) - (b.Ordinal ?? 99))
    .map((link) => {
      const person = people.find((p) => p.PersonID === link.PersonID);
      const faction = positions.find(
        (p) => p.PersonID === link.PersonID && p.FactionName,
      );
      const role = positions.find(
        (p) => p.PersonID === link.PersonID && p.CommitteeName,
      );
      return {
        personId: link.PersonID,
        name: person ? `${person.FirstName} ${person.LastName}` : `#${link.PersonID}`,
        faction: faction?.FactionName ?? null,
        committeeRole: role?.CommitteeName ?? null,
      };
    });
}

// ─── 3. The milestones ( plenum appearances ) ──────────────
async function loadMilestones(billId) {
  const items = await knesset.parliament("KNS_PlmSessionItem", {
    $filter: `ItemID eq ${billId}`,
  });
  if (items.length === 0) return [];

  const sessionIds = [...new Set(items.map((i) => i.PlenumSessionID))];
  const sessions = await knesset.parliament("KNS_PlenumSession", {
    $filter: anyOf("PlenumSessionID", sessionIds),
  });

  return items
    .map((item) => {
      const session = sessions.find((s) => s.PlenumSessionID === item.PlenumSessionID);
      return {
        statusId: item.StatusID,
        stage: stageForStatus(item.StatusID),
        offPipeline: OFF_PIPELINE[item.StatusID] ?? null,
        date: iso(session?.StartDate),
        plenumSessionId: item.PlenumSessionID,
      };
    })
    .filter((m) => m.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── 4. The committee discussions ──────────────────────────
async function loadDiscussions(billId) {
  const items = await knesset.parliament("KNS_CmtSessionItem", {
    $filter: `ItemID eq ${billId}`,
  });
  if (items.length === 0) return [];

  const sessionIds = [...new Set(items.map((i) => i.CommitteeSessionID))];
  const sessions = await knesset.parliament("KNS_CommitteeSession", {
    $filter: anyOf("CommitteeSessionID", sessionIds),
  });

  return sessions
    .map((s) => ({
      sessionId: s.CommitteeSessionID,
      committeeId: s.CommitteeID,
      date: iso(s.StartDate),
      time: s.StartDate ? String(s.StartDate).slice(11, 16) : null,
      name: s.Name ?? null,
    }))
    .filter((d) => d.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ─── 5. THE DERIVATION - build our stages[] array ──────────
// This is the heart of the spike.
function deriveStages(milestones, discussions, currentStatusId) {
  // (a) The first date each stage was reached, from the plenum
  //     milestones.
  const reachedAt = {};
  for (const m of milestones) {
    if (!m.stage) continue;
    if (!reachedAt[m.stage] || m.date < reachedAt[m.stage]) {
      reachedAt[m.stage] = m.date;
    }
  }

  // (b) Assign every committee session to a preparation stage.
  //
  //     The subtle part: a preparation stage happens INSIDE a
  //     committee, so it never appears in the plenum and gets
  //     no milestone date of its own. What bounds it is the
  //     READINGS around it - preparation for the first reading
  //     runs until the first reading happens, and everything
  //     after it is preparation for the second and third.
  //     So a session's date, compared to the first reading,
  //     decides which preparation it belongs to.
  const firstReading = reachedAt["first"];
  const discussionsByStage = { firstPrep: [], secondThirdPrep: [] };
  for (const d of discussions) {
    const owner = firstReading && d.date >= firstReading ? "secondThirdPrep" : "firstPrep";
    discussionsByStage[owner].push(d);
  }

  // A preparation stage's own date is simply when its first
  // session sat.
  for (const prep of ["firstPrep", "secondThirdPrep"]) {
    const sessions = discussionsByStage[prep];
    if (sessions.length > 0 && !reachedAt[prep]) reachedAt[prep] = sessions[0].date;
  }

  // (c) How far did the bill actually get? The furthest stage
  //     with any evidence - a plenum milestone, a committee
  //     session, or the bill's current status.
  let furthest = -1;
  for (const stage of Object.keys(reachedAt)) {
    furthest = Math.max(furthest, stageIndex(stage));
  }
  const currentStage = stageForStatus(currentStatusId);
  if (currentStage) furthest = Math.max(furthest, stageIndex(currentStage));

  // (d) Put it together in the shape our components already read.
  const passed = currentStatusId === STATUS_PASSED;
  return STAGE_ORDER.map((stage, i) => {
    const reached = reachedAt[stage];
    let state;
    if (passed) state = "completed";
    else if (i < furthest) state = "completed";
    else if (i === furthest) state = "inProgress";
    else state = "notReached";

    const stageDiscussions = discussionsByStage[stage] ?? [];
    return {
      stage,
      state,
      reachedAt: reached ?? null,
      discussionCount: stageDiscussions.length,
      discussions: stageDiscussions,
    };
  });
}

// ─── Report ────────────────────────────────────────────────
async function main() {
  title(`SPIKE: bill ${BILL_ID}`);

  const started = Date.now();
  const bill = await loadBill(BILL_ID);
  const [initiators, milestones, discussions] = await Promise.all([
    loadInitiators(BILL_ID),
    loadMilestones(BILL_ID),
    loadDiscussions(BILL_ID),
  ]);
  const elapsed = ((Date.now() - started) / 1000).toFixed(1);

  line(`name        : ${bill.Name}`);
  line(`knesset     : ${bill.KnessetNum}`);
  line(`type        : ${bill.SubTypeDesc}`);
  line(`committeeID : ${bill.CommitteeID}`);
  line(`status      : ${bill.StatusID}${bill.StatusID === STATUS_PASSED ? " ( became law )" : ""}`);
  line(`updated     : ${iso(bill.LastUpdatedDate)}`);
  line(`fetched in  : ${elapsed}s`);

  title("INITIATORS ( the בהובלת rail )");
  for (const i of initiators) {
    line(`  ${i.name}`);
    line(`    faction : ${i.faction ?? "( none found )"}`);
    if (i.committeeRole) line(`    role    : ${i.committeeRole}`);
  }

  title(`PLENUM MILESTONES ( ${milestones.length} )`);
  for (const m of milestones) {
    const tag = m.stage ?? (m.offPipeline ? `OFF: ${m.offPipeline}` : "UNMAPPED");
    line(`  ${m.date}  status ${String(m.statusId).padEnd(4)} -> ${tag}`);
  }

  title(`COMMITTEE DISCUSSIONS ( ${discussions.length} )`);
  for (const d of discussions) {
    line(`  ${d.date} ${d.time ?? ""}  cmt ${d.committeeId}  ${(d.name ?? "").slice(0, 45)}`);
  }

  title("DERIVED stages[] - what our UI would render");
  const stages = deriveStages(milestones, discussions, bill.StatusID);
  for (const s of stages) {
    const mark = { completed: "[x]", inProgress: "[~]", notReached: "[ ]" }[s.state];
    const when = s.reachedAt ? ` since ${s.reachedAt}` : "";
    const disc = s.discussionCount ? `  ${s.discussionCount} דיונים` : "";
    line(`  ${mark} ${s.stage.padEnd(16)}${when}${disc}`);
  }

  title("GAPS - what this spike could NOT get");
  const unmapped = milestones.filter((m) => !m.stage && !m.offPipeline);
  line(`  unmapped statuses     : ${unmapped.length ? [...new Set(unmapped.map((m) => m.statusId))].join(", ") : "none"}`);
  line(`  vote counts           : not linked here ( Votes.svc has no BillID; needs a session join )`);
  line(`  discussion transcripts: not fetched ( protocol files are .doc, a separate problem )`);
  line(`  video + chapters      : nothing in the API`);
  line(`  the editorial layer   : by design, never from the API`);
  line();
}

main().catch((err) => {
  console.error("SPIKE FAILED:", err.message);
  process.exit(1);
});
