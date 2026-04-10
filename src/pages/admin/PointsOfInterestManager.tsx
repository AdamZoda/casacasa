import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, Eye, EyeOff, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { POI, getAllPOIs, createPOI, updatePOI, deletePOI, togglePOIVisibility } from "../../lib/poiDb";
import { MapView } from "../../components/Map";

type FormMode = "create" | "edit" | null;

export function PointsOfInterestManager() {
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    type: "toilettes" as POI["type"],
  });

  useEffect(() => {
    loadPOIs();
  }, []);

  const loadPOIs = async () => {
    setLoading(true);
    const data = await getAllPOIs();
    setPois(data);
    setLoading(false);
  };

  const handleExtractCoordinates = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const regex = /(-?\d+\.?\d+),\s*(-?\d+\.?\d+)/;
    const match = value.match(regex);

    if (match) {
      setFormData((prev) => ({
        ...prev,
        latitude: match[1],
        longitude: match[2],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (!formData.name || !formData.latitude || !formData.longitude || isNaN(lat) || isNaN(lng)) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs avec des coordonnées valides." });
      return;
    }

    try {
      if (formMode === "create") {
        await createPOI({
          name: formData.name,
          description: formData.description,
          latitude: lat,
          longitude: lng,
          type: formData.type,
          visible: true,
        });
        setMessage({ type: "success", text: "Point d'intérêt créé avec succès!" });
      } else if (formMode === "edit" && editingId) {
        await updatePOI(editingId, {
          name: formData.name,
          description: formData.description,
          latitude: lat,
          longitude: lng,
          type: formData.type,
        });
        setMessage({ type: "success", text: "Point d'intérêt mis à jour avec succès!" });
      }

      await loadPOIs();
      resetForm();
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue." });
    }
  };

  const handleEdit = (poi: POI) => {
    setFormMode("edit");
    setEditingId(poi.id);
    setFormData({
      name: poi.name,
      description: poi.description,
      latitude: poi.latitude.toString(),
      longitude: poi.longitude.toString(),
      type: poi.type,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce point d'intérêt?")) {
      await deletePOI(id);
      await loadPOIs();
      setMessage({ type: "success", text: "Point d'intérêt supprimé." });
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    await togglePOIVisibility(id, !visible);
    await loadPOIs();
  };

  const resetForm = () => {
    setFormMode(null);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      type: "toilettes",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl mb-2">Gestion des Points d'Intérêt</h2>
        <p className="text-text-primary/60">Ajouter et gérer les points d'intérêt sur la carte</p>
      </div>

      {/* Map Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden border border-border-primary h-96"
      >
        <MapView pois={pois} />
      </motion.div>

      {/* Add/Edit Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border-primary bg-bg-secondary/50 p-6 md:p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">{formMode === "edit" ? "Modifier le point" : "Ajouter un point d'intérêt"}</h3>
          {formMode && (
            <button
              onClick={resetForm}
              className="text-sm text-text-primary/60 hover:text-brand-gold transition-colors"
            >
              Annuler
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Toilettes Marché Central"
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as POI["type"] })}
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
              >
                <option value="toilettes">Toilettes 🚻</option>
                <option value="parking">Parking 🅿️</option>
                <option value="restaurant">Restaurant 🍽️</option>
                <option value="shop">Boutique 🛍️</option>
                <option value="other">Autre 📍</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du point d'intérêt"
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Coordonnées (latitude, longitude)</label>
            <input
              type="text"
              placeholder="Ex: 33.5731, -7.5898"
              onBlur={handleExtractCoordinates}
              className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition"
            />
            <p className="text-xs text-text-primary/50 mt-1">Collez au format: latitude, longitude</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="33.5731"
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="-7.5898"
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-6 py-2 bg-brand-gold text-brand-black font-medium rounded-lg hover:bg-brand-gold/90 transition-all duration-300"
          >
            {formMode === "edit" ? "Mettre à jour" : "Ajouter le point"}
          </button>
        </form>
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

      {/* POIs List */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-xl font-semibold mb-4">Points d'intérêt ({pois.length})</h3>

        {loading ? (
          <div className="text-center py-8 text-text-primary/60">Chargement...</div>
        ) : pois.length === 0 ? (
          <div className="text-center py-8 text-text-primary/60">Aucun point d'intérêt pour le moment</div>
        ) : (
          <div className="grid gap-4">
            {pois.map((poi) => (
              <motion.div
                key={poi.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 rounded-lg border border-border-primary bg-bg-secondary/30 hover:bg-bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl">
                    {{
                      toilettes: "🚻",
                      parking: "🅿️",
                      restaurant: "🍽️",
                      shop: "🛍️",
                      other: "📍",
                    }[poi.type]}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{poi.name}</h4>
                    <p className="text-sm text-text-primary/60">{poi.description}</p>
                    <p className="text-xs text-text-primary/40 mt-1">
                      <MapPin size={12} className="inline mr-1" />
                      {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleVisibility(poi.id, poi.visible)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title={poi.visible ? "Masquer" : "Afficher"}
                  >
                    {poi.visible ? (
                      <Eye size={18} className="text-brand-gold" />
                    ) : (
                      <EyeOff size={18} className="text-text-primary/40" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(poi)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} className="text-brand-gold" />
                  </button>
                  <button
                    onClick={() => handleDelete(poi.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-red-500" />
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
