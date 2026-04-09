import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

// Detect if URL is a video (YouTube, Vimeo, or direct video file)
const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com') ||
    url.includes('.mp4') ||
    url.includes('.webm') ||
    url.includes('.mov') ||
    url.includes('.avi')
  );
};

// Get YouTube embed URL from various YouTube URL formats
const getYouTubeEmbedUrl = (url: string): string => {
  const videoIdMatch = 
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/) ||
    url.match(/([a-zA-Z0-9_-]{11})/);
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1&controls=0&modestbranding=1` : '';
};

export function Hero() {
  const { language, settings } = useAppContext();
  const t = translations[language];

  const bgUrl = settings.heroBackgroundUrl || 'https://images.unsplash.com/photo-1540998145320-f5139c824c62?q=80&w=2940&auto=format&fit=crop';
  const title = settings.heroTitle || t.hero.title;
  const subtitle = settings.heroSubtitle || t.hero.subtitle;
  const cta = settings.heroCta || t.hero.cta;

  const isVideo = isVideoUrl(bgUrl);
  const isYouTube = bgUrl?.includes('youtube') || bgUrl?.includes('youtu.be');
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(bgUrl) : '';

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Video or Image */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        {isVideo && isYouTube && youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen"
            title="Hero Video Background"
          />
        ) : isVideo && bgUrl?.includes('vimeo') ? (
          <iframe
            src={bgUrl.replace('vimeo.com', 'player.vimeo.com/video').replace(/\/(\d+)/, '/$1')}
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen"
            title="Hero Video Background"
          />
        ) : isVideo && (bgUrl?.includes('.mp4') || bgUrl?.includes('.webm') || bgUrl?.includes('.mov')) ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={bgUrl} type={bgUrl.includes('.webm') ? 'video/webm' : 'video/mp4'} />
          </video>
        ) : (
          <img
            src={bgUrl}
            alt="Hero Background"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540998145320-f5139c824c62?q=80&w=2940&auto=format&fit=crop'; }}
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary"></div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto mt-20">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white mb-8 font-serif leading-tight drop-shadow-2xl"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/90 font-light tracking-[0.2em] uppercase mb-16 drop-shadow-md"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Link
            to="/services"
            className="group relative inline-flex items-center justify-center px-10 py-5 bg-transparent border border-brand-gold/50 text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-500 ease-out overflow-hidden"
          >
            <span className="relative z-10 font-light tracking-[0.15em] text-sm uppercase">{cta}</span>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
      >
        <span className="text-white/50 text-[10px] uppercase tracking-[0.3em]"></span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-brand-gold/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}

