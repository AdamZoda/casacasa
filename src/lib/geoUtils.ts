/** Parse une coordonnée issue du JSON / formulaire (nombre ou chaîne avec virgule décimale FR). */
export function parseCoordinate(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  const s = String(raw ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : NaN;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Convertit un POI en lat/lng pour Leaflet [lat, lng].
 * Gère latitude/longitude en chaîne, aliases lat/lng, et inversion évidente (lng stocké en premier).
 */
export function poiToLatLng(poi: {
  latitude?: unknown;
  longitude?: unknown;
  lat?: unknown;
  lng?: unknown;
}): LatLng | null {
  let lat = parseCoordinate(poi.latitude ?? poi.lat);
  let lng = parseCoordinate(poi.longitude ?? poi.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  // Erreur fréquente : longitude (-180..180) enregistrée dans le champ latitude (|lat| > 90)
  if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) {
    const t = lat;
    lat = lng;
    lng = t;
  }

  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}
