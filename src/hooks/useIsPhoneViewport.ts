import { useState, useEffect } from "react";

/** Largeur max (px) considérée comme « téléphone » : garde routes profil/admin + menu adapté. Aligné sur Tailwind `md` (768px). */
export const PHONE_VIEWPORT_MAX_PX = 767;

function getInitialMatches(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(max-width: ${PHONE_VIEWPORT_MAX_PX}px)`).matches;
}

export function useIsPhoneViewport(): boolean {
  const [isPhone, setIsPhone] = useState(getInitialMatches);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${PHONE_VIEWPORT_MAX_PX}px)`);
    const onChange = () => setIsPhone(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isPhone;
}
