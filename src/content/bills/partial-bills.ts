// =========================================================
// Card-level bills - title, summary, committee, stages.
// =========================================================
// These fill the lists so the product feels real. Summaries
// were transcribed from Lotem's Figma cards; bills marked
// "dropped" round out the "ירדו מסדר היום" tab.
//
// NOTE for Lotem: initiators marked [seed guess] were NOT
// visible in the Figma - they are plausible placeholders and
// must be verified or replaced.
import type { Bill } from "../types";

export const partialBills: Bill[] = [
  // ─── On the agenda ─────────────────────────────────────────
  {
    id: "hospitals-mental-health",
    name: "חוק התחשבנות בין בתי חולים לקופות חולים",
    subtitle: "בריאות הנפש",
    type: "governmental",
    committeeId: "health",
    initiators: [{ kind: "ministry", name: "משרד הבריאות" }],
    summary:
      "הסדרת אופן ההתחשבנות בין קופות החולים לבתי החולים המספקים שירותי אשפוז פסיכיאטריים. ההצעה מבקשת לקבוע כללים ברורים לתשלומים, מוודאת חלוקה הוגנת של תקציבים, ומגדירה מנגנוני פיקוח ותמריצים לשיפור השירותים. מטרתה להבטיח זמינות ואיכות גבוהה יותר של שירותי בריאות הנפש.",
    status: "agenda",
    // Governmental bill - skips the preliminary reading.
    stages: [
      { stage: "firstPrep", state: "completed", discussions: [{ date: "2024-05-06" }, { date: "2024-05-20" }] },
      { stage: "first", state: "completed", vote: { date: "2024-06-12", inFavor: 58, against: 12, abstained: 2, absent: 48 } },
      {
        stage: "secondThirdPrep",
        state: "inProgress",
        discussions: [
          { date: "2024-09-02" }, { date: "2024-09-16" }, { date: "2024-10-14" },
          { date: "2024-11-04" }, { date: "2024-11-18" }, { date: "2024-12-09" },
          { date: "2025-01-06" }, { date: "2025-01-27" }, { date: "2025-02-17" },
          { date: "2025-03-10" },
        ],
      },
      { stage: "secondThird", state: "notReached" },
    ],
    lastUpdated: "2025-03-12",
    recentlyUpdated: true,
  },
  {
    id: "pregnancy-grant",
    name: "חוק הביטוח הלאומי",
    subtitle: "תשלום גמלה לשמירת היריון",
    type: "private",
    committeeId: "labor-welfare",
    initiators: [{ kind: "mk", mkId: "aida-touma-sliman" }],
    summary:
      "החוק מציע לבטל את הדרישה הנוכחית של 30 ימי שמירת היריון רצופים כתנאי לקבלת גמלה. מבוטחת בשמירת היריון תהיה זכאית לגמלה עבור כל יום שבו נעדרה מעבודתה בשל שמירת היריון, בכפוף לאישורים רפואיים ותנאים שנקבעו. הזכאות אינה מותנית ברף מינימלי של ימים אלא נקבעת בהתאם לצורך הרפואי, כפי שיוחלט על ידי הגורם הרפואי המוסמך.",
    status: "agenda",
    stages: [
      { stage: "preliminary", state: "completed", vote: { date: "2024-11-27", inFavor: 31, against: 0, abstained: 0, absent: 89 } },
      { stage: "firstPrep", state: "inProgress", discussions: [{ date: "2024-12-23" }, { date: "2025-01-21" }] },
      { stage: "first", state: "notReached" },
      { stage: "secondThirdPrep", state: "notReached" },
      { stage: "secondThird", state: "notReached" },
    ],
    lastUpdated: "2025-01-21",
  },
  {
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
  },
  {
    id: "mk-immunity",
    name: "חוק חסינות חברי הכנסת, זכויותיהם וחובותיהם",
    subtitle: "אישור הכנסת לפתיחה בהליך פלילי או אזרחי",
    type: "private",
    committeeId: "constitution",
    // [seed guess] initiator not visible in the Figma.
    initiators: [{ kind: "mk", mkId: "dan-illouz" }],
    summary:
      "חקירה פלילית או תביעה אזרחית נגד חבר כנסת תתאפשר רק באישור הכנסת ברוב של 90 מחבריה.",
    status: "agenda",
    stages: [
      { stage: "preliminary", state: "inProgress" },
      { stage: "firstPrep", state: "notReached" },
      { stage: "first", state: "notReached" },
      { stage: "secondThirdPrep", state: "notReached" },
      { stage: "secondThird", state: "notReached" },
    ],
    lastUpdated: "2025-02-25",
  },

  // ─── Completed legislation ─────────────────────────────────
  {
    id: "aviation-services",
    name: "חוק שירותי תעופה",
    subtitle: "פיצוי וסיוע בשל ביטול טיסה או שינוי בתנאיה",
    type: "governmental",
    committeeId: "economy",
    initiators: [{ kind: "ministry", name: "משרד הכלכלה" }],
    summary:
      "החוק נועד לתת מענה לאתגרים שנוצרו במערכת התעופה הישראלית במהלך מלחמת \"חרבות ברזל\" והשלכותיה: ביטול חובת הפיצוי הכספי בטיסות שבוטלו בתקופה המיידית שלאחר פרוץ המלחמה, קיצור תקופת ההודעה המוקדמת על ביטול טיסה בתקופה שלאחריה, ושמירת שירותי הסיוע וההחזר הכספי לנוסעים ללא שינוי.",
    status: "completed",
    stages: [
      { stage: "firstPrep", state: "completed", discussions: [{ date: "2024-01-15" }, { date: "2024-01-29" }] },
      { stage: "first", state: "completed", vote: { date: "2024-02-19", inFavor: 71, against: 0, abstained: 0, absent: 49 } },
      {
        stage: "secondThirdPrep",
        state: "completed",
        discussions: [
          { date: "2024-04-15" }, { date: "2024-05-13" }, { date: "2024-06-10" },
          { date: "2024-09-09" }, { date: "2024-12-16" },
        ],
      },
      { stage: "secondThird", state: "completed", vote: { date: "2025-02-10", inFavor: 66, against: 0, abstained: 0, absent: 54 } },
    ],
    lastUpdated: "2025-02-10",
    completedDate: "2025-02-10",
  },
  {
    id: "crime-orgs",
    name: "חוק הגנה על הציבור מפני ארגוני פשיעה",
    type: "private",
    committeeId: "national-security",
    initiators: [{ kind: "mk", mkId: "tzvika-fogel" }],
    summary:
      "חוק זה מאפשר לבית המשפט להוציא צווי הגבלה שיפוטיים נגד אנשים המקושרים לארגוני פשיעה, במקרים שבהם קיים חשש ממשי לביטחונם של אחרים. הצווים עשויים לכלול מגבלות על תנועה, תקשורת עם אנשים מסוימים, שימוש באינטרנט או איסור יציאה מהארץ. תוקף הצווים מוגבל לחודשיים, אך ניתן להאריכם עד שישה חודשים, בכפוף לשיקול דעתו של בית המשפט.",
    status: "completed",
    stages: [
      { stage: "preliminary", state: "completed", vote: { date: "2023-11-15", inFavor: 39, against: 8, abstained: 0, absent: 73 } },
      {
        stage: "firstPrep",
        state: "completed",
        discussions: [
          { date: "2024-01-08" }, { date: "2024-02-05" }, { date: "2024-03-04" },
          { date: "2024-04-08" }, { date: "2024-05-06" },
        ],
      },
      { stage: "first", state: "completed", vote: { date: "2024-06-05", inFavor: 52, against: 30, abstained: 1, absent: 37 } },
      {
        stage: "secondThirdPrep",
        state: "completed",
        discussions: [
          { date: "2024-07-15" }, { date: "2024-09-16" }, { date: "2024-10-21" }, { date: "2024-11-25" },
        ],
      },
      { stage: "secondThird", state: "completed", vote: { date: "2025-01-01", inFavor: 55, against: 41, abstained: 0, absent: 24 } },
    ],
    lastUpdated: "2025-01-01",
    completedDate: "2025-01-01",
  },
  {
    id: "dogs-supervision",
    name: "חוק להסדרת הפיקוח על כלבים",
    subtitle: "הוראת שעה - חרבות ברזל",
    type: "governmental",
    committeeId: "economy",
    initiators: [{ kind: "ministry", name: "משרד הכלכלה" }],
    summary:
      "החוק נועד לתת מענה לבעיית הכלבים המשוטטים שהחריפה בעקבות הלחימה בעוטף עזה במבצע \"חרבות ברזל\". אלפי כלבים משוטטים חדרו לישראל מרצועת עזה, והם מהווים סכנה לביטחון הציבור, לבני אדם ולבעלי חיים, כמו גם להתפשטות מחלות כדוגמת כלבת.",
    status: "completed",
    stages: [
      { stage: "firstPrep", state: "completed", discussions: [{ date: "2024-09-30" }] },
      { stage: "first", state: "completed", vote: { date: "2024-10-28", inFavor: 61, against: 0, abstained: 0, absent: 59 } },
      {
        stage: "secondThirdPrep",
        state: "completed",
        discussions: [{ date: "2024-11-11" }, { date: "2024-11-25" }, { date: "2024-12-09" }],
      },
      { stage: "secondThird", state: "completed", vote: { date: "2025-01-01", inFavor: 58, against: 3, abstained: 0, absent: 59 } },
    ],
    lastUpdated: "2025-01-01",
    completedDate: "2025-01-01",
  },
  {
    id: "equal-opportunities",
    name: "חוק שוויון ההזדמנויות בעבודה",
    subtitle: "הארכת תקופת ההתיישנות",
    type: "private",
    committeeId: "labor-welfare",
    initiators: [{ kind: "mk", mkId: "aida-touma-sliman" }],
    summary:
      "החוק מרחיב את תקופת ההתיישנות להגשת תביעה על הפרת הוראות חוק שוויון ההזדמנויות בעבודה. במקום שלוש שנים כפי שהיה נהוג עד כה, התיקון קובע כי תקופת ההתיישנות תעמוד על חמש שנים.",
    status: "completed",
    stages: [
      { stage: "preliminary", state: "completed", vote: { date: "2024-03-06", inFavor: 28, against: 0, abstained: 0, absent: 92 } },
      { stage: "firstPrep", state: "completed", discussions: [{ date: "2024-05-27" }] },
      { stage: "first", state: "completed", vote: { date: "2024-07-01", inFavor: 47, against: 0, abstained: 0, absent: 73 } },
      { stage: "secondThirdPrep", state: "completed", discussions: [{ date: "2024-10-30" }] },
      { stage: "secondThird", state: "completed", vote: { date: "2025-01-01", inFavor: 51, against: 0, abstained: 0, absent: 69 } },
    ],
    lastUpdated: "2025-01-01",
    completedDate: "2025-01-01",
  },

  // ─── Dropped from the agenda ───────────────────────────────
  {
    id: "school-boycott",
    name: "חוק למניעת חרם חברתי בבתי ספר",
    type: "private",
    committeeId: "education",
    // [seed guess] initiator not visible in the Figma.
    initiators: [{ kind: "mk", mkId: "limor-son-har-melech" }],
    summary:
      "הגדרת חרם חברתי, מינוי ממונה בבית הספר, הקמת מוקד פניות, מתן סיוע פסיכולוגי ושינוי בחוק זכויות התלמיד.",
    status: "dropped",
    stages: [
      { stage: "preliminary", state: "completed", vote: { date: "2024-06-19", inFavor: 25, against: 12, abstained: 0, absent: 83 } },
      { stage: "firstPrep", state: "inProgress", discussions: [{ date: "2024-09-23" }, { date: "2024-11-05" }] },
      { stage: "first", state: "notReached" },
      { stage: "secondThirdPrep", state: "notReached" },
      { stage: "secondThird", state: "notReached" },
    ],
    lastUpdated: "2024-11-05",
  },
  {
    id: "police-documentation",
    name: "חוק לתיקון פקודת המשטרה",
    subtitle: "תיעוד חזותי של השימוש באמצעים לפיזור הפגנות",
    type: "private",
    committeeId: "national-security",
    // [seed guess] initiator not visible in the Figma.
    initiators: [{ kind: "mk", mkId: "yulia-malinovsky" }],
    summary:
      "חיוב המשטרה בתיעוד חזותי של השימוש באמצעים לפיזור הפגנות, כדי לאפשר בקרה ציבורית ומשפטית על הפעלת הכוח.",
    status: "dropped",
    stages: [
      { stage: "preliminary", state: "inProgress" },
      { stage: "firstPrep", state: "notReached" },
      { stage: "first", state: "notReached" },
      { stage: "secondThirdPrep", state: "notReached" },
      { stage: "secondThird", state: "notReached" },
    ],
    lastUpdated: "2024-09-18",
  },
];
