import { NavLink, Outlet } from "react-router-dom";
import { Sparkles, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { useAppContext } from "../../context/AppContext";

export function EditorialCenter() {
  const { globalServices, journalPosts } = useAppContext();

  const tabs = [
    { to: "services", label: "services", icon: Sparkles, count: globalServices.length },
    { to: "journal", label: "Journal", icon: BookOpen, count: journalPosts.length },
  ];

  return (
    <div className="space-y-6 pb-12 sm:space-y-10 sm:pb-16">
      <div className="flex flex-col justify-between gap-6 border-b border-border-primary/20 pb-8 sm:gap-10 sm:pb-12 lg:flex-row lg:items-end">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-px w-10 bg-brand-gold opacity-50 sm:w-12" />
            <p className="text-[8px] font-black uppercase italic tracking-[0.22em] text-brand-gold sm:text-[10px] sm:tracking-[0.5em]">
              Prestige & éditorial
            </p>
          </div>
          <h1 className="font-serif text-2xl leading-snug tracking-tight sm:text-3xl sm:leading-normal md:text-4xl md:tracking-tighter lg:text-5xl xl:text-6xl">
            Signature <span className="text-brand-gold italic">Casa Privilege</span>
          </h1>
          <p className="max-w-2xl text-sm font-light italic leading-relaxed text-text-primary/40 sm:text-base md:text-lg">
            Services d&apos;exception et chroniques : pilotez l&apos;image éditoriale de la maison.
          </p>
        </div>

        <div className="flex flex-nowrap overflow-x-auto max-w-full bg-text-primary/[0.02] p-1.5 border border-border-primary/50 rounded-xl gap-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `relative flex min-h-[3.25rem] shrink-0 items-center gap-3 overflow-hidden rounded-lg px-5 py-3.5 transition-all duration-500 touch-manipulation sm:px-6 sm:py-4 md:gap-4 md:px-10 md:py-5 ${
                  isActive ? "text-brand-black" : "text-text-primary/30 hover:text-text-primary"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="editorialTabBg"
                      className="absolute inset-0 bg-brand-gold"
                      transition={{ type: "spring", bounce: 0.12, duration: 0.65 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3 md:gap-4">
                    <tab.icon size={18} strokeWidth={isActive ? 2 : 1} />
                    <span className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.25em] text-left leading-tight max-w-[10rem] md:max-w-none">
                      {tab.label}
                    </span>
                    <span
                      className={`text-[9px] w-6 h-6 flex items-center justify-center rounded-full font-black border shrink-0 ${
                        isActive ? "bg-brand-black/10 border-black/20" : "bg-text-primary/5 border-border-primary/50"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative bg-text-primary/[0.01] rounded-xl"
      >
        <Outlet />
      </motion.div>

      <div className="mt-12 flex flex-col items-center justify-center py-16 border-t border-border-primary/10 opacity-25">
        <Sparkles size={36} className="text-brand-gold mb-6" strokeWidth={0.5} />
        <p className="text-[9px] uppercase tracking-[0.6em] font-black text-center">
          Chaque mot · chaque service · chaque détail
        </p>
      </div>
    </div>
  );
}
