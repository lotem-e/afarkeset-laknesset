// =========================================================
// The MKs the seed content references.
// =========================================================
// Only members that actually appear in the seeded bills ( as
// initiators or in vote avatar rows ). Names, factions, and
// roles were transcribed from Lotem's Figma design.
//
// NOTE for Lotem: party assignments and committee roles are
// seed data - verify each before publishing.
import type { MK } from "./types";

export const mks: MK[] = [
  // Initiators of seeded bills
  { id: "yosef-taieb",        name: "יוסף טייב",          partyId: "shas",             role: "יו״ר ועדת החינוך, התרבות והספורט" },
  { id: "yonatan-mishriki",   name: "יונתן מישרקי",       partyId: "shas" },
  { id: "tsega-melaku",       name: "צגה מלכו",           partyId: "likud" },
  { id: "simcha-rothman",     name: "שמחה רוטמן",         partyId: "rzp",              role: "יו״ר ועדת חוק, חוקה ומשפט" },
  { id: "aida-touma-sliman",  name: "עאידה תומא-סלימאן",  partyId: "hadash-taal" },
  { id: "tzvika-fogel",       name: "צביקה פוגל",         partyId: "otzma" },
  { id: "yitzhak-kroizer",    name: "יצחק קרויזר",        partyId: "otzma" },
  { id: "limor-son-har-melech", name: "לימור סון הר מלך", partyId: "otzma" },
  { id: "dan-illouz",         name: "דן אילוז",           partyId: "likud" },

  // Appear in vote avatar rows
  { id: "yuli-edelstein",     name: "יולי אדלשטיין",      partyId: "likud" },
  { id: "zeev-elkin",         name: "זאב אלקין",          partyId: "national-unity" },
  { id: "walid-taha",         name: "ווליד טאהא",         partyId: "raam" },
  { id: "avigdor-liberman",   name: "אביגדור ליברמן",     partyId: "yisrael-beiteinu" },
  { id: "yulia-malinovsky",   name: "יוליה מלינובסקי",    partyId: "yisrael-beiteinu" },
  { id: "sharon-nir",         name: "שרון ניר",           partyId: "yisrael-beiteinu" },
  { id: "yinon-azoulay",      name: "ינון אזולאי",        partyId: "shas" },
  { id: "walid-alhwashla",    name: "ואליד אלהואשלה",     partyId: "raam" },
];

export function getMk(id: string): MK | undefined {
  return mks.find((m) => m.id === id);
}
