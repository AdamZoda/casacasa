import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { POI } from "../lib/poiDb";

interface MapProps {
  pois: POI[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (poi: POI) => void;
}

const POI_TYPE_ICONS: Record<POI["type"], string> = {
  toilettes: "🚻",
  parking: "🅿️",
  restaurant: "🍽️",
  shop: "🛍️",
  other: "📍",
};

// Fix Leaflet default icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export function MapView({ pois, center = [20, 0], zoom = 2, onMarkerClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    console.log("[MapView] Initializing with POIs:", pois);
    if (!mapContainer.current) {
      console.error("[MapView] Container ref not found");
      return;
    }

    // Initialize map only once
    if (!map.current) {
      try {
        console.log("[MapView] Creating Leaflet map instance...");
        map.current = L.map(mapContainer.current, {
          preferCanvas: true,
          attributionControl: true,
        }).setView(center, zoom);

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 1,
          crossOrigin: true,
        }).addTo(map.current);
        
        console.log("[MapView] Map created successfully");
      } catch (error) {
        console.error("[MapView] Error initializing map:", error);
        return;
      }
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        console.error("[MapView] Error removing marker:", e);
      }
    });
    markersRef.current.clear();

    // Add new markers
    console.log("[MapView] Adding", pois.length, "POI markers");
    pois.forEach((poi) => {
      const customIcon = L.divIcon({
        html: `<div class="flex items-center justify-center w-9 h-9 bg-brand-gold rounded-full shadow-lg text-2xl border-2 border-white">${POI_TYPE_ICONS[poi.type]}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
        className: "custom-marker",
      });

      try {
        const marker = L.marker([poi.latitude, poi.longitude], { icon: customIcon })
          .bindPopup(`<strong>${poi.name}</strong><br/>${poi.description || "No description"}`, { offset: [0, -10] })
          .addTo(map.current!);

        marker.on("click", () => {
          marker.openPopup();
          if (onMarkerClick) onMarkerClick(poi);
        });

        markersRef.current.set(poi.id, marker);
      } catch (error) {
        console.error(`[MapView] Error adding marker for POI ${poi.id}:`, error);
      }
    });

    // Invalidate size to fix responsive issues
    if (map.current) {
      setTimeout(() => {
        try {
          map.current?.invalidateSize();
        } catch (e) {
          console.error("[MapView] Error invalidating map size:", e);
        }
      }, 100);
    }

    return () => {
      // Don't destroy map on unmount, just cleanup markers
      markersRef.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          console.error("[MapView] Error removing marker on unmount:", e);
        }
      });
      markersRef.current.clear();
    };
  }, [pois, center, zoom, onMarkerClick]);

  return <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden border border-white/10" />;
}
