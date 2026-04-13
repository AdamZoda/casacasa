import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { Product } from './AppContext';

export interface ShoppingContextType {
  cart: Product[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const addToCart = useCallback((p: Product) => setCart((prev) => [...prev, p]), []);
  const removeFromCart = useCallback((id: string) => setCart((prev) => prev.filter((x) => x.id !== id)), []);
  const toggleFavorite = useCallback(
    (id: string) =>
      setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])),
    [],
  );

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, favorites, toggleFavorite }),
    [cart, favorites, addToCart, removeFromCart, toggleFavorite],
  );

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
}

export function useShopping() {
  const ctx = useContext(ShoppingContext);
  if (ctx === undefined) throw new Error('useShopping must be used within a ShoppingProvider');
  return ctx;
}
