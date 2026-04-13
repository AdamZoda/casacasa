import React, { useState } from "react";
import { useAppContext, type Activity, type Universe } from "../../context/AppContext";
import { Plus, Trash2, Upload, Loader2, Globe, Pencil } from "lucide-react";
import { uploadImage } from "../../lib/storage";
import { AdminPageHeader } from "../../components/admin/adminShared";
import { ArticlesManager } from "./ArticlesManager";
import { SubArticlesManager } from "./SubArticlesManager";

/** Vignette fixe : évite le décalage du texte quand l’image manque ou est cassée. */
function MediaThumb({
  src,
  alt,
  size = "md",
}: {
  src?: string | null;
  alt: string;
  size?: "sm" | "md";
}) {
  const [failed, setFailed] = useState(false);
  const dim = size === "sm" ? "w-12 h-12 min-w-[3rem] min-h-[3rem]" : "w-16 h-16 min-w-[4rem] min-h-[4rem]";
  const showPlaceholder = !String(src ?? "").trim() || failed;
  if (showPlaceholder) {
    return (
      <div
        className={`${dim} shrink-0 rounded-md border border-border-primary bg-text-primary/[0.08] flex items-center justify-center text-text-primary/35`}
        aria-hidden
      >
        <Globe size={size === "sm" ? 18 : 22} strokeWidth={1} />
      </div>
    );
  }
  return (
    <img
      src={src!}
      alt={alt}
      className={`${dim} shrink-0 object-cover rounded-md border border-border-primary bg-text-primary/5`}
      onError={() => setFailed(true)}
    />
  );
}

