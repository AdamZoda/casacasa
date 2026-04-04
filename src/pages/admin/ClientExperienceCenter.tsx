import React, { useState } from 'react';
import { MessageSquare, Star, Heart, ShieldCheck, Ticket, Users, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportManager } from './SupportManager';
import { TestimonialManager } from './TestimonialManager';
import { useAppContext } from '../../context/AppContext';

export function ClientExperienceCenter() {
  const [activeTab, setActiveTab] = useState<'support' | 'testimonials'>('support');
  const { testimonials } = useAppContext();

  const tabs = [
    { id: 'support', label: 'Conciergerie & Tickets', icon: Ticket },
    { id: 'testimonials', label: 'Témoignages de Prestige', icon: Star, count: testimonials.length },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-border-primary/20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="h-px w-12 bg-brand-gold opacity-50" />
             <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase italic">SATISFACTION & FIDÉLITÉ</p>
          </div>
          <h1 className="text-4xl md:text-7xl font-serif tracking-tighter">Expérience <span className="text-brand-gold italic">Client</span></h1>
          <p className="text-text-primary/40 font-light text-lg max-w-2xl italic leading-relaxed">
            Cultivez l'excellence relationnelle et transformez chaque demande en une expérience mémorable.
          </p>
        </div>
        
        {/* Unified Tab Switcher */}
        <div className="flex bg-text-primary/[0.02] p-1.5 border border-border-primary/50 relative overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-10 py-5 flex items-center gap-4 transition-all duration-1000 ${
                activeTab === tab.id ? 'text-brand-black' : 'text-text-primary/30 hover:text-text-primary'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="clientExperienceActiveTab"
                  className="absolute inset-0 bg-brand-gold" 
                  transition={{ type: "spring", bounce: 0.1, duration: 1 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-4">
                 <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2 : 1} />
                 <span className="text-[10px] uppercase font-black tracking-[0.3em] font-sans">{tab.label}</span>
                 {tab.count !== undefined && (
                   <span className={`text-[9px] w-6 h-6 flex items-center justify-center rounded-full font-black border transition-colors duration-700 ${
                     activeTab === tab.id ? 'bg-brand-black/10 border-black/20' : 'bg-text-primary/5 border-border-primary/50'
                   }`}>
                     {tab.count}
                   </span>
                 )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative"
      >
        {activeTab === 'support' ? (
          <div className="bg-text-primary/[0.01]">
            <SupportManager />
          </div>
        ) : (
          <div className="bg-text-primary/[0.01]">
            <TestimonialManager />
          </div>
        )}
      </motion.div>

      {/* Decorative Brand Manifest */}
      <div className="mt-20 flex flex-col items-center justify-center py-20 border-t border-border-primary/10 opacity-20">
         <Heart size={40} className="text-brand-gold mb-8" strokeWidth={0.5} />
         <p className="text-[9px] uppercase tracking-[0.8em] font-black text-center">
            RESPECT • TRUST • PRESTIGE <br />
            THE ART OF CUSTOMER EXCELLENCE
         </p>
      </div>
    </div>
  );
}
