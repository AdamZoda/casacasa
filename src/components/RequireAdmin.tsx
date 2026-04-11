import { type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdminAccess } from "../hooks/useAdminAccess";

export function RequireAdmin({ children }: { children: ReactElement }) {
  const { user, loading: authLoading } = useAuth();
  const { loading: accessLoading, isAdmin } = useAdminAccess();

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
