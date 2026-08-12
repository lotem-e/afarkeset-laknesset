import type { Knesset } from "../content/types";
import { partyColor } from "../content/palette";

// =========================================================
// Turning a Knesset's raw data into what the seat map needs:
// each party with its color and how many of its seats were in
// the founding coalition, in DISPLAY ORDER.
//
// Display order is the heart of the visual story:
//   1. fully-joined coalition lists, largest first
//   2. partially-joined lists ( splits ) - placed on the
//      boundary so their ringed seats touch the coalition wedge
//   3. opposition lists, largest first
// The seat map fills from the right edge, so the coalition
// always reads as one contiguous ringed wedge growing from the
// right - and its size against the opposition is visible at a
// glance.
//
// NOTE: scripts/check-adjacency.mjs mirrors this ordering when
// it validates neighbor colors - keep the two in sync.
// =========================================================

export interface DisplayParty {
  name: string;
  slug: string;
  seats: number;
  color: string;
  coalitionSeats: number; // 0 = opposition
}

export function displayParties(k: Knesset): DisplayParty[] {
  // Map slug -> seats-in-coalition ( null means "the whole list" )
  const coalition = new Map<string, number | null>(
    (k.firstGovernment?.coalition ?? []).map((c) => [c.slug, c.seatsInCoalition ?? null])
  );

  const all: DisplayParty[] = k.parties.map((p) => ({
    name: p.name,
    slug: p.slug,
    seats: p.seats,
    color: partyColor(p.slug, p.family),
    coalitionSeats: coalition.has(p.slug) ? coalition.get(p.slug) ?? p.seats : 0,
  }));

  const bySeats = (a: DisplayParty, b: DisplayParty) => b.seats - a.seats;
  const full = all.filter((p) => p.coalitionSeats === p.seats && p.seats > 0 && p.coalitionSeats > 0);
  const partial = all.filter((p) => p.coalitionSeats > 0 && p.coalitionSeats < p.seats);
  const opposition = all.filter((p) => p.coalitionSeats === 0);

  return [...full.sort(bySeats), ...partial.sort(bySeats), ...opposition.sort(bySeats)];
}

export function coalitionTotal(k: Knesset): number {
  return displayParties(k).reduce((sum, p) => sum + p.coalitionSeats, 0);
}
