# UK Salons — campaign landing page

Premium landing page for **automationlabs.online/uksalons** (AI Automation Labs). All copy comes from the PRD (v1.0).
The visual direction is our own: editorial luxury, with real-time 3D and scroll-driven motion.

## Stack

| Layer | Tech |
|---|---|
| UI | React 19 + Vite |
| 3D | three.js via React Three Fiber + Drei; shears modelled in **Blender** (`scripts/blender_scissors.py`) and exported to `public/models/shears.glb` |
| Motion | GSAP + ScrollTrigger (`@gsap/react`), Lenis smooth scroll |
| Form | React Hook Form + Zod (client), Vercel serverless function `api/lead.js` (server) |
| Fonts | Bodoni Moda, Cormorant Garamond, Manrope (self-hosted via Fontsource) |

## Run

```bash
npm install
npm run dev        # http://localhost:5173 — /api/lead is served locally by a Vite middleware
npm run build      # static output in dist/
```

## Where things live

- **All copy:** `src/content.js` (contact email, booking URL, nav, FAQs, form options). Change text there, not in components.
- **Sections:** `src/components/*` (HeroStage = hero + "The Experience" pinned 3D scene).
- **3D:** `src/three/ShearsCanvas.jsx`. Scroll timelines write into `src/three/shearsState.js` and the scene reads it every frame.
- **Re-model the shears:** `blender --background --python scripts/blender_scissors.py -- public/models`

## Deploying at `/uksalons`

`vite.config.js` uses `base: './'`, so the build works from any sub-path.
- **Vercel (recommended):** deploy this folder as its own project, then on the main site add a rewrite from `/uksalons/:path*` to this deployment. Or deploy it as the `/uksalons` route of the main project.
- **Lead email:** set these env vars in Vercel:
  - `RESEND_API_KEY`
  - `LEAD_TO`: PRD default `ajay@automationlabs.online`, **confirm before launch**
  - `LEAD_FROM`: a verified sender
  - optional: `LEAD_WEBHOOK_URL` (CRM, Sheet or Make.com: stores each lead before the email is sent), `SEND_ACK=true`

## Before launch (PRD checklist)

- [ ] Confirm public email in `src/content.js` (now `info@automationlabs.online`)
- [ ] Confirm lead recipient (`LEAD_TO`) and verify sender domain in Resend
- [ ] Privacy notice live at `/privacy` (form links to it). Terms at `/terms`.
- [ ] Add the analytics tag (GA4/Plausible) behind consent. Events already push to `window.dataLayer` only after consent, with no PII.
- [ ] Optional booking/Calendly URL → `site.bookingUrl`
- [ ] Imagery: photos are carried over from the earlier concept. Confirm licences, or replace with approved salon photography.
- [ ] Use only verified testimonials, logos or stats (none are published on the page today)

## Accessibility & performance notes

- `prefers-reduced-motion`: no loader, no 3D, no pinning, no smooth scroll. Every section renders as normal flowing content.
- No WebGL: the page works fully, just without the 3D shears.
- Keyboard: skip link, visible focus, an accordion with `aria-expanded`, and a form with linked error messages.

## Photography & film
- All photos in `public/images/` are real photographs from Unsplash (free under the Unsplash Licence: commercial use allowed, no attribution required). Each image is used exactly once on the page.
- `public/video/salon-loop.mp4` is a 20 s seamless loop cut from four Pexels clips (free under the Pexels Licence). It is built in Blender's video editor (no ffmpeg needed). The poster is `salon-loop-poster.webp`.
- `public/images/loader/shear-a.webp` and `shear-b.webp` are studio renders of the 3D shears, made by `scripts/blender_loader_shears.py`.
- Before launch, swap in the salon's own photography and film wherever possible.
