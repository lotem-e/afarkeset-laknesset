// The tab row of the tracking page: each tab is a label with a
// bold count ( "הכל 15" ), the active one bold + underlined.
// Generic on purpose - it renders whatever tabs the page hands
// it and reports clicks back up.
import { cn } from "@/lib/utils";

export interface CountTab {
  key: string;
  label: string;
  count: number;
}

interface CountTabsProps {
  tabs: CountTab[];
  value: string;
  onChange: (key: string) => void;
}

export function CountTabs({ tabs, value, onChange }: CountTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 border-b border-border pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "flex items-center gap-1.5 text-small transition-colors",
            value === tab.key
              ? "font-bold text-primary underline underline-offset-[14px]"
              : "font-normal text-foreground/70 hover:text-foreground",
          )}
        >
          <span>{tab.label}</span>
          <span className="font-bold">{tab.count}</span>
        </button>
      ))}
    </div>
  );
}
