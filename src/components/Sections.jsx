import { useRef, useState } from 'react';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import { img } from '../lib/asset.js';
import { beyond, why, process, faqs, cta } from '../content.js';
import { SecHead, SecLabel, Lines } from './common.jsx';
import { goTo } from './Chrome.jsx';
import { track } from '../lib/track.js';

/* ------------------------------------------------------------------ Beyond the website */
// Illustrative CRM data (fictional salon, fictional clients)
const STYLISTS = ['Amara', 'Jess', 'Priya'];
const TIMES = ['9:00', '10:00', '11:00', '12:00'];
const BOOKINGS = [ // [stylist, start slot (30 min), length, service, client, tone]
  [0, 0, 4, 'Balayage', 'Sophie R.', 'gold'],
  [0, 5, 2, 'Gloss', 'Ava T.', ''],
  [1, 0, 2, 'Cut & finish', 'Ella M.', ''],
  [1, 3, 3, 'Keratin', 'Maya K.', 'gold'],
  [2, 1, 2, 'Blow-dry', 'Hannah L.', ''],
  [2, 4, 3, 'Colour', 'Isla P.', ''],
];
const BRANCHES = [['Marylebone', 142], ['Chelsea', 118], ['Notting Hill', 96], ['Richmond', 74]];

export function Beyond() {
  const root = useRef();
  useGSAP(() => {
    const q = gsap.utils.selector(root);
    // On narrow screens render the dashboard at its desktop size and zoom it down to fit, so nothing gets cramped.
    const stageEl = q('.crm-stage')[0];
    const tiltEl = q('.crm-tilt')[0];
    const fit = () => {
      const w = stageEl.clientWidth;
      const z = w < 720 ? w / 720 : 1;
      Object.assign(tiltEl.style, z < 1 ? { width: '720px', height: '520px', zoom: z } : { width: '', height: '', zoom: '' });
      stageEl.style.height = z < 1 ? `${520 * z}px` : '';
    };
    fit();
    window.addEventListener('resize', fit);
    if (reducedMotion()) return () => window.removeEventListener('resize', fit);
    gsap.fromTo(q('.crm-scene'), { rotateX: 28, rotateY: -30, y: 80 }, {
      rotateX: 8, rotateY: -9, y: 0, ease: 'none',
      scrollTrigger: { trigger: q('.crm-stage')[0], start: 'top bottom', end: 'center center', scrub: 1 },
    });
    q('.glass, .g-toast').forEach((g, i) => {
      gsap.from(g, { opacity: 0, z: -200, duration: 1.4, delay: i * 0.12, ease: 'expo.out', scrollTrigger: { trigger: q('.crm-stage')[0], start: 'top 75%' } });
    });
    gsap.from(q('.crm-mod'), { opacity: 0, y: 40, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: q('.crm-modules')[0], start: 'top 85%' } });

    const stage = q('.crm-stage')[0];
    const ry = gsap.quickTo(q('.crm-tilt')[0], 'rotateY', { duration: 1, ease: 'power3' });
    const rx = gsap.quickTo(q('.crm-tilt')[0], 'rotateX', { duration: 1, ease: 'power3' });
    const move = (e) => {
      const r = stage.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 14);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
    };
    stage.addEventListener('pointermove', move);
    return () => { stage.removeEventListener('pointermove', move); window.removeEventListener('resize', fit); };
  }, { scope: root });

  return (
    <section className="section beyond" id="beyond" ref={root} aria-labelledby="beyond-title">
      <div className="wrap">
        <div className="beyond-grid">
          <div>
            <SecHead n="05" label={beyond.label} lines={beyond.heading} size="d-s" id="beyond-title" />
            <p className="lede" style={{ marginTop: -40 }}>{beyond.body}</p>
            <div style={{ marginTop: 36 }}>
              <a href="#review" className="btn light" onClick={(e) => { track('uksalons_crm_interest_click', { cta_label: beyond.cta }); goTo(e, 'review'); }}>
                {beyond.cta}<span className="arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="crm-stage" aria-hidden="true">
            <div className="crm-tilt" style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
              <div className="crm-scene">
                {/* Today's diary */}
                <div className="glass g-diary">
                  <div className="g-head"><span className="mono">Appointments</span><span className="g-sub">Today · Marylebone</span></div>
                  <div className="diary">
                    <div className="diary-times">{TIMES.map((t) => <span key={t}>{t}</span>)}</div>
                    {STYLISTS.map((name, si) => (
                      <div className="diary-col" key={name}>
                        <div className="diary-name">{name}</div>
                        <div className="diary-slots">
                          {BOOKINGS.filter((b) => b[0] === si).map(([, st, len, svc, client, tone]) => (
                            <div key={svc + client} className={`appt ${tone}`} style={{ gridRow: `${st + 1} / span ${len}` }}>
                              <b>{svc}</b><span>{client}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client profile */}
                <div className="glass g-client">
                  <div className="g-head"><span className="mono">Client profile</span></div>
                  <div className="client-row">
                    <div className="client-av" style={{ backgroundImage: `url(${img('avatar.webp')})` }} />
                    <div><div className="client-name serif">Sophie Rowe</div><div className="g-sub">Signature member · since 2021</div></div>
                  </div>
                  <div className="client-stats">
                    <div><b>24</b><span>Visits</span></div>
                    <div><b>6 wks</b><span>Rebook cycle</span></div>
                    <div><b>Amara</b><span>Stylist</span></div>
                  </div>
                  <div className="client-tags"><span>Balayage</span><span>Prefers mornings</span><span>Patch test ✓</span></div>
                </div>

                {/* Branches */}
                <div className="glass g-branch">
                  <div className="g-head"><span className="mono">Bookings by branch</span><span className="g-sub">This week</span></div>
                  <div className="branches">
                    {BRANCHES.map(([name, v], i) => (
                      <div className="br" key={name}>
                        <span className="br-name">{name}</span>
                        <span className="br-bar"><i style={{ width: `${(v / 150) * 100}%` }} className={i === 0 ? 'top' : ''} /></span>
                        <span className="br-v">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loyalty */}
                <div className="glass g-loyal">
                  <div className="g-head"><span className="mono">Loyalty</span><span className="g-sub">Signature tier</span></div>
                  <div className="loyal-pts serif">1,240 <small>/ 1,500 pts</small></div>
                  <div className="loyal-bar"><i /></div>
                  <div className="g-sub" style={{ marginTop: 10 }}>Next reward · complimentary gloss</div>
                </div>

                {/* Automated reminder */}
                <div className="g-toast">
                  <span className="toast-dot" />
                  <div><b>Reminder sent</b><span>Ella M. · tomorrow, 9:00</span></div>
                </div>
              </div>
            </div>
            <p className="crm-note mono">{beyond.note}</p>
          </div>
        </div>
        <div className="crm-modules">
          {beyond.modules.map(([t, d]) => (
            <div className="crm-mod" key={t}><h3 className="crm-h">{t}</h3><p>{d}</p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Why */
export function Why() {
  const root = useRef();
  useGSAP(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    // words start hidden and surface one by one, out of a soft blur, as you scroll
    gsap.to(q('.statement .w'), {
      opacity: 1, filter: 'blur(0px)', y: 0, stagger: 0.06, force3D: true, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: q('.statement')[0], start: 'top 85%', end: 'bottom 50%', scrub: 1 },
    });
    gsap.fromTo(q('.why-img img'), { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(q('.why-img'), { clipPath: 'inset(100% 0 0 0 round 999px 999px 6px 6px)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: q('.why-img')[0], start: 'top 80%' } });
  }, { scope: root });

  return (
    <section className="section why" ref={root} aria-labelledby="why-title" style={{ paddingBottom: 0 }}>
      <div className="wrap why-grid">
        <div className="why-img"><img src={img('why-curls.webp')} alt="Salon client with defined natural curls and a soft glow" loading="lazy" /></div>
        <div>
          <SecLabel n="06">{why.label}</SecLabel>
          <h2 className="serif d-s" id="why-title" style={{ margin: '0 0 34px' }}><Lines lines={why.heading} /></h2>
          <p className="statement">
            {why.statement.split(' ').map((w, i) => <span className="w" key={i}>{w}</span>)}
          </p>
          <div style={{ marginTop: 40 }}>
            <a href="#review" className="btn" onClick={(e) => goTo(e, 'review', cta.discuss, 'why')}>{cta.discuss}<span className="arrow" aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-inner">
          {[...why.marquee, ...why.marquee].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Process */
export function Process() {
  const root = useRef();
  useGSAP(() => {
    const q = gsap.utils.selector(root);
    if (reducedMotion()) { q('.proc-step').forEach((s) => s.classList.add('on')); return; }
    gsap.to(q('.proc-line i'), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: q('.proc-list')[0], start: 'top 60%', end: 'bottom 60%', scrub: true } });
    q('.proc-step').forEach((s) => {
      gsap.from(s, { opacity: 0.25, x: 30, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 75%', toggleClass: 'on' } });
    });
  }, { scope: root });

  return (
    <section className="section process" id="process" ref={root} aria-labelledby="process-title">
      <div className="wrap proc">
        <div className="proc-sticky">
          <SecHead n="07" label={process.label} lines={process.heading} size="d-s" id="process-title">
            <p className="lede" style={{ marginTop: 26 }}>Clear phases, agreed checkpoints and your approval before anything goes live. You’ll always know what we need from you, and what happens next.</p>
          </SecHead>
        </div>
        <div className="proc-list">
          <div className="proc-line" aria-hidden="true"><i /></div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {process.steps.map(([t, d], i) => (
              <li className="proc-step" key={t}>
                <span className="n mono">Phase 0{i + 1}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */
function FaqItem({ q, a, i, open, onToggle }) {
  const body = useRef();
  useGSAP(() => {
    gsap.to(body.current, { height: open ? 'auto' : 0, duration: reducedMotion() ? 0 : 0.7, ease: 'expo.inOut' });
  }, { dependencies: [open] });
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <h3 style={{ margin: 0 }}>
        <button className="faq-q" aria-expanded={open} aria-controls={`faq-${i}`} id={`faq-btn-${i}`} onClick={onToggle}>
          {q}<span className="ic" aria-hidden="true" />
        </button>
      </h3>
      <div id={`faq-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className="faq-a" ref={body} inert={!open}>
        <p>{a}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section" id="faqs" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <SecHead n="08" label={faqs.label} lines={faqs.heading} size="d-s" id="faq-title" />
        <div>
          {faqs.items.map(([q, a], i) => (
            <FaqItem key={q} q={q} a={a} i={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          mainEntity: faqs.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        }) }}
      />
    </section>
  );
}
