// The pipeline as stacked accordion rows in the side rail.
// Each row's color is its state ( the same three tokens the
// card chips use ); rows with content ( a vote or discussions )
// open, future stages sit quietly in gray.
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { discussionsLabel, STAGES } from "@/content/stages";
import type { StageProgress } from "@/content/types";
import { cn } from "@/lib/utils";
import { DiscussionTiles } from "./DiscussionTiles";
import { VoteResults } from "./VoteResults";

const HEADER_BY_STATE = {
  completed: "bg-stage-done text-stage-done-foreground",
  inProgress: "bg-stage-active text-stage-active-foreground",
  notReached: "bg-stage-pending text-stage-pending-foreground",
} as const;

interface StageRowProps {
  progress: StageProgress;
  defaultOpen: boolean;
  billId: string;
  // How many discussions the bill had BEFORE this stage - keeps
  // the tile links numbered across the whole bill.
  discussionOffset: number;
}

function StageRow({ progress, defaultOpen, billId, discussionOffset }: StageRowProps) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = STAGES[progress.stage];
  const expandable = Boolean(progress.vote || progress.discussions?.length);

  return (
    <div className="overflow-hidden rounded-xl">
      <button
        onClick={() => expandable && setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between gap-2 px-4 py-2.5 text-small font-bold",
          HEADER_BY_STATE[progress.state],
          !expandable && "cursor-default",
        )}
      >
        <span className="flex flex-wrap items-center gap-x-2 text-start">
          <span>{meta.fullLabel}</span>
          {progress.vote && (
            // The short score, left-to-right: "23 / 0"
            <span className="font-normal" dir="ltr">
              | {progress.vote.inFavor} / {progress.vote.against}
            </span>
          )}
          {progress.discussions && progress.discussions.length > 0 && (
            <span className="font-normal">| {discussionsLabel(progress.discussions.length)}</span>
          )}
        </span>
        {expandable && (
          <ChevronDown className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")} />
        )}
      </button>

      {expandable && open && (
        <div className="space-y-3 bg-popover/60 p-4">
          {progress.vote && <VoteResults vote={progress.vote} />}
          {progress.discussions && progress.discussions.length > 0 && (
            <DiscussionTiles
              discussions={progress.discussions}
              billId={billId}
              startIndex={discussionOffset}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function StageAccordion({ stages, billId }: { stages: StageProgress[]; billId: string }) {
  // Walk the stages once, remembering how many discussions came
  // before each - the running count numbers the tiles.
  let seen = 0;
  return (
    <div className="space-y-2">
      {stages.map((p) => {
        const offset = seen;
        seen += p.discussions?.length ?? 0;
        return (
          <StageRow
            key={p.stage}
            progress={p}
            // The stage happening NOW greets you open.
            defaultOpen={p.state === "inProgress"}
            billId={billId}
            discussionOffset={offset}
          />
        );
      })}
    </div>
  );
}
