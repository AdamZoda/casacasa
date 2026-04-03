import { useAppContext } from "../../context/AppContext";
import { Check, X, MessageCircle, Trash2, Calendar, User, Phone, Mail } from "lucide-react";

export function Reservations() {
  const { reservations, updateReservationStatus, deleteReservation } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Reservations Management</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">Manage client bookings and requests</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-bg-primary border border-border-primary px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-text-primary/60">
            Total: {reservations.length}
          </div>
        </div>
      </div>

      <div className="bg-bg-primary border border-border-primary overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-text-primary/5 border-b border-border-primary">
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Client</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Experience</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Date & Time</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {reservations.map(res => (
              <tr key={res.id} className="hover:bg-text-primary/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-gold/10 flex items-center justify-center text-brand-gold text-[10px] font-bold">
                      {res.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{res.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-text-primary/30 uppercase tracking-widest flex items-center gap-1">
                          <Mail size={10} /> {res.contact}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-sm font-medium">{res.activityTitle}</p>
                  <p className="text-[10px] text-brand-gold uppercase tracking-widest mt-1 flex items-center gap-1">
                    {res.channel === 'whatsapp' ? <MessageCircle size={10} /> : <Calendar size={10} />}
                    via {res.channel}
                  </p>
                </td>
                <td className="p-6">
                  <p className="text-sm">{res.date}</p>
                  <p className="text-[10px] text-text-primary/30 uppercase tracking-widest mt-1">{res.time}</p>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${
                    res.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 
                    res.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                    'bg-brand-gold/10 text-brand-gold'
                  }`}>
                    {res.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {res.status === 'pending' && (
                      <button 
                        onClick={() => updateReservationStatus(res.id, 'confirmed')}
                        className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                        title="Confirm"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {res.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateReservationStatus(res.id, 'cancelled')}
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteReservation(res.id)}
                      className="p-2 bg-text-primary/5 text-text-primary/30 hover:text-red-500 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={5} className="p-24 text-center text-text-primary/20 italic text-sm">
                  No reservations found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
