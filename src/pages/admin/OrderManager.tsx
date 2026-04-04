import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Package, Search, Calendar, User, Mail, CreditCard, ChevronDown, CheckCircle2, XCircle, Clock, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function OrderManager() {
  const { orders, updateOrderStatus, deleteOrder } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const q = searchTerm.trim().toLowerCase();

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const name = (order.customer_name ?? '').toLowerCase();
      const email = (order.customer_email ?? '').toLowerCase();
      const id = String(order.id ?? '').toLowerCase();
      const matchesSearch = !q || name.includes(q) || email.includes(q) || id.includes(q);
      const matchesFilter = filter === 'all' || order.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [orders, q, filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-brand-gold bg-brand-gold/10 border-brand-gold/20';
    }
  };

  const statusIcons: Record<string, any> = {
    pending: Clock,
    completed: CheckCircle2,
    cancelled: XCircle
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="h-px w-20 bg-brand-gold mb-8 origin-left" 
          />
          <h1 className="text-4xl font-serif mb-4 flex items-center gap-6">
            Gestion des Commandes Boutique
            <span className="text-sm font-sans font-black bg-brand-gold/10 text-brand-gold px-4 py-1 rounded-full uppercase tracking-widest">
              {orders.length}
            </span>
          </h1>
          <p className="text-text-primary/40 font-light tracking-widest uppercase text-xs italic">
            Suivi des ventes exclusives et logistique de livraison Casa Privilege.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-primary/20 group-focus-within:text-brand-gold transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un client ou une commande..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-16 pr-8 py-5 bg-text-primary/[0.03] border border-border-primary focus:border-brand-gold focus:outline-none transition-all w-[350px] uppercase text-[10px] tracking-widest font-bold"
            />
          </div>
          
          <div className="flex bg-text-primary/[0.03] p-1 border border-border-primary">
            {['all', 'pending', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-4 text-[9px] uppercase tracking-widest font-black transition-all ${
                  filter === f ? 'bg-brand-gold text-brand-black' : 'hover:bg-text-primary/5 text-text-primary/40'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-text-primary/[0.02] border border-border-primary overflow-hidden backdrop-blur-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-primary/50">
              <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/30">Commande</th>
              <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/30">Client</th>
              <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/30">Date</th>
              <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/30">Total</th>
              <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/30">Statut</th>
              <th className="px-10 py-8 text-[10px] uppercase tracking-[0.3em] font-black text-text-primary/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
               <tr>
                 <td colSpan={6} className="px-10 py-32 text-center">
                   <div className="flex flex-col items-center gap-6 opacity-20">
                     <Package size={60} strokeWidth={0.5} />
                     <p className="text-xl font-serif">Aucune commande trouvée</p>
                   </div>
                 </td>
               </tr>
            ) : (
              filteredOrders.map((order, i) => (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border-primary/30 hover:bg-text-primary/[0.03] transition-colors group"
                >
                  <td className="px-10 py-6">
                    <div className="flex flex-col">
                      <span className="font-serif text-lg tracking-tight">#{order.id.split('-')[1]}</span>
                      <span className="text-[9px] uppercase tracking-widest text-text-primary/20">{order.id}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium tracking-wide">{order.customer_name}</span>
                      <span className="text-xs text-text-primary/30 font-light">{order.customer_email}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-text-primary/40 font-light text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-xl font-light text-brand-gold">{order.total.toLocaleString()}€</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className={`inline-flex items-center gap-3 px-5 py-2 border rounded-full text-[9px] uppercase tracking-widest font-black ${getStatusColor(order.status)}`}>
                      {React.createElement(statusIcons[order.status] || Clock, { size: 12 })}
                      {order.status}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 hover:bg-brand-gold/10 text-text-primary/40 hover:text-brand-gold transition-all"
                        title="Voir les détails"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if(confirm('Confirmer la suppression ?')) deleteOrder(order.id);
                        }}
                        className="p-3 hover:bg-red-500/10 text-text-primary/40 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-brand-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-bg-primary border border-border-primary shadow-3xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-12 border-b border-border-primary/50 flex justify-between items-start">
                <div>
                   <p className="text-[10px] tracking-[0.5em] font-black text-brand-gold uppercase mb-4 italic">DÉTAIL DE LA VENTE</p>
                   <h2 className="text-4xl font-serif">Commande #{selectedOrder.id.split('-')[1]}</h2>
                   <p className="text-text-primary/30 text-sm mt-2">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-4 bg-text-primary/5 hover:bg-brand-gold/10 text-text-primary/40 hover:text-brand-gold transition-all"
                >
                  <XCircle size={30} strokeWidth={0.5} />
                </button>
              </div>

              <div className="p-12 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-16">
                 {/* Left: Items */}
                 <div className="space-y-10">
                    <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-text-primary/20 flex items-center gap-4">
                       <Package size={14} /> Articles Commandés
                    </h3>
                    <div className="space-y-6">
                       {selectedOrder.items.map((item: any) => (
                         <div key={item.id} className="flex gap-6 items-center p-6 bg-text-primary/[0.02] border border-border-primary/40">
                            <img src={item.image} alt={item.title} className="w-20 h-20 object-cover" />
                            <div className="flex-grow">
                               <p className="font-serif text-xl mb-1">{item.title}</p>
                               <p className="text-[9px] uppercase tracking-widest text-text-primary/40">{item.category}</p>
                            </div>
                            <div className="text-right">
                               <p className="font-light text-brand-gold">{item.price.toLocaleString()}€</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    
                    <div className="pt-10 border-t border-border-primary/50 flex justify-between items-end">
                       <p className="text-[10px] tracking-widest font-black text-text-primary/20 uppercase">MONTANT TOTAL RÉGLÉ</p>
                       <p className="text-5xl font-serif text-brand-gold">{selectedOrder.total.toLocaleString()}€</p>
                    </div>
                 </div>

                 {/* Right: Customer & Status */}
                 <div className="space-y-12">
                     <div className="space-y-8">
                        <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-text-primary/20 flex items-center gap-4">
                           <User size={14} /> Informations Client
                        </h3>
                        <div className="space-y-6 bg-text-primary/[0.02] p-8 border border-border-primary/40">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                                 <User size={20} />
                              </div>
                              <div>
                                 <p className="text-[10px] tracking-widest font-black text-text-primary/20 uppercase">NOM COMPLET</p>
                                 <p className="text-xl font-serif">{selectedOrder.customer_name}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                                 <Mail size={20} />
                              </div>
                              <div>
                                 <p className="text-[10px] tracking-widest font-black text-text-primary/20 uppercase">ADRESSE EMAIL</p>
                                 <p className="text-xl italic font-light">{selectedOrder.customer_email}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h3 className="text-[11px] font-black tracking-[0.3em] uppercase text-text-primary/20 flex items-center gap-4">
                           <CreditCard size={14} /> Statut de l'Expédition
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                           {['pending', 'completed', 'cancelled'].map((status) => (
                             <button
                               key={status}
                               onClick={() => updateOrderStatus(selectedOrder.id, status as any)}
                               className={`flex items-center justify-between p-6 border transition-all ${
                                 selectedOrder.status === status 
                                   ? 'bg-brand-gold/10 border-brand-gold text-brand-gold shadow-lg shadow-brand-gold/5' 
                                   : 'bg-transparent border-border-primary/40 text-text-primary/30 hover:border-text-primary/20'
                               }`}
                             >
                                <span className="text-[10px] tracking-[0.3em] font-black uppercase text-inherit">{status}</span>
                                {selectedOrder.status === status && <CheckCircle2 size={16} />}
                             </button>
                           ))}
                        </div>
                     </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
