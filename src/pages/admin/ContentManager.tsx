import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import { uploadImage } from "../../lib/storage";

export function ContentManager() {
  const { universes, activities, products, journalPosts, addUniverse, updateUniverse, deleteUniverse, addActivity, updateActivity, deleteActivity, addProduct, updateProduct, deleteProduct, addJournalPost, updateJournalPost, deleteJournalPost } = useAppContext();
  const [activeTab, setActiveTab] = useState<'universes' | 'activities' | 'products' | 'journal'>('universes');

  // Simple form states
  const [editingUniverse, setEditingUniverse] = useState<any>(null);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingJournal, setEditingJournal] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [newUniverse, setNewUniverse] = useState({ name: '', location: '', description: '', heroImage: '', flag: '', galleryUrls: '' });
  const [newActivity, setNewActivity] = useState({ universeId: '', title: '', category: '', price: '', description: '', image: '', minAdvanceDays: 0 });
  const [newProduct, setNewProduct] = useState({ title: '', category: '', price: '', oldPrice: '', description: '', image: '', isExclusive: false });
  const [newJournal, setNewJournal] = useState({ title: '', category: '', date: '', image: '', excerpt: '', content: '' });

  const handleAddUniverse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      let heroImageUrl = newUniverse.heroImage;
      // If a file was selected for hero (we'll handle file selection in the input)
      // For now, let's assume we handle the file in the change event to get the URL
      
      const gallery = newUniverse.galleryUrls.split(',').map(url => url.trim()).filter(url => url !== '');
      
      if (editingUniverse) {
        updateUniverse({ ...editingUniverse, ...newUniverse, gallery });
        setEditingUniverse(null);
      } else {
        addUniverse({
          id: `u-${Date.now()}`,
          name: newUniverse.name,
          location: newUniverse.location,
          description: newUniverse.description,
          heroImage: newUniverse.heroImage,
          flag: newUniverse.flag || "🏳️",
          gallery: gallery.length > 0 ? gallery : [newUniverse.heroImage]
        });
      }
      setNewUniverse({ name: '', location: '', description: '', heroImage: '', flag: '', galleryUrls: '' });
    } catch (err) {
      alert("Erreur lors de l'ajout: " + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (file: File, callback: (url: string) => void) => {
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      callback(url);
    } catch (err) {
      alert("Erreur upload: " + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
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
        image: newActivity.image,
        description: newActivity.description,
        minAdvanceDays: newActivity.minAdvanceDays
      });
    }
    setNewActivity({ universeId: newActivity.universeId, title: '', category: '', price: '', description: '', image: '', minAdvanceDays: 0 });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...newProduct, price: Number(newProduct.price), oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined });
      setEditingProduct(null);
    } else {
      addProduct({
        id: `p-${Date.now()}`,
        title: newProduct.title,
        category: newProduct.category,
        price: Number(newProduct.price),
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined,
        description: newProduct.description,
        image: newProduct.image,
        isExclusive: newProduct.isExclusive
      });
    }
    setNewProduct({ title: '', category: '', price: '', oldPrice: '', description: '', image: '', isExclusive: false });
  };

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingJournal) {
      updateJournalPost({ ...editingJournal, ...newJournal });
      setEditingJournal(null);
    } else {
      addJournalPost({
        id: `j-${Date.now()}`,
        title: newJournal.title,
        category: newJournal.category,
        date: newJournal.date || new Date().toISOString().split('T')[0],
        image: newJournal.image,
        excerpt: newJournal.excerpt,
        content: newJournal.content
      });
    }
    setNewJournal({ title: '', category: '', date: '', image: '', excerpt: '', content: '' });
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
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 text-sm uppercase tracking-widest transition-colors ${activeTab === 'products' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-text-primary/60 hover:text-text-primary'}`}
        >
          Stores (Products)
        </button>
        <button 
          onClick={() => setActiveTab('journal')}
          className={`px-4 py-2 text-sm uppercase tracking-widest transition-colors ${activeTab === 'journal' ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-text-primary/60 hover:text-text-primary'}`}
        >
          Journal
        </button>
      </div>

      {activeTab === 'universes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add Form */}
          <div className="bg-bg-primary p-6 rounded-lg border border-border-primary">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus size={20} /> {editingUniverse ? 'Edit Universe' : 'Add New Universe'}</h3>
            <form onSubmit={handleAddUniverse} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input type="text" placeholder="Drapeau (ex: MA, FR)" value={newUniverse.flag} onChange={e => setNewUniverse({...newUniverse, flag: e.target.value})} className="w-1/3 bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
                <input type="text" placeholder="Name (e.g. Moroccan Privilege)" value={newUniverse.name} onChange={e => setNewUniverse({...newUniverse, name: e.target.value})} className="w-2/3 bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              </div>
              <input type="text" placeholder="Location (e.g. Marrakech, Morocco)" value={newUniverse.location} onChange={e => setNewUniverse({...newUniverse, location: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <textarea placeholder="Description" value={newUniverse.description} onChange={e => setNewUniverse({...newUniverse, description: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold h-24" required />
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Hero Image</label>
                <div className="flex gap-4 items-center">
                  {newUniverse.heroImage && <img src={newUniverse.heroImage} className="w-12 h-12 object-cover border border-border-primary" />}
                  <label className="flex-grow flex items-center justify-center gap-2 bg-text-primary/5 border border-dashed border-border-primary p-4 text-xs cursor-pointer hover:border-brand-gold transition-colors">
                    <Upload size={14} />
                    <span>{isUploading ? 'Chargement...' : 'Choisir la photo principale'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      if (e.target.files?.[0]) await handleFileUpload(e.target.files[0], (url) => setNewUniverse({...newUniverse, heroImage: url}));
                    }} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Galerie Photos</label>
                <label className="w-full flex items-center justify-center gap-2 bg-text-primary/5 border border-dashed border-border-primary p-4 text-xs cursor-pointer hover:border-brand-gold transition-colors">
                  <Plus size={14} />
                  <span>Ajouter des photos à la galerie</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={async (e) => {
                    if (e.target.files) {
                      const urls = [...(newUniverse.galleryUrls ? newUniverse.galleryUrls.split(', ') : [])];
                      for (const file of Array.from(e.target.files)) {
                        const url = await uploadImage(file as File);
                        urls.push(url);
                      }
                      setNewUniverse({...newUniverse, galleryUrls: urls.join(', ')});
                    }
                  }} />
                </label>
                {newUniverse.galleryUrls && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {newUniverse.galleryUrls.split(', ').map((u, i) => (
                      <img key={i} src={u} className="w-10 h-10 object-cover opacity-50" />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                {editingUniverse && (
                  <button type="button" onClick={() => { setEditingUniverse(null); setNewUniverse({ name: '', location: '', description: '', heroImage: '', flag: '', galleryUrls: '' }); }} className="flex-1 bg-white/5 text-text-primary font-medium py-3 mt-2 hover:bg-white/10 transition-colors">Cancel</button>
                )}
                 <button type="submit" disabled={isUploading} className="flex-1 bg-brand-gold text-brand-black font-medium py-3 mt-2 hover:bg-text-primary hover:text-bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isUploading && <Loader2 size={16} className="animate-spin" />}
                  {editingUniverse ? 'Save Changes' : 'Create Universe'}
                </button>
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
                        setNewUniverse({ name: u.name, location: u.location, description: u.description, heroImage: u.heroImage, flag: u.flag || '', galleryUrls: u.gallery ? u.gallery.join(', ') : '' });
                      }}
                      className="p-2 text-text-primary/60 hover:text-brand-gold transition-colors"
                    >
                      <Plus size={18} className="rotate-45" />
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
              <div className="flex gap-4">
                <input type="text" placeholder="Catégorie (ex: Villas)" value={newActivity.category} onChange={e => setNewActivity({...newActivity, category: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold w-1/2" required />
                <input type="text" placeholder="Prix" value={newActivity.price} onChange={e => setNewActivity({...newActivity, price: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold w-1/2" required />
              </div>
              <div className="flex gap-4 items-center">
                <input type="number" min="0" placeholder="Jours à l'avance (ex: 2)" value={newActivity.minAdvanceDays} onChange={e => setNewActivity({...newActivity, minAdvanceDays: parseInt(e.target.value) || 0})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold w-1/2" title="Nombre de jours minimum recommandés pour réserver cette activité" />
                <span className="text-xs text-text-primary/60 w-1/2">Délai minimum (en jours)</span>
              </div>
               <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Image de l'activité</label>
                <div className="flex gap-4 items-center">
                  {newActivity.image && <img src={newActivity.image} className="w-12 h-12 object-cover border border-border-primary" />}
                  <label className="flex-grow flex items-center justify-center gap-2 bg-text-primary/5 border border-dashed border-border-primary p-4 text-xs cursor-pointer hover:border-brand-gold transition-colors">
                    <Upload size={14} />
                    <span>{isUploading ? 'Chargement...' : 'Choisir la photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      if (e.target.files?.[0]) await handleFileUpload(e.target.files[0], (url) => setNewActivity({...newActivity, image: url}));
                    }} />
                  </label>
                </div>
              </div>
              <textarea placeholder="Description" value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold h-20" required />
              
              <div className="flex gap-4">
                {editingActivity && (
                  <button type="button" onClick={() => { setEditingActivity(null); setNewActivity({ universeId: newActivity.universeId, title: '', category: '', price: '', description: '', image: '', minAdvanceDays: 0 }); }} className="flex-1 bg-white/5 text-text-primary font-medium py-3 mt-2 hover:bg-white/10 transition-colors">Cancel</button>
                )}
                <button type="submit" disabled={isUploading} className="flex-1 bg-brand-gold text-brand-black font-medium py-3 mt-2 hover:bg-text-primary hover:text-bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isUploading && <Loader2 size={16} className="animate-spin" />}
                  {editingActivity ? 'Save Changes' : 'Create Activity'}
                </button>
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
                        setNewActivity({ universeId: a.universeId, title: a.title, category: a.category, price: a.price, description: a.description, image: a.image, minAdvanceDays: a.minAdvanceDays || 0 });
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
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add Form */}
          <div className="bg-bg-primary p-6 rounded-lg border border-border-primary">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus size={20} /> {editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <input type="text" placeholder="Title (e.g. Statue Harmonique)" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <input type="text" placeholder="Category (e.g. SCULPTURE)" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <div className="flex gap-4">
                <input type="number" placeholder="Price (€)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-1/2 bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
                <input type="number" placeholder="Old Price (optional)" value={newProduct.oldPrice} onChange={e => setNewProduct({...newProduct, oldPrice: e.target.value})} className="w-1/2 bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" />
              </div>
              <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold h-24" required />
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Image du produit</label>
                <div className="flex gap-4 items-center">
                  {newProduct.image && <img src={newProduct.image} className="w-12 h-12 object-cover border border-border-primary" />}
                  <label className="flex-grow flex items-center justify-center gap-2 bg-text-primary/5 border border-dashed border-border-primary p-4 text-xs cursor-pointer hover:border-brand-gold transition-colors">
                    <Upload size={14} />
                    <span>{isUploading ? 'Chargement...' : 'Choisir la photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      if (e.target.files?.[0]) await handleFileUpload(e.target.files[0], (url) => setNewProduct({...newProduct, image: url}));
                    }} />
                  </label>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-text-primary/80 mt-2">
                <input type="checkbox" checked={newProduct.isExclusive} onChange={e => setNewProduct({...newProduct, isExclusive: e.target.checked})} className="accent-brand-gold" />
                Marquer comme "Exclusif"
              </label>
              <div className="flex gap-4">
                {editingProduct && (
                  <button type="button" onClick={() => { setEditingProduct(null); setNewProduct({ title: '', category: '', price: '', oldPrice: '', description: '', image: '', isExclusive: false }); }} className="flex-1 bg-white/5 text-text-primary font-medium py-3 mt-2 hover:bg-white/10 transition-colors">Cancel</button>
                )}
                 <button type="submit" disabled={isUploading} className="flex-1 bg-brand-gold text-brand-black font-medium py-3 mt-2 hover:bg-text-primary hover:text-bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isUploading && <Loader2 size={16} className="animate-spin" />}
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 className="text-xl font-serif mb-6">Existing Products</h3>
            <div className="flex flex-col gap-4">
              {products.map(p => (
                <div key={p.id} className="bg-bg-primary p-4 rounded-lg border border-border-primary flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-medium flex items-center gap-2">{p.title} {p.isExclusive && <span className="text-[9px] bg-brand-gold text-brand-black px-1.5 py-0.5 rounded uppercase font-bold">Exclusive</span>}</h4>
                      <p className="text-xs text-text-primary/60">{p.category} | {p.price}€</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingProduct(p);
                        setNewProduct({ title: p.title, category: p.category, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '', description: p.description, image: p.image, isExclusive: !!p.isExclusive });
                      }}
                      className="p-2 text-text-primary/60 hover:text-brand-gold transition-colors"
                    >
                      <Plus size={18} className="rotate-45" />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 text-text-primary/60 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {activeTab === 'journal' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Add Form */}
          <div className="bg-bg-primary p-6 rounded-lg border border-border-primary">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus size={20} /> {editingJournal ? 'Edit Article' : 'Add New Article'}</h3>
            <form onSubmit={handleAddJournal} className="flex flex-col gap-4">
              <input type="text" placeholder="Titre de l'article" value={newJournal.title} onChange={e => setNewJournal({...newJournal, title: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              <div className="flex gap-4">
                <input type="text" placeholder="Category (ex: LIFESTYLE)" value={newJournal.category} onChange={e => setNewJournal({...newJournal, category: e.target.value})} className="w-1/2 bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
                <input type="date" value={newJournal.date} onChange={e => setNewJournal({...newJournal, date: e.target.value})} className="w-1/2 bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
              </div>
               <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Image de couverture</label>
                <div className="flex gap-4 items-center">
                  {newJournal.image && <img src={newJournal.image} className="w-12 h-12 object-cover border border-border-primary" />}
                  <label className="flex-grow flex items-center justify-center gap-2 bg-text-primary/5 border border-dashed border-border-primary p-4 text-xs cursor-pointer hover:border-brand-gold transition-colors">
                    <Upload size={14} />
                    <span>{isUploading ? 'Chargement...' : 'Choisir la photo'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      if (e.target.files?.[0]) await handleFileUpload(e.target.files[0], (url) => setNewJournal({...newJournal, image: url}));
                    }} />
                  </label>
                </div>
              </div>
              <textarea placeholder="Extrait (Excerpt)" value={newJournal.excerpt} onChange={e => setNewJournal({...newJournal, excerpt: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold h-20" required />
              <textarea placeholder="Contenu complet" value={newJournal.content} onChange={e => setNewJournal({...newJournal, content: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold h-32" required />
              
              <div className="flex gap-4">
                {editingJournal && (
                  <button type="button" onClick={() => { setEditingJournal(null); setNewJournal({ title: '', category: '', date: '', image: '', excerpt: '', content: '' }); }} className="flex-1 bg-white/5 text-text-primary font-medium py-3 mt-2 hover:bg-white/10 transition-colors">Cancel</button>
                )}
                 <button type="submit" disabled={isUploading} className="flex-1 bg-brand-gold text-brand-black font-medium py-3 mt-2 hover:bg-text-primary hover:text-bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isUploading && <Loader2 size={16} className="animate-spin" />}
                  {editingJournal ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div>
            <h3 className="text-xl font-serif mb-6">Published Articles</h3>
            <div className="flex flex-col gap-4">
              {journalPosts.map(j => (
                <div key={j.id} className="bg-bg-primary p-4 rounded-lg border border-border-primary flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={j.image} alt={j.title} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-medium flex items-center gap-2">{j.title}</h4>
                      <p className="text-xs text-text-primary/60">{j.category} | {j.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingJournal(j);
                        setNewJournal({ title: j.title, category: j.category, date: j.date, image: j.image, excerpt: j.excerpt, content: j.content });
                      }}
                      className="p-2 text-text-primary/60 hover:text-brand-gold transition-colors"
                    >
                      <Plus size={18} className="rotate-45" />
                    </button>
                    <button onClick={() => deleteJournalPost(j.id)} className="p-2 text-text-primary/60 hover:text-red-500 transition-colors">
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
