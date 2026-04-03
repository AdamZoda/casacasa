import React from 'react';
import { Mail, Shield, Trash2, User as UserIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

export function UserManager() {
  const { profiles, updateProfileRole, deleteProfile } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">User Management</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">Gérez vos membres et leurs privilèges en temps réel</p>
        </div>
      </div>

      <div className="bg-bg-primary border border-border-primary overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-text-primary/5 border-b border-border-primary">
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Utilisateur</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Rôle</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Inscrit le</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {profiles.map((profile) => (
              <tr key={profile.id} className="hover:bg-text-primary/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-text-primary/5 border border-border-primary flex items-center justify-center text-brand-gold">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{profile.full_name || 'Sans nom'}</p>
                      <p className="text-[10px] text-text-primary/30 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Mail size={10} /> {profile.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <select 
                    value={profile.role}
                    onChange={(e) => updateProfileRole(profile.id, e.target.value)}
                    className="bg-transparent text-[10px] uppercase tracking-widest text-brand-gold border border-brand-gold/20 px-2 py-1 outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="Member" className="bg-bg-primary">Member</option>
                    <option value="VIP" className="bg-bg-primary">VIP</option>
                    <option value="Admin" className="bg-bg-primary">Admin</option>
                  </select>
                </td>
                <td className="p-6 text-[10px] uppercase tracking-widest text-text-primary/40">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="p-6 text-right">
                  <button 
                    onClick={() => {
                      if (window.confirm("Supprimer définitivement cet utilisateur ?")) {
                        deleteProfile(profile.id);
                      }
                    }}
                    className="p-2 text-text-primary/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {profiles.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-text-primary/20 italic text-sm">
                  Aucun utilisateur trouvé dans la base de données.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
