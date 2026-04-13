import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Footer } from "./Footer";
import { SearchOverlay } from "./SearchOverlay";
import { useEffect, useState } from "react";
import { Moon, Sun, User, ShoppingBag, LogIn, LogOut, Menu, X, Heart, Settings, Shield, Search, Globe } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useShopping } from "../context/ShoppingContext";
import { primaryWhatsappDigits } from "../lib/siteSettingsDb";
import { useAuth } from "../context/AuthContext";
import { useAdminAccess } from "../hooks/useAdminAccess";
import { translations } from "../i18n/translations";
import { isPathHidden, LAYOUT_NAV_LINKS } from "../lib/hiddenPages";

export function Layout() {
  const location = useLocation();
  const { cart } = useShopping();
  const { theme, toggleTheme, language, setLanguage, currency, setCurrency, settings } = useAppContext();
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin } = useAdminAccess();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const t = translations[language];
  const hp = settings.hiddenPages ?? [];
  
  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ] as const;

  // Update document title on route change
  useEffect(() => {
    const pageTitles: Record<string, string> = {
      '/': 'Excellence Sur Mesure | Casa Privilege',
      '/services': 'Services de Luxe | Casa Privilege',
      '/store': 'La Boutique Exclusive | Casa Privilege',
      '/journal': 'Le Journal du Luxe | Casa Privilege',
      '/contact': 'Salon de Conciergerie | Casa Privilege',
      '/cart': 'Votre Panier | Boutique Casa Privilege',
      '/profile': 'Espace Membre | Casa Privilege',
      '/auth': 'Accès Privé | Casa Privilege',
      '/admin': 'Panneau de Commande | Casa Privilege Admin'
    };
    
    let title = pageTitles[location.pathname] || 'Casa Privilege | Excellence Sur Mesure';
    
    if (location.pathname.startsWith('/universe/')) title = 'Découvrir l\'Univers | Casa Privilege';
    if (location.pathname.startsWith('/journal/')) title = 'Récit Exclusif | Casa Privilege';
    if (location.pathname.startsWith('/admin')) title = 'Dashboard Admin | Casa Privilege';

    document.title = title;
  }, [location.pathname]);

  // Scroll to top and close mobile menu on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // If we are at the top, we want the text to be white if there's a hero image behind it.
  // We'll assume the home page and universe pages have dark hero images at the top.
  const isDarkHeroPage = location.pathname === '/' || location.pathname.startsWith('/universe/');
  
  // Desktop navbar uses scroll effect, mobile remains transparent
  const headerClasses = scrolled 
    ? "hidden md:block bg-bg-primary/95 backdrop-blur-xl text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.05)] py-4" 
    : `md:block hidden bg-transparent py-6 ${isDarkHeroPage ? 'text-white' : 'text-text-primary'}`;
  
  // Mobile navbar always transparent
  const mobileHeaderClasses = `md:hidden bg-transparent py-3 sm:py-4 ${isDarkHeroPage ? 'text-white' : 'text-text-primary'}`;

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col">
      {/* Mobile Top Bar — pt safe-area pour encoche / Dynamic Island */}
      <div
        className={`md:hidden fixed left-0 right-0 top-0 z-40 px-3 pt-[env(safe-area-inset-top,0px)] sm:px-6 transition-all duration-300 ease-in-out ${mobileHeaderClasses}`}
      >
        <div className="mx-auto flex h-[3.75rem] max-w-[1400px] items-center justify-between gap-2 sm:h-[3.5rem]">
          <button
            type="button"
            className="inline-flex h-12 w-12 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg text-current transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={22} strokeWidth={1} /> : <Menu size={22} strokeWidth={1} />}
          </button>
          <Link to="/" className="flex min-w-0 flex-1 items-center touch-manipulation">
            <span className="truncate text-[1.2rem] font-serif tracking-tighter transition-colors duration-500 hover:text-brand-gold sm:text-2xl">
              {settings.logoText || "CASA PRIVILEGE"}
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-[10px] font-semibold tracking-widest transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
              aria-label={language === "fr" ? "Switch to English" : "Passer en français"}
            >
              {language === "fr" ? "FR" : "EN"}
            </button>
            <button
              type="button"
              onClick={() => setCurrency(currency === 'MAD' ? 'USD' : currency === 'USD' ? 'EUR' : 'MAD')}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2 text-[10px] font-semibold tracking-widest transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
              aria-label="Changer la devise"
            >
              {currency}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
              aria-label={theme === "light" ? (language === "fr" ? "Mode sombre" : "Dark mode") : language === "fr" ? "Mode clair" : "Light mode"}
            >
              {theme === "light" ? <Moon size={17} strokeWidth={1.25} /> : <Sun size={17} strokeWidth={1.25} />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className={`hidden md:block fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 transition-all duration-700 ease-in-out ${headerClasses}`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center gap-1 sm:gap-2 md:gap-4 min-h-[3.75rem] sm:min-h-[3.5rem] md:min-h-[4rem]">
          <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-3 md:gap-4">
            <button
              type="button"
              className="lg:hidden inline-flex h-12 w-12 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg text-current transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1} />
            </button>
            <Link to="/" className="flex min-w-0 items-center touch-manipulation">
              <span className="truncate text-[1.2rem] font-serif tracking-tighter transition-colors duration-500 hover:text-brand-gold sm:text-2xl md:text-3xl">
                {settings.logoText || "CASA PRIVILEGE"}
              </span>
              
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-medium">
            {LAYOUT_NAV_LINKS.filter((item) => !isPathHidden(item.path, hp)).map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-brand-gold transition-colors">
                {t.nav[item.labelKey]}
              </Link>
            ))}
          </div>

          <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-3 md:gap-6">
            <div className="hidden sm:flex items-center gap-2 sm:gap-3 text-[10px] font-medium tracking-widest sm:text-[11px]">
              <button
                type="button"
                onClick={() => setLanguage("fr")}
                className={`min-h-10 min-w-10 sm:min-h-9 sm:min-w-9 touch-manipulation rounded-md px-2 sm:px-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${language === "fr" ? "text-brand-gold" : "opacity-70 hover:text-brand-gold hover:opacity-100"}`}
                aria-pressed={language === "fr"}
                aria-label={language === "fr" ? "Français" : "Switch to French"}
              >
                FR
              </button>
              <span className="opacity-25 sm:opacity-20" aria-hidden>
                |
              </span>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`min-h-10 min-w-10 sm:min-h-9 sm:min-w-9 touch-manipulation rounded-md px-2 sm:px-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold ${language === "en" ? "text-brand-gold" : "opacity-70 hover:text-brand-gold hover:opacity-100"}`}
                aria-pressed={language === "en"}
                aria-label={language === "en" ? "English" : "Switch to English"}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCurrency(currency === 'MAD' ? 'USD' : currency === 'USD' ? 'EUR' : 'MAD')}
              className="hidden sm:inline-flex min-h-10 min-w-10 items-center justify-center rounded-md px-3 text-[10px] font-semibold tracking-widest transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation text-brand-gold"
              aria-label="Changer la devise"
            >
              {currency}
            </button>

            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex h-12 w-12 sm:h-11 sm:w-11 md:h-10 md:w-10 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
                aria-label={t.common.search}
              >
                <Search size={18} strokeWidth={1} />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-12 w-12 sm:h-11 sm:w-11 md:h-10 md:w-10 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
                aria-label={theme === "light" ? (language === "fr" ? "Mode sombre" : "Dark mode") : language === "fr" ? "Mode clair" : "Light mode"}
              >
                {theme === "light" ? <Moon size={18} strokeWidth={1} /> : <Sun size={18} strokeWidth={1} />}
              </button>

              {/* Grand écran : menu compte au survol */}
              <div className="relative group hidden lg:block">
                {user ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-2 py-2 transition-colors hover:text-brand-gold"
                      aria-expanded={false}
                      aria-haspopup="true"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/15 text-[10px] font-bold uppercase text-brand-gold">
                        {user.user_metadata?.full_name?.[0] || user.email?.[0] || "U"}
                      </div>
                    </button>
                    <div className="invisible absolute right-0 z-50 mt-0 w-56 origin-top-right translate-y-2 border border-border-primary bg-bg-primary py-3 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="mb-2 border-b border-border-primary px-6 py-2">
                        <p className="truncate text-xs font-medium text-text-primary">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-text-primary/40">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-6 py-2.5 text-xs uppercase tracking-widest text-text-primary transition-colors hover:bg-brand-gold/5 hover:text-brand-gold"
                      >
                        {t.user.profile}
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-6 py-2.5 text-xs uppercase tracking-widest text-text-primary transition-colors hover:bg-brand-gold/5 hover:text-brand-gold"
                      >
                        {t.user.favorites}
                      </Link>
                      <Link
                        to="/profile"
                        className="block px-6 py-2.5 text-xs uppercase tracking-widest text-text-primary transition-colors hover:bg-brand-gold/5 hover:text-brand-gold"
                      >
                        {t.user.settings}
                      </Link>
                      <div className="my-2 border-t border-border-primary" />
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-6 py-2.5 text-xs uppercase tracking-widest text-text-primary transition-colors hover:bg-brand-gold/5 hover:text-brand-gold"
                        >
                          {t.user.admin}
                        </Link>
                      )}
                      <div className="my-2 border-t border-border-primary" />
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut();
                          navigate("/");
                        }}
                        className="block w-full px-6 py-2.5 text-left text-xs uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/5 hover:text-red-500"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut size={14} /> {language === "fr" ? "Déconnexion" : "Sign Out"}
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Link to="/auth" className="flex items-center gap-2 py-2 transition-colors hover:text-brand-gold">
                    <LogIn size={18} strokeWidth={1} />
                  </Link>
                )}
              </div>

              {/* Tablette / téléphone : accès direct profil ou connexion */}
              <div className="lg:hidden">
                {user ? (
                  <Link
                    to="/profile"
                    className="inline-flex h-12 w-12 sm:h-11 sm:w-11 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
                    aria-label={t.user.profile}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/15 text-[10px] font-bold uppercase text-brand-gold">
                      {user.user_metadata?.full_name?.[0] || user.email?.[0] || "U"}
                    </div>
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="inline-flex h-12 w-12 sm:h-11 sm:w-11 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
                    aria-label={language === "fr" ? "Se connecter" : "Sign in"}
                  >
                    <LogIn size={18} strokeWidth={1} />
                  </Link>
                )}
              </div>

              {!isPathHidden("/cart", hp) && (
                <Link
                  to="/cart"
                  className="relative inline-flex h-12 w-12 sm:h-11 sm:w-11 md:h-10 md:w-10 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
                  aria-label={t.common.cart}
                >
                  <ShoppingBag size={18} strokeWidth={1} />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-brand-gold text-brand-black text-[8px] sm:text-[9px] font-bold min-w-5 h-5 sm:h-4 sm:w-4 rounded-full flex items-center justify-center">
                      {cart.length > 9 ? "9+" : cart.length}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Left Sidebar Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-y-0 left-0 z-30 w-[88vw] max-w-80 overflow-y-auto overscroll-contain border-r border-border-primary bg-bg-primary pt-[calc(3.75rem+env(safe-area-inset-top,0px))] shadow-xl sm:pt-[calc(3.5rem+env(safe-area-inset-top,0px))]"
          >
            <nav className="flex flex-col h-full">
              {/* Navigation Links */}
              <div className="flex-grow px-3 py-5 sm:px-6">
                <div className="space-y-1 mb-8">
                  {LAYOUT_NAV_LINKS.filter((item) => !isPathHidden(item.path, hp)).map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 rounded-lg px-4 py-3.5 font-serif text-[1.05rem] tracking-tight transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold active:bg-text-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t.nav[item.labelKey]}
                    </Link>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-6 border-t border-border-primary" />

                {/* Search */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
                >
                  <Search size={16} strokeWidth={1} />
                  <span>{t.common.search}</span>
                </button>

                {/* Language Selector */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation"
                  >
                    <div className="flex items-center gap-2">
                      <Globe size={16} strokeWidth={1} />
                      <span>{language === "fr" ? "Français" : "English"}</span>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isLanguageOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="ml-4 mt-1 space-y-1"
                      >
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => {
                              setLanguage(lang.code);
                              setIsLanguageOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 rounded-lg px-4 py-2 text-xs transition-colors ${
                              language === lang.code
                                ? "bg-brand-gold/10 text-brand-gold font-medium"
                                : "text-text-primary hover:bg-text-primary/5"
                            }`}
                          >
                            <span className="text-base">{lang.flag}</span>
                            <span>{lang.label}</span>
                            {language === lang.code && <span className="ml-auto text-brand-gold">✓</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Theme Toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation mt-2"
                >
                  {theme === "light" ? <Moon size={16} strokeWidth={1} /> : <Sun size={16} strokeWidth={1} />}
                  <span>{theme === "light" ? (language === "fr" ? "Mode sombre" : "Dark mode") : language === "fr" ? "Mode clair" : "Light mode"}</span>
                </button>

                {/* Cart Link */}
                {!isPathHidden("/cart", hp) && (
                  <Link
                    to="/cart"
                    className="flex relative items-center gap-3 rounded-lg px-4 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold touch-manipulation mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingBag size={16} strokeWidth={1} />
                    <span>{t.common.cart}</span>
                    {cart.length > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center bg-brand-gold text-brand-black text-[8px] font-bold min-w-5 h-5 rounded-full">
                        {cart.length > 9 ? "9+" : cart.length}
                      </span>
                    )}
                  </Link>
                )}
              </div>

              {/* Account Section - Bottom */}
              <div className="border-t border-border-primary bg-brand-gold/5 p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-text-primary/60 block">{t.user.account}</span>
                  {user ? (
                    <div className="space-y-2">
                      <p className="truncate px-1 text-xs text-text-primary/50 font-medium" title={user.email ?? undefined}>
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User size={14} strokeWidth={1} /> {t.user.profile}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart size={14} strokeWidth={1} /> {t.user.favorites}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings size={14} strokeWidth={1} /> {t.user.settings}
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Shield size={14} strokeWidth={1} /> {t.user.admin}
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            await signOut();
                            setIsMobileMenuOpen(false);
                            navigate("/");
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500 touch-manipulation mt-2"
                        >
                          <LogOut size={14} strokeWidth={1} /> {language === "fr" ? "Déconnexion" : "Sign Out"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/auth"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LogIn size={14} strokeWidth={1} /> {language === "fr" ? "Se connecter" : "Sign In"}
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User size={14} strokeWidth={1} /> {t.user.profile}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-20 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Contenu : pas d’AnimatePresence ici — évite l’effet « 2 fois » (sortie puis entrée à chaque route) */}
      <main className="flex flex-grow flex-col pt-[calc(3.75rem+env(safe-area-inset-top,0px))] sm:pt-[calc(3.5rem+env(safe-area-inset-top,0px))] md:pt-0">
        <div className="flex flex-grow flex-col">
          <Outlet />
        </div>
      </main>

      <Footer />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${primaryWhatsappDigits(settings) || "1234567890"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))] z-50 flex h-14 w-14 touch-manipulation items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 sm:bottom-[max(2rem,env(safe-area-inset-bottom,0px))] sm:right-[max(2rem,env(safe-area-inset-right,0px))] sm:h-[4.25rem] sm:w-[4.25rem]"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>
    </div>
  );
}
