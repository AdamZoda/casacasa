import React, { useState } from "react";
import { useAppContext, type Article } from "../../context/AppContext";
import { Plus, Trash2, Upload, Loader2, Pencil, RefreshCw } from "lucide-react";
import { uploadImage } from "../../lib/storage";
import { AdminPageHeader } from "../../components/admin/adminShared";

type ArticleDraft = {
  activityId: string;
  title: string;
  image: string;
  description: string;
  priceType: "fixed" | "per_duration";
  price: string;
  durationUnit: "day" | "night";
  pricePerUnit: string;
  availabilityCount: string;
  isFeatured: boolean;
  isReservable: boolean;
  articleType: "standalone" | "parent" | "child";
  parentArticleId: string;
};

const emptyArticleDraft = (): ArticleDraft => ({
  activityId: "",
  title: "",
  image: "",
  description: "",
  priceType: "fixed",
  price: "",
  durationUnit: "day",
  pricePerUnit: "",
  availabilityCount: "",
  isFeatured: false,
  isReservable: false,
  articleType: "standalone",
  parentArticleId: "",
});

export function ArticlesManager() {
  const { activities, articles, addArticle, updateArticle, deleteArticle, getArticlesByActivityId, refreshArticles } = useAppContext();
  
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [activityFilter, setActivityFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [newArticle, setNewArticle] = useState<ArticleDraft>(emptyArticleDraft);

  // Afficher tous les articles, filtrés par activité si nécessaire
  const allArticles = articles.filter(a => !a.parentArticleId); // Only parent and standalone articles
  const filteredArticles = activityFilter === "all" 
    ? allArticles 
    : allArticles.filter(a => a.activityId === activityFilter);

  const handleFileUpload = async (file: File, onSuccess: (url: string) => void) => {
    setIsUploading(true);
    try {
      const url = await uploadImage(file);
      onSuccess(url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefreshArticles = async () => {
    setIsRefreshing(true);
    try {
      await refreshArticles();
      console.log('✅ Articles rafraîchis depuis la base de données');
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement des articles:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.activityId || !newArticle.title) return;

    try {
      const article: Article = {
        id: `art-${crypto.randomUUID?.() || Date.now()}`,
        activityId: newArticle.activityId,
        title: newArticle.title,
        image: newArticle.image,
        description: newArticle.description,
        priceType: newArticle.priceType,
        price: newArticle.priceType === "fixed" ? parseFloat(newArticle.price) : undefined,
        durationUnit: newArticle.priceType === "per_duration" ? newArticle.durationUnit : undefined,
        pricePerUnit: newArticle.priceType === "per_duration" ? parseFloat(newArticle.pricePerUnit) : undefined,
        availabilityCount: newArticle.availabilityCount ? parseInt(newArticle.availabilityCount) : undefined,
        isFeatured: newArticle.isFeatured,
        isReservable: newArticle.isReservable,
        articleType: newArticle.articleType,
        parentArticleId: newArticle.parentArticleId,
      };

      if (editingArticle) {
        await updateArticle({ ...article, id: editingArticle.id });
      } else {
        await addArticle(article);
      }

      setNewArticle(emptyArticleDraft());
      setShowArticleForm(false);
    } catch (error) {
      console.error("Error saving article:", error);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Gestion des Articles" subtitle="Gérez les articles/offres des activités" />

      <div className="space-y-8">
          {/* Actions principales */}
          <div className="flex flex-wrap gap-3 items-center">
            {!showArticleForm && !editingArticle && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditingArticle(null);
                    setNewArticle((prev) => ({
                      ...emptyArticleDraft(),
                      activityId: activityFilter !== "all" ? activityFilter : prev.activityId,
                    }));
                    setShowArticleForm(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} strokeWidth={1.5} aria-hidden />
                  Créer un article
                </button>
                <button
                  type="button"
                  onClick={handleRefreshArticles}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRefreshing ? (
                    <Loader2 size={20} strokeWidth={1.5} className="animate-spin" aria-hidden />
                  ) : (
                    <RefreshCw size={20} strokeWidth={1.5} aria-hidden />
                  )}
                  {isRefreshing ? 'Rafraîchissement...' : 'Rafraîchir'}
                </button>
              </>
            )}

            {/* Filtre compact (plus léger visuellement) */}
            <div className="ml-auto min-w-[260px]">
              <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold block mb-2">
                Affichage
              </label>
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="admin-input w-full text-sm cursor-pointer"
              >
                <option value="all">Toutes les activités</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Formulaire de création / modification */}
          {(showArticleForm || editingArticle) && (
              <div className="admin-card p-6 md:p-8">
                <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                  <Plus size={20} strokeWidth={1.5} className="text-brand-gold" aria-hidden />
                  {editingArticle ? "Modifier l'article" : "Créer un nouvel article"}
                </h3>

                <form onSubmit={handleAddArticle} className="flex flex-col gap-4">
                  {/* Activité Selection */}
                  <select
                    value={newArticle.activityId}
                    onChange={(e) => setNewArticle({ ...newArticle, activityId: e.target.value })}
                    className="admin-input w-full text-sm cursor-pointer"
                    required
                  >
                    <option value="" disabled>
                      Choisir une activitéâ
                    </option>
                    {activities.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                  </select>

              <>
                {/* Article Title */}
                <input
                  type="text"
                  placeholder="Titre de l'article (ex. Voiture Classe A)"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  className="admin-input w-full text-sm"
                  required
                />

                {/* Price Type */}
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center gap-2 p-3 border border-border-primary rounded-lg cursor-pointer hover:bg-text-primary/[0.04] transition-colors">
                    <input
                      type="radio"
                      value="fixed"
                      checked={newArticle.priceType === "fixed"}
                      onChange={(e) => setNewArticle({ ...newArticle, priceType: e.target.value as "fixed" })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Prix fixe</span>
                  </label>
                  <label className="flex-1 flex items-center gap-2 p-3 border border-border-primary rounded-lg cursor-pointer hover:bg-text-primary/[0.04] transition-colors">
                    <input
                      type="radio"
                      value="per_duration"
                      checked={newArticle.priceType === "per_duration"}
                      onChange={(e) => setNewArticle({ ...newArticle, priceType: e.target.value as "per_duration" })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Par durée</span>
                  </label>
                </div>

                {/* Price Fields */}
                {newArticle.priceType === "fixed" ? (
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Prix (ex. 500)"
                    value={newArticle.price}
                    onChange={(e) => setNewArticle({ ...newArticle, price: e.target.value })}
                    className="admin-input w-full text-sm"
                    required
                  />
                ) : (
                  <>
                    <select
                      value={newArticle.durationUnit}
                      onChange={(e) => setNewArticle({ ...newArticle, durationUnit: e.target.value as "day" | "night" })}
                      className="admin-input w-full text-sm cursor-pointer"
                    >
                      <option value="day">Par jour</option>
                      <option value="night">Par nuit</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Prix par jour/nuit (ex. 2500)"
                      value={newArticle.pricePerUnit}
                      onChange={(e) => setNewArticle({ ...newArticle, pricePerUnit: e.target.value })}
                      className="admin-input w-full text-sm"
                      required
                    />
                  </>
                )}

                {/* Availability */}
                <input
                  type="number"
                  min="1"
                  placeholder="Nombre disponible (optionnel)"
                  value={newArticle.availabilityCount}
                  onChange={(e) => setNewArticle({ ...newArticle, availabilityCount: e.target.value })}
                  className="admin-input w-full text-sm"
                />

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold">
                    Image de l'article
                  </label>
                  <div className="flex gap-3 items-center flex-wrap">
                    {newArticle.image ? (
                      <img
                        src={newArticle.image}
                        alt=""
                        className="w-12 h-12 object-cover rounded-md border border-border-primary"
                      />
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
                            await handleFileUpload(e.target.files[0], (url) => setNewArticle({ ...newArticle, image: url }));
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Description */}
                <textarea
                  placeholder="Description de l'article"
                  value={newArticle.description}
                  onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                  className="admin-input w-full text-sm min-h-[5rem] resize-y"
                  required
                />

                {/* 🆕 Article Hierarchy Section */}
                <div className="border-t border-border-primary pt-4 mt-4">
                  <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold block mb-3">
                    Type d'article
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {(['standalone', 'parent', 'child'] as const).map((type) => (
                      <label key={type} className="flex items-center gap-2 p-3 border border-border-primary rounded-lg cursor-pointer hover:bg-text-primary/[0.04] transition-colors">
                        <input
                          type="radio"
                          value={type}
                          checked={newArticle.articleType === type}
                          onChange={(e) => setNewArticle({ ...newArticle, articleType: e.target.value as 'standalone' | 'parent' | 'child' })}
                          className="w-4 h-4"
                        />
                        <span className="text-xs capitalize font-medium">{type === 'standalone' ? 'Simple' : type === 'parent' ? 'Parent' : 'Enfant'}</span>
                      </label>
                    ))}
                  </div>

                  {/* Parent Article Selector (for child/parent types) */}
                  {(newArticle.articleType === 'child' || newArticle.articleType === 'parent') && (
                    <div className="mb-4">
                      <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold block mb-2">
                        Article parent
                      </label>
                      <select
                        value={newArticle.parentArticleId}
                        onChange={(e) => setNewArticle({ ...newArticle, parentArticleId: e.target.value })}
                        className="admin-input w-full text-sm cursor-pointer"
                      >
                        <option value="">Aucun parent</option>
                        {articles
                          .filter(a => a.activityId === newArticle.activityId && a.articleType !== 'child')
                          .map((article) => (
                            <option key={article.id} value={article.id}>
                              {article.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {/* Reservable Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newArticle.isReservable}
                      onChange={(e) => setNewArticle({ ...newArticle, isReservable: e.target.checked })}
                      className="w-4 h-4 rounded border-border-primary"
                    />
                    <span className="text-sm font-medium text-text-primary">
                      ✓ Cet article est réservable (bookable)
                    </span>
                  </label>
                </div>

                {/* Featured Section */}
                <div className="border-t border-border-primary pt-4 mt-4">
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      checked={newArticle.isFeatured}
                      onChange={(e) => setNewArticle({ ...newArticle, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded border-border-primary"
                    />
                    <span className="text-sm font-semibold text-text-primary">
                      ⭐ Afficher en première page (principal)
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  {editingArticle && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingArticle(null);
                        setNewArticle({
                          activityId: "",
                          title: "",
                          image: "",
                          description: "",
                          priceType: "fixed",
                          price: "",
                          durationUnit: "day",
                          pricePerUnit: "",
                          availabilityCount: "",
                          isFeatured: false,
                          isReservable: false,
                          articleType: "standalone",
                          parentArticleId: "",
                        });
                      }}
                      className="px-4 py-2 text-xs bg-text-primary/10 hover:bg-text-primary/15 text-text-primary rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowArticleForm(false);
                      setEditingArticle(null);
                      setNewArticle(emptyArticleDraft());
                    }}
                    className="px-4 py-2 text-xs bg-text-primary/10 hover:bg-text-primary/15 text-text-primary rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !newArticle.activityId || !newArticle.title}
                    className="px-4 py-2 font-bold text-xs bg-brand-gold hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-bg-primary rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" aria-hidden />
                        Chargementâ
                      </>
                    ) : editingArticle ? (
                      "Modifier l'article"
                    ) : (
                      "Ajouter l'article"
                    )}
                  </button>
                </div>
              </>
          </form>
              </div>
          )}

          {/* Articles List - Grid 3 par ligne */}
          <div className="admin-card p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h3 className="text-xl font-serif">
                Articles
                {activityFilter !== "all" && (
                  <span className="text-sm font-normal text-text-primary/60">
                    {" "}- {activities.find(a => a.id === activityFilter)?.title}
                  </span>
                )}
              </h3>
              <p className="text-sm text-text-primary/60">
                {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.length === 0 ? (
                <p className="text-text-primary/50 text-sm col-span-full">
                  {activityFilter === "all" ? "Aucun article trouvé" : "Aucun article pour cette activité"}
                </p>
              ) : (
                filteredArticles.map((article) => {
                  const childArticles = articles.filter(a => a.parentArticleId === article.id);
                  const articleTypeLabel = article.articleType === 'parent' ? 'Parent' : article.articleType === 'child' ? 'Enfant' : 'Simple';
                  const articleTypeBgColor = article.articleType === 'parent' ? 'bg-brand-gold/10 border-brand-gold/30' : article.articleType === 'child' ? 'bg-blue-500/10 border-blue-500/30' : '';
                  const articleActivity = activities.find(a => a.id === article.activityId);

                  return (
                    <div key={article.id}>
                      {/* Main Article */}
                      <div className={`flex gap-3 p-4 border border-border-primary rounded-lg hover:border-brand-gold/50 transition-colors ${articleTypeBgColor}`}>
                        {article.image && (
                          <img src={article.image} alt="" className="w-12 h-12 object-cover rounded-md shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{article.title}</h4>
                            <span className="text-xs px-2 py-0.5 bg-text-primary/10 rounded-full font-medium whitespace-nowrap">
                              {articleTypeLabel}
                            </span>
                            {article.isFeatured && (
                              <span className="text-xs px-2 py-0.5 bg-brand-gold/20 text-brand-gold rounded-full font-medium whitespace-nowrap">
                                â Principal
                              </span>
                            )}
                            {article.isReservable && (
                              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium whitespace-nowrap">
                                à Réservable
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-primary/55 truncate">
                            {articleActivity?.title}
                          </p>
                          <p className="text-xs text-text-primary/55 truncate">
                            {article.priceType === "fixed"
                              ? `${article.price} DH`
                              : `${article.pricePerUnit} DH/${article.durationUnit}`}
                          </p>
                          {article.availabilityCount && (
                            <p className="text-xs text-text-primary/55">Stock: {article.availabilityCount}</p>
                          )}
                          {childArticles.length > 0 && (
                            <p className="text-xs text-brand-gold mt-1">
                              {childArticles.length} sous-article{childArticles.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingArticle(article);
                              setNewArticle({
                                activityId: article.activityId,
                                title: article.title,
                                image: article.image,
                                description: article.description,
                                priceType: article.priceType,
                                price: article.price?.toString() || "",
                                durationUnit: article.durationUnit || "day",
                                pricePerUnit: article.pricePerUnit?.toString() || "",
                                availabilityCount: article.availabilityCount?.toString() || "",
                                isFeatured: article.isFeatured || false,
                                isReservable: article.isReservable || false,
                                articleType: article.articleType || "standalone",
                                parentArticleId: article.parentArticleId || "",
                              });
                            }}
                            className="p-2 rounded-lg text-text-primary/50 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={16} aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteArticle(article.id)}
                            className="p-2 rounded-lg text-text-primary/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} aria-hidden />
                          </button>
                        </div>
                      </div>

                      {/* Child Articles (if parent) */}
                      {childArticles.length > 0 && (
                        <div className="ml-4 mt-2 space-y-2 border-l-2 border-brand-gold/30 pl-4">
                          {childArticles.map((child) => (
                            <div key={child.id} className="flex gap-3 p-3 border border-border-primary/50 rounded-lg hover:border-brand-gold/50 transition-colors bg-text-primary/[0.02]">
                              {child.image && (
                                <img src={child.image} alt="" className="w-10 h-10 object-cover rounded-md shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium truncate text-sm">â³ {child.title}</h4>
                                  {child.isReservable && (
                                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium whitespace-nowrap">
                                      à Réservable
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-text-primary/55 truncate">
                                  {child.priceType === "fixed"
                                    ? `${child.price} DH`
                                    : `${child.pricePerUnit} DH/${child.durationUnit}`}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingArticle(child);
                                    setNewArticle({
                                      activityId: child.activityId,
                                      title: child.title,
                                      image: child.image,
                                      description: child.description,
                                      priceType: child.priceType,
                                      price: child.price?.toString() || "",
                                      durationUnit: child.durationUnit || "day",
                                      pricePerUnit: child.pricePerUnit?.toString() || "",
                                      availabilityCount: child.availabilityCount?.toString() || "",
                                      isFeatured: child.isFeatured || false,
                                      isReservable: child.isReservable || false,
                                      articleType: child.articleType || "child",
                                      parentArticleId: child.parentArticleId || "",
                                    });
                                  }}
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
                  );
                })
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
