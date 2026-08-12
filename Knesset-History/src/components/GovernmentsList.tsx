import type { Government } from "../content/types";
import { formatRange } from "../lib/format";

// =========================================================
// The governments that served during one Knesset - PM, dates,
// and a short label when something special happened ( unity,
// rotation, transition ).
// =========================================================

export default function GovernmentsList({ governments }: { governments: Government[] }) {
  if (governments.length === 0) return null;
  return (
    <div className="mt-6 pt-5" style={{ borderTop: "1px solid var(--hairline)" }}>
      <h4 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--ink-3)" }}>
        הממשלות שכיהנו
      </h4>
      <ul className="m-0 p-0 list-none grid gap-1.5 sm:grid-cols-2">
        {governments.map((g) => (
          <li key={g.govNumber} className="flex flex-wrap items-baseline gap-x-2 text-sm">
            <span className="font-bold">
              הממשלה ה-<span className="ltr-nums">{g.govNumber}</span>
            </span>
            <span>{g.pm}</span>
            <span style={{ color: "var(--ink-3)" }}>{formatRange(g.formed, g.ended)}</span>
            {g.note && <span className="pill">{g.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
