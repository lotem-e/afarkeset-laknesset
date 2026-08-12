// =========================================================
// The single entry point for bills - pages import from here.
// =========================================================
// Every bill is FACTS synced from the Knesset API. The curated
// few also carry EDITORIAL written by Lotem, joined in merge.ts
// by the Knesset's bill id; the long tail renders from facts
// alone ( official name, official summary where one exists ).
//
// Facts files are loaded automatically: sync-all writes one file
// per qualifying bill into facts/, and the glob below picks it
// up - adding a bill to the site is a sync run, not a code edit.
//
// ( pa-funds is deliberately absent - see parked.ts: none of its
// real versions ever cleared a preliminary reading, and the
// entry rule keeps it off the site. )
import type { Bill, BillEditorial, BillFacts, BillStatus, Discussion, StageKey } from "../types";
import { buildBill, buildBillFromFacts } from "./merge";

import { performersRightsEditorial } from "./editorial/performers-rights";
import { judiciaryBasicLawEditorial } from "./editorial/judiciary-basic-law";
import { hospitalsMentalHealthEditorial } from "./editorial/hospitals-mental-health";
import { pregnancyGrantEditorial } from "./editorial/pregnancy-grant";
import { mkImmunityEditorial } from "./editorial/mk-immunity";
import { aviationServicesEditorial } from "./editorial/aviation-services";
import { crimeOrgsEditorial } from "./editorial/crime-orgs";
import { dogsSupervisionEditorial } from "./editorial/dogs-supervision";
import { equalOpportunitiesEditorial } from "./editorial/equal-opportunities";
import { schoolBoycottEditorial } from "./editorial/school-boycott";
import { policeDocumentationEditorial } from "./editorial/police-documentation";

// The curated registry, in display order: fully-written bills
// lead the list, like in the Figma. Adding editorial for a bill
// means writing its file and listing it here - nothing else.
const EDITORIALS: BillEditorial[] = [
  performersRightsEditorial,
  judiciaryBasicLawEditorial,
  hospitalsMentalHealthEditorial,
  pregnancyGrantEditorial,
  mkImmunityEditorial,
  aviationServicesEditorial,
  crimeOrgsEditorial,
  dogsSupervisionEditorial,
  equalOpportunitiesEditorial,
  schoolBoycottEditorial,
  policeDocumentationEditorial,
];

// Vite collects every facts file at build time. `eager` inlines
// them into the bundle - no network requests at run time.
const factsModules = import.meta.glob<{ facts: BillFacts }>("./facts/*.ts", {
  eager: true,
});

const factsById = new Map<number, BillFacts>();
for (const module of Object.values(factsModules)) {
  factsById.set(module.facts.billId, module.facts);
}

const curated: Bill[] = EDITORIALS.map((editorial) => {
  const facts = factsById.get(editorial.billId);
  if (!facts) {
    throw new Error(
      `Editorial for bill ${editorial.billId} ( ${editorial.id} ) has no facts file - run: node scripts/sync-bill.mjs ${editorial.billId}`,
    );
  }
  return buildBill(facts, editorial);
});

const curatedIds = new Set(EDITORIALS.map((e) => e.billId));
const longTail: Bill[] = [...factsById.values()]
  .filter((facts) => !curatedIds.has(facts.billId))
  .map(buildBillFromFacts)
  // Freshest first, so the long lists lead with what moved.
  .sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));

export const bills: Bill[] = [...curated, ...longTail];

export function getBill(id: string): Bill | undefined {
  return bills.find((b) => b.id === id);
}

export function billsByStatus(status: BillStatus): Bill[] {
  return bills.filter((b) => b.status === status);
}

// All of a bill's discussions flattened in pipeline order, so
// "the third discussion" means one thing everywhere: tiles
// link by this index and the discussion page looks it up by
// the same one.
export interface BillDiscussion {
  discussion: Discussion;
  stage: StageKey;
  index: number; // 1-based, across the whole bill
}

export function billDiscussions(bill: Bill): BillDiscussion[] {
  const out: BillDiscussion[] = [];
  for (const progress of bill.stages) {
    for (const d of progress.discussions ?? []) {
      out.push({ discussion: d, stage: progress.stage, index: out.length + 1 });
    }
  }
  return out;
}
