// =========================================================
// The single entry point for bills - pages import from here.
// =========================================================
import type { Bill, BillStatus, Discussion, StageKey } from "../types";
import { facts as performersRightsFacts } from "./facts/2203845";
import { performersRightsEditorial } from "./editorial/performers-rights";
import { buildBill } from "./merge";
import { judiciaryBasicLaw } from "./judiciary-basic-law";
import { partialBills } from "./partial-bills";

// SYNCED: facts from the Knesset API, editorial written by hand,
// joined here. This is the shape every bill will eventually take.
const performersRights = buildBill(performersRightsFacts, performersRightsEditorial);

// The fully-written bills come first so they lead the list,
// like in the Figma. The rest are still hand-written in full
// and will move to the synced shape as the rollout continues.
export const bills: Bill[] = [
  performersRights,
  judiciaryBasicLaw,
  ...partialBills,
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
