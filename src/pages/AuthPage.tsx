<<<<<<< HEAD
import { useState } from "react";
=======
import { useCallback, useState } from "react";
>>>>>>> e1b3035 (Initial commit)
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
<<<<<<< HEAD
=======
import { TurnstileWidget } from "../components/TurnstileWidget";
>>>>>>> e1b3035 (Initial commit)

export function AuthPage() {
  const { signIn, signUp } = useAuth();
  const { language } = useAppContext();
  const navigate = useNavigate();
  const t = translations[language];

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

<<<<<<< HEAD
=======
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const onTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const hasTurnstileSiteKey = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

>>>>>>> e1b3035 (Initial commit)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

<<<<<<< HEAD
=======
  const verifyTurnstile = async (): Promise<boolean> => {
    if (!hasTurnstileSiteKey) {
      setError(
        language === 'fr'
          ? 'La vérification de sécurité n’est pas configurée (clé site manquante).'
          : 'Security verification is not configured (missing site key).'
      );
      return false;
    }
    if (!turnstileToken) {
      setError(
        language === 'fr'
          ? 'Complétez la vérification de sécurité ci-dessous.'
          : 'Please complete the security verification below.'
      );
      return false;
    }
    let res: Response;
    try {
      res = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: turnstileToken }),
      });
    } catch {
      setError(
        language === 'fr'
          ? 'Impossible de joindre le serveur de vérification.'
          : 'Could not reach the verification server.'
      );
      setTurnstileResetKey((k) => k + 1);
      return false;
    }
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      const code = data?.error;
      setError(
        language === 'fr'
          ? code === 'server_misconfigured'
            ? 'Erreur serveur : secret Turnstile manquant (Vercel / .env).'
            : 'Vérification de sécurité refusée. Réessayez.'
          : code === 'server_misconfigured'
            ? 'Server error: Turnstile secret missing (set TURNSTILE_SECRET_KEY on Vercel).'
            : 'Security verification failed. Please try again.'
      );
      setTurnstileResetKey((k) => k + 1);
      return false;
    }
    return true;
  };

