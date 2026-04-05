import { useState, useEffect, useRef, useMemo, useDeferredValue, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { useAppContext, type Ticket, type TicketMessage } from "../../context/AppContext";
import {
  Send,
  Ticket as TicketIcon,
  MessageCircle,
  Search,
  Clock,
  ShieldCheck,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const POLL_TICKETS_MS = 12_000;
const POLL_MESSAGES_MS = 8_000;

function ticketSort(a: Ticket, b: Ticket): number {
  if (a.status === "open" && b.status !== "open") return -1;
  if (a.status !== "open" && b.status === "open") return 1;
  return (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0);
}

function formatTicketDate(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SupportManager() {
  const { tickets, refreshTickets, updateTicketStatus, fetchTicketMessages } = useAppContext();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const deferredSearch = useDeferredValue(searchTerm.trim().toLowerCase());
  const searchPending = searchTerm.trim().toLowerCase() !== deferredSearch;

  const filteredTickets = useMemo(() => {
    const q = deferredSearch;
    const list = tickets.filter((t) => {
      const name = (t.user_name ?? "").toLowerCase();
      const subj = (t.subject ?? "").toLowerCase();
      const mail = (t.user_email ?? "").toLowerCase();
      const id = String(t.id ?? "").toLowerCase();
      return !q || name.includes(q) || subj.includes(q) || mail.includes(q) || id.includes(q);
    });
    return [...list].sort(ticketSort);
  }, [tickets, deferredSearch]);

  useEffect(() => {
    void refreshTickets();
    const interval = setInterval(() => void refreshTickets(), POLL_TICKETS_MS);
    return () => clearInterval(interval);
  }, [refreshTickets]);

  useEffect(() => {
    if (!activeTicket) {
      setMessages([]);
      return;
    }
    const next = tickets.find((t) => t.id === activeTicket.id);
    if (next) setActiveTicket(next);
    else {
      setActiveTicket(null);
      return;
    }

    const load = async () => {
      const data = await fetchTicketMessages(activeTicket.id);
      setMessages(data);
    };
    void load();
    const interval = setInterval(() => void load(), POLL_MESSAGES_MS);
    return () => clearInterval(interval);
  }, [activeTicket?.id, tickets, fetchTicketMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeTicket || activeTicket.status !== "open") return;

    const msgData: TicketMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ticket_id: activeTicket.id,
      sender: "admin",
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");

    const { error } = await supabase.from("ticket_messages").insert({
      id: msgData.id,
      ticket_id: msgData.ticket_id,
      sender: msgData.sender,
      content: msgData.content,
    });
    if (error) {
      console.error("[Supabase] ticket_messages:", error.message);
      setMessages((prev) => prev.filter((m) => m.id !== msgData.id));
    }
  };

  const handleCloseTicket = async () => {
    if (!activeTicket) return;
    await updateTicketStatus(activeTicket.id, "closed");
    setActiveTicket((prev) => (prev ? { ...prev, status: "closed" } : null));
    void refreshTickets();
  };

  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
<<<<<<< HEAD
    <div className="flex flex-col gap-6 md:gap-8 min-h-[min(72vh,720px)] pb-4">
=======
    <div className="flex min-h-0 flex-col gap-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:min-h-[min(72vh,720px)] md:gap-8">
>>>>>>> e1b3035 (Initial commit)
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div className="min-w-0">
          <div className="h-px w-14 bg-brand-gold/70 mb-4" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-2 text-balance">Conciergerie &amp; tickets</h2>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-text-primary/45 font-semibold">
            Centre de commande · demandes actives
          </p>
        </div>
        <div className="relative w-full lg:max-w-md shrink-0">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/35 pointer-events-none"
            size={17}
            aria-hidden
          />
          <input
            type="search"
            placeholder="Rechercher un ticket (nom, sujet, e-mail)…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            className={`admin-input w-full rounded-full pl-11 pr-4 py-3.5 text-sm font-medium normal-case transition-opacity ${
              searchPending ? "opacity-70" : ""
            }`}
            aria-label="Rechercher un ticket"
            aria-busy={searchPending}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-5 lg:gap-6 min-h-0 lg:min-h-[520px]">
        {/* Liste tickets */}
<<<<<<< HEAD
        <div className="admin-card flex flex-col overflow-hidden p-0 w-full lg:w-[min(100%,380px)] lg:shrink-0 lg:max-h-[min(72vh,680px)]">
=======
        <div className="admin-card flex max-h-[min(42dvh,320px)] w-full flex-col overflow-hidden p-0 lg:max-h-[min(72vh,680px)] lg:w-[min(100%,380px)] lg:shrink-0">
>>>>>>> e1b3035 (Initial commit)
          <div className="px-4 py-4 sm:px-5 border-b border-border-primary/70 bg-text-primary/[0.03] flex justify-between items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-black text-text-primary/55">
              Tickets ({filteredTickets.length})
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
              </span>
              <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Live</span>
              {openCount > 0 ? (
                <span className="text-[9px] font-black text-text-primary/35 tabular-nums ml-1">
                  · {openCount} ouvert{openCount > 1 ? "s" : ""}
                </span>
              ) : null}
            </div>
          </div>

<<<<<<< HEAD
          <div className="flex-1 overflow-y-auto overscroll-contain p-2 min-h-[220px] lg:min-h-0">
=======
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
>>>>>>> e1b3035 (Initial commit)
            {filteredTickets.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center px-8">
                <TicketIcon size={36} className="mb-4 text-text-primary/15" strokeWidth={1} aria-hidden />
                <p className="text-[11px] uppercase tracking-[0.25em] text-text-primary/40 font-bold leading-relaxed">
                  Aucune demande trouvée
                </p>
                <p className="text-xs text-text-primary/25 mt-2 max-w-[240px]">
                  Ajustez la recherche ou attendez un nouveau ticket depuis le site.
                </p>
              </div>
            ) : (
              <ul className="space-y-2" role="list">
                {filteredTickets.map((t) => {
                  const selected = activeTicket?.id === t.id;
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => setActiveTicket(t)}
<<<<<<< HEAD
                        className={`group w-full text-left p-4 rounded-xl transition-all duration-300 border relative overflow-hidden ${
=======
                        className={`group relative w-full min-h-[3.5rem] touch-manipulation overflow-hidden rounded-xl border p-4 text-left transition-all duration-300 ${
>>>>>>> e1b3035 (Initial commit)
                          selected
                            ? "bg-brand-gold text-brand-black border-brand-gold shadow-lg shadow-brand-gold/15"
                            : "border-transparent hover:bg-text-primary/[0.04] hover:border-border-primary/40"
                        }`}
                      >
                        {t.status === "open" && !selected ? (
                          <div className="absolute top-0 right-0 w-1 h-full bg-brand-gold/90 rounded-l" aria-hidden />
                        ) : null}

                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span
                            className={`font-serif text-[15px] leading-tight truncate ${selected ? "text-brand-black" : "text-text-primary"}`}
                          >
                            {t.user_name || "Invité"}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0 opacity-60">
                            <Clock size={11} aria-hidden />
                            <span className="text-[9px] uppercase tracking-tight">
                              {new Date(t.created_at).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>

                        <p
                          className={`text-xs font-medium truncate mb-3 ${selected ? "text-brand-black/85" : "text-brand-gold"}`}
                        >
                          {t.subject || "Sans sujet"}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-black ${
                              selected
                                ? "border-brand-black/25 text-brand-black"
                                : t.status === "open"
                                  ? "border-emerald-500/35 text-emerald-600 dark:text-emerald-400 bg-emerald-500/8"
                                  : "border-text-primary/20 text-text-primary/45"
                            }`}
                          >
                            {t.status === "open" ? "Ouvert" : "Clôturé"}
                          </span>
                          <span className={`text-[10px] font-mono opacity-40 truncate max-w-[5rem]`}>
                            #{String(t.id).slice(-6)}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Détail / conversation */}
<<<<<<< HEAD
        <div className="admin-card flex flex-col flex-1 overflow-hidden p-0 min-h-[420px] lg:min-h-0 lg:max-h-[min(72vh,680px)]">
=======
        <div className="admin-card flex min-h-[min(48dvh,380px)] flex-1 flex-col overflow-hidden p-0 lg:min-h-0 lg:max-h-[min(72vh,680px)]">
>>>>>>> e1b3035 (Initial commit)
          <AnimatePresence mode="wait">
            {activeTicket ? (
              <motion.div
                key={activeTicket.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col h-full min-h-0"
              >
                <div className="px-4 py-5 sm:px-6 sm:py-6 border-b border-border-primary/60 bg-text-primary/[0.02] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-brand-gold/12 flex items-center justify-center border border-brand-gold/25 shrink-0">
                      <User size={20} className="text-brand-gold" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg sm:text-xl truncate">{activeTicket.user_name || "Invité"}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-text-primary/40 truncate mt-0.5">
                        {activeTicket.user_email}
                      </p>
                      <p className="text-[9px] text-text-primary/30 mt-1">{formatTicketDate(activeTicket.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {activeTicket.status === "open" ? (
                      <button
                        type="button"
                        onClick={() => void handleCloseTicket()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-300 text-[10px] uppercase tracking-widest font-black"
                      >
                        <ShieldCheck size={14} aria-hidden />
                        Clôturer la demande
                      </button>
                    ) : (
                      <div className="px-5 py-2.5 rounded-full border border-border-primary text-[10px] uppercase tracking-widest font-bold text-text-primary/40 bg-text-primary/[0.03]">
                        Ticket archivé
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-8 sm:py-8 space-y-6 bg-gradient-to-b from-text-primary/[0.02] to-transparent min-h-0">
                  <div className="flex flex-col items-center mb-6">
                    <div className="h-px w-16 bg-border-primary/40 mb-3" />
                    <span className="text-[9px] uppercase tracking-[0.35em] text-text-primary/35 font-bold">
                      Fil de conversation
                    </span>
                  </div>

                  {messages.map((m) => {
                    const isAdmin = m.sender === "admin";
                    return (
                      <div key={m.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`p-4 sm:p-5 max-w-[min(100%,28rem)] shadow-sm ${
                            isAdmin
                              ? "bg-text-primary text-bg-primary rounded-2xl rounded-tr-md"
                              : "bg-bg-primary border border-border-primary rounded-2xl rounded-tl-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{m.content}</p>
                          <div
                            className={`flex items-center gap-2 mt-2 text-[8px] uppercase tracking-tight opacity-45 ${
                              isAdmin ? "justify-end" : "justify-start"
                            }`}
                          >
                            {isAdmin ? <ShieldCheck size={10} aria-hidden /> : null}
                            {new Date(m.created_at).toLocaleString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                              day: "2-digit",
                              month: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div
                  className={`p-4 sm:p-6 border-t border-border-primary shrink-0 bg-bg-primary/95 backdrop-blur-sm ${
                    activeTicket.status !== "open" ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  <form
                    onSubmit={(e) => void handleSendMessage(e)}
                    className="flex gap-3 items-center bg-text-primary/[0.04] p-1.5 pl-2 rounded-full border border-border-primary focus-within:border-brand-gold/40 transition-colors"
                  >
                    <label htmlFor="support-reply" className="sr-only">
                      Réponse au client
                    </label>
                    <input
                      id="support-reply"
                      type="text"
                      placeholder="Votre message au client…"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={activeTicket.status !== "open"}
                      className="flex-1 min-w-0 bg-transparent px-4 py-3.5 text-sm focus:outline-none placeholder:text-text-primary/30"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || activeTicket.status !== "open"}
<<<<<<< HEAD
                      className="bg-text-primary text-bg-primary w-12 h-12 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-black transition-all duration-300 disabled:opacity-25 shrink-0"
=======
                      className="flex h-12 min-h-12 min-w-12 shrink-0 items-center justify-center rounded-full bg-text-primary text-bg-primary transition-all duration-300 hover:bg-brand-gold hover:text-brand-black disabled:opacity-25 touch-manipulation"
>>>>>>> e1b3035 (Initial commit)
                      aria-label="Envoyer"
                    >
                      <Send size={18} aria-hidden />
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center px-8 py-16 min-h-[360px]"
              >
                <div className="w-20 h-20 rounded-full bg-text-primary/[0.04] flex items-center justify-center mb-6 border border-border-primary/50">
                  <MessageCircle size={30} className="text-text-primary/20" strokeWidth={1} aria-hidden />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif mb-3 text-text-primary/70">Espace d&apos;attente</h3>
                <p className="text-[11px] uppercase tracking-[0.22em] text-text-primary/35 max-w-sm leading-relaxed font-semibold">
                  Sélectionnez une demande dans la liste pour afficher la conversation et répondre en conciergerie.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
