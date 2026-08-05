// The 120-seat map of the Knesset, as an SVG hemicycle.
//
// How it works, in three steps:
// 1. GEOMETRY - five concentric arc rows hold 120 seat slots,
//    split by a center aisle. A slot's position comes from
//    plain trigonometry: given an angle and a radius,
//    x = cx + r*cos(angle), y = cy - r*sin(angle).
// 2. ASSIGNMENT - all slots are sorted by angle ( right to
//    left ) and parties claim consecutive slots, seats-many
//    each, walking the parties array. That is what forms the
//    party "wedges", coalition on the right.
// 3. COLOR - each seat reads its party's --group-* token, so
//    the map and Canon's Groups page can never disagree.
import { useState } from "react";
import { parties, blocLabel } from "@/content/parties";
import type { Party } from "@/content/types";

// Rows from the innermost out: radius + how many seats it holds.
const ROWS = [
  { radius: 100, count: 17 },
  { radius: 127, count: 20 },
  { radius: 154, count: 24 },
  { radius: 181, count: 28 },
  { radius: 208, count: 31 },
]; // 17+20+24+28+31 = 120

const CX = 230;
const CY = 225;
const SEAT_R = 7;
// The aisle: each row's seats spread over two arcs,
// [5°..85°] on the right and [95°..175°] on the left.
const ARCS: [number, number][] = [
  [5, 85],
  [95, 175],
];

interface Seat {
  x: number;
  y: number;
  angle: number;
  party: Party;
}

function buildSeats(): Seat[] {
  const slots: { x: number; y: number; angle: number }[] = [];

  for (const row of ROWS) {
    // Split the row's seats between the two arcs, keeping the
    // share proportional ( half and half ).
    const rightCount = Math.round(row.count / 2);
    const counts = [rightCount, row.count - rightCount];
    ARCS.forEach(([from, to], arcIndex) => {
      const n = counts[arcIndex];
      for (let i = 0; i < n; i++) {
        // Spread n seats evenly inside the arc.
        const angle = from + ((to - from) * i) / (n - 1);
        const rad = (angle * Math.PI) / 180;
        slots.push({
          x: CX + row.radius * Math.cos(rad),
          y: CY - row.radius * Math.sin(rad),
          angle,
        });
      }
    });
  }

  // Right-to-left ( angle 0 -> 180 ), so the first party in the
  // array starts at the map's right edge.
  slots.sort((a, b) => a.angle - b.angle);

  // Hand out consecutive slots to each party, seats-many each.
  const seats: Seat[] = [];
  let cursor = 0;
  for (const party of parties) {
    for (let s = 0; s < party.seats; s++) {
      const slot = slots[cursor++];
      seats.push({ ...slot, party });
    }
  }
  return seats;
}

const SEATS = buildSeats();

export function Hemicycle() {
  const [hovered, setHovered] = useState<Party | null>(null);

  return (
    <div className="space-y-6">
      <div className="relative mx-auto w-fit" dir="ltr">
        <svg width={460} height={240} role="img" aria-label="מפת המושבים של הכנסת לפי מפלגות">
          {SEATS.map((seat, i) => (
            <circle
              key={i}
              cx={seat.x}
              cy={seat.y}
              r={SEAT_R}
              fill={`var(${seat.party.colorVar})`}
              // The 2px surface ring that keeps neighbors apart.
              stroke="var(--background)"
              strokeWidth={2}
              opacity={hovered === null || hovered === seat.party ? 1 : 0.25}
              onMouseEnter={() => setHovered(seat.party)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <text
            x={CX}
            y={CY - 8}
            textAnchor="middle"
            className="fill-primary text-[2rem] font-bold"
          >
            120
          </text>
        </svg>

        {/* The hover tooltip, floating above the map's center. */}
        {hovered && (
          <div className="pointer-events-none absolute inset-x-0 -top-2 mx-auto w-fit rounded-lg bg-primary px-3 py-1.5 text-small text-primary-foreground shadow-md" dir="rtl">
            {hovered.name} · {hovered.seats} מושבים · {blocLabel(hovered.bloc)}
          </div>
        )}
      </div>

      {/* The legend doubles as the readable table of the map:
          every party, its color, its seats - identity is never
          color-alone. */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-1.5">
        {(["coalition", "opposition"] as const).map((bloc) => (
          <div key={bloc} className="space-y-1.5">
            <p className="text-small font-bold">
              {blocLabel(bloc)}{" "}
              <span className="font-normal text-muted-foreground">
                {parties.filter((p) => p.bloc === bloc).reduce((sum, p) => sum + p.seats, 0)} מושבים
              </span>
            </p>
            {parties
              .filter((p) => p.bloc === bloc)
              .map((p) => (
                <button
                  key={p.id}
                  onMouseEnter={() => setHovered(p)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex w-full items-center gap-2 text-small font-normal"
                >
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: `var(${p.colorVar})` }}
                  />
                  <span className="flex-1 text-start">{p.name}</span>
                  <span className="font-bold">{p.seats}</span>
                </button>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
