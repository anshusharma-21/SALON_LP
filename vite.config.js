import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import leadHandler from './api/lead.js';

// Dev-only: serve the Vercel function locally so the form works with `npm run dev`.
const devApi = () => ({
  name: 'dev-api',
  configureServer(server) {
    server.middlewares.use('/uksalons/api/lead', (req, res) => {
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', async () => {
        try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
        await leadHandler(req, res);
      });
    });
  },
});

export default defineConfig({
  // Served at automationlabs.online/uksalons (Cloudflare Worker -> this Vercel project).
  // vercel.json maps /uksalons/* back to the root, so the plain vercel.app URL keeps working too.
  base: '/uksalons/',
  plugins: [react(), devApi()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('three') || id.includes('@react-three')) return 'three';
          if (id.includes('gsap') || id.includes('lenis')) return 'motion';
        },
      },
    },
  },
});
