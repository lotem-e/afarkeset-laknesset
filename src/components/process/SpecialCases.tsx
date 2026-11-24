// The "מקרים מיוחדים" stack - procedural tools that sit beside
// the main track ( merges, continuity, revisions... ). Each row
// is the same native <details> expander the stations use: title
// and one-line teaser always visible, the fuller story behind a
// click. The key prop remounts every row when the page-level
// "show all" mode flips - see ProcessStation for the why.
import { ChevronDown } from "lucide-react";
import { ProcessDetails } from "@/components/process/ProcessDetails";
import type { SpecialCase } from "@/content/legislation-process";

export function SpecialCases({ cases, expandAll }: { cases: SpecialCase[]; expandAll: boolean }) {
  return (
    <div className="space-y-2">
      {cases.map((specialCase) => (
        <details
          key={`${specialCase.id}-${expandAll ? "open" : "closed"}`}
          open={expandAll}
          className="group rounded-xl border border-border bg-background"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0">
              <h3 className="text-p font-bold text-primary">{specialCase.title}</h3>
              <span className="block text-small font-normal text-muted-foreground">
                {specialCase.summary}
              </span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t border-border px-4 py-3">
            <ProcessDetails blocks={specialCase.details} />
          </div>
        </details>
      ))}
    </div>
  );
}
