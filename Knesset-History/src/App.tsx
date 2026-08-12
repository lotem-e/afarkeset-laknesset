import { knessets } from "./content/knessets";
import { yearOf } from "./lib/format";
import Hero from "./components/Hero";
import TimelineNav from "./components/TimelineNav";
import KnessetSection from "./components/KnessetSection";

// =========================================================
// The landing page: hero, sticky timeline, and one card per
// Knesset in reverse order - the current Knesset first, the
// Constituent Assembly of 1949 last.
// =========================================================

export default function App() {
  // Newest first. The data file is sorted ascending, so copy + reverse.
  const sorted = [...knessets].sort((a, b) => b.n - a.n);

  // Derived, never stored: how many governments in total, and when
  // each Knesset's term ended ( = the next Knesset's election year ).
  const totalGovernments = knessets.reduce((sum, k) => sum + k.governments.length, 0);
  const firstElectionYear = yearOf(sorted[sorted.length - 1].electionDate);

  return (
    <>
      <Hero
        knessetCount={knessets.length}
        governmentCount={totalGovernments}
        firstElectionYear={firstElectionYear}
      />

      <TimelineNav knessets={sorted} />

      <main className="max-w-5xl mx-auto px-4 py-10 grid gap-10">
        {sorted.map((k, i) => (
          <KnessetSection
            key={k.n}
            knesset={k}
            termEndYear={i === 0 ? null : yearOf(sorted[i - 1].electionDate)}
          />
        ))}
      </main>

      <footer
        className="max-w-5xl mx-auto px-4 pb-14 pt-4 text-sm leading-relaxed"
        style={{ color: "var(--ink-3)", borderTop: "1px solid var(--hairline)" }}
      >
        <p className="m-0">
          הקואליציה המסומנת בכל כנסת היא הרכבה ביום השבעת הממשלה הראשונה של אותה
          כנסת; הצטרפויות ופרישות מאוחרות מסופרות בהערות. חלוקת המושבים מוצגת כפי
          שנבחרה בקלפי - רשימה משותפת מופיעה כרשימה אחת.
        </p>
        <p className="mt-2 mb-0">
          המקורות: ויקיפדיה העברית ואתר הכנסת. נבנה עם React בידי לוטם, באהבה לדמוקרטיה הישראלית.
        </p>
      </footer>
    </>
  );
}
