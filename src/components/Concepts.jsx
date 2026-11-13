import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/motion.js';
import { getLenis } from '../lib/smooth.js';
import { img } from '../lib/asset.js';
import { concepts } from '../content.js';
import { SecHead } from './common.jsx';

const bg = (name, pos = 'center') => ({ backgroundImage: `url(${img(name)})`, backgroundPosition: pos });
const N = concepts.salonName;

function Nav({ light }) {
  return (
    <div className="mk-nav" style={light ? { color: '#fbf8f4' } : undefined}>
      <span>Treatments · Team</span><span className="mk-logo">{N}</span><span>Visit · Book</span>
    </div>
  );
}

const MOCKS = [
  // Homepage
  () => (
    <div className="mk">
      <Nav />
      <div className="mk-img" style={{ ...bg('cc-hero.webp', 'center 20%'), left: '6%', top: '12%', width: '46%', height: '52%', borderRadius: '999px 999px 0 0' }} />
      <div className="mk-h" style={{ left: '57%', top: '22%', fontSize: 28 }}>The art</div>
      <div className="mk-s" style={{ left: '57%', top: '31%', fontSize: 26 }}>of beautiful hair</div>
      <span className="mk-p" style={{ left: '57%', top: '42%', width: '30%' }} />
      <span className="mk-p" style={{ left: '57%', top: '45.5%', width: '24%' }} />
      <span className="mk-btn" style={{ left: '57%', top: '52%' }}>Book a visit</span>
      <div className="mk-rule" style={{ left: '6%', right: '6%', top: '70%' }} />
      <div style={{ position: 'absolute', left: '6%', top: '67.5%', background: '#fbf8f4', paddingRight: 10, fontSize: 7, letterSpacing: '.18em' }}>SIGNATURE SERVICES</div>
      {['cc-row-1.webp', 'cc-row-2.webp', 'cc-row-3.webp', 'cc-row-4.webp'].map((s, i) => (
        <div key={s} className="mk-img" style={{ ...bg(s), left: `${6 + i * 22.4}%`, top: '75%', width: '20%', height: '20%' }} />
      ))}
    </div>
  ),
  // Treatment page
  () => (
    <div className="mk">
      <Nav light />
      <div className="mk-img" style={{ ...bg('cc-extensions.webp', 'center 30%'), left: 0, right: 0, top: 0, height: '46%' }} />
      <div style={{ position: 'absolute', inset: '0 0 54% 0', background: 'linear-gradient(transparent 40%, rgba(43,32,27,.5))' }} />
      <div className="mk-h" style={{ left: '7%', top: '33%', fontSize: 30, color: '#fbf8f4' }}>Balayage</div>
      <div className="mk-h" style={{ left: '7%', top: '53%', fontSize: 9, fontFamily: 'var(--sans)', letterSpacing: '.2em' }}>THE TREATMENT</div>
      {[0, 1, 2].map((r) => <span key={r} className="mk-p" style={{ left: '7%', top: `${59 + r * 3.5}%`, width: `${48 - r * 9}%` }} />)}
      <div style={{ position: 'absolute', left: '62%', right: '7%', top: '52%', border: '1px solid rgba(43,32,27,.18)', borderRadius: 8, padding: '10px 12px', fontSize: 8, lineHeight: 1.9 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 13, marginBottom: 4 }}>At a glance</div>
        <div>Approx. 3 hours</div><div>Consultation first</div><div>Senior colourists</div>
      </div>
      <div className="mk-rule" style={{ left: '7%', right: '7%', top: '78%' }} />
      <div className="mk-h" style={{ left: '7%', top: '81%', fontSize: 12 }}>Frequently asked</div>
      <span className="mk-btn" style={{ right: '7%', top: '87%', background: 'var(--mocha)', color: '#fbf8f4' }}>Book this treatment</span>
    </div>
  ),
  // Stylist page
  () => (
    <div className="mk">
      <Nav />
      <div className="mk-img" style={{ ...bg('cc-stylist.webp', 'center 25%'), left: '7%', top: '13%', width: '40%', height: '56%', borderRadius: '999px 999px 0 0' }} />
      <div className="mk-h" style={{ left: '53%', top: '19%', fontSize: 7, fontFamily: 'var(--sans)', letterSpacing: '.22em' }}>ARTISTIC DIRECTOR</div>
      <div className="mk-h" style={{ left: '53%', top: '24%', fontSize: 30 }}>Amara</div>
      <div className="mk-s" style={{ left: '53%', top: '33%', fontSize: 26 }}>Okafor</div>
      {[0, 1, 2].map((r) => <span key={r} className="mk-p" style={{ left: '53%', top: `${45 + r * 3.6}%`, width: `${36 - r * 6}%` }} />)}
      <span className="mk-btn" style={{ left: '53%', top: '58%' }}>Book with Amara</span>
      <div className="mk-h" style={{ left: '7%', top: '75%', fontSize: 13 }}>Specialisms</div>
      {['Colour', 'Bridal', 'Textured hair', 'Cutting'].map((t, i) => (
        <span key={t} className="mk-chip" style={{ left: `${7 + [0, 17, 33, 56][i]}%`, top: '83%' }}>{t}</span>
      ))}
    </div>
  ),
  // Location page
  () => (
    <div className="mk">
      <Nav />
      <div className="mk-h" style={{ left: '7%', top: '13%', fontSize: 30 }}>Marylebone</div>
      <div className="mk-s" style={{ left: '7%', top: '22%', fontSize: 24 }}>studio</div>
      <div className="mk-img" style={{ ...bg('cc-location.webp', 'center 60%'), left: '7%', width: '50%', top: '33%', height: '52%' }} />
      <div style={{ position: 'absolute', left: '62%', right: '7%', top: '33%', fontSize: 8, lineHeight: 2.1 }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 13 }}>Opening hours</div>
        <div>Mon–Fri · 9–8</div><div>Saturday · 9–6</div><div>Sunday · Closed</div>
        <div style={{ height: 60, marginTop: 8, borderRadius: 6, background: 'repeating-linear-gradient(45deg,#efe7dd 0 6px,#e7ddd1 6px 12px)', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '50%', top: '45%', width: 10, height: 10, borderRadius: '50% 50% 50% 0', background: 'var(--gold)', transform: 'rotate(-45deg)' }} />
        </div>
      </div>
      <span className="mk-btn" style={{ left: '62%', top: '80%' }}>Book at this studio</span>
    </div>
  ),
  // Gift voucher & membership
  () => (
    <div className="mk" style={{ background: '#a88e7c', color: '#fbf8f4' }}>
      <div className="mk-nav" style={{ color: '#fbf8f4' }}><span>Gift</span><span className="mk-logo">{N}</span><span>Members</span></div>
      <div className="mk-h" style={{ left: '7%', top: '14%', fontSize: 28 }}>The gift of</div>
      <div className="mk-s" style={{ left: '7%', top: '23%', fontSize: 26, color: '#fbf8f4' }}>an afternoon</div>
      <div className="mk-img" style={{ ...bg('cc-voucher.webp', 'center 40%'), left: '52%', width: '38%', top: '12%', height: '30%', borderRadius: 10, transform: 'rotate(-5deg)', boxShadow: '0 20px 40px rgba(43,32,27,.35)' }}>
        <span style={{ position: 'absolute', left: 12, bottom: 8, fontFamily: 'var(--italic)', fontStyle: 'italic', fontSize: 18, color: '#5a4436' }}>Gift card</span>
      </div>
      <div style={{ position: 'absolute', left: '7%', right: '7%', top: '55%', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {['Ritual', 'Signature', 'Atelier'].map((t) => (
          <div key={t} style={{ border: '1px solid rgba(251,248,244,.45)', borderRadius: 6, padding: '14px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 14 }}>{t}</div>
            <div style={{ fontSize: 6.5, letterSpacing: '.18em', marginTop: 4 }}>MEMBERSHIP</div>
          </div>
        ))}
      </div>
      <span className="mk-btn" style={{ left: '7%', top: '86%', borderColor: '#fbf8f4' }}>Send a gift</span>
    </div>
  ),
];

const BLURBS = [
  'Positioning, signature services and a clear path to book.',
  'Everything a client needs to know before booking a treatment.',
  'Portrait, specialisms and booking with the right stylist.',
  'Address, hours and a booking link for every studio.',
  'Vouchers and memberships, presented as beautifully as the salon.',
];
const BASE_W = 640; // mockups are designed at 640 × 500 and scaled to fit
const BASE_H = 500;

export default function Concepts() {
  const root = useRef();

  useGSAP(() => {
    const q = gsap.utils.selector(root);
    const cards = q('.cf-card');
    const items = q('.cf-item');
    const stage = q('.cf-stage')[0];
    const n = cards.length;
    const deck = () => window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)').matches;

    // size every card: desktop = fit the stage, mobile = 84vw
    const size = () => {
      const r = stage.getBoundingClientRect();
      const W = deck()
        ? Math.min(r.width * 0.78, (r.height - 56) * (BASE_W / BASE_H))
        : Math.min(window.innerWidth * 0.84, 560);
      const sc = W / BASE_W;
      const H = BASE_H * sc + 56;
      cards.forEach((c) => {
        c.style.width = `${W}px`;
        c.style.height = `${H}px`;
        c.style.top = deck() ? `${Math.max(0, (r.height - H) / 2)}px` : '';
        c.style.setProperty('--s', sc);
      });
    };
    size();
    window.addEventListener('resize', size);

    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      let active = -1;
      const layout = (p) => {
        const W = cards[0].offsetWidth;
        const H = cards[0].offsetHeight;
        cards.forEach((c, i) => {
          const d = i - p;
          const meta = c.querySelector('.cf-meta');
          gsap.set(meta, { opacity: gsap.utils.clamp(0, 1, 1 - Math.abs(d) * 3) });
          if (d < 0) {
            // lifts up and turns away behind the reader — never over the index on the left
            const t = Math.min(-d, 1);
            gsap.set(c, { x: -W * 0.1 * t, y: -H * 0.12 * t, xPercent: 0, yPercent: 0, rotateY: 28 * t, rotateX: 14 * t, rotateZ: 0,
              scale: 1 - 0.1 * t, z: 0, opacity: gsap.utils.clamp(0, 1, 1 - t * 2.2), zIndex: 200 });
          } else {
            // waiting in the stack behind
            gsap.set(c, { x: W * 0.12 * d, y: 0, xPercent: 0, yPercent: 0, rotateY: -d * 6, rotateX: 0, rotateZ: 0, scale: 1 - d * 0.06, z: -d * 60,
              opacity: d > 3 ? 0 : 1 - Math.max(0, d - 0.15) * 0.18, zIndex: 100 - Math.round(d * 10) });
          }
        });
        const idx = Math.round(p);
        if (idx !== active) {
          active = idx;
          items.forEach((it, i) => it.classList.toggle('on', i === idx));
          q('.cf-count b')[0].textContent = String(idx + 1).padStart(2, '0');
        }
        gsap.set(q('.cf-progress i'), { scaleX: p / (n - 1) });
      };
      layout(0);
      // Each card "holds" for the middle of its scroll segment, then eases to the next one.
      // (No ScrollTrigger snap — it fights Lenis smooth scrolling and causes jumps.)
      const hold = (p) => {
        const i = Math.min(Math.floor(p), n - 2);
        const t = gsap.utils.clamp(0, 1, (p - i - 0.18) / 0.64);
        return i + t * t * (3 - 2 * t);
      };
      const st = { p: 0 };
      const tw = gsap.to(st, {
        p: n - 1, ease: 'none',
        onUpdate: () => layout(hold(st.p)),
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: `+=${(n - 1) * 90}%`, pin: q('.cf-pin')[0], scrub: 0.9,
        },
      });
      // the list doubles as navigation
      const offs = items.map((it, i) => {
        const h = () => {
          const t = tw.scrollTrigger;
          getLenis()?.scrollTo(t.start + ((t.end - t.start) * i) / (n - 1), { duration: 1.2 });
        };
        it.addEventListener('click', h);
        return () => it.removeEventListener('click', h);
      });
      return () => offs.forEach((o) => o());
    });
    return () => window.removeEventListener('resize', size);
  }, { scope: root });

  return (
    <section className="concepts" ref={root} aria-labelledby="concepts-title">
      <div className="cf-pin">
        <div className="cf-side">
          <SecHead n="04" label={concepts.label} lines={concepts.heading} id="concepts-title" size="d-s" />
          <ol className="cf-list">
            {concepts.items.map((t, i) => (
              <li key={t}>
                <button type="button" className={`cf-item ${i === 0 ? 'on' : ''}`}>
                  <span className="cf-n mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cf-t serif">{t}</span>
                  <span className="cf-d">{BLURBS[i]}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="cf-foot">
            <span className="cf-count mono"><b>01</b> / {String(concepts.items.length).padStart(2, '0')}</span>
            <span className="cf-progress"><i /></span>
          </div>
          <p className="cf-note mono">{concepts.note}</p>
        </div>
        <div className="cf-stage" data-cursor="Scroll">
          {MOCKS.map((M, i) => (
            <figure className="cf-card" key={concepts.items[i]} style={{ margin: 0 }}>
              <div className="cf-frame">
                <div className="cf-bar"><i /><i /><i /><span>{N.toLowerCase().replace(' ', '')}.co.uk</span></div>
                <M />
              </div>
              <figcaption className="cf-meta">
                <span className="serif">{concepts.items[i]}</span>
                <span className="concept-tag mono">Illustrative concept</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
