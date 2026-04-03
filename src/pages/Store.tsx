import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { Heart, ShoppingBag } from "lucide-react";

export function Store() {
  const { products, addToCart, favorites, toggleFavorite } = useAppContext();

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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-20">
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

              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal"
                referrerPolicy="no-referrer"
              />
              
              {/* Add to cart overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="w-full bg-brand-black text-brand-gold py-4 text-[10px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-3 hover:bg-brand-gold hover:text-brand-black transition-colors duration-300"
                >
                  <ShoppingBag size={14} /> Ajouter au Panier
                </button>
              </div>
            </div>
            
            <div className="flex flex-col flex-1 px-2">
              <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className="font-serif text-xl md:text-2xl text-text-primary group-hover:text-brand-gold transition-colors duration-300">{product.title}</h3>
                <div className="flex flex-col items-end text-right">
                  <span className="text-base font-serif tracking-wide">{product.price} €</span>
                  {product.oldPrice && (
                    <span className="text-xs text-text-primary/40 line-through mt-0.5">{product.oldPrice} €</span>
                  )}
                </div>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-text-primary/40 mb-4">{product.category}</p>
              <p className="text-sm font-light text-text-primary/60 line-clamp-2 mt-auto leading-relaxed">
                {product.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
