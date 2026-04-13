import { motion } from "motion/react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";
import { isPathHidden } from "../lib/hiddenPages";
import { Send, CheckCircle2, Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  const { language, subscribeNewsletter, settings, universes } = useAppContext();
  const t = translations[language];
  const hp = settings.hiddenPages ?? [];
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeNewsletter(email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const title = settings.footerTitle || t.footer.title;
  const cta = settings.footerCta || t.footer.cta;
  const phones = settings.phones.filter(Boolean);
  const emailContact = settings.contactEmail || 'contact@casaprivilege.com';
  const socialLinks = settings.socialLinks;

  return (
    <footer className="border-t border-white/5 bg-[#050505] px-6 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] pt-40 text-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          {/* Brand & Philosophy */}
          <div className="space-y-10">
            <h2 className="text-3xl font-serif tracking-tighter text-brand-gold">
               {settings.logoText || "CASA PRIVILEGE"}
            </h2>
            <p className="text-white/40 text-[11px] leading-[2.2] tracking-widest uppercase font-light max-w-xs italic">
              "L'excellence n'est pas un acte, mais une habitude. Nous créons des moments suspendus pour les âmes les plus exigeantes."
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              {socialLinks.instagram.map((url) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-all duration-500">
                  <Instagram size={18} />
                </a>
              ))}
              {socialLinks.linkedin.map((url) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-all duration-500">
                  <Linkedin size={18} />
                </a>
              ))}
              {socialLinks.facebook.map((url) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-all duration-500">
                  <Facebook size={18} />
                </a>
              ))}
              {socialLinks.youtube.map((url) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="p-3 border border-white/10 rounded-full hover:border-brand-gold hover:text-brand-gold transition-all duration-500">
                  <Youtube size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Universes Navigation */}
          <div className="space-y-10">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">Les Univers</h4>
            <ul className="space-y-6">
               {!isPathHidden("/universe", hp) &&
                 universes.slice(0, 5).map((u) => (
                   <li key={u.id}>
                     <Link
                       to={`/universe/${u.id}`}
                       className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest font-light flex items-center gap-4 group"
                     >
                       <span className="w-4 h-px bg-brand-gold/20 group-hover:w-8 transition-all duration-500" />
                       {u.name}
                     </Link>
                   </li>
                 ))}
               {!isPathHidden("/store", hp) && (
                 <li>
                   <Link
                     to="/store"
                     className="text-white/30 hover:text-white transition-colors text-xs uppercase tracking-widest font-light flex items-center gap-4 group"
                   >
                     <span className="w-4 h-px bg-brand-gold/20 group-hover:w-8 transition-all duration-500" />
                     Boutique Exclusive
                   </Link>
                 </li>
               )}
            </ul>
          </div>

          {/* Private Channels */}
          <div className="space-y-10">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">Salon Privé</h4>
            <div className="space-y-8">
               <div className="flex flex-col gap-3">
                  <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Contact direct</span>
                  {phones.length > 0 ? (
                    phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="text-xl font-serif text-white hover:text-brand-gold transition-colors block">
                        {p}
                      </a>
                    ))
                  ) : (
                    <span className="text-xl font-serif text-white/35">+212 5XX XX XX XX</span>
                  )}
               </div>
               <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Ligne Sécurisée</span>
                  <a href={`mailto:${emailContact}`} className="text-lg italic font-light text-white/60 hover:text-white transition-colors">{emailContact}</a>
               </div>
               {!isPathHidden("/contact", hp) && (
                 <Link to="/contact">
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     className="mt-4 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brand-gold transition-all duration-500 rounded-sm"
                   >
                     Solliciter le Concierge
                   </motion.button>
                 </Link>
               )}
            </div>
          </div>

          {/* Newsletter / Circle */}
          <div className="space-y-10">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-brand-gold">Le Cercle</h4>
            <p className="text-white/40 text-[11px] leading-relaxed tracking-widest uppercase italic">
              Inscrivez-vous pour recevoir nos invitations confidentielles.
            </p>
            <form onSubmit={handleSubscribe} className="relative group">
              <input 
                type="email" 
                required
                placeholder="VOTRE ADRESSE EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-white/10 py-5 text-[11px] tracking-[0.3em] uppercase focus:outline-none focus:border-brand-gold transition-all placeholder:text-white/10 italic"
              />
              <button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-brand-gold transition-colors"
              >
                {isSubscribed ? <CheckCircle2 size={24} className="text-green-500" /> : <Send size={24} strokeWidth={1} />}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex flex-col md:flex-row items-center gap-12">
              <p className="text-[9px] uppercase tracking-[0.5em] text-white/20 font-black">© {new Date().getFullYear()} {settings.siteName || "Casa Privilege"} • Excellence Sur Mesure</p>
              <div className="flex gap-8">
                 {!isPathHidden("/about", hp) && (
                   <Link to="/about" className="text-[9px] uppercase tracking-widest text-white/15 hover:text-white transition-colors">About Us</Link>
                 )}
                 <Link to="/privacy" className="text-[9px] uppercase tracking-widest text-white/15 hover:text-white transition-colors">Privacy</Link>
                 <Link to="/terms" className="text-[9px] uppercase tracking-widest text-white/15 hover:text-white transition-colors">Terms</Link>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]" />
              <span className="text-[8px] uppercase tracking-[0.4em] font-black text-white/20 italic">Global Network Fully Operational</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
