// The way back: a circled arrow + the path that led here.
// In RTL "back" points RIGHT, so the icon is ArrowRight.
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function Breadcrumb() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 text-small font-normal text-muted-foreground">
      <button
        onClick={() => navigate(-1)}
        className="flex size-9 items-center justify-center rounded-full bg-muted text-primary transition-colors hover:bg-stone-200"
        aria-label="חזרה"
      >
        <ArrowRight className="size-4" />
      </button>
      <span>הכנסת ה-25</span>
      <span>&lt;</span>
      <Link to="/" className="hover:text-foreground hover:underline">
        הצעות חוק על סדר היום
      </Link>
    </div>
  );
}
