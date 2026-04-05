import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { Heart } from "lucide-react";

export function Universe() {
  const { id } = useParams<{ id: string }>();
  const { universes, activities, favorites, toggleFavorite } = useAppContext();
  
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
          <img
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
      <section className="py-40 px-6 max-w-5xl mx-auto text-center w-full">
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
          className="text-3xl md:text-5xl font-serif leading-relaxed text-text-primary"
        >
          "{universe.description}"
        </motion.p>
      </section>

      {/* Catalogue of Activities */}
      <section className="py-32 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto border-t border-border-primary">
        <div className="text-center mb-32">
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Expériences Exclusives</h2>
          <p className="text-xs tracking-[0.2em] uppercase text-text-primary/50">Curated for you</p>
        </div>
        
        <div className="flex flex-col gap-32">
          {universeActivities.map((activity, index) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24 items-center`}
            >
              <div className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] overflow-hidden relative group">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(activity.id);
                  }}
                  className={`absolute top-8 right-8 z-20 p-4 rounded-full backdrop-blur-md border transition-all duration-500 ${favorites.includes(activity.id) ? 'bg-brand-gold border-brand-gold text-brand-black' : 'bg-black/20 border-white/20 text-white hover:bg-white/40'}`}
                >
                  <Heart size={20} fill={favorites.includes(activity.id) ? "currentColor" : "none"} strokeWidth={1.5} />
                </button>
              </div>
              
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <span className="text-brand-gold text-[10px] uppercase tracking-[0.3em] mb-6">{activity.category}</span>
                <h3 className="text-4xl md:text-5xl lg:text-6xl mb-8 font-serif leading-tight">{activity.title}</h3>
                <p className="text-text-primary/60 font-light leading-relaxed mb-12 text-lg md:text-xl">
                  {activity.description}
                </p>
                <div className="flex items-center gap-8 mb-12">
                  <div className="h-px w-12 bg-border-primary" />
                  <p className="font-serif text-2xl">
                    {activity.price}
                  </p>
                </div>
                <Link 
                  to={`/book/${universe.id}/${activity.id}`}
                  className="self-start group relative inline-flex items-center justify-center px-10 py-5 bg-transparent border border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-primary transition-all duration-500 ease-out overflow-hidden"
                >
                  <span className="relative z-10 font-light tracking-[0.15em] text-sm uppercase">Réserver cette activité</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Premium Gallery */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto w-full border-t border-border-primary">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">Gallery</h2>
          <p className="text-xs tracking-[0.2em] uppercase text-text-primary/50">Visual Journey</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {universe.gallery.map((img, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative overflow-hidden group ${index === 0 ? 'md:col-span-2 h-[60vh] md:h-[80vh]' : 'h-[50vh]'}`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img 
                src={img} 
                alt={`${universe.name} Gallery ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
