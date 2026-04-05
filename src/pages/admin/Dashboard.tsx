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
<<<<<<< HEAD
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
=======
    <div className="mx-auto max-w-7xl space-y-8 pb-16 max-md:space-y-6 sm:space-y-10 sm:pb-20 md:space-y-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
>>>>>>> e1b3035 (Initial commit)
        <AdminPageHeader
          kicker="Vue d’ensemble"
          title="Tableau de bord"
          subtitle="Indicateurs consolidés (données chargées depuis Supabase)"
        />
<<<<<<< HEAD
        <div className="flex items-center gap-2 text-text-primary/40 text-[10px] uppercase tracking-widest font-black italic shrink-0">
          <Clock size={14} aria-hidden /> Session locale
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
=======
        <div className="flex shrink-0 items-center gap-2 text-[8px] font-semibold uppercase italic tracking-wide text-text-primary/40 sm:text-[10px] sm:font-black sm:tracking-widest">
          <Clock className="size-3.5 shrink-0" aria-hidden /> Session locale
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 xl:grid-cols-4">
>>>>>>> e1b3035 (Initial commit)
        {stats.map((stat) => (
          <AdminCard
            key={stat.label}
            padding="lg"
<<<<<<< HEAD
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
=======
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
>>>>>>> e1b3035 (Initial commit)
          </AdminCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
<<<<<<< HEAD
        <AdminCard padding="lg" className="flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h3 className="text-xl md:text-2xl font-serif italic text-balance">Réservations récentes</h3>
            <Link
              to="/admin/reservations"
              className="text-[9px] uppercase tracking-widest font-black text-brand-gold hover:text-text-primary transition-colors shrink-0 border-b border-brand-gold/25 pb-0.5"
=======
        <AdminCard padding="lg" className="flex min-h-0 flex-col max-md:min-h-[260px] sm:min-h-[320px]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-8">
            <h3 className="text-balance font-serif text-lg italic sm:text-xl md:text-2xl">Réservations récentes</h3>
            <Link
              to="/admin/reservations"
              className="shrink-0 border-b border-brand-gold/25 pb-0.5 text-[8px] font-semibold uppercase tracking-wide text-brand-gold transition-colors hover:text-text-primary sm:text-[9px] sm:font-black sm:tracking-widest"
>>>>>>> e1b3035 (Initial commit)
            >
              Tout voir
            </Link>
          </div>
<<<<<<< HEAD
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
=======
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
>>>>>>> e1b3035 (Initial commit)
                      {(res.activity_title && String(res.activity_title)) || "Activité"} · {res.date ?? "—"}
                    </p>
                  </div>
                </div>
<<<<<<< HEAD
                <AdminStatusPill tone={adminReservationStatusTone(res.status)} className="shrink-0">
=======
                <AdminStatusPill tone={adminReservationStatusTone(res.status)} className="w-fit shrink-0 self-start sm:self-center">
>>>>>>> e1b3035 (Initial commit)
                  {res.status}
                </AdminStatusPill>
              </div>
            ))}
            {recentReservations.length === 0 && (
<<<<<<< HEAD
              <div className="flex flex-col items-center justify-center py-16 text-text-primary/25">
                <Calendar size={36} strokeWidth={0.5} className="mb-3" />
                <p className="text-sm italic tracking-widest">Aucune réservation récente</p>
=======
              <div className="flex flex-col items-center justify-center py-12 text-text-primary/25 sm:py-16">
                <Calendar className="mb-3 size-8 opacity-60 sm:size-9" strokeWidth={0.5} aria-hidden />
                <p className="text-xs italic tracking-wide sm:text-sm sm:tracking-widest">Aucune réservation récente</p>
>>>>>>> e1b3035 (Initial commit)
              </div>
            )}
          </div>
        </AdminCard>

<<<<<<< HEAD
        <AdminCard padding="lg" className="flex flex-col min-h-[320px]">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h3 className="text-xl md:text-2xl font-serif italic text-balance">Commandes boutique</h3>
            <Link
              to="/admin/boutique"
              className="text-[9px] uppercase tracking-widest font-black text-brand-gold hover:text-text-primary transition-colors shrink-0 border-b border-brand-gold/25 pb-0.5"
