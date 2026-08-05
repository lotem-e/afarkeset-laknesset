# Afarkeset LaKnesset ( אפרכסת לכנסת ) - Product Requirements Document

Draft 1, 2026-08-04. A living document - updated whenever we make a decision.

---

## 1. What it is

A Hebrew website that makes the Israeli Knesset's legislative activity accessible
to ordinary people. Every bill on the agenda is presented in plain language: what
it changes, who leads it, where it stands in the pipeline, what was said in
committee discussions - without requiring legal literacy or hours of digging
through the official Knesset site.

The name is a wordplay: "אפרכסת" ( ear trumpet / earpiece ) - a device for
listening to the Knesset.

Designed fully in Figma by Lotem ( the "Knesset Frame 3" file is the source of
truth for look and behavior ). This repo is the MVP implementation of that design.

## 2. Why it exists

Legislation shapes daily life, but the official sources are built for
professionals: legal phrasing, scattered protocols, no plain-language summaries.
The product bets that if you show a bill as a card with a clear title, a
simple explanation, a visual pipeline ( where it stands ), and a "follow" button,
citizens will actually engage with the legislative process.

## 3. Persona

A curious citizen with no legal background. Reads Hebrew news, hears about a
bill, wants to understand: what does it actually change? who is behind it?
how close is it to becoming law? Wants to follow specific bills over time.

## 4. Scope of the MVP

Desktop-first. Built so far:

1. **על סדר היום ( Agenda )** - all bills currently in the pipeline, as cards,
   filterable by committee.
2. **עמוד הצעת חוק ( Bill page )** - the core value: plain-language explainer,
   "current state vs. the proposal" comparisons, objections, comparative law,
   budget, votes, and stage-by-stage progress with discussions.
3. **מעקב החקיקה שלי ( My tracking )** - bills the user follows, with counts by
   state. Persisted in localStorage; no accounts.
4. **חקיקה שהושלמה ( Completed )** - bills that became law.
5. **סטטיסטיקות ( Statistics )** - a 120-seat hemicycle by party + bar lists
   ( bills per committee, per status, coalition vs. opposition, top initiators ).
6. **עמוד דיון ( Discussion page )** - one committee discussion: a video
   placeholder wearing the real player's frame ( the timeline follows chapter
   clicks ), chapter and speaker chips, an editorial summary, and a searchable
   transcript with per-speaker filtering. Reached from the date tiles on a bill
   page; arrows move between a bill's discussions. Route:
   `/bill/:id/discussion/:n` ( n counts across the whole bill ).
7. **חלון הפילטרים ( Filters window )** - the dark modal from the פילטרים
   button: hot bills ( navigate to the bill ), committees ( applies the page
   filter ), and informational tabs for status / MKs / parties / bloc, plus a
   search box that narrows the visible list.

Out of MVP ( designed in Figma, planned later ): real discussion footage; the
פיקוח ( oversight ) section; global search; filtering by status / MK / party;
real Knesset API data; accounts and real notifications; mobile layout.

## 4a. Real data

The Knesset's open API is now connected for one bill as a proven pattern. The
architecture, the measured numbers, the editorial rules, and the rollout are in
`SYNC-PLAN.md`. The short version: facts sync nightly and a human never edits
them, editorial is hand-written and a script never touches it, and they join on
the Knesset's own bill id. The one hard gap is vote counts, which the Knesset
does not publish for the current Knesset at all.

## 5. Content model

All content is typed TypeScript data in `src/content/` - no backend. Bills
follow the real 5-stage pipeline: קריאה טרומית → הכנה לקריאה ראשונה → קריאה
ראשונה → הכנה לקריאות שנייה ושלישית → קריאות שנייה ושלישית. One `stages` array
per bill drives the card chips, the bill-page accordions, and the vote blocks.

Seeded with ~12 bills transcribed from the Figma design ( two fully written:
performers' rights, Basic Law: the Judiciary amendment 3 ). Display aggregates
( "513 bills", committee bar numbers ) are hardcoded to match the design and
marked as illustrative until a real API exists. Political seed data ( party
seats, MK roles, votes ) needs Lotem's verification pass.

## 6. Design system

Heebo everywhere, RTL, warm cream surfaces with a navy brand color and an indigo
accent. Two-layer token base ( Canon-compatible ):

- **Primitives** - the raw palette from Figma, in `styles/tokens/primitives.css`.
- **Semantic tokens** - roles in `styles/tokens/semantic.css`, including project
  roles: the stage states ( done / active / pending ), the completed-bill card,
  comparison panels, discussion tiles, the ribbon.
- **Groups** - one color per Knesset party in `styles/tokens/groups.css`
  ( drives the hemicycle ).
- **Typography roles** - `styles/tokens/typography.css`, letter-spacing 0 for
  Hebrew, weights capped at 700.
- **Button** - `src/components/ui/button.tsx` ( shadcn base-nova ).

## 7. Tech stack

React + TypeScript, Vite, Tailwind v4, shadcn/ui ( base-nova ), react-router-dom
( routes: `/`, `/bill/:id`, `/tracking`, `/completed`, `/stats` ). Local, single
user, no backend. Dev server on port 5184.

## 8. Open questions

- Real data: the Knesset OData API exists but has no plain-language content;
  the editorial layer ( explainers, comparisons ) is the product and stays
  hand-written either way. When and how to sync the factual layer is open.
- Notifications: the design shows "הרשמה לעדכונים" - MVP records the follow
  locally; how updates actually reach users ( email? ) is undecided.
- MK photos: initials avatars for now; real photos need sourcing and rights.
