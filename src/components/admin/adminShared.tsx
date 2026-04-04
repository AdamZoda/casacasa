import type { ReactNode } from "react";

/** Rôles attendus par la contrainte SQL Supabase (snake_case / lowercase). */
export const PROFILE_ROLES = ["member", "vip", "admin"] as const;
export type ProfileRole = (typeof PROFILE_ROLES)[number];

export function normalizeProfileRole(role: string | undefined | null): ProfileRole {
  const r = (role ?? "member").toLowerCase();
  return PROFILE_ROLES.includes(r as ProfileRole) ? (r as ProfileRole) : "member";
}

export function profileRoleLabel(role: ProfileRole): string {
  switch (role) {
    case "admin":
      return "Admin";
    case "vip":
      return "VIP";
    default:
      return "Membre";
  }
}

export function formatAdminDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleDateString("fr-FR");
}

type AdminPageHeaderProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AdminPageHeader({ kicker, title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-2">
      <div>
        {kicker && (
          <p className="text-[10px] tracking-[0.45em] font-black text-brand-gold uppercase mb-3 italic">{kicker}</p>
        )}
        <h2 className="text-3xl md:text-4xl font-serif mb-2">{title}</h2>
        {subtitle && (
          <p className="text-sm text-text-primary/40 uppercase tracking-widest max-w-xl">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
