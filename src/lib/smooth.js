import Lenis from 'lenis';
import { gsap, ScrollTrigger, reducedMotion } from './motion.js';

let lenis = null;

export function startSmooth() {
  if (reducedMotion()) return null;
  lenis = new Lenis({
    lerp: 0.085,          // silky, frame-rate independent smoothing for wheel / trackpad
    wheelMultiplier: 0.9,
    smoothWheel: true,
    syncTouch: false,     // touch keeps the device's own native momentum (smoothest on phones)
    touchMultiplier: 1.2,
  });
  lenis.on('scroll', ScrollTrigger.update);
  if (import.meta.env.DEV) window.__lenis = lenis;
  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  ScrollTrigger.config({ ignoreMobileResize: true });
  // keep GSAP's lag smoothing: a heavy frame must never make intro animations jump to their end
  return () => { gsap.ticker.remove(raf); lenis.destroy(); lenis = null; };
}

export const getLenis = () => lenis;
export const stopScroll = () => { lenis?.stop(); document.documentElement.style.overflow = 'hidden'; };
export const resumeScroll = () => { lenis?.start(); document.documentElement.style.overflow = ''; };

// Anchor navigation that understands pinned sections (a target may live inside a pin-spacer).
export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const special = el.dataset.scrollAt ? Number(el.dataset.scrollAt) : null;
  const header = 76;
  const y = special ?? el.getBoundingClientRect().top + window.scrollY - header;
  if (lenis) lenis.scrollTo(y, { duration: 1.6 });
  else window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
  // Move focus for keyboard / screen-reader users without a second jump.
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}
