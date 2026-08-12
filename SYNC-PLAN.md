# Connecting the site to real Knesset data

Written 2026-08-04, after a working spike. This is the plan for replacing the
seeded content with live data from the Knesset's open API, and it is a living
document like the PRD.

---

## 1. The idea the whole plan rests on

A bill on this site is made of **two halves with completely different
economics**, and keeping them apart is the entire architecture.

**Facts** are what the Knesset publishes: which bills exist, who initiated them,
which committee holds them, when discussions sat, where each bill stands. This
is mechanical, it changes daily, and a script owns it. A human never edits it.

**Editorial** is what makes a bill readable: the plain-language explainer, the
"current state vs. the proposal" comparisons, the objections, the comparative
law, the discussion summaries. **This is the product.** The Knesset does not
publish it and never will. A human owns it, and a script never touches it.

The two are joined by the Knesset's own `BillID`, the only identifier both
halves can agree on. In the repo:

```
src/content/bills/
├── facts/<billId>.ts        generated, never hand-edited
├── editorial/<slug>.ts      hand-written, never script-edited
└── merge.ts                 the only place they meet
```

`merge.ts` states the rule out loud: facts win on matters of record ( status,
dates, initiators ), editorial wins on matters of presentation ( display name,
summary, explainers ). That is what lets a nightly sync run without ever
damaging writing.

---

## 2. What the spike proved

Run `node scripts/spike-sync.mjs 2203845` to reproduce any of this.

**The API is live, open, and needs no key.**
`knesset.gov.il/Odata/ParliamentInfo.svc` holds bills, people, factions,
committees, committee sessions and plenum sessions. One bill takes about a
second to assemble; all 7,491 bills of the 25th Knesset take about a minute.

**The pipeline has to be derived, not read.** The API stores a bill's *current*
status only. But `KNS_PlmSessionItem` records the status at **every appearance
in the plenum**, and that is the history. Milestones come from there.

**Preparation stages are bounded by the readings around them.** A preparation
stage happens inside a committee, so it never appears in the plenum and has no
date of its own. A committee session belongs to the preparation for the first
reading if it sat before that reading, and to the preparation for the second and
third if it sat after. This was the one real bug in the spike and the fix is the
core of `deriveStages()`.

**The derivation matches reality.** For bill 2203845 it produced all five
stages, correctly dated, with 8 and 15 committee sessions in the right
preparations - and all six discussion dates drawn in the Figma appear in it.

---

## 3. The editorial rules ( decided 2026-08-04 )

**Which bills enter the site.** A bill enters once it has cleared its **first
real hurdle**: a preliminary reading for private bills, a first reading for
government and committee bills, which skip the preliminary by law. Measured
against the 25th Knesset:

| | |
|---|---|
| bills in the 25th Knesset | 7,491 |
| tabled, never voted on - excluded | 4,566 |
| **on the site** | **~1,800** |

The rule removes 61% of the corpus as noise, which is exactly its job.

**Sharpened 2026-08-12, Lotem's ruling.** "Cleared" means evidence the bill
moved PAST the hurdle - a later stage reached by milestone, committee
session, or current status. A bill discussed at its preliminary reading and
rejected there never enters: it died at the door, it did not leave the
pipeline mid-way. The spike-era check in `sync-bill.mjs` reads "at least as
far as the hurdle"; `sync-all` must implement the strict version, and the
~1,800 estimate may shift slightly because of boundary bills. On the same
day Lotem approved the status map itself ( `scripts/status-map.mjs` ),
including its three judgement calls; only the Hebrew off-pipeline labels
still await her wording pass.

**Which bills get a full page.** Everything that passes the rule syncs as a
card. Only a curated few carry hand-written explainers - the `sections` field is
optional precisely for this. The curation rule itself is still open ( see §7 ).

**Bills that leave the pipeline stay.** A bill that is merged, stopped or split
keeps its page and carries an explanation, because someone was following it and
deserves to learn why it vanished. `Bill.offPipelineReason` holds the reason and
the tracking page's "ירדו מסדר היום" tab already has a home for them. In the
25th Knesset that is 1,557 bills: 1,193 stopped, 355 merged, 8 converted, 1
split.

---

## 4. How the sync runs

**At build time, never at page load.** The site stays static and instant, and it
cannot break when the Knesset's servers are slow or down. A GitHub Action runs
nightly: fetch, normalise, write the `facts/` files, rebuild, deploy. If nothing
changed, nothing is committed.

**The output is TypeScript, not JSON**, typed as `BillFacts`. If the Knesset
ever returns a committee or status we have not mapped, `npm run build` fails
loudly instead of the site quietly showing nonsense. `scripts/sync-bill.mjs`
already throws on an unmapped committee for exactly this reason.

**Everything the API says in its own vocabulary is translated in one place**,
`scripts/knesset-maps.mjs`: committee ids ( which are per-Knesset ), bill types,
and faction names. Factions matter more than expected - the API returns the full
legal name, so ש"ס arrives as "התאחדות הספרדים שומרי תורה תנועתו של מרן הרב
עובדיה יוסף זצ"ל" and is matched on a distinctive fragment rather than an exact
string, which would break on a stray space.

**Status decisions live in `scripts/status-map.mjs`**, alone, because that file
is a product decision wearing a data decision's clothes. It currently covers
100% of the statuses actually present in the 25th Knesset.

---

## 5. Rollout

**Phase 1 - the pattern, on one bill. DONE.** `scripts/` holds a working sync;
`performers-rights` is split into facts + editorial and renders real data.

**Phase 2 - the curated set.** Point the remaining seeded bills at their real
`BillID`s, split each into facts + editorial, and re-run. Roughly a dozen bills.
Ends with every hand-written bill on the site carrying real dates and real
initiators.

