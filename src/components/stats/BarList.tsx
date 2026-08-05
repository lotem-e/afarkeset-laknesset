// A ranked bar list: label | thin bar | value. All bars share
// ONE hue ( the brand navy ) because they encode magnitude,
// not identity - the labels already say who is who. The
// longest bar sets the scale for the rest.
import type { StatItem } from "@/content/stats";

export function BarList({ title, items }: { title: string; items: StatItem[] }) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <section className="space-y-4 rounded-3xl bg-popover p-6 shadow-sm">
      <h2 className="text-h4 text-primary">{title}</h2>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3" title={`${item.label}: ${item.count}`}>
            <span className="w-40 shrink-0 truncate text-small font-normal">{item.label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
            <span className="w-9 shrink-0 text-end text-small font-bold">{item.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
