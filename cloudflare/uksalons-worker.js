// Cloudflare Worker: serves the UK salon landing page at automationlabs.online/uksalons.
// Only /uksalons and /uksalons/... are touched. Every other URL goes to the main site untouched.
// Routes to attach: automationlabs.online/uksalons*  and  www.automationlabs.online/uksalons*

const ORIGIN = 'https://salon-lp-phi.vercel.app';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const isOurs = url.pathname === '/uksalons' || url.pathname.startsWith('/uksalons/');
    // Safety net: anything else (e.g. /uksalons-old) passes straight through to the main site.
    if (!isOurs) return fetch(request);

    const target = new URL(url.pathname + url.search, ORIGIN);
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.set('x-forwarded-host', url.host);

    const init = { method: request.method, headers, redirect: 'manual' };
    if (request.method !== 'GET' && request.method !== 'HEAD') init.body = request.body;

    try {
      return await fetch(target, init);
    } catch {
      return new Response('This page is temporarily unavailable. Please try again shortly.', {
        status: 503, headers: { 'content-type': 'text/plain; charset=utf-8', 'retry-after': '60' },
      });
    }
  },
};
