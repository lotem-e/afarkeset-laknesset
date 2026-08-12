// =========================================================
// The 12 Knesset committees the design shows, plus ועדת
// הכנסת - which handles its own domain ( e.g. MK immunity ).
// =========================================================
import type { Committee, CommitteeId } from "./types";

export const committees: Committee[] = [
  { id: "constitution",         name: "ועדת החוקה, חוק ומשפט",                        shortName: "חוקה, חוק ומשפט" },
  { id: "economy",              name: "ועדת הכלכלה",                                   shortName: "כלכלה" },
  { id: "labor-welfare",        name: "ועדת העבודה והרווחה",                           shortName: "עבודה ורווחה" },
  { id: "interior-environment", name: "ועדת הפנים והגנת הסביבה",                       shortName: "פנים והגנת הסביבה" },
  { id: "finance",              name: "ועדת הכספים",                                   shortName: "כספים" },
  { id: "foreign-defense",      name: "ועדת החוץ והביטחון",                            shortName: "חוץ וביטחון" },
  { id: "education",            name: "ועדת החינוך, התרבות והספורט",                   shortName: "חינוך, תרבות וספורט" },
  { id: "health",               name: "ועדת הבריאות",                                  shortName: "בריאות" },
  { id: "national-security",    name: "הוועדה לביטחון לאומי",                          shortName: "ביטחון לאומי" },
  { id: "womens-status",        name: "הוועדה לקידום מעמד האישה ולשוויון מגדרי",       shortName: "קידום מעמד האישה ושוויון מגדרי" },
  { id: "science-tech",         name: "ועדת המדע והטכנולוגיה",                         shortName: "מדע וטכנולוגיה" },
  { id: "aliyah",               name: "ועדת העלייה, הקליטה והתפוצות",                  shortName: "עלייה, קליטה ותפוצות" },
  { id: "knesset-committee",    name: "ועדת הכנסת",                                    shortName: "ועדת הכנסת" },
  { id: "state-control",        name: "הוועדה לענייני ביקורת המדינה",                  shortName: "ביקורת המדינה" },
  { id: "public-projects",      name: "הוועדה למיזמים ציבוריים",                       shortName: "מיזמים ציבוריים" },
  { id: "children-rights",      name: "הוועדה המיוחדת לזכויות הילד",                   shortName: "זכויות הילד" },
  { id: "drugs-alcohol",        name: "הוועדה המיוחדת למאבק בשימוש בסמים ובאלכוהול",   shortName: "מאבק בסמים ובאלכוהול" },
  // The bucket for ad-hoc joint / special committees; the bill
  // itself carries the full official name ( Bill.committeeName ).
  { id: "special",              name: "ועדה מיוחדת או משותפת",                         shortName: "ועדה מיוחדת" },
];

export function getCommittee(id: CommitteeId): Committee {
  // ".find" returns undefined in theory; the "!" says: the id
  // is a typed CommitteeId, so a match always exists.
  return committees.find((c) => c.id === id)!;
}
