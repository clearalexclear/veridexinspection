declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
    };
  }
}

const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV;

export const ttqPage = () => {
  if (typeof window !== 'undefined' && window.ttq) {
    try { window.ttq.page(); } catch { /* noop */ }
  }
};

export const ttqTrack = (event: string, params?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  if (isDev) {
    try { console.log('TikTok event fired:', event, params); } catch { /* noop */ }
  }
  if (window.ttq && typeof window.ttq.track === 'function') {
    try { window.ttq.track(event, params || {}); } catch { /* noop */ }
  }
};

const firedOnce = new Set<string>();
export const ttqTrackOnce = (key: string, event: string, params?: Record<string, unknown>) => {
  if (firedOnce.has(key)) return;
  firedOnce.add(key);
  ttqTrack(event, params);
};
