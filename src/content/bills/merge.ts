// =========================================================
// Joining a bill's two halves into the one shape the UI reads.
// =========================================================
// FACTS come from the sync script and are regenerated on every
// run. EDITORIAL is hand-written and never touched by a script.
// Neither half knows about the other; this file is the only
// place they meet.
//
// The merge rule is simple and worth stating out loud: on every
// field the two halves both have an opinion about, FACTS WIN on
// matters of record ( status, dates, who initiated it, where it
// stands ) and EDITORIAL WINS on matters of presentation ( the
// display name, the summary, the explainers ). That split is
// what lets a nightly sync run without ever damaging writing.

import type { Bill, BillEditorial, BillFacts, StageProgress } from "../types";

// Editorial discussion content is keyed by DATE, so a sync that
// discovers an earlier session cannot shift a summary onto the
// wrong day. Here we hand each synced session whatever content
// was written for its date.
function attachDiscussionContent(
  stages: StageProgress[],
  content: BillEditorial["discussions"],
): StageProgress[] {
  if (!content) return stages;

  return stages.map((stage) => ({
    ...stage,
    discussions: stage.discussions?.map((discussion) => {
      const written = content[discussion.date];
      return written ? { ...discussion, ...written } : discussion;
    }),
  }));
}

export function buildBill(facts: BillFacts, editorial: BillEditorial): Bill {
  return {
    // identity and presentation - editorial owns these
    id: editorial.id,
    name: editorial.name,
    subtitle: editorial.subtitle,
    summary: editorial.summary,
    intro: editorial.intro,
    sections: editorial.sections,
    recentlyUpdated: editorial.recentlyUpdated,

    // matters of record - the sync owns these
    billId: facts.billId,
    type: facts.type,
    committeeId: facts.committeeId,
    initiators: facts.initiators,
    status: facts.status,
    lastUpdated: facts.lastUpdated,
    completedDate: facts.completedDate,
    offPipelineReason: facts.offPipelineReason,

    // the one field built from both
    stages: attachDiscussionContent(facts.stages, editorial.discussions),
  };
}
