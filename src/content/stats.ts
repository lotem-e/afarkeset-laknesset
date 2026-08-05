// =========================================================
// Display aggregates - ILLUSTRATIVE numbers from the Figma.
// =========================================================
// We seed ~12 bills, but the design shows totals like "513
// bills on the agenda". Deriving totals from the seeds would
// make every screen contradict the Figma, so the design's
// numbers live here verbatim, clearly marked as illustrative
// until a real Knesset API feeds the site.
//
// The ONE exception: the tracking page derives its counts LIVE
// from the bills the user actually follows - never from here.

// One labeled number - the shape every bar list consumes.
export interface StatItem {
  label: string;
  count: number;
}

// Header counts ( "הצעות חוק על סדר היום / 513" )
export const headerCounts = {
  agenda: 513,
  completed: 374,
  stats: 513,
};

// סטטיסטיקות - bills per handling committee.
export const billsPerCommittee: StatItem[] = [
  { label: "חוקה, חוק ומשפט", count: 101 },
  { label: "כלכלה", count: 65 },
  { label: "עבודה ורווחה", count: 64 },
  { label: "פנים והגנת הסביבה", count: 60 },
  { label: "כספים", count: 45 },
  { label: "חוץ וביטחון", count: 38 },
  { label: "חינוך, תרבות וספורט", count: 35 },
  { label: "בריאות", count: 32 },
  { label: "ביטחון לאומי", count: 28 },
  { label: "קידום מעמד האישה ושוויון מגדרי", count: 5 },
  { label: "מדע וטכנולוגיה", count: 1 },
  { label: "עלייה, קליטה ותפוצות", count: 0 },
];

// סטטיסטיקות - bills per pipeline status.
export const billsPerStatus: StatItem[] = [
  { label: "בהכנה לקריאה ראשונה", count: 313 },
  { label: "הונחה לקריאה ראשונה", count: 23 },
  { label: "בהכנה לקריאה שנייה ושלישית", count: 167 },
  { label: "הונחה לקריאה שנייה ושלישית", count: 10 },
];

// סטטיסטיקות - who submits bills.
export const blocCounts = {
  coalition: 399,
  opposition: 9,
  collaborations: 105, // שיתופי פעולה
};

// סטטיסטיקות - top initiating MKs ( name + bill count ).
export const topInitiators: StatItem[] = [
  { label: "לימור סון הר מלך", count: 53 },
  { label: "יצחק קרויזר", count: 47 },
  { label: "משה סעדה", count: 45 },
  { label: "צביקה פוגל", count: 43 },
  { label: "אוהד טל", count: 42 },
  { label: "דן אילוז", count: 41 },
  { label: "ניסים ואטורי", count: 41 },
  { label: "משה פסל", count: 41 },
  { label: "משה סולומון", count: 37 },
  { label: "מיכל וולדיגר", count: 33 },
  { label: "מתן כהנא", count: 31 },
  { label: "ינון אזולאי", count: 30 },
];

// The filters drawer's "הצעות חוק חמות עכשיו" - a curated
// pick, matching the design's hot list.
export const hotBillIds = [
  "judiciary-basic-law",
  "mk-immunity",
  "school-boycott",
  "police-documentation",
];

// סטטיסטיקות - party affiliation of initiating MKs.
export const billsPerParty: StatItem[] = [
  { label: "הליכוד", count: 121 },
  { label: "הציונות הדתית", count: 111 },
  { label: "ש״ס", count: 98 },
  { label: "עוצמה יהודית", count: 67 },
  { label: "יהדות התורה", count: 66 },
  { label: "המחנה הממלכתי", count: 24 },
];
