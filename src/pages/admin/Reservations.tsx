import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Check, X, MessageCircle, Trash2, Calendar, User, Phone, Mail, ArrowRight, ShieldCheck, Clock, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Reservations() {
  const { reservations, updateReservationStatus, deleteReservation } = useAppContext();
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
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Client</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Experience</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Schedule</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {reservations.map(res => (
              <tr 
                key={res.id} 
                onClick={() => setSelectedRes(res)}
                className="group hover:bg-brand-gold/[0.03] transition-all duration-500 cursor-pointer"
              >
                <td className="p-6">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-text-primary text-bg-primary flex items-center justify-center text-xs font-bold rounded-sm group-hover:bg-brand-gold transition-colors duration-500">
                      {res.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-serif group-hover:text-brand-gold transition-colors">{res.name}</p>
                      <p className="text-[10px] text-text-primary/30 uppercase tracking-tighter mt-1">{res.contact}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-sm font-medium tracking-tight">{res.activityTitle}</p>
                  <div className="flex items-center gap-2 mt-2 opacity-60">
                    <div className={`w-1 h-1 rounded-full ${res.channel === 'whatsapp' ? 'bg-green-500' : 'bg-brand-gold'}`} />
                    <span className="text-[9px] uppercase tracking-widest">via {res.channel}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="opacity-20" />
                    <span>{res.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-text-primary/30 mt-2">
                    <Clock size={12} />
                    <span>{res.time}</span>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border ${
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
            ))}
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
                <div className="text-center">
                  <div className="w-24 h-24 bg-brand-gold text-brand-black text-3xl font-serif flex items-center justify-center rounded-sm mx-auto mb-6 shadow-xl">
                    {selectedRes.name[0]}
                  </div>
                  <h3 className="text-3xl font-serif mb-2">{selectedRes.name}</h3>
                  <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-text-primary/40 font-medium">
                    <span>#{selectedRes.id.slice(-6)}</span>
                    <div className="w-1 h-1 rounded-full bg-brand-gold/30" />
                    <span>Member Privilege</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="p-6 border border-border-primary bg-text-primary/[0.01]">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar size={16} className="text-brand-gold" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/60">Experience Details</span>
                    </div>
                    <p className="text-xl font-serif mb-2">{selectedRes.activityTitle}</p>
                    <div className="flex justify-between items-end mt-6">
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-1">Scheduled For</p>
                        <p className="text-sm">{selectedRes.date} at {selectedRes.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest text-text-primary/30 mb-1">Channel</p>
                        <p className="text-sm capitalize italic">via {selectedRes.channel}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-border-primary bg-text-primary/[0.01]">
                    <div className="flex items-center gap-3 mb-6">
                      <User size={16} className="text-brand-gold" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/60">Contact Information</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between group">
                        <Mail size={14} className="text-text-primary/30" />
                        <span className="text-sm font-light">{selectedRes.contact}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Phone size={14} className="text-text-primary/30" />
                        <span className="text-sm font-light">{selectedRes.phone || 'Non renseigné'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-border-primary bg-text-primary/[0.01]">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText size={16} className="text-brand-gold" />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-primary/60">Guest Requests</span>
                    </div>
                    <p className="text-sm font-light italic leading-relaxed text-text-primary/70">
                      {selectedRes.notes || "Aucune note particulière pour cette réservation."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-10 border-t border-border-primary bg-text-primary/[0.01] flex gap-4">
                <button
                  onClick={() => updateReservationStatus(selectedRes.id, 'confirmed')}
                  disabled={selectedRes.status === 'confirmed'}
                  className="flex-grow py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-all duration-700 uppercase tracking-[0.3em] text-[10px] font-bold disabled:opacity-20"
                >
                  Confirm Project
                </button>
                <button
                  onClick={() => {
                    const msg = `Bonjour ${selectedRes.name}, concernant votre réservation pour ${selectedRes.activityTitle}...`;
                    window.open(`https://wa.me/${selectedRes.phone || ''}?text=${encodeURIComponent(msg)}`, '_blank');
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
