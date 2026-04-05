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
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-6 pb-4 md:pb-6 border-b border-border-primary/60">
      <div className="min-w-0">
        {kicker && (
          <p className="mb-1.5 text-[8px] font-black uppercase italic tracking-[0.2em] text-brand-gold sm:mb-2 sm:text-[9px] sm:tracking-[0.35em] md:text-[10px] md:tracking-[0.45em]">
            {kicker}
          </p>
        )}
        <h2 className="text-balance font-serif text-xl leading-snug sm:text-2xl sm:leading-snug md:text-3xl md:leading-tight lg:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[11px] font-normal normal-case leading-relaxed tracking-normal text-text-primary/50 sm:mt-2 sm:text-xs md:uppercase md:tracking-wider md:text-text-primary/45 lg:tracking-widest">
            {subtitle}
          </p>
        )}
      </div>
      {action ? <div className="w-full shrink-0 md:w-auto md:max-w-[min(100%,24rem)]">{action}</div> : null}
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
  md: "p-4 sm:p-5 md:p-6 lg:p-8",
  lg: "p-4 sm:p-6 md:p-7 lg:p-10",
};

/** Carte standard du panneau (ombre + bordure + rayon). */
export function AdminCard({ children, className, padding = "lg" }: AdminCardProps) {
  return <div className={cn("admin-card", cardPadding[padding], className)}>{children}</div>;
}

/** Enveloppe tableau : même surface que AdminCard, sans padding interne. */
export function AdminTableCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("admin-card overflow-hidden p-0 max-md:rounded-xl", className)}>{children}</div>
  );
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
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[8px] sm:font-black sm:tracking-widest",
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
