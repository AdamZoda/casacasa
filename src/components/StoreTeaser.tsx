import { motion } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

export function StoreTeaser() {
  const { products } = useAppContext();
  const featuredProducts = products.filter(p => p.isExclusive).slice(0, 3);
  
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-32 px-6 bg-brand-black/5 backdrop-blur-3xl relative">
      <div className="max-w-[1400px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-5xl md:text-6xl font-serif leading-none tracking-tighter mb-8 italic">
              L'Exclusive <span className="text-brand-gold not-italic">Collection</span>
            </h2>
            <p className="text-text-primary/40 font-light text-lg tracking-widest uppercase italic border-l border-brand-gold/30 pl-8 ml-4">
              Pièces d'art rares.
            </p>
          </div>
          
          <Link to="/store">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#E5A93A", color: "#000" }}
              className="flex items-center gap-6 px-12 py-6 border border-brand-gold text-brand-gold transition-all text-sm tracking-[0.4em] font-black uppercase rounded-full shadow-[0_20px_50px_rgba(229,169,58,0.15)]"
            >
              Découvrir la Boutique <ArrowRight size={22} />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 relative">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-square mb-12 overflow-hidden shadow-2xl shadow-brand-black/20">
                <motion.img 
                  src={product.image} 
                  alt={product.title}
                  whileHover={{ scale: 1.12, rotate: 2 }}
                  transition={{ duration: 3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                   <p className="text-[10px] tracking-[0.5em] text-brand-gold font-black uppercase mb-2">SÉDUCTION UNIQUE</p>
                </div>
              </div>
              <h3 className="text-3xl font-serif mb-3 tracking-tight italic">{product.title}</h3>
              <p className="text-[11px] tracking-[0.4em] text-text-primary/30 uppercase mb-6">{product.category}</p>
              <p className="text-2xl font-light tracking-tighter text-brand-gold">{product.price.toLocaleString()}€</p>
              
              <Link to={`/store`} className="mt-8">
                <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-700">
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
