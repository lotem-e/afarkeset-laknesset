// על סדר היום - the main list of bills in the pipeline.
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

// The chosen committee lives in the URL ( ?committee=economy ),
// not in component state: coming BACK from a bill page restores
// it for free, and a filtered view is shareable as a link.
function useCommitteeParam(): [CommitteeId | null, (id: CommitteeId | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("committee");
  const committee = committees.some((c) => c.id === raw) ? (raw as CommitteeId) : null;
  const setCommittee = (id: CommitteeId | null) =>
    setSearchParams(id ? { committee: id } : {}, { replace: true });
  return [committee, setCommittee];
}

export function AgendaPage() {
  const [committee, setCommittee] = useCommitteeParam();
  const [filtersOpen, setFiltersOpen] = useState(false);

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

      <ProgressiveBillList
        bills={visible}
        listKey={`agenda:${committee ?? "all"}`}
        emptyMessage="אין הצעות חוק בוועדה הזאת כרגע."
      />
    </div>
  );
}
