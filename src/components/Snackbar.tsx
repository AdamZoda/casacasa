import React, { useEffect, useState } from 'react';

type Item = { id: number; message: string; type: 'info' | 'success' | 'error' };

export function Snackbar() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let nextId = 1;
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      const { message, type } = ce.detail as { message: string; type: Item['type'] };
      const id = nextId++;
      setItems((s) => [...s, { id, message, type }]);
      // auto-dismiss
      setTimeout(() => {
        setItems((s) => s.filter((it) => it.id !== id));
      }, 4500);
    };
    window.addEventListener('app:notify', handler as EventListener);
    return () => window.removeEventListener('app:notify', handler as EventListener);
  }, []);

  if (items.length === 0) return null;

  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-60 flex flex-col gap-3">
      {items.map((it) => (
        <div key={it.id} className={`max-w-sm w-full rounded-md px-4 py-3 shadow-lg text-sm text-white ${it.type === 'error' ? 'bg-red-500' : it.type === 'success' ? 'bg-green-500' : 'bg-black/80'}`}>
          {it.message}
        </div>
      ))}
    </div>
  );
}

