// The app's root: the router.
//
// BrowserRouter watches the address bar. Routes picks WHICH
// page matches the current URL. The AppLayout route wraps all
// of them, so the sidebar frame is written once and every page
// renders into its <Outlet />.
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { TrackingProvider } from "@/hooks/useTracking";
import { AgendaPage } from "@/pages/AgendaPage";
import { BillPage } from "@/pages/BillPage";
import { CompletedPage } from "@/pages/CompletedPage";
import { DiscussionPage } from "@/pages/DiscussionPage";
import { StatsPage } from "@/pages/StatsPage";
import { TrackingPage } from "@/pages/TrackingPage";

export function App() {
  return (
    // basename follows Vite's base: "/" in dev, the repo subpath
    // on GitHub Pages ( lotem-e.github.io/afarkeset-laknesset/ ).
    // The trailing slash is stripped because the router wants
    // "/afarkeset-laknesset", not "/afarkeset-laknesset/".
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      {/* TrackingProvider sits above every route, so all pages
          share the same followed-bills list. */}
      <TrackingProvider>
      <Routes>
        <Route element={<AppLayout />}>
          {/* index = the default page at "/" */}
          <Route index element={<AgendaPage />} />
          {/* ":id" is a placeholder - /bill/performers-rights
              renders BillPage with id = "performers-rights" */}
          <Route path="/bill/:id" element={<BillPage />} />
          {/* ":n" is the discussion's number across the bill */}
          <Route path="/bill/:id/discussion/:n" element={<DiscussionPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/completed" element={<CompletedPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Route>
      </Routes>
      </TrackingProvider>
    </BrowserRouter>
  );
}
