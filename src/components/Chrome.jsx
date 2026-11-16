// Site "chrome": header, mobile menu, cookie consent.
import { useEffect, useState } from 'react';
import { getLenis, scrollToId } from '../lib/smooth.js';
import { getConsent, setConsent, track, utm, device } from '../lib/track.js';
import { nav, cta } from '../content.js';

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
  // ivory nav while it sits over the hero film (desktop only — on phones the hero is ivory)
  const filmUnder = () => window.scrollY < window.innerHeight * 0.5 && !window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches;
  const [onDark, setOnDark] = useState(filmUnder);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setOnDark(filmUnder());
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
      <header className={`header ${scrolled ? 'scrolled' : ''} ${hidden ? 'hidden' : ''} ${onDark ? 'on-dark' : ''}`}>
        <nav className="nav" aria-label="Page sections">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={active === n.id ? 'active' : ''} onClick={(e) => go(e, n.id)}>{n.label}</a>
          ))}
        </nav>
        <div className="header-cta">
          <a href="#review" className="btn solid" onClick={(e) => goTo(e, 'review', cta.primary, 'header')}>
            {cta.header}<span className="arrow" aria-hidden="true">→</span>
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
