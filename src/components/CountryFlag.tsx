import React from "react";

interface CountryFlagProps {
  id?: string;
  flag?: string;
  className?: string;
}

// Convert a flag emoji (e.g. 🇲🇦) into its 2-letter ISO code (e.g. "ma")
function flagEmojiToCountryCode(emoji: string): string {
  if (!emoji) return "";
  const codePoints = Array.from(emoji).map((char) => char.codePointAt(0));
  const chars = codePoints
    .filter((cp) => cp !== undefined && cp >= 0x1f1e6 && cp <= 0x1f1ff)
    .map((cp) => String.fromCharCode(cp! - 0x1f1e6 + 65));
  return chars.join("").toLowerCase();
}

const lookup: Record<string, string> = {
  moroccan: "ma",
  french: "fr",
  swiss: "ch",
  senegalese: "sn",
  maroc: "ma",
  france: "fr",
  espagne: "es",
  "royaume-uni": "gb",
  "états-unis": "us",
  "émirats arabes unis": "ae",
  qatar: "qa",
  "arabie saoudite": "sa",
  suisse: "ch",
  belgique: "be",
  italie: "it",
  portugal: "pt",
  canada: "ca",
  allemagne: "de",
};

export function CountryFlag({ id, flag, className = "" }: CountryFlagProps) {
  // Determine ISO country code (lowercase)
  let code = "";
  if (id) {
    code = lookup[id.toLowerCase()] || "";
  }
  if (!code && flag) {
    // Try to get code from name lookup first
    const cleanFlag = flag.trim().toLowerCase();
    code = lookup[cleanFlag] || flagEmojiToCountryCode(flag) || "";
  }

  // Fallback to emoji text if we can't find a code
  if (!code) {
    return <span className={className}>{flag}</span>;
  }

  // 1. High-Quality Inline SVG for Morocco (MA)
  if (code === "ma") {
    return (
      <svg
        viewBox="0 0 900 600"
        className={`inline-block aspect-[3/2] overflow-hidden rounded shadow-sm border border-white/10 ${className}`}
        aria-label="Moroccan Flag"
      >
        <rect width="900" height="600" fill="#c1272d" />
        <path
          d="M450,150 L538,421 L308,254 L592,254 L362,421 Z"
          fill="none"
          stroke="#006233"
          strokeWidth="20"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 2. High-Quality Inline SVG for France (FR)
  if (code === "fr") {
    return (
      <svg
        viewBox="0 0 3 2"
        className={`inline-block aspect-[3/2] overflow-hidden rounded shadow-sm border border-white/10 ${className}`}
        aria-label="French Flag"
      >
        <rect width="1" height="2" fill="#051440" />
        <rect x="1" width="1" height="2" fill="#ffffff" />
        <rect x="2" width="1" height="2" fill="#ec1920" />
      </svg>
    );
  }

  // 3. High-Quality Inline SVG for Switzerland (CH)
  if (code === "ch") {
    return (
      <svg
        viewBox="0 0 32 32"
        className={`inline-block aspect-square overflow-hidden rounded shadow-sm border border-white/10 ${className}`}
        aria-label="Swiss Flag"
      >
        <rect width="32" height="32" fill="#d80a10" />
        <rect x="6" y="13" width="20" height="6" fill="#ffffff" />
        <rect x="13" y="6" width="6" height="20" fill="#ffffff" />
      </svg>
    );
  }

  // 4. High-Quality Inline SVG for Senegal (SN)
  if (code === "sn") {
    return (
      <svg
        viewBox="0 0 900 600"
        className={`inline-block aspect-[3/2] overflow-hidden rounded shadow-sm border border-white/10 ${className}`}
        aria-label="Senegalese Flag"
      >
        <rect width="300" height="600" fill="#00853f" />
        <rect x="300" width="300" height="600" fill="#fdef42" />
        <rect x="600" width="300" height="600" fill="#e31b23" />
        <path
          d="M450,220 L465,270 L515,270 L475,300 L490,350 L450,320 L410,350 L425,300 L385,270 L435,270 Z"
          fill="#00853f"
        />
      </svg>
    );
  }

  // Fallback to highly optimized online SVG flags from CDN for all other countries
  return (
    <img
      src={`https://flagcdn.com/${code}.svg`}
      alt={flag || `${code.toUpperCase()} flag`}
      className={`inline-block aspect-[3/2] object-cover rounded shadow-sm border border-white/10 ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to unicode emoji if image loading fails
        const target = e.currentTarget;
        if (target.parentElement && flag) {
          const span = document.createElement("span");
          span.className = className;
          span.textContent = flag;
          target.replaceWith(span);
        }
      }}
    />
  );
}
