import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Upload, CheckCircle2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [method, setMethod] = useState<'selection' | 'upload' | 'success'>('selection');
  const [formData, setFormData] = useState({ name: '', service: '', message: '' });

  const handleWhatsApp = () => {
    const text = encodeURIComponent("Bonjour, je souhaite réserver un service avec Casa Privilege.");
    window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
    onClose();
  };

  const handleUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate upload
    setMethod('success');
    setTimeout(() => {
      onClose();
      setTimeout(() => setMethod('selection'), 500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-black/90 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111] border border-brand-white/10 p-8 z-50 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-brand-gray hover:text-brand-white transition-colors"
            >
              <X size={20} strokeWidth={1} />
            </button>

            {method === 'selection' && (
              <div className="flex flex-col gap-6">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-serif text-brand-white mb-2">Secure Payment</h3>
                  <p className="text-brand-gray font-light text-sm">Choose your preferred method</p>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-brand-white text-brand-black hover:bg-brand-gold transition-colors duration-300"
                >
                  <MessageCircle size={20} strokeWidth={1.5} />
                  <span className="uppercase tracking-widest text-sm font-medium">Pay via Concierge</span>
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-brand-white/10"></div>
                  <span className="flex-shrink-0 mx-4 text-brand-gray text-xs uppercase tracking-widest">Or</span>
                  <div className="flex-grow border-t border-brand-white/10"></div>
                </div>

                <button
                  onClick={() => setMethod('upload')}
                  className="flex items-center justify-center gap-3 w-full py-4 border border-brand-white/20 text-brand-white hover:border-brand-gold hover:text-brand-gold transition-colors duration-300"
                >
                  <Upload size={20} strokeWidth={1} />
                  <span className="uppercase tracking-widest text-sm font-light">Upload Receipt</span>
                </button>
              </div>
            )}

            {method === 'upload' && (
              <form onSubmit={handleUploadSubmit} className="flex flex-col gap-5">
                <div className="text-center mb-2">
                  <h3 className="text-2xl font-serif text-brand-white mb-2">Upload Receipt</h3>
                  <p className="text-brand-gray font-light text-sm">Submit your transfer confirmation</p>
                </div>

                <input 
                  type="text" 
                  placeholder="Full Name" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-brand-white/20 py-3 text-brand-white focus:outline-none focus:border-brand-gold transition-colors font-light"
                />
                <input 
                  type="text" 
                  placeholder="Service Requested" 
                  required
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                  className="w-full bg-transparent border-b border-brand-white/20 py-3 text-brand-white focus:outline-none focus:border-brand-gold transition-colors font-light"
                />
                
                <div className="relative border border-dashed border-brand-white/20 py-8 text-center hover:border-brand-gold transition-colors cursor-pointer group">
                  <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload size={24} strokeWidth={1} className="mx-auto mb-2 text-brand-gray group-hover:text-brand-gold transition-colors" />
                  <span className="text-sm text-brand-gray font-light group-hover:text-brand-white transition-colors">Click to upload image</span>
                </div>

                <textarea 
                  placeholder="Additional Message (Optional)" 
                  rows={2}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-transparent border-b border-brand-white/20 py-3 text-brand-white focus:outline-none focus:border-brand-gold transition-colors font-light resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-4 mt-4 bg-brand-white text-brand-black hover:bg-brand-gold transition-colors duration-300 uppercase tracking-widest text-sm font-medium"
                >
                  Submit Receipt
                </button>
                
                <button
                  type="button"
                  onClick={() => setMethod('selection')}
                  className="text-brand-gray text-xs uppercase tracking-widest hover:text-brand-white transition-colors text-center mt-2"
                >
                  Back
                </button>
              </form>
            )}

            {method === 'success' && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <CheckCircle2 size={64} strokeWidth={1} className="text-brand-gold mb-6" />
                </motion.div>
                <h3 className="text-2xl font-serif text-brand-white mb-2">Received</h3>
                <p className="text-brand-gray font-light">Our concierge will contact you shortly.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
