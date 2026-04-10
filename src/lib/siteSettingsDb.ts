export type SiteFontStyle = "original" | "playfair" | "kiona" | "riona";
export type AboutVisibility = {
  showStory: boolean;
  showMission: boolean;
  showContactCard: boolean;
  showSocials: boolean;
  showInstagram: boolean;
  showFacebook: boolean;
  showLinkedin: boolean;
  showYoutube: boolean;
};

export type AboutSettings = {
  title: string;
  subtitle: string;
  story: string;
  mission: string;
  imageUrl: string;
  visibility: AboutVisibility;
};

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  /** Numéros affichés (téléphone / tel:) — plusieurs possibles */
  phones: string[];
  address: string;
  socialLinks: {
    instagram: string[];
    facebook: string[];
    linkedin: string[];
    youtube: string[];
  };
  maintenanceMode: boolean;
  heroBackgroundUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  brandGoldColor: string;
  /** Chiffres pour wa.me — plusieurs lignes WhatsApp possibles */
  whatsappNumbers: string[];
  logoText: string;
  footerTitle: string;
  footerCta: string;
  blockedDates: string[];
  blockWeekends: boolean;
  bankName: string;
  bankBeneficiary: string;
  bankRib: string;
  hiddenPages: string[];
  fontStyle: SiteFontStyle;
  about: AboutSettings;
}

/** Ligne `site_settings` telle que PostgREST / Postgres (snake_case). */
export type SiteSettingsRow = {
  id: number;
  site_name?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  phones?: unknown;
  address?: string | null;
  social_links?: unknown;
  maintenance_mode?: boolean | null;
  hero_background_url?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_cta?: string | null;
  brand_gold_color?: string | null;
  whatsapp_number?: string | null;
  whatsapp_numbers?: unknown;
  logo_text?: string | null;
  footer_title?: string | null;
  footer_cta?: string | null;
  blocked_dates?: string[] | null;
  block_weekends?: boolean | null;
  bank_name?: string | null;
  bank_beneficiary?: string | null;
  bank_rib?: string | null;
  hidden_pages?: string[] | null;
  font_style?: string | null;
};

function parseJsonStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

function normalizeSocialFromRow(raw: unknown, prev: SiteSettings["socialLinks"]): SiteSettings["socialLinks"] {
  const keys = ["instagram", "facebook", "linkedin", "youtube"] as const;
  const empty = (): SiteSettings["socialLinks"] => ({ instagram: [], facebook: [], linkedin: [], youtube: [] });

  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    const hasPrev = keys.some((k) => prev[k].some(Boolean));
    return hasPrev ? prev : empty();
  }

  const o = raw as Record<string, unknown>;
  const urls = (key: (typeof keys)[number]): string[] => {
    const v = o[key];
    const arr = parseJsonStringArray(v);
    if (arr.length) return arr;
    if (typeof v === "string" && v.trim()) return [v.trim()];
    return prev[key].filter(Boolean);
  };

  return { instagram: urls("instagram"), facebook: urls("facebook"), linkedin: urls("linkedin"), youtube: urls("youtube") };
}

function normalizeAboutFromRow(raw: unknown, prev: SiteSettings["about"]): SiteSettings["about"] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return prev;
  const o = raw as Record<string, unknown>;
  const aboutRaw = o.about;
  if (!aboutRaw || typeof aboutRaw !== "object" || Array.isArray(aboutRaw)) return prev;
  const a = aboutRaw as Record<string, unknown>;
  const visRaw = a.visibility;
  const visObj = visRaw && typeof visRaw === "object" && !Array.isArray(visRaw) ? (visRaw as Record<string, unknown>) : {};
  return {
    title: typeof a.title === "string" ? a.title : prev.title,
    subtitle: typeof a.subtitle === "string" ? a.subtitle : prev.subtitle,
    story: typeof a.story === "string" ? a.story : prev.story,
    mission: typeof a.mission === "string" ? a.mission : prev.mission,
    imageUrl: typeof a.imageUrl === "string" ? a.imageUrl : prev.imageUrl,
    visibility: {
      showStory: typeof visObj.showStory === "boolean" ? visObj.showStory : prev.visibility.showStory,
      showMission: typeof visObj.showMission === "boolean" ? visObj.showMission : prev.visibility.showMission,
      showContactCard: typeof visObj.showContactCard === "boolean" ? visObj.showContactCard : prev.visibility.showContactCard,
      showSocials: typeof visObj.showSocials === "boolean" ? visObj.showSocials : prev.visibility.showSocials,
      showInstagram: typeof visObj.showInstagram === "boolean" ? visObj.showInstagram : prev.visibility.showInstagram,
      showFacebook: typeof visObj.showFacebook === "boolean" ? visObj.showFacebook : prev.visibility.showFacebook,
      showLinkedin: typeof visObj.showLinkedin === "boolean" ? visObj.showLinkedin : prev.visibility.showLinkedin,
      showYoutube: typeof visObj.showYoutube === "boolean" ? visObj.showYoutube : prev.visibility.showYoutube,
    },
  };
}

