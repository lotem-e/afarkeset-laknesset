// =========================================================
// The data model - every shape of content in the product.
// =========================================================
// This file is the contract: components never invent data
// shapes, they read these. The single most important idea is
// the STAGES array on a bill - one array drives the card
// chips, the bill-page accordions, and the vote blocks, so a
// fact is never stored twice.

// ─── The legislation pipeline ────────────────────────────────
// A bill in Israel passes through up to five stations, in this
// order. Private bills start at "preliminary"; government and
// committee bills skip it and start at "firstPrep" ( which is
// why a bill's stages array MAY omit stages it never visits ).
export type StageKey =
  | "preliminary"      // קריאה טרומית
  | "firstPrep"        // הכנה לקריאה ראשונה ( בוועדה )
  | "first"            // קריאה ראשונה
  | "secondThirdPrep"  // הכנה לקריאות שנייה ושלישית ( בוועדה )
  | "secondThird";     // קריאות שנייה ושלישית

// Where a bill stands at one station:
// completed = passed it, inProgress = happening now,
// notReached = still ahead.
export type StageState = "completed" | "inProgress" | "notReached";

// A plenum vote at a reading stage. The MkIds lists are small
// SAMPLES ( the avatars shown in the UI ), not the full roster.
export interface Vote {
  date: string;        // ISO date, e.g. "2023-02-26"
  inFavor: number;     // הצביעו בעד
  against: number;     // הצביעו נגד
  abstained: number;   // נמנעו
  absent: number;      // נעדרו
  inFavorMkIds?: string[];
  againstMkIds?: string[];
  absentMkIds?: string[];
}

// One chapter of a discussion's video - a titled position on
// the timeline ( "at" is seconds from the start ).
export interface DiscussionChapter {
  title: string;
  at: number;
}

// One turn of speech in the transcript. The speaker is free
// text ( not an MK id ) because committee rooms host guests -
// ministry lawyers, lobbyists, bereaved families - who are not
// Knesset members.
export interface TranscriptEntry {
  speaker: string;     // "דוד ביטן"
  role?: string;       // "חה״כ, יו״ר ועדת הכלכלה"
  text: string;
}

// The editorial summary of a discussion: titled bullet
// sections, the ✓ conclusions, and the "what happens next"
// line.
export interface DiscussionSummary {
  sections: { title: string; bullets: string[] }[];
  conclusions?: string[];
  nextSteps?: string;
}

// A committee discussion. Only the date is required - a
// discussion becomes a full page ( video, chapters, summary,
// transcript ) the moment its optional fields are filled.
export interface Discussion {
  date: string;            // ISO date
  time?: string;           // "08:39"
  sessionId?: number;      // the Knesset's session id, when synced
  durationSec?: number;    // video length, e.g. 1:27:41 = 5261
  chapters?: DiscussionChapter[];
  summary?: DiscussionSummary;
  transcript?: TranscriptEntry[];
}

// One station of one bill: which stage, its state, and what
// happened there - a vote ( reading stages ) or discussions
// ( preparation stages ).
export interface StageProgress {
  stage: StageKey;
  state: StageState;
  vote?: Vote;
  discussions?: Discussion[];
}

// ─── Bills ───────────────────────────────────────────────────
export type BillType = "private" | "governmental" | "committee";
// על סדר היום / החקיקה הושלמה / ירדה מסדר היום
export type BillStatus = "agenda" | "completed" | "dropped";

// Who leads a bill: an MK ( private / committee bills ) or a
// government ministry ( governmental bills ).
//
// An MK can arrive two ways. A hand-written bill names an mkId
// and the details come from our own roster in mks.ts. A synced
// bill carries the name and faction it got from the Knesset, so
// it needs no roster entry at all. The rail below reads
// whichever is present.
export type Initiator =
  | {
      kind: "mk";
      mkId?: string;        // hand-written: looks up mks.ts
      personId?: number;    // synced: the Knesset's person id
      name?: string;        // synced: the name, straight from the API
      partyId?: PartyId;    // synced: resolved from the faction name
      factionName?: string; // synced: the formal faction name, for reference
    }
  | { kind: "ministry"; name: string };

// One numbered amendment on the bill page, shown as a
// two-column comparison. "current" is optional because some
// amendments introduce something new ( no existing state ).
export interface Amendment {
  title: string;       // e.g. "הקמת קרן תמיכה למבצעים ותיקים"
  current?: string;    // המצב הקיים
  proposed: string;    // ההצעה
}

// A reusable free-text block: an intro line, bullet items,
// and / or follow-up paragraphs. Rich sections on the bill page
// mix these three shapes, so one type covers them all.
// Text may carry RichText markup: [[l|טקסט]] link,
// [[h|טקסט]] highlight, [[b|טקסט]] bold.
export interface TextBlock {
  intro?: string;
  bullets?: string[];
  paragraphs?: string[];
}

