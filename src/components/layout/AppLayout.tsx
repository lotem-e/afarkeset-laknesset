// The frame around every page: sidebar on the right, the
// page's content on the left, the user chip floating above.
//
// <Outlet /> is react-router's "hole": the router renders the
// current page ( AgendaPage, BillPage... ) exactly there, so
// the frame is written once and every route reuses it.
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FeedbackWidget } from "./FeedbackWidget";
import { Sidebar } from "./Sidebar";
import { UserChip } from "./UserChip";

// Browsers keep the scroll position when only the URL changes.
// Moving between pages should start at the top, so we reset on
// every route change.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
      <FeedbackWidget />
    </div>
  );
}
