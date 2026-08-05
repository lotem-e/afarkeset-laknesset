// =========================================================
// The tracking store - which bills the user follows.
// =========================================================
// One shared source of truth, so the sidebar badge, the cards'
// follow buttons, and the tracking page can never disagree.
//
// Two React ideas working together here:
// - CONTEXT: a value made available to the whole tree without
//   passing props level by level. TrackingProvider wraps the
//   app once; any component calls useTracking() to read it.
// - LOCALSTORAGE: the browser's little key-value drawer that
//   survives a reload. We read it once on startup and write it
//   back on every change - that is the whole "persistence".
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "knesset.trackedBillIds";

// On the very first visit there is nothing saved yet - we start
// with the judiciary bill followed, matching the Figma ( the
// sidebar badge shows 1 and its card says "אתם רשומים" ).
const FIRST_VISIT_DEFAULT = ["judiciary-basic-law"];

interface TrackingContextValue {
  trackedIds: string[];
  isTracked: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

function readStored(): string[] {
  // try / catch because localStorage can hold junk ( or be
  // blocked entirely ) - a broken value must not crash the app.
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return FIRST_VISIT_DEFAULT;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return FIRST_VISIT_DEFAULT;
  }
}

export function TrackingProvider({ children }: { children: ReactNode }) {
  // useState with a FUNCTION runs it only once, on startup -
  // that is when we read what the browser remembered.
  const [trackedIds, setTrackedIds] = useState<string[]>(readStored);

  // Write-through: any change is saved immediately.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedIds));
  }, [trackedIds]);

  const toggle = useCallback((id: string) => {
    setTrackedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const value: TrackingContextValue = {
    trackedIds,
    isTracked: (id) => trackedIds.includes(id),
    toggle,
    count: trackedIds.length,
  };

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTracking(): TrackingContextValue {
  const ctx = useContext(TrackingContext);
  // Failing loudly here beats a silent undefined three screens
  // later: the message names the exact mistake.
  if (!ctx) throw new Error("useTracking must be used inside <TrackingProvider>");
  return ctx;
}
