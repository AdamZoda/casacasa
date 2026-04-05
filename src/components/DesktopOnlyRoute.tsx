import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useIsPhoneViewport } from "../hooks/useIsPhoneViewport";
import { useAppContext } from "../context/AppContext";
import { translations } from "../i18n/translations";

export function DesktopOnlyRoute({ children }: { children: ReactNode }) {
  const isPhone = useIsPhoneViewport();
  const { language } = useAppContext();
  const t = translations[language];

  if (isPhone) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-5 pb-12 pt-28 text-center sm:pt-32">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold/80">{t.mobile.desktopOnlyKicker}</p>
        <h1 className="mb-4 max-w-xs font-serif text-2xl leading-tight tracking-tight text-text-primary sm:max-w-md sm:text-3xl">
          {t.mobile.desktopOnlyTitle}
        </h1>
        <p className="mb-10 max-w-md text-sm leading-relaxed text-text-primary/55">{t.mobile.desktopOnlyBody}</p>
        <Link
          to="/"
          className="rounded-sm border border-border-primary bg-bg-primary px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.28em] text-text-primary transition-colors hover:border-brand-gold hover:text-brand-gold min-h-11 inline-flex items-center justify-center touch-manipulation"
        >
          {t.errors.backHome}
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
