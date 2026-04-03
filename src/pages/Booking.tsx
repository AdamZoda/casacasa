import { useState, type FormEvent } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { format, addDays, getDaysInMonth, startOfMonth, getDay, isBefore, startOfDay, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useAppContext } from "../context/AppContext";
import { CheckCircle2, MessageCircle, Globe, ChevronLeft, ChevronRight } from "lucide-react";

export function Booking() {
  const { universeId, activityId } = useParams<{ universeId: string, activityId: string }>();
  const navigate = useNavigate();
  const { addReservation, universes, activities } = useAppContext();
  
  const universe = universes.find(u => u.id === universeId);
  const activity = activities.find(a => a.id === activityId);

  const minDays = activity?.minAdvanceDays || 0;
  const minDate = addDays(startOfDay(new Date()), minDays);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(minDate));
  
  const [formData, setFormData] = useState({
    date: minDate,
    time: '14:00',
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  if (!universe || !activity) {
    return <Navigate to="/" replace />;
  }

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    setStep(prev => (prev + 1) as any);
  };

  const handleFinalSubmit = (channel: 'web' | 'whatsapp') => {
    addReservation({
      activityId: activity.id,
      activityTitle: activity.title,
      universeId: universe.id,
      date: format(formData.date, 'yyyy-MM-dd'),
      time: formData.time,
      name: formData.name,
      contact: `${formData.email} / ${formData.phone}`,
      message: formData.message,
      channel
    });

    if (channel === 'whatsapp') {
      const text = encodeURIComponent(`Bonjour Casa Privilege,\n\nJe souhaite réserver l'activité suivante :\n*${activity.title}* (${universe.name})\n\nDate: ${format(formData.date, 'dd/MM/yyyy')} à ${formData.time}\nNom: ${formData.name}\nEmail: ${formData.email}\nTel: ${formData.phone}\nMessage: ${formData.message}\n\nMerci de me confirmer la disponibilité.`);
      window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
    }

    setStep(4);
    setTimeout(() => {
      navigate(`/universe/${universe.id}`);
    }, 3000);
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const startDay = getDay(currentMonth); // 0 (Sun) to 6 (Sat)
  const blanks = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }).map((_, i) => i);
  const days = Array.from({ length: daysInMonth }).map((_, i) => addDays(currentMonth, i));
  const { settings } = useAppContext();

  return (
    <div className="pt-40 pb-24 px-6 max-w-5xl mx-auto w-full min-h-screen flex flex-col">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl mb-4 font-serif"
        >
          Réservation Privée
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-brand-gold font-light tracking-widest uppercase text-sm"
        >
          {activity.title}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-bg-primary text-text-primary border border-border-primary p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="flex justify-between mb-12 relative max-w-2xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-px bg-border-primary -z-10"></div>
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-serif transition-colors duration-500 ${step >= i ? 'bg-brand-gold text-brand-black font-medium border-4 border-bg-primary shadow-[0_0_0_1px_#E5A93A]' : 'bg-bg-primary border border-border-primary text-text-primary/60'}`}
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
              className="flex flex-col gap-10"
            >
              <h3 className="text-2xl font-serif text-center mb-4">Date & Heure</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Large Calendar UI */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <button type="button" onClick={() => setCurrentMonth(addDays(currentMonth, -daysInMonth))} className="p-2 hover:text-brand-gold transition-colors"><ChevronLeft size={20} /></button>
                    <span className="font-serif text-xl uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</span>
                    <button type="button" onClick={() => setCurrentMonth(addDays(currentMonth, daysInMonth))} className="p-2 hover:text-brand-gold transition-colors"><ChevronRight size={20} /></button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
                      <div key={d} className="text-xs tracking-widest text-text-primary/40 pb-2">{d}</div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 border border-border-primary/50 p-2 bg-text-primary/5">
                    {blanks.map(b => <div key={`blank-${b}`} className="aspect-square"></div>)}
                    {days.map(day => {
                      const dayStr = format(day, 'yyyy-MM-dd');
                      const isBlocked = settings.blockedDates?.includes(dayStr);
                      const isPast = isBefore(day, minDate);
                      const isDisabled = isPast || isBlocked;
                      const isSelected = isSameDay(day, formData.date);
                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setFormData({...formData, date: day})}
                          className={`aspect-square flex items-center justify-center text-sm transition-all
                            ${isDisabled ? 'text-red-500/40 bg-red-500/5 cursor-not-allowed line-through' : 
                              isSelected ? 'bg-brand-gold text-brand-black font-medium shadow-lg scale-105' : 
                              'hover:bg-text-primary/10 hover:text-brand-gold hover:border-brand-gold/50 cursor-pointer border border-transparent'
                            }`}
                        >
                          {format(day, 'd')}
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

                <div className="flex flex-col justify-center gap-8">
                  <div>
                    <label className="block text-text-primary/60 text-xs uppercase tracking-widest mb-4">Date sélectionnée</label>
                    <div className="w-full bg-text-primary/5 border border-border-primary py-4 px-6 text-text-primary font-light text-lg">
                      {format(formData.date, 'EEEE d MMMM yyyy', { locale: fr })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-text-primary/60 text-xs uppercase tracking-widest mb-4">Heure souhaitée</label>
                    <input 
                      type="time" 
                      required
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg text-center"
                    />
                  </div>
                  
                  <button type="submit" className="mt-8 w-full py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-colors duration-500 uppercase tracking-widest text-sm font-medium">
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
              className="flex flex-col gap-8 max-w-2xl mx-auto w-full"
            >
              <h3 className="text-2xl font-serif mb-2 text-center">Vos Informations</h3>
              
              <div className="space-y-8">
                <input 
                  type="text" 
                  placeholder="Nom complet" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input 
                    type="email" 
                    placeholder="Adresse Email" 
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg"
                  />
                  <input 
                    type="tel" 
                    placeholder="Téléphone" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg"
                  />
                </div>
                <textarea 
                  placeholder="Demandes particulières (Optionnel)" 
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg resize-none"
                />
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setStep(1)} className="w-1/3 py-5 border border-border-primary text-text-primary hover:border-brand-gold hover:text-brand-gold transition-colors duration-500 uppercase tracking-widest text-sm">
                  Retour
                </button>
                <button type="submit" className="w-2/3 py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-colors duration-500 uppercase tracking-widest text-sm font-medium">
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
              className="flex flex-col gap-8 max-w-xl mx-auto w-full"
            >
              <h3 className="text-2xl font-serif mb-2 text-center">Finalisation</h3>
              <p className="text-text-primary/60 font-light text-sm mb-6 text-center">Choisissez votre canal de suivi pour cette réservation.</p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleFinalSubmit('whatsapp')}
                  className="flex items-center justify-center gap-4 w-full py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-colors duration-500 group"
                >
                  <MessageCircle size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                  <span className="uppercase tracking-widest text-sm font-medium">Finaliser via WhatsApp</span>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-border-primary"></div>
                  <span className="flex-shrink-0 mx-6 text-text-primary/60 text-xs uppercase tracking-[0.2em]">Ou</span>
                  <div className="flex-grow border-t border-border-primary"></div>
                </div>

                <button
                  onClick={() => handleFinalSubmit('web')}
                  className="flex items-center justify-center gap-4 w-full py-5 border border-border-primary text-text-primary hover:border-brand-gold hover:text-brand-gold transition-colors duration-500 group"
                >
                  <Globe size={24} strokeWidth={1} className="group-hover:-translate-y-1 transition-transform duration-500" />
                  <span className="uppercase tracking-widest text-sm font-light">Finaliser sur le site</span>
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-12 text-center max-w-xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <CheckCircle2 size={80} strokeWidth={1} className="text-brand-gold mb-8" />
              </motion.div>
              <h3 className="text-3xl font-serif mb-4">Demande Transmise</h3>
              <p className="text-text-primary/60 font-light text-lg">Notre équipe de conciergerie vous contactera très prochainement au {formData.phone}.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
