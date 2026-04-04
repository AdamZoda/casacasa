import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Footer } from "./Footer";
import { SearchOverlay } from "./SearchOverlay";
import { useEffect, useState } from "react";
import { Moon, Sun, User, ShoppingBag, LogIn, LogOut, Menu, X, Heart, Settings, Shield, Search } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { translations } from "../i18n/translations";

export function Layout() {
  const location = useLocation();
  const { cart, theme, toggleTheme, language, setLanguage, settings } = useAppContext();
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const t = translations[language];

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
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-700 ease-in-out ${headerClasses}`}>
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden hover:text-brand-gold transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1} />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-serif tracking-tighter hover:text-brand-gold transition-colors duration-500">
                {settings.logoText || "CASA PRIVILEGE"}
              </span>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-medium">
            <Link to="/" className="hover:text-brand-gold transition-colors">{t.nav.home}</Link>
            <Link to="/brands" className="hover:text-brand-gold transition-colors">{t.nav.universes}</Link>
            <Link to="/store" className="hover:text-brand-gold transition-colors">{t.nav.collection}</Link>
            <Link to="/services" className="hover:text-brand-gold transition-colors">{t.nav.services}</Link>
            <Link to="/journal" className="hover:text-brand-gold transition-colors">{t.nav.journal}</Link>
            <Link to="/contact" className="hover:text-brand-gold transition-colors">{t.nav.contact}</Link>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
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

            <div className="flex items-center gap-5">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-brand-gold transition-colors"
              >
                <Search size={18} strokeWidth={1} />
              </button>

              <button onClick={toggleTheme} className="hidden sm:block hover:text-brand-gold transition-colors">
                {theme === 'light' ? <Moon size={18} strokeWidth={1} /> : <Sun size={18} strokeWidth={1} />}
              </button>
              
              {/* User Dropdown (Desktop) */}
              <div className="relative group hidden sm:block">
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
                  <Link to="/auth" className="hover:text-brand-gold transition-colors flex items-center gap-2 py-2">
                    <LogIn size={18} strokeWidth={1} />
                  </Link>
                )}
              </div>

              <Link to="/cart" className="relative hover:text-brand-gold transition-colors">
                <ShoppingBag size={18} strokeWidth={1} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-gold text-brand-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
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
            className="fixed inset-0 z-[60] bg-bg-primary flex flex-col overflow-y-auto"
          >
            <div className="px-6 py-6 flex justify-between items-center border-b border-border-primary shrink-0">
              <Link to="/" className="font-serif text-2xl tracking-[0.15em] text-brand-gold" onClick={() => setIsMobileMenuOpen(false)}>
                {settings.logoText || 'CASA PRIVILEGE'}
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:text-brand-gold transition-colors"
              >
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-grow flex flex-col justify-center px-8 py-12 gap-10 text-3xl font-serif">
              <Link to="/" className="hover:text-brand-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.home}</Link>
              <Link to="/brands" className="hover:text-brand-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.universes}</Link>
              <Link to="/store" className="hover:text-brand-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.collection}</Link>
              <Link to="/services" className="hover:text-brand-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.services}</Link>
              <Link to="/journal" className="hover:text-brand-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.journal}</Link>
              <Link to="/contact" className="hover:text-brand-gold transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.contact}</Link>
            </div>

            <div className="p-8 border-t border-border-primary flex flex-col gap-8 shrink-0 bg-brand-gold/5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-text-primary/60">Language</span>
                <div className="flex items-center gap-4 text-xs font-medium tracking-widest">
                  <button 
                    onClick={() => setLanguage('fr')} 
                    className={`transition-colors ${language === 'fr' ? 'text-brand-gold' : 'hover:text-brand-gold'}`}
                  >
                    FR
                  </button>
                  <span className="opacity-30">|</span>
                  <button 
                    onClick={() => setLanguage('en')} 
                    className={`transition-colors ${language === 'en' ? 'text-brand-gold' : 'hover:text-brand-gold'}`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-text-primary/60">Theme</span>
                <button onClick={toggleTheme} className="hover:text-brand-gold transition-colors flex items-center gap-2 text-xs uppercase tracking-widest">
                  {theme === 'light' ? <><Moon size={16} strokeWidth={1} /> Dark</> : <><Sun size={16} strokeWidth={1} /> Light</>}
                </button>
              </div>

              <div className="flex flex-col gap-6 pt-6 border-t border-border-primary">
                <span className="text-xs uppercase tracking-[0.2em] text-text-primary/60">{t.user.account}</span>
                {user ? (
                  <div className="grid grid-cols-2 gap-6">
                    <Link to="/profile" className="hover:text-brand-gold transition-colors flex items-center gap-3 text-xs uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                      <User size={16} strokeWidth={1} /> {t.user.profile}
                    </Link>
                    <Link to="/profile" className="hover:text-brand-gold transition-colors flex items-center gap-3 text-xs uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                      <Heart size={16} strokeWidth={1} /> {t.user.favorites}
                    </Link>
                    <Link to="/profile" className="hover:text-brand-gold transition-colors flex items-center gap-3 text-xs uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                      <Settings size={16} strokeWidth={1} /> {t.user.settings}
                    </Link>
                    <Link to="/admin" className="hover:text-brand-gold transition-colors flex items-center gap-3 text-xs uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                      <Shield size={16} strokeWidth={1} /> {t.user.admin}
                    </Link>
                    <button onClick={async () => { await signOut(); setIsMobileMenuOpen(false); navigate('/'); }} className="hover:text-red-500 transition-colors flex items-center gap-3 text-xs uppercase tracking-widest text-red-400 col-span-2 mt-2">
                      <LogOut size={16} strokeWidth={1} /> {language === 'fr' ? 'Déconnexion' : 'Sign Out'}
                    </button>
                  </div>
                ) : (
                  <Link to="/auth" className="hover:text-brand-gold transition-colors flex items-center gap-3 text-sm uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>
                    <LogIn size={16} strokeWidth={1} /> {language === 'fr' ? 'Se connecter' : 'Sign In'}
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
        href={`https://wa.me/${settings.whatsappNumber || '1234567890'}`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      </a>
    </div>
  );
}
