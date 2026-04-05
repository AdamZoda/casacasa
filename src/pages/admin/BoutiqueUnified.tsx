import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ShoppingBag, Package, TrendingUp, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../../context/AppContext";

export function BoutiqueAnalyticsTab() {
  const { orders, products } = useAppContext();
  const pending = orders.filter((o) => o.status === "pending").length;
  const completed = orders.filter((o) => o.status === "completed").length;
  const volumeMAD = orders.reduce((acc, o) => acc + Number(o.total ?? 0), 0);

  const kpis: { label: string; value: string | number; mono?: boolean }[] = [
    { label: "Commandes", value: orders.length },
    { label: "En attente", value: pending },
    { label: "Terminées", value: completed },
    { label: "Volume (MAD)", value: volumeMAD.toLocaleString("fr-FR"), mono: true },
    { label: "Références catalogue", value: products.length },
  ];

  return (
<<<<<<< HEAD
    <div className="space-y-10">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="admin-card p-5 md:p-6 flex flex-col gap-2 border-brand-gold/10"
          >
            <p className="text-[9px] uppercase tracking-[0.25em] font-black text-text-primary/40">{k.label}</p>
            <p
              className={`text-2xl md:text-3xl font-serif text-brand-gold tabular-nums ${k.mono ? "font-mono text-xl md:text-2xl" : ""}`}
=======
    <div className="space-y-6 sm:space-y-10">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="admin-card flex flex-col gap-1.5 border-brand-gold/10 p-4 sm:gap-2 sm:p-5 md:p-6"
          >
            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-text-primary/40 sm:text-[9px] sm:font-black sm:tracking-[0.25em]">
              {k.label}
            </p>
            <p
              className={`font-serif text-xl tabular-nums text-brand-gold sm:text-2xl md:text-3xl ${k.mono ? "font-mono text-lg sm:text-xl md:text-2xl" : ""}`}
>>>>>>> e1b3035 (Initial commit)
            >
              {k.value}
            </p>
          </div>
        ))}
      </div>

<<<<<<< HEAD
      <div className="min-h-[280px] flex flex-col items-center justify-center border border-dashed border-border-primary/50 bg-text-primary/[0.02] rounded-xl p-12 md:p-16 text-center">
        <div className="w-20 h-20 rounded-full bg-brand-gold/5 flex items-center justify-center border border-brand-gold/10 mb-8">
          <TrendingUp size={36} className="text-brand-gold" strokeWidth={0.5} />
        </div>
        <h3 className="text-2xl md:text-3xl font-serif mb-4 italic">Tendances & prévisions</h3>
        <p className="text-text-primary/45 font-light max-w-lg text-sm leading-relaxed">
=======
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border-primary/50 bg-text-primary/[0.02] p-8 text-center sm:min-h-[280px] sm:p-12 md:p-16">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full border border-brand-gold/10 bg-brand-gold/5 sm:mb-8 sm:size-20">
          <TrendingUp className="size-8 text-brand-gold sm:size-9" strokeWidth={0.5} aria-hidden />
        </div>
        <h3 className="mb-3 font-serif text-xl italic sm:mb-4 sm:text-2xl md:text-3xl">Tendances & prévisions</h3>
        <p className="max-w-lg text-xs font-light leading-relaxed text-text-primary/45 sm:text-sm">
>>>>>>> e1b3035 (Initial commit)
          Graphiques et analyses prédictives arriveront ici. Les indicateurs ci-dessus se mettent à jour en direct depuis vos
          commandes.
        </p>
      </div>
    </div>
  );
}

/** Shell boutique : onglets = sous-routes (/admin/boutique/commandes, …). */
export function BoutiqueUnified() {
  const { pathname } = useLocation();
  const { orders, products } = useAppContext();

  /* Ordre aligné maquette : commandes → aperçu ventes → catalogue */
  const tabs: {
    to: string;
    label: string;
    icon: LucideIcon;
    count?: number;
  }[] = [
    { to: "commandes", label: "Commandes récentes", icon: Package, count: orders.length },
    { to: "ventes", label: "Aperçu des ventes", icon: TrendingUp },
    { to: "catalogue", label: "Gestion du catalogue", icon: ShoppingBag, count: products.length },
  ];

  return (
<<<<<<< HEAD
    <div className="space-y-10 pb-16">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-border-primary/30 pb-10">
        <div>
          <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase mb-4 italic">
            Expérience commerciale
          </p>
          <h1 className="text-4xl md:text-5xl font-serif">
=======
    <div className="space-y-6 pb-12 sm:space-y-10 sm:pb-16">
      <div className="flex flex-col justify-between gap-5 border-b border-border-primary/30 pb-6 sm:gap-8 sm:pb-10 xl:flex-row xl:items-end">
        <div>
          <p className="mb-2 text-[8px] font-black uppercase italic tracking-[0.22em] text-brand-gold sm:mb-4 sm:text-[10px] sm:tracking-[0.5em]">
            Expérience commerciale
          </p>
          <h1 className="font-serif text-2xl leading-snug sm:text-3xl sm:leading-normal md:text-4xl lg:text-5xl">
>>>>>>> e1b3035 (Initial commit)
            Maison Casa <span className="text-brand-gold italic">Boutique</span>
          </h1>
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-wrap bg-text-primary/[0.03] p-1 border border-border-primary rounded-xl gap-1 w-full xl:w-auto">
=======
        <div className="grid w-full grid-cols-1 gap-1 rounded-xl border border-border-primary bg-text-primary/[0.03] p-1 sm:grid-cols-3 lg:flex lg:w-auto lg:flex-wrap xl:w-auto">
>>>>>>> e1b3035 (Initial commit)
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
<<<<<<< HEAD
                `relative min-h-[3rem] px-4 py-3 sm:px-6 md:px-8 md:py-4 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 transition-all duration-500 rounded-lg overflow-hidden lg:flex-1 lg:justify-center ${
=======
                `relative flex min-h-[2.75rem] touch-manipulation items-center justify-center gap-2 overflow-hidden rounded-lg px-3 py-2.5 transition-all duration-500 sm:min-h-[3rem] sm:justify-start sm:gap-3 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:flex-1 lg:justify-center ${
>>>>>>> e1b3035 (Initial commit)
                  isActive ? "text-brand-black" : "text-text-primary/40 hover:text-text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="boutiqueTabBg"
                      className="absolute inset-0 bg-brand-gold"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2 md:gap-3">
                    <tab.icon size={16} strokeWidth={isActive ? 2 : 1} />
                    <span className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-left leading-tight max-w-[9rem] md:max-w-none">
                      {tab.label}
                    </span>
                    {tab.count !== undefined && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                          isActive ? "bg-brand-black/20" : "bg-text-primary/10"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "circOut" }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
