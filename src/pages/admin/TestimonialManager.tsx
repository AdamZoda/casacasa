import React, { useState } from 'react';
import { useAppContext } from "../../context/AppContext";
import { Star, Trash2, CheckCircle, XCircle, MessageSquare, User } from "lucide-react";

export function TestimonialManager() {
  const { testimonials, updateTestimonial, deleteTestimonial } = useAppContext();

  const toggleApproval = (id: string) => {
    const testimonial = testimonials.find(t => t.id === id);
    if (testimonial) {
      updateTestimonial({ ...testimonial, isApproved: !testimonial.isApproved });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Testimonials</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">Manage client reviews and feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-bg-primary border border-border-primary p-8 space-y-6 group hover:border-brand-gold/30 transition-all duration-500">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-text-primary/5 border border-border-primary flex items-center justify-center text-brand-gold">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{t.name}</h4>
                  <p className="text-[10px] text-text-primary/40 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={i < t.rating ? "fill-brand-gold text-brand-gold" : "text-text-primary/10"} 
                  />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-text-primary/60 italic leading-relaxed">"{t.content}"</p>
            
            <div className="pt-6 border-t border-border-primary flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${
                  t.isApproved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {t.isApproved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleApproval(t.id)}
                  className={`p-2 rounded transition-all ${
                    t.isApproved ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'
                  }`}
                  title={t.isApproved ? "Unapprove" : "Approve"}
                >
                  {t.isApproved ? <XCircle size={16} /> : <CheckCircle size={16} />}
                </button>
                <button 
                  onClick={() => deleteTestimonial(t.id)}
                  className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded transition-all"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-full p-24 text-center text-text-primary/20 italic text-sm border border-dashed border-border-primary">
            No testimonials found.
          </div>
        )}
      </div>
    </div>
  );
}
