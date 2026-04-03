import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

export function Journal() {
  const { language, journalPosts } = useAppContext();
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
            {t.journal.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs tracking-[0.3em] uppercase text-text-primary/50"
          >
            {t.journal.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {journalPosts.map((post, index) => (
            <Link key={post.id} to={`/journal/${post.id}`} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
                className="flex flex-col h-full"
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 bg-bg-primary/90 backdrop-blur-md px-4 py-2 border border-border-primary">
                    <span className="text-[10px] tracking-[0.2em] uppercase font-medium">{post.category}</span>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] text-text-primary/40 tracking-[0.1em]">{post.date}</span>
                    <div className="h-px flex-grow bg-border-primary/30" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-serif mb-4 group-hover:text-brand-gold transition-colors duration-500">
                    {post.title}
                  </h3>
                  <p className="text-text-primary/60 font-light text-sm line-clamp-3 mb-8 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-4 group-hover:gap-6 transition-all duration-500">
                  <span className="text-xs uppercase tracking-[0.2em] font-medium">{t.journal.readMore}</span>
                  <div className="h-px w-12 bg-brand-gold" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
