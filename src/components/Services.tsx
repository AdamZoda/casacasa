import { motion } from "motion/react";
import { Plane, Trophy, Home, ConciergeBell } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

const services = [
  {
    id: "sports",
    title: "Sports Experiences",
    description: "Champions League, FA Cup, Formula 1 Paddock Club, and exclusive VIP access.",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: "aviation",
    title: "Private Aviation",
    description: "Bespoke routes: Marrakech to Ibiza, Paris to St Tropez. Premium fleet access.",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1583416750470-965b2707b355?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: "villas",
    title: "Real Estate & Villas",
    description: "Exclusive properties in Ibiza, Marrakech, St Tropez, and beyond.",
    icon: Home,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2940&auto=format&fit=crop"
  },
  {
    id: "concierge",
    title: "Concierge Services",
    description: "Personalized lifestyle management, reservations, and bespoke requests.",
    icon: ConciergeBell,
    image: "https://images.unsplash.com/photo-1551882547-ff40c0d13c11?q=80&w=2940&auto=format&fit=crop"
  }
];

export function Services() {
  const { language } = useAppContext();
  const t = translations[language];

  return (
    <section id="services" className="py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
      <div className="text-center mb-32">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl mb-8 font-serif"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-32">
        {services.map((service, index) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className={`group cursor-pointer ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
          >
            <div className={`relative w-full overflow-hidden mb-8 ${index % 2 === 0 ? 'h-[60vh]' : 'h-[70vh]'}`}>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-start gap-6">
              <div className="mt-1 text-brand-gold">
                <service.icon strokeWidth={1} size={28} />
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl mb-4 font-serif group-hover:text-brand-gold transition-colors duration-500">
                  {service.title}
                </h3>
                <p className="text-text-primary/60 font-light leading-relaxed text-lg">
                  {service.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
