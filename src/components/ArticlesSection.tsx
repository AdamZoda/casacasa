import React from "react";
import { useNavigate } from "react-router-dom";
import { type Article } from "../context/AppContext";
import { ChevronRight } from "lucide-react";

interface ArticlesSectionProps {
  articles: Article[];
  universeId: string;
  activityId: string;
}

export function ArticlesSection({ articles, universeId, activityId }: ArticlesSectionProps) {
  const navigate = useNavigate();

  const formatPrice = (article: Article) => {
    if (article.priceType === "fixed") {
      return `${article.price} DH`;
    } else {
      const unit = article.durationUnit === "night" ? "nuit" : "jour";
      return `À partir de ${article.pricePerUnit} DH/${unit}`;
    }
  };

  if (articles.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-text-primary/50">Aucun article disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="group rounded-lg border border-border-primary overflow-hidden hover:border-brand-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-gold/10"
          >
            {/* Image */}
            {article.image && (
              <div className="relative h-48 overflow-hidden bg-text-primary/5">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-4 space-y-3">
              <h3 className="text-base font-serif text-text-primary line-clamp-2">{article.title}</h3>

              {article.description && (
                <p className="text-xs text-text-primary/60 line-clamp-2">{article.description}</p>
              )}

              {/* Price */}
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-sm text-brand-gold font-semibold">{formatPrice(article)}</span>
                {article.availabilityCount && (
                  <span className="text-xs text-text-primary/50">Stock: {article.availabilityCount}</span>
                )}
              </div>

              {/* Reserve Button */}
              <button
                onClick={() => navigate(`/book/${universeId}/${activityId}/${article.id}`)}
                className="w-full mt-4 px-4 py-2.5 bg-brand-gold/10 hover:bg-brand-gold hover:text-bg-primary text-brand-gold font-semibold text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn"
              >
                Réserver
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
