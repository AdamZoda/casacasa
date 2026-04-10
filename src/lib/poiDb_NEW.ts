import { supabase } from "./supabase";

// ============================================
// POI TYPES MANAGEMENT
// ============================================

export interface POIType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  emoji?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface POI {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type_id: string;
  type?: POIType; // Optional populated relation
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// POI TYPES FUNCTIONS
// ============================================

export async function getAllPOITypes(): Promise<POIType[]> {
  try {
    console.log("[POI Types] Fetching all types (admin)...");
    const { data, error } = await supabase
      .from("poi_types")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[POI Types] Error fetching types:", error.message);
      return [];
    }
    console.log("[POI Types] Fetched", data?.length || 0, 'types');
    return data || [];
  } catch (err) {
    console.error("[POI Types] Exception:", err);
    return [];
  }
}

export async function getActivePOITypes(): Promise<POIType[]> {
  try {
    const { data, error } = await supabase
      .from("poi_types")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("[POI Types] Error fetching active types:", err);
    return [];
  }
}

export async function createPOIType(type: Omit<POIType, "id" | "created_at" | "updated_at">): Promise<POIType | null> {
  try {
    console.log("[POI Types] Creating type:", type.name);
    const { data, error } = await supabase
      .from("poi_types")
      .insert([type])
      .select()
      .single();

    if (error) throw error;
    console.log("[POI Types] Created type:", data.id);
    return data;
  } catch (err) {
    console.error("[POI Types] Error creating type:", err);
    return null;
  }
}

export async function updatePOIType(id: string, updates: Partial<POIType>): Promise<POIType | null> {
  try {
    console.log("[POI Types] Updating type:", id);
    const { data, error } = await supabase
      .from("poi_types")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    console.log("[POI Types] Updated type:", id);
    return data;
  } catch (err) {
    console.error("[POI Types] Error updating type:", err);
    return null;
  }
}

export async function deletePOIType(id: string): Promise<boolean> {
  try {
    console.log("[POI Types] Deleting type:", id);
    const { error } = await supabase
      .from("poi_types")
      .delete()
      .eq("id", id);

    if (error) throw error;
    console.log("[POI Types] Deleted type:", id);
    return true;
  } catch (err) {
    console.error("[POI Types] Error deleting type:", err);
    return false;
  }
}

export async function uploadPOITypeLogo(file: File, typeId: string): Promise<string | null> {
  try {
    console.log("[POI Types] Uploading logo for type:", typeId);
    const fileName = `poi-types/${typeId}/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("poi-type-logos")
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("poi-type-logos")
      .getPublicUrl(fileName);

    console.log("[POI Types] Logo uploaded:", urlData.publicUrl);
    return urlData.publicUrl;
  } catch (err) {
    console.error("[POI Types] Error uploading logo:", err);
    return null;
  }
}

// ============================================
// POI FUNCTIONS (Updated)
// ============================================

export async function getPOIs(): Promise<POI[]> {
  try {
    console.log("[POI DB] Fetching visible POIs...");
    const { data, error } = await supabase
      .from("points_of_interest")
      .select(`*, type:type_id(*)`)
      .eq("visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[POI DB] Error fetching POIs:", error.message);
      return [];
    }
    console.log("[POI DB] Fetched", data?.length || 0, 'POIs');
    return data || [];
  } catch (err) {
    console.error("[POI DB] Exception:", err);
    return [];
  }
}

export async function getAllPOIs(): Promise<POI[]> {
  try {
    console.log("[POI DB] Fetching all POIs (admin)...");
    const { data, error } = await supabase
      .from("points_of_interest")
      .select(`*, type:type_id(*)`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[POI DB] Error fetching all POIs:", error.message);
      return [];
    }
    console.log("[POI DB] Fetched", data?.length || 0, 'POIs');
    return data || [];
  } catch (err) {
    console.error("[POI DB] Exception:", err);
    return [];
  }
}

export async function createPOI(poi: Omit<POI, "id" | "created_at" | "updated_at">): Promise<POI | null> {
  try {
    console.log("[POI DB] Creating POI:", poi.name);
    const { data, error } = await supabase
      .from("points_of_interest")
      .insert([{
        name: poi.name,
        description: poi.description,
        latitude: poi.latitude,
        longitude: poi.longitude,
        type_id: poi.type_id,
        visible: poi.visible
      }])
      .select(`*, type:type_id(*)`)
      .single();

    if (error) throw error;
    console.log("[POI DB] Created POI:", data.id);
    return data;
  } catch (err) {
    console.error("[POI DB] Error creating POI:", err);
    return null;
  }
}

export async function updatePOI(id: string, updates: Partial<POI>): Promise<POI | null> {
  try {
    console.log("[POI DB] Updating POI:", id);
    const { data, error } = await supabase
      .from("points_of_interest")
      .update(updates)
      .eq("id", id)
      .select(`*, type:type_id(*)`)
      .single();

    if (error) throw error;
    console.log("[POI DB] Updated POI:", id);
    return data;
  } catch (err) {
    console.error("[POI DB] Error updating POI:", err);
    return null;
  }
}

export async function deletePOI(id: string): Promise<boolean> {
  try {
    console.log("[POI DB] Deleting POI:", id);
    const { error } = await supabase
      .from("points_of_interest")
      .delete()
      .eq("id", id);

    if (error) throw error;
    console.log("[POI DB] Deleted POI:", id);
    return true;
  } catch (err) {
    console.error("[POI DB] Error deleting POI:", err);
    return false;
  }
}

export async function togglePOIVisibility(id: string, visible: boolean): Promise<POI | null> {
  return updatePOI(id, { visible });
}
