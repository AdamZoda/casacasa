import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, CheckCircle2, Ticket, Mail, Phone, MapPin, ExternalLink, ShieldCheck, User, LogIn } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

export function Contact() {
  const { settings, addTicket, addTicketMessage, fetchTicketMessages } = useAppContext();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState<'auth' | 'chat'>('auth');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ticketId) return;
    const loadMessages = async () => {
      const data = await fetchTicketMessages(ticketId);
      setMessages(data);
    };
    loadMessages();
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user?.email) return;
    setEmail(user.email);
    const displayName = String(user.user_metadata?.full_name ?? "").trim();
    setName(displayName || user.email.split("@")[0] || "");
  }, [user]);

  useEffect(() => {
    if (!user && step === "chat") {
      setStep("auth");
      setTicketId(null);
      setMessages([]);
    }
  }, [user, step]);

  const handleStartTicket = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    const userEmail = user.email;
    const userName =
      String(user.user_metadata?.full_name ?? name).trim() || userEmail.split("@")[0] || "Membre";
    const { data: existing } = await supabase
      .from("tickets")
      .select("*")
      .eq("user_email", userEmail)
      .eq("status", "open")
      .maybeSingle();
    if (existing) {
      setTicketId(existing.id);
      setStep("chat");
    } else {
      if (!subject.trim()) {
        alert("Veuillez entrer un sujet pour créer un nouveau ticket.");
        return;
      }
      const newId = await addTicket({
        user_name: userName,
        user_email: userEmail,
        subject: subject.trim(),
      });
      setTicketId(newId);
      setStep("chat");
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !ticketId) return;
    await addTicketMessage({
      ticket_id: ticketId,
      sender: 'user',
      content: newMessage.trim()
    });
    setNewMessage('');
    const updated = await fetchTicketMessages(ticketId);
    setMessages(updated);
  };

  const phoneRows = settings.phones
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      icon: Phone,
      label: "Ligne directe",
      value: p,
      link: `tel:${p.replace(/\s/g, "")}`,
      gold: false,
    }));
  const waRows = settings.whatsappNumbers
    .map((n) => n.replace(/\D/g, ""))
    .filter(Boolean)
    .map((d) => ({
      icon: MessageCircle,
      label: "WhatsApp",
      value: `+${d}`,
      link: `https://wa.me/${d}`,
      gold: true,
    }));
  const emailRows = [
    settings.contactEmail
      ? {
          icon: Mail,
          label: "Email principal",
          value: settings.contactEmail,
          link: `mailto:${settings.contactEmail}`,
          gold: false,
        }
      : null,
    ...(settings.contactEmails ?? []).map((entry) => ({
      icon: Mail,
      label: entry.label.trim() || "Email",
      value: entry.email,
      link: `mailto:${entry.email}`,
      gold: false,
    })),
  ].filter((entry): entry is { icon: typeof Mail; label: string; value: string; link: string; gold: boolean } => Boolean(entry?.value));
  const contactOptions = [
    ...phoneRows,
    ...emailRows,
    ...waRows,
  ];

  return (
    <div className="relative pt-28 md:pt-40 pb-20 md:pb-32 mb-10 md:mb-20 px-4 sm:px-6 max-w-[1400px] mx-auto w-full min-h-screen overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[150px] -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 relative z-10">
        {/* Left: Private Channels */}
        <div className="space-y-10 md:space-y-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="h-px w-20 bg-brand-gold mb-6" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
              Contactez l'équipe Casa Privilege
            </h1>
            <p className="text-sm text-white/70 max-w-md">
              Pour toute demande commerciale, partenariat, réservation ou assistance, utilisez l'un des canaux ci‑dessous. Si vous êtes membre, accédez à l'espace privé pour échanger directement avec notre concierge.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:gap-8 max-w-md">
            {contactOptions.map((opt, i) => (
              <motion.a
                key={`${opt.label}-${opt.link}-${i}`}
                href={opt.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.45 }}
                className={`flex items-center gap-4 p-3 md:p-4 border rounded-lg transition-colors ${opt.gold ? 'bg-brand-gold/5 border-brand-gold text-brand-black' : 'bg-transparent border-border-primary hover:border-brand-gold/40'}`}
              >
                <div className={`p-2 md:p-3 rounded-full ${opt.gold ? 'bg-brand-black/05' : 'bg-brand-gold/5 text-brand-gold'}`}>
                  <opt.icon size={18} strokeWidth={1} />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase font-semibold tracking-wider text-white/60 mb-0.5">{opt.label}</p>
                  <p className="text-sm font-medium truncate">{opt.value}</p>
                </div>
                <ExternalLink size={18} className="ml-auto text-white/30" />
              </motion.a>
            ))}
          </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-start gap-4 text-white/60 mt-4">
              <div className="w-9 h-9 rounded-full border border-border-primary flex items-center justify-center">
                <MapPin size={16} />
              </div>
              <div className="text-sm">{settings.address}</div>
            </motion.div>
        </div>

        {/* Right: Interactive Desk */}
        {settings.enablePrivateAccess ? (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-bg-primary/80 backdrop-blur-2xl border border-border-primary shadow-[0_60px_150px_-40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden min-h-[620px] md:min-h-[750px] rounded-sm relative"
          >
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
          
          <AnimatePresence mode="wait">
            {step === 'auth' && (
              <motion.div 
                key="auth"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-8 md:gap-12 p-6 sm:p-10 md:p-24 items-center justify-center h-full text-center"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-brand-gold/5 flex items-center justify-center border border-brand-gold/10">
                    <Ticket size={50} strokeWidth={0.5} className="text-brand-gold" />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-10px] rounded-full border border-dashed border-brand-gold/20"
                  />
                </div>

                <div>
                  <h3 className="text-3xl md:text-4xl font-serif mb-4 md:mb-6 tracking-tight">Accès Privilège</h3>
                  <div className="h-px w-10 bg-brand-gold mx-auto mb-6" />
                  <p className="text-text-primary/40 font-light text-sm tracking-widest leading-relaxed max-w-xs mx-auto uppercase">
                    Connectez-vous pour créer un ticket et échanger avec le concierge.
                  </p>
                </div>

                {authLoading ? (
                  <p className="text-sm tracking-widest uppercase text-text-primary/35">Chargement…</p>
                ) : !user ? (
                  <div className="flex w-full max-w-md flex-col items-center gap-8">
                    <p className="text-text-primary/50 text-sm leading-relaxed">
                      La création de ticket est réservée aux membres connectés.
                    </p>
                    <Link
                      to="/auth"
                      className="inline-flex w-full items-center justify-center gap-2 py-8 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-1000 uppercase tracking-[0.35em] text-[11px] font-black shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
                    >
                      <LogIn size={18} strokeWidth={1.25} aria-hidden />
                      Se connecter
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={(e) => void handleStartTicket(e)} className="w-full max-w-md space-y-6 md:space-y-10">
                    <div className="space-y-4 text-left border border-border-primary/40 bg-text-primary/[0.03] px-6 py-5 rounded-sm">
                      <p className="text-[10px] uppercase tracking-[0.35em] text-text-primary/35 font-bold">Compte</p>
                      <p className="text-sm text-text-primary/80 truncate" title={email}>
                        {email}
                      </p>
                      {name ? (
                        <p className="text-xs text-text-primary/50">
                          <span className="uppercase tracking-widest text-[9px] text-text-primary/30">Nom affiché</span>
                          <br />
                          {name}
                        </p>
                      ) : null}
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="SUJET DE LA DEMANDE"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-transparent border-b border-border-primary py-4 md:py-5 text-text-primary focus:outline-none focus:border-brand-gold transition-all duration-500 font-light text-base md:text-xl tracking-[0.2em] md:tracking-widest placeholder:text-text-primary/20"
                      />
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-gold group-focus-within:w-full transition-all duration-1000" />
                    </div>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, letterSpacing: "0.6em" }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 md:py-8 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-1000 uppercase tracking-[0.25em] md:tracking-[0.5em] text-[11px] font-black mt-6 md:mt-8 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
                    >
                      Solliciter l&apos;Accès
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}

            {step === 'chat' && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: 50, scale: 1.05 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                className="flex flex-col h-full bg-[#faf9f8] dark:bg-[#090909]"
              >
                {/* Chat Header */}
                <div className="px-4 sm:px-6 md:px-10 py-4 md:py-8 bg-text-primary text-bg-primary flex justify-between items-center z-10 shadow-3xl gap-3">
                  <div className="flex items-center gap-3 md:gap-6 min-w-0">
                    <div className="relative">
                      <div className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                        <User size={20} className="text-brand-gold" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg md:text-2xl leading-none mb-1 md:mb-2">Salon Privé</h3>
                      <p className="text-[8px] md:text-[9px] uppercase tracking-[0.22em] md:tracking-[0.4em] font-black text-brand-gold">Concierge en Ligne • Sécurisé</p>
                    </div>
                  </div>
                  <button onClick={() => setStep('auth')} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold opacity-40 hover:opacity-100 transition-all hover:text-brand-gold shrink-0">
                    Quitter le Salon
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6 md:p-12 flex flex-col gap-5 md:gap-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/silk-weave.png')] opacity-95">
                  {messages.length === 0 && (
                    <div className="flex-grow flex flex-col items-center justify-center text-center px-12 opacity-20">
                      <ShieldCheck size={80} strokeWidth={0.5} className="mb-8" />
                      <p className="text-lg font-serif italic mb-2">Bienvenue au salon "Casa Privilege"</p>
                      <p className="text-[10px] uppercase tracking-[0.3em]">Votre conseiller personnel arrive...</p>
                    </div>
                  )}
                  {messages.map((m, i) => {
                    const isUser = m.sender === 'user';
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={m.id} 
                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`p-4 md:p-8 max-w-[88%] md:max-w-[75%] shadow-2xl relative ${
                          isUser 
                            ? 'bg-text-primary text-bg-primary rounded-3xl rounded-tr-none' 
                            : 'bg-white dark:bg-[#111] border border-border-primary text-text-primary rounded-3xl rounded-tl-none font-light'
                        }`}>
                          <p className="text-sm md:text-base leading-relaxed mb-3 md:mb-4">{m.content}</p>
                          <div className={`flex items-center gap-3 text-[9px] uppercase tracking-tighter opacity-30 ${isUser ? 'justify-end' : 'justify-start'}`}>
                            {isUser && <CheckCircle2 size={10} />}
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Container */}
                <div className="p-4 sm:p-6 md:p-10 bg-bg-primary border-t border-border-primary">
                  <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-4 items-center bg-text-primary/[0.04] p-1.5 md:p-2 rounded-full border border-border-primary focus-within:border-brand-gold/40 focus-within:shadow-[0_0_50px_rgba(212,175,55,0.1)] transition-all">
                    <input 
                      type="text" placeholder="Formulez votre demande ici..." value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="flex-grow bg-transparent px-4 md:px-10 py-3 md:py-6 text-sm md:text-base focus:outline-none placeholder:text-text-primary/20 italic font-light tracking-wide"
                    />
                    <motion.button 
                      type="submit" disabled={!newMessage.trim()} 
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-text-primary text-bg-primary w-11 h-11 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-all duration-500 shadow-2xl disabled:opacity-10"
                    >
                      <Send size={18} className="md:hidden" />
                      <Send size={24} className="hidden md:block" />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-bg-primary/80 backdrop-blur-2xl border border-border-primary shadow-[0_60px_150px_-40px_rgba(0,0,0,0.5)] flex items-center justify-center min-h-[420px] md:min-h-[520px] rounded-sm p-8">
            <div className="text-center">
              <h3 className="font-serif text-2xl mb-2">Contactez-nous</h3>
              <p className="text-text-primary/60 max-w-md mx-auto">La messagerie privée (Accès Privilège) est désactivée sur ce site. Pour toute demande, utilisez les coordonnées à gauche (email, téléphone ou WhatsApp).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
