import { Mail, Shield, Trash2, User as UserIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { AdminPageHeader, PROFILE_ROLES, formatAdminDate, normalizeProfileRole, profileRoleLabel, type ProfileRole } from "../../components/admin/adminShared";

export function UserManager() {
  const { profiles, updateProfileRole, deleteProfile } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <AdminPageHeader
        title="Utilisateurs"
        subtitle="Rôles alignés sur Supabase : member, vip, admin"
        action={
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-primary/30">
            <Shield size={14} className="text-brand-gold" aria-hidden />
            {profiles.length} profil{profiles.length !== 1 ? "s" : ""}
          </div>
        }
      />

      <div className="bg-bg-primary border border-border-primary overflow-hidden rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-text-primary/5 border-b border-border-primary">
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Utilisateur</th>
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Rôle</th>
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Inscrit le</th>
                <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary/50">
              {profiles.map((profile) => {
                const role = normalizeProfileRole(profile.role);
                return (
                  <tr key={profile.id} className="hover:bg-text-primary/[0.02] transition-colors group">
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-text-primary/5 border border-border-primary flex items-center justify-center text-brand-gold overflow-hidden shrink-0">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={20} aria-hidden />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{profile.full_name || "Sans nom"}</p>
                          <p className="text-[10px] text-text-primary/30 uppercase tracking-widest mt-1 flex items-center gap-1 truncate">
                            <Mail size={10} aria-hidden /> {profile.email ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <label className="sr-only">Rôle pour {profile.email}</label>
                      <select
                        value={role}
                        onChange={(e) => updateProfileRole(profile.id, e.target.value as ProfileRole)}
                        className="bg-transparent text-[10px] uppercase tracking-widest text-brand-gold border border-brand-gold/20 px-2 py-1.5 outline-none focus:border-brand-gold transition-colors max-w-[140px]"
                      >
                        {PROFILE_ROLES.map((r) => (
                          <option key={r} value={r} className="bg-bg-primary text-text-primary">
                            {profileRoleLabel(r)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-[10px] uppercase tracking-widest text-text-primary/40 whitespace-nowrap">
                      {formatAdminDate(profile.created_at)}
                    </td>
                    <td className="p-5 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Supprimer définitivement cet utilisateur ?")) {
                            deleteProfile(profile.id);
                          }
                        }}
                        className="p-2 text-text-primary/20 hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10"
                        aria-label={`Supprimer ${profile.email ?? profile.id}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-text-primary/30 text-sm">
                    Aucun profil (vérifiez la table <code className="text-brand-gold/80">profiles</code> et les politiques RLS sur
                    Supabase).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