=======
        <AdminCard padding="lg" className="flex min-h-0 flex-col max-md:min-h-[260px] sm:min-h-[320px]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-8">
            <h3 className="text-balance font-serif text-lg italic sm:text-xl md:text-2xl">Commandes boutique</h3>
            <Link
              to="/admin/boutique"
              className="shrink-0 border-b border-brand-gold/25 pb-0.5 text-[8px] font-semibold uppercase tracking-wide text-brand-gold transition-colors hover:text-text-primary sm:text-[9px] sm:font-black sm:tracking-widest"
>>>>>>> e1b3035 (Initial commit)
            >
              Boutique
            </Link>
          </div>
<<<<<<< HEAD
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
=======
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
>>>>>>> e1b3035 (Initial commit)
                      {Array.isArray(order.items) ? order.items.length : 0} article(s) ·{" "}
                      {Number(order.total || 0).toLocaleString("fr-FR")} MAD
                    </p>
                  </div>
                </div>
<<<<<<< HEAD
                <AdminStatusPill tone={adminOrderStatusTone(order.status)} className="shrink-0">
=======
                <AdminStatusPill tone={adminOrderStatusTone(order.status)} className="w-fit shrink-0 self-start sm:self-center">
>>>>>>> e1b3035 (Initial commit)
                  {order.status}
                </AdminStatusPill>
              </div>
            ))}
            {recentOrders.length === 0 && (
<<<<<<< HEAD
              <div className="flex flex-col items-center justify-center py-16 text-text-primary/25">
                <Package size={36} strokeWidth={0.5} className="mb-3" />
                <p className="text-sm italic tracking-widest">Aucune commande récente</p>
=======
              <div className="flex flex-col items-center justify-center py-12 text-text-primary/25 sm:py-16">
                <Package className="mb-3 size-8 opacity-60 sm:size-9" strokeWidth={0.5} aria-hidden />
                <p className="text-xs italic tracking-wide sm:text-sm sm:tracking-widest">Aucune commande récente</p>
>>>>>>> e1b3035 (Initial commit)
              </div>
            )}
          </div>
        </AdminCard>
      </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> e1b3035 (Initial commit)
                articles
              </span>
            </p>
          </div>
<<<<<<< HEAD
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-brand-gold shrink-0" strokeWidth={1} />
              <h4 className="text-[10px] uppercase tracking-[0.35em] font-black text-text-primary/70">Newsletter</h4>
            </div>
            <p className="text-3xl md:text-4xl font-serif">
              {subscribers.length}{" "}
              <span className="text-sm font-sans font-light uppercase tracking-widest text-text-primary/35 block sm:inline sm:ml-2">
=======
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
>>>>>>> e1b3035 (Initial commit)
                abonnés
              </span>
            </p>
          </div>
<<<<<<< HEAD
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-brand-gold shrink-0" strokeWidth={1} />
              <h4 className="text-[10px] uppercase tracking-[0.35em] font-black text-text-primary/70">Catalogue</h4>
            </div>
            <p className="text-3xl md:text-4xl font-serif">
              {products.length}{" "}
              <span className="text-sm font-sans font-light uppercase tracking-widest text-text-primary/35 block sm:inline sm:ml-2">
=======
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
>>>>>>> e1b3035 (Initial commit)
                produits
              </span>
            </p>
          </div>
        </div>
<<<<<<< HEAD
        <div className="mt-10 pt-8 border-t border-border-primary/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-black text-emerald-600 dark:text-emerald-400">
=======
        <div className="mt-8 flex flex-col gap-3 border-t border-border-primary/50 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-8">
          <div className="flex items-center gap-2.5 text-[8px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 sm:gap-3 sm:text-[10px] sm:font-black sm:tracking-[0.4em]">
>>>>>>> e1b3035 (Initial commit)
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.45)]" />
            </span>
            Connexion données opérationnelle
          </div>
<<<<<<< HEAD
          <p className="text-[9px] uppercase tracking-widest font-bold text-text-primary/20">
=======
          <p className="text-[8px] font-medium uppercase tracking-wide text-text-primary/25 sm:text-[9px] sm:font-bold sm:tracking-widest sm:text-text-primary/20">
>>>>>>> e1b3035 (Initial commit)
            Casa Privilege · console sécurisée
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
