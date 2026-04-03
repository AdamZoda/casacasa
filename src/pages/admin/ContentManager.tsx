import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Plus, Trash2 } from "lucide-react";

export function ContentManager() {
  const { universes, activities, addUniverse, updateUniverse, deleteUniverse, addActivity, updateActivity, deleteActivity } = useAppContext();
  const [activeTab, setActiveTab] = useState<'universes' | 'activities'>('universes');

  // Simple form states
  const [editingUniverse, setEditingUniverse] = useState<any>(null);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  
  const [newUniverse, setNewUniverse] = useState({ name: '', location: '', description: '', heroImage: '' });
  const [newActivity, setNewActivity] = useState({ universeId: '', title: '', category: '', price: '', description: '', image: '' });

  const handleAddUniverse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUniverse) {
      updateUniverse({ ...editingUniverse, ...newUniverse });
      setEditingUniverse(null);
    } else {
      addUniverse({
        id: `u-${Date.now()}`,
        name: newUniverse.name,
        location: newUniverse.location,
        description: newUniverse.description,
        heroImage: newUniverse.heroImage,
        flag: "🏳️", // Default flag
        gallery: [newUniverse.heroImage]
      });
    }
    setNewUniverse({ name: '', location: '', description: '', heroImage: '' });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity) {
      updateActivity({ ...editingActivity, ...newActivity });
      setEditingActivity(null);
    } else {
      addActivity({
        id: `a-${Date.now()}`,
        universeId: newActivity.universeId,
        title: newActivity.title,
        category: newActivity.category,
        price: newActivity.price,
        description: newActivity.description,
        image: newActivity.image
      });
    }
    setNewActivity({ universeId: '', title: '', category: '', price: '', description: '', image: '' });
  };

  return (
    <div>
      <h2 className="text-3xl font-serif mb-8">Content Management</h2>

      <div className="flex gap-4 mb-8 border-b border-border-primary pb-4">
        <button 
          onClick={() => setActiveTab('universes')}
          className={`px-4 py-2 text-sm uppercase tracking-widest transition-colors ${activeTab === 'universes' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-text-primary/60 hover:text-text-primary'}`}
        >
          Universes (Countries)
        </button>
        <button 
          onClick={() => setActiveTab('activities')}
          className={`px-4 py-2 text-sm uppercase tracking-widest transition-colors ${activeTab === 'activities' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-text-primary/60 hover:text-text-primary'}`}
        >
          Activities
        </button>
      </div>

      {activeTab === 'universes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add Form */}
          <div className="bg-bg-primary p-6 rounded-lg border border-border-primary">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus size={20} /> {editingUniverse ? 'Edit Universe' : 'Add New Universe'}</h3>
            <form onSubmit={handleAddUniverse} className="flex flex-col gap-4">
              <input type="text" placeholder="Name (e.g. Moroccan Privilege)" value={newUniverse.name} onChange={e => setNewUniverse({...newUniverse, name: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <input type="text" placeholder="Location (e.g. Marrakech, Morocco)" value={newUniverse.location} onChange={e => setNewUniverse({...newUniverse, location: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <textarea placeholder="Description" value={newUniverse.description} onChange={e => setNewUniverse({...newUniverse, description: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold h-24" required />
              <input type="url" placeholder="Hero Image URL" value={newUniverse.heroImage} onChange={e => setNewUniverse({...newUniverse, heroImage: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <div className="flex gap-4">
                {editingUniverse && (
                  <button type="button" onClick={() => { setEditingUniverse(null); setNewUniverse({ name: '', location: '', description: '', heroImage: '' }); }} className="flex-1 bg-white/5 text-text-primary font-medium py-3 mt-2 hover:bg-white/10 transition-colors">Cancel</button>
                )}
                <button type="submit" className="flex-1 bg-brand-gold text-brand-black font-medium py-3 mt-2 hover:bg-text-primary hover:text-bg-primary transition-colors">{editingUniverse ? 'Save Changes' : 'Create Universe'}</button>
              </div>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 className="text-xl font-serif mb-6">Existing Universes</h3>
            <div className="flex flex-col gap-4">
              {universes.map(u => (
                <div key={u.id} className="bg-bg-primary p-4 rounded-lg border border-border-primary flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={u.heroImage} alt={u.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-medium">{u.name}</h4>
                      <p className="text-xs text-text-primary/60">{u.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingUniverse(u);
                        setNewUniverse({ name: u.name, location: u.location, description: u.description, heroImage: u.heroImage });
                      }}
                      className="p-2 text-text-primary/60 hover:text-brand-gold transition-colors"
                    >
                      <Plus size={18} className="rotate-45" /> {/* Using Plus rotated as a placeholder for Edit if needed, but I'll use text or other icons if I had more imports */}
                    </button>
                    <button onClick={() => deleteUniverse(u.id)} className="p-2 text-text-primary/60 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add Form */}
          <div className="bg-bg-primary p-6 rounded-lg border border-border-primary">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus size={20} /> {editingActivity ? 'Edit Activity' : 'Add New Activity'}</h3>
            <form onSubmit={handleAddActivity} className="flex flex-col gap-4">
              <select value={newActivity.universeId} onChange={e => setNewActivity({...newActivity, universeId: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold text-text-primary" required>
                <option value="" disabled className="text-bg-primary">Select Universe...</option>
                {universes.map(u => <option key={u.id} value={u.id} className="text-bg-primary">{u.name}</option>)}
              </select>
              <input type="text" placeholder="Title (e.g. VIP Desert Camp)" value={newActivity.title} onChange={e => setNewActivity({...newActivity, title: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <input type="text" placeholder="Category (e.g. Villas & Immobilier)" value={newActivity.category} onChange={e => setNewActivity({...newActivity, category: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <input type="text" placeholder="Price (e.g. Sur devis)" value={newActivity.price} onChange={e => setNewActivity({...newActivity, price: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <textarea placeholder="Description" value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold h-24" required />
              <input type="url" placeholder="Image URL" value={newActivity.image} onChange={e => setNewActivity({...newActivity, image: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <div className="flex gap-4">
                {editingActivity && (
                  <button type="button" onClick={() => { setEditingActivity(null); setNewActivity({ universeId: '', title: '', category: '', price: '', description: '', image: '' }); }} className="flex-1 bg-white/5 text-text-primary font-medium py-3 mt-2 hover:bg-white/10 transition-colors">Cancel</button>
                )}
                <button type="submit" className="flex-1 bg-brand-gold text-brand-black font-medium py-3 mt-2 hover:bg-text-primary hover:text-bg-primary transition-colors">{editingActivity ? 'Save Changes' : 'Create Activity'}</button>
              </div>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 className="text-xl font-serif mb-6">Existing Activities</h3>
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
              {activities.map(a => (
                <div key={a.id} className="bg-bg-primary p-4 rounded-lg border border-border-primary flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={a.image} alt={a.title} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <h4 className="font-medium text-sm">{a.title}</h4>
                      <p className="text-xs text-brand-gold">{universes.find(u => u.id === a.universeId)?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingActivity(a);
                        setNewActivity({ universeId: a.universeId, title: a.title, category: a.category, price: a.price, description: a.description, image: a.image });
                      }}
                      className="p-2 text-text-primary/60 hover:text-brand-gold transition-colors"
                    >
                      <Plus size={18} className="rotate-45" />
                    </button>
                    <button onClick={() => deleteActivity(a.id)} className="p-2 text-text-primary/60 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
