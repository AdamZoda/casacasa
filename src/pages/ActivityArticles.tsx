import { useParams, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ActivityArticles() {
  const { universeId, activityId } = useParams<{ universeId: string; activityId: string }>();
  const navigate = useNavigate();
  const { universes, activities, getArticlesByActivityId } = useAppContext();

  const universe = universes.find((u) => u.id === universeId);
  const activity = activities.find((a) => a.id === activityId);
  const articles = activity ? getArticlesByActivityId(activity.id) : [];

  if (!universe || !activity) {
    return <Navigate to="/" replace />;
  }

  const formatPrice = (article: any) => {
    if (article.priceType === "fixed") {
      return `${article.price} DH`;
    } else {
      const unit = article.durationUnit === "night" ? "nuit" : "jour";
      return `À partir de ${article.pricePerUnit} DH/${unit}`;
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header with breadcrumb */}
      <section className="bg-bg-primary border-b border-border-primary">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8 text-sm">
            <button
              onClick={() => navigate(`/universe/${universeId}`)}
              className="text-text-primary/50 hover:text-brand-gold transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} aria-hidden />
              {universe.name}
            </button>
            <span className="text-text-primary/30">/</span>
            <span className="text-text-primary">{activity.title}</span>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif">{activity.title}</h1>
            <p className="text-text-primary/60 text-lg max-w-2xl">{activity.description}</p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="flex-1 py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-primary/50 text-lg mb-6">Aucun article disponible pour cette activité</p>
              <button
                onClick={() => navigate(`/universe/${universeId}`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold/10 hover:bg-brand-gold hover:text-bg-primary text-brand-gold font-semibold rounded-lg transition-all"
              >
                <ChevronLeft size={16} aria-hidden />
                Retour à l'activité
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-12">
                <p className="text-text-primary/60 text-sm uppercase tracking-widest mb-2">
                  {articles.length} {articles.length > 1 ? "articles disponibles" : "article disponible"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group rounded-lg border border-border-primary overflow-hidden hover:border-brand-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/10 flex flex-col h-full"
                  >
                    {/* Image */}
                    {article.image && (
                      <div className="relative h-56 overflow-hidden bg-text-primary/5">
                        <img
                          src={article.image}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-serif text-text-primary mb-3 line-clamp-2">{article.title}</h3>

                      {article.description && (
                        <p className="text-sm text-text-primary/60 line-clamp-3 mb-4 flex-1">{article.description}</p>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline justify-between py-4 border-t border-border-primary/30">
                        <span className="text-base text-brand-gold font-semibold">{formatPrice(article)}</span>
                        {article.availabilityCount && (
                          <span className="text-xs text-text-primary/50">Stock: {article.availabilityCount}</span>
                        )}
                      </div>

                      {/* Reserve Button */}
                      <button
                        onClick={() => navigate(`/article/${universeId}/${activityId}/${article.id}/detail`)}
                        className="w-full mt-4 px-4 py-3 bg-brand-gold/10 hover:bg-brand-gold hover:text-bg-primary text-brand-gold font-semibold text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                      >
                        Voir les détails
                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border-primary bg-text-primary/[0.02] py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-text-primary/60 mb-6">Vous avez besoin d'aide pour choisir ?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold hover:bg-brand-gold/90 text-bg-primary font-semibold rounded-lg transition-all"
          >
            Nous contacter
          </a>
        </div>
      </section>
    </div>
  );
}
