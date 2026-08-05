// חלון הפילטרים - the dark navy window the "פילטרים" button
// opens, straight from the Figma: a search field, a tab rail
// on the right, and the chosen tab's content on the left.
//
// What is real vs. informational in the MVP:
// - ועדות: clicking a committee APPLIES it as the page filter.
// - הצעות חוק חמות עכשיו: clicking a bill navigates to it.
// - the search box narrows whichever list is on screen.
// - סטטוס / חברי כנסת / מפלגות / קואליציה: display-only for
//   now ( their numbers are the design's illustrative ones ).
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  Building2,
  Flag,
  Flame,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import { bills } from "@/content/bills";
import { committees } from "@/content/committees";
import {
  billsPerCommittee,
  billsPerParty,
  billsPerStatus,
  blocCounts,
  hotBillIds,
  topInitiators,
} from "@/content/stats";
import type { Bill, CommitteeId, StageState } from "@/content/types";
import { cn } from "@/lib/utils";

type TabKey = "hot" | "committees" | "status" | "mks" | "parties" | "bloc";

const TABS: { key: TabKey; label: string; icon: typeof Flame }[] = [
  { key: "hot", label: "הצעות חוק חמות עכשיו", icon: Flame },
  { key: "committees", label: "ועדות", icon: Building2 },
  { key: "status", label: "סטטוס", icon: Flag },
  { key: "mks", label: "חברי כנסת", icon: User },
  { key: "parties", label: "מפלגות", icon: Users },
  { key: "bloc", label: "קואליציה / אופוזיציה", icon: ArrowLeftRight },
];

// The five little pipeline dots on hot-bill and status cards.
const DOT_BY_STATE: Record<StageState, string> = {
  completed: "bg-[var(--green-200)]",
  inProgress: "bg-[var(--yellow-100)]",
  notReached: "bg-white/25",
};

function StageDots({ bill }: { bill: Bill }) {
  return (
    <div className="flex gap-1">
      {bill.stages.map((s) => (
        <span key={s.stage} className={cn("size-1.5 rounded-full", DOT_BY_STATE[s.state])} />
      ))}
    </div>
  );
}

interface FiltersDrawerProps {
  open: boolean;
  onClose: () => void;
  committee: CommitteeId | null;
  onSelectCommittee: (id: CommitteeId | null) => void;
}

