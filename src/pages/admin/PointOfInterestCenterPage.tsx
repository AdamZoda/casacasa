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
  MapPin,
} from "lucide-react";
import { POI, POIType, getAllPOIs, getAllPOITypes, createPOI, updatePOI, deletePOI, togglePOIVisibility, createPOIType, updatePOIType, deletePOIType, uploadPOITypeLogo } from "../../lib/poiDb";
import { useAppContext } from "../../context/AppContext";
import { useRef, useEffect as useEffectMap } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type TabType = "types" | "pois";
type FormMode = "create" | "edit" | null;

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

      map.current.on("click", (e) => {
        if (onMapClick) {
          onMapClick(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.current?.removeLayer(layer);
      }
    });

    pois.forEach((poi) => {
      const poiType = poiTypes.find((t) => t.id === poi.type_id);
      const typeDisplay = poiType ? `${poiType.emoji} ${poiType.name}` : "Localité";
      
      let markerIcon;
      
      if (poiType?.logo_url) {
        markerIcon = L.icon({
          iconUrl: poiType.logo_url,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: 'poi-logo-marker',
        });
      } else {
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
        .bindPopup(`<strong>🗺️ ${poi.name}</strong><br/>${poi.latitude.toFixed(4)}, ${poi.longitude.toFixed(4)}<br/><small>${typeDisplay}</small>`)
        .addTo(map.current!);
    });

    globalServices.forEach((service) => {
      if (service.latitude && service.longitude) {
        const blueIcon = L.icon({
          iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDA2M2U2IiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJjMCA2IDEwIDEyIDEwIDEyczEwLTYgMTAtMTJjMC01LjUyLTQuNDgtMTAtMTAtMTBabTAgM2MxLjY2IDAgMyAxLjM0IDMgM3MtMS4zNCAzLTMgMy0zLTEuMzQtMyAzIDEuMzQtMyAzLTN6Ii8+PC9zdmc+",
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -28],
        });
        L.marker([service.latitude, service.longitude], { icon: blueIcon })
          .bindPopup(`<strong>🎯 ${service.title}</strong><br/><small>${service.type || 'Service'}</small><br/>${service.latitude.toFixed(4)}, ${service.longitude.toFixed(4)}`)
          .addTo(map.current!);
      }
    });

    map.current.invalidateSize();
  }, [pois, poiTypes, onMapClick, globalServices]);

  return <div ref={mapContainer} className="w-full h-full" />;
}

