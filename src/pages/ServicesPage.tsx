import { motion } from "motion/react";
import { globalServices } from "../data/content";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

export function ServicesPage() {
  const { language } = useAppContext();
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
            {t.nav.services}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs tracking-[0.3em] uppercase text-text-primary/50"
          >
            The Pinnacle of Luxury Experiences
          </motion.p>
        </div>

        <div className="flex flex-col gap-32">
          {globalServices.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-24 items-center`}
            >
              <div className="w-full lg:w-1/2 h-[50vh] lg:h-[70vh] overflow-hidden relative group">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="flex items-center gap-6 mb-8">
                  <span className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-medium">0{index + 1}</span>
                  <div className="h-px w-12 bg-border-primary" />
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 font-serif leading-tight">{service.title}</h2>
                <p className="text-lg md:text-xl text-text-primary/60 font-light leading-relaxed mb-12">
                  {service.description}
                </p>
                <Link 
                  to="/contact"
                  className="self-start group relative inline-flex items-center justify-center px-10 py-5 bg-transparent border border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-primary transition-all duration-500 ease-out overflow-hidden"
                >
                  <span className="relative z-10 font-light tracking-[0.15em] text-sm uppercase">Request Service</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
