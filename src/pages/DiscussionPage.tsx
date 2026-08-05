// עמוד דיון - one committee discussion of one bill: the video
// ( placeholder for now ), its chapters, and the summary /
// transcript panel. The dark navy frame is the design's way of
// saying "you are now in the room".
//
// The URL is /bill/:id/discussion/:n - n is the discussion's
// 1-based number across the whole bill ( the same numbering
// the date tiles use ).
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { SummaryView } from "@/components/discussion/SummaryView";
import { TranscriptView } from "@/components/discussion/TranscriptView";
import { VideoArea } from "@/components/discussion/VideoArea";
import { billDiscussions, getBill } from "@/content/bills";
import { discussionOrdinal, formatDiscussionDate } from "@/lib/dates";
import { discussionsLabel } from "@/content/stages";
import { cn } from "@/lib/utils";

export function DiscussionPage() {
  const { id, n } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"summary" | "transcript">("summary");
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [mode, setMode] = useState<"chapters" | "speakers">("chapters");
  const [speakerFilter, setSpeakerFilter] = useState<string | null>(null);

  const bill = id ? getBill(id) : undefined;
  const list = bill ? billDiscussions(bill) : [];
  const num = Number(n);
  const current = list.find((d) => d.index === num);

  if (!bill || !current) {
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-h2 text-primary">לא מצאנו את הדיון הזה</h1>
        <Link to="/" className="text-p text-accent underline underline-offset-4">
          חזרה לכל הצעות החוק
        </Link>
      </div>
    );
  }

  const { discussion } = current;
  const hasContent = Boolean(discussion.summary || discussion.transcript);
  // The unique speaker names, in order of first appearance.
  const speakers = [...new Set((discussion.transcript ?? []).map((t) => t.speaker))];

  // Selecting a speaker also flips the panel to the transcript,
  // where the filter is visible.
  const selectSpeaker = (name: string | null) => {
    setSpeakerFilter(name);
    if (name) setTab("transcript");
  };

  const goTo = (index: number) => {
    // Moving to another discussion resets this one's state.
    setCurrentChapter(null);
    setSpeakerFilter(null);
    navigate(`/bill/${bill.id}/discussion/${index}`);
  };

  return (
    <div className="space-y-7">
      {/* Breadcrumb back into the bill */}
      <div className="flex items-center gap-3 text-small font-normal text-muted-foreground">
        <button
          onClick={() => navigate(`/bill/${bill.id}`)}
          className="flex size-9 items-center justify-center rounded-full bg-muted text-primary transition-colors hover:bg-stone-200"
          aria-label="חזרה לעמוד החוק"
        >
          <ArrowRight className="size-4" />
        </button>
        <span>הכנסת ה-25</span>
        <span>&lt;</span>
        <Link to={`/bill/${bill.id}`} className="hover:text-foreground hover:underline">
          {bill.name}
          {bill.subtitle ? `: ${bill.subtitle}` : ""}
        </Link>
      </div>

      {/* The dark room */}
      <div className="space-y-5 rounded-3xl bg-primary p-6">
        {/* Title + the across-discussions search ( visual ) */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-h3 text-primary-foreground">
            {bill.name}
            {bill.subtitle && <span className="font-normal">: {bill.subtitle}</span>}
          </h1>
          <div className="flex w-64 items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
            <Search className="size-4 text-white/60" />
            <input
              type="text"
              placeholder={`חיפוש בתמלילי ${discussionsLabel(list.length)}...`}
              className="w-full bg-transparent text-tiny text-white outline-none placeholder:text-white/60"
              disabled
              title="חיפוש בין כל הדיונים - בקרוב"
            />
          </div>
        </div>

        {/* Which discussion + when + previous / next */}
        <div className="flex flex-wrap items-center gap-3">
          {/* In RTL, "previous" points right and "next" points left. */}
          <button
            onClick={() => goTo(num - 1)}
            disabled={num <= 1}
            className="flex size-8 items-center justify-center rounded-full text-white/80 transition-opacity hover:bg-white/10 disabled:opacity-25"
            aria-label="הדיון הקודם"
          >
            <ChevronRight className="size-5" />
          </button>
          <span className="rounded-lg bg-popover px-3 py-1 text-small font-bold text-primary">
            דיון {discussionOrdinal(num)}
          </span>
          <span className="text-small font-normal text-white/85">
            {formatDiscussionDate(discussion.date, discussion.time)}
          </span>
          <button
            onClick={() => goTo(num + 1)}
            disabled={num >= list.length}
            className="flex size-8 items-center justify-center rounded-full text-white/80 transition-opacity hover:bg-white/10 disabled:opacity-25"
            aria-label="הדיון הבא"
          >
            <ChevronLeft className="size-5" />
          </button>
        </div>

        {/* Video on the right, the reading panel on the left */}
        <div className="flex flex-wrap items-start gap-5">
          <VideoArea
            discussion={discussion}
            currentChapter={currentChapter}
            onSelectChapter={setCurrentChapter}
            mode={mode}
            onModeChange={setMode}
            speakers={speakers}
            speakerFilter={speakerFilter}
            onSelectSpeaker={selectSpeaker}
          />

          <div className="w-[26rem] max-w-full shrink-0 space-y-4 rounded-xl bg-popover p-5">
            {hasContent ? (
              <>
                <div className="flex gap-5 border-b border-border pb-2">
                  {(["summary", "transcript"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "pb-1 text-small transition-colors",
                        tab === t
                          ? "font-bold text-primary underline underline-offset-8"
                          : "font-normal text-foreground/70 hover:text-foreground",
                      )}
                    >
                      {t === "summary" ? "תקציר הדיון" : "תמליל הדיון"}
                    </button>
                  ))}
                </div>

                <div className="max-h-[28rem] overflow-y-auto pe-1">
                  {tab === "summary" && discussion.summary && (
                    <SummaryView summary={discussion.summary} />
                  )}
                  {tab === "summary" && !discussion.summary && (
                    <p className="py-6 text-center text-small text-muted-foreground">
                      אין עדיין תקציר לדיון הזה.
                    </p>
                  )}
                  {tab === "transcript" && discussion.transcript && (
                    <TranscriptView
                      transcript={discussion.transcript}
                      speakerFilter={speakerFilter}
                    />
                  )}
                  {tab === "transcript" && !discussion.transcript && (
                    <p className="py-6 text-center text-small text-muted-foreground">
                      אין עדיין תמליל לדיון הזה.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="py-10 text-center text-small font-normal text-muted-foreground">
                התקציר והתמליל של הדיון הזה עוד לא הוזנו.
                <br />
                בינתיים אפשר לדפדף לדיונים אחרים בחצים למעלה.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
