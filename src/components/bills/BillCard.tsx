// THE central component - one bill as a card.
//
// Anatomy ( RTL: main content sits on the right, the leader
// rail on the left, past a thin divider ):
//   title -> type + committee row -> summary -> stage chips ->
//   footer ( last update + follow )
//
// The card has two surfaces, decided by the bill itself:
//   agenda / dropped -> warm cream ( --card )
//   completed        -> periwinkle ( --card-completed ) and the
//                       footer swaps to "תאריך כניסה לספר החוקים".
import { Link } from "react-router-dom";
import { Chip } from "@/components/shared/Chip";
import { getCommittee } from "@/content/committees";
import { relativeLabel } from "@/lib/dates";
import type { Bill, BillType } from "@/content/types";
import { cn } from "@/lib/utils";
import { COMMITTEE_ICONS } from "./committee-icons";
import { InitiatorRail } from "./InitiatorRail";
import { StageChips } from "./StageChips";
import { SubscribeButton } from "./SubscribeButton";

const TYPE_LABEL: Record<BillType, string> = {
  private: "הצעת חוק פרטית",
  governmental: "הצעת חוק ממשלתית",
  committee: "הצעת חוק הועדה",
};

interface BillCardProps {
  bill: Bill;
  subscribed: boolean;
  onToggleSubscribe: () => void;
  // The "התעדכן לאחרונה" corner ribbon - the tracking page asks
  // for it on recently-updated bills.
  showRibbon?: boolean;
}

export function BillCard({ bill, subscribed, onToggleSubscribe, showRibbon }: BillCardProps) {
  // A bill that departed before a committee was assigned has none.
  const committee = bill.committeeId ? getCommittee(bill.committeeId) : null;
  const CommitteeIcon = bill.committeeId ? COMMITTEE_ICONS[bill.committeeId] : null;
  const completed = bill.status === "completed";

  return (
    <article
      className={cn(
        "relative flex gap-6 rounded-3xl p-7",
        completed ? "bg-card-completed" : "bg-card",
      )}
    >
      {showRibbon && (
        <span className="absolute -top-3 end-8 rounded-md bg-ribbon px-2.5 py-1 text-tiny font-bold text-ribbon-foreground">
          התעדכן לאחרונה
        </span>
      )}

      {/* Main content */}
      <div className="min-w-0 flex-1 space-y-3.5">
        {/* The whole title is the link into the bill page. */}
        <Link to={`/bill/${bill.id}`} className="block hover:opacity-80">
          <h3 className="text-h3 text-primary">
            {bill.name}
            {bill.subtitle && (
              <>
                : <span className="font-normal">{bill.subtitle}</span>
              </>
            )}
          </h3>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <Chip variant="type">{TYPE_LABEL[bill.type]}</Chip>
          {committee && CommitteeIcon && (
            <span className="flex items-center gap-1.5 text-small">
              <span className="font-bold">ועדה מטפלת:</span>
              <span>{committee.shortName}</span>
              <CommitteeIcon className="size-4 text-primary" />
            </span>
          )}
        </div>

        {bill.summaryIsOfficial && (
          <p className="text-tiny font-medium text-muted-foreground">התקציר הרשמי של הכנסת:</p>
        )}
        <p className="text-small font-normal leading-6 text-foreground">{bill.summary}</p>

        <StageChips stages={bill.stages} />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
          {completed && bill.completedDate ? (
            <p className="text-small font-normal">
              <span className="font-bold">תאריך כניסה לספר החוקים: </span>
              {relativeLabel(bill.completedDate)}
            </p>
          ) : (
            <>
              <p className="text-small font-normal">
                <span className="font-bold">עדכון אחרון: </span>
                {relativeLabel(bill.lastUpdated)}
              </p>
              <span className="text-border">|</span>
              <SubscribeButton subscribed={subscribed} onToggle={onToggleSubscribe} />
            </>
          )}
        </div>
      </div>

      {/* Leader rail, past a thin divider */}
      <div className="w-px shrink-0 self-stretch bg-border/70" />
      <InitiatorRail initiators={bill.initiators.slice(0, 1)} />
    </article>
  );
}
