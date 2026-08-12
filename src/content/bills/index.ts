// =========================================================
// The single entry point for bills - pages import from here.
// =========================================================
// As of 2026-08-12 every bill on the site is assembled the same
// way: FACTS synced from the Knesset API + EDITORIAL written by
// Lotem, joined in merge.ts by the Knesset's bill id. There are
// no hand-kept stages or dates left anywhere.
//
// ( pa-funds is deliberately absent - see parked.ts: none of its
// real versions ever cleared a preliminary reading, and the
// entry rule keeps it off the site. )
import type { Bill, BillStatus, Discussion, StageKey } from "../types";
import { buildBill } from "./merge";

import { facts as performersRightsFacts } from "./facts/2203845";
import { facts as judiciaryBasicLawFacts } from "./facts/2201200";
import { facts as hospitalsMentalHealthFacts } from "./facts/2227232";
import { facts as pregnancyGrantFacts } from "./facts/2197296";
import { facts as mkImmunityFacts } from "./facts/2223561";
import { facts as aviationServicesFacts } from "./facts/2218572";
import { facts as crimeOrgsFacts } from "./facts/2214419";
import { facts as dogsSupervisionFacts } from "./facts/2224337";
import { facts as equalOpportunitiesFacts } from "./facts/2198458";
import { facts as schoolBoycottFacts } from "./facts/2220190";
import { facts as policeDocumentationFacts } from "./facts/2209053";

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

// The fully-written bills come first so they lead the list,
// like in the Figma; the card-level bills follow in the
// design's original order.
export const bills: Bill[] = [
  buildBill(performersRightsFacts, performersRightsEditorial),
  buildBill(judiciaryBasicLawFacts, judiciaryBasicLawEditorial),
  buildBill(hospitalsMentalHealthFacts, hospitalsMentalHealthEditorial),
  buildBill(pregnancyGrantFacts, pregnancyGrantEditorial),
  buildBill(mkImmunityFacts, mkImmunityEditorial),
  buildBill(aviationServicesFacts, aviationServicesEditorial),
  buildBill(crimeOrgsFacts, crimeOrgsEditorial),
  buildBill(dogsSupervisionFacts, dogsSupervisionEditorial),
  buildBill(equalOpportunitiesFacts, equalOpportunitiesEditorial),
  buildBill(schoolBoycottFacts, schoolBoycottEditorial),
  buildBill(policeDocumentationFacts, policeDocumentationEditorial),
];

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
