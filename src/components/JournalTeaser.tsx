import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

export function JournalTeaser() {
  const { journalPosts } = useAppContext();
  const latestPosts = journalPosts.slice(0, 3);

  if (latestPosts.length === 0) return null;

  return (
    <section className="py-32 px-6 bg-bg-primary relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-px w-24 bg-brand-gold mb-10 origin-left" 
            />
            <h2 className="text-5xl md:text-5xl font-serif leading-tight mb-5">
              Le Journal <span className="text-brand-gold italic">De l'Excellence</span>
            </h2>
            <p className="text-text-primary/40 font-light text-lg tracking-wide uppercase">
              Récits exclusifs, destinations secrètes et art de vivre.
            </p>
          </div>
          
          <Link to="/journal">
            <motion.button 
              whileHover={{ gap: "2rem" }}
              className="flex items-center gap-6 px-10 py-5 border border-border-primary hover:border-brand-gold/40 transition-all text-sm tracking-[0.3em] font-bold uppercase"
            >
              Explorer Tout le Journal <ArrowRight size={20} className="text-brand-gold" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {latestPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <Link to={`/journal/${post.id}`}>
                <div className="relative aspect-[4/5] overflow-hidden mb-8">
                  <motion.img 
                    src={post.image} 
                    alt={post.title}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-brand-black/20 group-hover:bg-transparent transition-colors duration-700" />
                  <div className="absolute top-6 left-6 px-4 py-2 bg-text-primary/10 backdrop-blur-md border border-white/10 text-[10px] uppercase font-bold tracking-widest text-text-primary">
                    {post.category}
                  </div>
                </div>
                <h3 className="text-2xl font-serif mb-4 group-hover:text-brand-gold transition-colors duration-500">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-text-primary/30 text-[10px] uppercase tracking-widest font-bold">
                  <BookOpen size={14} />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <div className="w-1 h-1 bg-brand-gold rounded-full" />
                  <span>5 min de lecture</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
