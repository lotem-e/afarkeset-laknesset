import type { DisplayParty } from "../lib/blocs";

// =========================================================
// The legend next to each seat map, split into coalition and
// opposition groups. Text stays in ink colors - the swatch
// alone carries the party color, and a coalition swatch wears
// the same dark ring as its seats.
// =========================================================

interface Props {
  parties: DisplayParty[]; // display order: coalition first
  hasGovernment: boolean;
}

function LegendRow({ p }: { p: DisplayParty }) {
  const inCoalition = p.coalitionSeats > 0;
  const partial = inCoalition && p.coalitionSeats < p.seats;
  return (
    <li className="flex items-center gap-2.5 py-1">
      <span
        className={`swatch${inCoalition ? " in-coalition" : ""}`}
        style={{ background: p.color }}
        aria-hidden
      />
      <span className="text-sm font-medium leading-tight">{p.name}</span>
      <span className="ms-auto text-sm font-bold ltr-nums" style={{ color: "var(--ink-2)" }}>
        {p.seats}
      </span>
      {partial && (
        <span className="text-xs" style={{ color: "var(--ink-3)" }}>
          ({p.coalitionSeats} בקואליציה)
        </span>
      )}
    </li>
  );
}

function Group({ title, total, parties }: { title: string; total: number; parties: DisplayParty[] }) {
  if (parties.length === 0) return null;
  return (
    <div>
      <h4
        className="flex items-baseline gap-2 text-xs font-bold uppercase tracking-wide pb-1 mb-1"
        style={{ color: "var(--ink-3)", borderBottom: "1px solid var(--hairline)" }}
      >
        {title}
        <span className="ltr-nums">{total}</span>
      </h4>
      <ul className="m-0 p-0 list-none">
        {parties.map((p) => (
          <LegendRow key={p.slug} p={p} />
        ))}
      </ul>
    </div>
  );
}

export default function Legend({ parties, hasGovernment }: Props) {
  if (!hasGovernment) {
    // No coalition to mark - one flat group of all the lists.
    return (
      <div className="grid gap-4">
        <Group title="הסיעות שנבחרו" total={120} parties={parties} />
      </div>
    );
  }

  const coalition = parties.filter((p) => p.coalitionSeats > 0);
  const opposition = parties.filter((p) => p.coalitionSeats === 0);
  const coalitionTotal = coalition.reduce((s, p) => s + p.coalitionSeats, 0);

  return (
    <div className="grid gap-4">
      <Group title="קואליציה" total={coalitionTotal} parties={coalition} />
      <Group title="אופוזיציה" total={120 - coalitionTotal} parties={opposition} />
    </div>
  );
}
