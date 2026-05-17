import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { normalizeProfileRole } from "../components/admin/adminShared";

// Shared in-memory cache to avoid repeated role lookups for the same user
// across multiple components/hooks mounts.
const adminRoleCache = new Map<string, boolean>();
const adminRoleInflight = new Map<string, Promise<boolean>>();

async function fetchAdminRole(userId: string): Promise<boolean> {
  const cached = adminRoleCache.get(userId);
  if (cached != null) return cached;

  const inflight = adminRoleInflight.get(userId);
  if (inflight) return inflight;

  const request = (async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      const isAdmin = !error && data?.role != null && normalizeProfileRole(String(data.role)) === "admin";
      adminRoleCache.set(userId, isAdmin);
      return isAdmin;
    } catch {
      return false;
    } finally {
      adminRoleInflight.delete(userId);
    }
  })();

  adminRoleInflight.set(userId, request);
  return request;
}

/**
 * Rôle admin = ligne `profiles.role` normalisée en « admin » (voir UserManager).
 */
export function useAdminAccess() {
  const { user, loading: authLoading } = useAuth();
  const [resolved, setResolved] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (authLoading) return;

    if (!userId) {
      setIsAdmin(false);
      setResolved(true);
      return;
    }

    const cached = adminRoleCache.get(userId);
    if (cached != null) {
      setIsAdmin(cached);
      setResolved(true);
      return;
    }

    setResolved(false);
    let cancelled = false;

    void fetchAdminRole(userId).then((nextIsAdmin) => {
        if (cancelled) return;
        setIsAdmin(nextIsAdmin);
        setResolved(true);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading]);

  const loading = authLoading || (userId != null && !resolved);

  return { loading, isAdmin };
}
