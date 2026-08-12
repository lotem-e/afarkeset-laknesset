// =========================================================
// The stage derivation - shared by sync-bill and sync-all.
// =========================================================
// The API stores a bill's CURRENT status only; the pipeline is
// derived from history. Plenum appearances give the milestones,
// and a committee session belongs to whichever preparation stage
// the readings around it define: before the first reading it is
// first-reading prep, after it - second-third prep. Proven by
// the spike on bill 2203845 ( see SYNC-PLAN §2 ).
import { STAGE_ORDER, STATUS_PASSED, stageForStatus, stageIndex } from "./status-map.mjs";

export function deriveStages(milestones, discussions, currentStatusId) {
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

// The date a passed bill became law: its LAST appearance at the
// final station. The last, not the first - a bill can be tabled
// for its final readings, freeze for two years, and pass only
// on a later appearance ( bill 2201200: tabled 2023-03-27,
// passed 2025 ). Using the first appearance showed the freeze
// date as the completion date.
export function completedDateOf(milestones, currentStatusId) {
  if (currentStatusId !== STATUS_PASSED) return undefined;
  let last;
  for (const m of milestones) {
    if (m.stage === "secondThird") last = m.date;
  }
  return last;
}
