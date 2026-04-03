import React from 'react';
import { Users, Mail, Shield, MoreVertical, Trash2, CheckCircle, XCircle } from "lucide-react";

export function UserManager() {
  // Mock users for now
  const users = [
    { id: '1', name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'Member', status: 'Active', joined: '2024-01-15', avatar: 'JD' },
    { id: '2', name: 'Marie Curie', email: 'marie.c@science.fr', role: 'VIP', status: 'Active', joined: '2024-02-20', avatar: 'MC' },
    { id: '3', name: 'Admin User', email: 'admin@casaprivilege.com', role: 'Super Admin', status: 'Active', joined: '2023-12-01', avatar: 'AD' },
    { id: '4', name: 'Sidi Mohamed', email: 'sidi.m@luxury.ma', role: 'VIP', status: 'Pending', joined: '2024-03-28', avatar: 'SM' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">User Management</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">View and manage registered members and roles</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-brand-gold text-brand-black px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-text-primary hover:text-bg-primary transition-all">
            Invite New User
          </button>
        </div>
      </div>

      <div className="bg-bg-primary border border-border-primary overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-text-primary/5 border-b border-border-primary">
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">User</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Role</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Status</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Joined</th>
              <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-text-primary/40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-primary/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-text-primary/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-text-primary/5 border border-border-primary flex items-center justify-center text-text-primary/50 text-xs font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-[10px] text-text-primary/30 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Mail size={10} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className={user.role.includes('Admin') ? 'text-brand-gold' : 'text-text-primary/30'} />
                    <span className={`text-[10px] uppercase tracking-widest ${user.role.includes('Admin') ? 'text-brand-gold' : 'text-text-primary/60'}`}>
                      {user.role}
                    </span>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${
                    user.status === 'Active' ? 'bg-green-500/10 text-green-500' : 
                    user.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-6 text-sm text-text-primary/50">{user.joined}</td>
                <td className="p-6">
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-text-primary/5 text-text-primary/30 hover:text-brand-gold transition-all" title="Edit Role">
                      <Shield size={16} />
                    </button>
                    <button className="p-2 bg-text-primary/5 text-text-primary/30 hover:text-red-500 transition-all" title="Delete User">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 bg-text-primary/5 text-text-primary/30 hover:text-text-primary transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
