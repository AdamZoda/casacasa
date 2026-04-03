import { motion } from "motion/react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { journalPosts } from "../data/content";
import { translations } from "../i18n/translations";
import { ArrowLeft } from "lucide-react";

export function JournalPost() {
  const { id } = useParams<{ id: string }>();
  const { language } = useAppContext();
  const t = translations[language];

  const post = journalPosts.find(p => p.id === id);

  if (!post) {
    return <Navigate to="/journal" replace />;
  }

  return (
    <div className="min-h-screen pt-40 pb-32 px-6 md:px-12 lg:px-24 w-full">
      <div className="max-w-[1000px] mx-auto">
        <Link to="/journal" className="group inline-flex items-center gap-4 mb-16 text-text-primary/60 hover:text-brand-gold transition-colors duration-500">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase tracking-[0.2em] font-medium">{t.journal.back}</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-6 mb-8">
            <span className="text-xs tracking-[0.3em] uppercase text-brand-gold font-medium">{post.category}</span>
            <div className="h-px w-12 bg-border-primary/30" />
            <span className="text-xs tracking-[0.1em] uppercase text-text-primary/40">{post.date}</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl mb-12 font-serif leading-tight">
            {post.title}
          </h1>

          <div className="relative aspect-[16/9] overflow-hidden mb-16">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="max-w-[700px] mx-auto">
            <p className="text-2xl font-serif mb-12 text-text-primary/80 leading-relaxed italic">
              {post.excerpt}
            </p>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg font-light text-text-primary/70 leading-loose mb-8">
                {post.content}
              </p>
              <p className="text-lg font-light text-text-primary/70 leading-loose mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-lg font-light text-text-primary/70 leading-loose mb-8">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
