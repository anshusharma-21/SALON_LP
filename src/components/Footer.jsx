import { useRef } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import { getLenis } from '../lib/smooth.js';
import { nav, site, cta, footer } from '../content.js';
import { goTo } from './Chrome.jsx';
import { ScissorIcon } from './common.jsx';

function backToTop(e) {
  e.preventDefault();
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { duration: 2.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  document.getElementById('top')?.focus({ preventScroll: true });
}

export default function Footer() {
  const root = useRef();
  useGSAP(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    const st = { trigger: root.current, start: 'top 80%' };
    gsap.from(q('.f-col'), { opacity: 0, y: 40, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: st });
    gsap.from(q('.f-word .ch'), {
      yPercent: 105, duration: 1.5, stagger: 0.035, ease: 'expo.out',
      scrollTrigger: { trigger: q('.f-word')[0], start: 'top 95%' },
    });
    gsap.from(q('.f-word-it'), { opacity: 0, y: 24, rotate: -6, duration: 1.4, delay: 0.5, ease: 'expo.out', scrollTrigger: { trigger: q('.f-word')[0], start: 'top 95%' } });
  }, { scope: root });

  const word = 'AI Automation Labs';
  return (
    <footer className="footer" ref={root}>
      <div className="f-grid">
        <div className="f-col f-brand">
          <a href="#top" className="f-lockup" onClick={backToTop} aria-label={`${site.brand} — back to top`}>
            <ScissorIcon className="f-icon" />
            <span>
              <span className="f-name">{site.brand}</span>
              <span className="f-script">for salons</span>
            </span>
          </a>
          <p>{footer.tagline}</p>
          <a href="#review" className="btn light f-cta" onClick={(e) => goTo(e, 'review', cta.primaryShort, 'footer')}>
            {cta.primaryShort}<span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <nav className="f-col" aria-label="Footer">
          <h2 className="f-h mono">Explore</h2>
          <ul>
            {nav.map((n) => <li key={n.id}><a href={`#${n.id}`} onClick={(e) => goTo(e, n.id)}>{n.label}</a></li>)}
          </ul>
        </nav>

        <div className="f-col">
          <h2 className="f-h mono">Company</h2>
          <ul>
            <li><a href={site.website}>automationlabs.online</a></li>
            <li><a href={site.privacyUrl}>Privacy policy</a></li>
            <li><a href={site.termsUrl}>Terms</a></li>
            <li><button type="button" onClick={() => window.dispatchEvent(new Event('uks-cookie-settings'))}>Cookie settings</button></li>
          </ul>
        </div>

        <div className="f-col">
          <h2 className="f-h mono">Say hello</h2>
          <a className="f-mail serif" href={`mailto:${site.email}`}>{site.email}</a>
          <p className="f-small">Prefer email? Write to us directly.</p>
        </div>
      </div>

      <div className="f-word" aria-hidden="true">
        <span className="f-word-big">
          {word.split('').map((c, i) => <span className="ch" key={i}>{c === ' ' ? ' ' : c}</span>)}
        </span>
        <span className="f-word-it">for salons</span>
      </div>

      <div className="f-base">
        <span className="mono">{site.legal}</span>
        <a href="#top" className="f-top" onClick={backToTop}>
          <span className="mono">Back to top</span>
          <span className="f-top-btn" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </a>
      </div>
    </footer>
  );
}
