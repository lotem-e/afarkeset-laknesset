// =========================================================
// Display aggregates - COMPUTED from the synced corpus.
// =========================================================
// Until 2026-08-12 these were the Figma's illustrative numbers,
// kept while only a dozen seeded bills existed. Now every figure
// derives from the real 1,310-bill corpus at build time - the
// exports kept their names, so consumers did not move.
//
// Two honest footnotes on method:
// - "Initiators" are the lead initiators the sync stores ( up to
//   three per long-tail bill ), so bloc collaboration counts
//   cross-bloc LEAD teams, not every last co-signer.
// - Party seats are NOT derived here - they live in parties.ts
//   and drive the hemicycle.
//
// The tracking page still derives its counts LIVE from the bills
// the user follows - never from here.
import { bills } from "./bills";
import { committees } from "./committees";
import { parties } from "./parties";
import { STAGES, STAGE_ORDER } from "./stages";
import type { Bloc, StageKey } from "./types";

// One labeled number - the shape every bar list consumes.
export interface StatItem {
  label: string;
  count: number;
}

const agendaBills = bills.filter((b) => b.status === "agenda");
const completedBills = bills.filter((b) => b.status === "completed");

// Header counts ( "הצעות חוק על סדר היום / 459" )
export const headerCounts = {
  agenda: agendaBills.length,
  completed: completedBills.length,
  // The statistics page surveys the whole site.
  stats: bills.length,
};

// סטטיסטיקות - bills per handling committee, busiest first.
export const billsPerCommittee: StatItem[] = committees
  .map((committee) => ({
    label: committee.shortName,
    count: bills.filter((b) => b.committeeId === committee.id).length,
  }))
  .sort((a, b) => b.count - a.count);

// סטטיסטיקות - where the ACTIVE bills stand right now: each
// agenda bill's in-progress station, in pipeline order.
export const billsPerStatus: StatItem[] = STAGE_ORDER.map((key: StageKey) => ({
  label: STAGES[key].fullLabel,
  count: agendaBills.filter(
    (b) => b.stages.find((s) => s.state === "inProgress")?.stage === key,
  ).length,
})).filter((item) => item.count > 0);

// סטטיסטיקות - who submits: private bills by their lead team's
// bloc. A team drawn from both blocs counts as a collaboration.
const blocOf = new Map(parties.map((p) => [p.id, p.bloc]));

function billBlocs(billIndex: number): Set<Bloc> {
  const found = new Set<Bloc>();
  for (const ini of bills[billIndex].initiators) {
    if (ini.kind !== "mk" || !ini.partyId) continue;
    const bloc = blocOf.get(ini.partyId);
    if (bloc) found.add(bloc);
  }
  return found;
}

export const blocCounts = { coalition: 0, opposition: 0, collaborations: 0 };
for (let i = 0; i < bills.length; i++) {
  if (bills[i].type !== "private") continue;
  const blocs = billBlocs(i);
  if (blocs.size === 2) blocCounts.collaborations++;
  else if (blocs.has("coalition")) blocCounts.coalition++;
  else if (blocs.has("opposition")) blocCounts.opposition++;
}

// סטטיסטיקות - the MKs who lead the most bills on the site.
const perInitiator = new Map<string, { label: string; count: number }>();
for (const bill of bills) {
  if (bill.type !== "private") continue;
  for (const ini of bill.initiators) {
    if (ini.kind !== "mk" || !ini.name) continue;
    const key = ini.personId ? String(ini.personId) : ini.name;
    const entry = perInitiator.get(key) ?? { label: ini.name, count: 0 };
    entry.count++;
    perInitiator.set(key, entry);
  }
}
export const topInitiators: StatItem[] = [...perInitiator.values()]
  .sort((a, b) => b.count - a.count)
  .slice(0, 12);

// The filters drawer's "הצעות חוק חמות עכשיו" - a curated
// pick, an editorial choice rather than a computed one.
export const hotBillIds = [
  "judiciary-basic-law",
  "mk-immunity",
  "school-boycott",
  "police-documentation",
];

// סטטיסטיקות - party affiliation of each private bill's FIRST
// initiator, largest first.
const perParty = new Map<string, number>();
for (const bill of bills) {
  if (bill.type !== "private") continue;
  const first = bill.initiators.find((ini) => ini.kind === "mk" && ini.partyId);
  if (!first || first.kind !== "mk" || !first.partyId) continue;
  perParty.set(first.partyId, (perParty.get(first.partyId) ?? 0) + 1);
}
export const billsPerParty: StatItem[] = parties
  .map((p) => ({ label: p.name, count: perParty.get(p.id) ?? 0 }))
  .filter((item) => item.count > 0)
  .sort((a, b) => b.count - a.count);
