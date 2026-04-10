function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/$/, "") || "/";
}

function normalizeHiddenEntry(h: string): string {
  let t = h.trim();
  if (!t) return "";
  if (!t.startsWith("/")) t = `/${t}`;
  if (t === "/") return "/";
  return t.replace(/\/$/, "") || "/";
}

/** True if this pathname should be treated as disabled (hidden from nav + direct URL blocked). */
export function isPathHidden(pathname: string, hiddenPages: string[]): boolean {
  const norm = normalizePath(pathname);
  const set = hiddenPages.map(normalizeHiddenEntry).filter(Boolean);
  for (const h of set) {
    if (h === "/") {
      if (norm === "/") return true;
      continue;
    }
    if (norm === h) return true;
    if (norm.startsWith(`${h}/`)) return true;
  }
  return false;
}

export type HideablePublicPath = {
  path: string;
  labelFr: string;
  labelEn: string;
};

export type LayoutNavLabelKey = "home" | "universes" | "collection" | "services" | "journal" | "contact" | "about";

/** Liens texte de la barre de navigation (desktop + menu mobile) — même logique que `isPathHidden`. */
export const LAYOUT_NAV_LINKS: { path: string; to: string; labelKey: LayoutNavLabelKey }[] = [
  { path: "/", to: "/", labelKey: "home" },
  { path: "/brands", to: "/brands", labelKey: "universes" },
  { path: "/store", to: "/store", labelKey: "collection" },
  { path: "/services", to: "/services", labelKey: "services" },
  { path: "/journal", to: "/journal", labelKey: "journal" },
  { path: "/contact", to: "/contact", labelKey: "contact" },
  { path: "/about", to: "/about", labelKey: "about" },
];

/** Canonical paths stored in `SiteSettings.hiddenPages` when a section is disabled. */
export const HIDEABLE_PUBLIC_PATHS: HideablePublicPath[] = [
  { path: "/", labelFr: "Accueil", labelEn: "Home" },
  { path: "/brands", labelFr: "Univers (liste)", labelEn: "Universes (list)" },
  { path: "/universe", labelFr: "Fiches univers", labelEn: "Universe detail pages" },
  { path: "/store", labelFr: "Boutique", labelEn: "Store" },
  { path: "/services", labelFr: "Services", labelEn: "Services" },
  { path: "/journal", labelFr: "Journal", labelEn: "Journal" },
  { path: "/contact", labelFr: "Contact", labelEn: "Contact" },
  { path: "/about", labelFr: "About Us", labelEn: "About Us" },
  { path: "/cart", labelFr: "Panier", labelEn: "Cart" },
  { path: "/book", labelFr: "Réservation", labelEn: "Booking" },
];
