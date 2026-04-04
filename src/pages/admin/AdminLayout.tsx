import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Settings, LogOut, FileText, ShoppingBag, Users, Heart, Mail, PenTool, Calendar } from "lucide-react";

export function AdminLayout() {
  const location = useLocation();
  const path = location.pathname;

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
  ];

  const isNavActive = (item: (typeof navItems)[number]) =>
    item.end ? path === item.path : path === item.path || path.startsWith(`${item.path}/`);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex font-sans">
      <aside
        className="w-64 shrink-0 border-r border-border-primary bg-bg-primary flex flex-col sticky top-0 h-screen overflow-y-auto"
        aria-label="Navigation administration"
      >
        <div className="p-8 border-b border-border-primary">
          <Link to="/admin" className="block">
            <h1 className="font-serif text-2xl tracking-widest text-brand-gold">CP. ADMIN</h1>
          </Link>
        </div>

        <nav className="flex-grow py-8 px-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isNavActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-4 px-4 py-3 rounded-md transition-colors ${
                  active
                    ? "bg-brand-gold/10 text-brand-gold"
                    : "text-text-primary/60 hover:bg-text-primary/5 hover:text-text-primary"
                }`}
              >
                <item.icon size={20} strokeWidth={1.5} aria-hidden />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-primary mt-auto">
          <Link
            to="/"
            className="flex items-center gap-4 px-4 py-3 text-text-primary/60 hover:text-text-primary transition-colors rounded-md hover:bg-text-primary/5"
          >
            <LogOut size={20} strokeWidth={1.5} aria-hidden />
            <span className="text-sm font-medium tracking-wide">Quitter l’admin</span>
          </Link>
        </div>
      </aside>

      <main className="flex-grow min-w-0 p-6 md:p-10 lg:p-12 overflow-y-auto" id="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
