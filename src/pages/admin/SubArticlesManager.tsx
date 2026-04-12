import React, { useState } from "react";
import { useAppContext, type Article } from "../../context/AppContext";
import { Trash2, Pencil, ChevronDown, ChevronUp, Plus, Upload, Loader2 } from "lucide-react";
import { uploadImage } from "../../lib/storage";

export function SubArticlesManager() {
  const { activities, articles, updateArticle, deleteArticle, universes, addArticle } = useAppContext();
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newSubArticle, setNewSubArticle] = useState({
    parentArticleId: "",
    title: "",
    image: "",
    description: "",
    priceType: "fixed" as const,
    price: "",
    durationUnit: "day" as const,
    pricePerUnit: "",
    isReservable: false,
  });

  const toggleParent = (parentId: string) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });
  };

  // Group articles by parent
  const parentArticles = articles.filter((a) => a.articleType === "parent");
  const childArticlesByParent: { [key: string]: Article[] } = {};

  articles.forEach((article) => {
    if (article.parentArticleId) {
      if (!childArticlesByParent[article.parentArticleId]) {
        childArticlesByParent[article.parentArticleId] = [];
      }
      childArticlesByParent[article.parentArticleId].push(article);
    }
  });

  const getActivityName = (activityId: string) => {
    return activities.find((a) => a.id === activityId)?.title || "—";
  };

  const getUniverseName = (universeId: string) => {
    return universes.find((u) => u.id === universeId)?.name || "—";
  };

  const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      onSuccess(url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateSubArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubArticle.parentArticleId || !newSubArticle.title) return;

    const parentArticle = articles.find((a) => a.id === newSubArticle.parentArticleId);
    if (!parentArticle) return;

    try {
      const subArticle: Article = {
        id: `art-${crypto.randomUUID?.() || Date.now()}`,
        activityId: parentArticle.activityId,
        universeId: parentArticle.universeId,
        title: newSubArticle.title,
        image: newSubArticle.image,
        description: newSubArticle.description,
        priceType: newSubArticle.priceType,
        price: newSubArticle.priceType === "fixed" ? parseFloat(newSubArticle.price) : undefined,
        durationUnit: newSubArticle.priceType === "per_duration" ? newSubArticle.durationUnit : undefined,
        pricePerUnit: newSubArticle.priceType === "per_duration" ? parseFloat(newSubArticle.pricePerUnit) : undefined,
        availabilityCount: undefined,
        isFeatured: false,
        isReservable: newSubArticle.isReservable,
        articleType: "child",
        parentArticleId: newSubArticle.parentArticleId,
      };

      await addArticle(subArticle);

      setNewSubArticle({
        parentArticleId: "",
        title: "",
        image: "",
        description: "",
        priceType: "fixed",
        price: "",
        durationUnit: "day",
        pricePerUnit: "",
        isReservable: false,
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating sub-article:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif mb-2">Hiérarchie des Articles</h2>
        <p className="text-sm text-text-primary/60">
          Visualisez et gérez les relations parent-enfant entre articles
        </p>
      </div>

      {/* Create Sub-Article Form */}
      {parentArticles.length > 0 && (
        <div className="admin-card p-6 md:p-8">
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 text-brand-gold hover:text-brand-gold/80 transition-colors mb-4 font-medium"
          >
            <Plus size={18} />
            {showCreateForm ? "Annuler" : "Créer un sous-article"}
          </button>

          {showCreateForm && (
            <form onSubmit={handleCreateSubArticle} className="space-y-4 pt-4 border-t border-border-primary">
              {/* Parent Selection */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold block mb-2">
                  Article parent
                </label>
                <select
                  value={newSubArticle.parentArticleId}
                  onChange={(e) => setNewSubArticle({ ...newSubArticle, parentArticleId: e.target.value })}
                  className="admin-input w-full text-sm cursor-pointer"
                  required
                >
                  <option value="">Sélectionnez un article parent…</option>
                  {parentArticles.map((article) => (
                    <option key={article.id} value={article.id}>
                      {article.title} ({getActivityName(article.activityId)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <input
                type="text"
                placeholder="Titre du sous-article"
                value={newSubArticle.title}
                onChange={(e) => setNewSubArticle({ ...newSubArticle, title: e.target.value })}
                className="admin-input w-full text-sm"
                required
              />

              {/* Price Type */}
              <div className="flex gap-3">
                <label className="flex-1 flex items-center gap-2 p-3 border border-border-primary rounded-lg cursor-pointer hover:bg-text-primary/[0.04] transition-colors">
                  <input
                    type="radio"
                    value="fixed"
                    checked={newSubArticle.priceType === "fixed"}
                    onChange={(e) => setNewSubArticle({ ...newSubArticle, priceType: e.target.value as "fixed" })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Prix fixe</span>
                </label>
                <label className="flex-1 flex items-center gap-2 p-3 border border-border-primary rounded-lg cursor-pointer hover:bg-text-primary/[0.04] transition-colors">
                  <input
                    type="radio"
                    value="per_duration"
                    checked={newSubArticle.priceType === "per_duration"}
                    onChange={(e) => setNewSubArticle({ ...newSubArticle, priceType: e.target.value as "per_duration" })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Par durée</span>
                </label>
              </div>

              {/* Price Fields */}
              {newSubArticle.priceType === "fixed" ? (
                <input
                  type="number"
                  step="0.01"
                  placeholder="Prix (ex. 500)"
                  value={newSubArticle.price}
                  onChange={(e) => setNewSubArticle({ ...newSubArticle, price: e.target.value })}
                  className="admin-input w-full text-sm"
                  required
                />
              ) : (
                <>
                  <select
                    value={newSubArticle.durationUnit}
                    onChange={(e) => setNewSubArticle({ ...newSubArticle, durationUnit: e.target.value as "day" | "night" })}
                    className="admin-input w-full text-sm cursor-pointer"
                  >
                    <option value="day">Par jour</option>
                    <option value="night">Par nuit</option>
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Prix par jour/nuit (ex. 2500)"
                    value={newSubArticle.pricePerUnit}
                    onChange={(e) => setNewSubArticle({ ...newSubArticle, pricePerUnit: e.target.value })}
                    className="admin-input w-full text-sm"
                    required
                  />
                </>
              )}

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold">
                  Image
                </label>
                <div className="flex gap-3 items-center flex-wrap">
                  {newSubArticle.image ? (
                    <img src={newSubArticle.image} alt="" className="w-12 h-12 object-cover rounded-md border border-border-primary" />
                  ) : null}
                  <label className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-text-primary/[0.04] border border-dashed border-border-primary rounded-lg p-4 text-xs cursor-pointer hover:border-brand-gold/50 transition-colors">
                    <Upload size={14} aria-hidden />
                    <span>{isUploading ? "Chargement…" : "Choisir la photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0])
                          await handleFileUpload(e.target.files[0], (url) =>
                            setNewSubArticle({ ...newSubArticle, image: url })
                          );
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <textarea
                placeholder="Description du sous-article"
                value={newSubArticle.description}
                onChange={(e) => setNewSubArticle({ ...newSubArticle, description: e.target.value })}
                className="admin-input w-full text-sm min-h-[4rem] resize-y"
                required
              />

              {/* Reservable */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newSubArticle.isReservable}
                  onChange={(e) => setNewSubArticle({ ...newSubArticle, isReservable: e.target.checked })}
                  className="w-4 h-4 rounded border-border-primary"
                />
                <span className="text-sm font-medium text-text-primary">
                  ✓ Ce sous-article est réservable
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isUploading || !newSubArticle.parentArticleId || !newSubArticle.title}
                className="w-full px-4 py-2 font-bold text-xs bg-brand-gold hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg-primary rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" aria-hidden />
                    Chargement…
                  </>
                ) : (
                  "Créer le sous-article"
                )}
              </button>
            </form>
          )}
        </div>
      )}

      {parentArticles.length === 0 ? (
        <div className="admin-card p-8 text-center">
          <p className="text-text-primary/50 mb-4">
            Aucun article parent créé. Vous devez d'abord créer un article avec le type "Parent" dans l'onglet <strong>Articles</strong>.
          </p>
          <p className="text-xs text-text-primary/40">
            Une fois que vous avez créé un article parent, vous pourrez créer des sous-articles ici.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {parentArticles.map((parent) => {
            const children = childArticlesByParent[parent.id] || [];
            const isExpanded = expandedParents.has(parent.id);

            return (
              <div key={parent.id} className="admin-card overflow-hidden">
                {/* Parent Article */}
                <div
                  className="p-4 md:p-6 border-b border-border-primary/50 bg-brand-gold/5 cursor-pointer hover:bg-brand-gold/10 transition-colors"
                  onClick={() => toggleParent(parent.id)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {parent.image && (
                        <img
                          src={parent.image}
                          alt=""
                          className="w-14 h-14 object-cover rounded-md shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{parent.title}</h3>
                          <span className="text-xs px-2 py-0.5 bg-brand-gold/20 text-brand-gold rounded-full whitespace-nowrap font-medium">
                            Parent
                          </span>
                          {parent.isFeatured && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full whitespace-nowrap">
                              ⭐ Principal
                            </span>
                          )}
                          {parent.isReservable && (
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full whitespace-nowrap">
                              📅 Réservable
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-primary/60">
                          {getUniverseName(parent.universeId)} • {getActivityName(parent.activityId)}
                        </p>
                        <p className="text-xs text-brand-gold mt-1">
                          {children.length} sous-article{children.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-text-primary/50">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Children Articles */}
                {isExpanded && (
                  <div className="bg-text-primary/[0.02]">
                    {children.length === 0 ? (
                      <div className="p-4 text-center text-text-primary/50 text-sm border-t border-border-primary/30">
                        Aucun sous-article
                      </div>
                    ) : (
                      <div className="divide-y divide-border-primary/30">
                        {children.map((child) => (
                          <div
                            key={child.id}
                            className="p-4 md:p-6 flex items-center justify-between gap-4 hover:bg-text-primary/[0.05] transition-colors border-l-2 border-brand-gold/50"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {child.image && (
                                <img
                                  src={child.image}
                                  alt=""
                                  className="w-12 h-12 object-cover rounded-md shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium truncate text-sm">↳ {child.title}</h4>
                                  {child.isReservable && (
                                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full whitespace-nowrap">
                                      📅 Réservable
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-text-primary/60 truncate">
                                  {child.priceType === "fixed"
                                    ? `${child.price} DH`
                                    : `${child.pricePerUnit} DH/${child.durationUnit}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setEditingArticle(child)}
                                className="p-2 rounded-lg text-text-primary/50 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                                title="Modifier"
                              >
                                <Pencil size={16} aria-hidden />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteArticle(child.id)}
                                className="p-2 rounded-lg text-text-primary/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 size={16} aria-hidden />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold text-brand-gold">{parentArticles.length}</p>
          <p className="text-xs text-text-primary/60">Articles Parent</p>
        </div>
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {Object.values(childArticlesByParent).flat().length}
          </p>
          <p className="text-xs text-text-primary/60">Sous-articles</p>
        </div>
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {articles.filter((a) => a.isReservable).length}
          </p>
          <p className="text-xs text-text-primary/60">Réservables</p>
        </div>
        <div className="admin-card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {articles.filter((a) => a.isFeatured).length}
          </p>
          <p className="text-xs text-text-primary/60">Principal</p>
        </div>
      </div>
    </div>
  );
}
