import { Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { isPathHidden } from "../lib/hiddenPages";
import { PageUnavailable } from "../pages/PageUnavailable";

const EXEMPT_PREFIXES = ["/auth", "/profile"];

function isExemptFromHiddenCheck(pathname: string): boolean {
  if (pathname === "/auth" || pathname === "/profile") return true;
  return EXEMPT_PREFIXES.some((p) => pathname.startsWith(`${p}/`));
}

export function PublicPageGuard() {
  const { pathname } = useLocation();
  const { settings } = useAppContext();

  if (isExemptFromHiddenCheck(pathname)) {
    return <Outlet />;
  }

  if (isPathHidden(pathname, settings.hiddenPages ?? [])) {
    return <PageUnavailable />;
  }

  return <Outlet />;
}
