import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { normalizeProfileRole } from "../components/admin/adminShared";

/**
 * Rôle admin = ligne `profiles.role` normalisée en « admin » (voir UserManager).
 */
export function useAdminAccess() {
  const { user, loading: authLoading } = useAuth();
  const [resolved, setResolved] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setResolved(true);
      return;
    }

    setResolved(false);
    let cancelled = false;

    void supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || data?.role == null) {
          setIsAdmin(false);
        } else {
          setIsAdmin(normalizeProfileRole(String(data.role)) === "admin");
        }
        setResolved(true);
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const loading = authLoading || (user != null && !resolved);

  return { loading, isAdmin };
}
