import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Heart, ShoppingCart } from "lucide-react";

export function Store() {
  const { products, addToCart, favorites, toggleFavorite } = useAppContext();

  return (
    <div className="pt-40 pb-32 px-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center mb-24">
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-px w-24 bg-brand-gold mx-auto mb-8"
        />
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif mb-6"
        >
          Collection
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xs tracking-[0.2em] uppercase text-text-primary/50"
        >
          {products.length} PRODUITS
        </motion.p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-12 border-b border-border-primary mb-12">
        <button className="text-xs tracking-[0.2em] uppercase pb-4 border-b-2 border-brand-gold text-brand-gold font-medium">Tout</button>
        <button className="text-xs tracking-[0.2em] uppercase pb-4 border-b-2 border-transparent text-text-primary/50 hover:text-text-primary transition-colors">Sculpture Intérieur</button>
        <button className="text-xs tracking-[0.2em] uppercase pb-4 border-b-2 border-transparent text-text-primary/50 hover:text-text-primary transition-colors">Sculpture Extérieur</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div className="text-xs tracking-[0.2em] uppercase font-medium text-text-primary/70">
          Filtrer par prix
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <select className="bg-transparent border border-border-primary text-xs tracking-[0.2em] uppercase py-3 px-6 outline-none focus:border-brand-gold transition-colors cursor-pointer appearance-none">
            <option>Tous les matériaux</option>
          </select>
          <select className="bg-transparent border border-border-primary text-xs tracking-[0.2em] uppercase py-3 px-6 outline-none focus:border-brand-gold transition-colors cursor-pointer appearance-none">
            <option>Tous les artistes</option>
          </select>
          <select className="bg-transparent border border-border-primary text-xs tracking-[0.2em] uppercase py-3 px-6 outline-none focus:border-brand-gold transition-colors cursor-pointer appearance-none">
            <option>Par défaut</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {products.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-8 bg-border-primary/20">
              {product.isExclusive && (
                <div className="absolute top-6 left-6 bg-brand-black text-brand-gold text-[10px] font-medium tracking-[0.2em] uppercase px-4 py-2 z-10 border border-brand-gold/30">
                  Exclusive
                </div>
              )}
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-brand-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="bg-brand-gold text-brand-black p-4 rounded-full hover:bg-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-500"
                >
                  <ShoppingCart size={20} strokeWidth={1.5} />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(product.id);
                  }}
                  className={`p-4 rounded-full transition-colors transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 ${favorites.includes(product.id) ? 'bg-brand-gold text-brand-black' : 'bg-white text-brand-black hover:bg-brand-gold'}`}
                >
                  <Heart size={20} fill={favorites.includes(product.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              </div>
            </div>
            
            <div className="text-center px-4">
              <div className="text-[10px] tracking-[0.2em] uppercase text-brand-gold mb-3">Available</div>
              <h3 className="font-serif text-2xl md:text-3xl mb-3 group-hover:text-brand-gold transition-colors duration-300">{product.title}</h3>
              <p className="text-[10px] tracking-[0.2em] uppercase text-text-primary/50 mb-6">{product.category}</p>
              <div className="flex justify-center items-center gap-4">
                <span className="text-lg font-medium">{product.price} MAD</span>
                {product.oldPrice && (
                  <>
                    <span className="text-sm text-text-primary/40 line-through">{product.oldPrice} MAD</span>
                    <span className="bg-brand-gold/10 text-brand-gold text-[10px] font-medium tracking-widest px-2 py-1 border border-brand-gold/20">-20%</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
