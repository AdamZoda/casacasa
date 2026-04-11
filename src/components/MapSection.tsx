import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Filter } from "lucide-react";
import { getPOIs, POI, POIType, getAllPOITypes } from "../lib/poiDb";
import { poiToLatLng } from "../lib/geoUtils";
import { MapView } from "./Map";

export function MapSection() {
  const [pois, setPois] = useState<POI[]>([]);
  const [poiTypes, setPoiTypes] = useState<POIType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  useEffect(() => {
    console.log("[MapSection] Component mounted, loading POIs and types...");
    loadPOIs();
    loadPOITypes();
  }, []);

  const loadPOIs = async () => {
    try {
      console.log("[MapSection] loadPOIs() called");
      setLoading(true);
      const data = await getPOIs();
      console.log("[MapSection] POIs loaded successfully, count:", data.length);
      setPois(data);
      setLoading(false);
    } catch (err) {
      console.error("[MapSection] Error loading POIs:", err);
      setLoading(false);
    }
  };

  const loadPOITypes = async () => {
    try {
      console.log("[MapSection] loadPOITypes() called");
      const data = await getAllPOITypes();
      console.log("[MapSection] POI types loaded successfully, count:", data.length);
      setPoiTypes(data);
    } catch (err) {
      console.error("[MapSection] Error loading POI types:", err);
    }
  };

  const filteredPois = selectedFilter === "all" ? pois : pois.filter((p) => p.type_id === selectedFilter);

  return (
    <section className="relative z-10 mx-auto max-w-[1550px] space-y-8 px-6 pb-24 md:px-10 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-6"
      >
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold">Explorer</p>
          <h2 className="font-serif text-4xl md:text-5xl">Découvrez les points d'intérêt</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <button
            key="all"
            onClick={() => setSelectedFilter("all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border text-sm ${
              selectedFilter === "all"
                ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
            }`}
          >
            <span>📍</span>
            <span>Tous</span>
            <span className="ml-1 text-xs opacity-70">({pois.length})</span>
          </button>

          {poiTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedFilter(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border text-sm ${
                selectedFilter === type.id
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                  : "border-white/20 text-white/70 hover:border-white/40 hover:text-white"
              }`}
            >
              <span>{type.emoji}</span>
              <span>{type.name}</span>
              <span className="ml-1 text-xs opacity-70">({pois.filter((p) => p.type_id === type.id).length})</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Map and List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="xl:col-span-2 h-96 md:h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 relative"
        >
          {!loading ? (
            <MapView pois={filteredPois} poiTypes={poiTypes} selectedPoi={selectedPoi} onMarkerClick={setSelectedPoi} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white/60 z-10">
              Chargement de la carte...
            </div>
          )}
          
          {/* Fallback message when no POIs */}
          {!loading && filteredPois.length === 0 && (
            <div className="absolute inset-0 flex items-end justify-center pb-12 pointer-events-none">
              <div className="bg-black/70 px-4 py-2 rounded-lg border border-white/20">
                <p className="text-white/60 text-sm">Aucun point d'intérêt pour le moment</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* POIs List */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-4">
          <h3 className="font-serif text-2xl">Résultats ({filteredPois.length})</h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {filteredPois.length === 0 ? (
              <p className="text-white/60 text-sm py-8 text-center">Aucun résultat pour ce filtre</p>
            ) : (
              filteredPois.map((poi) => {
                const poiType = poiTypes.find((t) => t.id === poi.type_id);
                const pos = poiToLatLng(poi);
                return (
                  <motion.button
                    key={poi.id}
                    onClick={() => setSelectedPoi(poi)}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-300 ${
                      selectedPoi?.id === poi.id
                        ? "border-brand-gold bg-brand-gold/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                    }`}
                  >
                  <div className="flex items-start gap-3">
                      {poiType?.logo_url ? (
                        <img src={poiType.logo_url} alt={poiType.name} className="w-10 h-10 object-cover rounded-full mt-1 flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                      ) : (
                        <span className="text-2xl mt-1">{poiType?.emoji || "📍"}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{poi.name}</h4>
                        <p className="text-xs text-white/60 line-clamp-2 mt-1">{poi.description}</p>
                        <p className="text-[10px] text-white/40 mt-2 flex items-center gap-1">
                          <MapPin size={12} />
                          {pos ? `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` : "—"}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Selected POI Details */}
          {selectedPoi && (() => {
            const selectedType = poiTypes.find((t) => t.id === selectedPoi.type_id);
            const selPos = poiToLatLng(selectedPoi);
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-lg border border-brand-gold/30 bg-brand-gold/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  {selectedType?.logo_url ? (
                    <img src={selectedType.logo_url} alt={selectedType.name} className="w-12 h-12 object-cover rounded-full flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <span className="text-3xl">{selectedType?.emoji || "📍"}</span>
                  )}
                  <div>
                    <h4 className="font-semibold text-brand-gold">{selectedPoi.name}</h4>
                    <p className="text-xs text-white/60">{selectedType?.name || "Point d'intérêt"}</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 mb-3">{selectedPoi.description}</p>
                <p className="text-xs text-white/50 mb-3">
                  📍{" "}
                  {selPos ? `${selPos.lat.toFixed(6)}, ${selPos.lng.toFixed(6)}` : "Coordonnées invalides"}
                </p>
                {selPos && (
                  <a
                    href={`https://maps.google.com/?q=${selPos.lat},${selPos.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1 text-xs bg-brand-gold text-black rounded hover:bg-brand-gold/90 transition-colors font-medium"
                  >
                    <MapPin size={14} />
                    Ouvrir sur Google Maps
                  </a>
                )}
              </motion.div>
            );
          })()}
        </motion.div>
      </div>
    </section>
  );
}
