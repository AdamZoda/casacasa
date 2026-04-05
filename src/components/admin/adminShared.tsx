import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

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

export function formatAdminDateTime(iso: string | undefined | null): string {
  if (!iso) return "—";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

type AdminPageHeaderProps = {
  kicker?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function AdminPageHeader({ kicker, title, subtitle, action }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-border-primary/60">
      <div className="min-w-0">
        {kicker && (
          <p className="text-[10px] tracking-[0.45em] font-black text-brand-gold uppercase mb-3 italic">{kicker}</p>
        )}
        <h2 className="text-3xl md:text-4xl font-serif mb-2 text-balance">{title}</h2>
        {subtitle && (
          <p className="text-sm text-text-primary/45 uppercase tracking-widest max-w-2xl leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

type AdminCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "md" | "lg";
};

const cardPadding = {
  none: "",
  md: "p-6 md:p-8",
  lg: "p-8 md:p-10",
};

/** Carte standard du panneau (ombre + bordure + rayon). */
export function AdminCard({ children, className, padding = "lg" }: AdminCardProps) {
  return <div className={cn("admin-card", cardPadding[padding], className)}>{children}</div>;
}

/** Enveloppe tableau : même surface que AdminCard, sans padding interne. */
export function AdminTableCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("admin-card overflow-hidden p-0", className)}>{children}</div>;
}

type StatusTone = "neutral" | "success" | "warning" | "danger";

const statusToneClass: Record<StatusTone, string> = {
  neutral: "border-brand-gold/25 text-brand-gold bg-brand-gold/8",
  success: "border-emerald-500/25 text-emerald-600 dark:text-emerald-400 bg-emerald-500/8",
  warning: "border-amber-500/25 text-amber-700 dark:text-amber-400 bg-amber-500/8",
  danger: "border-red-500/25 text-red-600 dark:text-red-400 bg-red-500/8",
};

export function AdminStatusPill({
  children,
  tone = "neutral",
  className,
  icon,
}: {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
  /** Icône optionnelle (ex. horloge pour « en attente »). */
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[8px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full border",
        statusToneClass[tone],
        className
      )}
    >
      {icon ? <span className="shrink-0 opacity-95 [&_svg]:size-3">{icon}</span> : null}
      {children}
    </span>
  );
}

export function adminReservationStatusTone(status: string): StatusTone {
  if (status === "confirmed") return "success";
  if (status === "cancelled") return "danger";
  return "neutral";
}

export function adminOrderStatusTone(status: string): StatusTone {
  if (status === "completed") return "success";
  if (status === "cancelled") return "danger";
  return "neutral";
}
