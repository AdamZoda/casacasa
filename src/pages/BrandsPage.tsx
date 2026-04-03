import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

export function BrandsPage() {
  const { universes, language } = useAppContext();
  const t = translations[language];

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {universes.map((brand, index) => (
            <Link key={brand.id} to={`/universe/${brand.id}`} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden"
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
                <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-5xl drop-shadow-lg filter grayscale group-hover:grayscale-0 transition-all duration-700">{brand.flag}</span>
                    <span className="text-white/90 text-[10px] uppercase tracking-[0.3em] font-medium drop-shadow-md">
                      {brand.location}
                    </span>
                  </div>
                  
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <h3 className="text-4xl md:text-5xl font-serif text-white mb-6 drop-shadow-md">
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
          ))}
        </div>
      </div>
    </div>
  );
}
