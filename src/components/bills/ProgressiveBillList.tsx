// The list that grows as you approach its end - infinite
// scrolling with the guardrails Lotem set ( 2026-08-12 ):
//
//   1. an initial batch instead of every card ( 459 cards in one
//      mount was the page's whole performance cost ),
//   2. a quiet "מוצגות X מתוך Y" line so the scope stays visible
//      - the one good thing numbered pagination would have given,
//   3. a filter switch starts the new list fresh,
//   4. and the critical one: full position restoration on the
//      core flow list -> bill -> back, so returning lands exactly
//      where you left, with the same cards loaded.
//
// Data is already in memory ( the corpus ships in the bundle ),
// so "loading more" is a synchronous render batch - no spinner,
// no network, no jank.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigationType } from "react-router-dom";
import { BillCard } from "@/components/bills/BillCard";
import { useTracking } from "@/hooks/useTracking";
import type { Bill } from "@/content/types";

const BATCH = 30;

// One memory slot per list+filter, module-scoped: it survives
// route changes ( that is the whole point ) and resets on a full
// reload, which is exactly the lifetime "back restores my place"
// needs.
const listMemory = new Map<string, { count: number; scrollY: number }>();

// The browser's own popstate restore fights a list that mounts
// shorter than it was when the user left; we restore ourselves.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

interface ProgressiveBillListProps {
  bills: Bill[];
  // e.g. "agenda:economy" - the memory key. Include the filter,
  // so each filtered view remembers its own place.
  listKey: string;
  emptyMessage: string;
}

export function ProgressiveBillList({ bills, listKey, emptyMessage }: ProgressiveBillListProps) {
  const navType = useNavigationType();
  const { isTracked, toggle } = useTracking();

  // On a back/forward navigation, pick up where this exact list
  // left off; on a fresh visit, start with one batch.
  const restoredRef = useRef(navType === "POP" ? listMemory.get(listKey) : undefined);
  const [count, setCount] = useState(restoredRef.current?.count ?? BATCH);

  // Filter switched ( the key changed while mounted ): the new
  // list starts fresh. This is React's documented render-phase
  // reset for state that derives from props.
  const [prevKey, setPrevKey] = useState(listKey);
  if (prevKey !== listKey) {
    setPrevKey(listKey);
    setCount(BATCH);
  }

  // Put the scroll back before the browser paints, so the
  // restoration is invisible.
  useLayoutEffect(() => {
    const saved = restoredRef.current;
    if (saved) window.scrollTo(0, saved.scrollY);
  }, []);

  // Remember this list's state CONTINUOUSLY while scrolling -
  // not at unmount. At unmount time the browser has already
  // swapped the DOM for the (much shorter) next page and clamped
  // the scroll to it, so reading window.scrollY then records the
  // clamp, not the place the user actually was. The clamp's own
  // scroll event fires asynchronously, after our listener is
  // gone, so it can never overwrite the true position.
  const countRef = useRef(count);
  countRef.current = count;
  const keyRef = useRef(listKey);
  keyRef.current = listKey;
  useEffect(() => {
    const record = () => {
      listMemory.set(keyRef.current, {
        count: countRef.current,
        scrollY: window.scrollY,
      });
    };
    window.addEventListener("scroll", record, { passive: true });
    return () => window.removeEventListener("scroll", record);
  }, []);

  // A batch load without further scrolling must also be
  // remembered ( scroll events alone would miss it ).
  useEffect(() => {
    const saved = listMemory.get(keyRef.current);
    listMemory.set(keyRef.current, {
      count,
      scrollY: saved?.scrollY ?? window.scrollY,
    });
  }, [count]);

  // The sentinel: an empty marker after the list. When it comes
  // within ~a screen of the viewport, render the next batch.
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || count >= bills.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setCount((c) => Math.min(c + BATCH, bills.length));
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, bills.length]);

  const visible = bills.slice(0, count);

  return (
    <div className="space-y-6">
      {visible.map((bill) => (
        <BillCard
          key={bill.id}
          bill={bill}
          subscribed={isTracked(bill.id)}
          onToggleSubscribe={() => toggle(bill.id)}
        />
      ))}

      {bills.length === 0 && (
        <p className="py-10 text-center text-p text-muted-foreground">{emptyMessage}</p>
      )}

      {bills.length > 0 && (
        <p aria-live="polite" className="pt-2 text-center text-small font-normal text-muted-foreground">
          {count >= bills.length
            ? `מוצגות כל ${bills.length} ההצעות`
            : `מוצגות ${count} מתוך ${bills.length} הצעות`}
        </p>
      )}

      <div ref={sentinelRef} aria-hidden="true" />
    </div>
  );
}
