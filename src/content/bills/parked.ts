// =========================================================
// PARKED: bills whose editorial text is kept, off the site.
// =========================================================
// pa-funds was designed as a card, but the hunt of 2026-08-12
// found that none of the six real versions of this bill ever
// cleared a preliminary reading - and Lotem's strict entry rule
// ( a bill enters only with evidence it moved PAST its first
// hurdle ) therefore keeps it off the site. Her text is parked
// here untouched; if one of the versions ever clears the
// hurdle, sync its BillID and move this into editorial/.
//
// Nothing imports this file, deliberately.
import type { Bill } from "../types";

export const parkedPaFunds: Bill = {
  id: "pa-funds",
  name: "חוק הקפאת כספים ששילמה הרשות הפלסטינית בזיקה לטרור",
  subtitle: "חילוט הכספים וניהולם",
  type: "private",
  committeeId: "foreign-defense",
  // [seed guess] initiator not visible in the Figma.
  initiators: [{ kind: "mk", mkId: "yitzhak-kroizer" }],
  summary:
    "ההצעה מבקשת לקבוע כי אם הרשות הפלסטינית תמשיך לשלם כספים למחבלים, הכספים שישראל מעבירה לה ושהוקפאו בשל כך, יחולטו וישמשו לפיצוי נפגעי טרור.",
  status: "agenda",
  stages: [
    { stage: "preliminary", state: "completed", vote: { date: "2024-07-24", inFavor: 44, against: 21, abstained: 1, absent: 54 } },
    { stage: "firstPrep", state: "inProgress", discussions: [{ date: "2024-10-08" }, { date: "2024-11-12" }, { date: "2024-12-10" }] },
    { stage: "first", state: "notReached" },
    { stage: "secondThirdPrep", state: "notReached" },
    { stage: "secondThird", state: "notReached" },
  ],
  lastUpdated: "2024-12-10",
};
