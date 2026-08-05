// The pipeline row on a bill card. It just maps the bill's
// stages array - the ONE source of truth - to chips. In an RTL
// page a flex row lays items right-to-left, so pipeline order
// works with no extra logic.
import { Chip } from "@/components/shared/Chip";
import { stageChipLabel } from "@/content/stages";
import type { StageProgress, StageState } from "@/content/types";

const VARIANT_BY_STATE: Record<StageState, "stageDone" | "stageActive" | "stagePending"> = {
  completed: "stageDone",
  inProgress: "stageActive",
  notReached: "stagePending",
};

export function StageChips({ stages }: { stages: StageProgress[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {stages.map((s) => (
        <Chip key={s.stage} variant={VARIANT_BY_STATE[s.state]}>
          {stageChipLabel(s)}
        </Chip>
      ))}
    </div>
  );
}
