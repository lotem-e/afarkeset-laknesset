// עיקרי התיקונים בחוק - one amendment at a time, as a numbered
// card with the two-column comparison:
//   המצב הקיים ( quiet gray panel ) | ההצעה ( indigo-tinted )
// Arrows move between amendments. An amendment that introduces
// something new has no "current" column - the proposal then
// spans the full width.
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RichText } from "@/components/shared/RichText";
import type { Amendment } from "@/content/types";
import { cn } from "@/lib/utils";

function ArrowButton({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  // RTL: "previous" is to the RIGHT, "next" is to the LEFT.
  const Icon = dir === "prev" ? ChevronRight : ChevronLeft;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary transition-opacity disabled:opacity-25"
      aria-label={dir === "prev" ? "התיקון הקודם" : "התיקון הבא"}
    >
      <Icon className="size-5" />
    </button>
  );
}

export function AmendmentCarousel({ amendments }: { amendments: Amendment[] }) {
  const [index, setIndex] = useState(0);
  const amendment = amendments[index];

  return (
    <div className="flex items-center gap-2">
      <ArrowButton dir="prev" onClick={() => setIndex(index - 1)} disabled={index === 0} />

      <div className="min-w-0 flex-1 space-y-4 rounded-2xl bg-popover p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-small font-bold text-secondary-foreground">
            {index + 1}
          </span>
          <h4 className="text-h4 text-primary">{amendment.title}</h4>
        </div>

        <div className="flex gap-4">
          {amendment.current && (
            <div className="flex-1 space-y-2 rounded-xl bg-panel-current p-4">
              <p className="text-small font-bold text-muted-foreground">המצב הקיים</p>
              <p className="text-small font-normal leading-6">
                <RichText text={amendment.current} />
              </p>
            </div>
          )}
          <div className="flex-1 space-y-2 rounded-xl bg-panel-proposed p-4">
            <p className="text-small font-bold text-accent">ההצעה</p>
            <p className="text-small font-normal leading-6">
              <RichText text={amendment.proposed} />
            </p>
          </div>
        </div>

        {/* Position dots - which amendment out of how many */}
        <div className="flex justify-center gap-1.5 pt-1">
          {amendments.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "size-2 rounded-full transition-colors",
                i === index ? "bg-primary" : "bg-border",
              )}
              aria-label={`תיקון ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <ArrowButton
        dir="next"
        onClick={() => setIndex(index + 1)}
        disabled={index === amendments.length - 1}
      />
    </div>
  );
}
