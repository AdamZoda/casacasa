import { supabase } from "./supabase";

export interface POI {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  type: "toilettes" | "parking" | "restaurant" | "shop" | "other";
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
