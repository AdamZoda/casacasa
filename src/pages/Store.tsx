import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useShopping } from "../context/ShoppingContext";
import { formatMoney } from "../lib/utils";
import { translations } from "../i18n/translations";
import { LazyImg } from "../components/LazyImg";
import { Heart, ShoppingBag } from "lucide-react";

export function Store() {
  const { products, language, currency, exchangeRates } = useAppContext();
  const { addToCart, favorites, toggleFavorite } = useShopping();
  const t = translations[language];
  const navigate = useNavigate();

  const handleAddToCart = (product: (typeof products)[number], redirectToCart = false) => {
    addToCart(product);
    if (redirectToCart) {
      navigate("/cart");
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-border-primary pb-8 gap-8">
        <div>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            className="h-px w-16 bg-brand-gold mb-6"
          />
          <h1 className="text-4xl md:text-5xl font-serif">Luxury Stores</h1>
        </div>
        <div className="flex gap-8 text-[10px] tracking-[0.2em] uppercase font-medium">
          <span className="text-brand-gold pb-2 border-b border-brand-gold cursor-pointer">Tout Découvrir</span>
          <span className="text-text-primary/40 hover:text-text-primary transition-colors cursor-pointer">Exclusivités</span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-20 xl:grid-cols-3">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group flex flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#faf9f8] dark:bg-[#1a1a1a] mb-6">
              {product.isExclusive && (
                <div className="absolute top-4 left-4 bg-brand-gold text-brand-black text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 z-10">
                  Édition Limitée
                </div>
              )}
              
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(product.id);
                }}
                className={`absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${favorites.includes(product.id) ? 'bg-brand-gold text-brand-black shadow-lg scale-110' : 'bg-white/50 dark:bg-black/20 text-text-primary/50 hover:bg-white dark:hover:bg-black hover:text-brand-gold'}`}
              >
                <Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} strokeWidth={1.5} />
              </button>

              <LazyImg 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
                referrerPolicy="no-referrer"
              />
              
              {/* Add to cart — bureau : au survol ; tactile : bouton sous la fiche */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden p-4 md:block md:translate-y-full md:transition-transform md:duration-500 md:ease-out md:group-hover:pointer-events-auto md:group-hover:translate-y-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="pointer-events-auto relative z-20 flex w-full items-center justify-center gap-3 bg-brand-black py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-brand-gold transition-colors duration-300 hover:bg-brand-gold hover:text-brand-black"
                >
                  <ShoppingBag size={14} strokeWidth={1.5} aria-hidden />
                  {t.store.addToCart}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col flex-1 px-2">
              <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className="font-serif text-sm sm:text-base md:text-2xl text-text-primary group-hover:text-brand-gold transition-colors duration-300 leading-snug">{product.title}</h3>
                <div className="flex flex-col items-end text-right">
                  <span className="text-sm md:text-base font-serif tracking-wide">{formatMoney(product.price, currency, exchangeRates)}</span>
                  {product.oldPrice && (
                    <span className="text-[11px] md:text-xs text-text-primary/40 line-through mt-0.5">{formatMoney(product.oldPrice, currency, exchangeRates)}</span>
                  )}
                </div>
              </div>
              <p className="text-[9px] md:text-[10px] tracking-[0.14em] md:tracking-[0.2em] uppercase text-text-primary/40 mb-3 md:mb-4">{product.category}</p>
              <p className="mt-auto line-clamp-2 text-xs md:text-sm font-light leading-relaxed text-text-primary/60">
                {product.description}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product, true);
                }}
                className="md:hidden relative z-20 mt-4 flex min-h-10 w-full touch-manipulation items-center justify-center gap-2 border border-brand-gold/50 bg-brand-gold py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-black transition-colors active:bg-brand-gold/90"
              >
                <ShoppingBag size={16} strokeWidth={1.5} aria-hidden />
                {t.store.buy}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
