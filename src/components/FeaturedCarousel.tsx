import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useShopping } from "../context/ShoppingContext";
import { formatMoney } from "../lib/utils";

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

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function FeaturedCarousel() {
  const { activities, articles, currency, exchangeRates } = useAppContext();
  const { favorites, toggleFavorite } = useShopping();
  const [displayedItems, setDisplayedItems] = useState<FeaturedRow[]>([]);

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
    if (featuredItems.length === 0) return;

    const updateItems = () => {
      setDisplayedItems(shuffle([...featuredItems]).slice(0, 6));
    };

    updateItems();
    const timer = setInterval(updateItems, 5000);

    return () => clearInterval(timer);
  }, [featuredItems]);

  if (displayedItems.length === 0) return null;

  const renderPrice = (raw: string) => {
    const t = raw.trim().replace(/\b(à\s*partir\s+de\s*){2,}/gi, "À partir de ");
    if (!t) return null;
    const numericChunk = t.match(/(\d[\d\s.,]*)/)?.[1] ?? "";
    const cleanedChunk = numericChunk.replace(/\s/g, "");
    const lastComma = cleanedChunk.lastIndexOf(",");
    const lastDot = cleanedChunk.lastIndexOf(".");
    const hasComma = lastComma !== -1;
    const hasDot = lastDot !== -1;
    const normalizedChunk =
      hasComma && hasDot
        ? (lastComma > lastDot
            ? cleanedChunk.replace(/\./g, "").replace(",", ".")
            : cleanedChunk.replace(/,/g, ""))
        : hasComma
          ? cleanedChunk.replace(",", ".")
          : cleanedChunk;
    const extractedAmount = Number(normalizedChunk);
    const hasAmount = Number.isFinite(extractedAmount) && extractedAmount > 0;
    const unitMatch = t.match(/\/\s*(jour|jours|nuit|nuits)/i);
    const unitSuffix = unitMatch ? `/${unitMatch[1].toLowerCase()}` : "";
    const startsFrom = /à\s*partir\s*de/i.test(t);
    const lower = t.toLowerCase();
    const looksComplete =
      /à\s*partir|€|\beur\b|\bmad\b|\bdh\b|\/\s*jour|par\s+jour/i.test(lower);
    if (hasAmount) {
      const converted = `${formatMoney(extractedAmount, currency, exchangeRates)}${unitSuffix}`;
      return (
        <p className="text-lg font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50">
          {startsFrom ? "À partir de " : ""}
          {converted}
        </p>
      );
    }
    if (looksComplete) {
      return (
        <p className="text-lg font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50">
          {t}
        </p>
      );
    }
    return (
      <p className="text-lg font-semibold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-50">
        <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">À partir de </span>
        {t}
        <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400"> MAD</span>
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

        {/* Grille de 6 produits aléatoires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedItems.map((currentItem) => {
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

            return (
              <article key={favoriteKey} className="overflow-hidden flex flex-col rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] dark:border-white/[0.08] dark:bg-[#1a1a1a] dark:shadow-[0_15px_40px_-20px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-[320px] lg:h-[380px] w-full shrink-0 overflow-hidden">
                  <img
                    src={currentItem.image}
                    alt={currentItem.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 z-10 border border-neutral-900 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-900 dark:border-white dark:bg-neutral-900 dark:text-white">
                    Exclusif
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex flex-col flex-1 justify-between gap-4 p-5 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F1A139]">
                        Disponible
                      </p>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={11} className="fill-current" strokeWidth={0} aria-hidden />
                        <span className="text-[10px] text-neutral-400 font-medium ml-0.5">5.0</span>
                      </div>
                    </div>
                    <h3 className="font-serif text-xl font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-50 line-clamp-2" title={currentItem.title}>
                      {currentItem.title}
                    </h3>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
                        {currentItem.categoryLabel}
                      </p>
                      {currentItem.price ? renderPrice(currentItem.price) : null}
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {currentItem.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/5 mt-auto">
                    <div className="flex items-stretch gap-2">
                      <Link
                        to={itemHref}
                        className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors ${CTA_ORANGE}`}
                      >
                        <ShoppingCart size={16} strokeWidth={2} aria-hidden />
                        Découvrir
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(favoriteKey)}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white transition-colors hover:border-[#F1A139] hover:text-[#F1A139] dark:border-white/15 dark:bg-transparent ${
                          isFav ? "border-[#F1A139] text-[#F1A139]" : "text-neutral-700 dark:text-neutral-200"
                        }`}
                        aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        aria-pressed={isFav}
                      >
                        <Heart size={18} className={isFav ? "fill-current" : ""} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
