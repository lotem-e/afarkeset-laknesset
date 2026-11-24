// =========================================================
// The "חדשים במשכן?" page content - the legislation process.
// =========================================================
// Everything the how-it-works flowchart shows lives here as
// typed data, so the components stay dumb - the same rule as
// the rest of src/content/.
//
// SOURCE: "הליך החקיקה", the Knesset Legal Bureau ( הלשכה
// המשפטית של הכנסת ), September 2016, ref 01584713. The Hebrew
// below is OUR plain-language retelling of that document. It
// was drafted from the source on 2026-08-12 and awaits Lotem's
// editorial pass, like every seed text on this site. Era-bound
// figures carry a "NOTE for Lotem" comment right above them.
//
// Structure: two chapters ( "before" = how a private bill is
// born, "pipeline" = the site's five stages ), then the
// special-cases list and the source citation. The pipeline
// chapter is KEYED by StageKey and built from STAGE_ORDER, so
// this file can never disagree with stages.ts about which
// stages exist or in what order.

import type { StageKey, TextBlock } from "./types";
import { STAGE_ORDER } from "./stages";

// ─── Shapes ──────────────────────────────────────────────────

// A short fact worth a chip on the station card: "45 יום לפחות".
// dir is an escape hatch for a string that misrenders in RTL -
// apply it only after SEEING a string break, never preemptively.
export interface KeyFact {
  label: string;
  dir?: "ltr";
}

// The pass / fail split drawn after a plenum-vote station.
export interface DecisionFork {
  passLabel: string;
  failLabel: string;
  failNote?: string; // the six-month rule, where it applies
}

// The point where governmental and committee bills join the
// track - rendered on the spine right before its station.
export interface EntryMarker {
  label: string;
  detail?: string;
}

// One station card. Pipeline stations set `stage` and DO NOT
// store a title - the renderer reads STAGES[stage].fullLabel,
// so the flowchart can never drift from the rest of the site.
// Chapter-0 stations have no stage, so they carry their own
// title.
export interface ProcessStation {
  id: string;             // stable key, e.g. "legal-check"
  stage?: StageKey;       // pipeline stations only
  title?: string;         // chapter-0 stations only
  summary: string;        // 1-2 sentences, always visible
  facts?: KeyFact[];      // the chips row
  details?: TextBlock[];  // long form - may carry RichText markup
  fork?: DecisionFork;    // plenum-vote stations only
  entry?: EntryMarker;    // rendered before this station
}

export interface ProcessChapter {
  id: "before" | "pipeline";
  title: string;
  intro?: string;
  stations: ProcessStation[];
  // The spine's end cap after the last station - "a law is
  // born". Only the pipeline chapter has one.
  outcome?: { title: string; summary: string };
}

export interface SpecialCase {
  id: string;
  title: string;
  summary: string; // one line, visible when collapsed
  details: TextBlock[];
}

export interface SourceCitation {
  title: string;
  publisher: string;
  date: string;
  note?: string;
}

// ─── Shared snippets ─────────────────────────────────────────

// The six-month rule applies to a rejection at the preliminary
// reading AND at the first reading ( but not at the second and
// third ) - one fact, written once, referenced twice.
const SIX_MONTH_NOTE =
  "כלל ששת החודשים: אחרי דחייה אי אפשר להעלות הצעה זהה או דומה בעיקרה " +
  "במשך שישה חודשים ( יושב ראש הכנסת רשאי לקצר את התקופה אם חל שינוי של ממש בנסיבות ).";

// ─── Chapter 0 - before the pipeline ─────────────────────────

