import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext, type Article, type Reservation } from "../context/AppContext";
import { useShopping } from "../context/ShoppingContext";
import { useAuth } from "../context/AuthContext";
import { translations } from "../i18n/translations";
import { formatMoney } from "../lib/utils";
import { User, Lock, Globe, Save, CheckCircle2, Camera, Heart, Calendar, Trash2, ArrowRight } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

function findArticleForReservation(articles: Article[], articleId?: string): Article | null {
  if (!articleId) return null;
  const id = String(articleId).trim();
  return articles.find((a) => String(a.id).trim() === id) ?? null;
}

function reservationDisplayHeading(res: Reservation, article: Article | null): string {
  const actT = String(res.activity_title ?? "").trim();
  const storedArticleTitle = res.article_title?.trim();
  if (storedArticleTitle) {
    return actT ? `${actT} - ${storedArticleTitle}` : storedArticleTitle;
  }
  if (article?.title) {
    const at = article.title.trim();
    return actT ? `${actT} - ${at}` : at;
  }
  return actT;
}

export function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { language, setLanguage, activities, articles, products, reservations, currency, exchangeRates } = useAppContext();
  const { favorites, toggleFavorite } = useShopping();
  const t = translations[language];
  
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'reservations'>('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const favoriteActivities = activities.filter(a => favorites.includes(a.id));
  const favoriteProducts = products.filter(p => favorites.includes(p.id));
  const allFavorites = [...favoriteActivities.map(a => ({ ...a, type: 'activity' as const })), ...favoriteProducts.map(p => ({ ...p, type: 'product' as const }))];

  useEffect(() => {
    if (!user) return;
    const displayName = String(user.user_metadata?.full_name ?? "").trim();
    setFormData((prev) => ({
      ...prev,
      email: user.email ?? prev.email,
      name: displayName || prev.name || (user.email?.split("@")[0] ?? ""),
    }));
  }, [user]);

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
  const initials = (formData.name || user?.email || "?")
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "U";

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-bg-primary pt-28">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-brand-gold/30 border-t-brand-gold"
          aria-hidden
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userEmailNorm = (user.email ?? "").trim().toLowerCase();
  const myReservations = reservations.filter(
    (r) => (r.email ?? "").trim().toLowerCase() === userEmailNorm
  );

  return (
    <div className="min-h-screen bg-bg-primary px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-10 flex flex-col gap-6 border-b border-border-primary pb-10 sm:mb-12 sm:gap-8 sm:pb-12 md:flex-row md:items-center">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 font-serif text-2xl text-brand-gold sm:h-24 sm:w-24 sm:text-3xl">
              {initials}
              <button
                type="button"
                className="absolute bottom-0 right-0 rounded-full border border-border-primary bg-bg-primary p-2 shadow-sm transition-colors hover:text-brand-gold touch-manipulation"
              >
                <Camera size={14} />
              </button>
            </div>
            <div className="min-w-0">
              <h1 className="mb-2 font-serif text-3xl text-text-primary sm:text-4xl">{t.profile.title}</h1>
              <p className="truncate text-sm uppercase tracking-widest text-text-primary/60">{formData.email || user.email}</p>
            </div>
          </div>

          {/* Tabs — défilable sur petit écran */}
          <div className="-mx-1 mb-12 flex snap-x snap-mandatory gap-6 overflow-x-auto border-b border-border-primary pb-px sm:mb-16 sm:gap-10 md:gap-12 [scrollbar-width:thin]">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`relative shrink-0 snap-start pb-4 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 sm:pb-6 ${
                activeTab === "profile" ? "text-brand-gold" : "text-text-primary/40 hover:text-text-primary"
              }`}
            >
              {t.user.profile}
              {activeTab === "profile" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("favorites")}
              className={`relative shrink-0 snap-start pb-4 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 sm:pb-6 ${
                activeTab === "favorites" ? "text-brand-gold" : "text-text-primary/40 hover:text-text-primary"
              }`}
            >
              {t.user.favorites} ({allFavorites.length})
              {activeTab === "favorites" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reservations")}
              className={`relative shrink-0 snap-start pb-4 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 sm:pb-6 ${
                activeTab === "reservations" ? "text-brand-gold" : "text-text-primary/40 hover:text-text-primary"
              }`}
            >
              {t.user.reservations} ({myReservations.length})
              {activeTab === "reservations" && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />
              )}
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
                        className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-base focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest text-text-primary/60">{t.profile.email}</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-base focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
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
                        className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-base focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
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
                          className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-base focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-text-primary/60">{t.profile.confirmPassword}</label>
                        <input 
                          type="password" 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-border-primary px-0 py-3 text-base focus:outline-none focus:border-brand-gold transition-colors text-text-primary rounded-none"
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
                        className="w-full md:w-1/2 bg-transparent border-b border-border-primary px-0 py-3 text-base focus:outline-none focus:border-brand-gold transition-colors text-text-primary appearance-none rounded-none"
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
                            <span className="text-sm font-serif">{item.type === 'product' ? formatMoney(item.price, currency, exchangeRates) : item.price}</span>
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
                {myReservations.length > 0 ? (
                  <div className="space-y-6">
                    {myReservations.map((res) => {
                      const article = findArticleForReservation(articles, res.article_id);
                      const activity = activities.find((a: any) => a.id === res.activity_id);
                      const image = article?.image || activity?.image;
                      const isArticleReservation = !!(
                        String(res.article_id ?? "").trim() ||
                        String(res.article_title ?? "").trim()
                      );
                      const headingTitle = reservationDisplayHeading(res, article);
                      const headingAlt = article?.title?.trim() || res.article_title?.trim() || activity?.title;

                      return (
                      <div key={res.id} className="flex flex-col p-6 border border-border-primary bg-bg-primary gap-6 rounded-lg hover:border-brand-gold/50 transition-all duration-500">
                        {/* Produit Widget */}
                        <div className="flex gap-4">
                          {image && (
                            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-border-primary/30">
                              <img
                                src={image}
                                alt={headingAlt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-grow">
                            <div>
                              <p className="text-[9px] uppercase tracking-widest text-text-primary/40 mb-1">
                                {isArticleReservation ? "📦 Article Réservé" : "🎭 Expérience"}
                              </p>
                              <h3 className="text-xl font-serif mb-2">
                                {headingTitle}
                              </h3>
                            </div>
                            <p className="text-xs tracking-[0.1em] uppercase text-text-primary/40">
                              {res.date} • {res.time}
                            </p>
                          </div>
                        </div>

                        {/* Statut et Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-border-primary/20">
                          <div className="flex items-center gap-4">
                            <span className={`inline-block px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium rounded-full ${
                              res.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 
                              res.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                              'bg-brand-gold/10 text-brand-gold'
                            }`}>
                              {res.status}
                            </span>
                            <p className="text-[10px] text-text-primary/30 uppercase tracking-widest">via {res.channel}</p>
                          </div>
                          <Link 
                            to={`/universe/${res.universe_id}`}
                            className="p-3 border border-border-primary hover:border-brand-gold hover:text-brand-gold transition-all duration-500"
                          >
                            <ArrowRight size={18} />
                          </Link>
                        </div>
                      </div>
                    );
                    })}
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

