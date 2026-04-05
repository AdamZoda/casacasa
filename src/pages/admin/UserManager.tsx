import { useState } from "react";
import { Copy, ExternalLink, Mail, Shield, Trash2, User as UserIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import {
  AdminPageHeader,
  AdminStatusPill,
  AdminTableCard,
  formatAdminDateTime,
  normalizeProfileRole,
  profileRoleLabel,
  type ProfileRole,
} from "../../components/admin/adminShared";

function roleTone(role: ProfileRole): "neutral" | "success" | "warning" | "danger" {
  if (role === "admin") return "danger";
  if (role === "vip") return "warning";
  return "neutral";
}

/** UUID sur une ligne lisible ; l’ID complet reste en title + copie. */
function formatUuidShort(id: string): string {
  const t = id.trim();
  if (t.length <= 14) return t;
  return `${t.slice(0, 8)}…${t.slice(-4)}`;
}

async function copyText(text: string, label: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    alert(`Impossible de copier ${label}.`);
    return false;
  }
}

function CopyIconButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void copyText(text, label).then((ok) => {
          if (ok) {
            setDone(true);
            window.setTimeout(() => setDone(false), 1600);
          }
        });
      }}
      className="inline-flex items-center justify-center size-9 rounded-lg text-text-primary/45 hover:text-brand-gold hover:bg-brand-gold/12 transition-colors shrink-0 border border-transparent hover:border-brand-gold/20"
      title={done ? "Copié" : `Copier ${label}`}
      aria-label={`Copier ${label}`}
    >
      <Copy size={16} strokeWidth={1.75} aria-hidden />
    </button>
  );
}

export function UserManager() {
  const { profiles, deleteProfile } = useAppContext();

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-16">
      <AdminPageHeader
        kicker="Accès"
        title="Utilisateurs"
        subtitle="Profils synchronisés ."
        action={
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-primary/30">
            <Shield size={14} className="text-brand-gold" aria-hidden />
            {profiles.length} profil{profiles.length !== 1 ? "s" : ""}
          </div>
        }
      />

      <AdminTableCard>
        <div className="overflow-x-auto">
          <table className="admin-table w-full text-left border-collapse min-w-[1000px] table-fixed">
            <colgroup>
              <col className="w-[19%]" />
              <col className="w-[20%]" />
              <col className="w-[11%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
              <col className="w-[12%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead>
              <tr>
                <th className="align-bottom">Compte</th>
                <th className="align-bottom">E-mail</th>
                <th className="align-bottom">Rôle</th>
                <th className="align-bottom">Identifiant</th>
                <th className="align-bottom">Photo</th>
                <th className="align-bottom">Créé le</th>
                <th className="text-right align-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => {
                const role = normalizeProfileRole(profile.role);
                const email = (profile.email ?? "").trim() || "—";
                const name = (profile.full_name ?? "").trim() || "—";
                const hasName = name !== "—";
                const displayPrimary = hasName ? name : email;
                const compteCaption = hasName ? "Nom affiché" : "E-mail (nom vide)";
                const avatarUrl = (profile.avatar_url ?? "").trim();
                return (
                  <tr key={profile.id} className="group">
                    <td className="px-4 py-4 md:px-5 md:py-5 align-middle">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="size-11 shrink-0 rounded-xl bg-text-primary/[0.06] ring-1 ring-border-primary/60 flex items-center justify-center text-brand-gold overflow-hidden">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={22} strokeWidth={1.25} aria-hidden />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-text-primary leading-snug truncate" title={displayPrimary}>
                            {displayPrimary}
                          </p>
                          <p className="text-[10px] text-text-primary/50 mt-1 uppercase tracking-[0.12em] font-semibold">
                            {compteCaption}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 md:px-5 md:py-5 align-middle">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="inline-flex items-center justify-center size-8 rounded-lg bg-text-primary/[0.06] text-text-primary/40 shrink-0">
                          <Mail size={15} strokeWidth={1.75} aria-hidden />
                        </span>
                        <span className="text-sm text-text-primary/90 truncate min-w-0 flex-1" title={email}>
                          {email}
                        </span>
                        {email !== "—" ? <CopyIconButton text={email} label="l’e-mail" /> : null}
                      </div>
                    </td>
                    <td className="px-4 py-4 md:px-5 md:py-5 align-middle">
                      <AdminStatusPill tone={roleTone(role)} className="whitespace-nowrap">
                        {profileRoleLabel(role)}
                      </AdminStatusPill>
                    </td>
                    <td className="px-4 py-4 md:px-5 md:py-5 align-middle">
                      <div className="flex items-center gap-1 min-w-0">
                        <code
                          className="text-[11px] font-mono text-text-primary/70 tracking-tight truncate min-w-0 flex-1"
                          title={profile.id}
                        >
                          {formatUuidShort(profile.id)}
                        </code>
                        <CopyIconButton text={profile.id} label="l’identifiant" />
                      </div>
                    </td>
                    <td className="px-4 py-4 md:px-5 md:py-5 align-middle">
                      {avatarUrl ? (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <a
                            href={avatarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-gold hover:text-brand-gold/90 hover:underline truncate min-w-0 flex-1 inline-flex items-center gap-1.5"
                            title={avatarUrl}
                          >
                            <ExternalLink size={14} className="shrink-0 opacity-80" aria-hidden />
                            <span className="truncate">Ouvrir</span>
                          </a>
                          <CopyIconButton text={avatarUrl} label="l’URL de la photo" />
                        </div>
                      ) : (
                        <span className="text-xs text-text-primary/35 italic">Aucune</span>
                      )}
                    </td>
                    <td className="px-4 py-4 md:px-5 md:py-5 align-middle">
                      <time
                        dateTime={profile.created_at || undefined}
                        className="text-xs text-text-primary/60 tabular-nums leading-snug block"
                      >
                        {formatAdminDateTime(profile.created_at)}
                      </time>
                    </td>
                    <td className="px-4 py-4 md:px-5 md:py-5 align-middle text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Supprimer ce profil dans public.profiles ? L’utilisateur Auth peut subsister — gérez aussi auth.users dans Supabase si besoin."
                            )
                          ) {
                            void deleteProfile(profile.id);
                          }
                        }}
                        className="inline-flex items-center justify-center size-10 text-text-primary/35 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/15"
                        aria-label={`Supprimer le profil ${email}`}
                        title="Supprimer le profil"
                      >
                        <Trash2 size={17} strokeWidth={1.75} aria-hidden />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-text-primary/30 text-sm">
                    Aucun profil (vérifiez la table <code className="text-brand-gold/80">profiles</code> et les politiques RLS sur
                    Supabase).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminTableCard>
    </div>
  );
}
