// The "בהובלת:" block - who leads the bill. An MK gets an
// avatar, name, party, bloc and ( if any ) a committee role in
// brown; a ministry gets an icon circle and its name.
// The card shows the lead initiator; the bill page passes all.
import { Building2, HeartPulse } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { getMk } from "@/content/mks";
import { blocLabel, getParty } from "@/content/parties";
import type { Initiator } from "@/content/types";

function MinistryCircle({ name }: { name: string }) {
  // The design gives each ministry its own pictogram; two are
  // enough for the seeds, everything else falls back to a
  // generic government building.
  const Icon = name === "משרד הבריאות" ? HeartPulse : Building2;
  return (
    <div className="flex size-14 items-center justify-center rounded-full bg-panel-proposed text-accent">
      <Icon className="size-7" />
    </div>
  );
}

function InitiatorEntry({ initiator }: { initiator: Initiator }) {
  if (initiator.kind === "ministry") {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <MinistryCircle name={initiator.name} />
        <p className="text-small font-bold">{initiator.name}</p>
      </div>
    );
  }

  // A hand-written bill names an mkId and we look the person up
  // in our roster; a synced bill already carries the details.
  const roster = initiator.mkId ? getMk(initiator.mkId) : undefined;
  const name = initiator.name ?? roster?.name;
  if (!name) return null; // an unknown id is a content bug - fail quiet, not loud

  const partyId = initiator.partyId ?? roster?.partyId;
  const party = partyId ? getParty(partyId) : undefined;
  // Committee roles are editorial for now - the API does not
  // hand them over in a usable form.
  const role = roster?.role;

  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <Avatar name={name} size="lg" />
      <div>
        <p className="text-small font-bold">{name}</p>
        {party ? (
          <>
            <p className="text-tiny text-muted-foreground">{party.name}</p>
            <p className="text-tiny text-muted-foreground">{blocLabel(party.bloc)}</p>
          </>
        ) : (
          initiator.factionName && (
            <p className="text-tiny text-muted-foreground">{initiator.factionName}</p>
          )
        )}
      </div>
      {role && <p className="text-tiny font-medium text-role-note">{role}</p>}
    </div>
  );
}

export function InitiatorRail({ initiators }: { initiators: Initiator[] }) {
  // A committee bill has no personal initiators in the Knesset's
  // data - the committee itself leads it. Until Lotem decides
  // what such a bill shows here, an empty "בהובלת:" label would
  // just look broken, so the rail steps aside entirely.
  if (initiators.length === 0) return null;

  return (
    <div className="flex w-36 shrink-0 flex-col gap-4">
      <p className="text-small font-bold">בהובלת:</p>
      {initiators.map((ini, i) => (
        <InitiatorEntry key={i} initiator={ini} />
      ))}
    </div>
  );
}
