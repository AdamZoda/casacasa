import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Save,
  Globe,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  ShieldAlert,
  X,
  Palette,
  Image as ImageIcon,
  MessageCircle,
  Layout as LayoutIcon,
  RotateCcw,
  Upload,
  Loader2,
  CreditCard,
  ShieldCheck,
  Plus,
  Trash2,
  Navigation,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { HIDEABLE_PUBLIC_PATHS } from "../../lib/hiddenPages";
import { uploadImage } from "../../lib/storage";
import { AdminPageHeader } from "../../components/admin/adminShared";

const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com") ||
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes(".mov") ||
    url.includes(".avi")
  );
};

const isYouTubeUrl = (url: string): boolean => {
  return !!url && (url.includes("youtube.com") || url.includes("youtu.be"));
};

const getYouTubeEmbedUrl = (url: string): string => {
  const videoIdMatch =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/) ||
    url.match(/([a-zA-Z0-9_-]{11})/);
  return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&mute=1&controls=0&modestbranding=1` : "";
};

type TabType = "general" | "design" | "bank" | "security";

type StringListProps = {
  items: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel: string;
  inputClassName?: string;
};

function StringListEditor({ items, onChange, placeholder, addLabel, inputClassName }: StringListProps) {
  const inputCls = inputClassName ?? "admin-input min-h-[2.75rem] flex-1 py-3 px-4 text-sm";
  const update = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i));
  const add = () => onChange([...items, ""]);
  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={v}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 rounded-lg p-2.5 text-text-primary/35 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Supprimer la ligne"
          >
            <Trash2 size={16} aria-hidden />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-lg border border-border-primary/50 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-text-primary/50 transition-colors hover:border-brand-gold/35 hover:text-brand-gold"
      >
        <Plus size={14} aria-hidden />
        {addLabel}
      </button>
    </div>
  );
}

export function SettingsView() {
  const { settings, updateSettings, language } = useAppContext();
  const [formData, setFormData] = useState(settings);
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = () => {
    void updateSettings(formData);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  const currentHeroBgUrl = formData.heroBackgroundUrl?.trim() || "";
  const isHeroYouTube = isYouTubeUrl(currentHeroBgUrl);
  const heroYouTubeEmbedUrl = isHeroYouTube ? getYouTubeEmbedUrl(currentHeroBgUrl) : "";
  const isHeroVimeo = currentHeroBgUrl.includes("vimeo.com");
  const isHeroDirectVideo = currentHeroBgUrl.includes(".mp4") || currentHeroBgUrl.includes(".webm") || currentHeroBgUrl.includes(".mov");

  const tabs: { id: TabType; label: string; icon: LucideIcon }[] = [
    { id: "general", label: "Informations", icon: Globe },
    { id: "design", label: "Design & apparence", icon: Palette },
    { id: "bank", label: "Gestion RIB", icon: CreditCard },
    { id: "security", label: "Sécurité & dates", icon: ShieldAlert },
  ];

  const activeLabel = tabs.find((t) => t.id === activeTab)?.label ?? "";

  const handleReset = (section: string) => {
    if (section === "hero") {
      setFormData({
        ...formData,
        heroBackgroundUrl:
          "https://images.unsplash.com/photo-1540998145320-f5139c824c62?q=80&w=2940&auto=format&fit=crop",
        heroTitle: "",
        heroSubtitle: "",
        heroCta: "",
      });
    } else if (section === "branding") {
      setFormData({
        ...formData,
        brandGoldColor: "#E5A93A",
        logoText: "CASA PRIVILEGE",
      });
    }
  };

  const inputIconLeft = "relative";
  const inputWithIcon = "admin-input w-full py-3.5 pl-12 pr-4 text-sm min-h-[3rem]";
  const labelClass = "text-[10px] uppercase tracking-[0.2em] text-text-primary/50 font-bold block mb-2";
  const subsectionClass =
    "text-[10px] uppercase tracking-[0.22em] text-text-primary/55 font-bold border-l-2 border-brand-gold pl-4";

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-24">
      <AdminPageHeader
        kicker="Paramètres"
        title="Configuration globale"
        subtitle={`« ${activeLabel} » · Supabase site_settings`}
        action={
          <button
            type="button"
            onClick={() => handleSubmit()}
            className={`inline-flex items-center justify-center gap-3 rounded-lg px-8 py-4 text-[10px] uppercase tracking-[0.25em] font-bold transition-all shadow-lg ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-brand-gold text-brand-black hover:bg-brand-gold/90 active:scale-[0.99]"
            }`}
          >
            {saved ? <ShieldCheck size={18} aria-hidden /> : <Save size={18} aria-hidden />}
            {saved ? "Enregistré" : "Enregistrer les modifications"}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <nav
          className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0 lg:sticky lg:top-24 lg:self-start"
          aria-label="Sections de configuration"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 lg:w-full flex items-center gap-3.5 px-5 py-4 rounded-xl text-left text-[11px] font-semibold tracking-[0.08em] uppercase transition-all border ${
                  isActive
                    ? "bg-brand-gold/12 text-brand-gold border-brand-gold/35 shadow-[0_0_24px_rgba(229,169,58,0.12)]"
                    : "text-text-primary/45 hover:bg-text-primary/[0.05] hover:text-text-primary border-border-primary/40 hover:border-border-primary/60"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} className="shrink-0 opacity-90" aria-hidden />
                <span className="leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="lg:col-span-9 min-h-[520px]">
          {activeTab === "general" && (
            <div className="admin-card p-6 md:p-8 lg:p-10 space-y-10 animate-in fade-in duration-300">
              <div className="flex items-center gap-4 pb-6 border-b border-border-primary/40">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                  <Globe size={22} strokeWidth={1.25} aria-hidden />
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-text-primary">Informations publiques</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className={labelClass}>Nom de la plateforme</label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="admin-input w-full py-3.5 px-4 text-sm min-h-[3rem]"
                  />
                </div>
                <div>
                  <label className={labelClass}>E-mail de contact</label>
                  <div className={inputIconLeft}>
                    <Mail className="pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2 text-text-primary/35" size={18} />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className={inputWithIcon}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Téléphones</label>
                  <StringListEditor
                    items={formData.phones}
                    onChange={(phones) => setFormData({ ...formData, phones })}
                    placeholder="+212 …"
                    addLabel="Ajouter un numéro"
                  />
                </div>
                <div>
                  <label className={labelClass}>Siège social</label>
                  <div className={inputIconLeft}>
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 z-[1] -translate-y-1/2 text-text-primary/35" size={18} />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={inputWithIcon}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-text-primary/40 border-t border-border-primary/25 pt-6">
                Menu &amp; footer : onglet <span className="text-brand-gold/80">Design &amp; apparence</span>.
              </p>
            </div>
          )}

          {activeTab === "design" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="admin-card p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                    <Palette size={22} strokeWidth={1.25} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl md:text-2xl text-text-primary">Couleur d’accent</h3>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <input
                    type="color"
                    value={formData.brandGoldColor}
                    onChange={(e) => setFormData({ ...formData, brandGoldColor: e.target.value })}
                    className="size-14 cursor-pointer rounded-lg border border-border-primary bg-transparent"
                    aria-label="Sélecteur de couleur"
                  />
                  <input
                    type="text"
                    value={formData.brandGoldColor}
                    onChange={(e) => setFormData({ ...formData, brandGoldColor: e.target.value })}
                    className="admin-input w-[9.5rem] py-3.5 px-3 font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, brandGoldColor: "#E5A93A" })}
                    className="rounded-lg border border-border-primary/60 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-text-primary/50 transition-colors hover:border-brand-gold/40 hover:text-brand-gold"
                  >
                    Défaut Casa
                  </button>
                </div>
              </div>

              <div className="admin-card p-6 md:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                    <Palette size={22} strokeWidth={1.25} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif text-xl md:text-2xl text-text-primary">Style de texte</h3>
                    <p className="mt-1 text-[10px] text-text-primary/50">Sélectionnez le style de police pour tout le site</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <select
                    value={formData.fontStyle}
                    onChange={(e) => setFormData({ ...formData, fontStyle: e.target.value as "original" | "outfit" | "playfair" | "raleway" })}
                    className="admin-input py-3.5 px-4 text-sm min-h-[2.75rem]"
                  >
                    <option value="original">Original (Inter)</option>
                    <option value="outfit">Outfit (Elegant)</option>
                    <option value="playfair">Playfair Display (Luxury)</option>
                    <option value="raleway">Raleway (Modern)</option>
                  </select>
                </div>
              </div>

              <div className="admin-card space-y-10 p-6 md:p-8 lg:p-10">
                <div className="flex flex-col gap-4 border-b border-border-primary/40 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                      <ImageIcon size={22} strokeWidth={1.25} aria-hidden />
                    </div>
                    <h3 className="font-serif text-xl md:text-2xl text-text-primary">Page d’accueil (hero)</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleReset("hero")}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border-primary/60 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-text-primary/45 transition-colors hover:border-brand-gold/30 hover:text-brand-gold"
                  >
                    <RotateCcw size={14} aria-hidden /> Réinitialiser le hero
                  </button>
                </div>

                <div className="relative h-56 overflow-hidden rounded-xl border border-border-primary ring-1 ring-border-primary/30 md:h-64">
                  {currentHeroBgUrl ? (
                    isHeroYouTube && heroYouTubeEmbedUrl ? (
                      <iframe
                        src={heroYouTubeEmbedUrl}
                        className="h-full w-full object-cover"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Aperçu du hero YouTube"
                      />
                    ) : isHeroVimeo ? (
                      <iframe
                        src={currentHeroBgUrl.replace('vimeo.com', 'player.vimeo.com/video').replace(/\/([0-9]+)/, '/$1')}
                        className="h-full w-full object-cover"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Aperçu du hero Vimeo"
                      />
                    ) : isHeroDirectVideo ? (
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="h-full w-full object-cover"
                      >
                        <source
                          src={currentHeroBgUrl}
                          type={currentHeroBgUrl.includes('.webm') ? 'video/webm' : 'video/mp4'}
                        />
                      </video>
                    ) : (
                      <img
                        src={currentHeroBgUrl}
                        className="h-full w-full scale-105 object-cover opacity-70 transition-transform duration-700 hover:scale-100"
                        alt="Aperçu du hero"
                      />
                    )
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center bg-text-primary/[0.06] px-6 text-center text-[10px] uppercase tracking-widest text-text-primary/35"
                      role="img"
                      aria-label="Aucune image de hero"
                    >
                      Aucune image — URL ou envoi ci-dessous
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />
                  <div className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center p-6 text-center">
                    <p className="font-serif text-2xl text-white drop-shadow-md md:text-3xl">
                      {formData.heroTitle || "Titre du hero"}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-brand-gold">
                      {formData.heroSubtitle || "Sous-titre"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                  <div className="space-y-4">
                    <label className={labelClass}>Image ou Vidéo de fond (URL)</label>
                    <input
                      type="url"
                      value={formData.heroBackgroundUrl}
                      onChange={(e) => setFormData({ ...formData, heroBackgroundUrl: e.target.value })}
                      placeholder="https://… (image, YouTube, Vimeo, ou vidéo MP4)"
                      className="admin-input w-full py-3.5 px-4 font-mono text-sm"
                    />
                    <p className="text-[12px] text-text-primary/40 italic">
                      ✓ Images: JPG, PNG | ✓ YouTube: youtube.com/watch?v=... | ✓ Vimeo: vimeo.com/... | ✓ Vidéos: URL directe .mp4 .webm
                    </p>
                    <label className={labelClass}>Ou envoyer une image</label>
                    <label className="flex min-h-[10rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-primary bg-text-primary/[0.03] transition-colors hover:border-brand-gold/40 hover:bg-brand-gold/[0.04]">
                      {isUploading ? (
                        <Loader2 size={28} className="animate-spin text-brand-gold" aria-hidden />
                      ) : (
                        <Upload size={28} className="text-text-primary/25" aria-hidden />
                      )}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-primary/40">
                        {isUploading ? "Envoi…" : "Choisir un fichier"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploading(true);
                          try {
                            const url = await uploadImage(file);
                            setFormData({ ...formData, heroBackgroundUrl: url });
                          } catch {
                            alert("Erreur d’envoi de l’image.");
                          } finally {
                            setIsUploading(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className={labelClass}>Titre</label>
                      <input
                        type="text"
                        value={formData.heroTitle}
                        onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                        className="admin-input w-full py-3.5 px-4 text-sm"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Sous-titre</label>
                      <input
                        type="text"
                        value={formData.heroSubtitle}
                        onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                        className="admin-input w-full py-3.5 px-4 text-sm"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Texte du bouton (CTA)</label>
                      <input
                        type="text"
                        value={formData.heroCta}
                        onChange={(e) => setFormData({ ...formData, heroCta: e.target.value })}
                        placeholder="Ex. Explorer les expériences"
                        className="admin-input w-full py-3.5 px-4 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-card space-y-10 p-6 md:p-8 lg:p-10">
                <div className="border-b border-border-primary/40 pb-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                        <LayoutIcon size={22} strokeWidth={1.25} aria-hidden />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl md:text-2xl text-text-primary">Navigation &amp; pied de page</h3>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReset("branding")}
                      className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-border-primary/60 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-text-primary/45 transition-colors hover:border-brand-gold/30 hover:text-brand-gold"
                    >
                      <RotateCcw size={14} aria-hidden /> Logo + or par défaut
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className={subsectionClass}>1 · Logo menu</h4>
                  <label className={labelClass}>Texte du logo</label>
                  <input
                    type="text"
                    value={formData.logoText}
                    onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                    className="admin-input w-full py-3.5 px-4 font-serif text-lg tracking-[0.15em] md:max-w-xl md:text-xl"
                  />
                </div>

                <div className="space-y-5 border-t border-border-primary/30 pt-8">
                  <h4 className={subsectionClass}>2 · Footer (textes)</h4>
                  <p className="text-[10px] text-text-primary/35">Vides = textes i18n par défaut.</p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                    <div>
                      <label className={labelClass}>Titre du footer</label>
                      <input
                        type="text"
                        value={formData.footerTitle}
                        onChange={(e) => setFormData({ ...formData, footerTitle: e.target.value })}
                        placeholder="Ex. Rejoignez l’excellence"
                        className="admin-input w-full py-3.5 px-4 text-sm"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Texte du bouton (footer)</label>
                      <input
                        type="text"
                        value={formData.footerCta}
                        onChange={(e) => setFormData({ ...formData, footerCta: e.target.value })}
                        placeholder="Ex. Nous contacter"
                        className="admin-input w-full py-3.5 px-4 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-8 border-t border-border-primary/30 pt-8">
                  <h4 className={subsectionClass}>3 · Réseaux &amp; WhatsApp</h4>
                  <p className="text-[10px] text-text-primary/35">Plusieurs comptes par réseau. WhatsApp : chiffres sans + ; le 1er sert au bouton flottant.</p>
                  {(
                    [
                      { key: "instagram" as const, Icon: Instagram, name: "Instagram" },
                      { key: "facebook" as const, Icon: Facebook, name: "Facebook" },
                      { key: "linkedin" as const, Icon: Linkedin, name: "LinkedIn" },
                    ] as const
                  ).map(({ key, Icon, name }) => (
                    <div key={key} className="space-y-2">
                      <label className={`${labelClass} flex items-center gap-2`}>
                        <Icon size={14} className="text-text-primary/40" aria-hidden />
                        {name}
                      </label>
                      <StringListEditor
                        items={formData.socialLinks[key]}
                        onChange={(urls) =>
                          setFormData({
                            ...formData,
                            socialLinks: { ...formData.socialLinks, [key]: urls },
                          })
                        }
                        placeholder="https://…"
                        addLabel={`Ajouter ${name}`}
                        inputClassName="admin-input min-h-[2.75rem] w-full py-3 px-4 text-sm font-mono text-xs"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className={`${labelClass} flex items-center gap-2`}>
                      <MessageCircle size={14} className="text-[#25D366]" aria-hidden />
                      WhatsApp
                    </label>
                    <StringListEditor
                      items={formData.whatsappNumbers}
                      onChange={(whatsappNumbers) => setFormData({ ...formData, whatsappNumbers })}
                      placeholder="2126…"
                      addLabel="Ajouter un numéro"
                    />
                    <p className="text-[10px] text-text-primary/35">
                      wa.me :{" "}
                      {formData.whatsappNumbers
                        .map((n) => n.replace(/\D/g, ""))
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bank" && (
            <div className="admin-card p-6 md:p-8 lg:p-10 space-y-10 animate-in fade-in duration-300">
              <div className="flex items-center gap-4 pb-6 border-b border-border-primary/40">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                  <CreditCard size={22} strokeWidth={1.25} aria-hidden />
                </div>
                <h3 className="text-xl md:text-2xl font-serif">Coordonnées bancaires (RIB)</h3>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-brand-gold/25 bg-brand-gold/[0.04] p-6 md:p-8">
                <ShieldCheck
                  size={100}
                  className="pointer-events-none absolute -right-4 -top-8 text-brand-gold/[0.07]"
                  strokeWidth={0.5}
                  aria-hidden
                />
                <div className="relative z-[1]">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">Aperçu (réservations)</p>
                  <div className="space-y-4 rounded-xl border border-border-primary/50 bg-bg-primary/70 p-5 backdrop-blur-sm">
                    <div>
                      <span className="mb-1 block text-[8px] uppercase tracking-widest text-text-primary/40">Bénéficiaire</span>
                      <p className="font-serif text-lg">{formData.bankBeneficiary || "Non configuré"}</p>
                    </div>
                    <div>
                      <span className="mb-1 block text-[8px] uppercase tracking-widest text-text-primary/40">
                        RIB ({formData.bankName || "Banque"})
                      </span>
                      <p className="font-mono text-sm tracking-tight text-brand-gold">
                        {formData.bankRib || "000 000 0000000000000000 00"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Nom de la banque</label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Ex. Bank of Africa"
                    className="admin-input w-full py-3.5 px-4 text-sm"
                  />
                </div>
                <div>
                  <label className={labelClass}>Bénéficiaire officiel</label>
                  <input
                    type="text"
                    value={formData.bankBeneficiary}
                    onChange={(e) => setFormData({ ...formData, bankBeneficiary: e.target.value })}
                    className="admin-input w-full py-3.5 px-4 text-sm"
                  />
                </div>
                <div>
                  <label className={labelClass}>RIB</label>
                  <input
                    type="text"
                    value={formData.bankRib}
                    onChange={(e) => setFormData({ ...formData, bankRib: e.target.value })}
                    placeholder="000 000 0000000000000000 00"
                    className="admin-input w-full py-3.5 px-4 font-mono text-sm"
                  />
                  <p className="mt-1 text-[10px] text-text-primary/30">Réservations web — étape paiement.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="admin-card p-6 md:p-8 lg:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-primary/40">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex size-11 items-center justify-center rounded-xl ${formData.maintenanceMode ? "bg-red-500/15 text-red-400" : "bg-brand-gold/10 text-brand-gold"}`}
                    >
                      <ShieldAlert size={22} strokeWidth={1.25} aria-hidden />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif">Mode maintenance</h3>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.maintenanceMode}
                    onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
                    className={`relative h-9 w-16 shrink-0 rounded-full transition-all ${
                      formData.maintenanceMode ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)]" : "bg-text-primary/15"
                    }`}
                  >
                    <span
                      className={`absolute top-1.5 size-6 rounded-full bg-white shadow transition-all ${
                        formData.maintenanceMode ? "left-9" : "left-1.5"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-text-primary/45">Public bloqué · admin OK.</p>
              </div>

              <div className="admin-card p-6 md:p-8 lg:p-10 space-y-6">
                <div className="flex flex-col gap-4 border-b border-border-primary/40 pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                      <Navigation size={22} strokeWidth={1.25} aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl">Navigation publique</h3>
                      <p className="mt-1 text-xs text-text-primary/45">
                        Masquer des pages du menu, du menu mobile et du pied de page. Un accès direct par URL affiche une page
                        d&apos;indisponibilité (connexion et profil restent toujours accessibles).
                      </p>
                    </div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {HIDEABLE_PUBLIC_PATHS.map((item) => {
                    const hidden = (formData.hiddenPages ?? []).includes(item.path);
                    const label = language === "en" ? item.labelEn : item.labelFr;
                    return (
                      <li
                        key={item.path}
                        className="flex flex-col gap-3 rounded-lg border border-border-primary/50 bg-text-primary/[0.03] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-text-primary">{label}</p>
                          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-text-primary/35">{item.path}</p>
                        </div>
                        <div className="flex items-center gap-3 sm:shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-text-primary/40">
                            {hidden ? "Masquée" : "Visible"}
                          </span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={hidden}
                            aria-label={hidden ? `Afficher ${label}` : `Masquer ${label}`}
                            onClick={() => {
                              const cur = formData.hiddenPages ?? [];
                              setFormData({
                                ...formData,
                                hiddenPages: hidden ? cur.filter((p) => p !== item.path) : [...cur, item.path],
                              });
                            }}
                            className={`relative h-9 w-16 shrink-0 rounded-full transition-all ${
                              hidden ? "bg-red-500/90 shadow-[0_0_16px_rgba(239,68,68,0.2)]" : "bg-text-primary/15"
                            }`}
                          >
                            <span
                              className={`absolute top-1.5 size-6 rounded-full bg-white shadow transition-all ${
                                hidden ? "left-9" : "left-1.5"
                              }`}
                            />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="admin-card p-6 md:p-8 lg:p-10 space-y-8">
                <div className="flex items-center gap-4 pb-6 border-b border-border-primary/40">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                    <ShieldCheck size={22} strokeWidth={1.25} aria-hidden />
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif">Dates bloquées (calendrier)</h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="date"
                    id="blockedDate"
                    className="admin-input flex-1 py-3.5 px-4 text-sm min-h-[3rem]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById("blockedDate") as HTMLInputElement;
                      if (input.value && !formData.blockedDates.includes(input.value)) {
                        setFormData({
                          ...formData,
                          blockedDates: [...formData.blockedDates, input.value].sort(),
                        });
                        input.value = "";
                      }
                    }}
                    className="rounded-lg bg-brand-gold px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest text-brand-black transition-colors hover:bg-brand-gold/90 sm:shrink-0"
                  >
                    Bloquer
                  </button>
                </div>

                <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto overscroll-contain pr-1 lg:grid-cols-3">
                  {formData.blockedDates.map((date) => (
                    <div
                      key={date}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border-primary/50 bg-text-primary/[0.04] px-4 py-3 transition-colors hover:border-brand-gold/25"
                    >
                      <span className="font-mono text-xs font-semibold tabular-nums">{date}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            blockedDates: formData.blockedDates.filter((d) => d !== date),
                          })
                        }
                        className="rounded-lg p-2 text-text-primary/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        aria-label={`Retirer la date ${date}`}
                      >
                        <X size={16} aria-hidden />
                      </button>
                    </div>
                  ))}
                  {formData.blockedDates.length === 0 && (
                    <p className="col-span-full py-10 text-center text-xs uppercase tracking-widest text-text-primary/30">
                      Aucune date bloquée
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