export function PointOfInterestCenterPage() {
  const { globalServices } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>("types");
  
  // Types State
  const [types, setTypes] = useState<POIType[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  // Types Form
  const [typesFormMode, setTypesFormMode] = useState<FormMode>(null);
  const [typesEditingId, setTypesEditingId] = useState<string | null>(null);
  const [typesFormData, setTypesFormData] = useState({
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

  // POIs Form
  const [poisFormMode, setPoisFormMode] = useState<FormMode>(null);
  const [poisEditingId, setPoisEditingId] = useState<string | null>(null);
  const [poisFormData, setPoisFormData] = useState({
    name: "",
    description: "",
    latitude: "",
    longitude: "",
    type_id: "",
  });
  const [selectedPois, setSelectedPois] = useState<Set<string>>(new Set());
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const typesData = await getAllPOITypes();
    const poisData = await getAllPOIs();
    setTypes(typesData);
    setPois(poisData);
    setLoading(false);
  };

  // ====== TYPES FUNCTIONS ======
  const handleTypesSlugGenerate = () => {
    const slug = typesFormData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    setTypesFormData((prev) => ({ ...prev, slug }));
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

  const handleTypesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!typesFormData.name || !typesFormData.slug) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs requis" });
      return;
    }

    try {
      if (typesFormMode === "create") {
        const result = await createPOIType({
          name: typesFormData.name,
          slug: typesFormData.slug,
          description: typesFormData.description,
          emoji: typesFormData.emoji,
          color: typesFormData.color,
          logo_url: typesFormData.logo_url,
          is_active: typesFormData.is_active,
          sort_order: typesFormData.sort_order,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (result) {
          if (selectedFile) {
            setUploading(true);
            const logoUrl = await uploadPOITypeLogo(selectedFile, result.id);
            if (logoUrl) {
              await updatePOIType(result.id, { logo_url: logoUrl });
              setMessage({ type: "success", text: "Type créé et logo uploadé avec succès!" });
            } else {
              setMessage({ type: "success", text: "Type créé (erreur lors de l'upload du logo)" });
            }
            setUploading(false);
          }
          setMessage({ type: "success", text: "Type créé avec succès!" });
        }
      } else if (typesFormMode === "edit" && typesEditingId) {
        await updatePOIType(typesEditingId, {
          name: typesFormData.name,
          slug: typesFormData.slug,
          description: typesFormData.description,
          emoji: typesFormData.emoji,
          color: typesFormData.color,
          logo_url: typesFormData.logo_url,
          is_active: typesFormData.is_active,
          sort_order: typesFormData.sort_order,
          updated_at: new Date().toISOString(),
        });

        if (selectedFile) {
          setUploading(true);
          const logoUrl = await uploadPOITypeLogo(selectedFile, typesEditingId);
          if (logoUrl) {
            await updatePOIType(typesEditingId, { logo_url: logoUrl });
            setMessage({ type: "success", text: "Type modifié et logo uploadé avec succès!" });
          } else {
            setMessage({ type: "success", text: "Type modifié (erreur lors de l'upload du logo)" });
          }
          setUploading(false);
        }
        setMessage({ type: "success", text: "Type modifié avec succès!" });
      }

      await loadData();
      resetTypesForm();
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue" });
    }
  };

  const handleTypesEdit = (type: POIType) => {
    setTypesFormMode("edit");
    setTypesEditingId(type.id);
    setTypesFormData({
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

  const handleTypesDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce type?")) {
      await deletePOIType(id);
      await loadData();
      setMessage({ type: "success", text: "Type supprimé" });
    }
  };

  const handleTypesToggleActive = async (id: string, isActive: boolean) => {
    await updatePOIType(id, { is_active: !isActive });
    await loadData();
  };

  const resetTypesForm = () => {
    setTypesFormMode(null);
    setTypesEditingId(null);
    setSelectedFile(null);
    setLogoPreview("");
    setTypesFormData({
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

  // ====== POIS FUNCTIONS ======
  const handlePoisMapClick = (lat: number, lng: number) => {
    setClickedCoords({ lat, lng });
    setPoisFormMode("create");
    setPoisFormData({
      name: "",
      description: "",
      latitude: lat.toFixed(8),
      longitude: lng.toFixed(8),
      type_id: types.length > 0 ? types[0].id : "",
    });
    setMessage({ type: "success", text: `Coordonnées capturées: ${lat.toFixed(4)}, ${lng.toFixed(4)}` });
  };

  const handlePoisSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lat = parseFloat(poisFormData.latitude);
    const lng = parseFloat(poisFormData.longitude);

    if (!poisFormData.name || !poisFormData.latitude || !poisFormData.longitude || !poisFormData.type_id || isNaN(lat) || isNaN(lng)) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs avec des coordonnées valides et sélectionner un type." });
      return;
    }

    try {
      if (poisFormMode === "create") {
        await createPOI({
          name: poisFormData.name,
          description: poisFormData.description,
          latitude: lat,
          longitude: lng,
          type_id: poisFormData.type_id,
          visible: true,
        });
        setMessage({ type: "success", text: "Point d'intérêt créé avec succès!" });
      } else if (poisFormMode === "edit" && poisEditingId) {
        await updatePOI(poisEditingId, {
          name: poisFormData.name,
          description: poisFormData.description,
          latitude: lat,
          longitude: lng,
          type_id: poisFormData.type_id,
        });
        setMessage({ type: "success", text: "Point d'intérêt mis à jour avec succès!" });
      }

      await loadData();
      resetPoisForm();
    } catch (error) {
      setMessage({ type: "error", text: "Une erreur est survenue." });
    }
  };

  const handlePoisEdit = (poi: POI) => {
    setPoisFormMode("edit");
    setPoisEditingId(poi.id);
    setPoisFormData({
      name: poi.name,
      description: poi.description,
      latitude: poi.latitude.toString(),
      longitude: poi.longitude.toString(),
      type_id: poi.type_id,
    });
  };

  const handlePoisDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce point d'intérêt?")) {
      await deletePOI(id);
      await loadData();
      setSelectedPois((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setMessage({ type: "success", text: "Point d'intérêt supprimé." });
    }
  };

  const handlePoisDeleteSelected = async () => {
    if (selectedPois.size === 0) {
      setMessage({ type: "error", text: "Sélectionnez au moins un point." });
      return;
    }

    if (window.confirm(`Supprimer ${selectedPois.size} point(s) sélectionné(s)?`)) {
      for (const id of selectedPois) {
        await deletePOI(id);
      }
      setSelectedPois(new Set());
      await loadData();
      setMessage({ type: "success", text: `${selectedPois.size} point(s) supprimé(s).` });
    }
  };

  const handlePoisToggleVisibility = async (id: string, visible: boolean) => {
    await togglePOIVisibility(id, !visible);
    await loadData();
  };

  const handlePoisSelectAll = () => {
    if (selectedPois.size === pois.length) {
      setSelectedPois(new Set());
    } else {
      setSelectedPois(new Set(pois.map((p) => p.id)));
    }
  };

  const handlePoisToggleSelection = (id: string) => {
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

  const resetPoisForm = () => {
    setPoisFormMode(null);
    setPoisEditingId(null);
    setClickedCoords(null);
    setPoisFormData({
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      type_id: types.length > 0 ? types[0].id : "",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-3xl mb-2">Centre de Gestion des Points d'Intérêt</h2>
        <p className="text-text-primary/60">Gérez les types de localités et les points d'intérêt sur la carte</p>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex items-center gap-3 rounded-lg p-4 ${
              message.type === "success" ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 size={20} className="text-green-400" /> : <AlertCircle size={20} className="text-red-400" />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-primary">
        <button
          onClick={() => setActiveTab("types")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "types" ? "border-brand-gold text-brand-gold" : "border-transparent text-text-primary/60 hover:text-text-primary"
          }`}
        >
          Types de Localités
        </button>
        <button
          onClick={() => setActiveTab("pois")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "pois" ? "border-brand-gold text-brand-gold" : "border-transparent text-text-primary/60 hover:text-text-primary"
          }`}
        >
          Carte & Localités
        </button>
      </div>

      {/* Types Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "types" && (
          <motion.div
            key="types"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            {/* Types Form */}
            <motion.section className="rounded-xl border border-border-primary bg-bg-secondary/50 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {typesFormMode === "edit" ? "Modifier le type" : "Créer un nouveau type"}
                </h3>
                {typesFormMode && (
                  <button
                    onClick={resetTypesForm}
                    className="text-sm text-text-primary/60 hover:text-brand-gold transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>

              {!typesFormMode ? (
                <button
                  onClick={() => setTypesFormMode("create")}
                  className="w-full px-6 py-3 bg-brand-gold text-brand-black font-medium rounded-lg hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Ajouter un type
                </button>
              ) : (
                <form onSubmit={handleTypesSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom *</label>
                      <input
                        type="text"
                        value={typesFormData.name}
                        onChange={(e) => setTypesFormData({ ...typesFormData, name: e.target.value })}
                        onBlur={handleTypesSlugGenerate}
                        placeholder="Ex: Toilettes"
                        className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Slug *</label>
                      <input
                        type="text"
                        value={typesFormData.slug}
                        onChange={(e) => setTypesFormData({ ...typesFormData, slug: e.target.value })}
                        placeholder="toilettes"
                        className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={typesFormData.description}
                      onChange={(e) => setTypesFormData({ ...typesFormData, description: e.target.value })}
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
                        value={typesFormData.emoji}
                        onChange={(e) => setTypesFormData({ ...typesFormData, emoji: e.target.value })}
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
                          value={typesFormData.color}
                          onChange={(e) => setTypesFormData({ ...typesFormData, color: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer border border-border-primary"
                        />
                        <input
                          type="text"
                          value={typesFormData.color}
                          onChange={(e) => setTypesFormData({ ...typesFormData, color: e.target.value })}
                          className="flex-1 px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Ordre</label>
                      <input
                        type="number"
                        value={typesFormData.sort_order}
                        onChange={(e) => setTypesFormData({ ...typesFormData, sort_order: parseInt(e.target.value) })}
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
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={typesFormData.is_active}
                      onChange={(e) => setTypesFormData({ ...typesFormData, is_active: e.target.checked })}
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
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        {typesFormMode === "edit" ? "Mettre à jour" : "Créer"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.section>

            {/* Types List */}
            <motion.section className="rounded-xl border border-border-primary bg-bg-secondary/50 p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-6">Types existants ({types.length})</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={32} className="text-brand-gold animate-spin" />
                </div>
              ) : types.length === 0 ? (
                <p className="text-text-primary/60 text-center py-8">Aucun type créé</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {types.map((type) => (
                    <motion.div
                      key={type.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border-primary/50 bg-bg-secondary hover:border-brand-gold/30 transition-all"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {type.logo_url ? (
                            <img src={type.logo_url} alt={type.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <span className="text-lg">{type.emoji}</span>
                          )}
                          <span className="font-medium">{type.name}</span>
                          {!type.is_active && <span className="text-xs bg-red-500/30 px-2 py-1 rounded text-red-200">Inactif</span>}
                        </div>
                        <p className="text-xs text-text-primary/60 mt-1">{type.description}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTypesToggleActive(type.id, type.is_active)}
                          className="p-2 hover:bg-brand-gold/10 rounded transition"
                        >
                          {type.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                        <button
                          onClick={() => handleTypesEdit(type)}
                          className="p-2 hover:bg-blue-500/10 rounded transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleTypesDelete(type.id)}
                          className="p-2 hover:bg-red-500/10 rounded transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POIs Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "pois" && (
          <motion.div
            key="pois"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            {/* Map */}
            <motion.section className="rounded-xl border border-border-primary bg-bg-secondary/50 overflow-hidden h-96 md:h-[500px]">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-black/20">
                  <Loader2 size={32} className="text-brand-gold animate-spin" />
                </div>
              ) : (
                <MapViewWithClick pois={pois} poiTypes={types} onMapClick={handlePoisMapClick} />
              )}
            </motion.section>

            {/* POIs Form */}
            <motion.section className="rounded-xl border border-border-primary bg-bg-secondary/50 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {poisFormMode === "edit" ? "Modifier le point" : "Ajouter un point d'intérêt"}
                </h3>
                {poisFormMode && (
                  <button
                    onClick={resetPoisForm}
                    className="text-sm text-text-primary/60 hover:text-brand-gold transition-colors"
                  >
                    Annuler
                  </button>
                )}
              </div>

              {!poisFormMode ? (
                <p className="text-text-primary/60 text-sm mb-4">💡 Cliquez sur la carte ci-dessus pour ajouter un point ou utilisez le formulaire ci-dessous</p>
              ) : null}

              {poisFormMode && (
                <form onSubmit={handlePoisSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom *</label>
                      <input
                        type="text"
                        value={poisFormData.name}
                        onChange={(e) => setPoisFormData({ ...poisFormData, name: e.target.value })}
                        placeholder="Ex: Toilettes Gare"
                        className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Type *</label>
                      <select
                        value={poisFormData.type_id}
                        onChange={(e) => setPoisFormData({ ...poisFormData, type_id: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                        required
                      >
                        <option value="">Sélectionner un type</option>
                        {types.filter((t) => t.is_active).map((type) => (
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
                      value={poisFormData.description}
                      onChange={(e) => setPoisFormData({ ...poisFormData, description: e.target.value })}
                      placeholder="Description du point"
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Latitude *</label>
                      <input
                        type="number"
                        step="0.00000001"
                        value={poisFormData.latitude}
                        onChange={(e) => setPoisFormData({ ...poisFormData, latitude: e.target.value })}
                        placeholder="0.00000"
                        className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Longitude *</label>
                      <input
                        type="number"
                        step="0.00000001"
                        value={poisFormData.longitude}
                        onChange={(e) => setPoisFormData({ ...poisFormData, longitude: e.target.value })}
                        placeholder="0.00000"
                        className="w-full px-4 py-2 rounded-lg border border-border-primary bg-bg-primary text-text-primary focus:border-brand-gold outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 px-6 py-3 bg-brand-gold text-brand-black font-medium rounded-lg hover:bg-brand-gold/90 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    {poisFormMode === "edit" ? "Mettre à jour" : "Créer"}
                  </button>
                </form>
              )}
            </motion.section>

            {/* POIs List */}
            <motion.section className="rounded-xl border border-border-primary bg-bg-secondary/50 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Points d'intérêt ({pois.length})</h3>
                {selectedPois.size > 0 && (
                  <button
                    onClick={handlePoisDeleteSelected}
                    className="text-sm px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition"
                  >
                    Supprimer {selectedPois.size} sélectionné(s)
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={32} className="text-brand-gold animate-spin" />
                </div>
              ) : pois.length === 0 ? (
                <p className="text-text-primary/60 text-center py-8">Aucun point créé</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {pois.map((poi) => {
                    const poiType = types.find((t) => t.id === poi.type_id);
                    return (
                      <motion.div
                        key={poi.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border-primary/50 bg-bg-secondary hover:border-brand-gold/30 transition-all"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPois.has(poi.id)}
                          onChange={() => handlePoisToggleSelection(poi.id)}
                          className="w-4 h-4 rounded accent-brand-gold"
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {poiType?.logo_url ? (
                              <img src={poiType.logo_url} alt={poiType.name} className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <span>{poiType?.emoji || "📍"}</span>
                            )}
                            <span className="font-medium">{poi.name}</span>
                            {!poi.visible && <span className="text-xs bg-gray-500/30 px-2 py-1 rounded text-gray-200">Caché</span>}
                          </div>
                          <p className="text-xs text-text-primary/60 mt-1">{poiType?.name}</p>
                          <p className="text-[10px] text-text-primary/40 mt-1">📍 {poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePoisToggleVisibility(poi.id, poi.visible)}
                            className="p-2 hover:bg-brand-gold/10 rounded transition"
                          >
                            {poi.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                          <button
                            onClick={() => handlePoisEdit(poi)}
                            className="p-2 hover:bg-blue-500/10 rounded transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handlePoisDelete(poi.id)}
                            className="p-2 hover:bg-red-500/10 rounded transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
