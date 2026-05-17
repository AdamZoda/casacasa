// Lightweight notification helper using CustomEvent so we don't need to wire up context everywhere.
export type NotifyType = 'info' | 'success' | 'error';

export function notify(message: string, type: NotifyType = 'info') {
  try {
    const ev = new CustomEvent('app:notify', { detail: { message, type } });
    window.dispatchEvent(ev);
  } catch (e) {
    // Fallback to console to avoid breaking environments without window
    // Keep behaviour non-blocking (no alert)
    // eslint-disable-next-line no-console
    console.warn('[notify] ', message, type);
  }
}

