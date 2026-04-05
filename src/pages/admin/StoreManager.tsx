import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Plus, Trash2, Upload, Loader2, Edit2 } from "lucide-react";
import { uploadImage } from "../../lib/storage";

export function StoreManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [newProduct, setNewProduct] = useState({ title: '', category: '', price: '', oldPrice: '', description: '', image: '', isExclusive: false });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct({ 
        ...editingProduct, 
        ...newProduct, 
        price: Number(newProduct.price), 
        oldPrice: newProduct.oldPrice ? Number(newProduct.oldPrice) : undefined 
      });
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

  return (
    <div>
      <h2 className="text-3xl font-serif mb-8">Store Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Add Form */}
        <div className="bg-bg-primary p-6 rounded-lg border border-border-primary">
          <h3 className="text-xl font-serif mb-6 flex items-center gap-2"><Plus size={20} /> {editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
            <input type="text" placeholder="Product Title" value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
            <input type="text" placeholder="Category (e.g. MODERN STATUE)" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold" required />
            
            <div className="flex gap-4">
              <input type="number" placeholder="Price (MAD)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold w-full" required />
              <input type="number" placeholder="Old Price (Optional)" value={newProduct.oldPrice} onChange={e => setNewProduct({...newProduct, oldPrice: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold w-full" />
            </div>

            <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="bg-transparent border border-border-primary p-3 text-sm outline-none focus:border-brand-gold h-24" required />
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Product Image</label>
              <div className="flex gap-4 items-center">
                {newProduct.image && <img src={newProduct.image} className="w-12 h-12 object-cover border border-border-primary" />}
                <label className="flex-grow flex items-center justify-center gap-2 bg-text-primary/5 border border-dashed border-border-primary p-4 text-xs cursor-pointer hover:border-brand-gold transition-colors">
                  <Upload size={14} />
                  <span>{isUploading ? 'Uploading...' : 'Choose Image File'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      setIsUploading(true);
                      try {
                        const url = await uploadImage(e.target.files[0]);
                        setNewProduct({...newProduct, image: url});
                      } catch (err) {
                        alert((err as Error).message);
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }} />
                </label>
              </div>
            </div>
            
            <label className="flex items-center gap-2 text-sm text-text-primary/60 cursor-pointer">
              <input type="checkbox" checked={newProduct.isExclusive} onChange={e => setNewProduct({...newProduct, isExclusive: e.target.checked})} className="accent-brand-gold" />
              Mark as Exclusive
            </label>

            <div className="flex gap-4">
              {editingProduct && (
                <button type="button" onClick={() => { setEditingProduct(null); setNewProduct({ title: '', category: '', price: '', oldPrice: '', description: '', image: '', isExclusive: false }); }} className="flex-1 bg-white/5 text-text-primary font-medium py-3 mt-2 hover:bg-white/10 transition-colors">Cancel</button>
              )}
              <button type="submit" disabled={isUploading} className="flex-1 bg-brand-gold text-brand-black font-medium py-3 mt-2 hover:bg-text-primary hover:text-bg-primary transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {isUploading && <Loader2 size={16} className="animate-spin" />}
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div>
          <h3 className="text-xl font-serif mb-6">Existing Products</h3>
          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
            {products.map(p => (
              <div key={p.id} className="bg-bg-primary p-4 rounded-lg border border-border-primary flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h4 className="font-medium text-sm">{p.title}</h4>
                    <p className="text-xs text-brand-gold">{p.price} MAD</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingProduct(p);
                      setNewProduct({ title: p.title, category: p.category, price: p.price.toString(), oldPrice: p.oldPrice?.toString() || '', description: p.description, image: p.image, isExclusive: !!p.isExclusive });
                    }}
                    className="p-2 text-text-primary/60 hover:text-brand-gold transition-colors"
                    title="Edit Product"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)} 
                    className="p-2 text-text-primary/60 hover:text-red-500 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