>>>>>>> e1b3035 (Initial commit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

<<<<<<< HEAD
=======
    const turnstileOk = await verifyTurnstile();
    if (!turnstileOk) {
      setLoading(false);
      return;
    }

>>>>>>> e1b3035 (Initial commit)
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError(language === 'fr' ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError(language === 'fr' ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(formData.email, formData.password, formData.fullName);
      if (error) {
        setError(error);
      } else {
        setSuccess(language === 'fr'
          ? 'Compte créé ! Vérifiez votre e-mail pour confirmer votre inscription.'
          : 'Account created! Check your email to confirm your registration.'
        );
      }
    } else {
      const { error } = await signIn(formData.email, formData.password);
      if (error) {
        setError(error);
      } else {
        navigate('/profile');
      }
    }
    setLoading(false);
  };

  const switchMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError(null);
    setSuccess(null);
<<<<<<< HEAD
=======
    setTurnstileResetKey((k) => k + 1);
>>>>>>> e1b3035 (Initial commit)
  };

  return (
    <div className="relative flex min-h-[100dvh] min-h-screen items-center justify-center overflow-hidden px-4 pb-10 pt-24 sm:px-6 sm:pb-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-bg-primary">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center sm:mb-12">
          <h1 className="mb-3 font-serif text-2xl tracking-[0.12em] text-text-primary sm:text-3xl sm:tracking-[0.15em]">
            CASA PRIVILEGE
          </h1>
          <div className="w-12 h-px bg-brand-gold mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.3em] text-text-primary/40">
            {language === 'fr' ? 'Espace Membre Sécurisé' : 'Secure Member Area'}
          </p>
        </div>

        {/* Card */}
        <div className="border border-border-primary bg-bg-primary p-6 shadow-2xl shadow-black/5 sm:p-10 md:p-12">
          {/* Tab Switcher */}
          <div className="mb-8 flex items-center gap-0 border-b border-border-primary sm:mb-10">
            <button
              type="button"
              onClick={() => switchMode()}
              className={`relative min-h-12 flex-1 touch-manipulation pb-4 text-center text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 ${mode === "login" ? "text-brand-gold" : "text-text-primary/40 hover:text-text-primary/60"}`}
            >
              {language === 'fr' ? 'Connexion' : 'Sign In'}
              {mode === 'login' && <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />}
            </button>
            <button
              type="button"
              onClick={() => switchMode()}
              className={`relative min-h-12 flex-1 touch-manipulation pb-4 text-center text-xs font-medium uppercase tracking-[0.2em] transition-all duration-500 ${mode === "signup" ? "text-brand-gold" : "text-text-primary/40 hover:text-text-primary/60"}`}
            >
              {language === 'fr' ? 'Créer un compte' : 'Sign Up'}
              {mode === 'signup' && <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />}
            </button>
          </div>

          {/* Error/Success Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 mb-6 p-4 bg-red-500/5 border border-red-500/20 text-red-500 text-xs tracking-wide"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-3 mb-6 p-4 bg-green-500/5 border border-green-500/20 text-green-600 text-xs tracking-wide"
              >
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.35 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Full Name (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-text-primary/50 font-medium">
                    {language === 'fr' ? 'Nom complet' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User size={16} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2 text-text-primary/30" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder={language === 'fr' ? 'Votre nom complet' : 'Your full name'}
                      className="w-full rounded-none border-b border-border-primary bg-transparent py-3 pl-8 pr-0 text-base text-text-primary placeholder:text-text-primary/20 transition-colors focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-text-primary/50 font-medium">
                  {language === 'fr' ? 'Adresse e-mail' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail size={16} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2 text-text-primary/30" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="w-full rounded-none border-b border-border-primary bg-transparent py-3 pl-8 pr-0 text-base text-text-primary placeholder:text-text-primary/20 transition-colors focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-text-primary/50 font-medium">
                  {language === 'fr' ? 'Mot de passe' : 'Password'}
                </label>
                <div className="relative">
                  <Lock size={16} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2 text-text-primary/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full rounded-none border-b border-border-primary bg-transparent py-3 pl-8 pr-10 text-base text-text-primary placeholder:text-text-primary/20 transition-colors focus:border-brand-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-text-primary/30 transition-colors hover:text-brand-gold touch-manipulation"
                  >
                    {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-text-primary/50 font-medium">
                    {language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock size={16} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2 text-text-primary/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full rounded-none border-b border-border-primary bg-transparent py-3 pl-8 pr-0 text-base text-text-primary placeholder:text-text-primary/20 transition-colors focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>
              )}

<<<<<<< HEAD
=======
              <div className="flex flex-col items-center gap-2 pt-2">
                <TurnstileWidget
                  resetKey={turnstileResetKey}
                  onToken={onTurnstileToken}
                  className="min-h-[65px]"
                />
                <p className="text-[10px] text-text-primary/35 text-center uppercase tracking-[0.2em]">
                  {language === 'fr' ? 'Protection anti-robot (Cloudflare)' : 'Bot protection (Cloudflare)'}
                </p>
              </div>

>>>>>>> e1b3035 (Initial commit)
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex min-h-12 w-full items-center justify-center gap-3 bg-brand-gold py-4 text-xs font-medium uppercase tracking-[0.2em] text-brand-black transition-all duration-500 hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    {mode === 'login'
                      ? (language === 'fr' ? 'Se connecter' : 'Sign In')
                      : (language === 'fr' ? 'Créer mon compte' : 'Create Account')
                    }
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-border-primary text-text-primary/30">
            <Shield size={14} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.2em]">
              {language === 'fr' ? 'Connexion sécurisée SSL' : 'SSL Secure Connection'}
            </span>
          </div>
        </div>

        {/* Bottom Decorative */}
        <div className="text-center mt-8">
          <p className="text-[10px] text-text-primary/20 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Casa Privilege
          </p>
        </div>
      </motion.div>
    </div>
  );
}
