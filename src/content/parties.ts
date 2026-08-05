// =========================================================
// The factions of the 25th Knesset.
// =========================================================
// Seat counts sum to 120 and drive the hemicycle on the
// statistics page. The Religious Zionism list is shown split
// into its three factions ( as the design does ).
//
// NOTE for Lotem: seat numbers reflect the 2022 election with
// the later faction splits - verify before publishing.
import type { Bloc, MK, Party, PartyId } from "./types";
import { mks } from "./mks";

// The array ORDER is the seat-map order: the hemicycle assigns
// seats right-to-left walking this list, so neighbors here are
// neighbors on the map - and the palette was validated for
// exactly this adjacency. Reordering requires re-validating.
export const parties: Party[] = [
  // Coalition ( 64 seats )
  { id: "likud",             name: "הליכוד",           seats: 32, bloc: "coalition",  colorVar: "--group-likud" },
  { id: "shas",              name: "ש״ס",              seats: 11, bloc: "coalition",  colorVar: "--group-shas" },
  { id: "rzp",               name: "הציונות הדתית",    seats: 7,  bloc: "coalition",  colorVar: "--group-rzp" },
  { id: "utj",               name: "יהדות התורה",      seats: 7,  bloc: "coalition",  colorVar: "--group-utj" },
  { id: "otzma",             name: "עוצמה יהודית",     seats: 6,  bloc: "coalition",  colorVar: "--group-otzma" },
  { id: "noam",              name: "נעם",              seats: 1,  bloc: "coalition",  colorVar: "--group-noam" },
  // Opposition ( 56 seats )
  { id: "yisrael-beiteinu",  name: "ישראל ביתנו",      seats: 6,  bloc: "opposition", colorVar: "--group-yisrael-beiteinu" },
  { id: "national-unity",    name: "המחנה הממלכתי",    seats: 12, bloc: "opposition", colorVar: "--group-national-unity" },
  { id: "labor",             name: "העבודה",           seats: 4,  bloc: "opposition", colorVar: "--group-labor" },
  { id: "yesh-atid",         name: "יש עתיד",          seats: 24, bloc: "opposition", colorVar: "--group-yesh-atid" },
  { id: "raam",              name: "רע״ם",             seats: 5,  bloc: "opposition", colorVar: "--group-raam" },
  { id: "hadash-taal",       name: "חד״ש-תע״ל",        seats: 5,  bloc: "opposition", colorVar: "--group-hadash-taal" },
];

export function getParty(id: PartyId): Party {
  return parties.find((p) => p.id === id)!;
}

// Hebrew label for a bloc - appears under every MK name.
export function blocLabel(bloc: Bloc): string {
  return bloc === "coalition" ? "קואליציה" : "אופוזיציה";
}

// Convenience: an MK's party and bloc in one lookup.
export function mkParty(mk: MK): Party {
  return getParty(mk.partyId);
}

export { mks };
