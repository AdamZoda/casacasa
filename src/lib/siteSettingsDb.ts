export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    linkedin: string;
  };
  maintenanceMode: boolean;
  heroBackgroundUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  brandGoldColor: string;
  whatsappNumber: string;
  logoText: string;
  footerTitle: string;
  footerCta: string;
  blockedDates: string[];
  bankName: string;
  bankBeneficiary: string;
  bankRib: string;
  hiddenPages: string[];
}

/** Ligne `site_settings` telle que PostgREST / Postgres (snake_case). */
export type SiteSettingsRow = {
  id: number;
  site_name?: string | null;
  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
  social_links?: { instagram?: string; facebook?: string; linkedin?: string } | null;
  maintenance_mode?: boolean | null;
  hero_background_url?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_cta?: string | null;
  brand_gold_color?: string | null;
  whatsapp_number?: string | null;
  logo_text?: string | null;
  footer_title?: string | null;
  footer_cta?: string | null;
  blocked_dates?: string[] | null;
  bank_name?: string | null;
  bank_beneficiary?: string | null;
  bank_rib?: string | null;
  hidden_pages?: string[] | null;
};

export function siteSettingsToDbRow(s: SiteSettings): SiteSettingsRow {
  return {
    id: 1,
    site_name: s.siteName,
    contact_email: s.contactEmail,
    phone: s.phone,
    address: s.address,
    social_links: { ...s.socialLinks },
    maintenance_mode: s.maintenanceMode,
    hero_background_url: s.heroBackgroundUrl,
    hero_title: s.heroTitle,
    hero_subtitle: s.heroSubtitle,
    hero_cta: s.heroCta,
    brand_gold_color: s.brandGoldColor,
    whatsapp_number: s.whatsappNumber,
    logo_text: s.logoText,
    footer_title: s.footerTitle,
    footer_cta: s.footerCta,
    blocked_dates: s.blockedDates,
    bank_name: s.bankName,
    bank_beneficiary: s.bankBeneficiary,
    bank_rib: s.bankRib,
    hidden_pages: s.hiddenPages,
  };
}

export function dbRowToSiteSettings(row: SiteSettingsRow, prev: SiteSettings): SiteSettings {
  const sl = row.social_links;
  const socialLinks =
    sl && typeof sl === 'object' && !Array.isArray(sl)
      ? {
          instagram: String(sl.instagram ?? prev.socialLinks.instagram),
          facebook: String(sl.facebook ?? prev.socialLinks.facebook),
          linkedin: String(sl.linkedin ?? prev.socialLinks.linkedin),
        }
      : prev.socialLinks;

  const arr = (v: unknown, fallback: string[]) =>
    Array.isArray(v) ? v.map((x) => String(x)) : fallback;

  return {
    siteName: String(row.site_name ?? prev.siteName),
    contactEmail: String(row.contact_email ?? prev.contactEmail),
    phone: String(row.phone ?? prev.phone),
    address: String(row.address ?? prev.address),
    socialLinks,
    maintenanceMode: Boolean(row.maintenance_mode ?? prev.maintenanceMode),
    heroBackgroundUrl: String(row.hero_background_url ?? prev.heroBackgroundUrl),
    heroTitle: String(row.hero_title ?? prev.heroTitle),
    heroSubtitle: String(row.hero_subtitle ?? prev.heroSubtitle),
    heroCta: String(row.hero_cta ?? prev.heroCta),
    brandGoldColor: String(row.brand_gold_color ?? prev.brandGoldColor),
    whatsappNumber: String(row.whatsapp_number ?? prev.whatsappNumber),
    logoText: String(row.logo_text ?? prev.logoText),
    footerTitle: String(row.footer_title ?? prev.footerTitle),
    footerCta: String(row.footer_cta ?? prev.footerCta),
    blockedDates: arr(row.blocked_dates, prev.blockedDates),
    bankName: String(row.bank_name ?? prev.bankName),
    bankBeneficiary: String(row.bank_beneficiary ?? prev.bankBeneficiary),
    bankRib: String(row.bank_rib ?? prev.bankRib),
    hiddenPages: arr(row.hidden_pages, prev.hiddenPages),
  };
}
