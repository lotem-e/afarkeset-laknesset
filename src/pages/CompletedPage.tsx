// חקיקה שהושלמה - bills that became law. The same list recipe
// as the agenda page, with the completed card variant ( the
// periwinkle surface + "תאריך כניסה לספר החוקים" footer ).
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProgressiveBillList } from "@/components/bills/ProgressiveBillList";
import { FiltersDrawer } from "@/components/filters/FiltersDrawer";
import { FilterChips } from "@/components/shared/FilterChips";
import { PageHeader } from "@/components/shared/PageHeader";
import { billsByStatus } from "@/content/bills";
import { committees } from "@/content/committees";
import { headerCounts } from "@/content/stats";
import type { CommitteeId } from "@/content/types";

// Same URL-carried filter as the agenda page - restored on back
// navigation, shareable as a link.
function useCommitteeParam(): [CommitteeId | null, (id: CommitteeId | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("committee");
  const committee = committees.some((c) => c.id === raw) ? (raw as CommitteeId) : null;
  const setCommittee = (id: CommitteeId | null) =>
    setSearchParams(id ? { committee: id } : {}, { replace: true });
  return [committee, setCommittee];
}

export function CompletedPage() {
  const [committee, setCommittee] = useCommitteeParam();
  const [filtersOpen, setFiltersOpen] = useState(false);

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

      <ProgressiveBillList
        bills={visible}
        listKey={`completed:${committee ?? "all"}`}
        emptyMessage="אין חוקים שהושלמו בוועדה הזאת."
      />
    </div>
  );
}
