// The app's navigation - a rounded panel fixed to the right
// ( this is an RTL app, so "start" = right ). Structure, top to
// bottom: logo, search, the Knesset-25 nav tree, and the
// "חדשים במשכן?" link pinned to the bottom.
import { NavLink } from "react-router-dom";
import { ChevronDown, Landmark, Search } from "lucide-react";
import { useTracking } from "@/hooks/useTracking";
import { cn } from "@/lib/utils";

// One nav row. NavLink knows by itself if its route is the
// current one and hands us `isActive` - that is the whole
// reason we use it instead of a plain <a>.
function NavItem({
  to,
  label,
  badge,
}: {
  to: string;
  label: string;
  badge?: number;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-between rounded-lg px-3 py-1.5 text-small font-normal transition-colors",
          isActive
            ? "font-bold text-primary underline underline-offset-8"
            : "text-foreground/80 hover:bg-stone-200/60 hover:text-foreground",
        )
      }
    >
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="flex size-5 items-center justify-center rounded-md bg-accent text-tiny font-bold text-accent-foreground">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  // The live count of followed bills - the same store the
  // cards write to, so the badge updates the moment you follow.
  const { count: trackedCount } = useTracking();

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-3xl bg-muted p-5">
      {/* Logo */}
      <div className="flex items-center gap-2.5 ps-1">
        <Landmark className="size-7 text-primary" strokeWidth={1.7} />
        <span className="text-h4 text-primary">אפרכסת לכנסת</span>
      </div>

      {/* Search - visual only in the MVP */}
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-background px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="נושא, ועדה, חברי כנסת או מפלגה..."
          className="w-full bg-transparent text-tiny outline-none placeholder:text-muted-foreground"
          disabled
        />
      </div>

      {/* Nav tree */}
      <nav className="mt-6 space-y-5 overflow-y-auto">
        <button className="flex w-full items-center gap-1.5 ps-1 text-large text-primary">
          <span>הכנסת ה-25</span>
          <ChevronDown className="size-4" />
        </button>

        <div className="space-y-1">
          <p className="ps-3 pb-1 text-small font-bold text-primary">חקיקה</p>
          <NavItem to="/" label="על סדר היום" />
          <NavItem to="/tracking" label="מעקב החקיקה שלי" badge={trackedCount} />
          <NavItem to="/completed" label="חקיקה שהושלמה" />
          <NavItem to="/stats" label="סטטיסטיקות" />
        </div>

        <div className="space-y-1">
          <p className="ps-3 pb-1 text-small font-bold text-primary">פיקוח</p>
          {/* Designed but out of the MVP - stays visibly "soon". */}
          <p className="ps-3 text-small font-normal text-muted-foreground">בקרוב...</p>
        </div>
      </nav>

      {/* Pinned to the bottom */}
      <div className="mt-auto pt-4">
        <button className="ps-3 text-small font-normal text-foreground/80 underline underline-offset-4 hover:text-foreground">
          חדשים במשכן?
        </button>
      </div>
    </aside>
  );
}
