import { useEffect, useRef } from "react";

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

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const el = containerRef.current;
    let cancelled = false;

    const mount = () => {
      if (cancelled || !window.turnstile || !el) return;
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: siteKey,
        theme: "auto",
        callback: (t) => onTokenRef.current(t),
        "error-callback": () => onTokenRef.current(null),
        "expired-callback": () => onTokenRef.current(null),
      });
    };

    const ensureScript = (): Promise<void> => {
      if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = SCRIPT_SRC;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("turnstile_script"));
        document.head.appendChild(s);
      });
    };

    void (async () => {
      try {
        await ensureScript();
      } catch {
        onTokenRef.current(null);
        return;
      }
      if (cancelled) return;
      const poll = () => {
        if (cancelled) return;
        if (window.turnstile) mount();
        else requestAnimationFrame(poll);
      };
      poll();
    })();

    return () => {
      cancelled = true;
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
      <p className={`text-xs text-amber-600/90 ${className ?? ""}`}>
        Turnstile: set VITE_TURNSTILE_SITE_KEY in your environment.
      </p>
    );
  }

  return <div ref={containerRef} className={className} />;
}
