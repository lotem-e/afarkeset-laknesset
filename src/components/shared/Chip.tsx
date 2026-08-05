// The small pill used all over the product: bill-type badges,
// stage states, filter buttons.
//
// This is the cva ( class-variance-authority ) pattern, the
// same one Button uses: one base class string + named variants.
// A component asks for <Chip variant="stageDone"> and cva
// assembles the right classes. Adding a look = adding a line
// here, not touching any component.
import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-small whitespace-nowrap",
  {
    variants: {
      variant: {
        // bill type: "הצעת חוק פרטית" - the darker beige chip
        type: "bg-secondary text-secondary-foreground",
        // the three pipeline states
        stageDone: "bg-stage-done text-stage-done-foreground",
        stageActive: "bg-stage-active text-stage-active-foreground",
        stagePending: "bg-stage-pending text-stage-pending-foreground",
        // filter chips: quiet outline vs the selected solid navy
        outline: "rounded-full border border-primary/30 bg-transparent px-4 py-1.5 text-primary",
        solid: "rounded-full bg-primary px-4 py-1.5 text-primary-foreground",
      },
    },
    defaultVariants: { variant: "type" },
  },
);

interface ChipProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

export function Chip({ className, variant, ...props }: ChipProps) {
  return <span className={cn(chipVariants({ variant, className }))} {...props} />;
}
