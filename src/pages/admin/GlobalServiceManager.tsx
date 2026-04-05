import React, { useState, useRef } from "react";
import { useAppContext, type GlobalService } from "../../context/AppContext";
import { uploadImage } from "../../lib/storage";
import { Pencil, Plus, Trash2, Image as ImageIcon, X, ExternalLink, Globe, Upload, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function ServiceHeroImage({ src, alt }: { src?: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);
  const ok = Boolean(String(src ?? "").trim()) && !failed;
  return (
    <div className="aspect-[16/9] relative overflow-hidden bg-text-primary/5">
      {ok ? (
        <img
          src={src!}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-text-primary/30 bg-text-primary/[0.07]" aria-hidden>
          <Globe size={48} strokeWidth={1} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-60 pointer-events-none" />
    </div>
  );
}

export function GlobalServiceManager() {
  const { globalServices, addGlobalService, updateGlobalService, deleteGlobalService } = useAppContext();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<GlobalService | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = (service: GlobalService) => {
    setIsEditing(service.id);
    setEditForm({ ...service });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isForEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImage(file);

      if (isForEdit) {
        setEditForm((prev) => (prev ? { ...prev, image: publicUrl } : prev));
      } else {
        const imgInput = document.getElementById("add-service-image") as HTMLInputElement;
        if (imgInput) imgInput.value = publicUrl;
      }
    } catch (error: unknown) {
      alert("Erreur lors de l’envoi de l’image : " + (error as Error).message);
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
    const newService: GlobalService = {
      id: `gs-${Date.now()}`,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: (document.getElementById("add-service-image") as HTMLInputElement)?.value || (formData.get("image") as string),
      link: formData.get("link") as string,
    };
    await addGlobalService(newService);
    setShowAddForm(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
        <div className="space-y-3 min-w-0">
          <div className="flex items-center gap-3 text-brand-gold">
            <Sparkles size={16} aria-hidden />
            <span className="text-[10px] uppercase font-bold tracking-[0.35em]">Gestion des services</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-text-primary">Excellence sur mesure</h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="shrink-0 flex items-center justify-center gap-3 px-6 py-3.5 md:px-8 md:py-4 rounded-lg bg-text-primary text-bg-primary hover:bg-brand-gold transition-all duration-500 text-[10px] uppercase font-bold tracking-widest"
        >
          <Plus size={14} aria-hidden /> Ajouter un service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {globalServices.map((service) => (
          <motion.div
            key={service.id}
            layout
            className="group relative admin-card overflow-hidden hover:border-brand-gold/30 transition-all duration-500 shadow-xl"
          >
            <ServiceHeroImage key={`${service.id}-${service.image}`} src={service.image} alt={service.title} />

            <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[5]">
              <button
                type="button"
                onClick={() => handleEdit(service)}
                className="p-3 rounded-lg bg-bg-primary/90 backdrop-blur-md text-text-primary hover:text-brand-gold transition-colors shadow-lg"
                title="Modifier"
                aria-label={`Modifier ${service.title}`}
              >
                <Pencil size={16} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Supprimer « ${service.title} » ?`)) deleteGlobalService(service.id);
                }}
                className="p-3 rounded-lg bg-bg-primary/90 backdrop-blur-md text-text-primary hover:text-red-500 transition-colors shadow-lg"
                title="Supprimer"
                aria-label={`Supprimer ${service.title}`}
              >
                <Trash2 size={16} aria-hidden />
              </button>
            </div>

            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-2xl font-serif text-text-primary min-w-0">{service.title}</h3>
                <Globe size={16} className="text-brand-gold/40 shrink-0" aria-hidden />
              </div>
              <p className="text-sm text-text-primary/60 font-light leading-relaxed min-h-[60px]">{service.description}</p>
              <div className="pt-4 border-t border-border-primary/50 flex justify-between items-center gap-3">
                <span className="text-[9px] uppercase tracking-widest text-brand-gold font-bold truncate" title={service.link}>
                  Cible : {service.link}
                </span>
                <ExternalLink size={12} className="text-text-primary/20 shrink-0" aria-hidden />
              </div>
            </div>

            <AnimatePresence>
              {isEditing === service.id && editForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-bg-primary/95 backdrop-blur-xl p-8 z-10 flex flex-col justify-between overflow-y-auto"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center gap-4">
                      <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-brand-gold">Modifier le service</h4>
                      <button
                        type="button"
                        onClick={() => setIsEditing(null)}
                        className="p-2 rounded-lg text-text-primary/40 hover:text-text-primary"
                        title="Fermer"
                        aria-label="Fermer l’édition"
                      >
                        <X size={20} aria-hidden />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-text-primary/40 mb-2 block font-bold">Titre</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          className="admin-input w-full p-4 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-text-primary/40 mb-2 block font-bold">Description</label>
                        <textarea
                          rows={3}
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          className="admin-input w-full p-4 text-sm resize-none min-h-[5rem]"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-text-primary/40 mb-2 block font-bold">
                          Image (URL ou envoi)
                        </label>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          <div className="relative flex-grow min-w-0">
                            <input
                              type="text"
                              value={editForm.image}
                              onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                              className="admin-input w-full p-4 pl-12 text-sm"
                            />
                            <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" aria-hidden />
                          </div>
                          <button
                            type="button"
                            onClick={() => editFileInputRef.current?.click()}
                            disabled={isUploading}
                            className="px-4 rounded-lg bg-text-primary text-bg-primary hover:bg-brand-gold transition-colors flex items-center justify-center disabled:opacity-50 shrink-0"
                            title="Envoyer une image"
                            aria-label="Envoyer une image"
                          >
                            {isUploading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Upload size={18} aria-hidden />}
                          </button>
                          <input
                            ref={editFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => void handleFileUpload(e, true)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-text-primary/40 mb-2 block font-bold">
                          Lien de redirection
                        </label>
                        <input
                          type="text"
                          value={editForm.link}
                          onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                          className="admin-input w-full p-4 text-sm"
                          placeholder="/contact"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={() => void handleSave()}
                      className="flex-grow py-4 rounded-lg bg-brand-gold text-brand-black text-[10px] uppercase font-bold tracking-widest hover:bg-text-primary hover:text-bg-primary transition-all duration-500"
                    >
                      Enregistrer
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
              aria-hidden
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative admin-card max-w-xl w-full p-8 md:p-12 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-service-title"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold" aria-hidden />
              <h3 id="add-service-title" className="text-2xl md:text-3xl font-serif mb-8 text-text-primary">
                Nouveau service
              </h3>

              <form onSubmit={(e) => void handleAdd(e)} className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40 mb-3 block font-bold">Titre</label>
                  <input
                    name="title"
                    required
                    className="admin-input w-full p-5 text-sm"
                    placeholder="ex. Retraites bien-être"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40 mb-3 block font-bold">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="admin-input w-full p-5 text-sm min-h-[5rem] resize-y"
                    placeholder="Une expérience sur mesure…"
                  />
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40 mb-3 block font-bold">
                      Image (URL ou envoi)
                    </label>
                    <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <div className="relative flex-grow min-w-0">
                        <input
                          id="add-service-image"
                          name="image"
                          required
                          className="admin-input w-full p-5 text-sm"
                          placeholder="https://…"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-5 rounded-lg bg-text-primary text-bg-primary hover:bg-brand-gold transition-colors flex items-center justify-center disabled:opacity-50 shrink-0"
                        title="Envoyer une image"
                        aria-label="Envoyer une image"
                      >
                        {isUploading ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Upload size={18} aria-hidden />}
                      </button>
                      <input
                        ref={addFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => void handleFileUpload(e, false)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40 mb-3 block font-bold">
                      Lien de redirection
                    </label>
                    <input name="link" required className="admin-input w-full p-5 text-sm" placeholder="/contact" />
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="sm:px-8 py-5 rounded-lg border border-border-primary text-text-primary/60 hover:text-text-primary transition-all text-[10px] uppercase font-bold tracking-widest"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-grow py-5 rounded-lg bg-text-primary text-bg-primary text-[10px] uppercase font-bold tracking-widest hover:bg-brand-gold hover:text-brand-black transition-all duration-500"
                  >
                    Créer le service
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
