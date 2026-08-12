// =========================================================
// The data model for the whole site.
// One Knesset = one election result + the governments that
// served during it. Everything the page renders derives from
// this - nothing is stored twice.
// =========================================================

// Political family of a list - used ONLY as a color fallback
// when a party has no explicit color in palette.ts.
export type Family =
  | "labor"
  | "left"
  | "communist"
  | "arab"
  | "center"
  | "liberal"
  | "likud"
  | "right"
  | "far-right"
  | "religious-zionist"
  | "haredi-ashkenazi"
  | "haredi-sephardi"
  | "other";

// A list as ELECTED on election day. Joint lists ( e.g. הציונות
// הדתית in 2022 ) are one entry, exactly as they appeared on the
// ballot - later splits are a coalition detail, not an election fact.
export interface ElectedParty {
  name: string; // official Hebrew name in that election
  slug: string; // stable latin id - the same party keeps it across elections
  family: Family;
  seats: number;
}

// Membership of one elected list in the founding coalition.
// seatsInCoalition appears only when the list SPLIT and just part
// of it joined ( e.g. כחול לבן in 2020: 15 of the 33 ).
export interface CoalitionMember {
  slug: string;
  seatsInCoalition?: number;
}

// The first government sworn in after the election - this is the
// coalition the infographic outlines. Mid-term changes are told in
// the Knesset's notes instead of redrawing the map.
export interface FirstGovernment {
  govNumber: number;
  pm: string; // Hebrew full name
  formed: string; // ISO date of the swearing-in
  coalition: CoalitionMember[];
}

// Any numbered government sworn in during the Knesset's term.
export interface Government {
  govNumber: number;
  pm: string;
  formed: string; // ISO
  ended: string | null; // null = still serving
  note?: string; // short Hebrew label: "ממשלת אחדות", "רוטציה"...
}

export interface Knesset {
  n: number;
  electionDate: string; // ISO
  parties: ElectedParty[]; // sorted by seats, sums to 120
  firstGovernment: FirstGovernment | null; // null = no government was formed
  governments: Government[];
  notes: string; // 1-2 Hebrew sentences shown under the chart
}
