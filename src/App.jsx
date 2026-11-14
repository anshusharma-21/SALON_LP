import { lazy, Suspense, useEffect, useState } from 'react';
import { ScrollTrigger, reducedMotion } from './lib/motion.js';
import { startSmooth, stopScroll, resumeScroll } from './lib/smooth.js';
import { getConsent, track, utm, device } from './lib/track.js';
import Loader from './components/Loader.jsx';
import { Header, Cursor, CookieBar } from './components/Chrome.jsx';
import HeroStage from './components/HeroStage.jsx';
import Journey from './components/Journey.jsx';
import { Build, Lookbook } from './components/Build.jsx';
import Concepts from './components/Concepts.jsx';
import { Beyond, Why, Process, Faq } from './components/Sections.jsx';
import Review from './components/Review.jsx';
import Footer from './components/Footer.jsx';

const ShearsCanvas = lazy(() => import('./three/ShearsCanvas.jsx'));

const webglOK = () => {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [use3D] = useState(() => !reducedMotion() && webglOK());

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    const stop = startSmooth();
    stopScroll();
    if (getConsent() === 'granted') track('uksalons_page_view', { ...utm(), referrer: document.referrer || '', device_category: device() });
    return () => stop?.();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    resumeScroll();
    // the loader measures the page while it is still covered; reduced motion has no loader, so measure now
    const id = reducedMotion() ? setTimeout(() => { ScrollTrigger.sort(); ScrollTrigger.refresh(); }, 50) : 0;
    // Section-view analytics (PRD 11.1) — once per section.
    const seen = new Set();
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !seen.has(e.target.id)) { seen.add(e.target.id); track('uksalons_section_view', { section_id: e.target.id }); }
    }), { threshold: 0.4 });
    document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
    return () => { clearTimeout(id); io.disconnect(); };
  }, [loaded]);

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Loader onDone={() => setLoaded(true)} />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Header />
      {use3D && <Suspense fallback={null}><ShearsCanvas /></Suspense>}
      <main id="main">
        <HeroStage loaded={loaded} />
        <Journey />
        <Build />
        <Lookbook />
        <Concepts />
        <Beyond />
        <Why />
        <Process />
        <Faq />
        <Review />
      </main>
      <Footer />
      <CookieBar />
    </>
  );
}
