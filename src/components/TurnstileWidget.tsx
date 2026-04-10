import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, params: TurnstileRenderParams) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

interface TurnstileRenderParams {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

type Props = {
  onToken: (token: string | null) => void;
  /** Increment to force a new challenge after failed verification or mode switch */
  resetKey?: number;
  className?: string;
};

export function TurnstileWidget({ onToken, resetKey = 0, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [loadTimeoutReached, setLoadTimeoutReached] = useState(false);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const el = containerRef.current;
    let cancelled = false;
    let timeoutId: number | null = null;

    const clearTimeoutId = () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const mount = () => {
      if (cancelled || !window.turnstile || !el) return;
      clearTimeoutId();
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: siteKey,
        theme: "auto",
        callback: (t) => onTokenRef.current(t),
        "error-callback": () => onTokenRef.current(null),
        "expired-callback": () => onTokenRef.current(null),
      });
      setIsLoaded(true);
      setLoadFailed(false);
      setLoadTimeoutReached(false);
    };

    const ensureScript = (): Promise<void> => {
      const existingScript = document.querySelector(`script[src="${SCRIPT_SRC}"]`) as HTMLScriptElement | null;
      if (existingScript) {
        return existingScript.hasAttribute('data-loaded') ? Promise.resolve() : new Promise((resolve, reject) => {
          existingScript.addEventListener('load', () => resolve(), { once: true });
          existingScript.addEventListener('error', () => reject(new Error('turnstile_script')), { once: true });
        });
      }
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = SCRIPT_SRC;
        s.async = true;
        s.crossOrigin = "anonymous";
        s.onload = () => {
          s.setAttribute('data-loaded', 'true');
          resolve();
        };
        s.onerror = () => reject(new Error("turnstile_script"));
        document.head.appendChild(s);
      });
    };

    void (async () => {
      try {
        await ensureScript();
      } catch {
        onTokenRef.current(null);
        setLoadFailed(true);
        return;
      }
      if (cancelled) return;
      timeoutId = window.setTimeout(() => {
        if (!cancelled && !window.turnstile) {
          setLoadFailed(true);
          setLoadTimeoutReached(true);
          onTokenRef.current(null);
        }
      }, 10000);

      const poll = () => {
        if (cancelled) return;
        if (window.turnstile) {
          mount();
        } else {
          requestAnimationFrame(poll);
        }
      };
      poll();
    })();

    return () => {
      cancelled = true;
      clearTimeoutId();
      setIsLoaded(false);
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
      widgetIdRef.current = null;
      onTokenRef.current(null);
    };
  }, [siteKey, resetKey]);

  if (!siteKey) {
    return (
      <div className={`${className ?? ""}`}>
        <div className="min-h-[74px] w-full rounded-lg border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-left">
          <p className="text-xs font-semibold text-amber-600">Cloudflare Turnstile non configuré</p>
          <p className="mt-1 text-[11px] text-amber-700/90">Ajoute `VITE_TURNSTILE_SITE_KEY` dans `.env`, puis redémarre `npm run dev`.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className ?? ""} w-full`}>
      {!isLoaded && (
        <div className={`mb-2 min-h-[74px] w-full rounded-lg border px-4 py-3 text-left ${
          loadFailed ? "border-red-500/40 bg-red-500/5" : "border-border-primary/50 bg-text-primary/[0.03]"
        }`}>
          <p className={`text-xs font-semibold ${loadFailed ? "text-red-500" : "text-text-primary/60"}`}>
            {loadFailed ? "Impossible de charger le CAPTCHA" : "Chargement du CAPTCHA Cloudflare..."}
          </p>
          <p className={`mt-1 text-[11px] ${loadFailed ? "text-red-500/90" : "text-text-primary/45"}`}>
            {loadFailed
              ? loadTimeoutReached
                ? "Le widget Cloudflare ne s’ouvre pas : vérifie la configuration du domaine et désactive les protections Cloudflare/iframe."
                : "Vérifie le domaine autorisé (localhost), tes bloqueurs de pub, puis recharge la page."
              : "Si ce message reste bloqué, recharge la page ou désactive le bloqueur de scripts."}
          </p>
        </div>
      )}
      <div ref={containerRef} className="min-h-[65px]" />
    </div>
  );
}
