import { motion } from "motion/react";
import { Plane, Trophy, Home as HomeIcon, ConciergeBell, Globe } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { LazyImg } from "./LazyImg";
import { translations } from "../i18n/translations";

export function Services() {
  const { language, globalServices } = useAppContext();
  const t = translations[language];

  // Map icons based on titles or default to Globe
  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('sport')) return Trophy;
    if (t.includes('avia') || t.includes('jet')) return Plane;
    if (t.includes('villa') || t.includes('real estate')) return HomeIcon;
    if (t.includes('concie')) return ConciergeBell;
    return Globe;
  };


  return (
    <section id="services" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="text-center mb-14 sm:mb-20 md:mb-32">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 sm:mb-8 font-serif"
        >
          {t.services.title}
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-px w-24 bg-brand-gold mx-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-16 lg:gap-x-24 gap-y-14 sm:gap-y-20 md:gap-y-32">
        {globalServices?.map((service, index) => {
          const Icon = getIcon(service.title);
          return (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className={`group cursor-pointer ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
            >
              <div className={`relative w-full overflow-hidden mb-6 sm:mb-8 ${index % 2 === 0 ? 'h-[46vh] sm:h-[56vh] md:h-[60vh]' : 'h-[52vh] sm:h-[62vh] md:h-[70vh]'}`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <LazyImg 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="mt-1 text-brand-gold">
                  <Icon strokeWidth={1} size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4 font-serif group-hover:text-brand-gold transition-colors duration-500">
                    {service.title}
                  </h3>
                  <p className="text-text-primary/60 font-light leading-relaxed text-base sm:text-lg">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
