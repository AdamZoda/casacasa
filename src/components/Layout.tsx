import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Footer } from "./Footer";
import { SearchOverlay } from "./SearchOverlay";
import { useEffect, useState } from "react";
import { Moon, Sun, User, ShoppingBag, LogIn, LogOut, Menu, X, Heart, Settings, Shield, Search } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { primaryWhatsappDigits } from "../lib/siteSettingsDb";
import { useAuth } from "../context/AuthContext";
import { translations } from "../i18n/translations";
import { isPathHidden, LAYOUT_NAV_LINKS } from "../lib/hiddenPages";
import { useIsPhoneViewport } from "../hooks/useIsPhoneViewport";

export function Layout() {
  const location = useLocation();
  const { cart, theme, toggleTheme, language, setLanguage, settings } = useAppContext();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const t = translations[language];
  const hp = settings.hiddenPages ?? [];
  const isPhone = useIsPhoneViewport();

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
  
  const headerClasses = scrolled 
    ? "bg-bg-primary/95 backdrop-blur-xl text-text-primary shadow-[0_1px_3px_rgba(0,0,0,0.05)] py-4" 
    : `bg-transparent py-6 ${isDarkHeroPage ? 'text-white' : 'text-text-primary'}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-700 ease-in-out ${headerClasses}`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center gap-2 min-h-[3.25rem] sm:min-h-0">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="lg:hidden inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-current transition-colors hover:text-brand-gold active:bg-white/10 touch-manipulation"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} strokeWidth={1} />
            </button>
            <Link to="/" className="flex min-w-0 items-center touch-manipulation">
              <span className="truncate text-[1.2rem] font-serif tracking-tighter transition-colors duration-500 hover:text-brand-gold sm:text-2xl md:text-3xl">
                {settings.logoText || "CASA PRIVILEGE"}
              </span>
              <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 bg-green-500/5 rounded-full border border-green-500/20">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[8px] uppercase tracking-widest font-black text-green-500/80">Concierge Online</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-medium">
            {LAYOUT_NAV_LINKS.filter((item) => !isPathHidden(item.path, hp)).map((item) => (
              <Link key={item.to} to={item.to} className="hover:text-brand-gold transition-colors">
                {t.nav[item.labelKey]}
              </Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-8">
            <div className="hidden sm:flex items-center gap-3 text-[11px] font-medium tracking-widest">
              <button 
                onClick={() => setLanguage('fr')} 
                className={`transition-colors ${language === 'fr' ? 'text-brand-gold' : 'hover:text-brand-gold opacity-60 hover:opacity-100'}`}
              >
                FR
              </button>
              <span className="opacity-20">|</span>
              <button 
                onClick={() => setLanguage('en')} 
                className={`transition-colors ${language === 'en' ? 'text-brand-gold' : 'hover:text-brand-gold opacity-60 hover:opacity-100'}`}
              >
                EN
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-3 md:gap-5">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 touch-manipulation sm:h-10 sm:w-10"
                aria-label={t.common.search}
              >
                <Search size={18} strokeWidth={1} />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="hidden sm:inline-flex sm:h-10 sm:w-10 sm:items-center sm:justify-center sm:rounded-lg sm:transition-colors sm:hover:text-brand-gold"
              >
                {theme === "light" ? <Moon size={18} strokeWidth={1} /> : <Sun size={18} strokeWidth={1} />}
              </button>

              {/* Compte : menu déroulant à partir de md (évite profil/admin sur téléphone dans le header) */}
              <div className="relative group hidden md:block">
                {user ? (
                  <>
                    <button className="hover:text-brand-gold transition-colors flex items-center gap-2 py-2">
                      <div className="w-7 h-7 rounded-full bg-brand-gold/15 flex items-center justify-center text-brand-gold text-[10px] font-bold uppercase">
                        {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                      </div>
                    </button>
                    <div className="absolute right-0 mt-0 w-56 py-3 bg-bg-primary border border-border-primary shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="px-6 py-2 mb-2 border-b border-border-primary">
                        <p className="text-xs font-medium text-text-primary truncate">{user.user_metadata?.full_name || user.email}</p>
                        <p className="text-[10px] text-text-primary/40 truncate mt-0.5">{user.email}</p>
                      </div>
                      <Link to="/profile" className="block px-6 py-2.5 text-xs tracking-widest uppercase text-text-primary hover:text-brand-gold hover:bg-brand-gold/5 transition-colors">{t.user.profile}</Link>
                      <Link to="/profile" className="block px-6 py-2.5 text-xs tracking-widest uppercase text-text-primary hover:text-brand-gold hover:bg-brand-gold/5 transition-colors">{t.user.favorites}</Link>
                      <Link to="/profile" className="block px-6 py-2.5 text-xs tracking-widest uppercase text-text-primary hover:text-brand-gold hover:bg-brand-gold/5 transition-colors">{t.user.settings}</Link>
                      <div className="border-t border-border-primary my-2"></div>
                      <Link to="/admin" className="block px-6 py-2.5 text-xs tracking-widest uppercase text-text-primary hover:text-brand-gold hover:bg-brand-gold/5 transition-colors">{t.user.admin}</Link>
                      <div className="border-t border-border-primary my-2"></div>
                      <button onClick={async () => { await signOut(); navigate('/'); }} className="block w-full text-left px-6 py-2.5 text-xs tracking-widest uppercase text-red-400 hover:text-red-500 hover:bg-red-500/5 transition-colors">
                        <span className="flex items-center gap-2"><LogOut size={14} /> {language === 'fr' ? 'Déconnexion' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="flex items-center gap-2 py-2 transition-colors hover:text-brand-gold"
                  >
                    <LogIn size={18} strokeWidth={1} />
                  </Link>
                )}
              </div>

              {!user && (
                <Link
                  to="/auth"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 touch-manipulation md:hidden"
                  aria-label={language === "fr" ? "Se connecter" : "Sign in"}
                >
                  <LogIn size={18} strokeWidth={1} />
                </Link>
              )}

              {!isPathHidden("/cart", hp) && (
                <Link
                  to="/cart"
                  className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-white/10 touch-manipulation sm:h-10 sm:w-10"
                  aria-label={t.common.cart}
                >
                  <ShoppingBag size={18} strokeWidth={1} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto overscroll-contain bg-bg-primary"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border-primary px-4 py-4 sm:px-6 sm:py-6">
              <Link
                to="/"
                className="min-w-0 truncate font-serif text-lg tracking-[0.12em] text-brand-gold sm:text-2xl touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {settings.logoText || "CASA PRIVILEGE"}
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors hover:text-brand-gold active:bg-text-primary/5 touch-manipulation"
                aria-label="Fermer le menu"
              >
                <X size={22} strokeWidth={1} />
              </button>
            </div>

            <nav className="flex flex-grow flex-col justify-start gap-1 px-4 py-8 sm:px-6 sm:py-10">
              {LAYOUT_NAV_LINKS.filter((item) => !isPathHidden(item.path, hp)).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="min-h-[3.25rem] rounded-lg px-3 py-3 font-serif text-xl leading-snug tracking-tight transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold active:bg-text-primary/10 sm:text-2xl md:text-3xl touch-manipulation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav[item.labelKey]}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 flex-col gap-6 border-t border-border-primary bg-brand-gold/5 p-4 sm:gap-8 sm:p-8">
              <div className="flex min-h-11 items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.2em] text-text-primary/60">Language</span>
                <div className="flex items-center gap-4 text-xs font-medium tracking-widest">
                  <button
                    type="button"
                    onClick={() => setLanguage("fr")}
                    className={`min-h-11 min-w-11 touch-manipulation rounded-lg px-3 transition-colors ${language === "fr" ? "text-brand-gold" : "hover:text-brand-gold"}`}
                  >
                    FR
                  </button>
                  <span className="opacity-30">|</span>
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`min-h-11 min-w-11 touch-manipulation rounded-lg px-3 transition-colors ${language === "en" ? "text-brand-gold" : "hover:text-brand-gold"}`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <div className="flex min-h-11 items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.2em] text-text-primary/60">Theme</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-xs uppercase tracking-widest transition-colors hover:text-brand-gold touch-manipulation"
                >
                  {theme === "light" ? (
                    <>
                      <Moon size={16} strokeWidth={1} /> Dark
                    </>
                  ) : (
                    <>
                      <Sun size={16} strokeWidth={1} /> Light
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-4 border-t border-border-primary pt-6">
                <span className="text-xs uppercase tracking-[0.2em] text-text-primary/60">{t.user.account}</span>
                {user ? (
                  <div className="flex flex-col gap-2">
                    {isPhone ? (
                      <>
                        <p className="truncate px-1 text-xs text-text-primary/50" title={user.email ?? undefined}>
                          {user.email}
                        </p>
                        <p className="px-1 text-[10px] uppercase tracking-widest text-text-primary/35">
                          {language === "fr"
                            ? "Profil et admin : depuis un ordinateur ou une grande tablette."
                            : "Profile and admin: use a computer or large tablet."}
                        </p>
                      </>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 sm:gap-6">
                        <Link
                          to="/profile"
                          className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User size={16} strokeWidth={1} /> {t.user.profile}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart size={16} strokeWidth={1} /> {t.user.favorites}
                        </Link>
                        <Link
                          to="/profile"
                          className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings size={16} strokeWidth={1} /> {t.user.settings}
                        </Link>
                        <Link
                          to="/admin"
                          className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-xs uppercase tracking-widest transition-colors hover:bg-text-primary/[0.06] hover:text-brand-gold touch-manipulation"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Shield size={16} strokeWidth={1} /> {t.user.admin}
                        </Link>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        await signOut();
                        setIsMobileMenuOpen(false);
                        navigate("/");
                      }}
                      className="mt-2 flex min-h-12 items-center gap-3 rounded-lg px-2 text-xs uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-500 touch-manipulation"
                    >
                      <LogOut size={16} strokeWidth={1} /> {language === "fr" ? "Déconnexion" : "Sign Out"}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth"
                    className="flex min-h-12 items-center gap-3 rounded-lg px-2 text-sm uppercase tracking-widest transition-colors hover:text-brand-gold touch-manipulation"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn size={16} strokeWidth={1} /> {language === "fr" ? "Se connecter" : "Sign In"}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Page Transitions */}
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex-grow flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${primaryWhatsappDigits(settings) || "1234567890"}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8 sm:h-[4.25rem] sm:w-[4.25rem] touch-manipulation"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>
    </div>
  );
}
