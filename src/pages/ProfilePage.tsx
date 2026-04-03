import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";
import { User, Lock, Globe, Save, CheckCircle2, Camera, Heart, Calendar, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ProfilePage() {
  const { language, setLanguage, favorites, toggleFavorite, activities, products, reservations } = useAppContext();
  const t = translations[language];
  
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'reservations'>('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const favoriteActivities = activities.filter(a => favorites.includes(a.id));
  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const allFavorites = [...favoriteActivities.map(a => ({ ...a, type: 'activity' as const })), ...favoriteProducts.map(p => ({ ...p, type: 'product' as const }))];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Get initials for avatar
  const initials = formData.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-bg-primary">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12 pb-12 border-b border-border-primary">
            <div className="relative w-24 h-24 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold text-3xl font-serif shrink-0">
              {initials}
              <button type="button" className="absolute bottom-0 right-0 bg-bg-primary border border-border-primary rounded-full p-2 hover:text-brand-gold transition-colors shadow-sm">
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h1 className="text-4xl font-serif text-text-primary mb-2">{t.profile.title}</h1>
              <p className="text-text-primary/60 text-sm uppercase tracking-widest">{formData.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-12 mb-16 border-b border-border-primary">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`pb-6 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 relative ${activeTab === 'profile' ? 'text-brand-gold' : 'text-text-primary/40 hover:text-text-primary'}`}
            >
              {t.user.profile}
              {activeTab === 'profile' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />}
            </button>
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`pb-6 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 relative ${activeTab === 'favorites' ? 'text-brand-gold' : 'text-text-primary/40 hover:text-text-primary'}`}
            >
              {t.user.favorites} ({allFavorites.length})
              {activeTab === 'favorites' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />}
            </button>
            <button 
              onClick={() => setActiveTab('reservations')}
              className={`pb-6 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 relative ${activeTab === 'reservations' ? 'text-brand-gold' : 'text-text-primary/40 hover:text-text-primary'}`}
            >
              {t.user.reservations} ({reservations.length})
              {activeTab === 'reservations' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.form 
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit} 
                className="space-y-16"
              >
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                      <User className="text-brand-gold" size={20} strokeWidth={1.5} />
                      <h2 className="text-xl font-serif text-text-primary">{t.profile.personalInfo}</h2>
                    </div>
                    <p className="text-sm text-text-primary/60 leading-relaxed">
                      {language === 'fr' 
                        ? "Gérez vos informations personnelles et vos coordonnées de contact." 
                        : "Manage your personal information and contact details."}
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-8">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-text-primary/60">{t.profile.name}</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-text-primary/60">{t.profile.email}</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-border-primary" />

                {/* Security & Password */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="text-brand-gold" size={20} strokeWidth={1.5} />
                      <h2 className="text-xl font-serif text-text-primary">{t.profile.security}</h2>
                    </div>
                    <p className="text-sm text-text-primary/60 leading-relaxed">
                      {language === 'fr' 
                        ? "Assurez la sécurité de votre compte en mettant à jour votre mot de passe régulièrement." 
                        : "Ensure your account security by updating your password regularly."}
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-8">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-text-primary/60">{t.profile.currentPassword}</label>
                      <input 
                        type="password" 
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-text-primary/60">{t.profile.newPassword}</label>
                        <input 
                          type="password" 
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-text-primary/60">{t.profile.confirmPassword}</label>
                        <input 
                          type="password" 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-border-primary" />

                {/* Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Globe className="text-brand-gold" size={20} strokeWidth={1.5} />
                      <h2 className="text-xl font-serif text-text-primary">{t.profile.preferences}</h2>
                    </div>
                    <p className="text-sm text-text-primary/60 leading-relaxed">
                      {language === 'fr' 
                        ? "Personnalisez votre expérience sur la plateforme." 
                        : "Customize your experience on the platform."}
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-8">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-text-primary/60">{t.profile.language}</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'fr' | 'en')}
                        className="w-full md:w-1/2 bg-transparent border-b border-border-primary px-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary appearance-none rounded-none"
                      >
                        <option value="fr" className="bg-bg-primary text-text-primary">Français</option>
                        <option value="en" className="bg-bg-primary text-text-primary">English</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-6 pt-8 border-t border-border-primary mt-16">
                  <AnimatePresence>
                    {isSaved && (
                      <motion.div 
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-2 text-[#25D366]"
                      >
                        <CheckCircle2 size={20} />
                        <span className="text-sm font-medium">{t.profile.success}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <button 
                    type="submit"
                    className="bg-brand-gold text-brand-black px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-white transition-colors flex items-center gap-3"
                  >
                    <Save size={16} />
                    {t.profile.save}
                  </button>
                </div>
              </motion.form>
            )}

            {activeTab === 'favorites' && (
              <motion.div 
                key="favorites"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {allFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {allFavorites.map((item) => (
                      <div key={item.id} className="group relative flex items-center gap-6 p-6 border border-border-primary bg-bg-primary hover:border-brand-gold/50 transition-all duration-500">
                        <div className="w-24 h-24 overflow-hidden shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="flex-grow">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-brand-gold mb-2 block">{item.category}</span>
                          <h3 className="text-xl font-serif mb-4">{item.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-serif">{item.price} {item.type === 'product' ? 'MAD' : ''}</span>
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => toggleFavorite(item.id)}
                                className="text-text-primary/40 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                              <Link 
                                to={item.type === 'activity' ? `/universe/${(item as any).universeId}` : `/store`}
                                className="text-text-primary/40 hover:text-brand-gold transition-colors"
                              >
                                <ArrowRight size={16} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 border border-dashed border-border-primary">
                    <Heart size={48} strokeWidth={1} className="text-text-primary/10 mx-auto mb-6" />
                    <p className="text-text-primary/40 font-light italic">{t.common.emptyFavorites}</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reservations' && (
              <motion.div 
                key="reservations"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {reservations.length > 0 ? (
                  <div className="space-y-6">
                    {reservations.map((res) => (
                      <div key={res.id} className="flex flex-col md:flex-row md:items-center justify-between p-8 border border-border-primary bg-bg-primary gap-8">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-brand-gold/5 flex items-center justify-center text-brand-gold shrink-0">
                            <Calendar size={24} strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif mb-1">{res.activityTitle}</h3>
                            <p className="text-xs tracking-[0.1em] uppercase text-text-primary/40">
                              {res.date} • {res.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-12">
                          <div className="text-right">
                            <span className={`inline-block px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium rounded-full ${
                              res.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 
                              res.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                              'bg-brand-gold/10 text-brand-gold'
                            }`}>
                              {res.status}
                            </span>
                            <p className="text-[10px] text-text-primary/30 mt-2 uppercase tracking-widest">via {res.channel}</p>
                          </div>
                          <Link 
                            to={`/universe/${res.universeId}`}
                            className="p-3 border border-border-primary hover:border-brand-gold hover:text-brand-gold transition-all duration-500"
                          >
                            <ArrowRight size={18} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-24 border border-dashed border-border-primary">
                    <Calendar size={48} strokeWidth={1} className="text-text-primary/10 mx-auto mb-6" />
                    <p className="text-text-primary/40 font-light italic">
                      {language === 'fr' ? "Vous n'avez pas encore de réservations." : "You have no reservations yet."}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

