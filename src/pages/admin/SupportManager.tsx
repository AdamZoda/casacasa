import { useState, useEffect, useRef, FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { Send, CheckCircle, Ticket as TicketIcon, MessageCircle, Search, Clock, ArrowLeft, MoreVertical, ShieldCheck, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function SupportManager() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
    if (data) setTickets(data);
  };

  useEffect(() => {
    if (!activeTicket) return;
    const fetchMessages = async () => {
      const { data } = await supabase.from('ticket_messages').select('*').eq('ticket_id', activeTicket.id).order('created_at', { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeTicket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTicket) return;

    const tmpId = `msg-${Date.now()}`;
    const msgData = {
      id: tmpId,
      ticket_id: activeTicket.id,
      sender: 'admin',
      content: newMessage.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, msgData]);
    setNewMessage('');

    await supabase.from('ticket_messages').insert({
      id: msgData.id,
      ticket_id: msgData.ticket_id,
      sender: msgData.sender,
      content: msgData.content
    });
  };

  const handleCloseTicket = async () => {
    if (!activeTicket) return;
    await supabase.from('tickets').update({ status: 'closed' }).eq('id', activeTicket.id);
    setActiveTicket(prev => prev ? { ...prev, status: 'closed' } : null);
    fetchTickets();
  };

  const filteredTickets = tickets.filter(t => 
    t.user_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-serif mb-2">Concierge Support</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-text-primary/40 font-medium">Command Center • Active Requests</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={16} />
          <input 
            type="text" 
            placeholder="Rechercher un ticket..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-primary border border-border-primary rounded-full pl-12 pr-4 py-3 text-xs focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>
      </div>

      <div className="flex-grow flex gap-6 overflow-hidden">
        {/* Sidebar: Tickets List */}
        <div className="w-full md:w-[380px] flex flex-col bg-bg-primary border border-border-primary rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-border-primary bg-text-primary/[0.02] flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-text-primary/60">Tickets ({filteredTickets.length})</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 font-medium uppercase tracking-tighter">Live</span>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
            <AnimatePresence initial={false}>
              {filteredTickets.map((t, index) => (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  className={`group w-full text-left p-5 rounded-xl mb-2 transition-all duration-300 relative overflow-hidden ${
                    activeTicket?.id === t.id 
                      ? 'bg-brand-gold text-brand-black shadow-xl shadow-brand-gold/10 scale-[0.98]' 
                      : 'hover:bg-text-primary/5'
                  }`}
                >
                  {t.status === 'open' && activeTicket?.id !== t.id && (
                    <div className="absolute top-0 right-0 w-1 h-full bg-brand-gold" />
                  )}
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className={`font-serif text-base leading-none ${activeTicket?.id === t.id ? 'text-brand-black' : 'text-text-primary'}`}>
                      {t.user_name}
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock size={10} className="text-current opacity-40" />
                      <span className="text-[9px] uppercase tracking-tighter opacity-50">
                        {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-xs font-medium mb-1 truncate ${activeTicket?.id === t.id ? 'text-brand-black/80' : 'text-brand-gold'}`}>
                    {t.subject}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                      activeTicket?.id === t.id 
                        ? 'border-brand-black/20 text-brand-black' 
                        : t.status === 'open' 
                          ? 'border-green-500/30 text-green-600 bg-green-500/5' 
                          : 'border-text-primary/20 text-text-primary/40'
                    }`}>
                      {t.status}
                    </span>
                    <span className={`text-[10px] italic opacity-40`}>#{t.id.slice(-4)}</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
            
            {filteredTickets.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-center px-12">
                <TicketIcon size={40} className="mb-4 text-text-primary/10" />
                <p className="text-xs uppercase tracking-widest text-text-primary/40 leading-relaxed">Aucune demande trouvée</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat / Detail Area */}
        <div className="flex-grow flex flex-col bg-bg-primary border border-border-primary rounded-2xl overflow-hidden shadow-2xl relative">
          <AnimatePresence mode="wait">
            {activeTicket ? (
              <motion.div 
                key={activeTicket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col h-full"
              >
                {/* Header */}
                <div className="px-8 py-6 border-b border-border-primary bg-text-primary/[0.01] flex justify-between items-center gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center border border-brand-gold/20">
                      <User size={22} className="text-brand-gold" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl mb-0.5">{activeTicket.user_name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] uppercase tracking-widest text-text-primary/40">{activeTicket.user_email}</span>
                        <div className="w-1 h-1 rounded-full bg-text-primary/20" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-gold font-bold">Privileged Access</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {activeTicket.status === 'open' ? (
                      <button 
                        onClick={handleCloseTicket}
                        className="group flex items-center gap-3 px-6 py-3 bg-text-primary text-bg-primary rounded-full hover:bg-brand-gold hover:text-brand-black transition-all duration-500 text-[10px] uppercase tracking-widest font-bold shadow-lg"
                      >
                        <ShieldCheck size={14} className="group-hover:scale-110 transition-transform" />
                        Resolve Guest Request
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-6 py-3 bg-text-primary/5 text-text-primary/40 rounded-full border border-border-primary text-[10px] uppercase tracking-widest font-bold italic">
                        Archived / Closed
                      </div>
                    )}
                    <button className="p-3 text-text-primary/20 hover:text-text-primary transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-grow overflow-y-auto p-10 space-y-8 bg-gradient-to-b from-text-primary/[0.02] to-transparent">
                  {/* First Message (Guest Request Original) */}
                  <div className="flex flex-col items-center mb-12">
                    <div className="h-px w-24 bg-border-primary/30 mb-4" />
                    <span className="text-[9px] uppercase tracking-[0.4em] text-text-primary/30 font-medium">Conversation Started</span>
                  </div>

                  {messages.map((m, i) => {
                    const isSelf = m.sender === 'admin';
                    return (
                      <motion.div 
                        key={m.id} 
                        initial={{ opacity: 0, x: isSelf ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`p-6 max-w-[65%] shadow-xl ${
                          isSelf 
                            ? 'bg-text-primary text-bg-primary rounded-2xl rounded-tr-none' 
                            : 'bg-bg-primary border border-border-primary text-text-primary rounded-2xl rounded-tl-none font-light'
                        }`}>
                          <p className="text-sm leading-relaxed mb-3">{m.content}</p>
                          <div className={`flex items-center gap-2 text-[8px] uppercase tracking-tighter opacity-40 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                            {isSelf && <ShieldCheck size={10} />}
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Form Wrapper */}
                <div className={`p-8 bg-bg-primary border-t border-border-primary transition-opacity ${activeTicket.status !== 'open' ? 'opacity-30 pointer-events-none' : ''}`}>
                  <form onSubmit={handleSendMessage} className="flex gap-4 items-center bg-text-primary/[0.03] p-1 rounded-full border border-border-primary focus-within:border-brand-gold/50 transition-all shadow-inner">
                    <input 
                      type="text" 
                      placeholder="Type your response to the guest..." 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      className="flex-grow bg-transparent px-8 py-5 text-sm focus:outline-none placeholder:text-text-primary/20 italic font-light"
                    />
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()} 
                      className="bg-text-primary text-bg-primary w-14 h-14 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-all duration-500 shadow-xl disabled:opacity-20"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-grow flex flex-col items-center justify-center text-center p-20"
              >
                <div className="w-24 h-24 rounded-full bg-text-primary/[0.02] flex items-center justify-center mb-8 border border-border-primary/50 relative">
                  <MessageCircle size={32} className="text-text-primary/10" />
                  <div className="absolute inset-0 rounded-full border border-brand-gold/20 animate-ping" />
                </div>
                <h3 className="text-2xl font-serif mb-3 opacity-60">Waiting Area</h3>
                <p className="text-xs uppercase tracking-[0.3em] text-text-primary/30 max-w-xs leading-loose">
                  Sélectionnez une demande à traiter pour initier le protocole de conciergerie.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
