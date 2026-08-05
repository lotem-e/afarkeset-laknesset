// A plenum vote, as the design shows it: four count-tabs
// ( בעד / נגד / נמנעו / נעדרו ) and, for the chosen tab, the
// sampled MKs as avatars ringed in the tab's color.
import { useState } from "react";
import { Avatar } from "@/components/shared/Avatar";
import { getMk } from "@/content/mks";
import { blocLabel, getParty } from "@/content/parties";
import { formatHebrewDate } from "@/lib/dates";
import type { Vote } from "@/content/types";
import { cn } from "@/lib/utils";

type VoteTab = "inFavor" | "against" | "abstained" | "absent";

const TABS: { key: VoteTab; label: string; activeClass: string; ring: string }[] = [
  { key: "inFavor",   label: "הצביעו בעד", activeClass: "text-stage-done-foreground border-stage-done-foreground", ring: "ring-[var(--green-200)]" },
  { key: "against",   label: "הצביעו נגד", activeClass: "text-destructive border-destructive",                     ring: "ring-destructive/50" },
  { key: "abstained", label: "נמנעו",      activeClass: "text-primary border-primary",                             ring: "ring-primary" },
  { key: "absent",    label: "נעדרו",      activeClass: "text-tile-discussion-foreground border-tile-discussion-foreground", ring: "ring-[var(--orange-600)]" },
];

function sampleFor(vote: Vote, tab: VoteTab): string[] {
  if (tab === "inFavor") return vote.inFavorMkIds ?? [];
  if (tab === "against") return vote.againstMkIds ?? [];
  if (tab === "absent") return vote.absentMkIds ?? [];
  return [];
}

export function VoteResults({ vote }: { vote: Vote }) {
  // Open on the tab that actually has faces to show ( the
  // design highlights the absentees on the judiciary bill ).
  const first = TABS.find((t) => sampleFor(vote, t.key).length > 0)?.key ?? "inFavor";
  const [tab, setTab] = useState<VoteTab>(first);
  const active = TABS.find((t) => t.key === tab)!;
  const mkIds = sampleFor(vote, tab);

  return (
    <div className="space-y-4">
      <p className="text-tiny text-muted-foreground">{formatHebrewDate(vote.date)}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "border-b-2 pb-0.5 text-small transition-colors",
              t.key === tab ? cn("font-bold", t.activeClass) : "border-transparent text-foreground/70",
            )}
          >
            <span className="font-bold">{vote[t.key]}</span> {t.label}
          </button>
        ))}
      </div>

      {mkIds.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {mkIds.map((id) => {
            const mk = getMk(id);
            if (!mk) return null;
            const party = getParty(mk.partyId);
            return (
              <div key={id} className="flex w-20 flex-col items-center gap-1 text-center">
                <Avatar name={mk.name} size="sm" ringClass={active.ring} />
                <p className="text-tiny font-bold leading-4">{mk.name}</p>
                <p className="text-tiny leading-4 text-muted-foreground">
                  {party.name}
                  <br />
                  {blocLabel(party.bloc)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
