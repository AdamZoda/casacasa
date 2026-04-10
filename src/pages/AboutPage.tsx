import { motion } from "motion/react";
import { useAppContext } from "../context/AppContext";
import { Instagram, Facebook, Linkedin, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { MapSection } from "../components/MapSection";

type SocialItem = {
  key: "instagram" | "facebook" | "linkedin" | "youtube";
  label: string;
  icon: typeof Instagram;
  urls: string[];
  visible: boolean;
};

export function AboutPage() {
  const { settings } = useAppContext();
  const about = settings.about;
  const phones = settings.phones.filter(Boolean);
  const socials: SocialItem[] = [
    { key: "instagram", label: "Instagram", icon: Instagram, urls: settings.socialLinks.instagram, visible: about.visibility.showInstagram },
    { key: "facebook", label: "Facebook", icon: Facebook, urls: settings.socialLinks.facebook, visible: about.visibility.showFacebook },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin, urls: settings.socialLinks.linkedin, visible: about.visibility.showLinkedin },
    { key: "youtube", label: "YouTube", icon: Youtube, urls: settings.socialLinks.youtube, visible: about.visibility.showYoutube },
  ];
  const socialLinks = socials
    .filter((s) => s.visible)
    .flatMap((s) =>
      s.urls.filter(Boolean).map((url) => ({
        key: `${s.key}-${url}`,
        label: s.label,
        icon: s.icon,
        url,
      }))
    );
  const heroImage =
    about.imageUrl ||
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2800&auto=format&fit=crop";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,169,58,0.2),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(229,169,58,0.14),transparent_40%)]" />

      <section className="relative h-[88vh] min-h-[620px] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          src={heroImage}
          alt="About Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-[#050505]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.8)_5%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.65)_100%)]" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1550px] items-end px-6 pb-20 md:px-10 lg:px-16">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-[10px] font-bold uppercase tracking-[0.5em] text-brand-gold"
            >
              Maison Signature
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6 font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl"
            >
              {about.title || "A Propos"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="max-w-3xl text-base leading-relaxed text-white/78 md:text-xl"
            >
              {about.subtitle}
            </motion.p>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-12 max-w-[1550px] space-y-10 px-6 pb-24 md:px-10 lg:px-16">
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="space-y-8 xl:col-span-7">
            {about.visibility.showStory && (
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 md:p-10"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_0%_0%,rgba(229,169,58,0.18),transparent_44%)]" />
                <p className="relative mb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-brand-gold">Notre histoire</p>
                <h2 className="relative mb-5 font-serif text-3xl md:text-4xl">Une obsession du detail</h2>
                <p className="relative text-base leading-relaxed text-white/78">{about.story}</p>
              </motion.article>
            )}

            {about.visibility.showMission && (
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-90px" }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 md:p-10"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_100%_100%,rgba(229,169,58,0.16),transparent_44%)]" />
                <p className="relative mb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-brand-gold">Notre mission</p>
                <h2 className="relative mb-5 font-serif text-3xl md:text-4xl">Transformer l'ordinaire en rare</h2>
                <p className="relative text-base leading-relaxed text-white/78">{about.mission}</p>
              </motion.article>
            )}
          </div>

          <div className="space-y-8 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10"
            >
              <img src={heroImage} alt="Casa Privilege" className="h-[430px] w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <p className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.32em] text-brand-gold">Casa Privilege</p>
            </motion.div>

            {about.visibility.showContactCard && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
              >
                <h3 className="mb-5 font-serif text-2xl">Contact direct</h3>
                <div className="space-y-3 text-sm text-white/80">
                  <p className="flex items-center gap-2"><Mail size={16} className="text-brand-gold" /> {settings.contactEmail}</p>
                  <p className="flex items-center gap-2"><MapPin size={16} className="text-brand-gold" /> {settings.address}</p>
                  {phones.map((p) => (
                    <p key={p} className="flex items-center gap-2"><Phone size={16} className="text-brand-gold" /> {p}</p>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </section>

        {about.visibility.showSocials && socialLinks.length > 0 && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 lg:p-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="font-serif text-3xl">Réseaux Officiels</h3>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">Follow & Connect</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/30 px-5 py-4 transition-colors hover:border-brand-gold/60"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_10%_10%,rgba(229,169,58,0.3),transparent_45%)]" />
                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm">
                      <item.icon size={16} className="text-brand-gold" />
                      {item.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-white/45 group-hover:text-brand-gold">Open</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </section>
        )}
        {/* Map Section */}
        <MapSection />      </div>
    </div>
  );
}