// NOTE for Lotem: the weekday customs in this chapter ( the
// presidency meeting on Mondays, tabling on Monday at 16:00,
// preliminary debates on Wednesdays ) are the 2016 document's
// description of practice, not binding rules - the text keeps
// them soft with "בדרך כלל".
const BEFORE_STATIONS: ProcessStation[] = [
  {
    id: "writing",
    title: "כותבים הצעת חוק",
    summary:
      "חבר או חברת כנסת מנסחים הצעה - חוק חדש או תיקון לחוק קיים - ומצרפים לה דברי הסבר. אפשר להגיש לבד או יחד עם חברי כנסת נוספים.",
    facts: [{ label: "רק חברי כנסת" }],
    details: [
      {
        paragraphs: [
          "שרים וסגני שרים לא רשאים להגיש הצעות חוק פרטיות. חבר כנסת שהגיש הצעה והתמנה לשר - שמו נמחק ממנה אוטומטית.",
          "כשמגישים יחד, המציעים מחליטים מי [[b|יוזם]] ומי [[b|מצטרף]]: רק היוזמים רשאים להציג את ההצעה במליאה ולקדם אותה. סדר השמות שנקבע בהגשה יישמר לכל אורך הליך החקיקה.",
        ],
      },
      {
        intro: "להצעה מצרפים:",
        bullets: [
          "נוסח מלא - כחוק חדש או כתיקון לחוק קיים",
          "דברי הסבר",
          "ציון של הצעות זהות או דומות שכבר הונחו בכנסת הנוכחית או בקודמת",
        ],
      },
    ],
  },
  {
    id: "submission",
    title: "מגישים למזכירות הכנסת",
    summary:
      "ההצעה מוגשת בעותק נייר עם חתימות מקוריות, וגם במערכת ממוחשבת בשם ״סנהדרין״. מזכיר הכנסת חותם עליה ומעביר אותה לבדיקה משפטית.",
  },
  {
    id: "legal-check",
    title: "הלשכה המשפטית בודקת",
    summary:
      "היועצים המשפטיים של הכנסת בודקים את הנוסח ואת דברי ההסבר, ובסוף הבדיקה ההצעה מקבלת מספר רשמי שמתחיל ב-פ/ ( פרטית ).",
    facts: [{ label: "בדיקה משפטית" }, { label: "מספר פ/ להצעה" }],
    details: [
      {
        intro: "בין השאר נבדק:",
        bullets: [
          "האם החוק הקיים כבר נותן מענה למה שההצעה מבקשת",
          "האם נכון לקבוע את ההסדר בחוק, או שמקומו בתקנות",
          "איפה בדיוק משתלב השינוי - מחיקה, הוספה או החלפה, ובאיזה חוק",
          "האם השינוי משפיע על חוקים אחרים ודורש תיקונים עקיפים",
          "האם ההצעה מעוררת שאלות חוקתיות",
          "האם יש שגיאות ניסוח, והאם דברי ההסבר תואמים את הנוסח",
        ],
      },
      {
        paragraphs: [
          "היועץ המשפטי לכנסת גם ממליץ לאיזו ועדה כדאי להעביר את ההצעה בהמשך הדרך.",
        ],
      },
    ],
  },
  {
    id: "presidency",
    title: "נשיאות הכנסת מאשרת",
    summary:
      "יושב ראש הכנסת והסגנים ( בדרך כלל בישיבתם ביום שני ) מאשרים את הנחת ההצעה על שולחן הכנסת.",
    details: [
      {
        paragraphs: [
          "לנשיאות יש סמכות לסרב רק בשני מקרים: הצעה שלדעתה שוללת את קיומה של מדינת ישראל כמדינתו של העם היהודי, או הצעה גזענית במהותה.",
        ],
      },
    ],
  },
  {
    id: "tabling",
    title: "ההצעה מונחת על שולחן הכנסת",
    summary:
      "ההצעה מודפסת על דפים בצבע תכלת ומונחת במליאה, ומזכיר הכנסת מכריז על ההנחה. תוך שעה קלה היא מתפרסמת גם באתר הכנסת.",
    facts: [{ label: "דפים בצבע תכלת" }],
    details: [
      {
        paragraphs: [
          "ההנחה נעשית במועד התכנסות המליאה הקרוב - בדרך כלל ביום שני בשעה 16:00.",
          "טיפ לזיהוי: לאורך המסלול יש להצעה שלושה לבושים מודפסים - דפי התכלת של ההנחה הזאת, ״הנוסח הכחול״ שמתפרסם לפני הקריאה הראשונה, והנוסח שמונח לפני הקריאה השנייה, שבז׳רגון הכנסת מכונה ״פונץ׳-בננה״ על שם צבעיו.",
        ],
      },
    ],
  },
  {
    id: "waiting",
    title: "ממתינים 45 יום לפחות",
    summary:
      "מרגע ההנחה ועד ההצבעה הראשונה חייבים לעבור לפחות 45 יום - הזמן של הממשלה לגבש עמדה על ההצעה, ושל הציבור להכיר אותה.",
    facts: [{ label: "45 יום לפחות" }, { label: "עמדת הממשלה" }],
    details: [
      {
        paragraphs: [
          // NOTE for Lotem: the second sentence here ( coalition
          // MKs usually voting with the government's position ) is
          // our plain-language context, NOT something the source
          // document states - keep or cut at your editorial pass.
          "את עמדת הממשלה מגבשת ועדת השרים לענייני חקיקה. ההחלטה שלה לא מחייבת את הכנסת, אבל בפועל חברי הקואליציה מצביעים בדרך כלל לפיה.",
          "אפשר לקצר את ההמתנה בשתי דרכים: [[b|פטור מחובת הנחה]] - בהסכמת הממשלה, או בהחלטת ועדת הכנסת לבקשת אחד היוזמים; ו[[b|הצמדה]] - כשהצעה זהה או דומה בעיקרה כבר קיבלה מועד דיון, אפשר לצרף אליה את ההצעה לאותו יום, בתנאים שקבועים בתקנון.",
          "וכמה הצעות בכלל אפשר להעלות להצבעה? לכל סיעה יש מכסה - על זה במקטע ״מקרים מיוחדים״ שבהמשך העמוד.",
        ],
      },
    ],
  },
];

