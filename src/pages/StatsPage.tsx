// סטטיסטיקות - the hemicycle + the bar lists.
// The numbers here are the design's illustrative aggregates
// from content/stats.ts ( see the note there ); the seat map
// is real - it derives from parties.ts.
import { BarList } from "@/components/stats/BarList";
import { Hemicycle } from "@/components/stats/Hemicycle";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  billsPerCommittee,
  billsPerParty,
  billsPerStatus,
  blocCounts,
  headerCounts,
  topInitiators,
} from "@/content/stats";

// A single headline number with its label - for the "who
// submits" trio a stat tile says it louder than any chart.
function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex-1 rounded-3xl bg-popover p-6 text-center shadow-sm">
      <p className="text-h1 text-primary">{value}</p>
      <p className="text-small font-normal text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="סטטיסטיקות"
        count={headerCounts.stats}
        subtitle="עמוד זה מציג תמונת מצב של החקיקה בכנסת הנוכחית: מי יושב במשכן, מי מגיש הצעות, אילו ועדות עמוסות ואיפה עומדות ההצעות."
      />

      <section className="space-y-4 rounded-3xl bg-popover p-6 shadow-sm">
        <h2 className="text-h4 text-primary">הרכב הכנסת ה-25</h2>
        <Hemicycle />
      </section>

      <section className="space-y-3">
        <h2 className="text-h4 text-primary">מי מגיש את הצעות החוק?</h2>
        <div className="flex gap-4">
          <StatTile value={blocCounts.coalition} label="הצעות של חברי קואליציה" />
          <StatTile value={blocCounts.opposition} label="הצעות של חברי אופוזיציה" />
          <StatTile value={blocCounts.collaborations} label="שיתופי פעולה" />
        </div>
      </section>

      <div className="grid grid-cols-2 items-start gap-4">
        <BarList title="הצעות חוק לפי ועדה מטפלת" items={billsPerCommittee} />
        <div className="space-y-4">
          <BarList title="סטטוס הצעות החוק" items={billsPerStatus} />
          <BarList title="שיוך מפלגתי של מגישי ההצעות" items={billsPerParty} />
        </div>
        <BarList title="חברי הכנסת שמגישים הכי הרבה" items={topInitiators} />
      </div>
    </div>
  );
}
