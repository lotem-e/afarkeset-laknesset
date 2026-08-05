// The filter row above list pages: the "פילטרים" button
// ( visual for now - the full drawer is post-MVP ), the "הכל"
// chip, one chip per committee, and an arrow that scrolls the
// row when chips overflow.
//
// The row does not filter anything ITSELF - it only reports
// the chosen committee up to the page ( value / onChange ),
// and the page filters its own list. UI announces, data
// decides.
import { useRef } from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Chip } from "@/components/shared/Chip";
import { committees } from "@/content/committees";
import type { CommitteeId } from "@/content/types";

interface FilterChipsProps {
  value: CommitteeId | null; // null = "הכל"
  onChange: (next: CommitteeId | null) => void;
  // The פילטרים button's job: ask the page to open the drawer.
  onOpenFilters: () => void;
}

export function FilterChips({ value, onChange, onOpenFilters }: FilterChipsProps) {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onOpenFilters}
        className="flex shrink-0 items-center gap-2 rounded-full bg-secondary px-4 py-2 text-small text-secondary-foreground transition-colors hover:bg-[var(--cream-400)]"
      >
        <SlidersHorizontal className="size-4" />
        <span>פילטרים</span>
      </button>

      <span className="h-6 w-px bg-border" />

      <div
        ref={scroller}
        className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button onClick={() => onChange(null)}>
          <Chip variant={value === null ? "solid" : "outline"}>הכל</Chip>
        </button>
        {committees.map((c) => (
          <button key={c.id} onClick={() => onChange(c.id)}>
            <Chip variant={value === c.id ? "solid" : "outline"}>{c.shortName}</Chip>
          </button>
        ))}
      </div>

      <button
        onClick={() => scroller.current?.scrollBy({ left: -320, behavior: "smooth" })}
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background shadow-sm"
        aria-label="גלילה לעוד פילטרים"
      >
        <ArrowLeft className="size-4 text-primary" />
      </button>
    </div>
  );
}
