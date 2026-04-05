import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Check, X, MessageCircle, Trash2, Calendar, User, Users, Phone, Mail, ArrowRight, ShieldCheck, Clock, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const COUNTRIES = [
  { name: "Maroc", code: "+212", flag: "🇲🇦", length: 9 },
  { name: "France", code: "+33", flag: "🇫🇷", length: 9 },
  { name: "Espagne", code: "+34", flag: "🇪🇸", length: 9 },
  { name: "Royaume-Uni", code: "+44", flag: "🇬🇧", length: 10 },
  { name: "États-Unis", code: "+1", flag: "🇺🇸", length: 10 },
  { name: "Émirats Arabes Unis", code: "+971", flag: "🇦🇪", length: 9 },
  { name: "Qatar", code: "+974", flag: "🇶🇦", length: 8 },
  { name: "Arabie Saoudite", code: "+966", flag: "🇸🇦", length: 9 },
  { name: "Suisse", code: "+41", flag: "🇨🇭", length: 9 },
  { name: "Belgique", code: "+32", flag: "🇧🇪", length: 9 },
  { name: "Italie", code: "+39", flag: "🇮🇹", length: 10 },
  { name: "Portugal", code: "+351", flag: "🇵🇹", length: 9 },
  { name: "Canada", code: "+1", flag: "🇨🇦", length: 10 },
  { name: "Allemagne", code: "+49", flag: "🇩🇪", length: 11 },
];

const getNumericPrice = (priceStr: string | undefined): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/\s/g, '').match(/\d+([.,]\d+)?/);
  if (!cleaned) return 0;
  return parseInt(cleaned[0].replace(/[,.]\d+$/, '').replace(/\D/g, ''), 10);
};

function clientInitials(name: string | null | undefined): string {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.map((n) => n[0]!.toUpperCase()).join("").slice(0, 3);
}

function displayTitle(res: { activity_title?: string | null }): string {
  return (res.activity_title && String(res.activity_title).trim()) || "Activité";
}

function isDhActivity(res: { activity_title?: string | null }): boolean {
  return displayTitle(res).toLowerCase().includes("dh");
}

