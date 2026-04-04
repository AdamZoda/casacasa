import React, { useState } from 'react';
import { useAppContext } from "../../context/AppContext";
import { Plus, Trash2, Edit3, FileText, Calendar, Tag, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { uploadImage } from "../../lib/storage";

export function JournalManager() {
  const { journalPosts, addJournalPost, updateJournalPost, deleteJournalPost } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'LIFESTYLE',
    date: new Date().toISOString().split('T')[0],
    image: '',
    excerpt: '',
    content: ''
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      updateJournalPost({ ...formData, id: editingPost.id });
      setEditingPost(null);
    } else {
      addJournalPost({ ...formData, id: `j-${Date.now()}` });
    }
    setIsAdding(false);
    setFormData({ title: '', category: 'LIFESTYLE', date: new Date().toISOString().split('T')[0], image: '', excerpt: '', content: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif mb-2">Journal Management</h2>
          <p className="text-sm text-text-primary/40 uppercase tracking-widest">Manage editorial content and blog posts</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-gold text-brand-black px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-text-primary hover:text-bg-primary transition-all flex items-center gap-3"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {journalPosts.map((post) => (
          <div key={post.id} className="bg-bg-primary border border-border-primary p-6 flex items-center gap-8 group hover:border-brand-gold/30 transition-all duration-500">
            <div className="w-32 h-32 overflow-hidden shrink-0 border border-border-primary">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-brand-gold flex items-center gap-1">
                  <Tag size={10} /> {post.category}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-text-primary/30 flex items-center gap-1">
                  <Calendar size={10} /> {post.date}
                </span>
              </div>
              <h4 className="text-xl font-serif mb-2">{post.title}</h4>
              <p className="text-xs text-text-primary/40 line-clamp-1">{post.excerpt}</p>
            </div>
            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => {
                  setEditingPost(post);
                  setFormData(post);
                  setIsAdding(true);
                }}
                className="p-3 bg-text-primary/5 hover:bg-brand-gold hover:text-brand-black transition-all"
              >
                <Edit3 size={18} strokeWidth={1.5} />
              </button>
              <button 
                onClick={() => deleteJournalPost(post.id)}
                className="p-3 bg-text-primary/5 hover:bg-red-500 hover:text-white transition-all"
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
        {journalPosts.length === 0 && (
          <div className="p-24 text-center text-text-primary/20 italic text-sm border border-dashed border-border-primary">
            No posts found. Start by creating your first editorial piece.
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-bg-primary/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-bg-primary border border-border-primary p-12 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <h3 className="text-3xl font-serif mb-12">{editingPost ? 'Edit Post' : 'Create New Post'}</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all appearance-none text-text-primary"
                    >
                      <option value="LIFESTYLE">LIFESTYLE</option>
                      <option value="TRAVEL">TRAVEL</option>
                      <option value="GASTRONOMY">GASTRONOMY</option>
                      <option value="ART">ART</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Cover Image</label>
                  <div className="flex gap-4 items-center">
                    {formData.image && <img src={formData.image} className="w-16 h-16 object-cover border border-border-primary" />}
                    <label className="flex-grow flex items-center justify-center gap-3 bg-text-primary/5 border border-dashed border-border-primary p-6 text-xs cursor-pointer hover:border-brand-gold transition-colors group">
                      {isUploading ? (
                        <Loader2 size={20} className="animate-spin text-brand-gold" />
                      ) : (
                        <Upload size={20} className="text-text-primary/20 group-hover:text-brand-gold transition-colors" />
                      )}
                      <span>{isUploading ? 'Uploading...' : 'Choose Image File'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            setIsUploading(true);
                            try {
                              const url = await uploadImage(e.target.files[0]);
                              setFormData({...formData, image: url});
                            } catch (err) {
                              alert((err as Error).message);
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }} 
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Excerpt</label>
                  <textarea 
                    required
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/40">Content</label>
                  <textarea 
                    required
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-text-primary/5 border border-border-primary p-4 text-sm focus:outline-none focus:border-brand-gold transition-all resize-none font-serif leading-relaxed"
                  />
                </div>
                <div className="flex justify-end gap-6 pt-8 border-t border-border-primary">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="px-8 py-4 text-xs uppercase tracking-widest font-bold hover:text-brand-gold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isUploading}
                    className="bg-brand-gold text-brand-black px-12 py-4 text-xs uppercase tracking-widest font-bold hover:bg-text-primary hover:text-bg-primary transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isUploading && <Loader2 size={16} className="animate-spin" />}
                    {editingPost ? 'Save Changes' : 'Create Post'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
