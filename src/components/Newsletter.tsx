import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, ShieldCheck } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const { subscribeNewsletter } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const ok = await subscribeNewsletter(email);
    if (ok) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 md:py-32 relative overflow-hidden bg-brand-black/5 flex items-center justify-center">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-brand-gold/10 rounded-full animate-spin [animation-duration:60s] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-brand-gold/5 rounded-full animate-spin [animation-duration:40s] reverse pointer-events-none" />

      <div className="max-w-4xl text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.2 }}
        >
          <div className="inline-flex items-center gap-3 mb-6 sm:mb-10 px-4 sm:px-6 py-2 bg-text-primary/5 backdrop-blur-md rounded-full border border-white/10 uppercase text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.5em] font-black text-brand-gold">
             <ShieldCheck size={14} strokeWidth={1} /> Cercle Privilège
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-serif leading-tight mb-6 sm:mb-12 tracking-tight md:tracking-tighter italic">
            L'Éclat de <br /><span className="not-italic text-brand-gold">Votre Destination</span>
          </h2>
          <p className="text-text-primary/40 font-light text-sm sm:text-base md:text-xl leading-relaxed mb-8 sm:mb-16 max-w-2xl mx-auto uppercase tracking-normal sm:tracking-tighter">
            Rejoignez notre lettre confidentielle pour recevoir des accès VIP et récits exclusifs directement dans votre boîte privée.
          </p>

          {status === "error" ? (
            <p className="text-red-400/90 text-sm mb-6">Impossible d&apos;enregistrer l&apos;email pour le moment. Réessayez plus tard.</p>
          ) : null}
          {status === "success" ? (
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }} 
               animate={{ scale: 1, opacity: 1 }}
               className="flex flex-col items-center gap-6"
             >
                <div className="w-24 h-24 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/20">
                   <Send size={40} className="text-brand-gold" />
                </div>
                <h3 className="text-2xl font-serif">Merci pour votre confiance.</h3>
                <p className="text-text-primary/40 text-sm italic">Votre accès privilégié est maintenant activé.</p>
             </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 sm:gap-6 p-2.5 sm:p-4 bg-bg-primary border border-border-primary rounded-2xl sm:rounded-full shadow-2xl items-center focus-within:border-brand-gold focus-within:shadow-[0_0_80px_rgba(229,169,58,0.15)] transition-all duration-700">
              <input 
                type="email" 
                placeholder="VOTRE EMAIL" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full md:w-auto flex-grow bg-transparent px-4 sm:px-8 md:px-10 py-3.5 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl focus:outline-none placeholder:text-text-primary/20 tracking-[0.12em] sm:tracking-widest italic"
              />
              <motion.button 
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto min-h-12 px-6 sm:px-12 md:px-16 py-3.5 sm:py-5 md:py-6 bg-text-primary text-bg-primary rounded-xl sm:rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:bg-brand-gold hover:text-brand-black transition-all duration-700 shadow-xl touch-manipulation"
              >
                Intégrer le Cercle
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
