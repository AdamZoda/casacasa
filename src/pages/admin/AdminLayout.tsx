import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  FileText,
  ShoppingBag,
  Users,
  Heart,
  Mail,
  PenTool,
  Calendar,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { path: "/admin", label: "Vue d’ensemble", icon: LayoutDashboard, end: true },
  { path: "/admin/reservations", label: "Réservations", icon: Calendar, end: false },
  { path: "/admin/boutique", label: "Boutique", icon: ShoppingBag, end: false },
  { path: "/admin/experience-client", label: "Expérience client", icon: Heart, end: false },
  { path: "/admin/content", label: "Pays & offres", icon: FileText, end: false },
  { path: "/admin/signature", label: "Signature & éditorial", icon: PenTool, end: false },
  { path: "/admin/newsletter", label: "Newsletter", icon: Mail, end: false },
  { path: "/admin/users", label: "Utilisateurs", icon: Users, end: false },
  { path: "/admin/settings", label: "Configuration", icon: Settings, end: false },
] as const;

function isNavActive(path: string, item: (typeof navItems)[number]) {
  return item.end ? path === item.path : path === item.path || path.startsWith(`${item.path}/`);
}

type SidebarNavProps = {
  currentPath: string;
  onNavigate?: () => void;
};

function SidebarBrand() {
  return (
    <div className="p-6 md:p-8 border-b border-border-primary/80">
      <Link to="/admin" className="group block">
        <p className="text-[9px] tracking-[0.35em] font-black text-brand-gold/90 uppercase mb-1">Casa Privilege</p>
        <h1 className="font-serif text-xl md:text-2xl tracking-[0.2em] text-text-primary group-hover:text-brand-gold transition-colors">
          Console
        </h1>
      </Link>
    </div>
  );
}

function SidebarNav({ currentPath, onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex-grow py-6 px-3 flex flex-col gap-0.5" aria-label="Navigation administration">
      {navItems.map((item) => {
        const active = isNavActive(currentPath, item);
        return (
          <Link
            key={item.path}
            to={item.path}
            data-active={active ? "true" : "false"}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className="admin-nav-link"
          >
            <item.icon size={19} strokeWidth={1.5} className="shrink-0 opacity-80" aria-hidden />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="p-3 border-t border-border-primary/80 space-y-1 mt-auto">
      <Link
        to="/"
        onClick={onNavigate}
        className="admin-nav-link text-text-primary/50 hover:text-brand-gold"
      >
        <ExternalLink size={19} strokeWidth={1.5} aria-hidden />
        <span>Site public</span>
      </Link>
      <Link
        to="/"
        onClick={onNavigate}
        className="admin-nav-link text-text-primary/45 hover:text-text-primary"
      >
        <LogOut size={19} strokeWidth={1.5} aria-hidden />
        <span>Quitter l’admin</span>
      </Link>
    </div>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const path = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex font-sans">
      {/* Barre mobile */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 border-b border-border-primary bg-bg-primary/90 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-11 h-11 rounded-xl border border-border-primary text-text-primary hover:bg-text-primary/[0.04] transition-colors"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-drawer"
        >
          <Menu size={22} strokeWidth={1.5} aria-hidden />
          <span className="sr-only">Ouvrir le menu</span>
        </button>
        <span className="text-[10px] tracking-[0.25em] font-black text-brand-gold uppercase truncate">Console</span>
        <div className="w-11" aria-hidden />
      </header>

      {/* Drawer mobile */}
      <div
        id="admin-mobile-drawer"
        className={cn(
          "fixed inset-0 z-50 md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={closeMobile}
          aria-label="Fermer le menu"
        />
        <aside
          className={cn(
            "admin-sidebar absolute left-0 top-0 bottom-0 w-[min(20rem,92vw)] flex flex-col border-r border-border-primary shadow-2xl transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Menu administration"
        >
          <div className="flex items-center justify-end px-3 pt-3">
            <button
              type="button"
              onClick={closeMobile}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border-primary/80 hover:bg-text-primary/[0.05] transition-colors"
              aria-label="Fermer le menu"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
          <SidebarBrand />
          <SidebarNav currentPath={path} onNavigate={closeMobile} />
          <SidebarFooter onNavigate={closeMobile} />
        </aside>
      </div>

      {/* Sidebar bureau */}
      <aside
        className="admin-sidebar hidden md:flex w-64 xl:w-72 shrink-0 border-r border-border-primary flex-col sticky top-0 h-screen overflow-y-auto overscroll-contain"
        aria-label="Navigation administration"
      >
        <SidebarBrand />
        <SidebarNav currentPath={path} />
        <SidebarFooter />
      </aside>

      <main
        className="flex-grow min-w-0 min-h-screen px-4 py-8 sm:px-6 md:px-10 lg:px-12 lg:py-10 overflow-y-auto bg-[radial-gradient(ellipse_85%_55%_at_50%_-18%,rgba(229,169,58,0.07),transparent)] dark:bg-[radial-gradient(ellipse_80%_45%_at_50%_-12%,rgba(229,169,58,0.09),transparent)]"
        id="admin-main"
      >
        <Outlet />
      </main>
    </div>
  );
}