**Phase 3 - sync everything.** A `sync-all.mjs` that walks the 25th Knesset,
applies the entry rule, and writes a thin facts file per qualifying bill. Bills
without editorial render as cards; the bill page shows the pipeline and an
honest note that the explainer is not written yet. This is where the site stops
being a demo.

**Phase 4 - nightly automation. BUILT 2026-08-12** as
`.github/workflows/nightly-sync.yml`: every morning at 05:30 Israel time it
runs `sync-all` ( the long tail ) and `sync-curated` ( the eleven, votes
included ), commits ONLY `src/content/bills/facts` and only when something
moved, then rebuilds and republishes itself - a push made with the workflow's
own token cannot trigger deploy.yml, so the nightly carries its own deploy
steps. Diff-aware writing ( `write-if-changed.mjs`, shared by both sync
scripts ) ignores the syncedAt stamp, so a quiet night truly ends with no
commit. Still open from the original idea: the change log - stamping each
bill with what changed and when, so "הרשמה לעדכונים" means something without
a backend ( the browser remembers when you last looked ).

**Phase 5 - the derived statistics. DONE 2026-08-12.** `src/content/stats.ts`
now computes every aggregate from the synced corpus at build time - header
counts ( 459 / 573 / 1310 ), bills per committee, active bills per station,
bloc submission counts, party affiliation, top initiators. The exports kept
their names so no consumer moved. Honest method note in the file: initiator
stats count the LEAD initiators the sync stores ( up to three per long-tail
bill ), so collaboration counts cross-bloc lead teams, not every co-signer.
The real numbers retired two illustrative fictions loudly: the opposition
submits far more than the demo's "9" ( 231 entered bills ), and the busiest
initiator is Kroizer, not Son Har-Melech.

---

## 6. Known gaps, honestly

**Vote counts: SOLVED ( 2026-08-05 ), with one honest asterisk.**

The history of this gap, kept because the reasoning matters. The official
`Votes.svc` stops at the 24th Knesset, July 2021. The website's votes page
( `main.knesset.gov.il/Activity/plenum/Votes` - the page the Figma was designed
from ) carries current votes but sits behind a commercial bot-protection layer
that blanks any non-browser request. The first conclusion was therefore
"hand-enter votes and email the Knesset".

That conclusion was wrong, and the fix came from reading the page's own
JavaScript instead of scraping its HTML: the page is only a shell, and its DATA
comes from a JSON API on the **open** domain - the same `knesset.gov.il` that
serves the OData - with no protection at all:

```
POST /WebSiteApi/knessetapi/Votes/GetVotesHeaders   { SearchType, FromDate, ToDate }
GET  /WebSiteApi/knessetapi/Votes/GetVoteDetails/<voteId>
```

`GetVoteDetails` returns the tallies, the decision text, **the bill's own id**
( `FK_ItemID` = our `BillID`, for bill items ), and every MK's individual vote
with name and faction. Verified end to end on bill 2203845: first reading
8-0 on 13.5.2025, third reading 19-0 on 13.5.2026, now rendered live on the
bill page. `scripts/knesset-votes.mjs` owns this; the sync asks about reading
days it already knows from the milestones, so it costs a handful of requests
per bill.

Two things this taught us about the data itself:

- **A closing vote names its destination, not its reading.** The vote that ends
  the first reading reads "להעביר את הצעת החוק לוועדה להכנה לקריאה שניה
  ושלישית", so naive keyword matching files it under the wrong reading.
  `stageForDecision()` handles the transfer forms first.
- **A sitting that runs past midnight registers its votes on the next
  calendar day.** ( Corrected 2026-08-12 - this bullet previously blamed a
  show of hands. ) Our demo bill's preliminary sat on 19.7.2023 and its vote
  is registered on 20.7; it surfaced the moment `readingDays()` started
  asking about each reading day AND the day after. The recovered tally is
  23-0 - exactly the Figma's "23/0", which was real after all. The same fix
  recovered the 67-1 third reading of bill 2201200 at the end of a 237-vote
  marathon night; a title prefilter in `knesset-votes.mjs` keeps the request
  count polite on such nights. Show-of-hands readings may still exist
  elsewhere - a stage without a recorded vote stays honestly empty.

The asterisk: **this API is undocumented** - the website's internal feed, not a
published contract. It lives openly on the open-data domain, so polite nightly
use of public data is fair; but it can change shape without notice. The sync
therefore treats votes as an enhancement: a failure there degrades to "no
tallies", never to a broken sync. Emailing the Knesset to add current votes to
the official OData service is still worth doing - it would turn this from an
open side door into a front door.

**Transcripts are the dirtiest work.** Committee protocols are published as
`.doc` files with loose speaker attribution. Parsing them into
`TranscriptEntry[]` is a project of its own.

**Video and chapters are not in the API at all.** Chapters will stay
hand-authored or model-drafted from a protocol.

**Committee roles are not usable from the API.** The "יו״ר ועדת החינוך" line
under an MK's name still comes from our own roster in `mks.ts`.

---

## 7. Still open

**The curation rule** - what earns a hand-written page, given that ~1,800 bills
qualify for the site and explainers are expensive. By committee? By what is
moving? By Lotem's own pick?

**The editorial workflow** - who writes the explainers and how. A
"model drafts from the protocol, Lotem edits and approves" flow is what would
take this from a dozen bills to a few hundred, and it is the single decision
that determines whether the project is alive in a year.

**Name spelling drift** - the API spells צגה מלקו where the Figma had צגה מלכו.
Synced names win, but it is worth knowing they will occasionally differ from
what was drawn.
