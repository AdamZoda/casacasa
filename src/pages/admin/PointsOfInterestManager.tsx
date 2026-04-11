import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Edit2, Trash2, Eye, EyeOff, MapPin, AlertCircle, CheckCircle2, Trash, Check } from "lucide-react";
import { POI, POIType, getAllPOIs, getAllPOITypes, createPOI, updatePOI, deletePOI, togglePOIVisibility } from "../../lib/poiDb";
import { escapeHtml } from "../../lib/security";
import { useAppContext } from "../../context/AppContext";

// Composant Map avec clic pour ajouter des points
import { useRef, useEffect as useEffectMap } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapWithClickProps {
  pois: POI[];
  poiTypes: POIType[];
  onMapClick?: (lat: number, lng: number) => void;
}

function MapViewWithClick({ pois, poiTypes, onMapClick }: MapWithClickProps) {
  const { globalServices } = useAppContext();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffectMap(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
  }, []);

  useEffectMap(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
        crossOrigin: true,
      }).addTo(map.current);

      // Clic sur la carte pour ajouter un point
      map.current.on("click", (e) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    // Nettoyer les marqueurs existants
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.current?.removeLayer(layer);
      }
    });

    // Ajouter les POIs (avec logos ou emojis)
    pois.forEach((poi) => {
      const poiType = poiTypes.find((t) => t.id === poi.type_id);
      const typeDisplay = poiType ? `${poiType.emoji} ${poiType.name}` : "Localité";
      
      let markerIcon;
      
      // Use logo directly or fall back to emoji
      if (poiType?.logo_url) {
        // Use logo image directly
        markerIcon = L.icon({
          iconUrl: poiType.logo_url,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: 'poi-logo-marker',
        });
      } else {
        // Create emoji marker as canvas (no external images = no CORS issues)
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = poiType?.color || '#E5A93A';
        ctx.beginPath();
        ctx.arc(20, 20, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.fillText(poiType?.emoji || '📍', 20, 20);
        
        markerIcon = L.icon({
          iconUrl: canvas.toDataURL(),
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });
      }
      
      L.marker([poi.latitude, poi.longitude], { icon: markerIcon })
        .bindPopup(
          `<strong>🗺️ ${escapeHtml(poi.name)}</strong><br/>${poi.latitude.toFixed(4)}, ${poi.longitude.toFixed(4)}<br/><small>${escapeHtml(typeDisplay)}</small>`
        )
        .addTo(map.current!);
    });

    // Ajouter les Services avec localisation (marqueurs bleus)
    globalServices.forEach((service) => {
      if (service.latitude && service.longitude) {
        const blueIcon = L.icon({
          iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDA2M2U2IiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJjMCA2IDEwIDEyIDEwIDEyczEwLTYgMTAtMTJjMC01LjUyLTQuNDgtMTAtMTAtMTBabTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMy0zIDEuMzQtMyAzLTN6Ii8+PC9zdmc+",
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        });
        L.marker([service.latitude, service.longitude], { icon: blueIcon })
          .bindPopup(
            `<strong>🎯 ${escapeHtml(service.title)}</strong><br/><small>${escapeHtml(service.type || "Service")}</small><br/>${service.latitude!.toFixed(4)}, ${service.longitude!.toFixed(4)}`
          )
          .addTo(map.current!);
      }
    });

    map.current.invalidateSize();
  }, [pois, poiTypes, onMapClick, globalServices]);

  return <div ref={mapContainer} className="w-full h-full" />;
}

type FormMode = "create" | "edit" | null;