// ─── The pipeline chapter ────────────────────────────────────

// Keyed by StageKey: TypeScript forces exactly the five known
// stages, and STAGE_ORDER ( below ) fixes their order - this
// file cannot invent, drop or shuffle a stage.
const PIPELINE: Record<StageKey, Omit<ProcessStation, "id" | "stage" | "title">> = {
  preliminary: {
    summary:
      "ההצבעה הראשונה במליאה. אחד היוזמים מציג את ההצעה, נציג הממשלה מציג את עמדתה - והמליאה מחליטה: האם בכלל להתחיל בהליך החקיקה?",
    facts: [{ label: "בדרך כלל ביום רביעי" }, { label: "רוב רגיל" }],
    details: [
      {
        paragraphs: [
          "אם ההצעה עוברת, המליאה מעבירה אותה לוועדה שהנושא שלה בתחומה, להכנה לקריאה הראשונה. אם לא ברור לאיזו ועדה - ועדת הכנסת מכריעה.",
          "שוויון קולות דינו כדחייה, וההצעה יורדת מסדר היום.",
        ],
      },
    ],
    fork: {
      passLabel: "עברה - ממשיכים לוועדה",
      failLabel: "לא עברה - יורדת מסדר היום",
      failNote: SIX_MONTH_NOTE,
    },
  },
  firstPrep: {
    entry: {
      label: "כאן מצטרפות הצעות חוק ממשלתיות והצעות מטעם ועדות הכנסת",
      detail:
        "הצעות אלה מדלגות על הקריאה הטרומית: ההכנה שלהן נעשתה עוד לפני שהגיעו לשולחן הכנסת - במשרדי הממשלה או בוועדה היוזמת - ולכן בפועל הן יכולות לעלות לקריאה הראשונה כבר יום אחרי ההנחה. הצעות ממשלתיות אף מתפרסמות בסדרה נפרדת ברשומות.",
    },
    summary:
      "הוועדה דנה בהצעה לעומק, שומעת את כל הגורמים הנוגעים בדבר ומחליטה: להמליץ למליאה להסיר אותה מסדר היום, או לאשר אותה לקריאה הראשונה.",
    facts: [{ label: "דיונים פתוחים לציבור" }, { label: "בדיקת עלות תקציבית" }],
    details: [
      {
        paragraphs: [
          "דיוני הוועדה נרשמים בפרוטוקול, וברוב המקרים פתוחים לציבור ומתפרסמים באתר הכנסת.",
          "לפני הקריאה הראשונה הוועדה חייבת לקבוע כמה יעלה יישום החוק, בעזרת נציג משרד האוצר. אפשר לבקש הערכה נוספת ממרכז המחקר והמידע של הכנסת.",
        ],
      },
      {
        intro: "״הצעת חוק תקציבית״ היא הצעה שמתקיימים בה שלושת התנאים האלה:",
        bullets: [
          // NOTE for Lotem: the ~6M NIS threshold is the September
          // 2016 figure from the source document ( the amount is
          // linked to the index and drifts over time ) - verify the
          // current number before publishing.
          "עלותה השנתית מוערכת בכ-6 מיליון ש״ח לפחות",
          "היא הצעה פרטית או מטעם ועדה",
          "הממשלה לא הסכימה לעלות",
        ],
        paragraphs: [
          "הצעה תקציבית יכולה להתקבל רק אם תמכו בה לפחות [[b|50 חברי כנסת]] - בקריאה הראשונה, בשנייה ובשלישית.",
        ],
      },
      {
        paragraphs: [
          "אם ההצעה נוגעת לילדים, דברי ההסבר יציינו את השפעתה על זכויותיהם.",
          "בסוף הדיונים, הנוסח שאישרה הוועדה מתפרסם ברשומות - הפרסום שמכונה ״הנוסח הכחול״.",
        ],
      },
    ],
  },
  first: {
    summary:
      "ההצעה חוזרת למליאה בנוסח שהכינה הוועדה. הדיון אישי - כל חבר כנסת רשאי להירשם, לדבר ולהביע עמדה - ובסופו מצביעים.",
    facts: [{ label: "רוב רגיל" }],
    details: [
      {
        paragraphs: [
          "בהצעה פרטית פותח את הדיון אחד היוזמים; בהצעה ממשלתית - השר או סגן השר שהנושא בתחום משרדו.",
          "אם ההצעה עוברת, היא נשלחת לוועדה שתכין אותה לקריאה השנייה והשלישית - בדרך כלל אותה ועדה שהכינה אותה עד כה.",
        ],
      },
    ],
    fork: {
      passLabel: "עברה - חוזרים לוועדה",
      failLabel: "לא עברה - יורדת מסדר היום",
      failNote: SIX_MONTH_NOTE,
    },
  },
  secondThirdPrep: {
    summary:
      "הוועדה עוברת על ההצעה סעיף-סעיף ומגבשת את הנוסח הסופי. בהצעות ממשלתיות זו התחנה הראשונה בוועדה. כאן גם נולדות ההסתייגויות.",
    facts: [{ label: "דיון סעיף-סעיף" }, { label: "הסתייגויות" }],
    details: [
      {
        paragraphs: [
          "מי שהציע תיקון והוועדה דחתה אותו - חבר כנסת, שר או סגן שר - יכול לבקש שהתיקון יירשם כ[[b|הסתייגות]]: היא תצורף לנוסח, תוצג במליאה ותוכרע שם בהצבעה. כל הסתייגות מקנה למגיש חמש דקות דיבור בקריאה השנייה. מי שלא הגיש הסתייגות יכול לבקש ״רשות דיבור״ - חמש דקות גם כן.",
          "תיקון שחורג מנושא ההצעה אפשר לעצור בטענת [[b|״נושא חדש״]]; ועדת הכנסת מכריעה אם הייתה חריגה.",
          "עד תום ההצבעות בוועדה, יוזם ההצעה עדיין רשאי למשוך אותה.",
          "בסיום מונח על שולחן הכנסת נוסח חדש - ה״פונץ׳-בננה״ - ובו שלושה חלקים: קורות ההצעה, הנוסח שאישרה הוועדה, וההסתייגויות.",
        ],
      },
    ],
  },
  secondThird: {
    summary:
      "הישורת האחרונה, בדרך כלל באותו ערב: בקריאה השנייה מצביעים על ההסתייגויות ועל כל סעיף; מיד אחריה, בקריאה השלישית, מצביעים על החוק כולו.",
    facts: [{ label: "הצבעה סעיף-סעיף" }, { label: "בלי דיון נוסף בשלישית" }],
    details: [
      {
        paragraphs: [
          "יושב ראש הוועדה פותח ומציג את ההצעה, ואז נואמים בעלי ההסתייגויות ומקבלי רשות הדיבור - חמש דקות כל אחד.",
          "מצביעים סעיף-סעיף: קודם על ההסתייגות ( אם הוגשה ) ואז על הסעיף - כפי שהציעה הוועדה, או בשילוב ההסתייגות שהתקבלה. על רצף סעיפים בלי הסתייגויות אפשר להצביע בהצבעה אחת.",
          "בקריאה השלישית, שמתקיימת מיד לאחר מכן, מצביעים פעם אחת על הנוסח השלם - בלי דיון נוסף. אם התקבלו הסתייגויות, אפשר לדחות אותה למועד אחר.",
          "גם כאן: הצעת חוק תקציבית נדרשת ל-50 תומכים לפחות.",
        ],
      },
    ],
    fork: {
      passLabel: "עברה - נולד חוק",
      failLabel: "לא עברה - יורדת מסדר היום",
    },
  },
};

