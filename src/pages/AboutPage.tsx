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
      <div className="pointer-events-none fixed inset-0 bg-[#050505]" />

      <section className="relative h-[62vh] min-h-[420px] sm:h-[88vh] sm:min-h-[620px] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          src={heroImage}
          alt="About Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,5,0.35)_0%,rgba(5,5,5,0.62)_58%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.8)_5%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.65)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-48 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1550px] items-end px-4 pb-10 sm:px-6 sm:pb-20 md:px-10 lg:px-16">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-2 sm:mb-4 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.35em] sm:tracking-[0.5em] text-brand-gold"
            >
              Maison Signature
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-3 sm:mb-6 font-serif text-3xl sm:text-5xl leading-[0.95] md:text-7xl lg:text-8xl"
            >
              {about.title || "A Propos"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="max-w-3xl text-sm sm:text-base leading-snug sm:leading-relaxed text-white/78 md:text-xl"
            >
              {about.subtitle}
            </motion.p>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-[1550px] px-4 py-10 sm:px-6 sm:py-20 md:px-10 lg:px-16">
        

        <section className="grid grid-cols-1 gap-4 sm:gap-8 xl:grid-cols-12">
          <div className="space-y-4 sm:space-y-8 xl:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              {about.visibility.showStory && (
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  className="group relative min-h-[250px] sm:min-h-[360px] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-8 md:p-10"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_0%_0%,rgba(229,169,58,0.16),transparent_44%)]" />
                  <p className="relative mb-4 sm:mb-10 text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-white/35">01</p>
                  <p className="relative mb-2 sm:mb-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.24em] sm:tracking-[0.32em] text-brand-gold">Notre histoire</p>
                  <h2 className="relative mb-3 sm:mb-5 font-serif text-xl sm:text-3xl leading-tight md:text-4xl">Une obsession du detail</h2>
                  <p className="relative text-xs sm:text-sm leading-relaxed sm:leading-loose text-white/70 md:text-base">{about.story}</p>
                </motion.article>
              )}

              {about.visibility.showMission && (
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-90px" }}
                  className="group relative min-h-[250px] sm:min-h-[360px] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-8 md:p-10"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 bg-[radial-gradient(circle_at_100%_100%,rgba(229,169,58,0.14),transparent_44%)]" />
                  <p className="relative mb-4 sm:mb-10 text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-white/35">02</p>
                  <p className="relative mb-2 sm:mb-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.24em] sm:tracking-[0.32em] text-brand-gold">Notre mission</p>
                  <h2 className="relative mb-3 sm:mb-5 font-serif text-xl sm:text-3xl leading-tight md:text-4xl">Transformer l'ordinaire en rare</h2>
                  <p className="relative text-xs sm:text-sm leading-relaxed sm:leading-loose text-white/70 md:text-base">{about.mission}</p>
                </motion.article>
              )}
            </div>

            {about.visibility.showSocials && socialLinks.length > 0 && (
              <section className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.025] p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="mb-4 sm:mb-8 flex flex-col justify-between gap-3 sm:gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className="mb-2 sm:mb-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.26em] sm:tracking-[0.35em] text-brand-gold">Presence</p>
                    <h3 className="font-serif text-xl sm:text-3xl md:text-4xl">Réseaux officiels</h3>
                  </div>
                  <p className="max-w-xs text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/35">Follow & connect</p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2">
                  {socialLinks.map((item) => (
                    <motion.a
                      key={item.key}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -4 }}
                      className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-black/30 px-3 py-3 sm:px-5 sm:py-5 transition-colors hover:border-brand-gold/60"
                    >
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_10%_10%,rgba(229,169,58,0.22),transparent_45%)]" />
                      <div className="relative flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <item.icon size={15} className="text-brand-gold" />
                          {item.label}
                        </span>
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-widest text-white/45 group-hover:text-brand-gold">Open</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4 sm:space-y-6 xl:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-90px" }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10"
            >
              <img src={heroImage} alt="Casa Privilege" className="h-[280px] sm:h-[520px] w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
                <p className="mb-2 sm:mb-3 text-[9px] sm:text-[10px] uppercase tracking-[0.24em] sm:tracking-[0.32em] text-brand-gold">Signature</p>
                <h3 className="font-serif text-xl sm:text-3xl">Casa Privilege</h3>
              </div>
            </motion.div>

            {about.visibility.showContactCard && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-7 md:p-8"
              >
                <p className="mb-2 sm:mb-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.24em] sm:tracking-[0.35em] text-brand-gold">Acces prive</p>
                <h3 className="mb-4 sm:mb-6 font-serif text-xl sm:text-3xl">Contact direct</h3>
                <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white/78">
                  <p className="flex items-start gap-3">
                    <Mail size={14} className="mt-0.5 shrink-0 text-brand-gold" />
                    <span>{settings.contactEmail}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-brand-gold" />
                    <span>{settings.address}</span>
                  </p>
                  {phones.map((p) => (
                    <p key={p} className="flex items-start gap-3">
                      <Phone size={14} className="mt-0.5 shrink-0 text-brand-gold" />
                      <span>{p}</span>
                    </p>
                  ))}
                </div>
              </motion.section>
            )}
          </aside>
        </section>
      </main>

      <div className="relative z-10 border-t border-white/10 pt-8 sm:pt-16">
        <MapSection />
      </div>
    </div>
  );
}
