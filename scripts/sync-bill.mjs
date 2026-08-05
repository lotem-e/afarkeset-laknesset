// =========================================================
// Sync one bill's FACTS from the Knesset into our content.
// =========================================================
// Run it:  node scripts/sync-bill.mjs 2203845
// Writes:  src/content/bills/facts/<billId>.ts
//
// It writes TypeScript rather than JSON on purpose. The output
// is typed as BillFacts, so if the Knesset ever returns a
// status or a committee we have not mapped, `npm run build`
// fails loudly instead of the site quietly showing nonsense.
//
// The rules this script applies are Lotem's, decided 2026-08-04:
//   1. A bill enters the site once it clears its FIRST REAL
//      HURDLE - a preliminary reading for private bills, a
//      first reading for government and committee bills, which
//      skip the preliminary by law.
//   2. A bill that leaves the pipeline ( merged, stopped,
//      split ) STAYS on the site carrying an explanation. It
//      never silently disappears, because someone was
//      following it.

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { knesset, anyOf } from "./knesset-api.mjs";
import { readingVotesForBill } from "./knesset-votes.mjs";
import {
  COMMITTEE_BY_KNESSET_ID,
  PROCEDURAL_COMMITTEE_IDS,
  TYPE_BY_SUBTYPE,
  ministryDisplayName,
  partyIdForFaction,
} from "./knesset-maps.mjs";
import {
  OFF_PIPELINE,
  STAGE_ORDER,
  STATUS_PASSED,
  stageForStatus,
  stageIndex,
} from "./status-map.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, "../src/content/bills/facts");

const iso = (d) => (d ? String(d).slice(0, 10) : null);
const hhmm = (d) => (d ? String(d).slice(11, 16) : null);

// ─── Fetch ─────────────────────────────────────────────────
async function loadEverything(billId) {
  const [bill] = await knesset.parliament("KNS_Bill", { $filter: `BillID eq ${billId}` });
  if (!bill) throw new Error(`No bill ${billId} in the Knesset API`);

  const [initiatorLinks, plenumItems, committeeItems] = await Promise.all([
    knesset.parliament("KNS_BillInitiator", { $filter: `BillID eq ${billId}` }),
    knesset.parliament("KNS_PlmSessionItem", { $filter: `ItemID eq ${billId}` }),
    knesset.parliament("KNS_CmtSessionItem", { $filter: `ItemID eq ${billId}` }),
  ]);

  const personIds = [...new Set(initiatorLinks.map((l) => l.PersonID))].filter(Boolean);
  const plenumIds = [...new Set(plenumItems.map((i) => i.PlenumSessionID))].filter(Boolean);
  const cmtIds = [...new Set(committeeItems.map((i) => i.CommitteeSessionID))].filter(Boolean);

  const [people, positions, plenumSessions, cmtSessions] = await Promise.all([
    personIds.length
      ? knesset.parliament("KNS_Person", { $filter: anyOf("PersonID", personIds) })
      : [],
    personIds.length
      ? knesset.parliament("KNS_PersonToPosition", {
          $filter: `(${anyOf("PersonID", personIds)}) and KnessetNum eq 25`,
        })
      : [],
    plenumIds.length
      ? knesset.parliament("KNS_PlenumSession", { $filter: anyOf("PlenumSessionID", plenumIds) })
      : [],
    cmtIds.length
      ? knesset.parliament("KNS_CommitteeSession", {
          $filter: anyOf("CommitteeSessionID", cmtIds),
        })
      : [],
  ]);

  return { bill, initiatorLinks, people, positions, plenumItems, plenumSessions, cmtSessions };
}