// ─── The assembled page data ─────────────────────────────────

export const PROCESS_CHAPTERS: ProcessChapter[] = [
  {
    id: "before",
    title: "לפני המסלול - איך נולדת הצעת חוק פרטית?",
    intro:
      "רוב ההצעות שתפגשו באתר הן הצעות חוק פרטיות של חברי כנסת. עוד לפני ההצבעה הראשונה, הצעה כזאת עוברת כמה תחנות הכנה.",
    stations: BEFORE_STATIONS,
  },
  {
    id: "pipeline",
    title: "המסלול - חמש התחנות שעל כל כרטיס באתר",
    intro:
      "אלה חמשת השלבים שמופיעים על כרטיסי ההצעות באתר. הצעה פרטית עוברת את כולם; הצעות ממשלתיות והצעות מטעם ועדות הכנסת מצטרפות באמצע, בלי קריאה טרומית.",
    stations: STAGE_ORDER.map((key) => ({ id: key, stage: key, ...PIPELINE[key] })),
    outcome: {
      title: "החוק מתפרסם ברשומות",
      summary:
        "ההצעה שעברה קריאה שלישית היא עכשיו חוק. הוא מתפרסם ב״ספר החוקים״ ונכנס לתוקף ביום הפרסום - אלא אם נקבע בו מועד אחר.",
    },
  },
];

