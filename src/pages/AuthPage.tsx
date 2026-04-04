import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Shield, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

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
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-24 pb-16 px-6">
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
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl tracking-[0.15em] text-text-primary mb-3">CASA PRIVILEGE</h1>
          <div className="w-12 h-px bg-brand-gold mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.3em] text-text-primary/40">
            {language === 'fr' ? 'Espace Membre Sécurisé' : 'Secure Member Area'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-bg-primary border border-border-primary shadow-2xl shadow-black/5 p-10 md:p-12">
          {/* Tab Switcher */}
          <div className="flex items-center gap-0 mb-10 border-b border-border-primary">
            <button
              onClick={() => switchMode()}
              className={`flex-1 pb-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 relative text-center ${mode === 'login' ? 'text-brand-gold' : 'text-text-primary/40 hover:text-text-primary/60'}`}
            >
              {language === 'fr' ? 'Connexion' : 'Sign In'}
              {mode === 'login' && <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-px bg-brand-gold" />}
            </button>
            <button
              onClick={() => switchMode()}
              className={`flex-1 pb-4 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-500 relative text-center ${mode === 'signup' ? 'text-brand-gold' : 'text-text-primary/40 hover:text-text-primary/60'}`}
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
                      className="w-full bg-transparent border-b border-border-primary pl-8 pr-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary placeholder:text-text-primary/20 rounded-none"
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
                    className="w-full bg-transparent border-b border-border-primary pl-8 pr-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary placeholder:text-text-primary/20 rounded-none"
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
                    className="w-full bg-transparent border-b border-border-primary pl-8 pr-10 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary placeholder:text-text-primary/20 rounded-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-text-primary/30 hover:text-brand-gold transition-colors"
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
                      className="w-full bg-transparent border-b border-border-primary pl-8 pr-0 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors text-text-primary placeholder:text-text-primary/20 rounded-none"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-gold text-brand-black py-4 mt-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-brand-gold/90 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
