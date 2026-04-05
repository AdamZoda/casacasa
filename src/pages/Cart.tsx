import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { translations } from "../i18n/translations";
import { PaymentModal } from "../components/PaymentModal";

export function Cart() {
  const { cart, removeFromCart, language } = useAppContext();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const t = translations[language];

  const total = cart.reduce((sum, item) => sum + parseInt(item.price.toString().replace(/\s/g, '')), 0);

  return (
    <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
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
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif mb-6"
        >
          {t.common.cart}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-text-primary/50 tracking-[0.3em] uppercase text-xs"
        >
          {cart.length} article{cart.length !== 1 ? 's' : ''}
        </motion.p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-32 border-y border-border-primary">
          <p className="text-2xl font-serif mb-12 text-text-primary/60">{t.common.emptyCart}</p>
          <Link 
            to="/store"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-transparent border border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-primary transition-all duration-500 ease-out overflow-hidden"
          >
            <span className="relative z-10 font-light tracking-[0.15em] text-sm uppercase">{t.common.discover}</span>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-8">
            {cart.map((item, index) => (
              <motion.div 
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col md:flex-row items-center gap-8 p-6 border border-border-primary bg-bg-primary group hover:border-brand-gold/50 transition-colors duration-500"
              >
                <div className="w-full md:w-32 h-32 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
                  <p className="text-text-primary/50 text-[10px] uppercase tracking-[0.2em]">{item.category}</p>
                </div>
                <div className="text-center md:text-right flex flex-col items-center md:items-end gap-4">
                  <p className="font-serif text-2xl">{item.price} MAD</p>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-text-primary/40 hover:text-red-500 transition-colors text-xs uppercase tracking-widest flex items-center gap-2"
                  >
                    <Trash2 size={14} /> {t.common.remove}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-bg-primary border border-border-primary text-text-primary p-12 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <p className="text-text-primary/50 text-[10px] uppercase tracking-[0.3em] mb-4">{t.common.total}</p>
              <p className="text-5xl font-serif">{total.toLocaleString()} MAD</p>
            </div>
            <button 
              onClick={() => setIsPaymentOpen(true)}
              className="w-full md:w-auto group relative inline-flex items-center justify-center px-12 py-6 bg-brand-gold text-brand-black hover:bg-text-primary hover:text-bg-primary transition-all duration-500 ease-out overflow-hidden"
            >
              <span className="relative z-10 font-medium tracking-[0.15em] text-sm uppercase flex items-center gap-3">
                {t.common.order} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      )}

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        items={cart}
        total={total}
      />
    </div>
  );
}
