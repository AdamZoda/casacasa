import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { supabase } from "../lib/supabase";
import { primaryWhatsappDigits } from "../lib/siteSettingsDb";
import { CheckCircle2, MessageCircle, Globe, ChevronLeft, Upload, FileText, ShieldCheck } from "lucide-react";
// ✅ SÉCURITÉ - Importation des fonctions de sanitization
import { 
  sanitizeName, 
  sanitizeEmail, 
  sanitizePhone, 
  sanitizeWhatsappMessage,
  validatePhoneForCountry,
  validatePrice,
  validateFile,
  checkRateLimit 
} from "../lib/security";

const COUNTRIES = [
  { name: "Maroc", code: "+212", flag: "🇲🇦", length: 9 },
  { name: "France", code: "+33", flag: "🇫🇷", length: 9 },
  { name: "Espagne", code: "+34", flag: "🇪🇸", length: 9 },
  { name: "Royaume-Uni", code: "+44", flag: "🇬🇧", length: 10 },
  { name: "États-Unis", code: "+1", flag: "🇺🇸", length: 10 },
  { name: "Émirats Arabes Unis", code: "+971", flag: "🇦🇪", length: 9 },
  { name: "Qatar", code: "+974", flag: "🇶🇦", length: 8 },
  { name: "Arabie Saoudite", code: "+966", flag: "🇸🇦", length: 9 },
  { name: "Suisse", code: "+41", flag: "🇨🇭", length: 9 },
  { name: "Belgique", code: "+32", flag: "🇧🇪", length: 9 },
  { name: "Italie", code: "+39", flag: "🇮🇹", length: 10 },
  { name: "Portugal", code: "+351", flag: "🇵🇹", length: 9 },
  { name: "Canada", code: "+1", flag: "🇨🇦", length: 10 },
  { name: "Allemagne", code: "+49", flag: "🇩🇪", length: 11 },
];

