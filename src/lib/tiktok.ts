declare global {
  interface Window {
    ttq?: {
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
    };
  }
}

export const ttqPage = () => {
  if (typeof window !== 'undefined' && window.ttq) {
    try { window.ttq.page(); } catch (e) { /* noop */ }
  }
};

export const ttqTrack = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.ttq) {
    try { window.ttq.track(event, params); } catch (e) { /* noop */ }
  }
};
