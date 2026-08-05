// A person's circle. Real MK photos are a later asset drop -
// until then we show initials on a warm surface with the navy
// ring the design gives every portrait. Ministries get an icon
// circle instead ( see InitiatorRail ).
import { cn } from "@/lib/utils";

// "יוסף טייב" -> "יט" ( first letter of the first two words ).
function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

const SIZES = {
  sm: "size-9 text-tiny",
  md: "size-12 text-small",
  lg: "size-14 text-p",
} as const;

interface AvatarProps {
  name: string;
  size?: keyof typeof SIZES;
  // The ring color marks context: navy by default, green / orange
  // in vote rows ( for / absent ).
  ringClass?: string;
}

export function Avatar({ name, size = "md", ringClass = "ring-primary" }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-background font-bold text-primary ring-2",
        SIZES[size],
        ringClass,
      )}
    >
      {initials(name)}
    </div>
  );
}
