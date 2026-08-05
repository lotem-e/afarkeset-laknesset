// The floating feedback card ( bottom corner, like the design ):
// "האם מצאת את העמוד הזה מועיל?" with thumbs. The answer is
// not stored anywhere yet - the widget just says thanks and
// steps aside for the session.
import { useState } from "react";

export function FeedbackWidget() {
  const [answered, setAnswered] = useState(false);

  return (
    <div className="fixed bottom-6 end-6 z-20 w-60 rounded-2xl bg-card p-4 shadow-lg">
      {answered ? (
        <p className="text-small font-normal">תודה! המשוב עוזר לנו להשתפר.</p>
      ) : (
        <div className="space-y-2.5">
          <p className="text-small font-bold leading-5">
            נשמח לשמוע את דעתך,
            <br />
            <span className="font-normal">האם מצאת את העמוד הזה מועיל?</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setAnswered(true)}
              className="flex size-9 items-center justify-center rounded-lg bg-popover text-p shadow-sm transition-transform hover:scale-110"
              aria-label="כן, העמוד מועיל"
            >
              👍
            </button>
            <button
              onClick={() => setAnswered(true)}
              className="flex size-9 items-center justify-center rounded-lg bg-popover text-p shadow-sm transition-transform hover:scale-110"
              aria-label="לא, העמוד לא מועיל"
            >
              👎
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
