import { useMemo } from "react";
import { hemicycleSeats } from "../lib/hemicycle";
import type { DisplayParty } from "../lib/blocs";

// =========================================================
// The 120-seat infographic. Pure SVG - every seat is a circle,
// colored by its party, and a seat that belongs to the founding
// coalition gets a dark ring. The coalition count sits in the
// hollow of the arc.
// =========================================================

const TOTAL = 120;
const ROWS = 6;
const INNER = 44; // inner row radius, in viewBox units
const OUTER = 100; // outer row radius
const SEAT_R = 4.4;

interface Props {
  parties: DisplayParty[]; // already in display order ( see blocs.ts )
  coalitionSize: number;
  hasGovernment: boolean;
  knessetNumber: number;
}

export default function Hemicycle({ parties, coalitionSize, hasGovernment, knessetNumber }: Props) {
  // Seat positions never change ( always 120 seats, same geometry ),
  // so compute once and reuse across re-renders.
  const seats = useMemo(() => hemicycleSeats(TOTAL, ROWS, INNER, OUTER), []);

  // Walk the parties in display order and hand each one its seats.
  // Seat i belongs to the party whose cumulative range covers i;
  // within a party, the FIRST seats ( nearest the right edge ) are
  // the coalition ones - that keeps the ringed wedge contiguous
  // even when a list split and only part of it joined.
  const seatMeta = useMemo(() => {
    const meta: { color: string; ringed: boolean; label: string }[] = [];
    for (const p of parties) {
      for (let i = 0; i < p.seats; i++) {
        const ringed = i < p.coalitionSeats;
        meta.push({
          color: p.color,
          ringed,
          label: `${p.name} - ${p.seats} מושבים${ringed ? ", בקואליציה" : ""}`,
        });
      }
    }
    return meta;
  }, [parties]);

  const label = hasGovernment
    ? `מפת המושבים של הכנסת ה-${knessetNumber}: ${coalitionSize} מושבי קואליציה מתוך 120`
    : `מפת המושבים של הכנסת ה-${knessetNumber}: לא הורכבה ממשלה`;

  return (
    <svg
      viewBox="-110 -110 220 120"
      role="img"
      aria-label={label}
      className="w-full max-w-[560px] mx-auto block"
    >
      {seats.map((s, i) => {
        const m = seatMeta[i];
        return (
          <circle
            key={i}
            className="seat"
            cx={s.x}
            cy={s.y}
            r={SEAT_R}
            fill={m.color}
            stroke={m.ringed ? "var(--coalition-ring)" : "rgba(20, 22, 30, 0.16)"}
            strokeWidth={m.ringed ? 1.7 : 0.7}
          >
            {/* Native SVG tooltip - shows on hover */}
            <title>{m.label}</title>
          </circle>
        );
      })}

      {/* The headline number inside the arc's hollow */}
      {hasGovernment ? (
        <>
          <text
            x="0"
            y="-20"
            textAnchor="middle"
            fontSize="30"
            fontWeight="900"
            fill="var(--ink)"
          >
            {coalitionSize}
          </text>
          <text x="0" y="-7" textAnchor="middle" fontSize="8" fill="var(--ink-2)">
            מושבים בקואליציה
          </text>
        </>
      ) : (
        <>
          <text
            x="0"
            y="-20"
            textAnchor="middle"
            fontSize="30"
            fontWeight="900"
            fill="var(--ink-3)"
          >
            120
          </text>
          <text x="0" y="-7" textAnchor="middle" fontSize="8" fill="var(--ink-2)">
            מושבים, ללא קואליציה
          </text>
        </>
      )}
    </svg>
  );
}
