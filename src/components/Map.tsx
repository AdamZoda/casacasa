import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { POI, POIType } from "../lib/poiDb";
import { poiToLatLng, type LatLng } from "../lib/geoUtils";
import { escapeHtml, isSafeHttpUrl } from "../lib/security";

interface MapProps {
  pois: POI[];
  poiTypes?: POIType[];
  selectedPoi?: POI | null;
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (poi: POI) => void;
}

// Fix Leaflet default icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export function MapView({ pois, poiTypes = [], selectedPoi = null, center = [20, 0], zoom = 2, onMarkerClick }: MapProps) {
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

    // Add new markers (coordonnées normalisées pour Leaflet [lat, lng])
    console.log("[MapView] Adding", pois.length, "POI markers");
    const validCoords: LatLng[] = [];

    pois.forEach((poi) => {
      const ll = poiToLatLng(poi);
      if (!ll) {
        console.warn("[MapView] POI ignoré (coordonnées invalides):", poi.id, poi);
        return;
      }

      const poiType = poiTypes?.find((t) => t.id === poi.type_id);

      let customIcon: L.DivIcon;

      // If we have a logo URL, create an image-based icon
      if (poiType?.logo_url && isSafeHttpUrl(poiType.logo_url)) {
        const safeLogo = new URL(poiType.logo_url.trim()).href;
        const safeName = escapeHtml(poiType.name || "");
        const safeEmoji = escapeHtml(poiType?.emoji || "📍");
        customIcon = L.divIcon({
          html: `<img src="${safeLogo.replace(/"/g, "%22")}" alt="${safeName}" class="w-10 h-10 object-cover filter drop-shadow-lg" style="border-radius: 50%;" onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '${safeEmoji}')" />`,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
          className: "custom-marker",
        });
      } else {
        // Fall back to emoji marker
        const em = escapeHtml(poiType?.emoji || "📍");
        customIcon = L.divIcon({
          html: `<div class="flex items-center justify-center w-9 h-9 bg-brand-gold rounded-full shadow-lg text-2xl border-2 border-white">${em}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
          className: "custom-marker",
        });
      }

      try {
        const marker = L.marker([ll.lat, ll.lng], { icon: customIcon })
          .bindPopup(
            `<strong>${escapeHtml(poi.name)}</strong><br/>${escapeHtml(poi.description || "No description")}`,
            { offset: [0, -10] }
          )
          .addTo(map.current!);

        validCoords.push(ll);

        marker.on("click", () => {
          marker.openPopup();
          if (onMarkerClick) onMarkerClick(poi);
        });

        markersRef.current.set(poi.id, marker);
      } catch (error) {
        console.error(`[MapView] Error adding marker for POI ${poi.id}:`, error);
      }
    });

    // Centrer la carte sur les marqueurs (évite la vue monde zoom 2 qui « perd » le point)
    if (validCoords.length > 0 && map.current) {
      try {
        if (validCoords.length === 1) {
          const c = validCoords[0];
          map.current.setView([c.lat, c.lng], 13);
        } else {
          const bounds = L.latLngBounds(
            validCoords.map((c) => [c.lat, c.lng] as [number, number])
          );
          map.current.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
        }
      } catch (e) {
        console.error("[MapView] fitBounds/setView:", e);
      }
    }

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
  }, [pois, poiTypes, center, zoom, onMarkerClick]);

  // Zoom to selected POI
  useEffect(() => {
    if (!selectedPoi || !map.current) return;
    const ll = poiToLatLng(selectedPoi);
    if (!ll) return;
    console.log("[MapView] Zooming to selected POI:", selectedPoi.name, "at", ll.lat, ll.lng);
    map.current.setView([ll.lat, ll.lng], 14);
  }, [selectedPoi]);

  return <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden border border-white/10" />;
}
