// PRD §11 analytics. Pushes to dataLayer only after analytics consent. Never send PII.
const KEY = 'uks-consent';

export const getConsent = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
export const setConsent = (v) => {
  try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ }
  window.dispatchEvent(new CustomEvent('uks-consent', { detail: v }));
};

export function utm() {
  const q = new URLSearchParams(window.location.search);
  return Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    .map((k) => [k, q.get(k) || '']));
}

export function track(event, params = {}) {
  if (getConsent() !== 'granted') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

export const device = () => (window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1100 ? 'tablet' : 'desktop');
