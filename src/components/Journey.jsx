import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import { img } from '../lib/asset.js';
import { journey } from '../content.js';
import { Lines, SecLabel, ScissorIcon } from './common.jsx';

export default function Journey() {
  const root = useRef();

  useGSAP(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', () => {
      const track = q('.journey-track')[0];
      const dist = () => track.scrollWidth - window.innerWidth;
      const snipA = q('.cutline .sc-a')[0];
      const snipB = q('.cutline .sc-b')[0];

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => `+=${dist() * 1.1}`,
          pin: q('.journey-pin')[0], scrub: 1, invalidateOnRefresh: true,
          onUpdate: (st) => {
            const p = st.progress;
            const ang = Math.abs(Math.sin(p * 46)) * 18;
            gsap.set(snipA, { rotate: -ang });
            gsap.set(snipB, { rotate: ang });
          },
        },
      });
      tl.to(track, { x: () => -dist() }, 0)
        .to(q('.cutline .done'), { scaleX: 1 }, 0)
        .to(q('.cutline .snip'), { left: '100%' }, 0);
      q('.j-img img').forEach((im) => tl.fromTo(im, { xPercent: -8 }, { xPercent: 8 }, 0));
    });

    mm.add('(max-width: 900px)', () => {
      q('.j-panel').forEach((p) => gsap.from(p, { opacity: 0, y: 60, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%' } }));
    });

    gsap.from(q('.journey-head .line > span'), {
      yPercent: 110, duration: 1.3, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 70%' },
    });
  }, { scope: root });

  return (
    <section className="journey" ref={root} aria-labelledby="journey-title" id="journey">
      <div className="journey-pin">
        <div className="journey-head">
          <div>
            <SecLabel n="02">{journey.label}</SecLabel>
            <h2 className="serif d-m" id="journey-title" style={{ margin: 0 }}><Lines lines={journey.heading} /></h2>
          </div>
          <p className="mono" style={{ color: 'rgba(245,239,232,.55)', margin: 0 }}>Five moments that matter</p>
        </div>
        <ol className="journey-track" style={{ listStyle: 'none', margin: 0 }}>
          {journey.steps.map((s, i) => (
            <li className="j-panel" key={s.title}>
              <div className="j-img">
                <img src={img(s.img)} alt="" loading="lazy" width="460" height="460" />
                <span className="j-num" aria-hidden="true">0{i + 1}</span>
              </div>
              <div className="j-body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="cutline" aria-hidden="true">
          <div className="dash" />
          <div className="done" />
          <div className="snip"><ScissorIcon /></div>
          <div className="labels mono"><span>Discover</span><span>Stay connected</span></div>
        </div>
      </div>
    </section>
  );
}
