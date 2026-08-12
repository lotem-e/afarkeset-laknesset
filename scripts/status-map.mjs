// =========================================================
// The Knesset's ~40 bill statuses, mapped onto our 5 stages.
// =========================================================
// This file is the single most important judgement call in the
// whole sync, so it lives on its own where it can be reviewed.
//
// Why it is needed: the Knesset marks a bill with a status code
// at every appearance in the plenum, but it never says which
// stage of the pipeline that status belongs to, and it does not
// order them. Several codes even share the same wording with
// different ids ( 101 and 108 are both "הכנה לקריאה ראשונה" ).
// So we decide, once, here.
//
// Reviewed and approved by Lotem on 2026-08-12, including the
// three judgement calls: 115 maps a bill BACK into the second-
// third preparation, 106/142 ( committee not yet assigned )
// count as first-reading preparation, and a pending merge or
// split request already counts as off-pipeline. The Hebrew
// labels in OFF_PIPELINE still await her editorial pass - that
// is wording, not mapping.

// Our five stations, in order.
export const STAGE_ORDER = [
  "preliminary",
  "firstPrep",
  "first",
  "secondThirdPrep",
  "secondThird",
];

// statusID -> the stage it belongs to.
export const STATUS_TO_STAGE = {
  // ─── קריאה טרומית ────────────────────────────────────────
  104: "preliminary", // הונחה על שולחן הכנסת לדיון מוקדם
  150: "preliminary", // במליאה לדיון מוקדם ( the reading itself )

  // ─── הכנה לקריאה ראשונה ( in committee ) ─────────────────
  106: "firstPrep", // בוועדת הכנסת לקביעת הוועדה המטפלת
  142: "firstPrep", // ( same wording, different id )
  101: "firstPrep", // הכנה לקריאה ראשונה
  108: "firstPrep", // ( same wording, different id )
  109: "firstPrep", // אושרה בוועדה לקריאה ראשונה
  167: "firstPrep", // ( same wording, different id )

  // ─── קריאה ראשונה ────────────────────────────────────────
  141: "first", // הונחה על שולחן הכנסת לקריאה ראשונה
  111: "first", // לדיון במליאה לקראת הקריאה הראשונה

  // ─── הכנה לקריאות שנייה ושלישית ──────────────────────────
  113: "secondThirdPrep", // הכנה לקריאה שנייה ושלישית
  115: "secondThirdPrep", // הוחזרה לוועדה להכנה לקריאה שלישית
  178: "secondThirdPrep", // אושרה בוועדה לקריאה שנייה-שלישית
  179: "secondThirdPrep", // ( same wording, different id )

  // ─── קריאות שנייה ושלישית ────────────────────────────────
  130: "secondThird", // הונחה על שולחן הכנסת לקריאה שנייה-שלישית
  131: "secondThird", // הונחה על שולחן הכנסת לקריאה שלישית
  114: "secondThird", // לדיון במליאה לקראת קריאה שנייה-שלישית
  117: "secondThird", // לדיון במליאה לקראת קריאה שלישית
  118: "secondThird", // התקבלה בקריאה שלישית ( became law )
};

// The status that means "this is now law". Bills carrying it
// belong on the חקיקה שהושלמה page.
export const STATUS_PASSED = 118;

// Note there is deliberately NO "passed the preliminary" status
// list here: the entry rule ( which bills make it onto the site )
// cannot be read off a single status. It is derived from the
// bill's history in passesEditorialRule() in sync-bill.mjs.
// Decided by Lotem on 2026-08-12: a bill enters only with
// evidence it moved PAST its first hurdle, so a bill rejected
// at its preliminary discussion never enters the site.

// ─── Off the pipeline ──────────────────────────────────────
// Real legislative life does not fit a straight line. These
// statuses describe a bill leaving the track, and the UI needs
// a decision for each. The value is the label we would show.
//
// Lotem's ruling ( 2026-08-04 ): a bill in one of these states
// STAYS on the site, with a note explaining what happened -
// a reader who followed a bill deserves to learn why it
// vanished. `Bill.offPipelineReason` carries the label below.
export const OFF_PIPELINE = {
  122: "מוזגה עם הצעת חוק אחרת",
  126: "לאישור מיזוג בוועדת הכנסת",
  169: "לאישור מיזוג בוועדת הכנסת",
  124: "הוסבה להצעה לסדר היום",
  177: "נעצרה",
  140: "להסרה מסדר היום לבקשת ועדה",
  143: "להסרה מסדר היום לבקשת ועדה",
  158: "לאישור פיצול במליאה",
  161: "לאישור פיצול במליאה",
  162: "לאישור פיצול במליאה",
  165: "לאישור פיצול במליאה",
  // דין רציפות - a bill carried over from a previous Knesset
  // instead of starting from scratch.
  110: "הבקשה לדין רציפות נדחתה במליאה",
  120: "לדיון במליאה על החלת דין רציפות",
  175: "בדיון בוועדה על החלת דין רציפות",
  176: "הבקשה לדין רציפות נדחתה בוועדה",
  181: "הודעה על בקשה להחלת דין רציפות",
};

// Where does this status sit in the pipeline? Returns the
// stage key, or null when the status is off-pipeline / unknown.
export function stageForStatus(statusId) {
  return STATUS_TO_STAGE[statusId] ?? null;
}

export function stageIndex(stageKey) {
  return STAGE_ORDER.indexOf(stageKey);
}
