// Site "chrome": header, mobile menu, custom cursor, cookie consent.
import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/motion.js';
import { getLenis, scrollToId } from '../lib/smooth.js';
import { getConsent, setConsent, track, utm, device } from '../lib/track.js';
import { nav, cta, site } from '../content.js';

export function goTo(e, id, label, section) {
  e?.preventDefault();
  scrollToId(id);
  if (label) track(section === 'hero' ? 'uksalons_hero_cta_click' : 'uksalons_cta_click', { cta_label: label, section, campaign: utm().utm_campaign });
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 4 && !open);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    // Lenis drives native scroll, so plain scroll events are enough here.
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open]);

  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const lenis = getLenis();
    open ? lenis?.stop() : lenis?.start();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e, id) => { setOpen(false); goTo(e, id); };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''}`}>
        <nav className="nav" aria-label="Page sections">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''} onClick={(e) => go(e, n.id)}>{n.label}</a>
          ))}
        </nav>
        <div className="header-cta">
          <a href="#review" className="btn solid" onClick={(e) => goTo(e, 'review', cta.primary, 'header')}>
            <span className="hide-sm">Request a&nbsp;</span>Review<span className="arrow" aria-hidden="true">→</span>
          </a>
          <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
            <i /><i />
          </button>
        </div>
      </header>
      <div className="mobile-menu" id="mobile-menu" aria-hidden={!open}>
        {nav.map((n) => (
          <a key={n.id} href={`#${n.id}`} tabIndex={open ? 0 : -1} onClick={(e) => go(e, n.id)}>{n.label}</a>
        ))}
        <a href="#review" className="btn light" tabIndex={open ? 0 : -1} onClick={(e) => { setOpen(false); goTo(e, 'review', cta.primary, 'menu'); }}>
          {cta.primary}<span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </>
  );
}

export function Cursor() {
  const dot = useRef();
  const ring = useRef();
  const label = useRef();
  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const xd = gsap.quickTo(dot.current, 'x', { duration: 0.1 });
    const yd = gsap.quickTo(dot.current, 'y', { duration: 0.1 });
    const xr = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' });
    const yr = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' });
    const move = (e) => {
      xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY);
      const t = e.target.closest?.('[data-cursor], a, button, label, input, select, textarea');
      const r = ring.current;
      if (t?.dataset?.cursor) { r.classList.add('big'); r.classList.remove('hover'); label.current.textContent = t.dataset.cursor; }
      else if (t) { r.classList.add('hover'); r.classList.remove('big'); }
      else { r.classList.remove('big', 'hover'); }
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return (
    <>
      <div className="cursor" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true"><span ref={label} /></div>
    </>
  );
}

export function CookieBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!getConsent()) setTimeout(() => setShow(true), 4500);
    const open = () => setShow(true);
    window.addEventListener('uks-cookie-settings', open);
    return () => window.removeEventListener('uks-cookie-settings', open);
  }, []);
  const choose = (v) => {
    setConsent(v);
    setShow(false);
    if (v === 'granted') {
      track('uksalons_page_view', { ...utm(), referrer: document.referrer || '', device_category: device() });
    }
  };
  if (!show) return null;
  return (
    <div className="cookie" role="dialog" aria-label="Cookie preferences">
      <p>We use essential cookies to run this page. With your permission we’d also use analytics cookies to understand how the page is used — never to identify you.</p>
      <div className="row">
        <button className="btn solid" onClick={() => choose('granted')}>Accept analytics</button>
        <button className="btn" onClick={() => choose('denied')}>Essential only</button>
      </div>
    </div>
  );
}
