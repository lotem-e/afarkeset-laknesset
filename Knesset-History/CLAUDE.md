# Knesset History ( הכנסת לדורותיה ) - Claude Instructions

## What this is

A single Hebrew RTL landing page that reviews ALL 25 Knessets in reverse
order ( current first, 1949 last ). Each Knesset gets a 120-seat hemicycle
infographic colored by party, with the founding coalition's seats outlined
by a dark ring, a coalition/opposition legend, the list of governments that
served, and a short Hebrew note about mid-term changes.

## Data rules ( the project's first rule )

- `src/content/knessets.json` is the single source of truth. It was compiled
  from Hebrew Wikipedia ( election + government articles ) and cross-checked:
  every Knesset sums to exactly 120, coalition slugs must reference elected
  lists, government numbers only go up. Run `npm run validate:data` after ANY
  data edit.
- Parties appear AS ELECTED ( a joint list is one entry ). When only part of
  a list joined the coalition ( splits: Blue & White 2020, Yamina 2021... ),
  `seatsInCoalition` carries the number - the seat map rings exactly that
  many seats.
- The outlined coalition = the FIRST government sworn in after that election,
  on its swearing-in day. Later joins/departures live in `notes`, not in the
  map. Knessets 21-22 formed no government: `firstGovernment: null`.
- The ORDER of equal-seat lists inside knessets.json is deliberate in a few
  places ( tie order is not a historical fact ) - it keeps colorblind-unsafe
  colors from sitting next to each other on the map. If you resort the data,
  rerun `npm run validate:colors`.

## Color system ( src/content/palette.json )

Every political family owns a hue; parties in a family are steps of it:
labor line = red, Mapam = burgundy, Ratz/Meretz = apple green, communists +
Hadash = magenta/wine, Arab lists = greens ( early satellite lists = olive /
light blue ), Herut-Gahal-Likud = royal blue, center = sky blues ( Kadima
line = orange ), old liberals = teal-cyan, religious zionism = pine green,
haredi ashkenazi = violet, Shas = periwinkle, Yisrael Beiteinu = pink,
secular/far right = ambers and browns.

`npm run validate:colors` rebuilds every Knesset's display order, checks
neighbor pairs with the dataviz validator ( CVD simulation + normal-vision
floor + chroma/lightness bands ), and hard-fails duplicate hexes inside one
chart. ALL 25 maps pass. Some light colors sit below 3:1 contrast on the
card ( WARN ) - the per-chart legend with names and seat counts is the
mandated relief, so keep the legend next to every map. Change a hex only
with the validator green.

## Structure

- `src/content/` - types, knessets.json ( data ), palette.json ( colors ),
  thin typed TS wrappers.
- `src/lib/hemicycle.ts` - pure seat-position math ( rows of arcs, largest
  remainder apportionment, fill right-to-left so the coalition grows from
  the right edge ). `src/lib/blocs.ts` - display order: full coalition desc,
  partial lists on the boundary, opposition desc. check-adjacency.mjs
  mirrors this - keep them in sync.
- `src/components/` - Hemicycle ( SVG ), Legend, KnessetSection, TimelineNav,
  GovernmentsList, Hero.
- `scripts/` - merge-data.mjs ( one-time build of knessets.json ),
  validate-data.mjs, check-adjacency.mjs, validate_palette.js ( the dataviz
  six-checks validator, vendored ).

## Stack

Vite + React 18 + TS + Tailwind v4 ( same as the sibling projects ), Heebo
via Google Fonts, `<html lang="he" dir="rtl">`. No router, no shadcn - one
page, bespoke components. Dev server: port 5186, registered as
`knesset-history` in the workspace `.claude/launch.json`.
Build: `npm run build` ( tsc first, noEmit ).

## Writing rule

No em-dashes anywhere - use " - ". Site text Hebrew; code, comments and
docs English.
