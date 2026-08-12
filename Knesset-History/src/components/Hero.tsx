// =========================================================
// The opening of the page: title, the numbers that frame the
// story, and a tiny "how to read the map" key - so the ring
// encoding is explained once, before the first chart.
// =========================================================

interface Props {
  knessetCount: number;
  governmentCount: number;
  firstElectionYear: number;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-5">
      <div className="text-3xl sm:text-4xl font-black ltr-nums leading-none">{value}</div>
      <div className="text-sm mt-1" style={{ color: "var(--ink-2)" }}>
        {label}
      </div>
    </div>
  );
}

export default function Hero({ knessetCount, governmentCount, firstElectionYear }: Props) {
  const years = new Date().getFullYear() - firstElectionYear;
  return (
    <header className="max-w-3xl mx-auto text-center px-4 pt-14 pb-10">
      <p className="text-sm font-bold tracking-wide mb-3" style={{ color: "var(--ink-3)" }}>
        מסע ויזואלי אחד, מהיום ועד 1949
      </p>
      <h1 className="m-0 text-5xl sm:text-6xl font-black leading-tight">הכנסת לדורותיה</h1>
      <p className="mt-4 text-lg leading-relaxed" style={{ color: "var(--ink-2)" }}>
        כל בחירות, כל חלוקת מושבים וכל קואליציה בתולדות המדינה - כנסת אחר כנסת,
        מהכנסת המכהנת אחורה אל הראשונה.
      </p>

      <div className="flex justify-center divide-x divide-x-reverse mt-8" style={{ borderColor: "var(--hairline)" }}>
        <Stat value={String(knessetCount)} label="כנסות" />
        <Stat value={String(governmentCount)} label="ממשלות" />
        <Stat value="120" label="מושבים" />
        <Stat value={String(years)} label="שנים" />
      </div>

      {/* How to read the map - shown once, applies to every chart below */}
      <div
        className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-8 px-5 py-3 rounded-2xl"
        style={{ background: "var(--surface)", border: "1px solid var(--hairline)" }}
      >
        <span className="text-sm font-bold">איך קוראים את המפה:</span>
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--ink-2)" }}>
          <svg width="18" height="18" viewBox="-9 -9 18 18" aria-hidden>
            <circle r="6" fill="#3565C8" stroke="var(--coalition-ring)" strokeWidth="2.2" />
          </svg>
          מושב בקואליציה
        </span>
        <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--ink-2)" }}>
          <svg width="18" height="18" viewBox="-9 -9 18 18" aria-hidden>
            <circle r="6" fill="#35A2DE" stroke="rgba(20,22,30,0.16)" strokeWidth="1" />
          </svg>
          מושב באופוזיציה
        </span>
        <span className="text-sm" style={{ color: "var(--ink-2)" }}>
          כל עיגול הוא מושב אחד, הצבע הוא הסיעה
        </span>
      </div>
    </header>
  );
}
