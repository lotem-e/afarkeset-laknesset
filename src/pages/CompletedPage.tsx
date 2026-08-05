// חקיקה שהושלמה - bills that became law. The same list recipe
// as the agenda page, with the completed card variant ( the
// periwinkle surface + "תאריך כניסה לספר החוקים" footer ).
import { useState } from "react";
import { BillCard } from "@/components/bills/BillCard";
import { FiltersDrawer } from "@/components/filters/FiltersDrawer";
import { FilterChips } from "@/components/shared/FilterChips";
import { PageHeader } from "@/components/shared/PageHeader";
import { billsByStatus } from "@/content/bills";
import { headerCounts } from "@/content/stats";
import { useTracking } from "@/hooks/useTracking";
import type { CommitteeId } from "@/content/types";

export function CompletedPage() {
  const [committee, setCommittee] = useState<CommitteeId | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { isTracked, toggle } = useTracking();

  const completed = billsByStatus("completed");
  const visible =
    committee === null ? completed : completed.filter((b) => b.committeeId === committee);

  return (
    <div className="space-y-8">
      <PageHeader
        title="חקיקה שהושלמה"
        count={headerCounts.completed}
        subtitle="כאן מוצגים כל החוקים שעברו בהצלחה בכנסת הנוכחית והפכו לחלק מספר החוקים של ישראל. זה המקום לראות אילו הצעות חוק צלחו את כל שלבי החקיקה."
      />

      <FilterChips
        value={committee}
        onChange={setCommittee}
        onOpenFilters={() => setFiltersOpen(true)}
      />
      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        committee={committee}
        onSelectCommittee={setCommittee}
      />

      <div className="space-y-6">
        {visible.map((bill) => (
          <BillCard
            key={bill.id}
            bill={bill}
            subscribed={isTracked(bill.id)}
            onToggleSubscribe={() => toggle(bill.id)}
          />
        ))}
        {visible.length === 0 && (
          <p className="py-10 text-center text-p text-muted-foreground">
            אין חוקים שהושלמו בוועדה הזאת.
          </p>
        )}
      </div>
    </div>
  );
}
