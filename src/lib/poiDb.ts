import { supabase } from "./supabase";

export interface POIType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  emoji: string;
  color: string;
  logo_url?: string;
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
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export async function getPOIs(): Promise<POI[]> {
  try {
    console.log("[POI DB] Fetching visible POIs from Supabase...");
    const { data, error } = await supabase
      .from("points_of_interest")
      .select("*")
      .eq("visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[POI DB] Error fetching POIs:", error.message, error.code);
      console.error("[POI DB] Full error details:", error);
      return [];
    }
    console.log("[POI DB] Successfully fetched", data?.length || 0, 'POIs');
    return data || [];
  } catch (err) {
    console.error("[POI DB] Exception fetching POIs:", err);
    return [];
  }
}

export async function getAllPOIs(): Promise<POI[]> {
  try {
    console.log("[POI DB] Fetching all POIs from Supabase (admin)...");
    const { data, error } = await supabase
      .from("points_of_interest")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[POI DB] Error fetching all POIs:", error.message, error.code);
      console.error("[POI DB] Full error details:", error);
      return [];
    }
    console.log("[POI DB] Successfully fetched", data?.length || 0, 'POIs (admin)');
    return data || [];
  } catch (err) {
    console.error("[POI DB] Exception fetching all POIs:", err);
    return [];
  }
}

export async function createPOI(poi: Omit<POI, "id" | "created_at" | "updated_at">): Promise<POI | null> {
  try {
    console.log("[POI DB] Creating new POI:", poi);
    const { data, error } = await supabase
      .from("points_of_interest")
      .insert([poi])
      .select()
      .single();

    if (error) {
      console.error("[POI DB] Error creating POI:", error.message, error.code);
      console.error("[POI DB] Full error details:", error);
      return null;
    }
    console.log("[POI DB] Successfully created POI:", data.id);
    return data;
  } catch (err) {
    console.error("[POI DB] Exception creating POI:", err);
    return null;
  }
}

export async function updatePOI(id: string, updates: Partial<POI>): Promise<POI | null> {
  try {
    console.log("[POI DB] Updating POI:", id, updates);
    const { data, error } = await supabase
      .from("points_of_interest")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[POI DB] Error updating POI:", error.message, error.code);
      console.error("[POI DB] Full error details:", error);
      return null;
    }
    console.log("[POI DB] Successfully updated POI:", id);
    return data;
  } catch (err) {
    console.error("[POI DB] Exception updating POI:", err);
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

    if (error) {
      console.error("[POI DB] Error deleting POI:", error.message, error.code);
      console.error("[POI DB] Full error details:", error);
      return false;
    }
    console.log("[POI DB] Successfully deleted POI:", id);
    return true;
  } catch (err) {
    console.error("[POI DB] Exception deleting POI:", err);
    return false;
  }
}

export async function togglePOIVisibility(id: string, visible: boolean): Promise<POI | null> {
  return updatePOI(id, { visible });
}

// POI Type Functions
export async function getAllPOITypes(): Promise<POIType[]> {
  try {
    console.log("[POI DB] Fetching all POI types...");
    const { data, error } = await supabase
      .from("poi_types")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[POI DB] Error fetching POI types:", error.message);
      return [];
    }
    console.log("[POI DB] Successfully fetched", data?.length || 0, 'POI types');
    return data || [];
  } catch (err) {
    console.error("[POI DB] Exception fetching POI types:", err);
    return [];
  }
}

export async function createPOIType(type: Omit<POIType, "id" | "created_at" | "updated_at">): Promise<POIType | null> {
  try {
    console.log("[POI DB] Creating new POI type:", type);
    const { data, error } = await supabase
      .from("poi_types")
      .insert([type])
      .select()
      .single();

    if (error) {
      console.error("[POI DB] Error creating POI type:", error.message);
      return null;
    }
    console.log("[POI DB] Successfully created POI type:", data.id);
    return data;
  } catch (err) {
    console.error("[POI DB] Exception creating POI type:", err);
    return null;
  }
}

export async function updatePOIType(id: string, updates: Partial<POIType>): Promise<POIType | null> {
  try {
    console.log("[POI DB] Updating POI type:", id, updates);
    const { data, error } = await supabase
      .from("poi_types")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[POI DB] Error updating POI type:", error.message);
      return null;
    }
    console.log("[POI DB] Successfully updated POI type:", id);
    return data;
  } catch (err) {
    console.error("[POI DB] Exception updating POI type:", err);
    return null;
  }
}

export async function deletePOIType(id: string): Promise<boolean> {
  try {
    console.log("[POI DB] Deleting POI type:", id);
    const { error } = await supabase
      .from("poi_types")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[POI DB] Error deleting POI type:", error.message);
      return false;
    }
    console.log("[POI DB] Successfully deleted POI type:", id);
    return true;
  } catch (err) {
    console.error("[POI DB] Exception deleting POI type:", err);
    return false;
  }
}

export async function uploadPOITypeLogo(file: File, typeId: string): Promise<string | null> {
  try {
    console.log("[POI DB] Uploading logo for POI type:", typeId);
    
    const fileName = `poi-logos/${typeId}-${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("media")
      .upload(fileName, file, { upsert: true });

    if (error) {
      console.error("[POI DB] Error uploading logo:", error.message);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);

    console.log("[POI DB] Successfully uploaded logo:", publicUrl.publicUrl);
    return publicUrl.publicUrl;
  } catch (err) {
    console.error("[POI DB] Exception uploading logo:", err);
    return null;
  }
}
