import { useRef, useState } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import { ScissorIcon } from './common.jsx';
import { site } from '../content.js';

const pageReady = () => {
  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((r) => window.addEventListener('load', r, { once: true }));
  const fonts = document.fonts?.ready ?? Promise.resolve();
  return Promise.race([Promise.all([loaded, fonts]), new Promise((r) => setTimeout(r, 3500))]);
};

/** The brand lock-up. Rendered once in each half so the cut slices straight through it. */
function Brand() {
  return (
    <div className="ld-brand">
      <ScissorIcon className="ld-icon" />
      <div className="ld-name">{site.brand}</div>
      <div className="ld-script">for salons</div>
      <div className="ld-bar"><i /></div>
    </div>
  );
}

export default function Loader({ onDone }) {
  const ref = useRef();
  const [gone, setGone] = useState(false);

  useGSAP(() => {
    if (reducedMotion()) { setGone(true); onDone(); return; }
    let alive = true;
    const q = gsap.utils.selector(ref);

    // 1 — the lock-up writes itself in
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
      .fromTo(q('.ld-icon path, .ld-icon circle'), { strokeDasharray: 120, strokeDashoffset: 120 },
        { strokeDashoffset: 0, duration: 1.6, stagger: 0.05, ease: 'power2.inOut' }, 0)
      .from(q('.ld-name'), { opacity: 0, letterSpacing: '0.6em', duration: 1.6 }, 0.25)
      .from(q('.ld-script'), { opacity: 0, y: 14, duration: 1.2 }, 0.7)
      .from(q('.ld-bar'), { opacity: 0, duration: 0.6 }, 0.8)
      .fromTo(q('.ld-bar i'), { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0.9);

    const snip = gsap.timeline({ repeat: -1, yoyo: true, paused: true })
      .to(q('.cutter .sc-a'), { rotate: -18, duration: 0.14, ease: 'power2.inOut' }, 0)
      .to(q('.cutter .sc-b'), { rotate: 18, duration: 0.14, ease: 'power2.inOut' }, 0);

    Promise.all([pageReady(), new Promise((r) => intro.eventCallback('onComplete', r))]).then(() => {
      if (!alive) return;
      snip.play();
      gsap.timeline({ onComplete: () => { snip.kill(); setGone(true); } })
        // 2 — the shears cut a line straight across the screen (and through the logo)
        .to(q('.ld-bar'), { opacity: 0, duration: 0.3 })
        .set(q('.cutter'), { opacity: 1 })
        .to(q('.cutter'), { left: '100%', xPercent: 100, duration: 1.25, ease: 'power2.inOut' }, '<')
        .fromTo(q('.cut-line'), { scaleX: 0 }, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, '<0.04')
        .to(q('.cut-line'), { opacity: 0, duration: 0.25 })
        .add(() => snip.pause(), '<')
        // 3 — the two halves swing open like doors and we walk through into the salon
        .add(() => onDone(), '-=0.05')
        .to(q('.half.top'), { yPercent: -102, rotateX: 38, scale: 1.12, duration: 1.5, ease: 'expo.inOut' }, '<')
        .to(q('.half.bot'), { yPercent: 102, rotateX: -38, scale: 1.12, duration: 1.5, ease: 'expo.inOut' }, '<')
        .to(q('.half .ld-brand'), { scale: 1.35, opacity: 0, duration: 1.1, ease: 'power2.in' }, '<');
    });
    return () => { alive = false; };
  }, { scope: ref });

  if (gone) return null;
  return (
    <div className="loader" ref={ref} role="presentation" aria-hidden="true">
      <div className="half top"><div className="half-inner"><Brand /></div></div>
      <div className="half bot"><div className="half-inner"><Brand /></div></div>
      <div className="cut-line" />
      <div className="cutter"><ScissorIcon /></div>
    </div>
  );
}