// ─── Shape ─────────────────────────────────────────────────
function buildInitiators({ bill, initiatorLinks, people, positions }) {
  // A government bill is led by a ministry, not by people.
  if (bill.SubTypeDesc === "ממשלתית") {
    const ministry = positions.find((p) => p.GovMinistryName)?.GovMinistryName;
    return [{ kind: "ministry", name: ministryDisplayName(ministry) }];
  }

  return initiatorLinks
    .filter((l) => l.IsInitiator)
    .sort((a, b) => (a.Ordinal ?? 99) - (b.Ordinal ?? 99))
    .map((link) => {
      const person = people.find((p) => p.PersonID === link.PersonID);
      const factionRow = positions.find((p) => p.PersonID === link.PersonID && p.FactionName);
      return {
        kind: "mk",
        // The synced MK carries its own details, so the site no
        // longer needs a hand-kept roster to render a name.
        personId: link.PersonID,
        name: person ? `${person.FirstName} ${person.LastName}`.trim() : `#${link.PersonID}`,
        partyId: partyIdForFaction(factionRow?.FactionName),
        factionName: factionRow?.FactionName?.trim() ?? null,
      };
    });
}

function buildMilestones({ plenumItems, plenumSessions }) {
  return plenumItems
    .map((item) => {
      const session = plenumSessions.find((s) => s.PlenumSessionID === item.PlenumSessionID);
      return {
        statusId: item.StatusID,
        stage: stageForStatus(item.StatusID),
        offPipeline: OFF_PIPELINE[item.StatusID] ?? null,
        date: iso(session?.StartDate),
      };
    })
    .filter((m) => m.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

function buildDiscussions({ cmtSessions }) {
  return cmtSessions
    .map((s) => ({
      sessionId: s.CommitteeSessionID,
      date: iso(s.StartDate),
      time: hhmm(s.StartDate),
      committeeId: COMMITTEE_BY_KNESSET_ID[s.CommitteeID] ?? null,
      procedural: Boolean(PROCEDURAL_COMMITTEE_IDS[s.CommitteeID]),
    }))
    .filter((d) => d.date)
    .sort((a, b) => a.date.localeCompare(b.date));
}

// The days on which actual READINGS happened - the days worth
// asking the votes API about. Preparation stages have no votes.
function readingDays(milestones) {
  const days = new Set();
  for (const m of milestones) {
    if (m.stage === "preliminary" || m.stage === "first" || m.stage === "secondThird") {
      days.add(m.date);
    }
  }
  return [...days];
}

// The derivation, as proven by the spike: plenum appearances
// give the milestones, and a committee session belongs to
// whichever preparation stage the readings around it define.
function deriveStages(milestones, discussions, currentStatusId) {
  const reachedAt = {};
  for (const m of milestones) {
    if (!m.stage) continue;
    if (!reachedAt[m.stage] || m.date < reachedAt[m.stage]) reachedAt[m.stage] = m.date;
  }

  const firstReading = reachedAt["first"];
  const byStage = { firstPrep: [], secondThirdPrep: [] };
  for (const d of discussions) {
    const owner = firstReading && d.date >= firstReading ? "secondThirdPrep" : "firstPrep";
    byStage[owner].push(d);
  }
  for (const prep of ["firstPrep", "secondThirdPrep"]) {
    if (byStage[prep].length > 0 && !reachedAt[prep]) reachedAt[prep] = byStage[prep][0].date;
  }

  let furthest = -1;
  for (const stage of Object.keys(reachedAt)) furthest = Math.max(furthest, stageIndex(stage));
  const currentStage = stageForStatus(currentStatusId);
  if (currentStage) furthest = Math.max(furthest, stageIndex(currentStage));

  const passed = currentStatusId === STATUS_PASSED;

  return STAGE_ORDER
    .map((stage, i) => {
      let state;
      if (passed || i < furthest) state = "completed";
      else if (i === furthest) state = "inProgress";
      else state = "notReached";

      const sessions = byStage[stage] ?? [];
      return {
        stage,
        state,
        discussions: sessions.map((s) => ({
          date: s.date,
          time: s.time,
          sessionId: s.sessionId,
        })),
      };
    })
    // A bill that skipped a station never visited it. Dropping
    // it keeps the chips honest: a government bill shows four
    // stages, not five with a permanently grey first one.
    .filter((s) => {
      if (s.stage !== "preliminary") return true;
      return Boolean(reachedAt["preliminary"]);
    });
}

// Lotem's rule, applied.
function passesEditorialRule(bill, milestones) {
  if (bill.StatusID === STATUS_PASSED) return true;
  const skipsPreliminary = bill.SubTypeDesc === "ממשלתית" || bill.SubTypeDesc === "ועדה";
  const hurdle = skipsPreliminary ? "first" : "preliminary";
  // "Cleared" means it got at least as far as the hurdle stage.
  const reached = milestones.some(
    (m) => m.stage && stageIndex(m.stage) >= stageIndex(hurdle),
  );
  return reached;
}

// ─── Emit ──────────────────────────────────────────────────
function toTypeScript(facts) {
  const body = JSON.stringify(facts, null, 2)
    // JSON quotes every key; TypeScript does not need it and it
    // reads better in a file a human will occasionally open.
    .replace(/^(\s*)"([A-Za-z_][A-Za-z0-9_]*)":/gm, "$1$2:");

  return `// GENERATED BY scripts/sync-bill.mjs - DO NOT EDIT BY HAND.
// Everything here comes from the Knesset's open data API. Your
// editorial content for this bill lives beside it, in
// src/content/bills/editorial/, and is never touched by the sync.
//
// Regenerate:  node scripts/sync-bill.mjs ${facts.billId}
import type { BillFacts } from "../../types";

export const facts: BillFacts = ${body};
`;
}

async function main() {
  const billId = Number(process.argv[2]);
  if (!billId) {
    console.error("Usage: node scripts/sync-bill.mjs <billId>");
    process.exit(1);
  }

  const data = await loadEverything(billId);
  const { bill } = data;

  const milestones = buildMilestones(data);
  const discussions = buildDiscussions(data);
  const stages = deriveStages(milestones, discussions, bill.StatusID);

  // Attach the real plenum votes to their reading stages. The
  // votes API is undocumented ( see knesset-votes.mjs ), so a
  // failure there degrades to "no tallies", never to a broken
  // sync - the pipeline still has everything else.
  try {
    const votesByStage = await readingVotesForBill(billId, readingDays(milestones));
    for (const stage of stages) {
      const vote = votesByStage[stage.stage];
      if (vote) stage.vote = vote;
    }
  } catch (err) {
    console.warn(`NOTE: votes unavailable ( ${err.message} ) - syncing without tallies.`);
  }

  if (!passesEditorialRule(bill, milestones)) {
    console.warn(
      `NOTE: bill ${billId} has not cleared its first hurdle yet, so it would not appear on the site under the editorial rule. Writing it anyway.`,
    );
  }

  const committeeId = COMMITTEE_BY_KNESSET_ID[bill.CommitteeID];
  if (bill.CommitteeID && !committeeId) {
    throw new Error(
      `Unmapped committee ${bill.CommitteeID}. Add it to scripts/knesset-maps.mjs`,
    );
  }

  const offPipelineReason = OFF_PIPELINE[bill.StatusID] ?? undefined;
  const passed = bill.StatusID === STATUS_PASSED;

  // The date it became law: when it reached the final station.
  const completedDate = passed
    ? milestones.find((m) => m.stage === "secondThird")?.date
    : undefined;

  const facts = {
    billId,
    syncedAt: iso(new Date().toISOString()),
    officialName: bill.Name,
    type: TYPE_BY_SUBTYPE[bill.SubTypeDesc] ?? "private",
    committeeId: committeeId ?? "constitution",
    status: passed ? "completed" : offPipelineReason ? "dropped" : "agenda",
    ...(offPipelineReason ? { offPipelineReason } : {}),
    lastUpdated: iso(bill.LastUpdatedDate),
    ...(completedDate ? { completedDate } : {}),
    initiators: buildInitiators(data),
    stages,
  };

  await mkdir(OUT_DIR, { recursive: true });
  const outPath = resolve(OUT_DIR, `${billId}.ts`);
  await writeFile(outPath, toTypeScript(facts), "utf8");

  const totalDiscussions = stages.reduce((n, s) => n + s.discussions.length, 0);
  console.log(`Synced bill ${billId}`);
  console.log(`  ${facts.officialName}`);
  console.log(`  status ${facts.status} | ${stages.length} stages | ${totalDiscussions} discussions`);
  console.log(`  -> ${outPath.replace(process.cwd() + "/", "")}`);
}

main().catch((err) => {
  console.error("SYNC FAILED:", err.message);
  process.exit(1);
});
