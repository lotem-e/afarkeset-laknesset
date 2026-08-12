// The little icon next to "ועדה מטפלת" - one per committee,
// like the design's cart ( economy ) and gavel ( constitution ).
// Content stays pure data; this UI-side map is where a
// committee id meets a lucide icon.
import {
  Baby,
  Building2,
  ClipboardCheck,
  Coins,
  FlaskConical,
  Gavel,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Landmark,
  type LucideIcon,
  Pill,
  Plane,
  Puzzle,
  Shield,
  ShoppingCart,
  Siren,
  TreePine,
  Users,
} from "lucide-react";
import type { CommitteeId } from "@/content/types";

export const COMMITTEE_ICONS: Record<CommitteeId, LucideIcon> = {
  constitution: Gavel,
  economy: ShoppingCart,
  "labor-welfare": HandHeart,
  "interior-environment": TreePine,
  finance: Coins,
  "foreign-defense": Shield,
  education: GraduationCap,
  health: HeartPulse,
  "national-security": Siren,
  "womens-status": Users,
  "science-tech": FlaskConical,
  aliyah: Plane,
  "knesset-committee": Landmark,
  "state-control": ClipboardCheck,
  "public-projects": Building2,
  "children-rights": Baby,
  "drugs-alcohol": Pill,
  special: Puzzle,
};
