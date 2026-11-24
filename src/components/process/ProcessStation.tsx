// One station on the flowchart's spine.
//
// The layout trick is a two-column grid: a narrow "rail" cell
// ( the numbered dot + the line running down to the next
// station ) and the content cell ( the card, and under it the
// entry badge / decision fork when the station has them ).
// Grid columns follow the page's dir, so in this RTL app the
// rail lands on the right and cards open leftward - no
// left / right utilities anywhere.
//
// Pipeline stations ( station.stage is set ) derive their
// title, number and chip text from STAGES - stored nowhere
// else, so the flowchart can never disagree with bill cards.
//
// The details expander is a native <details>: it works without
// JS, and <summary> is keyboard-focusable for free. The page's
// "show all" toggle remounts it via the key prop - between
// toggles the browser owns the open state, and React never
// fights the DOM over it.
import { ChevronDown, Merge } from "lucide-react";
import { Chip } from "@/components/shared/Chip";
import { RichText } from "@/components/shared/RichText";
import { StageChips } from "@/components/bills/StageChips";
import { ProcessDetails } from "@/components/process/ProcessDetails";
import { ProcessFork } from "@/components/process/ProcessFork";
import { STAGES, STAGE_ORDER } from "@/content/stages";
import type { ProcessStation as StationData } from "@/content/legislation-process";
import type { StageProgress } from "@/content/types";
import { cn } from "@/lib/utils";

// The teaching row: the exact StageChips a bill card would show
// while sitting at this station - earlier stages done, this one
// active, the rest not reached. ( It renders the full private
// bill pipeline; government bills would simply miss the first
// chip. )
function stagesAsOf(order: number): StageProgress[] {
  return STAGE_ORDER.map((key) => ({
    stage: key,
    state:
      STAGES[key].order < order
        ? "completed"
        : STAGES[key].order === order
          ? "inProgress"
          : "notReached",
  }));
}

interface ProcessStationProps {
  station: StationData;
  index: number;      // position within the chapter, for chapter-0 numbering
  isLast: boolean;    // hides the rail's tail so the line never dangles
  expandAll: boolean; // the page-level "show all" mode
}

export function ProcessStation({ station, index, isLast, expandAll }: ProcessStationProps) {
  const meta = station.stage ? STAGES[station.stage] : undefined;
  const title = station.title ?? meta?.fullLabel ?? "";
  const number = meta ? meta.order : index + 1;

  return (
    <li className="grid grid-cols-[2rem_1fr] gap-x-4">
      {/* The rail: dot + connecting line. Decorative - the flow
          is already conveyed by the ordered list itself. */}
      <div className="flex flex-col items-center" aria-hidden="true">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-small font-bold",
            meta
              ? "bg-stage-active text-stage-active-foreground"
              : "border-2 border-border bg-muted text-muted-foreground",
          )}
        >
          {number}
        </span>
        {!isLast && <span className="w-0.5 flex-1 bg-border" />}
      </div>

      <div className="min-w-0 space-y-3 pb-8">
        {/* Where governmental and committee bills join the track. */}
        {station.entry && (
          <div className="space-y-1 rounded-xl bg-secondary p-3">
            <p className="flex items-center gap-1.5 text-small font-bold text-secondary-foreground">
              <Merge className="size-4 shrink-0" />
              {station.entry.label}
            </p>
            {station.entry.detail && (
              <p className="text-tiny leading-5 text-secondary-foreground/80">
                {station.entry.detail}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            "space-y-3 rounded-2xl border border-border bg-background p-4",
            // Chapter-0 stations are outside the site's pipeline -
            // dashed border keeps them visibly "before the process".
            !meta && "border-dashed",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-h4 text-primary">{title}</h3>
            {/* The literal chip a card shows at this station, so the
                diagram teaches the site's own vocabulary. */}
            {meta && (
              <span className="flex items-center gap-1.5 text-tiny text-muted-foreground">
                על הכרטיס:
                <Chip variant="stageActive">{meta.shortLabel}</Chip>
              </span>
            )}
          </div>

          <p className="text-p">
            <RichText text={station.summary} />
          </p>

          {station.facts && (
            <ul className="flex flex-wrap gap-1.5">
              {station.facts.map((fact) => (
                <li key={fact.label}>
                  <Chip variant="type">
                    {fact.dir ? <span dir="ltr">{fact.label}</span> : fact.label}
                  </Chip>
                </li>
              ))}
            </ul>
          )}

          {station.details && (
            <details
              key={expandAll ? "open" : "closed"}
              open={expandAll}
              className="group"
            >
              <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-lg text-small font-bold text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">לקרוא עוד</span>
                <span className="hidden group-open:inline">להסתיר</span>
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 space-y-3">
                <ProcessDetails blocks={station.details} />
                {meta && (
                  <div className="space-y-1.5 rounded-xl bg-muted p-3">
                    <p className="text-tiny text-muted-foreground">
                      כך נראית שורת השלבים על כרטיס של הצעה שנמצאת בתחנה הזאת:
                    </p>
                    <StageChips stages={stagesAsOf(meta.order)} />
                  </div>
                )}
              </div>
            </details>
          )}
        </div>

        {station.fork && <ProcessFork fork={station.fork} />}
      </div>
    </li>
  );
}
