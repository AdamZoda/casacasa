import React from 'react';
import { useAppContext } from "../../context/AppContext";
import { Mail, Trash2, Calendar, Download, Send } from "lucide-react";

export function NewsletterManager() {
  const { subscribers, unsubscribeNewsletter } = useAppContext();

  const exportSubscribers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed At\n"
      + subscribers.map(s => `${s.email},${s.subscribedAt}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Newsletter Subscribers</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">Manage your email marketing list</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={exportSubscribers}
            className="bg-text-primary/5 text-text-primary px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-black transition-all flex items-center gap-3"
          >
            <Download size={18} /> Export CSV
          </button>
          <button 
            className="bg-brand-gold text-brand-black px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-text-primary hover:text-bg-primary transition-all flex items-center gap-3"
          >
            <Send size={18} /> Send Campaign
          </button>
        </div>
      </div>

      <div className="bg-bg-primary border border-border-primary overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-text-primary/5 border-b border-border-primary">
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Email Address</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Subscribed At</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-text-primary/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                      <Mail size={18} />
                    </div>
                    <span className="text-sm font-medium">{subscriber.email}</span>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2 text-sm text-text-primary/50">
                    <Calendar size={14} />
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-green-500/10 text-green-500">
                    Active
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => unsubscribeNewsletter(subscriber.id)}
                      className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-all"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-24 text-center text-text-primary/20 italic text-sm">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
