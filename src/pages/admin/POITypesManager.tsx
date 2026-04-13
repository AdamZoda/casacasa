import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  POIType,
  getAllPOITypes,
  createPOIType,
  updatePOIType,
  deletePOIType,
  uploadPOITypeLogo,
} from "../../lib/poiDb";

type FormMode = "create" | "edit" | null;

export function POITypesManager() {
  const [types, setTypes] = useState<POIType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    emoji: "",
    color: "#E5A93A",
    logo_url: "",
    is_active: true,
    sort_order: 0,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    setLoading(true);
    const data = await getAllPOITypes();
    setTypes(data);
    setLoading(false);
  };

  const handleSlugGenerate = () => {
    const slug = formData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = async (typeId: string) => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Veuillez sélectionner une image" });
      return;
    }

    setUploading(true);
    const logoUrl = await uploadPOITypeLogo(selectedFile, typeId);

    if (logoUrl) {
      await updatePOIType(typeId, { logo_url: logoUrl });
      await loadTypes();
      setSelectedFile(null);
      setLogoPreview("");
      setMessage({ type: "success", text: "Logo uploadé avec succès!" });
    } else {
      setMessage({ type: "error", text: "Erreur lors de l'upload du logo" });
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs requis" });
      return;
    }

    try {
      if (formMode === "create") {
        const result = await createPOIType({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          emoji: formData.emoji,
          color: formData.color,
          logo_url: formData.logo_url,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
        });

        if (result) {
          setMessage({ type: "success", text: "Type créé avec succès!" });
          
          // If there's a selected file, upload it now
          if (selectedFile) {
            setUploading(true);
            const logoUrl = await uploadPOITypeLogo(selectedFile, result.id);
            if (logoUrl) {
              await updatePOIType(result.id, { logo_url: logoUrl });
              setSelectedFile(null);
              setLogoPreview("");
              setMessage({ type: "success", text: "Type créé et logo uploadé avec succès!" });
            } else {
              setMessage({ type: "success", text: "Type créé (erreur lors de l'upload du logo)" });
            }
            setUploading(false);
          }
        } else {
          setMessage({ type: "error", text: "Erreur lors de la création" });
        }
      } else if (formMode === "edit" && editingId) {
        const result = await updatePOIType(editingId, {
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          emoji: formData.emoji,
          color: formData.color,
          logo_url: formData.logo_url,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
          updated_at: new Date().toISOString(),
        });

        if (result) {
          setMessage({ type: "success", text: "Type modifié avec succès!" });
          
          // If there's a selected file, upload it now
          if (selectedFile) {
            setUploading(true);
            const logoUrl = await uploadPOITypeLogo(selectedFile, editingId);
            if (logoUrl) {
              await updatePOIType(editingId, { logo_url: logoUrl });
              setSelectedFile(null);
              setLogoPreview("");
              setMessage({ type: "success", text: "Type modifié et logo uploadé avec succès!" });
            } else {
              setMessage({ type: "success", text: "Type modifié (erreur lors de l'upload du logo)" });
            }
            setUploading(false);
          }
        } else {
          setMessage({ type: "error", text: "Erreur lors de la modification" });
        }
      }

      await loadTypes();
      resetForm();
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue" });
    }
  };

  const handleEdit = (type: POIType) => {
    setFormMode("edit");
    setEditingId(type.id);
    setFormData({
      name: type.name,
      slug: type.slug,
      description: type.description || "",
      emoji: type.emoji || "",
      color: type.color || "#E5A93A",
      logo_url: type.logo_url || "",
      is_active: type.is_active,
      sort_order: type.sort_order,
    });
    setLogoPreview(type.logo_url || "");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce type?")) {
      const success = await deletePOIType(id);
      if (success) {
        await loadTypes();
        setMessage({ type: "success", text: "Type supprimé" });
      } else {
        setMessage({ type: "error", text: "Erreur lors de la suppression" });
      }
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await updatePOIType(id, { is_active: !isActive });
    await loadTypes();
  };

  const resetForm = () => {
    setFormMode(null);
    setEditingId(null);
    setSelectedFile(null);
    setLogoPreview("");
    setFormData({
      name: "",
      slug: "",
      description: "",
      emoji: "",
      color: "#E5A93A",
      logo_url: "",
      is_active: true,
      sort_order: 0,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl mb-2">Gestion des Types de POI</h2>
        <p className="text-text-primary/60">Créez et gérez les types de points d'intérêt avec logos personnalisés</p>
      </div>

      {/* Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border-primary bg-bg-secondary/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            {formMode === "edit" ? "Modifier le type" : "Créer un nouveau type"}
          </h3>
          {formMode && (
            <button
              onClick={resetForm}
              className="text-sm text-text-primary/60 hover:text-brand-gold transition-colors"
            >
              Annuler
            </button>
          )}
        </div>

        {!formMode ? (
          <button
            onClick={() => setFormMode("create")}
            className="w-full px-6 py-3 bg-brand-gold text-brand-black font-medium rounded-lg hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Ajouter un type
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  onBlur={handleSlugGenerate}
                  placeholder="Ex: Toilettes"
                  className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="toilettes"
                  className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description du type"
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Emoji (optionnel)</label>
                <input
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                  placeholder="🚻"
                  maxLength={2}
                  className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Couleur</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-border-primary"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ordre</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
              <label className="block text-sm font-medium mb-3">📸 Logo (optionnel)</label>
              
              {logoPreview && (
                <div className="mb-4">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-20 w-20 rounded-lg object-cover border-2 border-brand-gold"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-blue-500/50 rounded-lg cursor-pointer hover:bg-blue-500/5 transition">
                  <Upload size={18} className="text-blue-400" />
                  <span className="text-sm">Choisir une image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
              {selectedFile && <p className="text-xs text-blue-300 mt-2">Fichier: {selectedFile.name}</p>}
              <p className="text-xs text-blue-300 mt-2">💡 L'image sera uploadée automatiquement avec le type</p>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded accent-brand-gold"
              />
              <span className="text-sm">Type actif</span>
            </label>

            <button
              type="submit"
              disabled={uploading}
              className="w-full mt-6 px-6 py-3 bg-brand-gold text-brand-black font-medium rounded-lg hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  {formMode === "edit" ? "Mettre à jour" : "Créer le type"}
                </>
              )}
            </button>
          </form>
        )}
      </motion.section>

      {/* Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 p-4 rounded-lg border ${
              message.type === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-600"
                : "border-red-500/30 bg-red-500/10 text-red-600"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Types List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border-primary bg-bg-secondary/50 p-6"
      >
        <h3 className="text-xl font-semibold mb-6">Types disponibles ({types.length})</h3>

        {loading ? (
          <div className="text-center py-8 text-text-primary/60">Chargement...</div>
        ) : types.length === 0 ? (
          <div className="text-center py-8 text-text-primary/60">Aucun type pour le moment</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {types.map((type) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg border transition-all ${
                  type.is_active
                    ? "border-border-primary bg-bg-secondary/30"
                    : "border-border-primary/50 bg-bg-secondary/10 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {type.logo_url ? (
                      <img src={type.logo_url} alt={type.name} className="h-10 w-10 rounded object-cover" />
                    ) : type.emoji ? (
                      <span className="text-2xl">{type.emoji}</span>
                    ) : (
                      <div
                        className="h-10 w-10 rounded"
                        style={{ backgroundColor: type.color || "#E5A93A" }}
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{type.name}</h4>
                      <p className="text-xs text-text-primary/50">{type.slug}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleActive(type.id, type.is_active)}
                    className="p-1.5 hover:bg-white/10 rounded transition"
                  >
                    {type.is_active ? (
                      <Eye size={16} className="text-brand-gold" />
                    ) : (
                      <EyeOff size={16} className="text-text-primary/40" />
                    )}
                  </button>
                </div>

                {type.description && (
                  <p className="text-sm text-text-primary/60 mb-3">{type.description}</p>
                )}

                <div className="flex gap-2 pt-3 border-t border-border-primary/30">
                  <button
                    onClick={() => handleEdit(type)}
                    className="flex-1 px-3 py-2 text-sm rounded hover:bg-white/10 transition flex items-center justify-center gap-1"
                  >
                    <Edit2 size={14} className="text-brand-gold" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="px-3 py-2 text-sm rounded hover:bg-red-500/10 transition text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