function phonesFromRow(row: SiteSettingsRow, prev: SiteSettings): string[] {
  const fromNew = parseJsonStringArray(row.phones);
  if (fromNew.length) return fromNew;
  const legacy = row.phone != null ? String(row.phone).trim() : "";
  if (legacy) return [legacy];
  return prev.phones.filter(Boolean);
}

function whatsappFromRow(row: SiteSettingsRow, prev: SiteSettings): string[] {
  const fromNew = parseJsonStringArray(row.whatsapp_numbers);
  if (fromNew.length) return fromNew.map((s) => s.replace(/\D/g, "")).filter(Boolean);
  const legacy = row.whatsapp_number != null ? String(row.whatsapp_number).replace(/\D/g, "") : "";
  if (legacy) return [legacy];
  return prev.whatsappNumbers.map((s) => s.replace(/\D/g, "")).filter(Boolean);
}

/** Premier numéro WhatsApp (chiffres) pour boutons flottants / paiement. */
export function primaryWhatsappDigits(settings: SiteSettings): string {
  return settings.whatsappNumbers.map((n) => n.replace(/\D/g, "")).filter(Boolean)[0] || "";
}

export function siteSettingsToDbRow(s: SiteSettings): SiteSettingsRow {
  const cleanPhones = s.phones.map((p) => p.trim()).filter(Boolean);
  const cleanWa = s.whatsappNumbers.map((n) => n.replace(/\D/g, "")).filter(Boolean);
  const social = {
    instagram: s.socialLinks.instagram.map((u) => u.trim()).filter(Boolean),
    facebook: s.socialLinks.facebook.map((u) => u.trim()).filter(Boolean),
    linkedin: s.socialLinks.linkedin.map((u) => u.trim()).filter(Boolean),
    youtube: s.socialLinks.youtube.map((u) => u.trim()).filter(Boolean),
    about: s.about,
  };

  return {
    id: 1,
    site_name: s.siteName,
    contact_email: s.contactEmail,
    phone: cleanPhones[0] ?? "",
    phones: cleanPhones,
    address: s.address,
    social_links: social,
    maintenance_mode: s.maintenanceMode,
    hero_background_url: s.heroBackgroundUrl,
    hero_title: s.heroTitle,
    hero_subtitle: s.heroSubtitle,
    hero_cta: s.heroCta,
    brand_gold_color: s.brandGoldColor,
    whatsapp_number: cleanWa[0] ?? "",
    whatsapp_numbers: cleanWa,
    logo_text: s.logoText,
    footer_title: s.footerTitle,
    footer_cta: s.footerCta,
    blocked_dates: s.blockedDates,
    block_weekends: s.blockWeekends,
    bank_name: s.bankName,
    bank_beneficiary: s.bankBeneficiary,
    bank_rib: s.bankRib,
    hidden_pages: s.hiddenPages,
    font_style: s.fontStyle ?? "original",
  };
}

export function dbRowToSiteSettings(row: SiteSettingsRow, prev: SiteSettings): SiteSettings {
  const arr = (v: unknown, fallback: string[]) => (Array.isArray(v) ? v.map((x) => String(x)) : fallback);

  const fontStyle = (v: unknown): SiteFontStyle => {
    if (v === "playfair") return "playfair";
    if (v === "kiona") return "kiona";
    if (v === "riona") return "riona";
    return "original";
  };

  return {
    siteName: String(row.site_name ?? prev.siteName),
    contactEmail: String(row.contact_email ?? prev.contactEmail),
    phones: phonesFromRow(row, prev),
    address: String(row.address ?? prev.address),
    socialLinks: normalizeSocialFromRow(row.social_links, prev.socialLinks),
    about: normalizeAboutFromRow(row.social_links, prev.about),
    maintenanceMode: Boolean(row.maintenance_mode ?? prev.maintenanceMode),
    heroBackgroundUrl: String(row.hero_background_url ?? prev.heroBackgroundUrl),
    heroTitle: String(row.hero_title ?? prev.heroTitle),
    heroSubtitle: String(row.hero_subtitle ?? prev.heroSubtitle),
    heroCta: String(row.hero_cta ?? prev.heroCta),
    brandGoldColor: String(row.brand_gold_color ?? prev.brandGoldColor),
    whatsappNumbers: whatsappFromRow(row, prev),
    logoText: String(row.logo_text ?? prev.logoText),
    footerTitle: String(row.footer_title ?? prev.footerTitle),
    footerCta: String(row.footer_cta ?? prev.footerCta),
    blockedDates: arr(row.blocked_dates, prev.blockedDates),
    blockWeekends: Boolean(row.block_weekends ?? prev.blockWeekends),
    bankName: String(row.bank_name ?? prev.bankName),
    bankBeneficiary: String(row.bank_beneficiary ?? prev.bankBeneficiary),
    bankRib: String(row.bank_rib ?? prev.bankRib),
    hiddenPages: arr(row.hidden_pages, prev.hiddenPages),
    fontStyle: fontStyle(row.font_style ?? prev.fontStyle),
  };
}