// The editorial sections of a full bill page. Every field is
// optional - only fully-written bills carry them, and a missing
// section either disappears or shows an empty state
// ( "אין נתונים. עיזרו לנו להשלים" ).
export interface BillSections {
  background?: TextBlock;                       // רקע: מה זה בכלל...?
  explanation?: TextBlock;                      // הסבר על הצעת החוק
  whatChanges?: { intro?: string; items: string[] }; // מה מבקשת הכנסת לשנות עכשיו?
  amendments?: Amendment[];                     // עיקרי התיקונים בחוק
  objections?: string[];                        // התנגדויות
  comparative?: TextBlock;                      // משפט השוואתי
  budget?: TextBlock;                           // תקצוב ומימון
  historical?: TextBlock;                       // בראייה היסטורית
  process?: string;                             // על ההליך
  applicability?: string;                       // תחולה
}

export interface Bill {
  id: string;              // slug, also the URL: /bill/<id>
  billId?: number;         // the Knesset's own id, when synced
  name: string;            // the bold part before the colon
  subtitle?: string;       // the regular part after the colon
  type: BillType;
  committeeId: CommitteeId;
  initiators: Initiator[]; // first one is the card's "בהובלת"
  summary: string;         // the 2-3 line paragraph on cards
  intro?: string;          // bill-page opening ( RichText markup )
  status: BillStatus;
  stages: StageProgress[]; // in pipeline order; may omit skipped stages
  lastUpdated: string;     // ISO - "עדכון אחרון" on cards
  recentlyUpdated?: boolean; // shows the "התעדכן לאחרונה" ribbon
  completedDate?: string;  // ISO - "תאריך כניסה לספר החוקים"
  // Why a bill left the pipeline ( merged, stopped, split ).
  // Lotem's ruling: a bill that leaves stays on the site with
  // an explanation, it never silently disappears.
  offPipelineReason?: string;
  sections?: BillSections; // only fully-written bills
}

// ─── The two halves of a bill ────────────────────────────────
// A bill on this site is assembled from two sources that must
// never overwrite each other:
//
//   FACTS are what the Knesset publishes. A script writes them,
//   a human never edits them. Regenerated on every sync.
//
//   EDITORIAL is what makes a bill readable: the plain-language
//   explainer, the comparisons, the discussion summaries. A
//   human writes them, a script never touches them.
//
// They are joined by the Knesset's own bill id, which is the
// only identifier both halves can agree on.

export interface BillFacts {
  billId: number;
  syncedAt: string;        // ISO - when the sync last ran
  officialName: string;    // the full legal name, as published
  type: BillType;
  committeeId: CommitteeId;
  status: BillStatus;
  offPipelineReason?: string;
  lastUpdated: string;
  completedDate?: string;
  initiators: Initiator[];
  stages: StageProgress[];
}

// Editorial content for ONE discussion. Keyed by DATE rather
// than by position, so that discovering an earlier session in a
// later sync can never shift a summary onto the wrong day.
export interface DiscussionContent {
  durationSec?: number;
  chapters?: DiscussionChapter[];
  summary?: DiscussionSummary;
  transcript?: TranscriptEntry[];
}

export interface BillEditorial {
  billId: number;          // the join key
  id: string;              // our slug, also the URL
  name: string;
  subtitle?: string;
  summary: string;
  intro?: string;
  sections?: BillSections;
  recentlyUpdated?: boolean;
  discussions?: Record<string, DiscussionContent>; // ISO date -> content
}

// ─── Committees ──────────────────────────────────────────────
export type CommitteeId =
  | "constitution" | "economy" | "labor-welfare" | "interior-environment"
  | "finance" | "foreign-defense" | "education" | "health"
  | "national-security" | "womens-status" | "science-tech" | "aliyah"
  // ועדת הכנסת is usually procedural ( it assigns bills to other
  // committees ), but for its own domain - MK immunity, Knesset
  // affairs - it IS the handling committee, so it needs an id.
  | "knesset-committee";

export interface Committee {
  id: CommitteeId;
  name: string;        // full: "ועדת החוקה, חוק ומשפט"
  shortName: string;   // for chips: "חוקה, חוק ומשפט"
}

// ─── Parties and MKs ─────────────────────────────────────────
export type Bloc = "coalition" | "opposition";

export type PartyId =
  | "likud" | "shas" | "utj" | "rzp" | "otzma" | "noam"
  | "yesh-atid" | "national-unity" | "yisrael-beiteinu"
  | "labor" | "raam" | "hadash-taal";

export interface Party {
  id: PartyId;
  name: string;        // Hebrew: "הליכוד"
  seats: number;       // seats in the 25th Knesset ( sums to 120 )
  bloc: Bloc;
  colorVar: string;    // the group token, e.g. "--group-likud"
}

export interface MK {
  id: string;          // slug, e.g. "yosef-taieb"
  name: string;        // Hebrew: "יוסף טייב"
  partyId: PartyId;    // bloc is derived from the party
  role?: string;       // e.g. "יו״ר ועדת החינוך, התרבות והספורט"
  photo?: string;      // future: path to a real photo asset
}
