import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { WhatsAppFab } from "./WhatsAppButton";

export function PublicLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
