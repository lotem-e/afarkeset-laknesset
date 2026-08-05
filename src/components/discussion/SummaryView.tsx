// תקציר הדיון - the editorial digest: numbered position
// sections, the checked conclusions, and the "what next" line.
import { CheckCircle2, Lightbulb } from "lucide-react";
import type { DiscussionSummary } from "@/content/types";

export function SummaryView({ summary }: { summary: DiscussionSummary }) {
  return (
    <div className="space-y-5">
      <p className="text-small font-bold">עיקרי הדברים:</p>

      {summary.sections.map((section, i) => (
        <section key={i} className="space-y-1.5">
          <p className="text-small font-bold">
            {i + 1}. {section.title}
          </p>
          <ul className="list-disc space-y-1 ps-5">
            {section.bullets.map((b, j) => (
              <li key={j} className="text-small font-normal leading-5">
                {b}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {summary.conclusions && (
        <section className="space-y-1.5 border-t border-dashed border-border pt-4">
          <p className="text-small font-bold">סיכום מסקנות הדיון:</p>
          <ul className="space-y-1.5">
            {summary.conclusions.map((c, i) => (
              <li key={i} className="flex gap-2 text-small font-normal leading-5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-stage-done-foreground" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {summary.nextSteps && (
        <p className="flex gap-2 rounded-xl bg-stage-active p-3 text-small font-normal leading-5 text-stage-active-foreground">
          <Lightbulb className="mt-0.5 size-4 shrink-0" />
          <span>
            <span className="font-bold">המשך התהליך: </span>
            {summary.nextSteps}
          </span>
        </p>
      )}
    </div>
  );
}
