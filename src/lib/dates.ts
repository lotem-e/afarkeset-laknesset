// =========================================================
// Hebrew date formatting.
// =========================================================
// Content stores dates as ISO strings ( "2025-03-12" ); these
// helpers turn them into the design's Hebrew phrasing.

// "Today" used to be frozen at 2025-03-12 so that the seeded
// content would echo the Figma, where every screen reads
// "עדכון אחרון: היום". Real synced bills made that crutch
// visible - a law passed in February 2026 was being announced
// as having happened "today" - so the clock is now the real
// one. Hand-written bills consequently show their true age.
function today(): Date {
  return new Date();
}

const HEBREW_MONTHS = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

// "2025-03-12" -> "12 במרץ, 2025"
export function formatHebrewDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ב${HEBREW_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

// Month name + year for the discussion tiles ( "17 / יוני / 2024" ).
export function dateParts(iso: string): { day: number; month: string; year: number } {
  const d = new Date(iso);
  return { day: d.getDate(), month: HEBREW_MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── The Hebrew-calendar date ( "י״א בסיוון תשפ״ד" ) ─────────
// Intl ( the formatter built into the browser ) knows the
// Hebrew CALENDAR ( which day falls in which Hebrew month ),
// but it refuses to write the numbers as Hebrew LETTERS - it
// gives "11 בסיוון 5784". So we take the calendar math from
// Intl and do the letters ourselves with gematria: each letter
// carries a value, and a number is written as the letters that
// sum to it ( 11 = י+א = י״א, 784 = ת+ש+פ+ד = תשפ״ד ).
const GEMATRIA: [number, string][] = [
  [400, "ת"], [300, "ש"], [200, "ר"], [100, "ק"], [90, "צ"], [80, "פ"],
  [70, "ע"], [60, "ס"], [50, "נ"], [40, "מ"], [30, "ל"], [20, "כ"],
  [10, "י"], [9, "ט"], [8, "ח"], [7, "ז"], [6, "ו"], [5, "ה"],
  [4, "ד"], [3, "ג"], [2, "ב"], [1, "א"],
];

function toGematria(num: number): string {
  let n = num;
  let out = "";
  for (const [value, letter] of GEMATRIA) {
    while (n >= value) {
      out += letter;
      n -= value;
    }
  }
  // 15 and 16 are never written י+ה / י+ו ( those spell parts
  // of the divine name ); tradition writes ט+ו and ט+ז.
  out = out.replace("יה", "טו").replace("יו", "טז");
  // Punctuation: geresh after a single letter, gershayim before
  // the last letter otherwise.
  return out.length === 1 ? `${out}׳` : `${out.slice(0, -1)}״${out.slice(-1)}`;
}

function hebrewCalendarDate(d: Date): string {
  const parts = new Intl.DateTimeFormat("he", {
    calendar: "hebrew",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = toGematria(parseInt(get("day"), 10));
  // Convention drops the thousands: 5784 is written תשפ״ד.
  const year = toGematria(parseInt(get("year"), 10) % 1000);
  return `${day} ב${get("month")} ${year}`;
}

// The discussion page's long form:
// "יום שני, 17 ביוני 2024, י״א בסיוון תשפ״ד, בשעה 08:39"
export function formatDiscussionDate(iso: string, time?: string): string {
  const d = new Date(iso);
  const weekday = new Intl.DateTimeFormat("he", { weekday: "long" }).format(d);
  const gregorian = `${d.getDate()} ב${HEBREW_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  const parts = [`${weekday}, ${gregorian}`, hebrewCalendarDate(d)];
  if (time) parts.push(`בשעה ${time}`);
  return parts.join(", ");
}

// "1:27:41" from 5261 seconds - for the video duration and the
// fake playhead position.
export function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

// "דיון ראשון", "דיון שני"... the ordinal words for as many
// discussions as any seeded bill has.
const ORDINALS = [
  "ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שביעי",
  "שמיני", "תשיעי", "עשירי", "אחד-עשר", "שנים-עשר", "שלושה-עשר",
];
export function discussionOrdinal(n: number): string {
  return ORDINALS[n - 1] ?? `מס' ${n}`;
}

// The design's relative phrasing:
// today            -> "היום (12 במרץ, 2025)"
// n weeks ago      -> "לפני 9 שבועות (21 בינואר, 2025)"
//
// Once real bills arrived the scale had to grow: a law from two
// years ago reading "לפני 104 שבועות" is technically true and
// humanly useless, so it rolls up into months and years.
export function relativeLabel(iso: string): string {
  const then = new Date(iso);
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.round((today().getTime() - then.getTime()) / dayMs);
  const formatted = formatHebrewDate(iso);

  if (days <= 0) return `היום (${formatted})`;
  if (days === 1) return `אתמול (${formatted})`;
  if (days < 14) return `לפני ${days} ימים (${formatted})`;

  const weeks = Math.round(days / 7);
  if (weeks < 9) return `לפני ${weeks} שבועות (${formatted})`;

  const months = Math.round(days / 30.4);
  if (months < 18) {
    const label = months === 2 ? "לפני חודשיים" : `לפני ${months} חודשים`;
    return `${label} (${formatted})`;
  }

  const years = Math.floor(days / 365);
  const label = years === 2 ? "לפני שנתיים" : years === 1 ? "לפני שנה" : `לפני ${years} שנים`;
  return `${label} (${formatted})`;
}
