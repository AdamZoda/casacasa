import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { Users, Calendar, TrendingUp, ShoppingBag, FileText, Clock, Mail, Package } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AdminCard,
  AdminPageHeader,
  AdminStatusPill,
  adminOrderStatusTone,
  adminReservationStatusTone,
} from "../../components/admin/adminShared";

export function Dashboard() {
  const { reservations, products, orders, journalPosts, subscribers, profiles } = useAppContext();

  const { stats, recentReservations, recentOrders } = useMemo(() => {
    const br = reservations
      .filter((res) => res.status === "confirmed")
      .reduce((acc, res) => acc + (Number(res.total_price) || 0), 0);
    const or = orders
      .filter((o) => o.status === "completed" || o.status === "pending")
      .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const totalRevenue = br + or;
    const st = [
      { label: "Chiffre d'affaires (estim.)", value: `${totalRevenue.toLocaleString("fr-FR")} MAD`, icon: TrendingUp, color: "text-brand-gold" },
      { label: "Commandes boutique", value: orders.length, icon: Package, color: "text-blue-500" },
      { label: "Réservations", value: reservations.length, icon: Calendar, color: "text-green-500" },
      { label: "Profils", value: profiles.length, icon: Users, color: "text-purple-500" },
    ];
    const rr = [...reservations]
      .sort((a, b) => {
        const ta = Date.parse(a.created_at) || 0;
        const tb = Date.parse(b.created_at) || 0;
        return tb - ta;
      })
      .slice(0, 4);
    const ro = [...orders]
      .sort((a, b) => {
        const ta = Date.parse(a.created_at) || 0;
        const tb = Date.parse(b.created_at) || 0;
        return tb - ta;
      })
      .slice(0, 4);
    return {
      stats: st,
      recentReservations: rr,
      recentOrders: ro,
    };
  }, [reservations, orders, profiles.length]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <AdminPageHeader
          kicker="Vue d’ensemble"
          title="Tableau de bord"
          subtitle="Indicateurs consolidés (données chargées depuis Supabase)"
        />
        <div className="flex items-center gap-2 text-text-primary/40 text-[10px] uppercase tracking-widest font-black italic shrink-0">
          <Clock size={14} aria-hidden /> Session locale
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
        {stats.map((stat) => (
          <AdminCard
            key={stat.label}
            padding="lg"
            className="group hover:border-brand-gold/35 transition-all duration-500 hover:-translate-y-0.5"
          >
            <div className="flex justify-between items-start mb-8">
              <div
                className={`p-3.5 rounded-2xl bg-text-primary/[0.04] ${stat.color} border border-border-primary/50 group-hover:border-current/25 transition-all`}
              >
                <stat.icon size={22} strokeWidth={1} />
              </div>
            </div>
            <p className="text-[9px] text-text-primary/45 uppercase tracking-[0.3em] font-black mb-2">{stat.label}</p>
            <h3 className="text-3xl md:text-4xl font-serif text-text-primary tracking-tight">{stat.value}</h3>
          </AdminCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <AdminCard padding="lg" className="flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h3 className="text-xl md:text-2xl font-serif italic text-balance">Réservations récentes</h3>
            <Link
              to="/admin/reservations"
              className="text-[9px] uppercase tracking-widest font-black text-brand-gold hover:text-text-primary transition-colors shrink-0 border-b border-brand-gold/25 pb-0.5"
            >
              Tout voir
            </Link>
          </div>
          <div className="space-y-3 flex-grow">
            {recentReservations.map((res) => (
              <div
                key={res.id}
                className="flex justify-between items-center gap-3 p-4 rounded-xl bg-text-primary/[0.025] border border-border-primary/30 hover:border-brand-gold/20 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 shrink-0 bg-brand-gold/12 flex items-center justify-center text-brand-gold rounded-xl border border-brand-gold/20">
                    <Calendar size={18} strokeWidth={1} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium truncate">{res.name ?? "—"}</p>
                    <p className="text-text-primary/40 text-[9px] uppercase tracking-widest font-semibold truncate mt-0.5">
                      {(res.activity_title && String(res.activity_title)) || "Activité"} · {res.date ?? "—"}
                    </p>
                  </div>
                </div>
                <AdminStatusPill tone={adminReservationStatusTone(res.status)} className="shrink-0">
                  {res.status}
                </AdminStatusPill>
              </div>
            ))}
            {recentReservations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-text-primary/25">
                <Calendar size={36} strokeWidth={0.5} className="mb-3" />
                <p className="text-sm italic tracking-widest">Aucune réservation récente</p>
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard padding="lg" className="flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h3 className="text-xl md:text-2xl font-serif italic text-balance">Commandes boutique</h3>
            <Link
              to="/admin/boutique"
              className="text-[9px] uppercase tracking-widest font-black text-brand-gold hover:text-text-primary transition-colors shrink-0 border-b border-brand-gold/25 pb-0.5"
            >
              Boutique
            </Link>
          </div>
          <div className="space-y-3 flex-grow">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center gap-3 p-4 rounded-xl bg-text-primary/[0.025] border border-border-primary/30 hover:border-blue-500/15 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 shrink-0 bg-blue-500/10 flex items-center justify-center text-blue-500 rounded-xl border border-blue-500/20">
                    <Package size={18} strokeWidth={1} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium truncate">{order.customer_name ?? "—"}</p>
                    <p className="text-text-primary/40 text-[9px] uppercase tracking-widest font-semibold truncate mt-0.5">
                      {Array.isArray(order.items) ? order.items.length : 0} article(s) ·{" "}
                      {Number(order.total || 0).toLocaleString("fr-FR")} MAD
                    </p>
                  </div>
                </div>
                <AdminStatusPill tone={adminOrderStatusTone(order.status)} className="shrink-0">
                  {order.status}
                </AdminStatusPill>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-text-primary/25">
                <Package size={36} strokeWidth={0.5} className="mb-3" />
                <p className="text-sm italic tracking-widest">Aucune commande récente</p>
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      <AdminCard padding="lg" className="!p-8 md:!p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-brand-gold shrink-0" strokeWidth={1} />
              <h4 className="text-[10px] uppercase tracking-[0.35em] font-black text-text-primary/70">Éditorial</h4>
            </div>
            <p className="text-3xl md:text-4xl font-serif">
              {journalPosts.length}{" "}
              <span className="text-sm font-sans font-light uppercase tracking-widest text-text-primary/35 block sm:inline sm:ml-2">
                articles
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-brand-gold shrink-0" strokeWidth={1} />
              <h4 className="text-[10px] uppercase tracking-[0.35em] font-black text-text-primary/70">Newsletter</h4>
            </div>
            <p className="text-3xl md:text-4xl font-serif">
              {subscribers.length}{" "}
              <span className="text-sm font-sans font-light uppercase tracking-widest text-text-primary/35 block sm:inline sm:ml-2">
                abonnés
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-brand-gold shrink-0" strokeWidth={1} />
              <h4 className="text-[10px] uppercase tracking-[0.35em] font-black text-text-primary/70">Catalogue</h4>
            </div>
            <p className="text-3xl md:text-4xl font-serif">
              {products.length}{" "}
              <span className="text-sm font-sans font-light uppercase tracking-widest text-text-primary/35 block sm:inline sm:ml-2">
                produits
              </span>
            </p>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-border-primary/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-emerald-600 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.45)]" />
            </span>
            Connexion données opérationnelle
          </div>
          <p className="text-[9px] uppercase tracking-widest font-bold text-text-primary/20">
            Casa Privilege · console sécurisée
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
