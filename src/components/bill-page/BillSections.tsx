// The editorial body of the bill page, in one canonical order.
// Every section is optional in the data; this renderer decides
// what appears, in what order, and which missing sections still
// show ( as the "עיזרו לנו להשלים" empty state ).
import type { ReactNode } from "react";
import { AmendmentCarousel } from "@/components/bill-page/AmendmentCarousel";
import { RichText } from "@/components/shared/RichText";
import { Button } from "@/components/ui/button";
import type { Bill, TextBlock } from "@/content/types";

// A section = navy title + content. Small local helper.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-h4 text-primary">{title}</h2>
      {children}
    </section>
  );
}

// Renders a TextBlock's three optional pieces in order.
function TextBlockView({ block }: { block: TextBlock }) {
  return (
    <div className="space-y-3 text-p font-normal">
      {block.intro && (
        <p>
          <RichText text={block.intro} />
        </p>
      )}
      {block.bullets && (
        <ul className="list-disc space-y-1.5 ps-6">
          {block.bullets.map((b, i) => (
            <li key={i}>
              <RichText text={b} />
            </li>
          ))}
        </ul>
      )}
      {block.paragraphs?.map((p, i) => (
        <p key={i}>
          <RichText text={p} />
        </p>
      ))}
    </div>
  );
}

// The small inline empty state: "אין נתונים. עיזרו לנו להשלים"
function MissingData() {
  return (
    <p className="text-p font-normal text-muted-foreground">
      אין נתונים.{" "}
      <button className="text-accent underline underline-offset-4">עיזרו לנו להשלים</button>
    </p>
  );
}

export function BillSections({ bill }: { bill: Bill }) {
  const s = bill.sections;
  if (!s) return null;

  return (
    <div className="space-y-9">
      {s.background && (
        <Section title={`רקע: מה זה בכלל "${bill.name}"?`}>
          <TextBlockView block={s.background} />
        </Section>
      )}

      {s.explanation && (
        <Section title="הסבר על הצעת החוק">
          <TextBlockView block={s.explanation} />
        </Section>
      )}

      {s.whatChanges && (
        <Section title="מה מבקשת הכנסת לשנות עכשיו?">
          <div className="space-y-3 text-p font-normal">
            {s.whatChanges.intro && <p>{s.whatChanges.intro}</p>}
            <ol className="list-decimal space-y-1.5 ps-6">
              {s.whatChanges.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ol>
          </div>
        </Section>
      )}

      {s.amendments && s.amendments.length > 0 && (
        <Section title="עיקרי התיקונים בחוק">
          <div className="space-y-4">
            <AmendmentCarousel amendments={s.amendments} />
            {/* The full legal text is post-MVP - the button is
                the design's promise of it. */}
            <div className="flex justify-center">
              <Button variant="outline" className="rounded-full" title="בקרוב">
                לכל התיקונים והחוק המלא
              </Button>
            </div>
          </div>
        </Section>
      )}

      {s.objections && (
        <Section title="התנגדויות">
          <ul className="list-disc space-y-2 ps-6 text-p font-normal">
            {s.objections.map((o, i) => (
              <li key={i}>
                <RichText text={o} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {s.comparative && (
        <Section title="משפט השוואתי">
          <TextBlockView block={s.comparative} />
        </Section>
      )}

      {/* Budget and history always render - when the data is
          missing, they ASK for it instead of hiding. */}
      <Section title="תקצוב ומימון">
        {s.budget ? <TextBlockView block={s.budget} /> : <MissingData />}
      </Section>

      <Section title="בראייה היסטורית">
        {s.historical ? <TextBlockView block={s.historical} /> : <MissingData />}
      </Section>

      {s.process && (
        <Section title="על ההליך">
          <p className="text-p font-normal">
            <RichText text={s.process} />
          </p>
        </Section>
      )}

      {s.applicability && (
        <Section title="תחולה">
          <p className="text-p font-normal">
            <RichText text={s.applicability} />
          </p>
        </Section>
      )}
    </div>
  );
}
