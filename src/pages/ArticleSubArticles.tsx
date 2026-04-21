import { useParams, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";

export function ArticleSubArticles() {
  const { universeId, activityId, articleId } = useParams<{
    universeId: string;
    activityId: string;
    articleId: string;
  }>();
  const navigate = useNavigate();
  const { universes, activities, articles } = useAppContext();

  const universe = universes.find((u) => u.id === universeId);
  const activity = activities.find((a) => a.id === activityId);
  const parentArticle = articles.find((ar) => ar.id === articleId);

  // Get child articles for this parent
  const childArticles = parentArticle
    ? articles.filter(
        (a) => a.parentArticleId === parentArticle.id && a.articleType === "child"
      )
    : [];

  if (!universe || !activity || !parentArticle) {
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
          <div className="flex items-center gap-3 mb-8 text-sm flex-wrap">
            <button
              onClick={() => navigate(`/universe/${universeId}`)}
              className="text-text-primary/50 hover:text-brand-gold transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} aria-hidden />
              {universe.name}
            </button>
            <span className="text-text-primary/30">/</span>
            <button
              onClick={() =>
                navigate(
                  `/activity/${universeId}/${activityId}/articles`
                )
              }
              className="text-text-primary/50 hover:text-brand-gold transition-colors"
            >
              {activity.title}
            </button>
            <span className="text-text-primary/30">/</span>
            <span className="text-text-primary">{parentArticle.title}</span>
          </div>

          {/* Parent Article Info */}
          <div className="flex items-start gap-6">
            {parentArticle.image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="hidden md:block w-24 h-24 rounded-lg overflow-hidden border border-border-primary flex-shrink-0"
              >
                <img
                  src={parentArticle.image}
                  alt={parentArticle.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-widest rounded-full border border-brand-gold/20">
                  <Layers size={12} aria-hidden />
                  Article parent
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif">{parentArticle.title}</h1>
              {parentArticle.description && (
                <p className="text-text-primary/60 text-lg max-w-2xl">
                  {parentArticle.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sub-Articles Grid */}
      <section className="flex-1 py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {childArticles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-text-primary/5 flex items-center justify-center">
                <Layers size={28} className="text-text-primary/30" aria-hidden />
              </div>
              <p className="text-text-primary/50 text-lg mb-6">
                Aucun sous-article disponible pour cet article
              </p>
              <button
                onClick={() =>
                  navigate(
                    `/activity/${universeId}/${activityId}/articles`
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold/10 hover:bg-brand-gold hover:text-bg-primary text-brand-gold font-semibold rounded-lg transition-all"
              >
                <ChevronLeft size={16} aria-hidden />
                Retour aux articles
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-12">
                <p className="text-text-primary/60 text-sm uppercase tracking-widest mb-2">
                  {childArticles.length}{" "}
                  {childArticles.length > 1
                    ? "sous-articles disponibles"
                    : "sous-article disponible"}
                </p>
                <div className="w-12 h-px bg-brand-gold/40 mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {childArticles.map((article, index) => (
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
                        {/* Sub-article badge */}
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider rounded">
                            <Layers size={10} aria-hidden />
                            Sous-article
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-serif text-text-primary mb-3 line-clamp-2">
                        {article.title}
                      </h3>

                      {article.description && (
                        <p className="text-sm text-text-primary/60 line-clamp-3 mb-4 flex-1">
                          {article.description}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline justify-between py-4 border-t border-border-primary/30">
                        <span className="text-base text-brand-gold font-semibold">
                          {formatPrice(article)}
                        </span>
                        {article.availabilityCount && (
                          <span className="text-xs text-text-primary/50">
                            Stock: {article.availabilityCount}
                          </span>
                        )}
                      </div>

                      {/* Detail Button */}
                      <button
                        onClick={() =>
                          navigate(
                            `/article/${universeId}/${activityId}/${article.id}/detail`
                          )
                        }
                        className="w-full mt-4 px-4 py-3 bg-brand-gold/10 hover:bg-brand-gold hover:text-bg-primary text-brand-gold font-semibold text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                      >
                        Voir les détails
                        <ChevronRight
                          size={16}
                          className="group-hover/btn:translate-x-1 transition-transform"
                          aria-hidden
                        />
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
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() =>
              navigate(`/activity/${universeId}/${activityId}/articles`)
            }
            className="inline-flex items-center gap-2 px-8 py-3 border border-border-primary hover:border-brand-gold/50 text-text-primary/70 hover:text-text-primary font-semibold rounded-lg transition-all"
          >
            <ChevronLeft size={16} aria-hidden />
            Retour aux articles
          </button>
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
