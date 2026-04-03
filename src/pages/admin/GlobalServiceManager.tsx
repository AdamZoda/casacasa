import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { uploadImage } from '../../lib/storage';
import { Edit2, Plus, Trash2, Image as ImageIcon, Save, X, ExternalLink, Globe, Upload, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function GlobalServiceManager() {
  const { globalServices, addGlobalService, updateGlobalService, deleteGlobalService } = useAppContext();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (service: any) => {
    setIsEditing(service.id);
    setEditForm({ ...service });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isForEdit: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImage(file);

      if (isForEdit) {
        setEditForm({ ...editForm, image: publicUrl });
      } else {
        const imgInput = document.getElementById('add-service-image') as HTMLInputElement;
        if (imgInput) imgInput.value = publicUrl;
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (editForm) {
      await updateGlobalService(editForm);
      setIsEditing(null);
      setEditForm(null);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newService = {
      id: `gs-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image: (document.getElementById('add-service-image') as HTMLInputElement)?.value || formData.get('image') as string,
      link: formData.get('link') as string,
    };
    await addGlobalService(newService);
    setShowAddForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-brand-gold">
            <Sparkles size={16} />
            <span className="text-[10px] uppercase font-bold tracking-[0.4em]">Service Management</span>
          </div>
          <h2 className="text-4xl font-serif text-text-primary">Excellence Sur Mesure</h2>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-3 px-8 py-4 bg-text-primary text-bg-primary hover:bg-brand-gold transition-all duration-500 text-[10px] uppercase font-bold tracking-widest"
        >
          <Plus size={14} /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {globalServices.map((service) => (
          <motion.div 
            key={service.id}
            layout
            className="group relative bg-bg-primary border border-border-primary overflow-hidden hover:border-brand-gold/30 transition-all duration-500 shadow-xl"
          >
            <div className="aspect-[16/9] relative overflow-hidden bg-text-primary/5">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-60" />
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button 
                  onClick={() => handleEdit(service)}
                  className="p-3 bg-bg-primary/90 backdrop-blur-md text-text-primary hover:text-brand-gold transition-colors shadow-lg"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => {
                    if(confirm('Delete this service?')) deleteGlobalService(service.id);
                  }}
                  className="p-3 bg-bg-primary/90 backdrop-blur-md text-text-primary hover:text-red-500 transition-colors shadow-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-serif text-text-primary">{service.title}</h3>
                <Globe size={16} className="text-brand-gold/40" />
              </div>
              <p className="text-sm text-text-primary/60 font-light leading-relaxed min-h-[60px]">
                {service.description}
              </p>
              <div className="pt-4 border-t border-border-primary/50 flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold">Route: {service.link}</span>
                <ExternalLink size={12} className="text-text-primary/20" />
              </div>
            </div>

            <AnimatePresence>
              {isEditing === service.id && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl p-8 z-10 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-gold">Editing Service</h4>
                      <button onClick={() => setIsEditing(null)} className="text-text-primary/40 hover:text-text-primary">
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-text-primary/40 mb-2 block font-bold">Service Title</label>
                        <input 
                          type="text"
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                          className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:border-brand-gold outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-text-primary/40 mb-2 block font-bold">Description</label>
                        <textarea 
                          rows={3}
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                          className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:border-brand-gold outline-none transition-colors resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-text-primary/40 mb-2 block font-bold">Image URL or Upload</label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <input 
                              type="text"
                              value={editForm.image}
                              onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                              className="w-full bg-text-primary/5 border border-border-primary p-4 pl-12 text-sm focus:border-brand-gold outline-none transition-colors"
                            />
                            <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" />
                          </div>
                          <button 
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            disabled={isUploading}
                            className="px-4 bg-text-primary text-bg-primary hover:bg-brand-gold transition-colors flex items-center justify-center disabled:opacity-50"
                          >
                            {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                          </button>
                          <input 
                            ref={editFileInputRef}
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, true)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      onClick={handleSave}
                      className="flex-grow py-4 bg-brand-gold text-brand-black text-[10px] uppercase font-bold tracking-widest hover:bg-text-primary hover:text-bg-primary transition-all duration-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-bg-primary border border-border-primary max-w-xl w-full p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold" />
              <h3 className="text-3xl font-serif mb-8 text-text-primary">New Service Integration</h3>
              
              <form onSubmit={handleAdd} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40 mb-3 block font-bold">Service Title</label>
                  <input name="title" required className="w-full bg-text-primary/[0.02] border border-border-primary p-5 text-sm focus:border-brand-gold outline-none transition-colors" placeholder="e.g. Wellness Retreats" />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40 mb-3 block font-bold">Description</label>
                  <textarea name="description" required rows={3} className="w-full bg-text-primary/[0.02] border border-border-primary p-5 text-sm focus:border-brand-gold outline-none transition-colors" placeholder="Bespoke wellness..." />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40 mb-3 block font-bold">Image URL or Upload</label>
                    <div className="flex gap-2">
                      <div className="relative flex-grow">
                        <input id="add-service-image" name="image" required className="w-full bg-text-primary/[0.02] border border-border-primary p-5 text-sm focus:border-brand-gold outline-none transition-colors" placeholder="https://..." />
                      </div>
                      <button 
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-5 bg-text-primary text-bg-primary hover:bg-brand-gold transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                      </button>
                      <input 
                        ref={addFileInputRef}
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, false)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40 mb-3 block font-bold">Redirect Link</label>
                    <input name="link" required className="w-full bg-text-primary/[0.02] border border-border-primary p-5 text-sm focus:border-brand-gold outline-none transition-colors" placeholder="/contact" />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-grow py-5 bg-text-primary text-bg-primary text-[10px] uppercase font-bold tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all duration-500">
                    Confirm Integration
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-5 border border-border-primary text-text-primary/40 hover:text-text-primary transition-all text-[10px] uppercase font-bold tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
