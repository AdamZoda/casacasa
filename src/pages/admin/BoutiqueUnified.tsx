import React, { useState } from 'react';
import { ShoppingBag, Package, TrendingUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OrderManager } from './OrderManager';
import { StoreManager } from './StoreManager';
import { useAppContext } from '../../context/AppContext';

export function BoutiqueUnified() {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'analytics'>('orders');
  const { orders, products } = useAppContext();

  const tabs = [
    { id: 'orders', label: 'Commandes Récentes', icon: Package, count: orders.length },
    { id: 'inventory', label: 'Gestion du Catalogue', icon: ShoppingBag, count: products.length },
    { id: 'analytics', label: 'Aperçu des Ventes', icon: TrendingUp },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border-primary/30 pb-12">
        <div>
          <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase mb-4 italic">EXPÉRIENCE COMMERCIALE</p>
          <h1 className="text-4xl md:text-6xl font-serif">Maison Casa <span className="text-brand-gold italic">Boutique</span></h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-text-primary/[0.03] p-1 border border-border-primary rounded-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative px-8 py-4 flex items-center gap-4 transition-all duration-700 overflow-hidden ${
                activeTab === tab.id ? 'text-brand-black' : 'text-text-primary/40 hover:text-text-primary'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabBg"
                  className="absolute inset-0 bg-brand-gold" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
                 <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2 : 1} />
                 <span className="text-[10px] uppercase font-black tracking-widest">{tab.label}</span>
                 {tab.count !== undefined && (
                   <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${activeTab === tab.id ? 'bg-brand-black/20' : 'bg-text-primary/10'}`}>
                     {tab.count}
                   </span>
                 )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      >
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'inventory' && <StoreManager />}
        {activeTab === 'analytics' && (
          <div className="min-h-[500px] flex flex-col items-center justify-center border border-dashed border-border-primary/50 bg-text-primary/[0.01] rounded-sm p-20 text-center">
             <div className="w-24 h-24 rounded-full bg-brand-gold/5 flex items-center justify-center border border-brand-gold/10 mb-10">
                <TrendingUp size={40} className="text-brand-gold" strokeWidth={0.5} />
             </div>
             <h3 className="text-3xl font-serif mb-6 italic">Statistiques de Performance Luxe</h3>
             <p className="text-text-primary/40 font-light text-lg max-w-lg mb-10">
                Cette section sera bientôt disponible pour vous aider à analyser vos meilleures ventes et les préférences de vos clients VIP.
             </p>
             <button className="px-10 py-5 border border-border-primary text-[10px] uppercase tracking-widest font-black text-text-primary/30 cursor-not-allowed">
                Analyse Prédictive en Cours...
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
