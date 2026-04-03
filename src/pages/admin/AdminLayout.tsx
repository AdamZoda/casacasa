import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Settings, LogOut, FileText, ShoppingBag, Users, BookOpen, MessageSquare, Mail, Paintbrush, Ticket, Globe } from "lucide-react";

export function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Overview", icon: LayoutDashboard },
    { path: "/admin/reservations", label: "Reservations", icon: CalendarDays },
    { path: "/admin/support", label: "Support Tickets", icon: Ticket },
    { path: "/admin/content", label: "Content (Universes)", icon: FileText },
    { path: "/admin/globalservices", label: "Global Services", icon: Globe },
    { path: "/admin/store", label: "Store (Products)", icon: ShoppingBag },
    { path: "/admin/journal", label: "Journal (Blog)", icon: BookOpen },
    { path: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
    { path: "/admin/newsletter", label: "Newsletter", icon: Mail },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/appearance", label: "Appearance", icon: Paintbrush },
    { path: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-primary bg-bg-primary flex flex-col">
        <div className="p-8 border-b border-border-primary">
          <h1 className="font-serif text-2xl tracking-widest text-brand-gold">CP. ADMIN</h1>
        </div>
        
        <nav className="flex-grow py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'text-text-primary/60 hover:bg-text-primary/5 hover:text-text-primary'}`}
              >
                <item.icon size={20} strokeWidth={1.5} />
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-primary">
          <Link to="/" className="flex items-center gap-4 px-4 py-3 text-text-primary/60 hover:text-text-primary transition-colors">
            <LogOut size={20} strokeWidth={1.5} />
            <span className="text-sm font-medium tracking-wide">Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
