import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { language, universes, activities, products, searchQuery, setSearchQuery } = useAppContext();
  const t = translations[language];
  const [results, setResults] = useState<{ type: 'universe' | 'activity' | 'product', item: any }[]>([]);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filteredUniverses = universes.filter(u => u.name.toLowerCase().includes(query)).map(u => ({ type: 'universe' as const, item: u }));
    const filteredActivities = activities.filter(a => a.title.toLowerCase().includes(query)).map(a => ({ type: 'activity' as const, item: a }));
    const filteredProducts = products.filter(p => p.title.toLowerCase().includes(query)).map(p => ({ type: 'product' as const, item: p }));

    setResults([...filteredUniverses, ...filteredActivities, ...filteredProducts]);
  }, [searchQuery, universes, activities, products]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex flex-col bg-bg-primary/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl"
        >
          <div className="flex justify-end p-6 pr-[max(1.5rem,env(safe-area-inset-right,0px))] md:p-12">
            <button 
              onClick={onClose}
              className="p-4 text-text-primary/60 hover:text-brand-gold transition-colors duration-500"
            >
              <X size={32} strokeWidth={1} />
            </button>
          </div>

          <div className="flex-grow flex flex-col items-center px-6 md:px-12 lg:px-24">
            <div className="w-full max-w-4xl">
              <div className="relative mb-16">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-gold" size={32} strokeWidth={1} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder={t.common.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoComplete="off"
                  enterKeyHint="search"
                  className="w-full border-b border-border-primary/30 bg-transparent py-6 pl-10 font-serif text-text-primary transition-colors duration-500 placeholder:text-text-primary/10 focus:border-brand-gold focus:outline-none sm:py-8 sm:pl-12 text-2xl sm:text-4xl md:text-6xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar">
                {results.length > 0 ? (
                  results.map((res, i) => (
                    <motion.div
                      key={`${res.type}-${res.item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Link 
                        to={res.type === 'universe' ? `/universe/${res.item.id}` : res.type === 'activity' ? `/universe/${res.item.universeId}` : `/store`}
                        onClick={onClose}
                        className="group flex items-center gap-6 p-6 border border-border-primary/30 hover:border-brand-gold/50 transition-colors duration-500"
                      >
                        <div className="w-20 h-20 overflow-hidden">
                          <img 
                            src={res.item.heroImage || res.item.image} 
                            alt={res.item.name || res.item.title} 
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-grow">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-brand-gold font-medium mb-2 block">
                            {res.type}
                          </span>
                          <h3 className="text-xl font-serif text-text-primary group-hover:text-brand-gold transition-colors duration-500">
                            {res.item.name || res.item.title}
                          </h3>
                        </div>
                        <ArrowRight size={18} className="text-text-primary/20 group-hover:text-brand-gold group-hover:translate-x-1 transition-all duration-500" />
                      </Link>
                    </motion.div>
                  ))
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-text-primary/40 font-light text-xl italic">
                      {t.common.noResults} "{searchQuery}"
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
