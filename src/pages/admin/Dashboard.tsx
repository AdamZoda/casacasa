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
    <div className="mx-auto max-w-7xl space-y-8 pb-16 max-md:space-y-6 sm:space-y-10 sm:pb-20 md:space-y-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <AdminPageHeader
          kicker="Vue d’ensemble"
          title="Tableau de bord"
          subtitle="Indicateurs consolidés (données chargées depuis Supabase)"
        />
        <div className="flex shrink-0 items-center gap-2 text-[8px] font-semibold uppercase italic tracking-wide text-text-primary/40 sm:text-[10px] sm:font-black sm:tracking-widest">
          <Clock className="size-3.5 shrink-0" aria-hidden /> Session locale
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminCard
            key={stat.label}
            padding="lg"
            className="group transition-all duration-500 hover:border-brand-gold/35 max-md:hover:translate-y-0 sm:hover:-translate-y-0.5"
          >
            <div className="mb-4 flex items-start justify-between sm:mb-8">
              <div
                className={`rounded-xl border border-border-primary/50 bg-text-primary/[0.04] p-2.5 sm:rounded-2xl sm:p-3.5 ${stat.color} transition-all group-hover:border-current/25`}
              >
                <stat.icon className="size-[1.15rem] sm:size-[1.375rem]" strokeWidth={1} aria-hidden />
              </div>
            </div>
            <p className="mb-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-text-primary/45 sm:mb-2 sm:text-[9px] sm:font-black sm:tracking-[0.3em]">
              {stat.label}
            </p>
            <h3 className="font-serif text-2xl tracking-tight text-text-primary sm:text-3xl md:text-4xl">{stat.value}</h3>
          </AdminCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <AdminCard padding="lg" className="flex min-h-0 flex-col max-md:min-h-[260px] sm:min-h-[320px]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-8">
            <h3 className="text-balance font-serif text-lg italic sm:text-xl md:text-2xl">Réservations récentes</h3>
            <Link
              to="/admin/reservations"
              className="shrink-0 border-b border-brand-gold/25 pb-0.5 text-[8px] font-semibold uppercase tracking-wide text-brand-gold transition-colors hover:text-text-primary sm:text-[9px] sm:font-black sm:tracking-widest"
            >
              Tout voir
            </Link>
          </div>
          <div className="flex-grow space-y-2 sm:space-y-3">
            {recentReservations.map((res) => (
              <div
                key={res.id}
                className="flex flex-col gap-2 rounded-xl border border-border-primary/30 bg-text-primary/[0.025] p-3 transition-all max-sm:gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4 hover:border-brand-gold/20"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand-gold/20 bg-brand-gold/12 text-brand-gold sm:size-11 sm:rounded-xl">
                    <Calendar className="size-4 sm:size-[1.125rem]" strokeWidth={1} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary text-sm sm:text-base">{res.name ?? "—"}</p>
                    <p className="mt-0.5 truncate text-[9px] font-normal normal-case leading-snug tracking-normal text-text-primary/45 sm:text-[9px] sm:font-semibold sm:uppercase sm:tracking-widest">
                      {(res.activity_title && String(res.activity_title)) || "Activité"} · {res.date ?? "—"}
                    </p>
                  </div>
                </div>
                <AdminStatusPill tone={adminReservationStatusTone(res.status)} className="w-fit shrink-0 self-start sm:self-center">
                  {res.status}
                </AdminStatusPill>
              </div>
            ))}
            {recentReservations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-text-primary/25 sm:py-16">
                <Calendar className="mb-3 size-8 opacity-60 sm:size-9" strokeWidth={0.5} aria-hidden />
                <p className="text-xs italic tracking-wide sm:text-sm sm:tracking-widest">Aucune réservation récente</p>
              </div>
            )}
          </div>
        </AdminCard>

        <AdminCard padding="lg" className="flex min-h-0 flex-col max-md:min-h-[260px] sm:min-h-[320px]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-8">
            <h3 className="text-balance font-serif text-lg italic sm:text-xl md:text-2xl">Commandes boutique</h3>
            <Link
              to="/admin/boutique"
              className="shrink-0 border-b border-brand-gold/25 pb-0.5 text-[8px] font-semibold uppercase tracking-wide text-brand-gold transition-colors hover:text-text-primary sm:text-[9px] sm:font-black sm:tracking-widest"
            >
              Boutique
            </Link>
          </div>
          <div className="flex-grow space-y-2 sm:space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col gap-2 rounded-xl border border-border-primary/30 bg-text-primary/[0.025] p-3 transition-all max-sm:gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4 hover:border-blue-500/15"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-500 sm:size-11 sm:rounded-xl">
                    <Package className="size-4 sm:size-[1.125rem]" strokeWidth={1} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary text-sm sm:text-base">{order.customer_name ?? "—"}</p>
                    <p className="mt-0.5 truncate text-[9px] font-normal normal-case leading-snug tracking-normal text-text-primary/45 sm:font-semibold sm:uppercase sm:tracking-widest">
                      {Array.isArray(order.items) ? order.items.length : 0} article(s) ·{" "}
                      {Number(order.total || 0).toLocaleString("fr-FR")} MAD
                    </p>
                  </div>
                </div>
                <AdminStatusPill tone={adminOrderStatusTone(order.status)} className="w-fit shrink-0 self-start sm:self-center">
                  {order.status}
                </AdminStatusPill>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-text-primary/25 sm:py-16">
                <Package className="mb-3 size-8 opacity-60 sm:size-9" strokeWidth={0.5} aria-hidden />
                <p className="text-xs italic tracking-wide sm:text-sm sm:tracking-widest">Aucune commande récente</p>
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      <AdminCard padding="lg" className="!p-5 sm:!p-8 md:!p-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-14">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <FileText className="size-[1.125rem] shrink-0 text-brand-gold sm:size-5" strokeWidth={1} aria-hidden />
              <h4 className="text-[9px] font-semibold uppercase tracking-[0.15em] text-text-primary/70 sm:text-[10px] sm:font-black sm:tracking-[0.35em]">
                Éditorial
              </h4>
            </div>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl">
              {journalPosts.length}{" "}
              <span className="mt-1 block font-sans text-xs font-light uppercase tracking-wide text-text-primary/35 sm:mt-0 sm:inline sm:ml-2 sm:text-sm sm:tracking-widest">
                articles
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Mail className="size-[1.125rem] shrink-0 text-brand-gold sm:size-5" strokeWidth={1} aria-hidden />
              <h4 className="text-[9px] font-semibold uppercase tracking-[0.15em] text-text-primary/70 sm:text-[10px] sm:font-black sm:tracking-[0.35em]">
                Newsletter
              </h4>
            </div>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl">
              {subscribers.length}{" "}
              <span className="mt-1 block font-sans text-xs font-light uppercase tracking-wide text-text-primary/35 sm:mt-0 sm:inline sm:ml-2 sm:text-sm sm:tracking-widest">
                abonnés
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <ShoppingBag className="size-[1.125rem] shrink-0 text-brand-gold sm:size-5" strokeWidth={1} aria-hidden />
              <h4 className="text-[9px] font-semibold uppercase tracking-[0.15em] text-text-primary/70 sm:text-[10px] sm:font-black sm:tracking-[0.35em]">
                Catalogue
              </h4>
            </div>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl">
              {products.length}{" "}
              <span className="mt-1 block font-sans text-xs font-light uppercase tracking-wide text-text-primary/35 sm:mt-0 sm:inline sm:ml-2 sm:text-sm sm:tracking-widest">
                produits
              </span>
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-border-primary/50 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-8">
          <div className="flex items-center gap-2.5 text-[8px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:gap-3 sm:text-[10px] sm:font-black sm:tracking-[0.4em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.45)]" />
            </span>
            Connexion données opérationnelle
          </div>
          <p className="text-[8px] font-medium uppercase tracking-wide text-text-primary/25 sm:text-[9px] sm:font-bold sm:tracking-widest sm:text-text-primary/20">
            Casa Privilege · console sécurisée
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
