// =========================================================
// Plenum votes, from the website's own data backend.
// =========================================================
// The official OData Votes.svc stops at the 24th Knesset, but
// the Knesset website's votes page is fed by a JSON API that
// lives on the OPEN domain ( knesset.gov.il, the same one that
// answers the OData service ) and carries current votes:
//
//   POST /WebSiteApi/knessetapi/Votes/GetVotesHeaders
//        body { SearchType: 1, FromDate, ToDate }  -> a day's votes
//   GET  /WebSiteApi/knessetapi/Votes/GetVoteDetails/<voteId>
//        -> tallies, the decision text, and every MK's vote
//
// Discovered 2026-08-05 by reading the page's own JavaScript.
// IMPORTANT HONESTY NOTE: this API is undocumented - it is the
// website's internal feed, not a published contract. It sits
// openly on the open-data domain with no protection, so using
// it politely ( a handful of requests, nightly ) is fair use of
// public data - but it can change shape without notice, which
// is why the sync fails loudly instead of guessing.

const BASE = "https://knesset.gov.il/WebSiteApi/knessetapi/Votes";

// All votes that took place on one day ( ISO date "2026-05-13" ).
export async function votesForDay(dateIso) {
  const res = await fetch(`${BASE}/GetVotesHeaders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ SearchType: 1, FromDate: dateIso, ToDate: dateIso }),
  });
  if (!res.ok) throw new Error(`GetVotesHeaders ${res.status} for ${dateIso}`);
  const body = await res.json();
  return body?.Table ?? [];
}

// One vote, in full.
export async function voteDetails(voteId) {
  const res = await fetch(`${BASE}/GetVoteDetails/${voteId}`);
  if (!res.ok) throw new Error(`GetVoteDetails ${res.status} for vote ${voteId}`);
  return res.json();
}

// Which of our stages does a vote's decision text belong to?
//
// The subtlety: a reading's closing vote often names its
// DESTINATION, not the reading that just ended. The vote that
// closes the FIRST reading reads "להעביר את הצעת החוק לוועדה
// להכנה לקריאה שניה ושלישית" - so a naive keyword match on
// "שלישית" files it under the wrong reading. The transfer
// rules therefore run FIRST, and only then the plain
// "accepted in reading X" forms. Spelling also drifts
// ( שניה / שנייה ), so the patterns allow both.
export function stageForDecision(decision) {
  if (!decision) return null;

  // Transfers - the destination tells us which reading ended:
  // to first-reading preparation  -> the preliminary just ended
  // to second/third preparation   -> the first reading just ended
  if (/להכנה לקריאה ראשונה/.test(decision)) return "preliminary";
  if (/להכנה לקריאה שנ/.test(decision)) return "first";

  // Direct forms.
  if (/טרומית|דיון מוקדם/.test(decision)) return "preliminary";
  if (/בקריאה ה?ראשונה/.test(decision)) return "first";
  if (/בקריאה ה?שנ|בקריאה ה?שלישית/.test(decision)) return "secondThird";
  return null;
}

// The tallies of one vote, translated to our Vote shape.
// The API counts only who acted ( בעד / נגד / נמנע / נוכח ולא
// הצביע ); everyone else out of the 120 was absent. "Present
// but did not vote" is folded into abstained - the closest
// honest bucket our four-way display has.
export function toVoteCounts(details) {
  const counters = {};
  for (const c of details.VoteCounters ?? []) counters[c.Title] = c.countOfResult;

  const inFavor = counters["בעד"] ?? 0;
  const against = counters["נגד"] ?? 0;
  const abstained = (counters["נמנע"] ?? 0) + (counters["נוכח ולא הצביע"] ?? 0);
  const absent = Math.max(0, 120 - (inFavor + against + abstained));
  return { inFavor, against, abstained, absent };
}

// Everything needed to attach votes to one bill: walk the days
// its readings happened, keep the votes that belong to this
// bill ( FK_ItemID is the BillID for bill items ), and for each
// reading stage keep the DECISIVE vote - the acceptance itself,
// not the amendment votes around it.
//
// billName, when given, prefilters by the header's ItemTitle: a
// marathon sitting carries hundreds of votes ( 237 on
// 2025-03-27 ), and fetching details for each hammered the API
// into rate-limiting us. Titles name the bill, so we only fetch
// details for plausible headers; FK_ItemID in the details stays
// the authoritative check. Cost if a title ever drifts from the
// bill name: that vote is missed - same degradation as a failed
// fetch, and the sync already survives that honestly.
const normalizeTitle = (s) => String(s ?? "").replace(/[^א-תA-Za-z0-9]/g, "");

export async function readingVotesForBill(billId, readingDates, billName = null) {
  const nameKey = billName ? normalizeTitle(billName).slice(0, 18) : null;
  const byStage = {};

  for (const date of readingDates) {
    const headers = await votesForDay(date);
    for (const header of headers) {
      if (nameKey && !normalizeTitle(header.ItemTitle).includes(nameKey)) continue;
      const details = await voteDetails(header.VoteId);
      const voteHeader = details.VoteHeader?.[0];
      if (!voteHeader || voteHeader.FK_ItemID !== billId) continue;

      const stage = stageForDecision(voteHeader.Decision);
      if (!stage) continue;

      const isFinal = Boolean(voteHeader.IsForAccepted) && /^לקבל/.test(voteHeader.Decision ?? "");
      const existing = byStage[stage];
      // Prefer the final acceptance vote; otherwise keep the
      // latest vote of that stage's day.
      if (existing && existing.isFinal && !isFinal) continue;

      byStage[stage] = {
        isFinal,
        vote: {
          date,
          ...toVoteCounts(details),
        },
        decision: voteHeader.Decision ?? null,
      };
    }
  }

  const out = {};
  for (const [stage, entry] of Object.entries(byStage)) out[stage] = entry.vote;
  return out;
}
