import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";
import { Send, CheckCircle2, Mail, Phone } from "lucide-react";

export function Footer() {
  const { language, subscribeNewsletter, settings } = useAppContext();
  const t = translations[language];
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      subscribeNewsletter(email);
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  // footer simplified: title/cta block removed per request
  const phones = settings.phones.map((phone) => phone.trim()).filter(Boolean);
  const emailContact = settings.contactEmail.trim() || 'contact@casaprivilege.com';
  const emailContacts = [
    ...(emailContact ? [{ label: language === 'fr' ? 'Email principal' : 'Primary email', email: emailContact }] : []),
    ...(settings.contactEmails ?? []),
  ]
    .map((entry) => ({ label: entry.label.trim() || (language === 'fr' ? 'Contact' : 'Contact'), email: entry.email.trim() }))
    .filter((entry) => entry.email);

  const seenEmails = new Set<string>();
  const uniqueEmailContacts = emailContacts.filter((entry) => {
    const key = `${entry.label.toLowerCase()}::${entry.email.toLowerCase()}`;
    if (seenEmails.has(key)) return false;
    seenEmails.add(key);
    return true;
  });

  // const socialLinks = settings.socialLinks; // removed: social icons section deleted

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#040404] px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-16 text-white sm:px-6 sm:pb-[calc(4rem+env(safe-area-inset-bottom,0px))] sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(229,169,58,0.18),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_28%)]" />
      <div className="relative mx-auto max-w-screen-2xl">
        {/* Top editorial block removed to simplify footer per request */}

        <div className="grid gap-6">
          <div className="rounded-4xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 sm:flex sm:items-start sm:justify-between">
            <div className="sm:w-1/2 sm:pr-6">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.35em] text-brand-gold">Newsletter</p>
              <p className="mb-4 text-sm text-white/70">Inscris-toi pour recevoir nos nouveautés et offres.</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder={language === 'fr' ? 'VOTRE ADRESSE EMAIL' : 'YOUR EMAIL ADDRESS'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-12 flex-1 rounded-full border border-white/10 bg-transparent px-4 text-[10px] uppercase tracking-[0.22em] text-white placeholder:text-white/20 focus:border-brand-gold focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-gold px-4 text-black transition-transform hover:-translate-y-0.5"
                  aria-label={language === 'fr' ? 'S’abonner à la newsletter' : 'Subscribe to newsletter'}
                >
                  {isSubscribed ? <CheckCircle2 size={18} className="text-green-700" /> : <Send size={18} strokeWidth={1.5} />}
                </button>
              </form>
            </div>

            <div className="sm:w-1/2 sm:pl-6 mt-6 sm:mt-0">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.35em] text-brand-gold">Contact</p>
              <h3 className="font-serif text-2xl text-white sm:text-3xl">Canaux directs</h3>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.32em] text-white/35">Téléphones</p>
                  <div className="space-y-2">
                    {phones.length > 0 ? (
                      phones.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 transition-colors hover:border-brand-gold/35 hover:text-brand-gold"
                        >
                          <span>{phone}</span>
                          <Phone size={14} />
                        </a>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/35">+212 5XX XX XX XX</div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[9px] font-black uppercase tracking-[0.32em] text-white/35">Emails</p>
                  <div className="space-y-2">
                    {uniqueEmailContacts.map((entry) => (
                      <div key={`${entry.label}-${entry.email}`} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="mb-1 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.28em] text-brand-gold/85">
                          <Mail size={12} />
                          {entry.label}
                        </div>
                        <a href={`mailto:${entry.email}`} className="break-all text-sm text-white/80 transition-colors hover:text-brand-gold">{entry.email}</a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[8px] font-black uppercase tracking-[0.35em] text-white/25 text-center sm:text-left">
            © {new Date().getFullYear()} {settings.siteName || "Casa Privilege"} • {t.footer.rights}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[8px] font-black uppercase tracking-[0.3em] text-white/25 sm:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.35)]" />
              Réseau actif
            </span>
            <span>{settings.address}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
