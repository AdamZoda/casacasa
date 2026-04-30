import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Shield,
  Package,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { useShopping } from "../context/ShoppingContext";

/** Accent type bouton CTA (proche du orange vitrine de référence) */
const CTA_ORANGE = "bg-[#F1A139] hover:bg-[#e0952f] text-black";

type FeaturedRow = {
  type: "activity" | "article";
  id: string;
  universeId: string;
  activityId: string;
  title: string;
  description: string;
  image: string;
  price: string;
  categoryLabel: string;
};

export function FeaturedCarousel() {
  const { activities, articles } = useAppContext();
  const { favorites, toggleFavorite } = useShopping();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const featuredItems: FeaturedRow[] = useMemo(() => {
    const fromActivities = activities
      .filter((a) => a.isFeatured)
      .map((a) => ({
        type: "activity" as const,
        id: a.id,
        universeId: a.universeId,
        activityId: a.id,
        title: a.title,
        description: a.description,
        image: a.image,
        price: a.price,
        categoryLabel: a.category,
      }));
    const fromArticles = articles
      .filter((ar) => ar.isFeatured)
      .map((ar) => {
        const act = activities.find((x) => x.id === ar.activityId);
        return {
          type: "article" as const,
          id: ar.id,
          universeId: act?.universeId ?? "",
          activityId: ar.activityId,
          title: ar.title,
          description: ar.description,
          image: ar.image,
          price:
            ar.pricePerUnit != null
              ? String(ar.pricePerUnit)
              : ar.price != null
                ? String(ar.price)
                : "",
          categoryLabel: act?.category ?? "SÉLECTION",
        };
      });
    return [...fromActivities, ...fromArticles];
  }, [activities, articles]);

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

  const itemHref = (() => {
    const u = currentItem.universeId;
    if (!u) return "/services";
    if (currentItem.type === "activity") {
      return `/activity/${u}/${currentItem.activityId}/articles`;
    }
    return `/article/${u}/${currentItem.activityId}/${currentItem.id}/detail`;
  })();

  const favoriteKey = `${currentItem.type}-${currentItem.id}`;
  const isFav = favorites.includes(favoriteKey);

  const renderPrice = (raw: string) => {
    const t = raw.trim().replace(/\b(à\s*partir\s+de\s*){2,}/gi, "À partir de ");
    if (!t) return null;
    const lower = t.toLowerCase();
    const looksComplete =
      /à\s*partir|€|\beur\b|\bmad\b|\bdh\b|\/\s*jour|par\s+jour/i.test(lower);
    if (looksComplete) {
      return (
        <p className="text-2xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50">
          {t}
        </p>
      );
    }
    return (
      <p className="text-2xl font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50">
        <span className="text-base font-normal text-neutral-500 dark:text-neutral-400">À partir de </span>
        {t}
        <span className="text-base font-normal text-neutral-500 dark:text-neutral-400"> MAD</span>
      </p>
    );
  };

  return (
    <section className="bg-brand-cream/40 py-14 dark:bg-bg-primary/80 md:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        {/* En-tête type vitrine */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-neutral-900 dark:text-neutral-50 md:text-4xl">
              À la une
            </h2>
            <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
              Des expériences et pièces d’exception pour votre univers.
            </p>
          </div>
          <Link
            to="/services"
            className="shrink-0 text-sm font-bold uppercase tracking-wide text-neutral-900 transition-colors hover:text-[#F1A139] dark:text-neutral-100 dark:hover:text-[#F1A139]"
          >
            Voir tout →
          </Link>
        </div>

        {/* Carte produit — image en haut, info en bas, cadre fixe */}
        <article className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)] dark:border-white/[0.08] dark:bg-[#1a1a1a] dark:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]" style={{ minHeight: '756px' }}>
          <div className="flex flex-col h-full">
            {/* Image — en haut, hauteur fixe */}
            <motion.div
              className="relative w-full shrink-0 overflow-hidden"
              style={{ height: '416px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentItem.id}
                  src={currentItem.image}
                  alt={currentItem.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                />
              </AnimatePresence>
              <span className="absolute left-4 top-4 z-10 border border-neutral-900 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-900 dark:border-white dark:bg-neutral-900 dark:text-white">
                Exclusif
              </span>
            </motion.div>

            {/* Contenu — en bas */}
            <div className="flex w-full flex-col justify-between gap-6 p-6 sm:p-8 lg:p-10 flex-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F1A139]">
                    Disponible
                  </p>
                  <div className="flex items-center gap-1.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} className="fill-current" strokeWidth={0} aria-hidden />
                    ))}
                    <span className="text-xs text-neutral-400 ml-1">(1)</span>
                  </div>
                </div>
                <motion.h3
                  key={`title-${currentItem.id}`}
                  className="font-serif text-2xl font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 md:text-3xl"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentItem.title}
                </motion.h3>
                <div className="flex items-center gap-4 flex-wrap">
                  <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
                    {currentItem.categoryLabel}
                  </p>
                  {currentItem.price ? renderPrice(currentItem.price) : null}
                </div>
                <motion.p
                  key={`desc-${currentItem.id}`}
                  className="line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                >
                  {currentItem.description}
                </motion.p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-stretch gap-3">
                  <Link
                    to={itemHref}
                    className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-xs font-bold uppercase tracking-[0.2em] transition-colors ${CTA_ORANGE}`}
                  >
                    <ShoppingCart size={18} strokeWidth={2} aria-hidden />
                    Découvrir
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(favoriteKey)}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white transition-colors hover:border-[#F1A139] hover:text-[#F1A139] dark:border-white/15 dark:bg-transparent ${
                      isFav ? "border-[#F1A139] text-[#F1A139]" : "text-neutral-700 dark:text-neutral-200"
                    }`}
                    aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                    aria-pressed={isFav}
                  >
                    <Heart size={20} className={isFav ? "fill-current" : ""} strokeWidth={1.5} />
                  </button>
                </div>
                <div className="flex items-center gap-6 border-t border-neutral-200/80 pt-4 text-[11px] text-neutral-500 dark:border-white/10 dark:text-neutral-400">
                  <p className="flex items-center gap-2">
                    <Package size={14} strokeWidth={1.5} className="shrink-0 text-neutral-400" />
                    Paiement à la livraison disponible
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield size={14} strokeWidth={1.5} className="shrink-0 text-neutral-400" />
                    Satisfait ou remboursé sous 7 jours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Navigation carrousel sous la carte */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex w-full max-w-md items-center justify-between gap-4">
            <button
              type="button"
              onClick={goToPrevious}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/5"
              aria-label="Précédent"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <div className="flex min-h-8 flex-1 items-center justify-center gap-1.5 px-2">
              {featuredItems.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-10 bg-[#F1A139]" : "w-1.5 bg-neutral-300 dark:bg-neutral-600"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                  aria-current={idx === currentIndex}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goToNext}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/5"
              aria-label="Suivant"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
          <p className="text-[11px] tabular-nums text-neutral-400">
            {currentIndex + 1} / {featuredItems.length}
          </p>
        </div>
      </div>
    </section>
  );
}
