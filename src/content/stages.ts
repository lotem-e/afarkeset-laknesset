// =========================================================
// The pipeline metadata + the one labeling rule.
// =========================================================
// Everything the UI needs to KNOW about the five stages lives
// here, so components stay dumb: they map over a bill's stages
// and ask this file what to show.

import type { StageKey, StageProgress } from "./types";

interface StageMeta {
  order: number;       // position in the pipeline, 1..5
  fullLabel: string;   // accordion title on the bill page
  shortLabel: string;  // card chip when there is nothing else to say
  isPrep: boolean;     // preparation ( committee ) stage vs a reading ( vote )
}

export const STAGES: Record<StageKey, StageMeta> = {
  preliminary:     { order: 1, fullLabel: "קריאה טרומית",                 shortLabel: "טרומית",         isPrep: false },
  firstPrep:       { order: 2, fullLabel: "הכנה לקריאה ראשונה",           shortLabel: "בהכנה בועדה",    isPrep: true },
  first:           { order: 3, fullLabel: "קריאה ראשונה",                 shortLabel: "ראשונה",         isPrep: false },
  secondThirdPrep: { order: 4, fullLabel: "הכנה לקריאות שנייה ושלישית",   shortLabel: "בהכנה בועדה",    isPrep: true },
  secondThird:     { order: 5, fullLabel: "קריאות שנייה ושלישית",         shortLabel: "שנייה ושלישית",  isPrep: false },
};

// The full pipeline in order - used when a component needs all
// five stations ( the bill-page accordion shows even stages the
// bill has not reached ).
export const STAGE_ORDER: StageKey[] = [
  "preliminary", "firstPrep", "first", "secondThirdPrep", "secondThird",
];

// Hebrew count phrase: 1 -> "דיון אחד", n -> "N דיונים".
export function discussionsLabel(count: number): string {
  return count === 1 ? "דיון אחד" : `${count} דיונים`;
}

// The chip label rule ( one place, used by every card ):
// - a preparation stage WITH discussions says how many,
// - a preparation stage without them says "בהכנה בועדה",
// - a reading stage always shows its short name.
export function stageChipLabel(p: StageProgress): string {
  const meta = STAGES[p.stage];
  if (meta.isPrep && p.discussions && p.discussions.length > 0) {
    return discussionsLabel(p.discussions.length);
  }
  return meta.shortLabel;
}

// The last stage the bill actually touched ( completed or in
// progress ) - useful for stats and sorting.
export function currentStage(stages: StageProgress[]): StageKey | undefined {
  const reached = stages.filter((s) => s.state !== "notReached");
  return reached.length > 0 ? reached[reached.length - 1].stage : undefined;
}
