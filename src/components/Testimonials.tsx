import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export function Testimonials() {
  const { testimonials } = useAppContext();
  const approvedTestimonials = testimonials.filter(t => t.isApproved);

  return (
    <section className="py-32 px-6 bg-brand-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6"
          >
            Témoignages
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-serif mb-12"
          >
            L'Expérience Casa Privilege
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-px w-32 bg-brand-gold mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
          {approvedTestimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center group relative"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <Quote size={120} strokeWidth={0.5} className="text-brand-gold" />
              </div>
              
              <div className="flex gap-1 mb-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={12} className="fill-brand-gold text-brand-gold" />
                ))}
              </div>

              <p className="text-xl md:text-2xl font-light leading-relaxed mb-12 text-white/70 italic font-serif relative z-10">
                "{testimonial.content}"
              </p>
              
              <div className="mt-auto space-y-3">
                <div className="w-12 h-px bg-brand-gold/30 mx-auto" />
                <p className="font-serif text-brand-gold text-xl tracking-wide">{testimonial.name}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {approvedTestimonials.length === 0 && (
          <div className="text-center py-24 text-white/20 italic font-light tracking-widest">
            Découvrez bientôt les retours de nos membres exclusifs.
          </div>
        )}
      </div>
    </section>
  );
}
