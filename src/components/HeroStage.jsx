import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/motion.js';
import { shears } from '../three/shearsState.js';
import { asset, img } from '../lib/asset.js';
import { hero, problems, value, cta } from '../content.js';
import { Lines, SecLabel } from './common.jsx';
import { goTo } from './Chrome.jsx';

const FLOW_MQ = '(max-width: 900px), (prefers-reduced-motion: reduce)';

export default function HeroStage({ loaded }) {
  const root = useRef();
  const video = useRef();
  const [flow, setFlow] = useState(() => window.matchMedia(FLOW_MQ).matches);

  useEffect(() => {
    const mq = window.matchMedia(FLOW_MQ);
    const on = () => setFlow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // ---- the salon film: muted, inline, looping; never for reduced motion or data-saver --------
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const still = reducedMotion() || navigator.connection?.saveData;
    if (still) { v.removeAttribute('autoplay'); v.preload = 'none'; v.pause(); return; }
    v.muted = true;
    const play = () => v.play().catch(() => {});
    play();
    // pause whenever the film is off screen (saves battery and keeps scrolling smooth)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : v.pause()), { threshold: 0.01 });
    io.observe(v);
    const onVis = () => (document.hidden ? v.pause() : play());
    document.addEventListener('visibilitychange', onVis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  // ---- entrance (after the loader opens) -------------------------------------------------
  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const a = shears.a;
    if (!loaded) {
      if (!reducedMotion()) gsap.set(q('.hero-title .line > span'), { yPercent: 110 });
      Object.assign(a, window.matchMedia(FLOW_MQ).matches
        ? { x: 0.3, y: -0.36, size: 0.56, rx: 0.25, ry: -0.35, rz: -0.42, open: 0.32, snip: 0, o: 1, in: 0, spin: -3.3 }
        : { x: 0, y: -0.12, size: 0.5, rx: 0.2, ry: -0.35, rz: -0.3, open: 0.3, snip: 0, o: 1, in: 0, spin: -3.3 });
      return;
    }
    if (reducedMotion()) return;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    // "walking in": the whole scene rushes forward out of a soft blur as the loader doors open
    tl.fromTo(q('.stage-zoom'), { scale: 1.22, transformOrigin: '50% 50%' },
      { scale: 1, duration: 2.2, ease: 'expo.out', clearProps: 'transform' }, 0)
      .fromTo(q('.stage-dark'), { opacity: 0.9 }, { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0);
    tl.to(q('.hero-title .line > span'), { yPercent: 0, duration: 1.5, stagger: 0.09 }, 0.15)
      .from(q('.hero-copy .lede, .hero-actions, .hero-micro'), { opacity: 0, y: 30, duration: 1.2, stagger: 0.08 }, 0.5)
      .from(q('.hero-video'), { scale: 1.15, duration: 3.2, ease: 'power3.out' }, 0)
      .from(q('.scroll-cue'), { opacity: 0, duration: 1.2 }, 1.2)
    // phones: the shears ride with the film arch from the start (desktop brings them in on scroll)
    if (window.matchMedia(FLOW_MQ).matches) {
      tl.to(a, { in: 1, duration: 1.4, ease: 'power2.out' }, 0.4)
        .to(a, { spin: 0, duration: 2.4, ease: 'power3.out' }, 0.4);
    }
  }, { scope: root, dependencies: [loaded] });

  // ---- scroll choreography ----------------------------------------------------------------
  useGSAP(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    const a = shears.a;
    const stage = root.current;
    const expEl = q('#experience')[0];

    if (flow) {
      // Mobile: the shears ride along with the arch photo, then drift away.
      const arch = q('.hero-media')[0];
      Object.assign(a, { size: 0.3, rx: 0.2, rz: -0.5 });
      const follow = () => {
        const r = arch.getBoundingClientRect();
        const vw = window.innerWidth; const vh = window.innerHeight;
        a.x = ((r.left + r.width * 0.3) / vw) * 2 - 1;
        a.y = -(((r.top + r.height * 0.78) / vh) * 2 - 1);
        const visible = r.bottom > 0 && r.top < vh;
        a.o = visible ? 1 : 0;
      };
      gsap.ticker.add(follow);
      gsap.to(a, { ry: Math.PI * 2, scrollTrigger: { trigger: stage, start: 'top top', end: 'bottom top', scrub: 1 } });
      return () => gsap.ticker.remove(follow);
    }

    // Desktop: one pinned scene. Timeline units = 100vh of scroll; pin covers the first 2.6.
    gsap.set(q('.exp-head .line > span'), { yPercent: 110 });
    gsap.set(q('.exp-head .sec-label, .value-strip'), { opacity: 0, y: 20 });
    gsap.set(q('.orbit-card'), { opacity: 0, scale: 0.85 });
    gsap.set(q('.oc-line'), { scaleX: 0 });

    const PIN = 2.4; // the scene is complete here; for the last unit the Journey slides up over it
    const TOTAL = 3.4;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stage, start: 'top top', end: `+=${TOTAL * 100}%`, scrub: 1.1, pin: true, anticipatePin: 1,
        onRefresh: (st) => { expEl.dataset.scrollAt = Math.round(st.start + (st.end - st.start) * (1.95 / TOTAL)); },
      },
    });
    tl.to({}, { duration: TOTAL }, 0); // fix the length

    // 1 — hero gives way
    tl.to(q('.hero-copy'), { y: -140, opacity: 0, duration: 0.7, ease: 'power2.in' }, 0)
      .to(q('.scroll-cue'), { opacity: 0, duration: 0.3 }, 0)
      .fromTo(q('.hero-media'), { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)' },
        { clipPath: 'inset(16% 36% 16% 36% round 999px 999px 999px 999px)', duration: 0.85, ease: 'power2.inOut' }, 0.02)
      .to(q('.hero-media'), { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0.62)
      .to(q('.hero-video'), { scale: 1.25, duration: 0.9 }, 0.02);

    // 2 — the shears take centre stage
    tl.fromTo(a, { in: 0 }, { in: 1, duration: 0.35, ease: 'power2.out' }, 0.3)
      .fromTo(a, { spin: -3.3 }, { spin: 0, duration: 0.85, ease: 'power3.out' }, 0.3);
    tl.to(a, { x: 0, y: -0.22, size: 0.6, rx: 0.08, ry: 0, rz: 0, open: 0.42, duration: 1, ease: 'power2.inOut' }, 0)
      .to(a, { ry: Math.PI * 2, duration: 1.5, ease: 'power1.inOut' }, 0.95)
      .to(a, { snip: 1, duration: 0.3 }, 1.1)
      .to(a, { snip: 0, duration: 0.3 }, 2.2);

    // 3 — the experience gathers around them
    tl.to(q('.exp-head .sec-label'), { opacity: 1, y: 0, duration: 0.3 }, 0.75)
      .to(q('.exp-head .line > span'), { yPercent: 0, duration: 0.45, stagger: 0.08, ease: 'power3.out' }, 0.8);
    q('.orbit-card').forEach((card, i) => {
      const left = i % 2 === 0;
      tl.fromTo(card, { opacity: 0, scale: 0.85, x: left ? 120 : -120 },
        { opacity: 1, scale: 1, x: 0, duration: 0.45, ease: 'power3.out' }, 1.05 + i * 0.16);
      tl.to(card.querySelector('.oc-line'), { scaleX: 1, duration: 0.35, ease: 'power2.out' }, 1.25 + i * 0.16);
    });
    tl.to(q('.value-strip'), { opacity: 1, y: 0, duration: 0.3 }, 1.8);

    // 4 — exit: the shears snip once and lift away, the scene clears for the next chapter
    tl.to(a, { open: 0.05, duration: 0.15, ease: 'power2.in' }, PIN)
      .to(a, { y: 1.6, rz: -1.2, size: 0.5, duration: 0.5, ease: 'power2.in' }, PIN + 0.02)
      .to(a, { o: 0, duration: 0.25 }, PIN + 0.3)
      // the scene recedes while the Journey chapter slides up over it like a stacked card (see .journey in CSS)
      .to(q('.stage-zoom'), { scale: 0.9, y: -40, duration: TOTAL - PIN, ease: 'power1.in' }, PIN)
      .to(q('.stage-dark'), { opacity: 0.6, duration: TOTAL - PIN, ease: 'power1.in' }, PIN);
    // pins created here sit above later sections — make sure everything is measured in page order
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, { scope: root, dependencies: [flow], revertOnUpdate: true });

  return (
    <section className={`stage ${flow ? 'flow' : ''}`} id="top" ref={root} aria-labelledby="hero-title">
      <div className="stage-zoom">
      <div className="stage-bg" aria-hidden="true" />
      <div className="stage-dark" aria-hidden="true" />

      <div className="hero-media">
        <video
          ref={video} className="hero-video" muted loop playsInline autoPlay preload="auto"
          poster={asset('video/salon-loop-poster.webp')} aria-hidden="true" tabIndex={-1}
        >
          <source src={asset('video/salon-loop.mp4')} type="video/mp4" />
        </video>
        <div className="hero-shade" aria-hidden="true" />
      </div>


      <div className="hero-copy">
        <h1 className="hero-title serif" id="hero-title">
          <Lines lines={hero.titleLines} italicFrom={hero.italicFrom} />
        </h1>
        <p className="lede">{hero.body}</p>
        <div className="hero-actions">
          <a href="#review" className="btn solid" onClick={(e) => goTo(e, 'review', cta.primary, 'hero')}>
            {cta.primary}<span className="arrow" aria-hidden="true">→</span>
          </a>
          <a href="#build" className="link-u" onClick={(e) => goTo(e, 'build', cta.secondary, 'hero')}>
            {cta.secondary} <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="hero-micro mono">{hero.micro}</p>
      </div>

      <div className="scroll-cue mono" aria-hidden="true"><span>Scroll</span><i /></div>

      <div className="exp" id="experience" aria-labelledby="exp-title">
        <div className="exp-head">
          <SecLabel n="01">{problems.label}</SecLabel>
          <h2 className="serif" id="exp-title"><Lines lines={problems.heading} /></h2>
        </div>
        {problems.items.map((p, i) => (
          <article className={`orbit-card oc-${i + 1}`} key={p.title}>
            <div className="oc-img"><img src={img(p.img)} alt="" loading="lazy" width="76" height="96" /></div>
            <div>
              <span className="oc-num">No. {String(i + 1).padStart(2, '0')}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
            <span className="oc-line" aria-hidden="true" />
          </article>
        ))}
        <div className="value-strip">
          {value.map((v) => <span key={v}>{v}</span>)}
        </div>
      </div>
      </div>
    </section>
  );
}
