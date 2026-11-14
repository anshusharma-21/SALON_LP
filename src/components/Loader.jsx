import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion.js';
import { img } from '../lib/asset.js';
import { site } from '../content.js';

const pageReady = () => {
  const loaded = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise((r) => window.addEventListener('load', r, { once: true }));
  const fonts = document.fonts?.ready ?? Promise.resolve();
  return Promise.race([Promise.all([loaded, fonts]), new Promise((r) => setTimeout(r, 3500))]);
};

/** Studio-rendered gold shears (Blender), one image per blade so they can open around the pivot. */
export function Shears2D({ className = '' }) {
  return (
    <div className={`shears2d ${className}`} aria-hidden="true">
      <img className="sh-b" src={img('loader/shear-b.webp')} alt="" width="400" height="800" decoding="async" />
      <img className="sh-a" src={img('loader/shear-a.webp')} alt="" width="400" height="800" decoding="async" />
    </div>
  );
}

/** The brand lock-up. Rendered once in each half so the cut slices straight through it. */
function Brand() {
  return (
    <div className="ld-brand">
      <Shears2D className="ld-shears" />
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

    // 1 — the lock-up arrives: the shears ease open like a product reveal, the name settles
    const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
      .from(q('.ld-shears'), { opacity: 0, y: 26, scale: 0.92, duration: 1.6 }, 0)
      .fromTo(q('.ld-shears .sh-a'), { rotate: 0 }, { rotate: 11, duration: 1.8, ease: 'power3.inOut' }, 0.2)
      .fromTo(q('.ld-shears .sh-b'), { rotate: 0 }, { rotate: -11, duration: 1.8, ease: 'power3.inOut' }, 0.2)
      .from(q('.ld-name'), { opacity: 0, letterSpacing: '0.62em', duration: 1.7 }, 0.3)
      .from(q('.ld-script'), { opacity: 0, y: 14, duration: 1.2 }, 0.8)
      .from(q('.ld-bar'), { opacity: 0, duration: 0.6 }, 0.9)
      .fromTo(q('.ld-bar i'), { scaleX: 0 }, { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.95);

    const snip = gsap.timeline({ repeat: -1, yoyo: true, paused: true })
      .to(q('.cutter .sh-a'), { rotate: 17, duration: 0.15, ease: 'power2.inOut' }, 0)
      .to(q('.cutter .sh-b'), { rotate: -17, duration: 0.15, ease: 'power2.inOut' }, 0);

    Promise.all([pageReady(), new Promise((r) => intro.eventCallback('onComplete', r))]).then(() => {
      if (!alive) return;
      // Measure the page while it is still hidden — never mid-animation.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      const vw = window.innerWidth;
      const cutter = q('.cutter')[0];
      const line = q('.cut-line')[0];
      const cw = cutter.offsetWidth;
      const travel = { p: 0 };
      snip.play();
      gsap.timeline({ onComplete: () => { snip.kill(); setGone(true); } })
        // the lock-up shears close, ready to cut
        .to(q('.ld-shears .sh-a, .ld-shears .sh-b'), { rotate: 0, duration: 0.45, ease: 'power3.inOut' })
        .to(q('.ld-bar'), { opacity: 0, duration: 0.3 }, '<')
        // 2 — the shears cut a hairline straight across the screen (and through the logo)
        .set(cutter, { opacity: 1 })
        .to(travel, {
          p: 1, duration: 1.3, ease: 'power2.inOut',
          onUpdate: () => {
            const x = -cw + travel.p * (vw + cw * 2);
            gsap.set(cutter, { x });
            gsap.set(line, { scaleX: gsap.utils.clamp(0, 1, (x + cw / 2) / vw) });
          },
        }, '<')
        .to(line, { opacity: 0, duration: 0.25 })
        .add(() => snip.pause(), '<')
        // 3 — the two halves swing open like doors and we walk through into the salon
        .add(() => onDone(), '-=0.1')
        .to(q('.half.top'), { yPercent: -104, rotateX: 34, scale: 1.1, duration: 1.45, ease: 'expo.inOut' }, '<')
        .to(q('.half.bot'), { yPercent: 104, rotateX: -34, scale: 1.1, duration: 1.45, ease: 'expo.inOut' }, '<')
        .to(q('.half .ld-brand'), { scale: 1.3, opacity: 0, duration: 1.0, ease: 'power2.in' }, '<');
    });
    return () => { alive = false; };
  }, { scope: ref });

  if (gone) return null;
  return (
    <div className="loader" ref={ref} role="presentation" aria-hidden="true">
      <div className="half top"><div className="half-inner"><Brand /></div></div>
      <div className="half bot"><div className="half-inner"><Brand /></div></div>
      <div className="cut-line" />
      <div className="cutter"><Shears2D /></div>
    </div>
  );
}
