import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

export function BrandsPage() {
  const { universes, activities, articles, language } = useAppContext();
  const t = translations[language];
  const [activityIndexes, setActivityIndexes] = useState<Record<string, number[]>>({});
  const [articleIndexes, setArticleIndexes] = useState<Record<string, number>>({});

  const activitiesByUniverse = useMemo(() => {
    return universes.reduce<Record<string, typeof activities>>((acc, universe) => {
      acc[universe.id] = activities.filter((activity) => activity.universeId === universe.id);
      return acc;
    }, {});
  }, [activities, universes]);

  const articlesByUniverse = useMemo(() => {
    return universes.reduce<Record<string, typeof articles>>((acc, universe) => {
      const activityIds = new Set(
        activities
          .filter((activity) => activity.universeId === universe.id)
          .map((activity) => activity.id)
      );

      acc[universe.id] = articles.filter((article) => activityIds.has(article.activityId));
      return acc;
    }, {});
  }, [activities, articles, universes]);

  useEffect(() => {
    if (universes.length === 0) return;

    const pickNextIndexes = () => {
      setActivityIndexes((current) =>
        universes.reduce<Record<string, number[]>>((next, universe) => {
          const universeActivities = activitiesByUniverse[universe.id] ?? [];
          if (universeActivities.length <= 1) {
            next[universe.id] = [0];
            return next;
          }

          const currentIndexes = current[universe.id] ?? [0, 1];
          const firstOffset = Math.floor(Math.random() * (universeActivities.length - 1)) + 1;
          const firstIndex = ((currentIndexes[0] ?? 0) + firstOffset) % universeActivities.length;
          const secondChoices = universeActivities
            .map((_, idx) => idx)
            .filter((idx) => idx !== firstIndex);
          const secondIndex = secondChoices[Math.floor(Math.random() * secondChoices.length)] ?? firstIndex;

          next[universe.id] = [firstIndex, secondIndex];
          return next;
        }, {})
      );

      setArticleIndexes((current) =>
        universes.reduce<Record<string, number>>((next, universe) => {
          const universeArticles = articlesByUniverse[universe.id] ?? [];
          if (universeArticles.length <= 1) {
            next[universe.id] = 0;
            return next;
          }

          const currentIndex = current[universe.id] ?? 0;
          const randomOffset = Math.floor(Math.random() * (universeArticles.length - 1)) + 1;
          next[universe.id] = (currentIndex + randomOffset) % universeArticles.length;
          return next;
        }, {})
      );
    };

    pickNextIndexes();
    const timer = window.setInterval(pickNextIndexes, 5000);
    return () => window.clearInterval(timer);
  }, [activitiesByUniverse, articlesByUniverse, universes]);

  return (
    <div className="min-h-screen pt-40 pb-32 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-32">
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            className="h-px w-24 bg-brand-gold mx-auto mb-8"
          />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl mb-6 font-serif"
          >
            {t.nav.universes}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs tracking-[0.3em] uppercase text-text-primary/50"
          >
            Choose Your Universe
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {universes.map((brand, index) => {
            const brandActivities = activitiesByUniverse[brand.id] ?? [];
            const activeActivities = (activityIndexes[brand.id] ?? [0, 1])
              .map((activityIndex) => brandActivities[activityIndex])
              .filter(Boolean);
            const brandArticles = articlesByUniverse[brand.id] ?? [];
            const activeArticle = brandArticles[articleIndexes[brand.id] ?? 0];

            return (
              <div key={brand.id} className="space-y-4">
                <Link to={`/universe/${brand.id}`} className="group block">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                    className="relative h-[58vh] min-h-[420px] w-full overflow-hidden"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={brand.heroImage}
                        alt={brand.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 xl:p-10">
                      <div className="flex justify-between items-start">
                        <span className="text-4xl drop-shadow-lg filter grayscale group-hover:grayscale-0 transition-all duration-700">{brand.flag}</span>
                        <span className="text-right text-white/90 text-[9px] uppercase tracking-[0.25em] font-medium drop-shadow-md">
                          {brand.location}
                        </span>
                      </div>

                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                        <h3 className="text-3xl font-serif text-white mb-4 drop-shadow-md xl:text-4xl">
                          {brand.name}
                        </h3>
                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                          <div className="h-px w-16 bg-brand-gold" />
                          <span className="text-brand-gold text-[10px] uppercase tracking-[0.2em]">Explore</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
                {activeActivities.map((activeActivity) => (
                  <motion.div
                    key={activeActivity.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="overflow-hidden border border-white/10 bg-white/[0.03]"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={activeActivity.image}
                        alt={activeActivity.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="border-l border-brand-gold px-4 py-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-brand-gold">
                        Activite du moment
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold uppercase tracking-wide text-text-primary">
                        {activeActivity.title}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {activeArticle ? (
                  <motion.div
                    key={activeArticle.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="overflow-hidden border border-brand-gold/30 bg-brand-gold/[0.06]"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-black">
                      <img
                        src={activeArticle.image}
                        alt={activeArticle.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="border-l border-brand-gold px-4 py-3">
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-brand-gold">
                        Article du moment
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold uppercase tracking-wide text-text-primary">
                        {activeArticle.title}
                      </p>
                    </div>
                  </motion.div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