export function Reservations() {
  const { reservations, updateReservationStatus, deleteReservation, activities } = useAppContext();
  const [selectedRes, setSelectedRes] = useState<any | null>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-12 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Reservations Management</h2>
          <p className="text-[10px] text-text-primary/40 uppercase tracking-[0.3em] font-medium">Elevating Client Experiences • VIP Desk</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-bg-primary border border-brand-gold/20 px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-gold shadow-lg shadow-brand-gold/5">
            Total Bookings: {reservations.length}
          </div>
        </div>
      </div>

      <div className="bg-bg-primary border border-border-primary overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-text-primary/[0.02] border-b border-border-primary">
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Client & Origine</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Expérience & Canal</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Période & Budget</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {reservations.map(res => {
              const country = COUNTRIES.find(c => c.name === res.country);
              const activity = activities.find(a => a.id === res.activity_id);
              
              let displayPrice = Number(res.total_price || 0);
              if (displayPrice === 0 && activity?.price) {
                const base = getNumericPrice(activity.price);
                const start = new Date(res.date);
                const end = new Date(res.end_date || res.date);
                const days = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                displayPrice = base * days * (res.people_count || 1);
              }

              return (
                <tr 
                  key={res.id} 
                  onClick={() => setSelectedRes(res)}
                  className="group hover:bg-brand-gold/[0.03] transition-all duration-500 cursor-pointer"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-text-primary text-bg-primary flex items-center justify-center text-xs font-bold rounded-sm group-hover:bg-brand-gold transition-colors duration-500">
                        {clientInitials(res.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-serif group-hover:text-brand-gold transition-colors">{res.name ?? "—"}</p>
                          <span className="text-lg" title={res.country}>{country?.flag || '🇲🇦'}</span>
                        </div>
                        <p className="text-[10px] text-text-primary/30 uppercase tracking-tighter mt-1">{res.contact ?? "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium tracking-tight mb-1">{displayTitle(res)}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 opacity-60">
                           <div className={`w-1.5 h-1.5 rounded-full ${res.channel === 'whatsapp' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-brand-gold shadow-[0_0_8px_rgba(229,169,58,0.5)]'}`} />
                           <span className="text-[9px] uppercase tracking-widest font-bold">via {res.channel}</span>
                        </div>
                        {res.receipt_base64 && (
                          <div className="flex items-center gap-1 bg-brand-gold/10 px-2 py-0.5 rounded border border-brand-gold/20 animate-pulse-slow">
                            <FileText size={10} className="text-brand-gold" />
                            <span className="text-[8px] uppercase font-black text-brand-gold tracking-widest">Reçu Inclus</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm text-text-primary/90 font-serif italic">
                        <Calendar size={14} className="opacity-40 text-brand-gold" strokeWidth={1} />
                        <span>{res.date} {res.end_date && res.end_date !== res.date ? `au ${res.end_date}` : ''}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-brand-gold font-bold text-base">
                          {displayPrice.toLocaleString()} {isDhActivity(res) ? "DH" : "€"}
                        </div>
                        {res.people_count && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-text-primary/40 bg-text-primary/5 px-2 py-1 rounded">
                            <Users size={12} strokeWidth={1.5} />
                            <span>{res.people_count} pers</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm border ${
                      res.status === 'confirmed' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                      res.status === 'cancelled' ? 'border-red-500/30 text-red-500 bg-red-500/5' : 
                      'border-brand-gold/30 text-brand-gold bg-brand-gold/5'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="p-6" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-500">
                      {res.status === 'pending' && (
                        <button 
                          onClick={() => updateReservationStatus(res.id, 'confirmed')}
                          className="p-2.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-md"
                          title="Confirm"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteReservation(res.id)}
                        className="p-2.5 bg-text-primary/5 text-text-primary/20 hover:bg-red-500 hover:text-white transition-all shadow-md"
                        title="Archive"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Side Detail Panel */}
      <AnimatePresence>
        {selectedRes && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRes(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-bg-primary border-l border-border-primary z-[110] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] p-0 flex flex-col"
            >
              <div className="p-10 border-b border-border-primary flex justify-between items-center bg-text-primary/[0.01]">
                <div className="flex items-center gap-4 text-brand-gold">
                  <ShieldCheck size={24} />
                  <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Client Profile • Detail View</span>
                </div>
                <button onClick={() => setSelectedRes(null)} className="p-2 hover:bg-text-primary/5 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-12 custom-scrollbar space-y-12">
                {/* Header User */}
                <div className="text-center relative">
                  <div className="w-24 h-24 bg-brand-gold text-brand-black text-3xl font-serif flex items-center justify-center rounded-sm mx-auto mb-6 shadow-xl relative z-10">
                    {clientInitials(selectedRes.name).slice(0, 1) || "?"}
                  </div>
                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-gold/5 blur-3xl -z-0"></div>
                  <h3 className="text-3xl font-serif mb-2 relative z-10">{selectedRes.name ?? "—"}</h3>
                  <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-text-primary/40 font-medium relative z-10">
                    <span>Expérience ID: #{String(selectedRes.id ?? "").slice(-6) || "—"}</span>
                    <div className="w-1 h-1 rounded-full bg-brand-gold/30" />
                    <span>via {selectedRes.channel}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* EXPÉRIENCE & DATES */}
                  <div className="p-6 border border-border-primary bg-text-primary/[0.01]">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar size={16} className="text-brand-gold" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/60">Détails de l'Expérience</span>
                    </div>
                    <p className="text-2xl font-serif mb-6 text-brand-gold">{displayTitle(selectedRes)}</p>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-start border-b border-border-primary/10 pb-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-2">Durée du Séjour</p>
                          <div className="space-y-1">
                             <p className="text-sm font-medium">Début : {selectedRes.date}</p>
                             <p className="text-sm font-medium text-brand-gold/80">Fin : {selectedRes.end_date || selectedRes.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-2">Heure</p>
                          <p className="text-base font-serif">{selectedRes.time}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-1">Passagers</p>
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-brand-gold" />
                            <span className="text-lg font-serif">{selectedRes.people_count || 1} personne{Number(selectedRes.people_count) > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-1">Budget Total</p>
                          <p className="text-brand-gold font-bold text-2xl">
                             {(() => {
                               let price = Number(selectedRes.total_price || 0);
                               if (price === 0) {
                                 const activity = activities.find((a: any) => a.id === selectedRes.activity_id);
                                 if (activity?.price) {
                                   const base = getNumericPrice(activity.price);
                                   const start = new Date(selectedRes.date);
                                   const end = new Date(selectedRes.end_date || selectedRes.date);
                                   const days = Math.max(1, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                                   price = base * days * (selectedRes.people_count || 1);
                                 }
                               }
                               return price.toLocaleString();
                             })()} {isDhActivity(selectedRes) ? "DH" : "€"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IDENTITÉ & CONTACT */}
                  <div className="p-6 border border-border-primary bg-text-primary/[0.01]">
                    <div className="flex items-center gap-3 mb-6">
                      <User size={16} className="text-brand-gold" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/60">Fiche Contact</span>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-1">Pays d'origine</p>
                            <div className="flex items-center gap-2">
                               <span className="text-xl">{COUNTRIES.find(c => c.name === selectedRes.country)?.flag || '🇲🇦'}</span>
                               <span className="text-sm font-serif italic text-brand-gold">{selectedRes.country || 'Maroc'}</span>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-1">Mobile</p>
                            <div className="flex items-center gap-2 text-sm">
                               <Phone size={12} className="text-brand-gold" />
                               <span>{selectedRes.phone_code ? `${selectedRes.phone_code} ${selectedRes.phone}` : selectedRes.phone || 'Non renseigné'}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border-primary/10">
                        <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-1">Adresse Email</p>
                        <div className="flex items-center gap-2 text-sm group">
                          <Mail size={14} className="text-brand-gold/40 group-hover:text-brand-gold transition-colors" />
                          <span className="font-light">{selectedRes.email || 'Email non communiqué'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MESSAGES & NOTES */}
                  <div className="p-6 border border-border-primary bg-text-primary/[0.01]">
                    <div className="flex items-center gap-3 mb-6">
                      <MessageCircle size={16} className="text-brand-gold" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/60">Demandes Particulières</span>
                    </div>
                    <div className="bg-text-primary/5 p-5 border-l-2 border-brand-gold italic">
                      <p className="text-sm font-light leading-relaxed text-text-primary/90">
                        "{selectedRes.message || "Aucune note particulière spécifiée pour cette expérience."}"
                      </p>
                    </div>
                  </div>

                  {/* PREUVE DE VIREMENT */}
                  {selectedRes.receipt_base64 && (
                    <div className="p-6 border border-brand-gold/30 bg-brand-gold/5 relative overflow-hidden group">
                      <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                         <FileText size={100} />
                      </div>
                      <div className="relative z-10 text-center">
                        <div className="flex items-center justify-center gap-3 mb-6 text-brand-gold">
                          <ShieldCheck size={20} />
                          <span className="text-[10px] uppercase font-black tracking-[0.2em]">Paiement à Valider</span>
                        </div>
                        
                        {selectedRes.receipt_base64.startsWith('data:image') && (
                          <div className="mb-6 rounded overflow-hidden shadow-2xl border border-white/10 mx-auto max-w-[200px]">
                            <img src={selectedRes.receipt_base64} alt="Preuve" className="w-full h-auto cursor-zoom-in hover:scale-110 transition-transform duration-700" onClick={() => window.open(selectedRes.receipt_base64)} />
                          </div>
                        )}

                        <button 
                          onClick={() => {
                            const win = window.open();
                            if (win) {
                              win.document.write(`
                                <html>
                                  <head>
                                    <title>Reçu de virement - ${selectedRes.name ?? "Client"}</title>
                                    <style>
                                      body { margin: 0; background: #0a0a0a; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: white; }
                                      .container { text-align: center; max-width: 90%; }
                                      img { max-width: 100%; max-height: 85vh; border: 1px solid #E5A93A; box-shadow: 0 0 50px rgba(229,169,58,0.2); margin-top: 20px; }
                                      iframe { width: 100%; height: 90vh; border: none; }
                                      .header { font-size: 10px; text-transform: uppercase; letter-spacing: 5px; color: #E5A93A; }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="container">
                                      <div class="header">Casa Privilege • Preuve de Paiement VIP</div>
                                      ${selectedRes.receipt_base64.startsWith('data:application/pdf') 
                                        ? `<iframe src="${selectedRes.receipt_base64}"></iframe>`
                                        : `<img src="${selectedRes.receipt_base64}" />`
                                      }
                                    </div>
                                  </body>
                                </html>
                              `);
                            }
                          }}
                          className="w-full py-4 bg-brand-gold text-brand-black text-[10px] uppercase font-black tracking-[0.2em] hover:bg-white transition-all duration-500 shadow-xl"
                        >
                          Visualiser Plein Écran
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-10 border-t border-border-primary bg-text-primary/[0.01] flex gap-4">
                <button
                  onClick={() => updateReservationStatus(selectedRes.id, 'confirmed')}
                  disabled={selectedRes.status === 'confirmed'}
                  className="flex-grow py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-700 uppercase tracking-[0.3em] text-[10px] font-bold disabled:opacity-20"
                >
                  {selectedRes.status === 'confirmed' ? 'Réservation Confirmée' : 'Confirmer la Demande'}
                </button>
                <button
                  onClick={() => {
                    const activityPrice = selectedRes.total_price ? `\n*Budget :* ${selectedRes.total_price.toLocaleString()} DH` : '';
                    const msg = `✨ *Bonjour ${selectedRes.name ?? "Client"},* \n\nC'est la Conciergerie Casa Privilege.\nSuite à votre réservation pour *${displayTitle(selectedRes)}* prévue du ${selectedRes.date ?? "—"} au ${selectedRes.end_date || selectedRes.date || "—"}...\n${activityPrice}\n\nComment pouvons-nous vous assister ?`;
                    window.open(`https://wa.me/${(selectedRes.phone_code || '') + (selectedRes.phone || selectedRes.contact)}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="w-16 h-16 flex items-center justify-center border border-border-primary hover:border-brand-gold text-text-primary/40 hover:text-brand-gold transition-all"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
