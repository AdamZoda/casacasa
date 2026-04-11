import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Upload, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { formatMoney } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { primaryWhatsappDigits } from "../lib/siteSettingsDb";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: any[];
  total?: number;
}

export function PaymentModal({ isOpen, onClose, items, total }: PaymentModalProps) {
  const { addOrder, settings, currency, exchangeRates } = useAppContext();
  const [method, setMethod] = useState<'selection' | 'upload' | 'success'>('selection');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Charger les infos du profil utilisateur loggé quando abre le modal
  useEffect(() => {
    if (!isOpen) return;

    const loadUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) return;

        setFormData(prev => ({
          ...prev,
          name: profile.full_name || '',
          email: profile.email || session.user.email || '',
        }));
      } catch (err) {
        console.log('Profile loading skipped (user not authenticated)');
      }
    };

    loadUserProfile();
  }, [isOpen]);

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Bonjour Casa Privilege, je souhaite régler ma commande de ${formatMoney(total ?? 0, currency, exchangeRates)}.`);
    window.open(
      `https://wa.me/${primaryWhatsappDigits(settings) || "212600000000"}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
    onClose();
  };

  const handleUploadSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (items && total) {
      await addOrder({
        customer_name: formData.name,
        customer_email: formData.email,
        total: total,
        items: items
      });
    }
    
    setMethod('success');
    setTimeout(() => {
      onClose();
      setTimeout(() => setMethod('selection'), 500);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/90 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-bg-primary border border-border-primary p-12 z-[101] shadow-3xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-text-primary/20 hover:text-brand-gold transition-colors"
            >
              <X size={24} strokeWidth={1} />
            </button>

            {method === 'selection' && (
              <div className="flex flex-col gap-10">
                <div className="text-center">
                  <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase mb-4 italic">TRANSACTION SÉCURISÉE</p>
                  <h3 className="text-4xl font-serif mb-4">Règlement Prestige</h3>
                  <p className="text-text-primary/40 font-light text-sm italic">Choisissez votre canal de paiement privilégié.</p>
                </div>

                <div className="space-y-6">
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center justify-center gap-6 w-full py-6 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-500 rounded-full"
                  >
                    <MessageCircle size={22} strokeWidth={1.5} />
                    <span className="uppercase tracking-[0.3em] text-[11px] font-black">Payer via Concierge</span>
                  </button>

                  <div className="relative flex items-center py-4">
                    <div className="flex-grow border-t border-border-primary/50"></div>
                    <span className="flex-shrink-0 mx-6 text-text-primary/20 text-[10px] uppercase tracking-widest font-black italic">Ou par virement</span>
                    <div className="flex-grow border-t border-border-primary/50"></div>
                  </div>

                  <button
                    onClick={() => setMethod('upload')}
                    className="flex items-center justify-center gap-6 w-full py-6 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-500 rounded-full"
                  >
                    <Upload size={22} strokeWidth={1} />
                    <span className="uppercase tracking-[0.3em] text-[11px] font-black">Envoyer le Reçu</span>
                  </button>
                </div>
              </div>
            )}

            {method === 'upload' && (
              <form onSubmit={handleUploadSubmit} className="flex flex-col gap-8">
                <div className="text-center">
                   <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase mb-4 italic">CONFIRMATION DE TRANSFERT</p>
                   <h3 className="text-4xl font-serif">Valider la Vente</h3>
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <input 
                      type="text" placeholder="NOM COMPLET" required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg tracking-widest"
                    />
                  </div>
                  <div className="relative group">
                    <input 
                      type="email" placeholder="EMAIL DE CONTACT" required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg tracking-widest"
                    />
                  </div>
                  
                  <div className="relative border border-dashed border-border-primary py-12 text-center hover:border-brand-gold transition-colors cursor-pointer group bg-text-primary/[0.02]">
                    <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <Upload size={32} strokeWidth={0.5} className="mx-auto mb-4 text-text-primary/20 group-hover:text-brand-gold transition-colors" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-text-primary/30 group-hover:text-text-primary transition-colors italic">Télécharger le Reçu (Image/PDF)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-8 mt-4 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-700 uppercase tracking-[0.5em] text-[11px] font-black shadow-2xl"
                >
                  Finaliser la Commande
                </button>
                
                <button
                  type="button"
                  onClick={() => setMethod('selection')}
                  className="text-text-primary/20 text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors text-center font-black"
                >
                  Retour
                </button>
              </form>
            )}

            {method === 'success' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <CheckCircle2 size={100} strokeWidth={0.5} className="text-brand-gold mb-10" />
                </motion.div>
                <h3 className="text-4xl font-serif mb-6">Demande Reçue</h3>
                <p className="text-text-primary/40 text-lg font-light italic">Votre conseiller personnel valide votre commande immédiatement.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
