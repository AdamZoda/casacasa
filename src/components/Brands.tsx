import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

export function Brands() {
  const { universes, language } = useAppContext();
  const t = translations[language];

  return (
    <section className="py-40 px-6 bg-bg-primary">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-px w-24 bg-brand-gold mb-8"
            />
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl mb-8 font-serif text-text-primary"
            >
              {t.brands.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-text-primary/60 font-light text-lg md:text-xl leading-relaxed"
            >
              {t.brands.subtitle}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pb-2"
          >
            <Link to="/brands" className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] font-medium text-text-primary hover:text-brand-gold transition-colors">
              <span>{language === 'fr' ? 'Explorer tout' : 'Explore all'}</span>
              <span className="w-8 h-px bg-text-primary group-hover:bg-brand-gold group-hover:w-12 transition-all duration-500"></span>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {universes.map((brand, index) => (
            <Link key={brand.id} to={`/universe/${brand.id}`} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className="relative h-[500px] w-full overflow-hidden"
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
                <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-4xl drop-shadow-lg filter grayscale group-hover:grayscale-0 transition-all duration-700">{brand.flag}</span>
                    <span className="text-white/90 text-[10px] uppercase tracking-[0.3em] font-medium drop-shadow-md">
                      {brand.location}
                    </span>
                  </div>
                  
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                    <h3 className="text-3xl font-serif text-white mb-4 drop-shadow-md">
                      {brand.name}
                    </h3>
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      <div className="h-px w-12 bg-brand-gold" />
                      <span className="text-brand-gold text-[10px] uppercase tracking-[0.2em]">Discover</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
