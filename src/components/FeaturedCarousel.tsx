import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export function FeaturedCarousel() {
  const { activities, articles } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Combinar todos os itens principais (activities e articles)
  const featuredItems = [
    ...activities.filter(a => a.isFeatured).map(a => ({
      type: 'activity' as const,
      id: a.id,
      title: a.title,
      description: a.description,
      image: a.image,
      price: a.price,
    })),
    ...articles.filter(ar => ar.isFeatured).map(ar => ({
      type: 'article' as const,
      id: ar.id,
      title: ar.title,
      description: ar.description,
      image: ar.image,
      price: ar.pricePerUnit?.toString() || ar.price?.toString() || '',
    })),
  ];

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (featuredItems.length === 0 || !autoRotate) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [autoRotate, featuredItems.length]);

  const goToPrevious = () => {
    setAutoRotate(false);
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    setTimeout(() => setAutoRotate(true), 5000);
  };

  const goToNext = () => {
    setAutoRotate(false);
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    setTimeout(() => setAutoRotate(true), 5000);
  };

  const goToIndex = (index: number) => {
    setAutoRotate(false);
    setCurrentIndex(index);
    setTimeout(() => setAutoRotate(true), 5000);
  };

  if (featuredItems.length === 0) return null;

  const currentItem = featuredItems[currentIndex];

  return (
    <section className="py-12 md:py-16 flex items-center justify-center">
      {/* Cadre doré centré et responsive */}
      <div className="relative w-full max-w-5xl px-3 md:px-4 lg:px-6">
        {/* Bordure dorée gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/40 via-brand-gold/20 to-brand-gold/40 rounded-xl md:rounded-2xl blur-2xl -z-10" />
        
        <div className="border border-brand-gold/60 md:border-2 rounded-xl md:rounded-2xl p-1 bg-bg-primary/80 backdrop-blur-sm">
          {/* Inner content with subtle gradient */}
          <div className="relative bg-gradient-to-br from-bg-primary via-bg-primary to-brand-gold/5 rounded-lg md:rounded-xl p-4 md:p-6 lg:p-8">
            {/* Top decorative line - hidden on mobile */}
            <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
            
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 items-stretch min-h-auto md:min-h-[300px]">
              {/* Image - Responsive */}
              <motion.div 
                className="w-full md:w-5/12 flex items-center justify-center overflow-hidden rounded-lg border border-brand-gold/30 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full aspect-square md:aspect-auto">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentItem.id}
                      src={currentItem.image}
                      alt={currentItem.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  </AnimatePresence>
                  
                  {/* Image overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>

              {/* Content - Right Side */}
              <motion.div 
                className="w-full md:w-7/12 flex flex-col justify-between gap-3 md:gap-4 lg:gap-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Text Content */}
                <div className="space-y-2 md:space-y-3">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <span className="inline-block px-2 md:px-3 py-1 bg-brand-gold/15 border border-brand-gold/40 rounded-full text-xs uppercase tracking-widest text-brand-gold font-bold">
                      ✨ Principal
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h2 
                    key={`title-${currentItem.id}`}
                    className="text-xl md:text-2xl lg:text-3xl font-serif text-text-primary leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    {currentItem.title}
                  </motion.h2>

                  {/* Description */}
                  <motion.p 
                    key={`desc-${currentItem.id}`}
                    className="text-xs md:text-sm text-text-primary/70 leading-relaxed line-clamp-2 md:line-clamp-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    {currentItem.description}
                  </motion.p>

                  {/* Price */}
                  {currentItem.price && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="flex items-baseline gap-1 md:gap-2"
                    >
                      <span className="text-xs uppercase tracking-widest text-text-primary/50">À partir de</span>
                      <span className="text-lg md:text-xl font-serif text-brand-gold">
                        {currentItem.price}
                      </span>
                      <span className="text-xs text-text-primary/50">MAD</span>
                    </motion.div>
                  )}
                </div>

                {/* Navigation Controls */}
                <div className="space-y-2 md:space-y-3">
                  {/* Progress Dots */}
                  <motion.div 
                    className="flex items-center gap-2 md:gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <button
                      onClick={goToPrevious}
                      className="p-1.5 md:p-2 rounded-full border border-brand-gold/40 hover:border-brand-gold/80 hover:bg-brand-gold/10 transition-all duration-300 group flex-shrink-0"
                      aria-label="Anterior"
                    >
                      <ChevronLeft size={16} className="md:w-5 md:h-5 text-brand-gold group-hover:text-brand-gold" />
                    </button>

                    {/* Dots */}
                    <div className="flex gap-1.5 md:gap-2 flex-1 justify-center">
                      {featuredItems.map((_, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => goToIndex(idx)}
                          className={`transition-all duration-300 ${
                            idx === currentIndex
                              ? 'bg-gradient-to-r from-brand-gold to-brand-gold/80 w-5 md:w-6 h-1.5 md:h-2'
                              : 'bg-brand-gold/25 w-1.5 md:w-2 h-1.5 md:h-2 hover:bg-brand-gold/40'
                          }`}
                          style={{ borderRadius: '2px' }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`Item ${idx + 1}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={goToNext}
                      className="p-1.5 md:p-2 rounded-full border border-brand-gold/40 hover:border-brand-gold/80 hover:bg-brand-gold/10 transition-all duration-300 group flex-shrink-0"
                      aria-label="Próximo"
                    >
                      <ChevronRight size={16} className="md:w-5 md:h-5 text-brand-gold group-hover:text-brand-gold" />
                    </button>
                  </motion.div>

                  {/* Counter */}
                  <motion.div
                    className="text-center text-xs text-text-primary/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    <span className="font-semibold text-text-primary/70">
                      {currentIndex + 1} <span className="text-text-primary/40">/ {featuredItems.length}</span>
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Bottom decorative line - hidden on mobile */}
            <div className="hidden md:block absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
