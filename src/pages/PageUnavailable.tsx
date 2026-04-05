import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

export function PageUnavailable() {
  const { language } = useAppContext();
  const t = translations[language].errors;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.45em] text-brand-gold/80">{t.pageUnavailableKicker}</p>
      <h1 className="mb-4 max-w-md font-serif text-3xl tracking-tight text-text-primary md:text-4xl">{t.pageUnavailableTitle}</h1>
      <p className="mb-10 max-w-md text-sm leading-relaxed text-text-primary/55">{t.pageUnavailableBody}</p>
      <Link
        to="/"
        className="rounded-sm border border-border-primary bg-bg-primary px-10 py-3.5 text-[10px] font-bold uppercase tracking-[0.3em] text-text-primary transition-colors hover:border-brand-gold hover:text-brand-gold"
      >
        {t.backHome}
      </Link>
    </div>
  );
}
