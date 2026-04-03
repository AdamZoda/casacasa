import React, { useState } from 'react';
import { useAppContext } from "../../context/AppContext";
import { Save, Globe, Mail, Phone, MapPin, Instagram, Facebook, Linkedin, ShieldAlert } from "lucide-react";

export function SettingsView() {
  const { settings, updateSettings } = useAppContext();
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    alert('Settings updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Site Settings</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">Global configuration for Casa Privilege</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="bg-brand-gold text-brand-black px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-text-primary hover:text-bg-primary transition-all flex items-center gap-3"
        >
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-bg-primary border border-border-primary p-8 space-y-8">
            <h3 className="text-xl font-serif flex items-center gap-3">
              <Globe size={20} className="text-brand-gold" /> General Information
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Site Name</label>
                <input 
                  type="text" 
                  value={formData.siteName}
                  onChange={(e) => setFormData({...formData, siteName: e.target.value})}
                  className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={16} />
                  <input 
                    type="email" 
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="w-full bg-text-primary/5 border border-border-primary py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={16} />
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-text-primary/5 border border-border-primary py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={16} />
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-text-primary/5 border border-border-primary py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-primary border border-border-primary p-8 space-y-8">
            <h3 className="text-xl font-serif flex items-center gap-3 text-red-500">
              <ShieldAlert size={20} /> Danger Zone
            </h3>
            <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20">
              <div>
                <p className="text-sm font-medium">Maintenance Mode</p>
                <p className="text-[10px] text-text-primary/40 uppercase tracking-widest mt-1">Take the site offline for updates</p>
              </div>
              <button 
                onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
                className={`w-12 h-6 rounded-full transition-all relative ${formData.maintenanceMode ? 'bg-red-500' : 'bg-text-primary/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.maintenanceMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-bg-primary border border-border-primary p-8 space-y-8">
          <h3 className="text-xl font-serif flex items-center gap-3">
            <Instagram size={20} className="text-brand-gold" /> Social Connections
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Instagram URL</label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={16} />
                <input 
                  type="url" 
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, instagram: e.target.value}})}
                  className="w-full bg-text-primary/5 border border-border-primary py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Facebook URL</label>
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={16} />
                <input 
                  type="url" 
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, facebook: e.target.value}})}
                  className="w-full bg-text-primary/5 border border-border-primary py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-primary/40">LinkedIn URL</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary/30" size={16} />
                <input 
                  type="url" 
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                  className="w-full bg-text-primary/5 border border-border-primary py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
