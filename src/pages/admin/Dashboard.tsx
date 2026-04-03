import { useAppContext } from "../../context/AppContext";
import { Users, Calendar, TrendingUp, Activity, ShoppingBag, FileText, ArrowUpRight, Clock, Mail } from "lucide-react";

export function Dashboard() {
  const { reservations, products, universes, activities, journalPosts, subscribers } = useAppContext();
  
  const stats = [
    { label: "Total Revenue", value: "€142,500", icon: TrendingUp, trend: "+12.5%", color: "text-green-500" },
    { label: "Active Bookings", value: reservations.length, icon: Calendar, trend: "+3", color: "text-brand-gold" },
    { label: "Subscribers", value: subscribers.length, icon: Mail, trend: "New", color: "text-blue-500" },
    { label: "Experiences", value: activities.length, icon: Activity, trend: "+2", color: "text-purple-500" },
  ];

  const recentReservations = reservations.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Dashboard Overview</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">Real-time performance and management</p>
        </div>
        <div className="flex items-center gap-2 text-text-primary/40 text-xs uppercase tracking-widest">
          <Clock size={14} /> Last updated: Just now
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-bg-primary border border-border-primary p-8 hover:border-brand-gold/30 transition-all duration-500 group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 bg-text-primary/5 rounded-none ${stat.color}`}>
                <stat.icon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                {stat.trend} <ArrowUpRight size={12} />
              </span>
            </div>
            <p className="text-xs text-text-primary/40 uppercase tracking-widest mb-2">{stat.label}</p>
            <h3 className="text-4xl font-serif text-text-primary">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-bg-primary border border-border-primary p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif">Recent Reservations</h3>
            <button className="text-[10px] uppercase tracking-widest text-brand-gold hover:text-text-primary transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {recentReservations.map(res => (
              <div key={res.id} className="flex justify-between items-center p-4 bg-text-primary/5 border border-transparent hover:border-border-primary transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">{res.name}</p>
                    <p className="text-text-primary/60 text-[10px] uppercase tracking-widest">{res.activityTitle} • {res.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${
                    res.status === 'confirmed' ? 'bg-green-500/10 text-green-500' : 
                    res.status === 'cancelled' ? 'bg-red-500/10 text-red-500' : 
                    'bg-brand-gold/10 text-brand-gold'
                  }`}>
                    {res.status}
                  </span>
                </div>
              </div>
            ))}
            {recentReservations.length === 0 && (
              <div className="text-center py-12 text-text-primary/20 italic text-sm">No recent reservations</div>
            )}
          </div>
        </div>

        <div className="bg-bg-primary border border-border-primary p-8">
          <h3 className="text-xl font-serif mb-8">Content Summary</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-brand-gold" />
                <span className="text-sm uppercase tracking-widest">Journal Posts</span>
              </div>
              <span className="text-xl font-serif">{journalPosts.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-brand-gold" />
                <span className="text-sm uppercase tracking-widest">Total Users</span>
              </div>
              <span className="text-xl font-serif">1,248</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-brand-gold" />
                <span className="text-sm uppercase tracking-widest">Store Products</span>
              </div>
              <span className="text-xl font-serif">{products.length}</span>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border-primary">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-text-primary/40 mb-6">System Status</h4>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All Systems Operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
