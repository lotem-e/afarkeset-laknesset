// The flowchart itself: chapters of stations along one spine.
//
// Semantically this is just headings + ordered lists - the
// "diagram" is entirely CSS on top of real, readable text, so
// screen readers and find-in-page get the same story sighted
// users do.
//
// The pipeline chapter also gets the color legend ( the three
// state chips used all over the site ) and the outcome end cap
// ( "a law is born" ) as the final list item, which is why the
// last pipeline station keeps its connecting line.
import { Check } from "lucide-react";
import { Chip } from "@/components/shared/Chip";
import { ProcessStation } from "@/components/process/ProcessStation";
import type { ProcessChapter } from "@/content/legislation-process";

export function ProcessFlow({ chapters, expandAll }: { chapters: ProcessChapter[]; expandAll: boolean }) {
  return (
    <div className="space-y-6">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-h4 text-primary">{chapter.title}</h2>
            {chapter.intro && (
              <p className="text-p text-muted-foreground">{chapter.intro}</p>
            )}
          </div>

          {/* The legend belongs to the pipeline chapter - these are
              the exact three states bill cards paint their chips with. */}
          {chapter.id === "pipeline" && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-small text-muted-foreground">
              <span>מקרא - כך נצבעים השלבים על כרטיסי ההצעות:</span>
              <Chip variant="stageDone">שלב שהושלם</Chip>
              <Chip variant="stageActive">השלב הנוכחי</Chip>
              <Chip variant="stagePending">שלב שטרם הגיע</Chip>
            </div>
          )}

          <ol>
            {chapter.stations.map((station, i) => (
              <ProcessStation
                key={station.id}
                station={station}
                index={i}
                isLast={!chapter.outcome && i === chapter.stations.length - 1}
                expandAll={expandAll}
              />
            ))}

            {chapter.outcome && (
              <li className="grid grid-cols-[2rem_1fr] gap-x-4">
                <div className="flex justify-center" aria-hidden="true">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stage-done text-stage-done-foreground">
                    <Check className="size-4" />
                  </span>
                </div>
                <div className="min-w-0 space-y-1 pt-1">
                  <h3 className="text-h4 text-primary">{chapter.outcome.title}</h3>
                  <p className="text-p">{chapter.outcome.summary}</p>
                </div>
              </li>
            )}
          </ol>
        </div>
      ))}
    </div>
  );
}
