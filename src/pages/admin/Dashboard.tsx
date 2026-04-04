import { useMemo } from "react";
import { useAppContext } from "../../context/AppContext";
import { Users, Calendar, TrendingUp, ShoppingBag, FileText, Clock, Mail, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "../../components/admin/adminShared";

export function Dashboard() {
  const { reservations, products, orders, journalPosts, subscribers, profiles } = useAppContext();

  const { stats, recentReservations, recentOrders } = useMemo(() => {
    const br = reservations
      .filter((res) => res.status === "confirmed")
      .reduce((acc, res) => acc + (Number(res.total_price) || 0), 0);
    const or = orders
      .filter((o) => o.status === "completed" || o.status === "pending")
      .reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const totalRevenue = br + or;
    const st = [
      { label: "Chiffre d'affaires (estim.)", value: `${totalRevenue.toLocaleString("fr-FR")} MAD`, icon: TrendingUp, color: "text-brand-gold" },
      { label: "Commandes boutique", value: orders.length, icon: Package, color: "text-blue-500" },
      { label: "Réservations", value: reservations.length, icon: Calendar, color: "text-green-500" },
      { label: "Profils", value: profiles.length, icon: Users, color: "text-purple-500" },
    ];
    const rr = [...reservations]
      .sort((a, b) => {
        const ta = Date.parse(a.created_at) || 0;
        const tb = Date.parse(b.created_at) || 0;
        return tb - ta;
      })
      .slice(0, 4);
    const ro = [...orders]
      .sort((a, b) => {
        const ta = Date.parse(a.created_at) || 0;
        const tb = Date.parse(b.created_at) || 0;
        return tb - ta;
      })
      .slice(0, 4);
    return {
      stats: st,
      recentReservations: rr,
      recentOrders: ro,
    };
  }, [reservations, orders, profiles.length]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <AdminPageHeader
          kicker="Vue d’ensemble"
          title="Tableau de bord"
          subtitle="Indicateurs consolidés (données chargées depuis Supabase)"
        />
        <div className="flex items-center gap-2 text-text-primary/40 text-[10px] uppercase tracking-widest font-black italic shrink-0">
          <Clock size={14} aria-hidden /> Session locale
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-bg-primary border border-border-primary p-8 md:p-10 hover:border-brand-gold/30 transition-all duration-700 group">
            <div className="flex justify-between items-start mb-10">
              <div className={`p-4 bg-text-primary/5 rounded-full ${stat.color} border border-transparent group-hover:border-current/20 transition-all`}>
                <stat.icon size={24} strokeWidth={1} />
              </div>
            </div>
            <p className="text-[9px] text-text-primary/40 uppercase tracking-[0.3em] font-black mb-3">{stat.label}</p>
            <h3 className="text-4xl font-serif text-text-primary tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Recent Reservations */}
        <div className="bg-bg-primary border border-border-primary p-10 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-serif italic">Réservations Récentes</h3>
            <Link to="/admin/reservations" className="text-[9px] uppercase tracking-widest font-black text-brand-gold hover:text-text-primary transition-colors border-b border-brand-gold/20 pb-1">Voir TOUT</Link>
          </div>
          <div className="space-y-6 flex-grow">
            {recentReservations.map(res => (
              <div key={res.id} className="flex justify-between items-center p-6 bg-text-primary/[0.02] border border-transparent hover:border-border-primary/40 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-brand-gold/10 flex items-center justify-center text-brand-gold rounded-full border border-brand-gold/20">
                    <Calendar size={20} strokeWidth={1} />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium text-lg leading-none mb-2">{res.name ?? "—"}</p>
                    <p className="text-text-primary/40 text-[9px] uppercase tracking-widest font-bold italic">
                      {(res.activity_title && String(res.activity_title)) || "Activité"} • {res.date ?? "—"}
                    </p>
                  </div>
                </div>
                <span className={`text-[8px] uppercase tracking-widest font-black px-4 py-2 rounded-full border ${
                    res.status === 'confirmed' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 
                    res.status === 'cancelled' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 
                    'border-brand-gold/20 text-brand-gold bg-brand-gold/5'
                }`}>
                  {res.status}
                </span>
              </div>
            ))}
            {recentReservations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                 <Calendar size={40} strokeWidth={0.5} className="mb-4" />
                 <p className="text-sm italic tracking-widest">Aucune activité récente</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-bg-primary border border-border-primary p-10 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-serif italic">Commandes Boutique</h3>
            <Link to="/admin/boutique" className="text-[9px] uppercase tracking-widest font-black text-brand-gold hover:text-text-primary transition-colors border-b border-brand-gold/20 pb-1">Voir boutique</Link>
          </div>
          <div className="space-y-6 flex-grow">
            {recentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center p-6 bg-text-primary/[0.02] border border-transparent hover:border-border-primary/40 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center text-blue-500 rounded-full border border-blue-500/20">
                    <Package size={20} strokeWidth={1} />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium text-lg leading-none mb-2">{order.customer_name ?? "—"}</p>
                    <p className="text-text-primary/40 text-[9px] uppercase tracking-widest font-bold italic">
                      {Array.isArray(order.items) ? order.items.length : 0} article(s) • {Number(order.total || 0).toLocaleString("fr-FR")} €
                    </p>
                  </div>
                </div>
                <span className={`text-[8px] uppercase tracking-widest font-black px-4 py-2 rounded-full border ${
                    order.status === 'completed' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 
                    order.status === 'cancelled' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 
                    'border-brand-gold/20 text-brand-gold bg-brand-gold/5'
                }`}>
                  {order.status}
                </span>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-20">
                 <Package size={40} strokeWidth={0.5} className="mb-4" />
                 <p className="text-sm italic tracking-widest">Le showroom est calme...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Summary Row */}
      <div className="bg-bg-primary border border-border-primary p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <FileText size={20} className="text-brand-gold" strokeWidth={1} />
                   <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Éditorial (Journal)</h4>
                </div>
                <p className="text-4xl font-serif">{journalPosts.length} <span className="text-sm font-sans font-light uppercase tracking-widest text-text-primary/30">articles publiés</span></p>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <Mail size={20} className="text-brand-gold" strokeWidth={1} />
                   <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Cercle Privilège</h4>
                </div>
                <p className="text-4xl font-serif">{subscribers.length} <span className="text-sm font-sans font-light uppercase tracking-widest text-text-primary/30">abonnés VIP</span></p>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                   <ShoppingBag size={20} className="text-brand-gold" strokeWidth={1} />
                   <h4 className="text-[10px] uppercase tracking-[0.4em] font-black">Showroom Boutique</h4>
                </div>
                <p className="text-4xl font-serif">{products.length} <span className="text-sm font-sans font-light uppercase tracking-widest text-text-primary/30">références</span></p>
            </div>
          </div>
          <div className="mt-16 pt-10 border-t border-border-primary/50 flex justify-between items-center">
             <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.5em] font-black text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                Global Network Operational
             </div>
             <p className="text-[9px] uppercase tracking-widest font-black text-text-primary/10 italic">Système de Haute Sécurité Casa Privilege</p>
          </div>
      </div>
    </div>
  );
}
