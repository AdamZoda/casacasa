import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { useShopping } from "../context/ShoppingContext";
import { Heart } from "lucide-react";
import { LazyImg } from "../components/LazyImg";

export function Universe() {
  const { id } = useParams<{ id: string }>();
  const { universes, activities } = useAppContext();
  const { favorites, toggleFavorite } = useShopping();
  
  const universe = universes.find(u => u.id === id);
  const universeActivities = activities.filter(a => a.universeId === id);

  if (!universe) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col w-full">
      {/* Immersive Banner */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-brand-black text-brand-white">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <LazyImg
            priority
            src={universe.heroImage}
            alt={universe.name}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-bg-primary"></div>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto mt-20">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl mb-8 grayscale opacity-80"
          >
            {universe.flag}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl mb-8 font-serif text-white drop-shadow-2xl"
          >
            {universe.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/90 font-light tracking-[0.3em] uppercase drop-shadow-md"
          >
            {universe.location}
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
        >
          <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]">Discover</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-brand-gold/50 to-transparent"
          />
        </motion.div>
      </section>

      {/* Description */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center w-full">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-px w-24 bg-brand-gold mx-auto mb-16"
        />
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="text-sm md:text-base font-light tracking-wide text-text-primary/80 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          Experience the magic of the Kingdom with exclusive access to private riads, desert camps, and VIP events.
        </motion.p>
      </section>

      {/* Catalogue of Activities — visual mosaic */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto border-t border-border-primary">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Expériences Exclusives</h2>
          <p className="text-xs tracking-[0.2em] uppercase text-text-primary/50">Curated for you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {universeActivities.map((activity, index) => {
            const targetPath =
              activity.articleDisplayType === "articles_only"
                ? `/activity/${universe.id}/${activity.id}/articles`
                : `/book/${universe.id}/${activity.id}`;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (index % 8) * 0.04 }}
                className="relative overflow-hidden border border-border-primary/70 bg-black group"
              >
                <Link to={targetPath} className="block relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <LazyImg
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                  <span className="absolute left-2 top-2 bg-white/85 text-black text-[8px] px-2 py-1 uppercase tracking-wider font-semibold">
                    {activity.category || "Activité"}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-white text-xs font-semibold uppercase tracking-wide line-clamp-2">
                      {activity.title}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(activity.id);
                  }}
                  className={`absolute right-2 top-2 z-20 p-2 rounded-full backdrop-blur border transition-all duration-300 ${
                    favorites.includes(activity.id)
                      ? "bg-brand-gold border-brand-gold text-brand-black"
                      : "bg-black/30 border-white/25 text-white hover:bg-white/30"
                  }`}
                  aria-label="Ajouter aux favoris"
                >
                  <Heart size={14} fill={favorites.includes(activity.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
