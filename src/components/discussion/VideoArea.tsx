// The video side of the discussion page. There is no real
// footage yet, so this is an honest placeholder wearing the
// real player's clothes: the dark frame, the control bar, and
// a WORKING timeline in one direction - clicking a chapter
// moves the playhead to that chapter's position.
//
// The chapters / speakers toggle lives here too, under the
// player, exactly like the design.
import { Expand, Play, Video } from "lucide-react";
import { formatDuration } from "@/lib/dates";
import type { Discussion } from "@/content/types";
import { cn } from "@/lib/utils";

interface VideoAreaProps {
  discussion: Discussion;
  currentChapter: number | null;
  onSelectChapter: (index: number) => void;
  mode: "chapters" | "speakers";
  onModeChange: (mode: "chapters" | "speakers") => void;
  speakers: string[];
  speakerFilter: string | null;
  onSelectSpeaker: (name: string | null) => void;
}

export function VideoArea({
  discussion,
  currentChapter,
  onSelectChapter,
  mode,
  onModeChange,
  speakers,
  speakerFilter,
  onSelectSpeaker,
}: VideoAreaProps) {
  const duration = discussion.durationSec ?? 0;
  const position =
    currentChapter !== null && discussion.chapters
      ? discussion.chapters[currentChapter].at
      : 0;
  // The playhead as a percentage of the video's length.
  const progress = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <div className="min-w-0 flex-1 space-y-4">
      {/* The frame where the footage will live */}
      <div className="overflow-hidden rounded-xl bg-[var(--navy-950)]">
        <div className="flex aspect-video flex-col items-center justify-center gap-3 text-[var(--navy-400)]">
          <Video className="size-10" strokeWidth={1.5} />
          <p className="text-small font-normal">צילום הדיון יעלה בקרוב</p>
        </div>

        {/* The control bar - display only, except the timeline
            that follows chapter clicks. */}
        {duration > 0 && (
          <div className="space-y-2 px-4 pb-3">
            <div className="relative h-1 rounded-full bg-white/20" dir="ltr">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--orange-600)]"
                style={{ width: `${progress}%` }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--orange-600)]"
                style={{ left: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-tiny text-white/80" dir="ltr">
              <div className="flex items-center gap-3">
                <Play className="size-4 fill-current" />
                <span>
                  {formatDuration(position)} / {formatDuration(duration)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>1x</span>
                <Expand className="size-3.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* chapters / speakers toggle + the chips themselves */}
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 gap-1.5">
          {(["chapters", "speakers"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={cn(
                "rounded-full px-3 py-1 text-tiny font-medium transition-colors",
                mode === m
                  ? "bg-popover text-primary"
                  : "border border-white/30 text-white/80 hover:bg-white/10",
              )}
            >
              {m === "chapters" ? "פרקים" : "דוברים"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {mode === "chapters" &&
            discussion.chapters?.map((chapter, i) => (
              <button
                key={i}
                onClick={() => onSelectChapter(i)}
                className={cn(
                  "rounded-full border px-3 py-1 text-tiny transition-colors",
                  currentChapter === i
                    ? "border-transparent bg-popover font-medium text-primary"
                    : "border-white/30 text-white/90 hover:bg-white/10",
                )}
              >
                {chapter.title}
              </button>
            ))}

          {mode === "speakers" &&
            speakers.map((name) => (
              <button
                key={name}
                // Clicking the active speaker again clears the filter.
                onClick={() => onSelectSpeaker(speakerFilter === name ? null : name)}
                className={cn(
                  "rounded-full border px-3 py-1 text-tiny transition-colors",
                  speakerFilter === name
                    ? "border-transparent bg-popover font-medium text-primary"
                    : "border-white/30 text-white/90 hover:bg-white/10",
                )}
              >
                {name}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