export const SPECIAL_CASES: SpecialCase[] = [
  {
    id: "merge-split",
    title: "מיזוג ופיצול",
    summary:
      "ועדה יכולה לאחד כמה הצעות דומות להצעה אחת, או לפצל הצעה אחת לכמה חלקים שיתקדמו בנפרד.",
    details: [
      {
        paragraphs: [
          "מיזוג נעשה אחרי הדיון המוקדם או אחרי הקריאה הראשונה, לרוב בין הצעות שנמצאות באותו שלב, והוועדה שדנה בהן היא שמחליטה. אפשר גם למזג הצעה שעברה דיון מוקדם עם הצעה שעברה קריאה ראשונה, ובמקרים מסוימים נדרש אישור ועדת הכנסת. אחרי המיזוג ממשיכים כהצעה אחת.",
          "פיצול הוא הכיוון ההפוך - לקדם חלקים מההצעה כהצעות חוק נפרדות - והוא דורש תמיד את אישור מליאת הכנסת.",
        ],
      },
    ],
  },
  {
    id: "continuity",
    title: "דין רציפות",
    summary:
      "הכנסת התחלפה באמצע החקיקה? הצעה שעברה קריאה ראשונה יכולה להמשיך בכנסת החדשה מהנקודה שבה נעצרה.",
    details: [
      {
        paragraphs: [
          "בהצעה פרטית נדרש שלפחות אחד מהיוזמים המקוריים יכהן גם בכנסת החדשה ויסכים להחלת הרציפות.",
          "הצעות פרטיות והצעות מטעם ועדה צריכות גם את אישור הוועדה שדנה בהן; הצעות ממשלתיות מובאות ישירות למליאה. אם המליאה מאשרת - הדיון ממשיך באותה ועדה, כאילו לא התחלפה הכנסת.",
        ],
      },
    ],
  },
  {
    id: "revision",
    title: "רביזיה - דיון מחדש",
    summary:
      "חבר ועדה שרוצה לפתוח מחדש החלטה שהוועדה קיבלה יכול לבקש רביזיה - הצבעה חוזרת.",
    details: [
      {
        paragraphs: [
          "אפשר לבקש רביזיה פעם אחת בלבד על כל החלטה, וכל עוד ההחלטה ( או הצעת החוק ) לא הונחה על שולחן הכנסת.",
          "לרביזיה שני שלבים: קודם מצביעים אם בכלל לקיים אותה. יש רוב? דנים ומצביעים מחדש לגוף העניין. אין רוב? ההחלטה המקורית נשארת על כנה.",
        ],
      },
    ],
  },
  {
    id: "faction-consultation",
    title: "התייעצות סיעתית",
    summary:
      "רגע לפני הצבעה בוועדה, כל חבר ועדה רשאי לבקש הפסקה להתייעצות עם סיעתו - וההצבעה נדחית בחמש דקות לפחות.",
    details: [
      {
        paragraphs: [
          "גם את הבקשה הזאת אפשר להגיש רק פעם אחת לכל עניין, גם אם ביקשו אותה חברים מסיעות שונות. יושב ראש הוועדה חייב להפסיק את הדיון ולדחות את ההצבעה בחמש דקות לפחות - אלא אם התבקשה דחייה קצרה יותר.",
        ],
      },
    ],
  },
  {
    id: "quotas",
    title: "מכסות סיעתיות",
    summary:
      "כמה הצעות פרטיות כל סיעה יכולה להביא להצבעה טרומית? ועדת הכנסת קובעת מכסה לכל סיעה.",
    details: [
      {
        paragraphs: [
          "המכסה נקבעת לפי גודל הסיעה ולפי מיקומה בקואליציה או באופוזיציה - סיעות האופוזיציה מקבלות מכסה גדולה יותר. כל סיעה מחלקת את המכסה בין חבריה.",
          "חשוב לדייק: המכסה מגבילה רק את מספר ההצעות שעולות [[b|להצבעה]]. אין הגבלה על מספר ההצעות שמותר [[b|להגיש]].",
        ],
      },
    ],
  },
];

export const PROCESS_SOURCE: SourceCitation = {
  title: "הליך החקיקה",
  publisher: "הלשכה המשפטית של הכנסת",
  date: "ספטמבר 2016",
  note: "הנתונים המספריים נכונים למועד פרסום המסמך.",
};
