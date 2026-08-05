// תמליל הדיון - who said what, with a working search.
//
// Search here is the simplest honest kind: keep the entries
// whose text or speaker contains the query, and paint the
// match yellow inside the text. The speaker chips under the
// video can also narrow this list to one voice.
import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import type { TranscriptEntry } from "@/content/types";

// Wraps every occurrence of the query with a highlight. Split
// on the query ( keeping it, via the capture group ) and mark
// the odd parts - they are the matches.
function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-stage-active px-0.5">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

interface TranscriptViewProps {
  transcript: TranscriptEntry[];
  speakerFilter: string | null;
}

export function TranscriptView({ transcript, speakerFilter }: TranscriptViewProps) {
  const [query, setQuery] = useState("");

  const visible = transcript.filter((entry) => {
    if (speakerFilter && entry.speaker !== speakerFilter) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      entry.text.toLowerCase().includes(q) || entry.speaker.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש בתמליל הדיון..."
          className="w-full bg-transparent text-small font-normal outline-none placeholder:text-muted-foreground"
        />
      </div>

      {speakerFilter && (
        <p className="text-tiny text-muted-foreground">
          מציג רק את דברי {speakerFilter} ( אפשר לבטל בלחיצה חוזרת על השם למעלה )
        </p>
      )}

      <div className="space-y-4">
        {visible.map((entry, i) => (
          <div key={i} className="flex gap-3">
            <Avatar name={entry.speaker} size="sm" />
            <div className="min-w-0 space-y-0.5">
              <p className="text-small font-bold leading-5">
                <Highlighted text={entry.speaker} query={query} />
                {entry.role && (
                  <span className="ms-2 font-normal text-muted-foreground">{entry.role}</span>
                )}
              </p>
              <p className="text-small font-normal leading-6">
                <Highlighted text={entry.text} query={query} />
              </p>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="py-6 text-center text-small text-muted-foreground">
            לא נמצאו תוצאות בתמליל.
          </p>
        )}
      </div>
    </div>
  );
}