export function PointsOfInterestManager() {
  const { globalServices } = useAppContext();
  const [pois, setPois] = useState<POI[]>([]);
  const [poiTypes, setPoiTypes] = useState<POIType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedPois, setSelectedPois] = useState<Set<string>>(new Set());
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    type_id: "",
  });

  useEffect(() => {
    loadPOIs();
    loadPOITypes();
  }, []);

  const loadPOITypes = async () => {
    const data = await getAllPOITypes();
    setPoiTypes(data);
  };

  const loadPOIs = async () => {
    setLoading(true);
    const data = await getAllPOIs();
    setPois(data);
    setLoading(false);
  };

  // Gérer le clic sur la carte
  const handleMapClick = (lat: number, lng: number) => {
    setClickedCoords({ lat, lng });
    setFormMode("create");
    setFormData({
      name: "",
      description: "",
      latitude: lat.toFixed(8),
      longitude: lng.toFixed(8),
      type_id: poiTypes.length > 0 ? poiTypes[0].id : "",
    });
    setMessage({ type: "success", text: `Coordonnées capturées: ${lat.toFixed(4)}, ${lng.toFixed(4)}` });
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

    if (!formData.name || !formData.latitude || !formData.longitude || !formData.type_id || isNaN(lat) || isNaN(lng)) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs avec des coordonnées valides et sélectionner un type." });
      return;
    }

    try {
      if (formMode === "create") {
        await createPOI({
          name: formData.name,
          description: formData.description,
          latitude: lat,
          longitude: lng,
          type_id: formData.type_id,
          visible: true,
        });
        setMessage({ type: "success", text: "Point d'intérêt créé avec succès!" });
      } else if (formMode === "edit" && editingId) {
        await updatePOI(editingId, {
          name: formData.name,
          description: formData.description,
          latitude: lat,
          longitude: lng,
          type_id: formData.type_id,
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
      type_id: poi.type_id,
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce point d'intérêt?")) {
      await deletePOI(id);
      await loadPOIs();
      setSelectedPois((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setMessage({ type: "success", text: "Point d'intérêt supprimé." });
    }
  };

  // Supprimer les POIs sélectionnés
  const handleDeleteSelected = async () => {
    if (selectedPois.size === 0) {
      setMessage({ type: "error", text: "Sélectionnez au moins un point." });
      return;
    }

    if (window.confirm(`Supprimer ${selectedPois.size} point(s) sélectionné(s)?`)) {
      for (const id of selectedPois) {
        await deletePOI(id);
      }
      setSelectedPois(new Set());
      await loadPOIs();
      setMessage({ type: "success", text: `${selectedPois.size} point(s) supprimé(s).` });
    }
  };

  // Sélectionner/Désélectionner tout
  const handleSelectAll = () => {
    if (selectedPois.size === pois.length) {
      setSelectedPois(new Set());
    } else {
      setSelectedPois(new Set(pois.map((p) => p.id)));
    }
  };

  const handleToggleSelection = (id: string) => {
    setSelectedPois((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    await togglePOIVisibility(id, !visible);
    await loadPOIs();
  };

  const resetForm = () => {
    setFormMode(null);
    setEditingId(null);
    setClickedCoords(null);
    setFormData({
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      type_id: "",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl mb-2">Gestion des Points d'Intérêt</h2>
        <p className="text-text-primary/60">Cliquez sur la carte pour ajouter des points d'intérêt</p>
      </div>

      {/* Services avec localisation disponibles */}
      {globalServices.some(s => s.latitude && s.longitude) && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🎯 <span>Services avec localisation disponibles</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {globalServices.filter(s => s.latitude && s.longitude).map((service) => (
              <motion.button
                key={service.id}
                onClick={() => {
                  setFormMode("create");
                  setFormData({
                    name: service.title,
                    description: service.description,
                    latitude: service.latitude!.toFixed(8),
                    longitude: service.longitude!.toFixed(8),
                    type_id: poiTypes.length > 0 ? poiTypes[0].id : "",
                  });
                  setClickedCoords({ lat: service.latitude!, lng: service.longitude! });
                  setMessage({ type: "success", text: `Coordonnées du service "${service.title}" chargées` });
                }}
                className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-blue-500/20 hover:border-blue-500/50 transition-all text-left"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-medium">{service.title}</p>
                <p className="text-xs text-text-primary/50 mt-1">📂 {service.type || 'Service'}</p>
                <p className="text-xs text-blue-300 mt-2">📍 {service.latitude?.toFixed(4)}, {service.longitude?.toFixed(4)}</p>
              </motion.button>
            ))}
          </div>
        </motion.section>
      )}

      {/* Clicked Coordinates Display */}
      {clickedCoords && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-100"
        >
          📍 Coordonnées capturées: <strong>{clickedCoords.lat.toFixed(6)}, {clickedCoords.lng.toFixed(6)}</strong>
        </motion.div>
      )}

      {/* Map with Click Enabled */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden border border-border-primary h-96 cursor-crosshair"
      >
        <MapViewWithClick pois={pois} poiTypes={poiTypes} onMapClick={handleMapClick} />
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
              <label className="block text-sm font-medium mb-2">Nom *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Toilettes Marché Central"
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type_id}
                onChange={(e) => setFormData({ ...formData, type_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                required
              >
                <option value="">Sélectionner un type...</option>
                {poiTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.emoji} {type.name}
                  </option>
                ))}
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

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="text-sm text-blue-100 mb-3">💡 <strong>Astuce:</strong> Cliquez sur la carte pour capturer les coordonnées automatiquement!</p>
            
            <div>
              <label className="block text-sm font-medium mb-2">Ou collez les coordonnées (latitude, longitude)</label>
              <input
                type="text"
                placeholder="Ex: 33.5731, -7.5898"
                onBlur={handleExtractCoordinates}
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Latitude *</label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="33.5731"
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Longitude *</label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="-7.5898"
                className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary placeholder:text-text-primary/40 focus:border-brand-gold outline-none transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 px-6 py-3 bg-brand-gold text-brand-black font-medium rounded-lg hover:bg-brand-gold/90 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
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
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border-primary bg-bg-secondary/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold">Points d'intérêt ({pois.length})</h3>
            {selectedPois.size > 0 && (
              <span className="px-3 py-1 text-sm bg-brand-gold/20 text-brand-gold rounded-full">
                {selectedPois.size} sélectionné(s)
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {pois.length > 0 && (
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title={selectedPois.size === pois.length ? "Désélectionner tout" : "Sélectionner tout"}
              >
                <Check size={16} />
                {selectedPois.size === pois.length ? "Désélectionner tout" : "Sélectionner tout"}
              </button>
            )}
            {selectedPois.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <Trash size={16} />
                Supprimer ({selectedPois.size})
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-text-primary/60">Chargement...</div>
        ) : pois.length === 0 ? (
          <div className="text-center py-8 text-text-primary/60">Aucun point d'intérêt pour le moment</div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pois.map((poi) => (
              <motion.div
                key={poi.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                  selectedPois.has(poi.id)
                    ? "border-brand-gold/50 bg-brand-gold/10"
                    : "border-border-primary bg-bg-secondary/30 hover:bg-bg-secondary/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPois.has(poi.id)}
                  onChange={() => handleToggleSelection(poi.id)}
                  className="w-5 h-5 cursor-pointer accent-brand-gold"
                />
                
                <div className="text-2xl">
                  {poiTypes.find((t) => t.id === poi.type_id)?.emoji || "📍"}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">{poi.name}</h4>
                  <p className="text-sm text-text-primary/60 truncate">{poi.description}</p>
                  <p className="text-xs text-text-primary/40 mt-1">
                    <MapPin size={12} className="inline mr-1" />
                    {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