export function CheckoutFlow() {
  const navigate = useNavigate();
  const { cart, addOrder, settings } = useAppContext();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Maroc',
    phoneCode: '+212',
    message: '',
    receipt_base64: null as string | null,
  });

  const total = cart.reduce((sum, item) => sum + parseInt(item.price.toString().replace(/\s/g, ''), 10), 0);

  // Charger les infos du profil utilisateur loggé
  useEffect(() => {
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
        console.log('Profile loading skipped');
      }
    };

    loadUserProfile();
  }, []);

  if (cart.length === 0) {
    return (
      <div className="pt-40 pb-32 px-6 max-w-5xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-5xl font-serif mb-8 text-center">Panier Vide</h1>
        <button 
          onClick={() => navigate('/store')}
          className="px-10 py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-black"
        >
          Retour au Store
        </button>
      </div>
    );
  }

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // ✅ SÉCURITÉ: Valider tous les champs
      if (!formData.name || !formData.email) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      // ✅ SÉCURITÉ: Valider email avec regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert('Email invalide');
        return;
      }

      // ✅ SÉCURITÉ: Valider téléphone pour le pays sélectionné
      if (!validatePhoneForCountry(formData.phone, formData.country)) {
        alert(`Téléphone invalide pour ${formData.country}`);
        return;
      }

      // ✅ SÉCURITÉ: Vérifier longueur minimale du nom
      if (formData.name.length < 2) {
        alert('Le nom doit contenir au moins 2 caractères');
        return;
      }
    }
    
    setStep(prev => (prev + 1) as any);
  };

  const handlePaymentChoice = (channel: 'whatsapp' | 'virement') => {
    if (channel === 'whatsapp') {
      handleWhatsAppPayment();
    } else {
      setStep(3);
    }
  };

  const handleWhatsAppPayment = () => {
    // ✅ SÉCURITÉ: Valider avant d'envoyer
    if (!validatePhoneForCountry(formData.phone, formData.country)) {
      alert('Téléphone invalide pour ' + formData.country);
      return;
    }

    const whatsappNumber = primaryWhatsappDigits(settings) || "212661000000";
    const itemsList = cart.map(item => `• *${item.title}* - ${item.price} MAD`).join('\n');
    
    // ✅ SÉCURITÉ: Utiliser sanitizeName, sanitizeEmail, sanitizePhone
    const safeName = sanitizeName(formData.name);
    const safeEmail = sanitizeEmail(formData.email);
    const safePhone = sanitizePhone(formData.phone);
    
    let messageText = `Bonjour Casa Privilege,\n\n*Je souhaite régler ma commande*\n\n*Articles:*\n${itemsList}\n\n*Client:*\nNom: ${safeName}\nEmail: ${safeEmail}\nTéléphone: ${formData.phoneCode} ${safePhone}\nPays: ${formData.country}\n\n*Total: ${total.toLocaleString()} MAD*\n\n_Demande générée via Casa Privilege Store_`;
    
    // ✅ SÉCURITÉ: Nettoyer le message avant envoi
    messageText = sanitizeWhatsappMessage(messageText);

    const encodedText = encodeURIComponent(messageText);
    window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodedText}`, '_blank');
    
    // Créer la commande avec données sécurisées
    addOrder({
      customer_name: safeName,
      customer_email: safeEmail,
      total: validatePrice(total),
      items: cart
    });

    setStep(4);
  };

  const handleVirementSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // ✅ SÉCURITÉ: Valider le téléphone
    if (!validatePhoneForCountry(formData.phone, formData.country)) {
      alert('Téléphone invalide pour ' + formData.country);
      return;
    }

    // ✅ SÉCURITÉ: Sanitizer les données
    const safeName = sanitizeName(formData.name);
    const safeEmail = sanitizeEmail(formData.email);

    await addOrder({
      customer_name: safeName,
      customer_email: safeEmail,
      total: validatePrice(total),
      items: cart
    });

    setStep(4);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✅ SÉCURITÉ: Valider le fichier (taille, MIME type, extension)
      const validation = validateFile(file, { 
        maxSizeMB: 5, 
        allowedMimes: ['image/jpeg', 'image/png', 'application/pdf'] 
      });

      if (!validation.valid) {
        alert(validation.error || 'Fichier invalide');
        return;
      }

      // ✅ Note: Idéalement, charger vers Supabase Storage au lieu de base64
      // Pour maintenant, on stocke mais d'une manière sécurisée
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData(prev => ({ ...prev, receipt_base64: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getCountryCode = (name: string) => COUNTRIES.find(c => c.name === formData.country)?.code || '+212';
  const currentCountry = COUNTRIES.find(c => c.name === formData.country);

  return (
    <div className="pt-32 pb-32 px-6 max-w-2xl mx-auto min-h-screen">
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-20 pb-8 border-b border-border-primary">
        {[1, 2, 3, 4].map((num) => (
          <motion.div 
            key={num}
            className={`flex flex-col items-center gap-3 ${step >= num ? 'opacity-100' : 'opacity-30'}`}
            animate={{ scale: step === num ? 1.1 : 1 }}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-full font-black text-[11px] ${
              step > num ? 'bg-brand-gold text-brand-black' : step === num ? 'bg-text-primary text-bg-primary' : 'border border-border-primary text-text-primary/20'
            }`}>
              {step > num ? '✓' : num}
            </div>
            <span className="text-[10px] uppercase tracking-widest font-black">
              {num === 1 ? 'Infos' : num === 2 ? 'Paiement' : num === 3 ? 'Pièce' : 'Confirm'}
            </span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Personal Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase mb-4 italic">ÉTAPE 1 / 4</p>
              <h2 className="text-5xl font-serif mb-4">Vos Informations</h2>
              <p className="text-text-primary/40 font-light text-sm italic">{cart.length} article{cart.length !== 1 ? 's' : ''} dans votre panier</p>
            </div>

            <form onSubmit={handleNext} className="space-y-8">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Nom complet" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg"
                />
                <div className="absolute bottom-0 left-0 h-0.5 bg-brand-gold w-0 group-focus-within:w-full transition-all duration-300" />
              </div>

              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Adresse Email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg"
                />
                <div className="absolute bottom-0 left-0 h-0.5 bg-brand-gold w-0 group-focus-within:w-full transition-all duration-300" />
              </div>

              <div className="flex gap-4">
                <select 
                  value={formData.country}
                  onChange={e => {
                    const country = COUNTRIES.find(c => c.name === e.target.value);
                    if (country) {
                      setFormData({...formData, country: e.target.value, phoneCode: country.code});
                    }
                  }}
                  className="flex-1 bg-transparent border-b-2 border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg cursor-pointer"
                >
                  {COUNTRIES.map((c, index) => (
                    <option key={`country-${index}`} value={c.name} className="bg-brand-black text-text-primary">
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <input 
                  type="tel" 
                  placeholder="Téléphone" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  maxLength={currentCountry?.length || 10}
                  className="flex-1 bg-transparent border-b-2 border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg"
                />
              </div>

              <div className="flex items-center gap-4 py-8 px-6 bg-text-primary/[0.02] border border-border-primary rounded-lg">
                <ShieldCheck size={24} className="text-brand-gold flex-shrink-0" strokeWidth={0.5} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-text-primary/60">Vos données sont 100% sécurisées et confidentielles</span>
              </div>

              {/* Résumé Articles */}
              <div className="space-y-4 pt-8 border-t border-border-primary">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/60">Votre Panier</p>
                <div className="space-y-3">
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex justify-between items-center py-3 px-4 bg-text-primary/[0.02] border border-border-primary/50 rounded">
                      <div>
                        <p className="font-light text-sm">{item.title}</p>
                        <p className="text-[9px] uppercase tracking-widest text-text-primary/40">{item.category}</p>
                      </div>
                      <p className="font-black text-brand-gold">{item.price} MAD</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center py-4 px-4 bg-brand-gold/10 border border-brand-gold/50 rounded font-black">
                  <span>TOTAL</span>
                  <span className="text-lg text-brand-gold">{total.toLocaleString()} MAD</span>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <button
                  type="button"
                  onClick={() => navigate('/store')}
                  className="flex-1 py-6 border border-text-primary text-text-primary hover:bg-text-primary/10 transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-black"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  className="flex-1 py-6 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-black"
                >
                  Continuer
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 2: Payment Method Choice */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase mb-4 italic">ÉTAPE 2 / 4</p>
              <h2 className="text-5xl font-serif mb-4">Règlement Prestige</h2>
              <p className="text-text-primary/40 font-light text-sm italic">Choisissez votre canal de paiement privilégié</p>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Items List */}
              <div className="border border-border-primary p-6 space-y-3">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/60 mb-4">Articles Commandés</p>
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex justify-between items-center py-2 border-b border-border-primary/30 last:border-0">
                    <div>
                      <p className="font-light">{item.title}</p>
                      <p className="text-[9px] uppercase tracking-widest text-text-primary/40">{item.category}</p>
                    </div>
                    <p className="font-black text-brand-gold text-sm">{item.price} MAD</p>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border border-border-primary p-8 space-y-4">
                <div className="flex justify-between py-3 border-b border-border-primary/50">
                  <span className="text-text-primary/60 text-[11px] uppercase tracking-[0.2em]">Sous-total</span>
                  <span className="font-black">{total.toLocaleString()} MAD</span>
                </div>
                
                <div className="flex justify-between py-4 bg-text-primary/[0.02] px-4">
                  <span className="text-text-primary/80 text-[11px] uppercase tracking-[0.2em] font-black">Total</span>
                  <span className="text-2xl font-black">{total.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handlePaymentChoice('whatsapp')}
                className="w-full flex items-center justify-center gap-4 py-8 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-black shadow-xl"
              >
                <MessageCircle size={22} strokeWidth={1.5} />
                Payer via Concierge WhatsApp
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-border-primary/50"></div>
                <span className="flex-shrink-0 mx-6 text-text-primary/20 text-[10px] uppercase tracking-widest font-black italic">Ou par virement</span>
                <div className="flex-grow border-t border-border-primary/50"></div>
              </div>

              <button
                onClick={() => handlePaymentChoice('virement')}
                className="w-full flex items-center justify-center gap-4 py-8 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-black"
              >
                <Upload size={22} strokeWidth={1} />
                Envoyer le Reçu
              </button>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full text-text-primary/20 text-[10px] uppercase tracking-widest hover:text-brand-gold transition-colors text-center font-black py-4"
            >
              ← Retour
            </button>
          </motion.div>
        )}

        {/* STEP 3: Transfer Receipt Upload */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-12"
          >
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase mb-4 italic">ÉTAPE 3 / 4</p>
              <h2 className="text-5xl font-serif mb-4">Confirmation de Transfert</h2>
              <p className="text-text-primary/40 font-light text-sm italic">Joignez le reçu de votre virement</p>
            </div>

            {/* Bank Details */}
            <div className="space-y-4 p-8 bg-text-primary/[0.02] border border-border-primary/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-text-primary/60">Bénéficiaire</span>
                <span className="font-black">{settings.bankBeneficiary || 'COMANE EXCELLENCE SARL'}</span>
              </div>
              {settings.bankRib && (
                <div className="flex justify-between items-center pt-4 border-t border-border-primary/50">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-text-primary/60">RIB</span>
                  <span className="font-mono text-sm">{settings.bankRib}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-4 border-t border-border-primary/50">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-text-primary/60">Montant</span>
                <span className="text-2xl font-black text-brand-gold">{total.toLocaleString()} MAD</span>
              </div>
            </div>

            {/* Résumé Articles Étape 3 */}
            <div className="space-y-4 p-8 bg-text-primary/[0.02] border border-border-primary/50 rounded-lg">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/60">Résumé Commande</p>
              <div className="space-y-2">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex justify-between text-sm">
                    <span className="font-light">{item.title}</span>
                    <span className="text-brand-gold font-black">{item.price} MAD</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-border-primary/50 flex justify-between font-black">
                <span>TOTAL</span>
                <span className="text-lg text-brand-gold">{total.toLocaleString()} MAD</span>
              </div>
            </div>

            <form onSubmit={handleVirementSubmit} className="space-y-8">
              {/* Receipt Upload */}
              <label className="relative block border-2 border-dashed border-border-primary py-12 text-center hover:border-brand-gold transition-colors cursor-pointer group bg-text-primary/[0.02] rounded-lg">
                <input 
                  type="file" 
                  required
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload size={32} strokeWidth={0.5} className="mx-auto mb-4 text-text-primary/20 group-hover:text-brand-gold transition-colors" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-text-primary/30 group-hover:text-text-primary transition-colors italic font-black block">
                  {formData.receipt_base64 ? '✓ Reçu chargé' : 'Cliquez pour charger le reçu'}
                </span>
                <span className="text-[9px] uppercase tracking-[0.1em] text-text-primary/20 block mt-2">(Image/PDF - Max 5MB)</span>
              </label>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-6 border border-text-primary text-text-primary hover:bg-text-primary/10 transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-black"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={!formData.receipt_base64}
                  className="flex-1 py-6 bg-text-primary text-bg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-gold hover:text-brand-black transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-black"
                >
                  Valider la Commande
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 4: Confirmation */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <CheckCircle2 size={64} className="mx-auto text-brand-gold mb-4" strokeWidth={1} />
            </motion.div>

            <div>
              <h2 className="text-6xl font-serif mb-4">Commande Confirmée!</h2>
              <p className="text-text-primary/60 font-light text-lg">Nous avons reçu votre paiement avec succès</p>
            </div>

            <div className="space-y-3 py-8 px-6 bg-text-primary/[0.02] border border-border-primary rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-text-primary/60 text-[11px] uppercase tracking-[0.2em] font-black">Montant Payé</span>
                <span className="text-2xl font-black text-brand-gold">{total.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-border-primary/50">
                <span className="text-text-primary/60 text-[11px] uppercase tracking-[0.2em] font-black">Email</span>
                <span className="font-light">{formData.email}</span>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <p className="text-text-primary/60 text-sm font-light">Un email de confirmation a été envoyé à <span className="font-black text-text-primary">{formData.email}</span></p>
              <p className="text-text-primary/40 text-[11px] uppercase tracking-[0.2em]">Vous serez contacté très bientôt par notre équipe</p>
            </div>

            <button
              onClick={() => navigate('/store')}
              className="mx-auto block px-10 py-6 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-500 uppercase tracking-[0.3em] text-[11px] font-black"
            >
              Retour au Store
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
