import { useRef, useState } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import { img } from '../lib/asset.js';
import { capabilities, lookbook } from '../content.js';
import { SecHead, Lines } from './common.jsx';

export function Build() {
  const root = useRef();
  const prev = useRef();
  const [hot, setHot] = useState(-1);
  const mover = useRef(null);

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    if (!reducedMotion()) {
      gsap.from(q('.cap-row'), {
        opacity: 0, y: 40, duration: 1.1, stagger: 0.06, ease: 'expo.out',
        scrollTrigger: { trigger: q('.cap-grid')[0], start: 'top 80%' },
      });
    }
    const x = gsap.quickTo(prev.current, 'x', { duration: 0.6, ease: 'power3' });
    const y = gsap.quickTo(prev.current, 'y', { duration: 0.6, ease: 'power3' });
    mover.current = (e) => { x(e.clientX + 30); y(e.clientY - 165); };
  }, { scope: root });

  const enter = (i) => {
    setHot(i);
    gsap.to(prev.current, { opacity: 1, scale: 1, rotate: i % 2 ? 4 : -4, duration: 0.6, ease: 'expo.out' });
  };
  const leave = () => {
    setHot(-1);
    gsap.to(prev.current, { opacity: 0, scale: 0.6, duration: 0.5, ease: 'expo.out' });
  };

  return (
    <section className="section build" id="build" ref={root} aria-labelledby="build-title">
      <div className="wrap">
        <SecHead n="03" label={capabilities.label} lines={capabilities.heading} id="build-title" />
        <div className="cap-grid" onPointerMove={(e) => mover.current?.(e)} onPointerLeave={leave}>
          {capabilities.items.map((c, i) => (
            <div className="cap-row" key={c.title} onPointerEnter={() => enter(i)}>
              <span className="idx mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{c.title}</h3>
              <span className="plus" aria-hidden="true">+</span>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="cap-preview" ref={prev} aria-hidden="true">
        {capabilities.items.map((c, i) => (
          <img key={c.title} src={img(c.img)} alt="" loading="lazy" className={hot === i ? 'on' : ''} />
        ))}
      </div>
    </section>
  );
}

export function Lookbook() {
  const root = useRef();
  useGSAP(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    const rows = q('.lb-row');
    rows.forEach((row, i) => {
      gsap.fromTo(row, { xPercent: i % 2 ? -32 : -6 }, {
        xPercent: i % 2 ? -6 : -32, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
    gsap.fromTo(q('.lb-rows'), { rotateX: 24, rotateZ: -6, scale: 1.15 }, {
      rotateX: 6, rotateZ: -2, scale: 1, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'center center', scrub: 1 },
    });
  }, { scope: root });

  const half = Math.ceil(lookbook.tiles.length / 2);
  const rowA = lookbook.tiles.slice(0, half);
  const rowB = lookbook.tiles.slice(half);
  const tile = ([src, cap], i) => (
    <figure className={`lb-tile ${i % 3 === 1 ? 'arch' : ''}`} key={`${src}-${i}`}>
      <img src={img(src)} alt="" loading="lazy" draggable="false" />
      <figcaption>{cap}</figcaption>
    </figure>
  );

  return (
    <section className="lookbook" ref={root} aria-label="Example salon gallery">
      <div className="lb-head">
        <h2 className="serif d-m"><Lines lines={lookbook.heading} /></h2>
        <p className="mono" style={{ margin: 0, color: 'var(--soft)' }}>{lookbook.note}</p>
      </div>
      <div className="lb-rows">
        <div className="lb-row">{[...rowA, ...rowA, ...rowA].map(tile)}</div>
        <div className="lb-row">{[...rowB, ...rowB, ...rowB].map(tile)}</div>
      </div>
    </section>
  );
}
