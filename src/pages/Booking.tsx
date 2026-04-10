import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { format, addDays, getDaysInMonth, startOfMonth, getDay, isBefore, isAfter, startOfDay, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useAppContext } from "../context/AppContext";
import { primaryWhatsappDigits } from "../lib/siteSettingsDb";
import { supabase } from "../lib/supabase";
import { CheckCircle2, MessageCircle, Globe, ChevronLeft, ChevronRight, Users as UsersIcon, MapPin, Copy, Upload, FileText, ShieldCheck } from "lucide-react";

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

export function Booking() {
  const { universeId, activityId } = useParams<{ universeId: string, activityId: string }>();
  const navigate = useNavigate();
  const { addReservation, universes, activities, settings } = useAppContext();
  
  const universe = universes.find(u => u.id === universeId);
  const activity = activities.find(a => a.id === activityId);

  const minDays = activity?.minAdvanceDays || 0;
  const minDate = addDays(startOfDay(new Date()), minDays);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(minDate));
  
  const [formData, setFormData] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    time: '14:00',
    name: '',
    email: '',
    phone: '',
    message: '',
    country: 'Maroc',
    phoneCode: '+212',
    peopleCount: 1,
    receipt_base64: null as string | null,
  });

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
        console.log('Profile loading skipped (user not authenticated)');
      }
    };

    loadUserProfile();
  }, []);

  const getNumericPrice = (priceStr: string | undefined): number => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/g);
    if (!match) return 0;
    return parseInt(match.join(''), 10);
  };

  const dailyPrice = getNumericPrice(activity?.price);
  const durationInDays = formData.startDate && formData.endDate 
    ? Math.max(1, Math.floor((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1)
    : 0;
  const totalPrice = dailyPrice * durationInDays * formData.peopleCount;

  if (!universe || !activity) {
    return <Navigate to="/" replace />;
  }

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    setStep(prev => (prev + 1) as any);
  };

  const handleFinalSubmit = (channel: 'web' | 'whatsapp') => {
    if (channel === 'whatsapp') {
      addReservation({
        activity_id: activity.id,
        activity_title: activity.title,
        universe_id: universe.id,
        date: format(formData.startDate!, 'yyyy-MM-dd'),
        end_date: format(formData.endDate!, 'yyyy-MM-dd'),
        time: formData.time,
        name: formData.name,
        country: formData.country,
        phone_code: formData.phoneCode,
        phone: formData.phone,
        email: formData.email,
        people_count: formData.peopleCount,
        total_price: totalPrice,
        contact: `${formData.phoneCode} ${formData.phone}`,
        message: formData.message,
        channel
      });

      const whatsappNumber = primaryWhatsappDigits(settings) || "212661000000";
      const activityPrice = dailyPrice ? `\n*Tarif :* ${totalPrice.toLocaleString()} ${activity.price?.includes('DH') ? 'DH' : '€'} (${dailyPrice.toLocaleString()} x ${durationInDays} jours)` : '';
      const activityImage = activity.image ? `\n*Aperçu :* ${activity.image}` : '';
      
      const messageText = `✨ *DÉTAILS DE LA RÉSERVATION* ✨
---------------------------------------
🏛️ *Activité :* ${activity.title}
🌍 *Monde :* ${universe.name}${activityPrice}${activityImage}

🕒 *Séjour :* Du ${format(formData.startDate!, 'dd/MM/yyyy')} au ${format(formData.endDate!, 'dd/MM/yyyy')}
⌛ *Durée :* ${durationInDays} ${durationInDays > 1 ? 'jours' : 'jour'}
⏰ *Heure :* ${formData.time}

👤 *Client :* ${formData.name}
📍 *Pays :* ${formData.country}
👥 *Pers :* ${formData.peopleCount}
📧 *Email :* ${formData.email}
📱 *Tel :* ${formData.phoneCode} ${formData.phone}

💬 *Demande particulière :*
${formData.message || "_Aucune_"}
---------------------------------------
_Demande générée via le Concierge Casa Privilege_`;

      const encodedText = encodeURIComponent(messageText);
      window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}?text=${encodedText}`, '_blank');
      setStep(5);
    } else {
      // Pour le Web, on passe à l'étape du virement (Step 4)
      setStep(4);
    }
  };

  const handleTransferSubmit = async () => {
    addReservation({
      activity_id: activity.id,
      activity_title: activity.title,
      universe_id: universe.id,
      date: format(formData.startDate!, 'yyyy-MM-dd'),
      end_date: format(formData.endDate!, 'yyyy-MM-dd'),
      time: formData.time,
      name: formData.name,
      country: formData.country,
      phone_code: formData.phoneCode,
      phone: formData.phone,
      email: formData.email,
      people_count: formData.peopleCount,
      total_price: totalPrice,
      contact: `${formData.phoneCode} ${formData.phone}`,
      message: formData.message,
      receipt_base64: formData.receipt_base64 || undefined,
      channel: 'web'
    });

    setStep(5);
    setTimeout(() => {
      navigate(`/universe/${universe.id}`);
    }, 5000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, receipt_base64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateClick = (day: Date) => {
    const clickedDay = startOfDay(day);
    
    // Case 0: Nothing selected yet
    if (!formData.startDate || !formData.endDate) {
      setFormData({ ...formData, startDate: clickedDay, endDate: clickedDay });
      return;
    }

    const start = startOfDay(formData.startDate);
    const end = startOfDay(formData.endDate);

    // Case 1: Clicked BEFORE the current start -> Extend start backwards
    if (isBefore(clickedDay, start)) {
      setFormData({ ...formData, startDate: clickedDay });
    } 
    // Case 2: Clicked AFTER the current end -> Extend end forwards
    else if (isAfter(clickedDay, end)) {
      setFormData({ ...formData, endDate: clickedDay });
    }
    // Case 3: Clicked on a boundary or inside -> Reset to a single day to allow new range
    else {
      setFormData({ ...formData, startDate: clickedDay, endDate: clickedDay });
    }
  };

  const isInRange = (day: Date) => {
    if (!formData.startDate || !formData.endDate) return false;
    const d = startOfDay(day);
    const s = startOfDay(formData.startDate);
    const e = startOfDay(formData.endDate);
    return d >= s && d <= e;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = getDay(currentMonth);
  const blanks = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }).map((_, i) => i);
  const days = Array.from({ length: daysInMonth }).map((_, i) => addDays(currentMonth, i));

  return (
    <div className="pt-28 md:pt-40 pb-20 md:pb-24 px-4 sm:px-6 max-w-5xl mx-auto w-full min-h-screen flex flex-col">
      <div className="text-center mb-10 md:mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl mb-3 md:mb-4 font-serif"
        >
          Réservation Privée
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-brand-gold font-light tracking-[0.2em] md:tracking-widest uppercase text-[11px] md:text-sm"
        >
          {activity.title}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-bg-primary text-text-primary border border-border-primary p-4 sm:p-6 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="flex justify-between mb-8 md:mb-12 relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-px bg-border-primary -z-10"></div>
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-serif transition-colors duration-500 ${step >= i ? 'bg-brand-gold text-brand-black font-medium border-4 border-bg-primary shadow-[0_0_0_1px_#E5A93A]' : 'bg-bg-primary border border-border-primary text-text-primary/60'}`}
            >
              {i}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleNext}
              className="flex flex-col gap-6 md:gap-10"
            >
              <h3 className="text-xl md:text-2xl font-serif text-center mb-2 md:mb-4">Date & Heure</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
                <div>
                  <div className="flex justify-between items-center mb-4 md:mb-6">
                    <button type="button" onClick={() => setCurrentMonth(addDays(currentMonth, -daysInMonth))} className="p-2 hover:text-brand-gold transition-colors"><ChevronLeft size={20} /></button>
                    <span className="font-serif text-base md:text-xl uppercase tracking-[0.15em] md:tracking-widest">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</span>
                    <button type="button" onClick={() => setCurrentMonth(addDays(currentMonth, daysInMonth))} className="p-2 hover:text-brand-gold transition-colors"><ChevronRight size={20} /></button>
                  </div>
                  
                  <div className="grid grid-cols-7 border-b border-border-primary/20">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <div key={`${day}-${i}`} className="text-center text-[10px] text-text-primary/20 font-black py-2.5 md:py-4">{day}</div>
                  ))}
                </div>
                  
                  <div className="grid grid-cols-7 gap-1 border border-border-primary/50 p-1.5 md:p-2 bg-text-primary/5">
                    {blanks.map(b => <div key={`blank-${b}`} className="aspect-square"></div>)}
                    {days.map(day => {
                      const dayStr = format(day, 'yyyy-MM-dd');
                      const isBlocked = settings.blockedDates?.includes(dayStr);
                      const isPast = isBefore(day, minDate);
                      const isDisabled = isPast || isBlocked;
                      const isSelected = (formData.startDate && isSameDay(day, formData.startDate)) || (formData.endDate && isSameDay(day, formData.endDate));
                      const inRange = isInRange(day);
                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleDateClick(day)}
                          className={`aspect-square flex items-center justify-center text-xs md:text-sm transition-all relative
                            ${isDisabled ? 'text-red-500/40 bg-red-500/5 cursor-not-allowed line-through' : 
                              isSelected ? 'bg-brand-gold text-brand-black font-black shadow-lg z-10' : 
                              inRange ? 'bg-brand-gold/20 text-brand-gold' :
                              'hover:bg-text-primary/10 hover:text-brand-gold hover:border-brand-gold/50 cursor-pointer border border-transparent'
                            }`}
                        >
                          <span className="relative z-10">{format(day, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>
                  {(minDays > 0 || (settings.blockedDates && settings.blockedDates.length > 0)) && (
                    <div className="mt-4 space-y-1">
                      {minDays > 0 && (
                        <p className="text-[10px] text-brand-gold text-center tracking-widest">
                          *Cette activité requiert {minDays} {minDays > 1 ? 'jours' : 'jour'} de préparation minimum.
                        </p>
                      )}
                      {settings.blockedDates?.length > 0 && (
                        <p className="text-[10px] text-red-500/60 text-center tracking-widest uppercase">
                          Certaines dates sont indisponibles.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-5 md:gap-8">
                  <div>
                    <label className="block text-text-primary/60 text-[10px] uppercase tracking-[0.2em] mb-3 md:mb-4">Période sélectionnée</label>
                    <div className="w-full bg-text-primary/5 border border-border-primary p-4 md:p-6 rounded-sm">
                      <div className="text-text-primary font-serif italic text-lg md:text-xl mb-2">
                        {formData.startDate && formData.endDate ? (
                          isSameDay(formData.startDate, formData.endDate) 
                            ? format(formData.startDate, 'd MMMM yyyy', { locale: fr })
                            : `Du ${format(formData.startDate, 'd')} au ${format(formData.endDate, 'd MMMM yyyy', { locale: fr })}`
                        ) : (
                          <span className="text-text-primary/30 not-italic font-sans text-xs md:text-sm tracking-[0.2em] md:tracking-widest uppercase">Sélectionnez vos dates</span>
                        )}
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-border-primary/20">
                        <span className="text-[10px] uppercase tracking-widest text-text-primary/40">
                          {durationInDays > 0 ? `${durationInDays} ${durationInDays > 1 ? 'jours' : 'jour'}` : '--'}
                        </span>
                        {totalPrice > 0 && (
                          <div className="text-right">
                             <span className="text-[10px] uppercase tracking-widest text-text-primary/40 block mb-1">Total Estimé</span>
                             <div className="flex flex-col items-end">
                             <span className="text-brand-gold font-bold text-base md:text-lg leading-none">{totalPrice.toLocaleString()} {activity.price?.includes('DH') ? 'DH' : '€'}</span>
                               <span className="text-[8px] uppercase tracking-tighter text-text-primary/30 mt-1 italic">
                                 ({dailyPrice.toLocaleString()} {activity.price?.includes('DH') ? 'DH' : '€'} x {formData.peopleCount} pers x {durationInDays}j)
                               </span>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-text-primary/60 text-[10px] uppercase tracking-[0.2em] mb-3 md:mb-4">Heure souhaitée</label>
                    <input 
                      type="time" 
                      required
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-transparent border-b border-border-primary py-3 md:py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-base md:text-lg text-center"
                    />
                  </div>
                  
                  <button type="submit" className="mt-4 md:mt-8 w-full min-h-12 py-3 md:py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-colors duration-500 uppercase tracking-[0.2em] md:tracking-widest text-xs md:text-sm font-medium">
                    Continuer
                  </button>
                </div>
              </div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleNext}
              className="flex flex-col gap-6 md:gap-8 max-w-2xl mx-auto w-full"
            >
              <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2 text-center">Vos Informations</h3>
              
              <div className="space-y-5 md:space-y-8">
                <div className="group relative">
                  <input 
                    type="text" 
                    placeholder="Nom complet" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-border-primary py-3 md:py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-base md:text-lg"
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 text-text-primary/10 group-focus-within:text-brand-gold transition-colors">
                    <UsersIcon size={18} strokeWidth={1} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                  {/* Email */}
                  <input 
                    type="email" 
                    placeholder="Adresse Email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-border-primary py-3 md:py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-base md:text-lg"
                  />
                  
                  {/* People Count */}
                  <div className="relative">
                    <select
                      value={formData.peopleCount}
                      onChange={e => setFormData({...formData, peopleCount: parseInt(e.target.value)})}
                      className="w-full bg-transparent border-b border-border-primary py-3 md:py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-base md:text-lg appearance-none"
                    >
                      {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => (
                        <option key={n} value={n} className="bg-bg-primary">{n} personne{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-text-primary/20">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                  {/* Country Selector */}
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={e => {
                        const country = COUNTRIES.find(c => c.name === e.target.value);
                        if (country) {
                          setFormData({...formData, country: country.name, phoneCode: country.code});
                        }
                      }}
                      className="w-full bg-transparent border-b border-border-primary py-3 md:py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-base md:text-lg appearance-none pl-10"
                    >
                      {COUNTRIES.map(c => (
                        <option key={c.name} value={c.name} className="bg-bg-primary">{c.flag} {c.name}</option>
                      ))}
                    </select>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-gold">
                      <MapPin size={18} strokeWidth={1} />
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-text-primary/20">
                      <ChevronRight size={16} className="rotate-90" />
                    </div>
                  </div>

                  {/* Smart Phone Input */}
                  <div className="flex items-end gap-2 border-b border-border-primary focus-within:border-brand-gold transition-colors">
                    <span className="pb-3 md:pb-4 text-brand-gold font-medium">{formData.phoneCode}</span>
                    <input 
                      type="tel" 
                      placeholder="Numéro de téléphone" 
                      required
                      value={formData.phone}
                      onChange={e => {
                        const country = COUNTRIES.find(c => c.name === formData.country);
                        const val = e.target.value.replace(/\D/g, '');
                        if (country && val.length <= country.length) {
                          setFormData({...formData, phone: val});
                        }
                      }}
                      className="flex-grow bg-transparent py-3 md:py-4 text-text-primary focus:outline-none font-light text-base md:text-lg"
                    />
                  </div>
                </div>

                <textarea 
                  placeholder="Demandes particulières (Besoin de chauffeur, guide bilingue...)" 
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-border-primary py-3 md:py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-base md:text-lg resize-none italic"
                />
              </div>

              <div className="flex gap-3 md:gap-4 mt-4 md:mt-8">
                <button type="button" onClick={() => setStep(1)} className="w-1/3 min-h-12 py-3 md:py-5 border border-border-primary text-text-primary hover:border-brand-gold hover:text-brand-gold transition-colors duration-500 uppercase tracking-[0.15em] md:tracking-widest text-[11px] md:text-sm">
                  Retour
                </button>
                <button 
                  type="submit" 
                  disabled={!formData.startDate || !formData.endDate}
                  className="w-full min-h-12 py-3 md:py-6 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-700 uppercase tracking-[0.2em] md:tracking-[0.4em] text-[11px] md:text-xs font-bold shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 md:gap-8 max-w-xl mx-auto w-full"
            >
              <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2 text-center">Finalisation</h3>
              <p className="text-text-primary/60 font-light text-sm mb-6 text-center">Choisissez votre canal de suivi pour cette réservation.</p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleFinalSubmit('whatsapp')}
                  className="flex items-center justify-center gap-3 md:gap-4 w-full min-h-12 py-3 md:py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-colors duration-500 group"
                >
                  <MessageCircle size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                  <span className="uppercase tracking-[0.2em] md:tracking-widest text-[11px] md:text-sm font-medium">Finaliser via WhatsApp</span>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border-primary"></div>
                  <span className="flex-shrink-0 mx-6 text-text-primary/60 text-xs uppercase tracking-[0.2em]">Ou</span>
                  <div className="flex-grow border-t border-border-primary"></div>
                </div>

                <button
                  onClick={() => handleFinalSubmit('web')}
                  className="flex items-center justify-center gap-3 md:gap-4 w-full min-h-12 py-3 md:py-5 border border-border-primary text-text-primary hover:border-brand-gold hover:text-brand-gold transition-colors duration-500 group"
                >
                  <Globe size={20} strokeWidth={1} className="group-hover:-translate-y-1 transition-transform duration-500" />
                  <span className="uppercase tracking-[0.2em] md:tracking-widest text-[11px] md:text-sm font-light">Finaliser sur le site</span>
                </button>
              </div>

              <button type="button" onClick={() => setStep(2)} className="mt-4 text-text-primary/60 text-xs uppercase tracking-[0.2em] hover:text-text-primary transition-colors text-center py-4">
                ← Retour
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6 md:gap-8 max-w-2xl mx-auto w-full"
            >
              <h3 className="text-xl md:text-2xl font-serif mb-1 md:mb-2 text-center">Confirmation de Virement</h3>
              <p className="text-text-primary/60 font-light text-sm mb-6 text-center italic">
                Pour confirmer votre réservation, veuillez effectuer un virement de <span className="text-brand-gold font-bold">{totalPrice.toLocaleString()} {activity.price?.includes('DH') ? 'DH' : '€'}</span> et nous joindre le reçu ci-dessous.
              </p>

              <div className="bg-text-primary/[0.03] border border-brand-gold/30 p-4 sm:p-6 md:p-8 rounded-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <ShieldCheck size={120} strokeWidth={0.5} />
                </div>
                <div className="relative z-10 space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-text-primary/40 block mb-1">Bénéficiaire</span>
                    <p className="text-base md:text-lg font-serif">{settings.bankBeneficiary || "COMANE EXCELLENCE SARL"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-text-primary/40 block mb-1">RIB ({settings.bankName || "Bank Of Africa"})</span>
                    <div className="flex items-center justify-between gap-4 bg-bg-primary/50 p-3 border border-border-primary rounded cursor-pointer hover:border-brand-gold transition-colors"
                         onClick={() => {
                           navigator.clipboard.writeText(settings.bankRib || "011 780 0000000000000000 00");
                           alert("RIB copié !");
                         }}>
                      <p className="text-xs md:text-sm font-mono tracking-tighter break-all">{settings.bankRib || "011 780 0000000000000000 00"}</p>
                      <Copy size={16} className="text-brand-gold" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-3 mb-2">
                    <Upload size={16} className="text-brand-gold" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/60">Dépôt du reçu de virement</span>
                 </div>
                 
                 <label className="relative border-2 border-dashed border-border-primary hover:border-brand-gold transition-all duration-500 rounded-xl p-6 md:p-12 flex flex-col items-center justify-center gap-4 cursor-pointer group overflow-hidden">
                    {formData.receipt_base64 ? (
                      <div className="flex flex-col items-center gap-4">
                        {formData.receipt_base64.startsWith('data:image') ? (
                          <img src={formData.receipt_base64} alt="Preuve" className="max-h-40 rounded shadow-2xl" />
                        ) : (
                          <div className="flex items-center gap-3 bg-text-primary/10 px-4 md:px-6 py-2.5 md:py-3 rounded-full">
                            <FileText size={20} className="text-brand-gold" />
                            <span className="text-sm font-medium">Fichier reçu chargé</span>
                          </div>
                        )}
                        <p className="text-xs text-brand-gold font-bold uppercase tracking-widest">Cliquer pour changer</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-text-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <Upload size={24} className="text-brand-gold opacity-50 group-hover:opacity-100" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium mb-1 tracking-tight">Déposez votre reçu ici</p>
                          <p className="text-[10px] text-text-primary/30 uppercase tracking-widest">Capture d'écran ou PDF (Max 10Mo)</p>
                        </div>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileUpload} />
                 </label>
              </div>

              <div className="flex gap-4 mt-4">
                <button type="button" onClick={() => setStep(3)} className="w-1/3 min-h-12 py-3 md:py-5 border border-border-primary text-text-primary hover:border-brand-gold hover:text-brand-gold transition-colors duration-500 uppercase tracking-[0.15em] md:tracking-widest text-[11px] md:text-sm">
                  Retour
                </button>
                <button 
                  onClick={handleTransferSubmit}
                  disabled={!formData.receipt_base64}
                  className="w-full min-h-12 py-3 md:py-6 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-700 uppercase tracking-[0.2em] md:tracking-[0.4em] text-[11px] md:text-xs font-bold shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Confirmer ma réservation
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-8 md:py-12 text-center max-w-xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <CheckCircle2 size={80} strokeWidth={1} className="text-brand-gold mb-8" />
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-serif mb-3 md:mb-4">Demande Transmise</h3>
              <p className="text-text-primary/60 font-light text-base md:text-lg mb-2">Votre réservation et votre reçu ont été enregistrés avec succès.</p>
              <p className="text-text-primary/60 font-light text-sm italic">Notre équipe de conciergerie validera votre demande sous peu. Merci de votre confiance.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
