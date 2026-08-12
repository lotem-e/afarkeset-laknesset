import type { Family } from "./types";
import raw from "./palette.json";

// =========================================================
// Party colors - the visual language of the whole site.
//
// The system: every political FAMILY owns a hue, and parties
// inside a family are lightness steps of that hue. That keeps
// the story readable across the decades: the labor line is
// always red, Herut-Gahal-Likud is always royal blue, the
// haredi parties are always purple, and so on - even when a
// party changes its name between elections.
//
//   labor line .............. reds
//   Mapam / Ratz / Meretz ... greens
//   communist + Arab lists .. deep greens, mints, olives
//   Herut -> Gahal -> Likud . royal blue
//   center parties .......... sky blues ( the Kadima line = orange )
//   old liberal stream ...... teals
//   religious zionism ....... indigos
//   haredi ashkenazi ........ purples
//   Shas ( + Tami ) ......... light periwinkles
//   Russian-olim parties .... plums
//   secular + far right ..... bronzes and browns
//
// The hex values live in palette.json so the node validation
// scripts can read the SAME data the app renders. Anchors are
// shared with the Afarkeset LaKnesset app where they fit
// ( likud, shas, labor, yesh-atid, raam, hadash-taal, state-camp ).
//
// Editing a color? Run `npm run validate:colors` - it checks every
// Knesset's seat-map neighbors for colorblind-safe separation.
// =========================================================

export const familyColors = raw.families as Record<Family, string>;
export const partyColors = raw.parties as Record<string, string>;

// The one lookup the components use: explicit party color first,
// family fallback second - so a newly added party is never invisible.
export function partyColor(slug: string, family: Family): string {
  return partyColors[slug] ?? familyColors[family];
}
