// The bill page's meta rail ( the left column in RTL ):
// last update + follow, the bill's type, who leads it, the
// handling committee, and the stage accordion. Dashed lines
// separate the groups, like the design.
import { Chip } from "@/components/shared/Chip";
import { InitiatorRail } from "@/components/bills/InitiatorRail";
import { SubscribeButton } from "@/components/bills/SubscribeButton";
import { COMMITTEE_ICONS } from "@/components/bills/committee-icons";
import { getCommittee } from "@/content/committees";
import { useTracking } from "@/hooks/useTracking";
import { relativeLabel } from "@/lib/dates";
import type { Bill, BillType } from "@/content/types";
import { StageAccordion } from "./StageAccordion";

const TYPE_LABEL: Record<BillType, string> = {
  private: "הצעת חוק פרטית",
  governmental: "הצעת חוק ממשלתית",
  committee: "הצעת חוק הועדה",
};

function RailDivider() {
  return <hr className="border-t border-dashed border-border" />;
}

export function BillSideRail({ bill }: { bill: Bill }) {
  const { isTracked, toggle } = useTracking();
  // A bill that departed before a committee was assigned has none.
  const committee = bill.committeeId ? getCommittee(bill.committeeId) : null;
  const CommitteeIcon = bill.committeeId ? COMMITTEE_ICONS[bill.committeeId] : null;

  return (
    <aside className="w-80 shrink-0 space-y-5">
      <div className="space-y-3">
        <p className="text-small font-normal">
          <span className="font-bold">עדכון אחרון: </span>
          {relativeLabel(bill.lastUpdated)}
        </p>
        <SubscribeButton subscribed={isTracked(bill.id)} onToggle={() => toggle(bill.id)} />
      </div>

      <RailDivider />

      <Chip variant="type">{TYPE_LABEL[bill.type]}</Chip>

      <RailDivider />

      {/* The bill page introduces the whole leading team. */}
      <InitiatorRail initiators={bill.initiators.slice(0, 3)} />

      <RailDivider />

      {committee && CommitteeIcon && (
        <>
          <p className="flex flex-wrap items-center gap-1.5 text-small">
            <span className="font-bold">ועדה מטפלת:</span>
            {/* An ad-hoc joint committee shows its full official
                name here - the one place with room for it. */}
            <span>{bill.committeeName ?? committee.shortName}</span>
            <CommitteeIcon className="size-4 shrink-0 text-primary" />
          </p>

          <RailDivider />
        </>
      )}

      <StageAccordion stages={bill.stages} billId={bill.id} />
    </aside>
  );
}
