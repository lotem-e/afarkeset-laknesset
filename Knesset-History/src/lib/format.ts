// =========================================================
// Hebrew date helpers. We store ISO dates in the data and let
// the browser's own Intl API render them in Hebrew - no
// hand-written month tables to maintain.
// =========================================================

const fullDate = new Intl.DateTimeFormat("he-IL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const monthYear = new Intl.DateTimeFormat("he-IL", {
  month: "long",
  year: "numeric",
});

export function formatFullDate(iso: string): string {
  return fullDate.format(new Date(iso));
}

export function formatMonthYear(iso: string): string {
  return monthYear.format(new Date(iso));
}

// "דצמבר 2022 - כיום" for a still-serving government.
export function formatRange(fromIso: string, toIso: string | null): string {
  const from = formatMonthYear(fromIso);
  return toIso ? `${from} - ${formatMonthYear(toIso)}` : `${from} - כיום`;
}

export function yearOf(iso: string): number {
  return new Date(iso).getFullYear();
}
