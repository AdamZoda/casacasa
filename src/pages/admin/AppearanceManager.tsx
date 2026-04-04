import React, { useState } from 'react';
import { useAppContext } from "../../context/AppContext";
import { Save, Image, Palette, Type, MessageCircle, Layout, Eye, RotateCcw, Upload, Loader2 } from "lucide-react";
import { uploadImage } from "../../lib/storage";

export function AppearanceManager() {
  const { settings, updateSettings } = useAppContext();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'branding' | 'footer' | 'whatsapp'>('hero');
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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

  const sections = [
    { id: 'hero' as const, label: 'Hero Section', icon: Image },
    { id: 'branding' as const, label: 'Branding & Colors', icon: Palette },
    { id: 'footer' as const, label: 'Footer', icon: Layout },
    { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageCircle },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Appearance</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">Customize the look & feel of your website</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-8 py-4 text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-3 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-brand-gold text-brand-black hover:bg-text-primary hover:text-bg-primary'
          }`}
        >
          <Save size={18} />
          {saved ? 'Saved ✓' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Nav */}
        <div className="lg:col-span-1 space-y-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 text-sm font-medium tracking-wide transition-all ${
                activeSection === s.id
                  ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                  : 'text-text-primary/60 hover:bg-text-primary/5 hover:text-text-primary border border-transparent'
              }`}
            >
              <s.icon size={20} strokeWidth={1.5} />
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="space-y-8">
              <div className="bg-bg-primary border border-border-primary p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif flex items-center gap-3">
                    <Image size={20} className="text-brand-gold" /> Hero Background
                  </h3>
                  <button
                    onClick={() => handleReset('hero')}
                    className="text-[10px] uppercase tracking-widest text-text-primary/40 hover:text-brand-gold transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>

                {/* Live Preview */}
                <div className="relative h-48 overflow-hidden border border-border-primary">
                  <img
                    src={formData.heroBackgroundUrl}
                    alt="Hero Preview"
                    className="w-full h-full object-cover opacity-50"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540998145320-f5139c824c62?q=80&w=2940&auto=format&fit=crop'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                    <h4 className="text-2xl font-serif mb-2">{formData.heroTitle || formData.logoText}</h4>
                    <p className="text-xs tracking-widest uppercase opacity-70">{formData.heroSubtitle || 'Your subtitle here'}</p>
                  </div>
                </div>

                 <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Background Image</label>
                    <div className="flex gap-4 items-center">
                      <label className="flex-grow flex items-center justify-center gap-3 bg-text-primary/5 border border-dashed border-border-primary p-8 text-xs cursor-pointer hover:border-brand-gold transition-all group">
                        {isUploading ? (
                          <Loader2 size={24} className="animate-spin text-brand-gold" />
                        ) : (
                          <Upload size={24} className="text-text-primary/20 group-hover:text-brand-gold transition-colors" />
                        )}
                        <div className="text-left">
                          <p className="font-medium text-sm">{isUploading ? 'Chargement en cours...' : 'Cliquez pour uploader une nouvelle photo'}</p>
                          <p className="text-[10px] text-text-primary/40 uppercase mt-1">Format recommandé: 1920x1080px</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              setIsUploading(true);
                              try {
                                  const url = await uploadImage(e.target.files[0]);
                                  const newSettings = {...formData, heroBackgroundUrl: url};
                                  setFormData(newSettings);
                                  updateSettings(newSettings); // Auto-save on upload
                                } catch (err) {
                                alert((err as Error).message);
                              } finally {
                                setIsUploading(false);
                              }
                            }
                          }} 
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-bg-primary border border-border-primary p-8 space-y-8">
                <h3 className="text-xl font-serif flex items-center gap-3">
                  <Type size={20} className="text-brand-gold" /> Hero Text Overrides
                </h3>
                <p className="text-xs text-text-primary/40">Leave empty to use the default translated text.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Custom Title</label>
                    <input
                      type="text"
                      value={formData.heroTitle}
                      onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                      placeholder="Casa Privilege"
                      className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Custom Subtitle</label>
                    <input
                      type="text"
                      value={formData.heroSubtitle}
                      onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                      placeholder="A Collection of Luxury Concierge Brands"
                      className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">CTA Button Text</label>
                    <input
                      type="text"
                      value={formData.heroCta}
                      onChange={(e) => setFormData({...formData, heroCta: e.target.value})}
                      placeholder="Explorer les Expériences"
                      className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BRANDING */}
          {activeSection === 'branding' && (
            <div className="space-y-8">
              <div className="bg-bg-primary border border-border-primary p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-serif flex items-center gap-3">
                    <Palette size={20} className="text-brand-gold" /> Brand Identity
                  </h3>
                  <button
                    onClick={() => handleReset('branding')}
                    className="text-[10px] uppercase tracking-widest text-text-primary/40 hover:text-brand-gold transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={12} /> Reset
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Logo Text</label>
                    <input
                      type="text"
                      value={formData.logoText}
                      onChange={(e) => setFormData({...formData, logoText: e.target.value})}
                      className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all font-serif text-2xl tracking-[0.15em]"
                    />
                    <p className="text-[10px] text-text-primary/30">This text appears in the navigation bar and mobile menu.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Primary Accent Color</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={formData.brandGoldColor}
                        onChange={(e) => setFormData({...formData, brandGoldColor: e.target.value})}
                        className="w-16 h-16 border-2 border-border-primary cursor-pointer bg-transparent p-1"
                      />
                      <div className="flex-grow">
                        <input
                          type="text"
                          value={formData.brandGoldColor}
                          onChange={(e) => setFormData({...formData, brandGoldColor: e.target.value})}
                          className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all font-mono"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-text-primary/30">Used for buttons, accents, and highlights across the site. Default: #E5A93A</p>
                  </div>

                  {/* Color Preview */}
                  <div className="p-6 border border-border-primary space-y-4">
                    <p className="text-[10px] uppercase tracking-widest text-text-primary/40">Preview</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded" style={{ backgroundColor: formData.brandGoldColor }} />
                      <div className="w-12 h-12 rounded" style={{ backgroundColor: formData.brandGoldColor, opacity: 0.5 }} />
                      <div className="w-12 h-12 rounded" style={{ backgroundColor: formData.brandGoldColor, opacity: 0.15 }} />
                      <button
                        className="px-6 py-3 text-xs uppercase tracking-widest font-bold text-black"
                        style={{ backgroundColor: formData.brandGoldColor }}
                      >
                        Button Sample
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
          {activeSection === 'footer' && (
            <div className="bg-bg-primary border border-border-primary p-8 space-y-8">
              <h3 className="text-xl font-serif flex items-center gap-3">
                <Layout size={20} className="text-brand-gold" /> Footer Customization
              </h3>
              <p className="text-xs text-text-primary/40">Leave empty to use the default translated text.</p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Footer Headline</label>
                  <input
                    type="text"
                    value={formData.footerTitle}
                    onChange={(e) => setFormData({...formData, footerTitle: e.target.value})}
                    placeholder="Élevez Votre Réalité"
                    className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Footer CTA Button Text</label>
                  <input
                    type="text"
                    value={formData.footerCta}
                    onChange={(e) => setFormData({...formData, footerCta: e.target.value})}
                    placeholder="Demander un Accès Privé"
                    className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* WHATSAPP */}
          {activeSection === 'whatsapp' && (
            <div className="bg-bg-primary border border-border-primary p-8 space-y-8">
              <h3 className="text-xl font-serif flex items-center gap-3">
                <MessageCircle size={20} className="text-[#25D366]" /> WhatsApp Configuration
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({...formData, whatsappNumber: e.target.value})}
                    placeholder="212600000000"
                    className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                  />
                  <p className="text-[10px] text-text-primary/30">International format without + sign (e.g., 212600000000). Used for the floating WhatsApp button.</p>
                </div>

                {/* WhatsApp Preview */}
                <div className="p-6 border border-border-primary flex items-center gap-6">
                  <div className="bg-[#25D366] text-white p-4 rounded-full shadow-xl">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Floating Button Preview</p>
                    <p className="text-[10px] text-text-primary/40 mt-1">Links to: wa.me/{formData.whatsappNumber || '...'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
