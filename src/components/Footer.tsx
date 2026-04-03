import { motion } from "motion/react";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";
import { Send, CheckCircle2 } from "lucide-react";

export function Footer() {
  const { language, subscribeNewsletter, settings } = useAppContext();
  const t = translations[language];
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
  const phone = settings.phone || '+212 5XX XX XX XX';
  const emailContact = settings.contactEmail || 'contact@casaprivilege.com';
  const socialLinks = settings.socialLinks || { instagram: '#', facebook: '#', linkedin: '#' };

  return (
    <footer className="pt-32 pb-12 px-6 bg-brand-black text-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
          <div className="space-y-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight whitespace-pre-line"
            >
              {title}
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/contact"
                className="inline-block px-10 py-5 bg-transparent border border-white/30 text-white hover:bg-brand-gold hover:border-brand-gold hover:text-brand-black transition-all duration-500 uppercase tracking-[0.2em] text-sm font-medium"
              >
                {cta}
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-col justify-end space-y-12">
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-gold">Newsletter</h3>
              <p className="text-white/60 text-sm font-light max-w-md leading-relaxed">
                Rejoignez notre cercle exclusif pour recevoir les dernières actualités sur nos univers et collections éphémères.
              </p>
              
              <form onSubmit={handleSubscribe} className="relative max-w-md group">
                <input 
                  type="email" 
                  required
                  placeholder="VOTRE ADRESSE EMAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-white/20 py-4 pr-12 text-xs tracking-widest uppercase focus:outline-none focus:border-brand-gold transition-all placeholder:text-white/20"
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-brand-gold transition-colors"
                >
                  {isSubscribed ? <CheckCircle2 size={20} className="text-green-500" /> : <Send size={20} />}
                </button>
                {isSubscribed && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-4 text-[10px] uppercase tracking-widest text-green-500 font-bold"
                  >
                    Merci pour votre inscription
                  </motion.p>
                )}
              </form>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/10">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Contact</h4>
                <p className="text-xs tracking-widest text-white/60">{phone}</p>
                <p className="text-xs tracking-widest text-white/60">{emailContact}</p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Social</h4>
                <div className="flex gap-6">
                  {socialLinks.instagram && <a href={socialLinks.instagram} className="text-xs tracking-widest text-white/60 hover:text-brand-gold transition-colors">Instagram</a>}
                  {socialLinks.linkedin && <a href={socialLinks.linkedin} className="text-xs tracking-widest text-white/60 hover:text-brand-gold transition-colors">LinkedIn</a>}
                  {socialLinks.facebook && <a href={socialLinks.facebook} className="text-xs tracking-widest text-white/60 hover:text-brand-gold transition-colors">Facebook</a>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center text-white/20 text-[10px] font-light tracking-[0.3em] uppercase gap-6 pt-12 border-t border-white/5">
          <p>© {new Date().getFullYear()} {settings.siteName || "Casa Privilege"}</p>
          <div className="flex gap-12">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
