import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, CheckCircle2, Ticket, Mail, Phone, MapPin, ExternalLink, ShieldCheck, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAppContext } from "../context/AppContext";

export function Contact() {
  const { settings } = useAppContext();
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
    const fetchMessages = async () => {
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartTicket = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    const { data: existing } = await supabase.from('tickets').select('*').eq('user_email', email).eq('status', 'open').single();
    if (existing) {
      setTicketId(existing.id);
      setStep('chat');
    } else {
      if (!subject) {
        alert("Veuillez entrer un sujet pour créer un nouveau ticket.");
        return;
      }
      const newId = `tkt-${Date.now()}`;
      await supabase.from('tickets').insert({ id: newId, user_name: name, user_email: email, subject: subject, status: 'open' });
      setTicketId(newId);
      setStep('chat');
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !ticketId) return;
    const msg = {
      id: `msg-${Date.now()}`,
      ticket_id: ticketId,
      sender: 'user',
      content: newMessage.trim(),
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    await supabase.from('ticket_messages').insert({ id: msg.id, ticket_id: msg.ticket_id, sender: msg.sender, content: msg.content });
  };

  const contactOptions = [
    { icon: Phone, label: "Direct Line", value: settings.phone, link: `tel:${settings.phone}` },
    { icon: Mail, label: "Private Email", value: settings.contactEmail, link: `mailto:${settings.contactEmail}` },
    { icon: MessageCircle, label: "WhatsApp VIP", value: `+${settings.whatsappNumber}`, link: `https://wa.me/${settings.whatsappNumber}`, gold: true },
  ];

  return (
    <div className="relative pt-40 pb-32 mb-20 px-6 max-w-[1400px] mx-auto w-full min-h-screen overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 -left-24 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-[150px] -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
        {/* Left: Private Channels */}
        <div className="space-y-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
              className="h-px w-32 bg-brand-gold mb-12 origin-left" 
            />
            <h1 className="text-6xl md:text-8xl font-serif mb-10 leading-[0.9] tracking-tighter">
              L'Art du <br /><span className="text-brand-gold">Service Privé</span>
            </h1>
            <p className="text-text-primary/50 font-light text-xl leading-relaxed max-w-sm italic">
              "L'excellence est notre langue, la discrétion est notre signature."
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 max-w-md">
            {contactOptions.map((opt, i) => (
              <motion.a
                key={opt.label}
                href={opt.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ x: 15, scale: 1.02 }}
                transition={{ delay: 0.4 + i * 0.15, duration: 0.6 }}
                className={`group flex items-center gap-8 p-8 border backdrop-blur-sm transition-shadow duration-700 ${
                  opt.gold 
                    ? 'bg-brand-gold border-brand-gold text-brand-black shadow-2xl shadow-brand-gold/20' 
                    : 'border-border-primary hover:border-brand-gold/40 bg-text-primary/[0.03] hover:shadow-xl'
                }`}
              >
                <div className={`p-5 rounded-full transition-transform duration-500 group-hover:rotate-[360deg] ${opt.gold ? 'bg-brand-black/10' : 'bg-brand-gold/5 text-brand-gold'}`}>
                  <opt.icon size={28} strokeWidth={1} />
                </div>
                <div>
                  <p className={`text-[11px] uppercase font-bold tracking-[0.3em] mb-2 ${opt.gold ? 'text-brand-black/50' : 'text-text-primary/30'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xl font-medium tracking-wide">{opt.value}</p>
                </div>
                <ExternalLink size={20} className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 ${opt.gold ? 'text-brand-black' : 'text-brand-gold'}`} />
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-6 text-text-primary/20 group cursor-default"
          >
            <div className="w-10 h-10 rounded-full border border-border-primary flex items-center justify-center group-hover:border-brand-gold/50 transition-colors">
              <MapPin size={18} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">{settings.address}</span>
          </motion.div>
        </div>

        {/* Right: Interactive Desk */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-bg-primary/80 backdrop-blur-2xl border border-border-primary shadow-[0_60px_150px_-40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden min-h-[750px] rounded-sm relative"
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
                className="flex flex-col gap-12 p-16 md:p-24 items-center justify-center h-full text-center"
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
                  <h3 className="text-4xl font-serif mb-6 tracking-tight">Accès Privilège</h3>
                  <div className="h-px w-10 bg-brand-gold mx-auto mb-6" />
                  <p className="text-text-primary/40 font-light text-sm tracking-widest leading-relaxed max-w-xs mx-auto uppercase">
                    Veuillez valider votre identité pour rejoindre le salon privé de discussion.
                  </p>
                </div>

                <form onSubmit={handleStartTicket} className="w-full max-w-md space-y-10">
                  <div className="space-y-8">
                    {['name', 'email', 'subject'].map((field) => (
                      <div key={field} className="relative group">
                        <input 
                          type={field === 'email' ? 'email' : 'text'} 
                          placeholder={field === 'name' ? 'VOTRE NOM' : field === 'email' ? 'VOTRE EMAIL' : 'SUJET DE LA DEMANDE'} 
                          required 
                          value={field === 'name' ? name : field === 'email' ? email : subject}
                          onChange={e => {
                            if (field === 'name') setName(e.target.value);
                            else if (field === 'email') setEmail(e.target.value);
                            else setSubject(e.target.value);
                          }}
                          className="w-full bg-transparent border-b border-border-primary py-5 text-text-primary focus:outline-none focus:border-brand-gold transition-all duration-500 font-light text-xl tracking-widest placeholder:text-text-primary/10"
                        />
                        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-gold group-focus-within:w-full transition-all duration-1000" />
                      </div>
                    ))}
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02, letterSpacing: "0.6em" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-8 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-1000 uppercase tracking-[0.5em] text-[11px] font-black mt-16 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]"
                  >
                    Solliciter l'Accès
                  </motion.button>
                </form>
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
                <div className="px-10 py-8 bg-text-primary text-bg-primary flex justify-between items-center z-10 shadow-3xl">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                        <User size={24} className="text-brand-gold" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl leading-none mb-2">Salon Privé</h3>
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black text-brand-gold">Concierge en Ligne • Sécurisé</p>
                    </div>
                  </div>
                  <button onClick={() => setStep('auth')} className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30 hover:opacity-100 transition-all hover:text-brand-gold">
                    Quitter le Salon
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-grow overflow-y-auto p-12 flex flex-col gap-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/silk-weave.png')] opacity-95">
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
                        <div className={`p-8 max-w-[75%] shadow-2xl relative ${
                          isUser 
                            ? 'bg-text-primary text-bg-primary rounded-3xl rounded-tr-none' 
                            : 'bg-white dark:bg-[#111] border border-border-primary text-text-primary rounded-3xl rounded-tl-none font-light'
                        }`}>
                          <p className="text-base leading-relaxed mb-4">{m.content}</p>
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
                <div className="p-10 bg-bg-primary border-t border-border-primary">
                  <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-text-primary/[0.04] p-2 rounded-full border border-border-primary focus-within:border-brand-gold/40 focus-within:shadow-[0_0_50px_rgba(212,175,55,0.1)] transition-all">
                    <input 
                      type="text" placeholder="Formulez votre demande ici..." value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="flex-grow bg-transparent px-10 py-6 text-base focus:outline-none placeholder:text-text-primary/10 italic font-light tracking-wide uppercase"
                    />
                    <motion.button 
                      type="submit" disabled={!newMessage.trim()} 
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-text-primary text-bg-primary w-16 h-16 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-all duration-500 shadow-2xl disabled:opacity-10"
                    >
                      <Send size={24} />
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
