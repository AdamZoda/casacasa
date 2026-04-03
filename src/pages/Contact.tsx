import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Upload, CheckCircle2 } from "lucide-react";

export function Contact() {
  const [method, setMethod] = useState<'selection' | 'upload' | 'success'>('selection');
  const [formData, setFormData] = useState({ name: '', service: '', message: '' });

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Bonjour, je souhaite réserver un service avec Casa Privilege.");
    window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
  };

  const handleUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate upload to backend
    setMethod('success');
    setTimeout(() => {
      setMethod('selection');
      setFormData({ name: '', service: '', message: '' });
    }, 3000);
  };

  return (
    <div className="pt-40 pb-24 px-6 max-w-3xl mx-auto w-full min-h-screen flex flex-col justify-center">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl mb-6 font-serif"
        >
          Private Reservation
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-brand-gold font-light tracking-widest uppercase text-sm"
        >
          Secure your exclusive experience
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-bg-primary text-text-primary border border-border-primary p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {method === 'selection' && (
            <motion.div 
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-8"
            >
              <div className="text-center mb-4">
                <h3 className="text-2xl font-serif mb-2">Payment & Contact</h3>
                <p className="text-text-primary/60 font-light text-sm">Choose your preferred method</p>
              </div>

              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-4 w-full py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-colors duration-500 group"
              >
                <MessageCircle size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
                <span className="uppercase tracking-widest text-sm font-medium">Pay via Concierge (WhatsApp)</span>
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-border-primary"></div>
                <span className="flex-shrink-0 mx-6 text-text-primary/60 text-xs uppercase tracking-[0.2em]">Or offline payment</span>
                <div className="flex-grow border-t border-border-primary"></div>
              </div>

              <button
                onClick={() => setMethod('upload')}
                className="flex items-center justify-center gap-4 w-full py-5 border border-border-primary text-text-primary hover:border-brand-gold hover:text-brand-gold transition-colors duration-500 group"
              >
                <Upload size={24} strokeWidth={1} className="group-hover:-translate-y-1 transition-transform duration-500" />
                <span className="uppercase tracking-widest text-sm font-light">Upload Receipt Form</span>
              </button>
            </motion.div>
          )}

          {method === 'upload' && (
            <motion.form 
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleUploadSubmit} 
              className="flex flex-col gap-8"
            >
              <div className="text-center mb-4">
                <h3 className="text-2xl font-serif mb-2">Secure Upload</h3>
                <p className="text-text-primary/60 font-light text-sm">Submit your transfer confirmation</p>
              </div>

              <div className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg"
                />
                <input 
                  type="text" 
                  placeholder="Service Requested" 
                  required
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg"
                />
                
                <div className="relative border border-dashed border-border-primary py-12 text-center hover:border-brand-gold transition-colors cursor-pointer group bg-bg-primary/30 mt-4">
                  <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload size={32} strokeWidth={1} className="mx-auto mb-4 text-text-primary/60 group-hover:text-brand-gold transition-colors" />
                  <span className="text-sm text-text-primary/60 font-light group-hover:text-text-primary transition-colors uppercase tracking-widest">Click to upload receipt image</span>
                </div>

                <textarea 
                  placeholder="Additional Message (Optional)" 
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-border-primary py-4 text-text-primary focus:outline-none focus:border-brand-gold transition-colors font-light text-lg resize-none"
                />
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <button
                  type="submit"
                  className="w-full py-5 bg-text-primary text-bg-primary hover:bg-brand-gold hover:text-brand-black transition-colors duration-500 uppercase tracking-widest text-sm font-medium"
                >
                  Submit Request
                </button>
                
                <button
                  type="button"
                  onClick={() => setMethod('selection')}
                  className="text-text-primary/60 text-xs uppercase tracking-[0.2em] hover:text-text-primary transition-colors text-center py-4"
                >
                  ← Back to options
                </button>
              </div>
            </motion.form>
          )}

          {method === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <CheckCircle2 size={80} strokeWidth={1} className="text-brand-gold mb-8" />
              </motion.div>
              <h3 className="text-3xl font-serif mb-4">Request Received</h3>
              <p className="text-text-primary/60 font-light text-lg">Our concierge team will contact you shortly.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
