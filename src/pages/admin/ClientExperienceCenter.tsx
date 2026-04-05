import { NavLink, Outlet } from "react-router-dom";
import { Star, Heart, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../../context/AppContext";

export function ClientExperienceCenter() {
  const { testimonials } = useAppContext();

  const tabs = [
    { to: "conciergerie", label: "Conciergerie & tickets", icon: Ticket },
    { to: "temoignages", label: "Témoignages de prestige", icon: Star, count: testimonials.length },
  ];

  return (
<<<<<<< HEAD
    <div className="space-y-10 pb-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-border-primary/20 pb-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-brand-gold opacity-50" />
            <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase italic">
              Satisfaction & fidélité
            </p>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-tighter">
            Expérience <span className="text-brand-gold italic">client</span>
          </h1>
          <p className="text-text-primary/40 font-light text-lg max-w-2xl italic leading-relaxed">
=======
    <div className="space-y-6 pb-12 sm:space-y-10 sm:pb-16">
      <div className="flex flex-col justify-between gap-6 border-b border-border-primary/20 pb-8 sm:gap-10 sm:pb-12 lg:flex-row lg:items-end">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-px w-10 bg-brand-gold opacity-50 sm:w-12" />
            <p className="text-[8px] font-black uppercase italic tracking-[0.22em] text-brand-gold sm:text-[10px] sm:tracking-[0.5em]">
              Satisfaction & fidélité
            </p>
          </div>
          <h1 className="font-serif text-2xl leading-snug tracking-tight sm:text-3xl sm:leading-normal md:text-4xl md:tracking-tighter lg:text-5xl xl:text-6xl">
            Expérience <span className="text-brand-gold italic">client</span>
          </h1>
          <p className="max-w-2xl text-sm font-light italic leading-relaxed text-text-primary/40 sm:text-base md:text-lg">
>>>>>>> e1b3035 (Initial commit)
            Cultivez l&apos;excellence relationnelle et transformez chaque demande en une expérience mémorable.
          </p>
        </div>

        {/* Une seule ligne : les deux onglets côte à côte ; libellé + badge sans coupure */}
        <div className="flex flex-row flex-nowrap items-stretch gap-1 p-1.5 bg-text-primary/[0.02] border border-border-primary/50 rounded-xl w-full max-w-full lg:w-auto lg:max-w-none lg:shrink-0 overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
<<<<<<< HEAD
                `relative flex-1 min-w-[min(100%,11.5rem)] sm:min-w-[13rem] lg:flex-none lg:min-w-[270px] px-3 py-3.5 sm:px-5 sm:py-4 flex items-center justify-center transition-all duration-500 rounded-lg overflow-hidden ${
=======
                `relative flex min-h-[3.25rem] min-w-[min(100%,11.5rem)] flex-1 touch-manipulation items-center justify-center overflow-hidden rounded-lg px-3 py-3.5 transition-all duration-500 sm:min-w-[13rem] sm:px-5 sm:py-4 lg:min-w-[270px] lg:flex-none ${
>>>>>>> e1b3035 (Initial commit)
                  isActive ? "text-brand-black" : "text-text-primary/30 hover:text-text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="clientExperienceTabBg"
                      className="absolute inset-0 bg-brand-gold"
                      transition={{ type: "spring", bounce: 0.12, duration: 0.65 }}
                    />
                  )}
                  <span className="relative z-10 inline-flex flex-row flex-nowrap items-center justify-center gap-2 sm:gap-2.5 max-w-full">
                    <tab.icon size={17} strokeWidth={isActive ? 2 : 1} className="shrink-0" aria-hidden />
                    <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-[0.12em] sm:tracking-[0.18em] whitespace-nowrap leading-none">
                      {tab.label}
                    </span>
                    {tab.count !== undefined ? (
                      <span
                        className={`text-[9px] min-w-[1.5rem] h-6 px-1.5 inline-flex items-center justify-center rounded-full font-black border shrink-0 ${
                          isActive ? "bg-brand-black/10 border-black/20" : "bg-text-primary/5 border-border-primary/50"
                        }`}
                      >
                        {tab.count}
                      </span>
                    ) : null}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.995 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative bg-text-primary/[0.01] rounded-xl"
      >
        <Outlet />
      </motion.div>

      <div className="mt-12 flex flex-col items-center justify-center py-16 border-t border-border-primary/10 opacity-25">
        <Heart size={36} className="text-brand-gold mb-6" strokeWidth={0.5} />
        <p className="text-[9px] uppercase tracking-[0.6em] font-black text-center">
          Respect · Confiance · Prestige
        </p>
      </div>
    </div>
  );
}
