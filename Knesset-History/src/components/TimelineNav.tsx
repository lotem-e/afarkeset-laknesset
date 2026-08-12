import { useEffect, useState } from "react";
import type { Knesset } from "../content/types";
import { yearOf } from "../lib/format";

// =========================================================
// The sticky strip of Knesset numbers ( 25 ... 1 ) at the top.
// Clicking a chip scrolls to that Knesset; an IntersectionObserver
// watches the sections and highlights the one you are reading.
// =========================================================

export default function TimelineNav({ knessets }: { knessets: Knesset[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    // The observer fires whenever a section enters or leaves a thin
    // horizontal band near the top of the viewport - the section
    // inside that band is the "current" one.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
          setActive(Number(top.target.id.replace("k-", "")));
        }
      },
      { rootMargin: "-10% 0px -75% 0px" }
    );
    for (const k of knessets) {
      const el = document.getElementById(`k-${k.n}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [knessets]);

  return (
    <nav className="timeline-nav" aria-label="ניווט בין הכנסות">
      <div className="max-w-5xl mx-auto flex gap-1 overflow-x-auto px-4 py-2">
        {knessets.map((k) => (
          <a
            key={k.n}
            href={`#k-${k.n}`}
            className={`timeline-chip${active === k.n ? " active" : ""}`}
          >
            <span className="n ltr-nums">{k.n}</span>
            <span className="y ltr-nums">{yearOf(k.electionDate)}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
