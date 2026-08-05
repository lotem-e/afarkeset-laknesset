// על סדר היום - the main list of bills in the pipeline.
import { useState } from "react";
import { BillCard } from "@/components/bills/BillCard";
import { FiltersDrawer } from "@/components/filters/FiltersDrawer";
import { FilterChips } from "@/components/shared/FilterChips";
import { PageHeader } from "@/components/shared/PageHeader";
import { billsByStatus } from "@/content/bills";
import { headerCounts } from "@/content/stats";
import { useTracking } from "@/hooks/useTracking";
import type { CommitteeId } from "@/content/types";

export function AgendaPage() {
  // Which committee chip is chosen ( null = "הכל" ).
  const [committee, setCommittee] = useState<CommitteeId | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The shared tracking store ( localStorage-backed ) - the
  // same one the sidebar badge and the tracking page read.
  const { isTracked, toggle } = useTracking();

  const agenda = billsByStatus("agenda");
  const visible = committee === null ? agenda : agenda.filter((b) => b.committeeId === committee);

  return (
    <div className="space-y-8">
      <PageHeader
        title="הצעות חוק על סדר היום"
        count={headerCounts.agenda}
        subtitle="כאן תוכלו למצוא את כל הצעות החוק שנמצאות בשלבים שונים בתהליך החקיקה ועדיין פתוחות לדיון. לא תמצאו כאן הצעות שכבר נפלו או שכבר הפכו לחוק, וגם לא כאלה שרק הוגשו לדיון ראשוני בלי התקדמות נוספת."
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
            אין הצעות חוק בוועדה הזאת כרגע.
          </p>
        )}
      </div>
    </div>
  );
}
