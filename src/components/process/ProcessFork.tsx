// The pass / fail split drawn under a plenum-vote station.
// Green text flows on ( the spine continues right below it );
// the red tag is the dead end. Color is never alone - both arms
// carry an icon and a full label.
import { Check, X } from "lucide-react";
import type { DecisionFork } from "@/content/legislation-process";

export function ProcessFork({ fork }: { fork: DecisionFork }) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="inline-flex items-center gap-1.5 text-small font-bold text-stage-done-foreground">
          <Check className="size-4 shrink-0" />
          {fork.passLabel}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-destructive/10 px-2.5 py-1 text-small text-destructive">
          <X className="size-4 shrink-0" />
          {fork.failLabel}
        </span>
      </div>
      {fork.failNote && (
        <p className="text-tiny text-muted-foreground">{fork.failNote}</p>
      )}
    </div>
  );
}
