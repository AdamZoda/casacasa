import { motion } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { formatMoney } from "../lib/utils";
import { Link } from "react-router-dom";

export function StoreTeaser() {
  const { products, currency, exchangeRates } = useAppContext();
  const featuredProducts = products.filter(p => p.isExclusive).slice(0, 3);
  
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-brand-black/5 backdrop-blur-3xl relative">
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 md:mb-24 gap-6 sm:gap-8">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif leading-tight md:leading-none tracking-tight md:tracking-tighter mb-4 sm:mb-8 italic">
              L'Exclusive <span className="text-brand-gold not-italic">Collection</span>
            </h2>
            <p className="text-text-primary/40 font-light text-sm sm:text-lg tracking-[0.15em] sm:tracking-widest uppercase italic border-l border-brand-gold/30 pl-4 sm:pl-8 ml-2 sm:ml-4">
              Pièces d'art rares.
            </p>
          </div>
          
          <Link to="/store">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#E5A93A", color: "#000" }}
              className="flex min-h-12 items-center gap-3 sm:gap-6 px-6 sm:px-12 py-3.5 sm:py-6 border border-brand-gold text-brand-gold transition-all text-[11px] sm:text-sm tracking-[0.2em] sm:tracking-[0.4em] font-black uppercase rounded-full shadow-[0_20px_50px_rgba(229,169,58,0.15)] touch-manipulation"
            >
              Découvrir la Boutique <ArrowRight size={18} className="sm:hidden" /><ArrowRight size={22} className="hidden sm:block" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14 md:gap-16 relative">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-square mb-6 sm:mb-12 overflow-hidden shadow-2xl shadow-brand-black/20">
                <motion.img 
                  src={product.image} 
                  alt={product.title}
                  loading="lazy"
                  decoding="async"
                  whileHover={{ scale: 1.12, rotate: 2 }}
                  transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent translate-y-8 sm:translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                   <p className="text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.5em] text-brand-gold font-black uppercase mb-2">SÉDUCTION UNIQUE</p>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif mb-2 sm:mb-3 tracking-tight italic">{product.title}</h3>
              <p className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.4em] text-text-primary/30 uppercase mb-4 sm:mb-6">{product.category}</p>
              <p className="text-xl sm:text-2xl font-light tracking-tighter text-brand-gold">{formatMoney(product.price, currency, exchangeRates)}</p>
              
              <Link to={`/store`} className="mt-5 sm:mt-8">
                <div className="flex items-center gap-3 text-[10px] tracking-[0.18em] sm:tracking-[0.3em] font-bold uppercase opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-700">
                   Regarder de plus près <ShoppingBag size={12} className="text-brand-gold" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
