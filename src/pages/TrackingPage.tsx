// מעקב החקיקה שלי - the bills the user follows.
// Everything on this page DERIVES from two sources: the bills
// data and the tracked-ids store. No number here is hardcoded -
// unlike the illustrative totals elsewhere, this page is real.
import { useState } from "react";
import { Link } from "react-router-dom";
import { BillCard } from "@/components/bills/BillCard";
import { CountTabs } from "@/components/shared/CountTabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { bills } from "@/content/bills";
import { useTracking } from "@/hooks/useTracking";
import type { Bill } from "@/content/types";

const TABS = [
  { key: "all", label: "הכל" },
  { key: "updated", label: "עודכנו לאחרונה" },
  { key: "agenda", label: "על סדר היום" },
  { key: "completed", label: "החקיקה הושלמה" },
  { key: "dropped", label: "ירדו מסדר היום" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// One place decides what belongs to each tab.
function matchesTab(bill: Bill, tab: TabKey): boolean {
  switch (tab) {
    case "all":
      return true;
    case "updated":
      return bill.recentlyUpdated === true;
    case "agenda":
      return bill.status === "agenda";
    case "completed":
      return bill.status === "completed";
    case "dropped":
      return bill.status === "dropped";
  }
}

export function TrackingPage() {
  const { trackedIds, isTracked, toggle } = useTracking();
  const [tab, setTab] = useState<TabKey>("all");

  const tracked = bills.filter((b) => trackedIds.includes(b.id));
  const visible = tracked.filter((b) => matchesTab(b, tab));

  return (
    <div className="space-y-8">
      <PageHeader
        title="מעקב החקיקה שלי"
        count={tracked.length}
        subtitle="כאן תוכלו לעקוב בקלות אחר כל הצעות החוק שנרשמתם אליהן."
      />

      {tracked.length === 0 ? (
        <EmptyState
          title="עוד לא נרשמתם לעדכונים על אף הצעת חוק."
          action={
            <Link to="/" className="text-p text-accent underline underline-offset-4">
              לכל הצעות החוק על סדר היום
            </Link>
          }
        />
      ) : (
        <>
          <CountTabs
            tabs={TABS.map((t) => ({
              ...t,
              count: tracked.filter((b) => matchesTab(b, t.key)).length,
            }))}
            value={tab}
            onChange={(k) => setTab(k as TabKey)}
          />

          <div className="space-y-6">
            {visible.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                subscribed={isTracked(bill.id)}
                onToggleSubscribe={() => toggle(bill.id)}
                showRibbon={bill.recentlyUpdated}
              />
            ))}
            {visible.length === 0 && (
              <EmptyState title="אין הצעות חוק במעקב בקטגוריה הזאת." />
            )}
          </div>
        </>
      )}
    </div>
  );
}
