// =========================================================
// Translating the Knesset's vocabulary into ours.
// =========================================================
// The API speaks in its own ids and formal names. Our content
// speaks in short slugs. This file is the dictionary between
// them, and it is the place to look when a sync produces
// something that reads wrong.

// ─── Committees ────────────────────────────────────────────
// Committee ids are per-Knesset ( the economy committee of the
// 25th Knesset is 4193; in the 24th it was another number ), so
// this map is bound to Knesset 25.
export const COMMITTEE_BY_KNESSET_ID = {
  4186: "finance",
  4187: "national-security",
  4189: "health",
  4190: "foreign-defense",
  4191: "constitution",
  4192: "education",
  4193: "economy",
  4195: "science-tech",
  4196: "labor-welfare",
  4197: "aliyah",
  4198: "interior-environment",
  4200: "womens-status",
};

// ועדת הכנסת ( 4194 ) is procedural - it decides WHICH committee
// handles a bill, it does not debate its content. It is not one
// of our twelve, but its sessions are still real sessions about
// the bill, so we keep them and label them.
export const PROCEDURAL_COMMITTEE_IDS = { 4194: "ועדת הכנסת" };

// ─── Bill types ────────────────────────────────────────────
export const TYPE_BY_SUBTYPE = {
  "פרטית": "private",
  "ממשלתית": "governmental",
  "ועדה": "committee",
};

// ─── Factions ──────────────────────────────────────────────
// The API returns the full legal name of a faction, sometimes
// with trailing spaces ( ש"ס is registered as "התאחדות הספרדים
// שומרי תורה תנועתו של מרן הרב עובדיה יוסף זצ"ל" ). Matching on
// a distinctive fragment is far more robust than an exact
// string, which breaks on a stray space or a renaming.
const FACTION_FRAGMENTS = [
  ["התאחדות הספרדים", "shas"],
  ["ש\"ס", "shas"],
  ["הליכוד", "likud"],
  ["יהדות התורה", "utj"],
  ["אגודת ישראל", "utj"],
  ["דגל התורה", "utj"],
  ["הציונות הדתית", "rzp"],
  ["עוצמה יהודית", "otzma"],
  ["נעם", "noam"],
  ["יש עתיד", "yesh-atid"],
  ["המחנה הממלכתי", "national-unity"],
  ["כחול לבן", "national-unity"],
  ["ישראל ביתנו", "yisrael-beiteinu"],
  ["העבודה", "labor"],
  ["רע\"ם", "raam"],
  ["הרשימה הערבית המאוחדת", "raam"],
  ["חד\"ש", "hadash-taal"],
  ["תע\"ל", "hadash-taal"],
];

export function partyIdForFaction(factionName) {
  if (!factionName) return null;
  const name = factionName.trim();
  for (const [fragment, partyId] of FACTION_FRAGMENTS) {
    if (name.includes(fragment)) return partyId;
  }
  return null;
}

// ─── Ministries ────────────────────────────────────────────
// A government bill is led by a ministry, not a person. The API
// gives us the ministry on the bill's initiator rows when there
// is one; this normalises the display name.
export function ministryDisplayName(name) {
  if (!name) return "משרד ממשלתי";
  return name.trim().startsWith("משרד") ? name.trim() : `משרד ${name.trim()}`;
}
