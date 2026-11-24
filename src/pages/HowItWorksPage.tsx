// The "חדשים במשכן?" page - the site's orientation stop for
// first-time visitors. Its centerpiece is the legislation
// flowchart ( see src/content/legislation-process.ts for the
// content and its source ), followed by the special-cases
// stack and a source-citation line.
//
// The one piece of state is the "show all" mode: it flips every
// expander on the page between collapsed and open, for people
// who prefer to read ( or print ) everything in one pass.
//
// The page is built as stacked sections on purpose - the
// planned plain-language glossary of Knesset statuses will
// slot in as another <section> later, nothing here moves.
import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ProcessFlow } from "@/components/process/ProcessFlow";
import { SpecialCases } from "@/components/process/SpecialCases";
import {
  PROCESS_CHAPTERS,
  PROCESS_SOURCE,
  SPECIAL_CASES,
} from "@/content/legislation-process";

export function HowItWorksPage() {
  const [expandAll, setExpandAll] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="חדשים במשכן?"
        subtitle="איך רעיון הופך לחוק במדינת ישראל? כל המסלול, תחנה אחר תחנה, לפי תקנון הכנסת - בשפה פשוטה."
      />

      <section className="space-y-6 rounded-3xl bg-popover p-6 shadow-sm">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            aria-pressed={expandAll}
            onClick={() => setExpandAll((open) => !open)}
          >
            {expandAll ? "תצוגה מקוצרת" : "להציג הכל"}
          </Button>
        </div>
        <div className="max-w-3xl">
          <ProcessFlow chapters={PROCESS_CHAPTERS} expandAll={expandAll} />
        </div>
      </section>

      <section className="space-y-4 rounded-3xl bg-popover p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-h4 text-primary">מקרים מיוחדים</h2>
          <p className="text-p text-muted-foreground">
            חמישה כלים פרוצדורליים שצצים שוב ושוב בדיוני הוועדות - שווה להכיר אותם.
          </p>
        </div>
        <div className="max-w-3xl">
          <SpecialCases cases={SPECIAL_CASES} expandAll={expandAll} />
        </div>
      </section>

      <footer className="text-tiny text-muted-foreground">
        המקור: ״{PROCESS_SOURCE.title}״, {PROCESS_SOURCE.publisher},{" "}
        {PROCESS_SOURCE.date}. {PROCESS_SOURCE.note}
      </footer>
    </div>
  );
}
