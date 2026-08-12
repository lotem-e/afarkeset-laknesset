// The frame around every page: sidebar on the right, the
// page's content on the left, the user chip floating above.
//
// <Outlet /> is react-router's "hole": the router renders the
// current page ( AgendaPage, BillPage... ) exactly there, so
// the frame is written once and every route reuses it.
import { useEffect } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { UserChip } from "./UserChip";

// Browsers keep the scroll position when only the URL changes.
// Moving FORWARD between pages should start at the top - but a
// back / forward navigation ( POP ) must not: the list pages
// restore their own position then, and scrolling to top here
// would fight them ( see ProgressiveBillList ).
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (navigationType !== "POP") window.scrollTo(0, 0);
  }, [pathname, navigationType]);
  return null;
}

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px] items-start gap-8 p-4">
      <ScrollToTop />
      <Sidebar />
      <main className="min-w-0 flex-1 px-2 py-8 pe-16">
        <Outlet />
      </main>
      <UserChip />
      {/* FeedbackWidget is deliberately not rendered ( Lotem,
          2026-08-12 ): the thumbs store nothing yet, and the site
          is public now - no collecting clicks into the void. The
          component stays in layout/FeedbackWidget.tsx, to return
          once feedback has a real home to be written to. */}
    </div>
  );
}
