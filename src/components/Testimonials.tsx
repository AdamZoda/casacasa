import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, Star, Plus, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function Testimonials() {
  const { testimonials, addTestimonial } = useAppContext();
  const approvedTestimonials = testimonials.filter(t => t.isApproved);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTestimonial({
      name: formData.name,
      role: formData.role,
      content: formData.content,
      rating: formData.rating,
      image: ''
    });
    setSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSubmitted(false);
      setFormData({ name: '', role: '', content: '', rating: 5 });
    }, 3000);
  };

  return (
    <section className="py-32 bg-brand-black text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 relative">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6"
          >
            Témoignages
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif mb-12"
          >
            L'Expérience Casa Privilege
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px w-32 bg-brand-gold mx-auto mb-12"
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-3 bg-transparent border border-brand-gold/50 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-colors duration-300 text-sm tracking-widest uppercase font-light"
          >
            <Plus size={16} /> Ajouter un Commentaire
          </button>
        </div>
      </div>

      {/* Infinite Scroll Container */}
      {approvedTestimonials.length > 0 ? (
        <div className="relative w-full flex overflow-hidden border-y border-white/5 bg-white/[0.02] py-20">
          <div className="flex animate-marquee whitespace-nowrap min-w-max hover:[animation-play-state:paused]">
            {[...approvedTestimonials, ...approvedTestimonials, ...approvedTestimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="w-[400px] md:w-[500px] mx-8 flex flex-col items-center text-center group relative flex-shrink-0 whitespace-normal"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                  <Quote size={80} strokeWidth={0.5} className="text-brand-gold" />
                </div>
                
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={12} className="fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                <p className="text-xl md:text-2xl font-light leading-relaxed mb-8 text-white/70 italic font-serif relative z-10 w-full px-4">
                  "{testimonial.content}"
                </p>
                
                <div className="mt-auto space-y-3">
                  <div className="w-12 h-px bg-brand-gold/30 mx-auto" />
                  <p className="font-serif text-brand-gold text-xl tracking-wide">{testimonial.name}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 text-white/20 italic font-light tracking-widest max-w-7xl mx-auto">
          Soyez le premier à partager votre expérience.
        </div>
      )}

      {/* Add Testimonial Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-[#111111] border border-white/10 p-8 w-full max-w-lg relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={24} />
              </button>
              
              <h3 className="text-3xl font-serif text-brand-gold mb-2">Votre Expérience</h3>
              <p className="text-white/60 text-sm mb-8">Partagez votre avis sur Casa Privilege. Il sera publié après validation par notre équipe.</p>
              
              {submitted ? (
                <div className="text-center py-12 text-green-400 font-medium tracking-wide">
                  Merci ! Votre commentaire a été soumis avec succès.<br/>
                  <span className="text-white/50 text-sm mt-2 block">En attente de validation.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Nom Complet</label>
                    <input 
                      type="text" required
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-brand-gold text-white"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Titre / Rôle</label>
                    <input 
                      type="text" required
                      value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-brand-gold text-white"
                      placeholder="Ex: Voyageur Fréquent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Note sur 5</label>
                    <select 
                      value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                      className="w-full bg-[#111111] border border-white/10 p-3 outline-none focus:border-brand-gold text-white"
                    >
                      <option value={5}>5 Étoiles - Excellent</option>
                      <option value={4}>4 Étoiles - Très Bien</option>
                      <option value={3}>3 Étoiles - Bien</option>
                      <option value={2}>2 Étoiles - Moyen</option>
                      <option value={1}>1 Étoile - À éviter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/50 mb-2">Votre Message</label>
                    <textarea 
                      required rows={4}
                      value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-brand-gold text-white"
                      placeholder="Racontez-nous..."
                    />
                  </div>
                  
                  <button type="submit" className="w-full bg-brand-gold text-brand-black font-semibold py-4 uppercase tracking-widest text-xs mt-4 hover:bg-white transition-colors">
                    Soumettre mon avis
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
