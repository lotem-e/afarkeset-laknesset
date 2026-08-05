// The orange date tiles inside a preparation stage - one tile
// per committee discussion, each linking to its discussion
// page. "startIndex" is how many discussions earlier stages
// already had, so the link numbers keep counting across the
// whole bill ( the same numbering billDiscussions produces ).
import { Link } from "react-router-dom";
import { dateParts } from "@/lib/dates";
import type { Discussion } from "@/content/types";

interface DiscussionTilesProps {
  discussions: Discussion[];
  billId: string;
  startIndex: number;
}

export function DiscussionTiles({ discussions, billId, startIndex }: DiscussionTilesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {discussions.map((d, i) => {
        const { day, month, year } = dateParts(d.date);
        return (
          <Link
            key={d.date}
            to={`/bill/${billId}/discussion/${startIndex + i + 1}`}
            title="לעמוד הדיון"
            className="flex w-16 flex-col items-center rounded-lg bg-tile-discussion px-2 py-2 text-tile-discussion-foreground transition-transform hover:scale-105"
          >
            <span className="text-h4">{day}</span>
            <span className="text-small">{month}</span>
            <span className="text-tiny opacity-70">{year}</span>
          </Link>
        );
      })}
    </div>
  );
}
