import { type ReactElement, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdminAccess } from "../hooks/useAdminAccess";

// RequireAdmin: protects admin routes but tolerates short transient auth
// glitches. If the user becomes briefly unauthenticated (e.g., token
// refresh), we wait a short grace period before redirecting to /auth to
// avoid losing in-progress edits due to a transient null session.
export function RequireAdmin({ children }: { children: ReactElement }) {
  const { user, loading: authLoading } = useAuth();
  const { loading: accessLoading, isAdmin } = useAdminAccess();
  const [graceExpired, setGraceExpired] = useState(false);

  useEffect(() => {
    // Reset grace when auth state is loading or user present
    if (authLoading || user) {
      setGraceExpired(false);
      return;
    }

    // Start grace timer when user is null and not loading
    const t = setTimeout(() => setGraceExpired(true), 2500);
    return () => clearTimeout(t);
  }, [authLoading, user]);

  if (authLoading || accessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-brand-gold/30 border-t-brand-gold"
          aria-hidden
        />
        <span className="sr-only">Chargement</span>
      </div>
    );
  }

  // If user is missing but grace period not expired yet, show spinner and
  // allow time for auth to stabilize (prevents instant redirect on brief
  // auth flickers).
  if (!user && !graceExpired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-brand-gold/30 border-t-brand-gold"
          aria-hidden
        />
        <span className="sr-only">Vérification de session…</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
