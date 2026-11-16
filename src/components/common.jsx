import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';

export function ScissorIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={`scissor-ico ${className}`} aria-hidden="true">
      <g className="sc-blade sc-a">
        <circle cx="19" cy="49" r="8" />
        <path d="M24 43 L32 30 L44 6" />
      </g>
      <g className="sc-blade sc-b">
        <circle cx="45" cy="49" r="8" />
        <path d="M40 43 L32 30 L20 6" />
      </g>
      <circle cx="32" cy="30" r="1.8" fill="currentColor" />
    </svg>
  );
}

/** Headline split into masked lines. Lines from `italicFrom` onward are set in the italic face. */
export function Lines({ lines, italicFrom = lines.length - 1 }) {
  return lines.map((l, i) => (
    <span className="line" key={i}>
      <span>{i >= italicFrom ? <em>{l}</em> : l}</span>
    </span>
  ));
}

export function SecLabel({ n, children, style }) {
  return (
    <div className="sec-label mono" style={style}>
      {n && <span>({n})</span>}
      <span>{children}</span>
    </div>
  );
}

/** Section heading with a scroll-triggered line reveal. */
export function SecHead({ n, label, lines, center, as: H = 'h2', size = 'd-m', children, id }) {
  const ref = useRef();
  useGSAP(() => {
    if (reducedMotion()) return;
    gsap.from(ref.current.querySelectorAll('.line > span'), {
      yPercent: 110, duration: 1.3, stagger: 0.09, ease: 'expo.out',
      scrollTrigger: { trigger: ref.current, start: 'top 85%' },
    });
    gsap.from(ref.current.querySelector('.sec-label'), {
      opacity: 0, x: -20, duration: 1, scrollTrigger: { trigger: ref.current, start: 'top 85%' },
    });
  }, { scope: ref });
  return (
    <div className={`sec-head ${center ? 'center' : ''}`} ref={ref}>
      <SecLabel n={n}>{label}</SecLabel>
      <H className={`serif ${size}`} style={{ margin: 0 }} id={id}>
        <Lines lines={lines} />
      </H>
      {children}
    </div>
  );
}

/** Fade-up any children on scroll. */
export function Reveal({ children, as: Tag = 'div', delay = 0, y = 40, className, ...rest }) {
  const ref = useRef();
  useGSAP(() => {
    if (reducedMotion()) return;
    gsap.from(ref.current, {
      opacity: 0, y, duration: 1.2, delay, ease: 'expo.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%' },
    });
  }, { scope: ref });
  return <Tag ref={ref} className={className} {...rest}>{children}</Tag>;
}
