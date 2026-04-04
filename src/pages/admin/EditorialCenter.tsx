import React, { useState } from 'react';
import { Sparkles, BookOpen, ChevronRight, PenTool, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalServiceManager } from './GlobalServiceManager';
import { JournalManager } from './JournalManager';
import { useAppContext } from '../../context/AppContext';

export function EditorialCenter() {
  const [activeTab, setActiveTab] = useState<'services' | 'journal'>('services');
  const { globalServices, journalPosts } = useAppContext();

  const tabs = [
    { id: 'services', label: 'Excellence sur Mesure', icon: Sparkles, count: globalServices.length },
    { id: 'journal', label: 'Journal Casa Privilege', icon: BookOpen, count: journalPosts.length },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header section with Premium Aesthetic */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-border-primary/20 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="h-px w-12 bg-brand-gold opacity-50" />
             <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase italic">PRESTIGE & ÉDITORIAL</p>
          </div>
          <h1 className="text-4xl md:text-7xl font-serif tracking-tighter">Signature <span className="text-brand-gold italic">Casa Privilege</span></h1>
          <p className="text-text-primary/40 font-light text-lg max-w-2xl italic leading-relaxed">
            Cultivez l'art de vivre et gérez vos services d'exception ainsi que vos chroniques confidentielles.
          </p>
        </div>
        
        {/* Luxury Tab Switcher */}
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
                  layoutId="editorialActiveTab"
                  className="absolute inset-0 bg-brand-gold" 
                  transition={{ type: "spring", bounce: 0.1, duration: 1 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-4">
                 <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2 : 1} className="transition-transform duration-700" />
                 <span className="text-[10px] uppercase font-black tracking-[0.3em] font-sans">{tab.label}</span>
                 <span className={`text-[9px] w-6 h-6 flex items-center justify-center rounded-full font-black border transition-colors duration-700 ${
                   activeTab === tab.id ? 'bg-brand-black/10 border-black/20' : 'bg-text-primary/5 border-border-primary/50'
                 }`}>
                   {tab.count}
                 </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Content Loading */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: activeTab === 'services' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative"
      >
        {activeTab === 'services' ? (
          <div className="bg-text-primary/[0.01]">
            <GlobalServiceManager />
          </div>
        ) : (
          <div className="bg-text-primary/[0.01]">
            <JournalManager />
          </div>
        )}
      </motion.div>

      {/* Decorative Brand Manifest - Minimal and Elegant */}
      <div className="mt-20 flex flex-col items-center justify-center py-20 border-t border-border-primary/10 opacity-20">
         <Sparkles size={40} className="text-brand-gold mb-8" strokeWidth={0.5} />
         <p className="text-[9px] uppercase tracking-[0.8em] font-black text-center">
            EVERY WORD • EVERY SERVICE • EVERY DETAIL <br />
            IS A STEP TOWARDS PERFECTION
         </p>
      </div>
    </div>
  );
}