function parseGalleryUrls(galleryUrls: string): string[] {
  return galleryUrls
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

type ActivityFormState = {
  universeId: string;
  title: string;
  category: string;
  price: string;
  description: string;
  image: string;
  minAdvanceDays: number;
  hasArticles: boolean;
  articleDisplayType: "direct" | "articles_only";
  isFeatured: boolean;
  featuredOrder: string;
  featuredDisplayType: "card" | "hero" | "grid" | "carousel";
  featuredImageUrl: string;
};

const emptyActivityForm = (universeId = ""): ActivityFormState => ({
  universeId,
  title: "",
  category: "",
  price: "",
  description: "",
  image: "",
  minAdvanceDays: 0,
  hasArticles: false,
  articleDisplayType: "direct",
  isFeatured: false,
  featuredOrder: "",
  featuredDisplayType: "card",
  featuredImageUrl: "",
});

export function ContentManager() {
  const {
    universes,
    activities,
    addUniverse,
    updateUniverse,
    deleteUniverse,
    addActivity,
    updateActivity,
    deleteActivity,
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<"universes" | "activities" | "articles" | "sub-articles">("universes");

  const [editingUniverse, setEditingUniverse] = useState<Universe | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [newUniverse, setNewUniverse] = useState({
    name: "",
    location: "",
    description: "",
    heroImage: "",
    flag: "",
    galleryUrls: "",
  });
  const [newActivity, setNewActivity] = useState<ActivityFormState>(emptyActivityForm());

  const handleAddUniverse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const gallery = parseGalleryUrls(newUniverse.galleryUrls);
      const flag = newUniverse.flag || "🏳️";

      if (editingUniverse) {
        updateUniverse({
          ...editingUniverse,
          name: newUniverse.name,
          location: newUniverse.location,
          description: newUniverse.description,
          heroImage: newUniverse.heroImage,
          flag,
          gallery:
            gallery.length > 0
              ? gallery
              : editingUniverse.gallery?.length
                ? editingUniverse.gallery
                : newUniverse.heroImage
                  ? [newUniverse.heroImage]
                  : [],
        });
        setEditingUniverse(null);
      } else {
        addUniverse({
          id: `u-${Date.now()}`,
          name: newUniverse.name,
          location: newUniverse.location,
          description: newUniverse.description,
          heroImage: newUniverse.heroImage,
          flag,
          gallery: gallery.length > 0 ? gallery : newUniverse.heroImage ? [newUniverse.heroImage] : [],
        });
      }
      setNewUniverse({ name: "", location: "", description: "", heroImage: "", flag: "", galleryUrls: "" });
    } catch (err) {
      alert("Erreur : " + (err as Error).message);
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
      alert("Erreur upload : " + (err as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingActivity) {
      updateActivity({
        ...editingActivity,
        universeId: newActivity.universeId,
        title: newActivity.title,
        category: newActivity.category,
        price: newActivity.price,
        image: newActivity.image,
        description: newActivity.description,
        minAdvanceDays: newActivity.minAdvanceDays,
        hasArticles: newActivity.hasArticles,
        articleDisplayType: newActivity.articleDisplayType,
        isFeatured: newActivity.isFeatured,
      });
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
        minAdvanceDays: newActivity.minAdvanceDays,
        hasArticles: newActivity.hasArticles,
        articleDisplayType: newActivity.articleDisplayType,
        isFeatured: newActivity.isFeatured,
      });
    }
    setNewActivity(emptyActivityForm(newActivity.universeId));
  };

  const resetUniverseForm = () => {
    setEditingUniverse(null);
    setNewUniverse({ name: "", location: "", description: "", heroImage: "", flag: "", galleryUrls: "" });
  };

  return (
    <div className="space-y-8 pb-16 max-w-[1600px]">
      <AdminPageHeader
        kicker="Éditorial"
        title="Gestion du contenu"
        subtitle="Mondes, destinations et activités affichés sur le site"
      />

      <div className="flex flex-row flex-nowrap gap-1 p-1 border-b border-border-primary/60 max-w-full overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("universes")}
          className={`shrink-0 px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-black transition-colors border-b-2 -mb-px ${
            activeTab === "universes"
              ? "text-brand-gold border-brand-gold"
              : "text-text-primary/50 border-transparent hover:text-text-primary"
          }`}
        >
          Mondes (pays)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("activities")}
          className={`shrink-0 px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-black transition-colors border-b-2 -mb-px ${
            activeTab === "activities"
              ? "text-brand-gold border-brand-gold"
              : "text-text-primary/50 border-transparent hover:text-text-primary"
          }`}
        >
          Activités
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("articles")}
          className={`shrink-0 px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-black transition-colors border-b-2 -mb-px ${
            activeTab === "articles"
              ? "text-brand-gold border-brand-gold"
              : "text-text-primary/50 border-transparent hover:text-text-primary"
          }`}
        >
          Articles
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sub-articles")}
          className={`shrink-0 px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-black transition-colors border-b-2 -mb-px ${
            activeTab === "sub-articles"
              ? "text-brand-gold border-brand-gold"
              : "text-text-primary/50 border-transparent hover:text-text-primary"
          }`}
        >
          Sous-Articles
        </button>
      </div>

      {activeTab === "universes" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10">
          <div className="admin-card p-6 md:p-8">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
              <Plus size={20} strokeWidth={1.5} className="text-brand-gold" aria-hidden />
              {editingUniverse ? "Modifier le monde" : "Nouveau monde"}
            </h3>
            <form onSubmit={(e) => void handleAddUniverse(e)} className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Drapeau (ex. MA, FR ou emoji)"
                  value={newUniverse.flag}
                  onChange={(e) => setNewUniverse({ ...newUniverse, flag: e.target.value })}
                  className="admin-input w-full sm:w-1/3 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Nom (ex. Privilège Maroc)"
                  value={newUniverse.name}
                  onChange={(e) => setNewUniverse({ ...newUniverse, name: e.target.value })}
                  className="admin-input w-full sm:flex-1 text-sm"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Lieu (ex. Marrakech, Maroc)"
                value={newUniverse.location}
                onChange={(e) => setNewUniverse({ ...newUniverse, location: e.target.value })}
                className="admin-input w-full text-sm"
                required
              />
              <textarea
                placeholder="Description"
                value={newUniverse.description}
                onChange={(e) => setNewUniverse({ ...newUniverse, description: e.target.value })}
                className="admin-input w-full text-sm min-h-[6rem] resize-y"
                required
              />

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold">Image hero</label>
                <div className="flex gap-3 items-center flex-wrap">
                  {newUniverse.heroImage ? (
                    <img
                      src={newUniverse.heroImage}
                      alt=""
                      className="w-14 h-14 object-cover rounded-md border border-border-primary"
                    />
                  ) : null}
                  <label className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-text-primary/[0.04] border border-dashed border-border-primary rounded-lg p-4 text-xs cursor-pointer hover:border-brand-gold/50 transition-colors">
                    <Upload size={14} aria-hidden />
                    <span>{isUploading ? "Chargement…" : "Choisir la photo principale"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        if (e.target.files?.[0])
                          await handleFileUpload(e.target.files[0], (url) =>
                            setNewUniverse({ ...newUniverse, heroImage: url })
                          );
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold">Galerie photos</label>
                <label className="w-full flex items-center justify-center gap-2 bg-text-primary/[0.04] border border-dashed border-border-primary rounded-lg p-4 text-xs cursor-pointer hover:border-brand-gold/50 transition-colors">
                  <Plus size={14} aria-hidden />
                  <span>Ajouter des photos à la galerie</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files) {
                        setIsUploading(true);
                        try {
                          const urls = [...(newUniverse.galleryUrls ? newUniverse.galleryUrls.split(", ") : [])];
                          for (const file of Array.from(e.target.files)) {
                            urls.push(await uploadImage(file as File));
                          }
                          setNewUniverse({ ...newUniverse, galleryUrls: urls.join(", ") });
                        } catch (err) {
                          alert("Erreur upload : " + (err as Error).message);
                        } finally {
                          setIsUploading(false);
                        }
                      }
                    }}
                  />
                </label>
                {newUniverse.galleryUrls ? (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {newUniverse.galleryUrls.split(", ").map((u, i) => (
                      <img key={i} src={u} alt="" className="w-10 h-10 object-cover rounded border border-border-primary opacity-80" />
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {editingUniverse ? (
                  <button
                    type="button"
                    onClick={resetUniverseForm}
                    className="flex-1 rounded-lg border border-border-primary py-3 text-sm font-semibold hover:bg-text-primary/[0.04] transition-colors"
                  >
                    Annuler
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 rounded-lg bg-brand-gold text-brand-black font-bold py-3 text-sm hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
                  {editingUniverse ? "Enregistrer" : "Créer le monde"}
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-6">Mondes existants</h3>
            <div className="flex flex-col gap-3">
              {universes.map((u) => (
                <div
                  key={u.id}
                  className="admin-card p-4 flex flex-row items-center justify-between gap-4 flex-nowrap"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <MediaThumb src={u.heroImage} alt="" size="md" />
                    <div className="min-w-0">
                      <h4 className="font-medium truncate">{u.name}</h4>
                      <p className="text-xs text-text-primary/55 truncate">{u.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUniverse(u);
                        setNewUniverse({
                          name: u.name,
                          location: u.location,
                          description: u.description,
                          heroImage: u.heroImage,
                          flag: u.flag || "",
                          galleryUrls: u.gallery?.length ? u.gallery.join(", ") : "",
                        });
                      }}
                      className="p-2.5 rounded-lg text-text-primary/50 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                      title="Modifier"
                      aria-label={`Modifier ${u.name}`}
                    >
                      <Pencil size={18} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteUniverse(u.id)}
                      className="p-2.5 rounded-lg text-text-primary/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Supprimer"
                      aria-label={`Supprimer ${u.name}`}
                    >
                      <Trash2 size={18} aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "activities" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-10">
          <div className="admin-card p-6 md:p-8">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
              <Plus size={20} strokeWidth={1.5} className="text-brand-gold" aria-hidden />
              {editingActivity ? "Modifier l’activité" : "Nouvelle activité"}
            </h3>
            <form onSubmit={handleAddActivity} className="flex flex-col gap-4">
              <select
                value={newActivity.universeId}
                onChange={(e) => setNewActivity({ ...newActivity, universeId: e.target.value })}
                className="admin-input w-full text-sm cursor-pointer"
                required
              >
                <option value="" disabled>
                  Choisir un monde…
                </option>
                {universes.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Titre (ex. Bivouac VIP désert)"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                className="admin-input w-full text-sm"
                required
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Catégorie (ex. Villas)"
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                  className="admin-input w-full sm:flex-1 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Prix"
                  value={newActivity.price}
                  onChange={(e) => setNewActivity({ ...newActivity, price: e.target.value })}
                  className="admin-input w-full sm:flex-1 text-sm"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  type="number"
                  min={0}
                  placeholder="Délai min. (jours)"
                  value={newActivity.minAdvanceDays}
                  onChange={(e) => setNewActivity({ ...newActivity, minAdvanceDays: parseInt(e.target.value, 10) || 0 })}
                  className="admin-input w-full sm:w-1/2 text-sm"
                  title="Nombre de jours minimum avant la réservation"
                />
                <span className="text-xs text-text-primary/50 sm:w-1/2">Délai minimum de réservation (jours)</span>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold">Image</label>
                <div className="flex gap-3 items-center flex-wrap">
                  {newActivity.image ? (
                    <img
                      src={newActivity.image}
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
                          await handleFileUpload(e.target.files[0], (url) =>
                            setNewActivity({ ...newActivity, image: url })
                          );
                      }}
                    />
                  </label>
                </div>
              </div>
              <textarea
                placeholder="Description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                className="admin-input w-full text-sm min-h-[5rem] resize-y"
                required
              />

              {/* Article Display Mode */}
              <div className="space-y-3 p-4 border border-brand-gold/20 rounded-lg bg-brand-gold/5">
                <label className="text-[10px] uppercase tracking-widest text-text-primary/45 font-bold block">
                  Mode d'affichage
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 p-3 border border-border-primary rounded-lg cursor-pointer hover:bg-text-primary/[0.04] transition-colors">
                    <input
                      type="radio"
                      name="displayType"
                      value="direct"
                      checked={newActivity.articleDisplayType === "direct"}
                      onChange={(e) => setNewActivity({ ...newActivity, articleDisplayType: e.target.value as "direct", hasArticles: false })}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Réservable directement</span>
                      <p className="text-xs text-text-primary/55">Réservation classique de l'activité</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-border-primary rounded-lg cursor-pointer hover:bg-text-primary/[0.04] transition-colors">
                    <input
                      type="radio"
                      name="displayType"
                      value="articles_only"
                      checked={newActivity.articleDisplayType === "articles_only"}
                      onChange={(e) => setNewActivity({ ...newActivity, articleDisplayType: e.target.value as "articles_only", hasArticles: true })}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">Contient des articles</span>
                      <p className="text-xs text-text-primary/55">Affiche une liste d'articles à réserver</p>
                    </div>
                  </label>
                </div>
                {newActivity.hasArticles && (
                  <p className="text-xs text-text-primary/60 pt-2 border-t border-border-primary">
                    💡 Après création, utilisez l'onglet "Articles" pour ajouter les articles de cette activité.
                  </p>
                )}
              </div>

              {/* Featured Section */}
              <div className="border-t border-border-primary pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newActivity.isFeatured}
                    onChange={(e) => setNewActivity({ ...newActivity, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-border-primary"
                  />
                  <span className="text-sm font-semibold text-text-primary">
                    ⭐ Afficher en première page (principal)
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {editingActivity ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingActivity(null);
                      setNewActivity(emptyActivityForm(newActivity.universeId));
                    }}
                    className="flex-1 rounded-lg border border-border-primary py-3 text-sm font-semibold hover:bg-text-primary/[0.04] transition-colors"
                  >
                    Annuler
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 rounded-lg bg-brand-gold text-brand-black font-bold py-3 text-sm hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
                  {editingActivity ? "Enregistrer" : "Créer l’activité"}
                </button>
              </div>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-serif mb-6">Activités existantes</h3>
            <div className="flex flex-col gap-3 max-h-[min(70vh,640px)] overflow-y-auto overscroll-contain pr-1">
              {activities.map((a) => (
                <div
                  key={a.id}
                  className="admin-card p-4 flex flex-row items-center justify-between gap-4 flex-nowrap"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <MediaThumb src={a.image} alt="" size="sm" />
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate">{a.title}</h4>
                      <p className="text-xs text-brand-gold/90 truncate">
                        {universes.find((u) => u.id === a.universeId)?.name ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingActivity(a);
                        setNewActivity({
                          universeId: a.universeId,
                          title: a.title,
                          category: a.category,
                          price: a.price,
                          description: a.description,
                          image: a.image,
                          minAdvanceDays: a.minAdvanceDays || 0,
                          hasArticles: a.hasArticles || false,
                          articleDisplayType: a.articleDisplayType || "direct",
                          isFeatured: a.isFeatured || false,
                          featuredOrder: a.featuredOrder?.toString() || "",
                          featuredDisplayType: a.featuredDisplayType || "card",
                          featuredImageUrl: a.featuredImageUrl || "",
                        });
                      }}
                      className="p-2.5 rounded-lg text-text-primary/50 hover:text-brand-gold hover:bg-brand-gold/10 transition-colors"
                      title="Modifier"
                      aria-label={`Modifier ${a.title}`}
                    >
                      <Pencil size={18} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteActivity(a.id)}
                      className="p-2.5 rounded-lg text-text-primary/50 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Supprimer"
                      aria-label={`Supprimer ${a.title}`}
                    >
                      <Trash2 size={18} aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "articles" && (
        <ArticlesManager />
      )}

      {activeTab === "sub-articles" && (
        <div className="space-y-6">
          <SubArticlesManager />
        </div>
      )}
    </div>
  );
}
