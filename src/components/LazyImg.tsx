import type { ImgHTMLAttributes } from 'react';

type LazyImgProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Image above the fold / LCP : pas de lazy-load */
  priority?: boolean;
};

/**
 * Image avec chargement différé par défaut (meilleure perf réseau).
 * Utiliser `priority` uniquement pour le hero / LCP.
 */
export function LazyImg({ priority, loading, decoding, ...rest }: LazyImgProps) {
  return (
    <img
      {...rest}
      loading={priority ? 'eager' : loading ?? 'lazy'}
      decoding={decoding ?? 'async'}
    />
  );
}
