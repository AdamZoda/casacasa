import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

export function ArticleDetail() {
  const { universeId, activityId, articleId } = useParams<{
    universeId: string;
    activityId: string;
    articleId: string;
  }>();
  const navigate = useNavigate();
  const { universes, activities, articles } = useAppContext();

  const universe = universes.find((u) => u.id === universeId);
  const activity = activities.find((a) => a.id === activityId);
  const article = articles.find((ar) => ar.id === articleId);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!universe || !activity || !article) {
    return <Navigate to="/" replace />;
  }

  const images = article.image ? [article.image] : [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const formatPrice = () => {
    if (article.priceType === "fixed") {
      return `${article.price} DH`;
    } else {
      const unit = article.durationUnit === "night" ? "nuit" : "jour";
      return `${article.pricePerUnit} DH/${unit}`;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-sm border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate(`/activity/${universeId}/${activityId}/articles`)}
            className="flex items-center gap-2 text-text-primary/60 hover:text-brand-gold transition-colors"
          >
            <ChevronLeft size={20} aria-hidden />
            <span className="text-sm tracking-widest uppercase">Retour aux articles</span>
          </button>

          <button
            onClick={() => navigate(`/book/${universeId}/${activityId}/${articleId}`)}
            className="flex items-center gap-2 px-6 py-2 bg-brand-gold hover:bg-brand-gold/90 text-bg-primary font-semibold rounded-lg transition-all"
          >
            <ShoppingCart size={18} aria-hidden />
            Réserver maintenant
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Main Image */}
            <div className="relative group">
              {images.length > 0 ? (
                <div className="relative overflow-hidden rounded-lg bg-text-primary/5 aspect-square">
                  <img
                    src={images[currentImageIndex]}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft size={24} aria-hidden />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Image suivante"
                      >
                        <ChevronRight size={24} aria-hidden />
                      </button>

                      {/* Image Indicator */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentImageIndex ? "bg-brand-gold w-8" : "bg-white/50 hover:bg-white"
                            }`}
                            aria-label={`Image ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full aspect-square rounded-lg bg-text-primary/10 flex items-center justify-center">
                  <span className="text-text-primary/30 text-sm">Pas d'image disponible</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? "border-brand-gold" : "border-border-primary hover:border-brand-gold/50"
                    }`}
                  >
                    <img src={img} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col space-y-8"
          >
            {/* Breadcrumb */}
            <div className="text-sm text-text-primary/60 uppercase tracking-widest">
              <span>{universe.name}</span>
              <span className="mx-2">/</span>
              <span>{activity.title}</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl md:text-6xl font-serif mb-4">{article.title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-3xl text-brand-gold font-serif">{formatPrice()}</div>
                {article.availabilityCount && (
                  <span className="text-sm text-green-500 bg-green-500/10 px-4 py-2 rounded-lg">
                    ✓ {article.availabilityCount} disponibles
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {article.description && (
              <div className="space-y-4">
                <h2 className="text-lg font-serif text-text-primary">Description</h2>
                <p className="text-text-primary/70 leading-relaxed text-lg">{article.description}</p>
              </div>
            )}

            {/* Pricing Info */}
            <div className="bg-text-primary/5 border border-border-primary rounded-lg p-6 space-y-4">
              <h3 className="font-serif text-lg">Informations Tarifaires</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-border-primary/30">
                  <span className="text-text-primary/60">Type de tarification</span>
                  <span className="font-semibold">
                    {article.priceType === "fixed" ? "Prix fixe" : "Variable (par durée)"}
                  </span>
                </div>

                {article.priceType === "fixed" ? (
                  <div className="flex justify-between items-center pb-3 border-b border-border-primary/30">
                    <span className="text-text-primary/60">Prix unitaire</span>
                    <span className="font-semibold text-brand-gold text-lg">{article.price} DH</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center pb-3 border-b border-border-primary/30">
                      <span className="text-text-primary/60">Unité</span>
                      <span className="font-semibold capitalize">{article.durationUnit === "night" ? "Nuit" : "Jour"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-primary/60">Prix par {article.durationUnit === "night" ? "nuit" : "jour"}</span>
                      <span className="font-semibold text-brand-gold text-lg">{article.pricePerUnit} DH</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Stock Info */}
            {article.availabilityCount && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm text-green-700 dark:text-green-400">
                  ✓ {article.availabilityCount} unité(s) disponible(s) en stock
                </p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="pt-8 space-y-4 mt-auto">
              <button
                onClick={() => navigate(`/book/${universeId}/${activityId}/${articleId}`)}
                className="w-full px-8 py-4 bg-brand-gold hover:bg-brand-gold/90 text-bg-primary font-bold text-lg rounded-lg transition-all hover:shadow-lg hover:shadow-brand-gold/30 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} aria-hidden />
                Réserver cet article
              </button>
              <button
                onClick={() => navigate(`/activity/${universeId}/${activityId}/articles`)}
                className="w-full px-8 py-4 bg-text-primary/5 hover:bg-text-primary/10 text-text-primary font-semibold rounded-lg transition-all border border-border-primary"
              >
                Voir d'autres articles
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related Products Section */}
      <section className="border-t border-border-primary mt-16 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif mb-4">Autres Articles de l'activité</h2>
            <p className="text-text-primary/60">Découvrez plus de produits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for related articles - could be populated dynamically */}
            <div className="text-center text-text-primary/40 py-12 col-span-full">
              <p>Consultez la page des articles pour voir tous les produits disponibles</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