export function FiltersDrawer({ open, onClose, committee, onSelectCommittee }: FiltersDrawerProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("hot");
  const [query, setQuery] = useState("");

  // Escape closes; while the window is open the page behind it
  // must not scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const q = query.trim();
  const matches = (label: string) => !q || label.includes(q);
  const hotBills = useMemo(
    () => hotBillIds.map((id) => bills.find((b) => b.id === id)!).filter(Boolean),
    [],
  );

  if (!open) return null;

  return (
    // The dark backdrop - clicking it closes the window.
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      {/* stopPropagation: clicks INSIDE the window must not
          reach the backdrop and close it. */}
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="פילטרים"
      >
        {/* Search + close */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5">
            <Search className="size-4 text-white/60" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="נושא, ועדה, חברי כנסת או מפלגה..."
              className="w-full bg-transparent text-small font-normal text-white outline-none placeholder:text-white/60"
            />
          </div>
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10"
            aria-label="סגירה"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 flex min-h-0 flex-1 gap-6">
          {/* Tab rail ( right side in RTL ) */}
          <nav className="w-56 shrink-0 space-y-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-small transition-colors",
                  tab === key
                    ? "bg-white/15 font-bold text-white"
                    : "font-normal text-white/75 hover:bg-white/5 hover:text-white",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="text-start">{label}</span>
              </button>
            ))}
          </nav>

          {/* Tab content */}
          <div className="min-w-0 flex-1 overflow-y-auto pe-1">
            {tab === "hot" && (
              <div className="space-y-3">
                {hotBills
                  .filter((b) => matches(b.name + " " + (b.subtitle ?? "")))
                  .map((bill) => (
                    <button
                      key={bill.id}
                      onClick={() => {
                        onClose();
                        navigate(`/bill/${bill.id}`);
                      }}
                      className="w-full space-y-2 rounded-xl bg-white/10 p-4 text-start transition-colors hover:bg-white/15"
                    >
                      <StageDots bill={bill} />
                      <p className="text-small font-bold leading-5">
                        {bill.name}
                        {bill.subtitle ? `: ${bill.subtitle}` : ""}
                      </p>
                      <p className="line-clamp-2 text-tiny font-normal leading-4 text-white/70">
                        {bill.summary}
                      </p>
                    </button>
                  ))}
              </div>
            )}

            {tab === "committees" && (
              <div className="space-y-1">
                {billsPerCommittee
                  .filter((c) => matches(c.label))
                  .map((row) => {
                    const match = committees.find((c) => c.shortName === row.label);
                    const active = match ? committee === match.id : false;
                    return (
                      <button
                        key={row.label}
                        onClick={() => {
                          if (!match) return;
                          // Choosing the active committee again clears it.
                          onSelectCommittee(active ? null : match.id);
                          onClose();
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-small transition-colors",
                          active
                            ? "bg-white/15 font-bold text-white"
                            : "font-normal text-white/85 hover:bg-white/5",
                        )}
                      >
                        <span>{row.label}</span>
                        <span className="text-white/60">{row.count}</span>
                      </button>
                    );
                  })}
                <p className="pt-3 text-tiny text-white/50">
                  בחירת ועדה מסננת את רשימת ההצעות בעמוד.
                </p>
              </div>
            )}

            {tab === "status" && (
              <div className="grid grid-cols-2 gap-3">
                {billsPerStatus
                  .filter((s) => matches(s.label))
                  .map((row, i) => (
                    <div key={row.label} className="space-y-2 rounded-xl bg-white/10 p-4">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map((d) => (
                          <span
                            key={d}
                            className={cn(
                              "size-1.5 rounded-full",
                              d <= i + 1 ? "bg-[var(--orange-600)]" : "bg-white/25",
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-small font-normal leading-5 text-white/85">{row.label}</p>
                      <p className="text-h2 text-white">{row.count}</p>
                    </div>
                  ))}
              </div>
            )}

            {tab === "mks" && (
              <div className="space-y-1">
                {topInitiators
                  .filter((m) => matches(m.label))
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-small font-normal text-white/85"
                    >
                      <span>{row.label}</span>
                      <span className="text-white/60">{row.count}</span>
                    </div>
                  ))}
                <p className="pt-3 text-tiny text-white/50">
                  מספר ההצעות שכל חבר כנסת מוביל. סינון לפי חבר כנסת - בקרוב.
                </p>
              </div>
            )}

            {tab === "parties" && (
              <div className="grid grid-cols-3 gap-3">
                {billsPerParty
                  .filter((p) => matches(p.label))
                  .map((row) => (
                    <div key={row.label} className="space-y-1 rounded-xl bg-white/10 p-4 text-center">
                      <p className="text-small font-bold text-white">{row.label}</p>
                      <p className="text-h2 text-white">{row.count}</p>
                    </div>
                  ))}
              </div>
            )}

            {tab === "bloc" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 rounded-xl bg-white/10 p-4">
                  <p className="text-small font-normal text-white/85">קואליציה</p>
                  <p className="text-h2 text-white">{blocCounts.coalition}</p>
                </div>
                <div className="space-y-1 rounded-xl bg-white/10 p-4">
                  <p className="text-small font-normal text-white/85">אופוזיציה</p>
                  <p className="text-h2 text-white">{blocCounts.opposition}</p>
                </div>
                <div className="col-span-2 space-y-1 rounded-xl bg-white/10 p-4">
                  <p className="text-small font-normal text-white/85">שיתופי פעולה</p>
                  <p className="text-h2 text-white">{blocCounts.collaborations}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
