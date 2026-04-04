import React, { useState } from 'react';
import { useAppContext } from "../../context/AppContext";
import { 
  Save, Globe, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, 
  ShieldAlert, X, Palette, Image as ImageIcon, MessageCircle, 
  Layout as LayoutIcon, RotateCcw, Upload, Loader2, CreditCard, ShieldCheck 
} from "lucide-react";
import { uploadImage } from "../../lib/storage";

type TabType = 'general' | 'design' | 'bank' | 'security';

export function SettingsView() {
  const { settings, updateSettings } = useAppContext();
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'general', label: 'Informations', icon: Globe },
    { id: 'design', label: 'Design & Apparence', icon: Palette },
    { id: 'bank', label: 'Gestion RIB', icon: CreditCard },
    { id: 'security', label: 'Sécurité & Dates', icon: ShieldAlert },
  ];

  const handleReset = (section: string) => {
    if (section === 'hero') {
      setFormData({
        ...formData,
        heroBackgroundUrl: 'https://images.unsplash.com/photo-1540998145320-f5139c824c62?q=80&w=2940&auto=format&fit=crop',
        heroTitle: '',
        heroSubtitle: '',
        heroCta: '',
      });
    } else if (section === 'branding') {
      setFormData({
        ...formData,
        brandGoldColor: '#E5A93A',
        logoText: 'CASA PRIVILEGE',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-bg-primary/50 backdrop-blur-xl border border-border-primary p-8 rounded-2xl">
        <div>
          <h2 className="text-4xl font-serif mb-2">Configuration Globale</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest flex items-center gap-2">
            Contrôle Centralisé • <span className="text-brand-gold">{tabs.find(t => t.id === activeTab)?.label}</span>
          </p>
        </div>
        <button 
          onClick={() => handleSubmit()}
          className={`px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold transition-all flex items-center gap-3 shadow-2xl ${
            saved 
            ? 'bg-green-500 text-white' 
            : 'bg-brand-gold text-brand-black hover:bg-white hover:scale-105 active:scale-95'
          }`}
        >
          {saved ? <ShieldCheck size={18} /> : <Save size={18} />}
          {saved ? 'Configurations Enregistrées' : 'Enregistrer les Modifications'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Vertical Navigation */}
        <div className="lg:col-span-1 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 text-xs font-medium tracking-[0.1em] uppercase transition-all border ${
                activeTab === tab.id
                  ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/30 shadow-[0_0_20px_rgba(229,169,58,0.1)]'
                  : 'text-text-primary/40 hover:bg-text-primary/5 hover:text-text-primary border-transparent'
              }`}
            >
              <tab.icon size={20} strokeWidth={1.5} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-3 min-h-[600px]">
          {/* TAB: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-bg-primary border border-border-primary p-10 space-y-10 group">
                <div className="flex items-center gap-4 pb-6 border-b border-border-primary/30">
                  <Globe size={24} className="text-brand-gold" />
                  <h3 className="text-2xl font-serif">Informations Publiques</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Nom de la Plateforme</label>
                    <input 
                      type="text" 
                      value={formData.siteName}
                      onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                      className="w-full bg-text-primary/5 border border-border-primary p-5 text-sm focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Email de Contact</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-primary/30" size={18} />
                      <input 
                        type="email" 
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                        className="w-full bg-text-primary/5 border border-border-primary py-5 pl-14 pr-5 text-sm focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Téléphone Officiel</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-text-primary/30" size={18} />
                      <input 
                        type="text" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-text-primary/5 border border-border-primary py-5 pl-14 pr-5 text-sm focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Siège Social</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-text-primary/30" size={18} />
                      <input 
                        type="text" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-text-primary/5 border border-border-primary py-5 pl-14 pr-5 text-sm focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-10 space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.3em] text-text-primary/40 font-bold border-l-2 border-brand-gold pl-4">Réseaux Sociaux</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                      <Instagram className="absolute left-5 top-1/2 -translate-y-1/2 text-text-primary/30" size={18} />
                      <input 
                        type="url" 
                        placeholder="Instagram"
                        value={formData.socialLinks.instagram}
                        onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, instagram: e.target.value}})}
                        className="w-full bg-text-primary/5 border border-border-primary py-5 pl-14 pr-5 text-xs focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Facebook className="absolute left-5 top-1/2 -translate-y-1/2 text-text-primary/30" size={18} />
                      <input 
                        type="url" 
                        placeholder="Facebook"
                        value={formData.socialLinks.facebook}
                        onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, facebook: e.target.value}})}
                        className="w-full bg-text-primary/5 border border-border-primary py-5 pl-14 pr-5 text-xs focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Linkedin className="absolute left-5 top-1/2 -translate-y-1/2 text-text-primary/30" size={18} />
                      <input 
                        type="url" 
                        placeholder="LinkedIn"
                        value={formData.socialLinks.linkedin}
                        onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                        className="w-full bg-text-primary/5 border border-border-primary py-5 pl-14 pr-5 text-xs focus:outline-none focus:border-brand-gold transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DESIGN */}
          {activeTab === 'design' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* HERO DESIGN */}
              <div className="bg-bg-primary border border-border-primary p-10 space-y-10 group">
                <div className="flex items-center justify-between pb-6 border-b border-border-primary/30">
                  <div className="flex items-center gap-4">
                    <ImageIcon size={24} className="text-brand-gold" />
                    <h3 className="text-2xl font-serif">Expérience Visuelle (Hero)</h3>
                  </div>
                  <button onClick={() => handleReset('hero')} className="text-[10px] uppercase tracking-widest text-text-primary/20 hover:text-brand-gold transition-all flex items-center gap-2">
                    <RotateCcw size={12} /> Réinitialiser
                  </button>
                </div>

                <div className="relative h-64 overflow-hidden border border-border-primary rounded-lg group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-700">
                  <img src={formData.heroBackgroundUrl} className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000" alt="Preview" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <h4 className="text-3xl font-serif mb-2 text-white">{formData.heroTitle || "Aperçu de votre Titre"}</h4>
                    <p className="text-xs tracking-[0.4em] uppercase text-brand-gold">{formData.heroSubtitle || "Votre sous-titre élégant ici"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Photo de Couverture Principal</label>
                    <label className="flex flex-col items-center justify-center gap-4 h-40 bg-text-primary/5 border border-dashed border-border-primary rounded-lg cursor-pointer hover:border-brand-gold transition-all group">
                      {isUploading ? <Loader2 size={30} className="animate-spin text-brand-gold" /> : <Upload size={30} className="text-text-primary/10 group-hover:text-brand-gold transition-all" />}
                      <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">{isUploading ? 'Chargement...' : 'Nouvelle Image'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setIsUploading(true);
                          try {
                            const url = await uploadImage(file);
                            setFormData({...formData, heroBackgroundUrl: url});
                          } catch (err) { alert("Erreur d'upload"); }
                          finally { setIsUploading(false); }
                        }
                      }} />
                    </label>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Bouton d'Action (CTA)</label>
                       <input type="text" value={formData.heroCta} onChange={e => setFormData({...formData, heroCta: e.target.value})} placeholder="Ex: Explorer les Expériences" className="w-full bg-text-primary/5 border border-border-primary p-5 text-sm focus:outline-none focus:border-brand-gold transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Couleur Signature</label>
                       <div className="flex gap-4">
                         <input type="color" value={formData.brandGoldColor} onChange={e => setFormData({...formData, brandGoldColor: e.target.value})} className="w-16 h-16 border border-border-primary bg-transparent cursor-pointer" />
                         <input type="text" value={formData.brandGoldColor} onChange={e => setFormData({...formData, brandGoldColor: e.target.value})} className="flex-grow bg-text-primary/5 border border-border-primary p-5 text-sm font-mono focus:outline-none" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER & BRANDING */}
              <div className="bg-bg-primary border border-border-primary p-10 space-y-10">
                <div className="flex items-center gap-4 pb-6 border-b border-border-primary/30">
                  <LayoutIcon size={24} className="text-brand-gold" />
                  <h3 className="text-2xl font-serif">Identité du Bas de Page</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Logo Textuel (Barre de Menu)</label>
                    <input type="text" value={formData.logoText} onChange={e => setFormData({...formData, logoText: e.target.value})} className="w-full bg-text-primary/5 border border-border-primary p-5 text-2xl font-serif tracking-[0.2em] focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">WhatsApp Flottant (Numéro)</label>
                    <div className="relative">
                      <MessageCircle className="absolute left-5 top-1/2 -translate-y-1/2 text-[#25D366]" size={18} />
                      <input type="text" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} placeholder="2126..." className="w-full bg-text-primary/5 border border-border-primary py-5 pl-14 pr-5 text-sm focus:outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BANK / RIB */}
          {activeTab === 'bank' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-bg-primary border border-border-primary p-10 space-y-10">
                <div className="flex items-center gap-4 pb-6 border-b border-border-primary/30">
                  <CreditCard size={24} className="text-brand-gold" />
                  <h3 className="text-2xl font-serif">Coordonnées Bancaires (RIB)</h3>
                </div>
                
                <div className="bg-brand-gold/[0.03] border border-brand-gold/20 p-8 rounded-lg relative overflow-hidden">
                   <ShieldCheck size={120} className="absolute right-0 top-0 text-brand-gold/5 -translate-y-1/4 translate-x-1/4" strokeWidth={0.5} />
                   <div className="relative z-10">
                      <p className="text-xs text-brand-gold uppercase tracking-[0.2em] font-bold mb-4">Aperçu du Tunnel de Paiement</p>
                      <div className="bg-bg-primary/50 backdrop-blur-md p-6 border border-border-primary rounded space-y-4">
                        <div>
                           <span className="text-[8px] uppercase tracking-widest text-text-primary/40 block mb-1">Bénéficiaire</span>
                           <p className="text-lg font-serif">{formData.bankBeneficiary || "Non configuré"}</p>
                        </div>
                        <div>
                           <span className="text-[8px] uppercase tracking-widest text-text-primary/40 block mb-1">RIB ({formData.bankName || "Banque"})</span>
                           <p className="text-sm font-mono tracking-tighter text-brand-gold">{formData.bankRib || "000 000 0000000000000000 00"}</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Nom de la Banque</label>
                    <input 
                      type="text" 
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      placeholder="Ex: Bank Of Africa"
                      className="w-full bg-text-primary/5 border border-border-primary p-5 text-sm focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Bénéficiaire Officiel</label>
                    <input 
                      type="text" 
                      value={formData.bankBeneficiary}
                      onChange={(e) => setFormData({...formData, bankBeneficiary: e.target.value})}
                      className="w-full bg-text-primary/5 border border-border-primary p-5 text-sm focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Clé RIB (24 chiffres)</label>
                    <input 
                      type="text" 
                      value={formData.bankRib}
                      onChange={(e) => setFormData({...formData, bankRib: e.target.value})}
                      placeholder="000 000 0000000000000000 00"
                      className="w-full bg-text-primary/5 border border-border-primary p-5 text-sm font-mono focus:outline-none focus:border-brand-gold transition-all"
                    />
                    <p className="text-[9px] text-text-primary/30 uppercase tracking-widest italic mt-2">*Ce RIB apparaîtra uniquement à l'étape finale des réservations Web.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY / DATES */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* MAINTENANCE */}
              <div className="bg-bg-primary border border-border-primary p-10 space-y-10 group">
                <div className="flex items-center justify-between pb-6 border-b border-border-primary/30">
                   <div className="flex items-center gap-4">
                     <ShieldAlert size={24} className={formData.maintenanceMode ? "text-red-500" : "text-brand-gold"} />
                     <h3 className="text-2xl font-serif">Mode Maintenance</h3>
                   </div>
                   <button 
                    onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
                    className={`w-16 h-8 rounded-full transition-all relative ${formData.maintenanceMode ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-text-primary/10'}`}
                  >
                    <div className={`absolute top-1.5 w-5 h-5 bg-white rounded-full transition-all ${formData.maintenanceMode ? 'left-9' : 'left-1.5'}`} />
                  </button>
                </div>
                <p className="text-sm text-text-primary/40 italic">Lorsqu'activé, les clients publics verront une page de maintenance. L'administration reste accessible.</p>
              </div>

              {/* BLOCKED DATES */}
              <div className="bg-bg-primary border border-border-primary p-10 space-y-10">
                <div className="flex justify-between items-center pb-6 border-b border-border-primary/30">
                   <div className="flex items-center gap-4">
                     <ShieldCheck size={24} className="text-brand-gold" />
                     <h3 className="text-2xl font-serif">Restrictions de Calendrier</h3>
                   </div>
                </div>

                <div className="flex gap-4">
                  <input type="date" id="blockedDate" className="flex-grow bg-text-primary/5 border border-border-primary p-5 text-sm focus:outline-none focus:border-brand-gold transition-all" />
                  <button onClick={() => {
                    const input = document.getElementById('blockedDate') as HTMLInputElement;
                    if (input.value && !formData.blockedDates.includes(input.value)) {
                      setFormData({...formData, blockedDates: [...formData.blockedDates, input.value].sort()});
                      input.value = '';
                    }
                  }} className="bg-brand-gold text-brand-black px-10 text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all">Bloquer</button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                  {formData.blockedDates.map(date => (
                    <div key={date} className="flex justify-between items-center bg-text-primary/5 border border-border-primary p-4 group hover:border-brand-gold transition-all">
                      <span className="text-xs font-mono font-bold">{date}</span>
                      <button onClick={() => setFormData({...formData, blockedDates: formData.blockedDates.filter(d => d !== date)})} className="text-text-primary/20 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  {formData.blockedDates.length === 0 && <p className="col-span-full text-center text-text-primary/20 text-xs py-12 uppercase tracking-widest italic">Aucune date bloquée</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
