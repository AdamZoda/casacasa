import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Article } from '../context/AppContext';

interface ChildArticlesCarouselProps {
  parentArticleId: string;
  childArticles: Article[];
  isReservable?: boolean;
}

export function ChildArticlesCarousel({
  parentArticleId,
  childArticles,
  isReservable = false,
}: ChildArticlesCarouselProps) {
  const [scrollContainer, setScrollContainer] = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainer.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScroll();
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [childArticles]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 300;
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (childArticles.length === 0) return null;

  return (
    <section className="py-12 md:py-16 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-serif text-text-primary">
            Articles Connexes
          </h3>
          <p className="text-sm text-text-primary/60 mt-1">
            {childArticles.length} option{childArticles.length > 1 ? 's' : ''} disponible{childArticles.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full transition-all ${
              canScrollLeft
                ? 'bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold'
                : 'bg-text-primary/5 text-text-primary/30 cursor-not-allowed'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-full transition-all ${
              canScrollRight
                ? 'bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold'
                : 'bg-text-primary/5 text-text-primary/30 cursor-not-allowed'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainer}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {childArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-center"
            >
              <Link
                to={`/journal/${article.id}`}
                className="group h-full flex flex-col gap-3 p-4 rounded-lg border border-border-primary hover:border-brand-gold/50 bg-bg-secondary/40 transition-all duration-300 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative w-full aspect-video overflow-hidden rounded-md bg-text-primary/5">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-primary/20">
                      No Image
                    </div>
                  )}
                  {article.isReservable && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-brand-gold/90 text-brand-black text-xs font-bold rounded">
                      ✓ Réservable
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1">
                  <h4 className="font-semibold text-sm md:text-base text-text-primary line-clamp-2 group-hover:text-brand-gold transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-xs md:text-sm text-text-primary/60 line-clamp-2">
                    {article.description}
                  </p>

                  {/* Price (if reservable) */}
                  {article.isReservable && article.price && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="mt-auto pt-3 border-t border-border-primary"
                    >
                      <p className="text-sm font-bold text-brand-gold">
                        {article.priceType === 'fixed'
                          ? `${article.price} DH`
                          : `À partir de ${article.pricePerUnit} DH`}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* CTA Button */}
                <button className="w-full py-2 px-3 mt-2 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold text-xs font-semibold uppercase rounded transition-colors">
                  Voir Plus
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
