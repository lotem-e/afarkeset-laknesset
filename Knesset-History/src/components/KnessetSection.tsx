import type { Knesset } from "../content/types";
import { displayParties, coalitionTotal } from "../lib/blocs";
import { formatFullDate, yearOf } from "../lib/format";
import Hemicycle from "./Hemicycle";
import Legend from "./Legend";
import GovernmentsList from "./GovernmentsList";

// =========================================================
// One full Knesset: header, seat map, legend, governments and
// notes - a self-contained card the page stacks 25 times.
// =========================================================

interface Props {
  knesset: Knesset;
  // The year the NEXT Knesset was elected ( = this one's last year ),
  // null for the current Knesset.
  termEndYear: number | null;
}

export default function KnessetSection({ knesset, termEndYear }: Props) {
  const parties = displayParties(knesset);
  const coalition = coalitionTotal(knesset);
  const hasGov = knesset.firstGovernment !== null;
  const startYear = yearOf(knesset.electionDate);

  return (
    <section id={`k-${knesset.n}`} className="scroll-mt-20" aria-label={`הכנסת ה-${knesset.n}`}>
      <div className="knesset-card p-5 sm:p-8">
        {/* Header: number, term years, election date, special badge */}
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
          <h2 className="m-0 text-2xl sm:text-3xl font-black leading-none">
            הכנסת ה-<span className="ltr-nums">{knesset.n}</span>
          </h2>
          <span className="text-lg font-bold" style={{ color: "var(--ink-3)" }}>
            {termEndYear === null ? (
              <>
                <span className="ltr-nums">{startYear}</span> - היום
              </>
            ) : termEndYear !== startYear ? (
              <span className="ltr-nums">{`${startYear}-${termEndYear}`}</span>
            ) : (
              <span className="ltr-nums">{startYear}</span>
            )}
          </span>
          <span className="pill">נבחרה ב-{formatFullDate(knesset.electionDate)}</span>
          {!hasGov && (
            <span
              className="pill font-bold"
              style={{ color: "#8a4b0f", borderColor: "#d9b98c", background: "#f9efdd" }}
            >
              לא הורכבה ממשלה
            </span>
          )}
        </header>

        {/* Seat map + legend, side by side on wide screens */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <Hemicycle
            parties={parties}
            coalitionSize={coalition}
            hasGovernment={hasGov}
            knessetNumber={knesset.n}
          />
          <Legend parties={parties} hasGovernment={hasGov} />
        </div>

        <GovernmentsList governments={knesset.governments} />

        {knesset.notes && (
          <p className="mt-4 mb-0 text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
            {knesset.notes}
          </p>
        )}
      </div>
    </section>
  );
}
