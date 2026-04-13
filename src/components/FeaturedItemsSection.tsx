import React, { useState, useCallback } from 'react';
import { useFeaturedItems } from '../hooks/useFeaturedItems';
import { LazyImg } from './LazyImg';

interface FeaturedItemsProps {
  pageSize?: number;
  autoLoad?: boolean;
}

export function FeaturedItemsSection({ pageSize = 12, autoLoad = true }: FeaturedItemsProps) {
  const { allItems, total } = useFeaturedItems(1000); // Get all items
  const [displayedCount, setDisplayedCount] = useState(pageSize);

  const loadMore = useCallback(() => {
    setDisplayedCount(prev => Math.min(prev + pageSize, total));
  }, [pageSize, total]);

  const displayedItems = allItems.slice(0, displayedCount);

  // Organize items by display type
  const itemsByType = {
    hero: displayedItems.filter(item => item.displayType === 'hero'),
    card: displayedItems.filter(item => item.displayType === 'card'),
    grid: displayedItems.filter(item => item.displayType === 'grid'),
    carousel: displayedItems.filter(item => item.displayType === 'carousel'),
  };

  if (allItems.length === 0) {
    return null; // Don't render if no featured items
  }

  return (
    <div className="space-y-16 py-12">
      {/* Hero Items */}
      {itemsByType.hero.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-text-primary">À la une</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {itemsByType.hero.map((item) => (
              <HeroCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Carousel Items */}
      {itemsByType.carousel.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif text-text-primary">Sélection</h2>
          <CarouselSection items={itemsByType.carousel} />
        </section>
      )}

      {/* Grid Items */}
      {itemsByType.grid.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif text-text-primary">Découvrez</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsByType.grid.map((item) => (
              <GridCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Standard Cards with Infinite Scroll */}
      {itemsByType.card.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-serif text-text-primary">Explorez</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {itemsByType.card.map((item) => (
              <StandardCard key={item.id} item={item} />
            ))}
          </div>

          {/* Load More Button */}
          {displayedCount < total && (
            <div className="flex justify-center pt-8">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-semibold rounded-lg transition-colors"
              >
                Charger plus ({displayedCount} / {total})
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

type FeaturedItem = ReturnType<typeof useFeaturedItems>['allItems'][number];

interface CardProps {
  item: FeaturedItem;
}

function HeroCard({ item }: CardProps) {
  return (
    <div className="group cursor-pointer rounded-xl overflow-hidden bg-bg-secondary border border-border-primary hover:border-brand-gold/50 transition-all duration-300">
      <div className="aspect-video relative overflow-hidden">
        <LazyImg
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 to-transparent" />
      </div>
      <div className="p-6 absolute bottom-0 left-0 right-0">
        <h3 className="text-2xl font-serif text-text-primary mb-2">{item.title}</h3>
        <p className="text-text-primary/70 text-sm line-clamp-2">{item.description}</p>
        {item.price && <p className="text-brand-gold font-semibold mt-3">{item.price} DH</p>}
      </div>
    </div>
  );
}

function StandardCard({ item }: CardProps) {
  return (
    <div className="group cursor-pointer rounded-lg overflow-hidden bg-bg-secondary border border-border-primary hover:border-brand-gold/50 transition-all duration-300 flex flex-col">
      <div className="aspect-square relative overflow-hidden bg-text-primary/5">
        <LazyImg
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-text-primary font-medium line-clamp-2 mb-2">{item.title}</h3>
        <p className="text-text-primary/60 text-xs line-clamp-2 flex-1">{item.description}</p>
        {item.price && (
          <p className="text-brand-gold font-semibold mt-3 text-sm">{item.price} DH</p>
        )}
      </div>
    </div>
  );
}

function GridCard({ item }: CardProps) {
  return (
    <div className="group cursor-pointer rounded-lg overflow-hidden bg-bg-secondary border border-border-primary hover:border-brand-gold/50 transition-all duration-300">
      <div className="aspect-square relative overflow-hidden">
        <LazyImg
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-text-primary font-medium text-sm line-clamp-1">{item.title}</h3>
        {item.price && <p className="text-brand-gold font-semibold text-xs mt-2">{item.price} DH</p>}
      </div>
    </div>
  );
}

function CarouselSection({ items }: { items: any[] }) {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = 400;
    const newPosition = scrollPosition + (direction === 'left' ? -scrollAmount : scrollAmount);
    containerRef.current.scrollLeft = newPosition;
    setScrollPosition(newPosition);
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-96">
            <StandardCard item={item} />
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {items.length > 2 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black transition-colors"
            aria-label="Scroll left"
          >
            ← 
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-brand-black transition-colors"
            aria-label="Scroll right"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
