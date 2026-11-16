import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { gsap, useGSAP, reducedMotion } from '../lib/motion.js';
import { shears } from '../three/shearsState.js';
import { img } from '../lib/asset.js';
import { track, utm } from '../lib/track.js';
import { closing, form as F, site, cta } from '../content.js';
import { Lines, SecLabel } from './common.jsx';

const urlish = (v) => {
  try { const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`); return u.hostname.includes('.'); } catch { return false; }
};

const schema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  salon: z.string().trim().min(1, 'Please enter your salon or business name.'),
  noSite: z.boolean(),
  website: z.string().trim().optional(),
  email: z.string().trim().min(1, 'Please enter your work email.').email('Please enter a valid email address, e.g. name@yoursalon.co.uk.'),
  phone: z.string().trim().refine((v) => !v || /^[+\d][\d\s()-]{7,}$/.test(v), 'Please enter a valid phone number, or leave it blank.'),
  locations: z.string().min(1, 'Please choose the number of locations.'),
  team: z.string().min(1, 'Please choose your team size.'),
  budget: z.string().min(1, 'Please choose a budget range.'),
  launch: z.string().trim().max(60, 'Please keep this short, e.g. March 2027.'),
  improve: z.array(z.string()),
  notes: z.string().max(2000, 'Please keep this under 2,000 characters.'),
  privacy: z.boolean().refine((v) => v, 'Please confirm you have read the privacy notice.'),
  marketing: z.boolean(),
  company: z.string(), // honeypot
}).superRefine((d, ctx) => {
  if (!d.noSite && !urlish(d.website || '')) {
    ctx.addIssue({ code: 'custom', path: ['website'], message: d.website ? 'Please enter a valid website address, e.g. www.yoursalon.co.uk.' : 'Please enter your website, or tick “I’m planning a new website”.' });
  }
});

const defaults = {
  name: '', salon: '', noSite: false, website: '', email: '', phone: '', locations: '', team: '',
  budget: '', launch: '', improve: [], notes: '', privacy: false, marketing: false, company: '',
};

function Err({ id, msg }) {
  return msg ? <span className="err" id={id} role="alert">{msg}</span> : null;
}

function LeadForm() {
  const [state, setState] = useState({ status: 'idle', ref: '', error: '' });
  const started = useRef(false);
  const { register, handleSubmit, watch, setError, setFocus, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema), defaultValues: defaults, mode: 'onTouched', shouldFocusError: true,
  });
  const noSite = watch('noSite');
  const a11y = (k) => ({ 'aria-invalid': errors[k] ? 'true' : 'false', 'aria-describedby': errors[k] ? `e-${k}` : undefined });

  const onStart = () => {
    if (started.current) return;
    started.current = true;
    track('uksalons_form_start', { form_version: site.formVersion });
  };

  const onSubmit = async (data) => {
    setState({ status: 'idle', ref: '', error: '' });
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          formVersion: site.formVersion,
          meta: { path: window.location.pathname, referrer: document.referrer || '', utm: utm() },
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) {
        track('uksalons_form_submit', { form_version: site.formVersion, service_need: data.improve.join('|'), location_count: data.locations, budget: data.budget });
        track('uksalons_form_success', { submission_ref: out.ref });
        setState({ status: 'done', ref: out.ref, error: '' });
        return;
      }
      if (res.status === 422 && out.fields) {
        Object.entries(out.fields).forEach(([k, m]) => setError(k, { message: m }));
        setFocus(Object.keys(out.fields)[0]);
        track('uksalons_form_error', { error_category: 'validation' });
        return;
      }
      track('uksalons_form_error', { error_category: res.status === 429 ? 'rate_limited' : 'server' });
      setState({ status: 'error', ref: '', error: out.message || 'Something went wrong on our side and your request was not sent.' });
    } catch {
      track('uksalons_form_error', { error_category: 'network' });
      setState({ status: 'error', ref: '', error: 'We couldn’t reach our server. Please check your connection and try again.' });
    }
  };

  if (state.status === 'done') {
    return (
      <div className="success" role="status" aria-live="polite" tabIndex={-1} ref={(el) => el?.focus()}>
        <div className="tick"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
        <h3>{closing.successTitle}</h3>
        <p>{closing.success}</p>
        <p className="mono" style={{ fontSize: 10 }}>Reference: {state.ref}</p>
        <p>Need to add something? Email <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <p style={{ marginTop: 30 }}><a href="#top" className="link-u">Back to the top ↑</a></p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} onFocus={onStart} aria-describedby="req-note">
      <h3>{closing.formTitle}</h3>
      <p className="req-note" id="req-note">{closing.formSub}</p>

      {state.status === 'error' && (
        <div className="form-error" role="alert">
          {state.error} Your details are still here — please try again, or email us at <a href={`mailto:${site.email}`}>{site.email}</a>.
        </div>
      )}

      <div className="row2">
        <div className="field">
          <label htmlFor="f-name">Your name *</label>
          <input id="f-name" autoComplete="name" {...register('name')} {...a11y('name')} />
          <Err id="e-name" msg={errors.name?.message} />
        </div>
        <div className="field">
          <label htmlFor="f-salon">Salon / business name *</label>
          <input id="f-salon" autoComplete="organization" {...register('salon')} {...a11y('salon')} />
          <Err id="e-salon" msg={errors.salon?.message} />
        </div>
      </div>

      <div className="field" style={{ marginBottom: 10 }}>
        <label htmlFor="f-web">Business website {noSite ? '' : '*'}</label>
        <input id="f-web" type="url" inputMode="url" autoComplete="url" placeholder="www.yoursalon.co.uk" disabled={noSite} {...register('website')} {...a11y('website')} />
        <Err id="e-website" msg={!noSite && errors.website?.message} />
      </div>
      <label className="check" style={{ marginBottom: 24 }}>
        <input type="checkbox" {...register('noSite')} /> <span>I’m planning a new website</span>
      </label>

      <div className="row2">
        <div className="field">
          <label htmlFor="f-email">Work email *</label>
          <input id="f-email" type="email" autoComplete="email" {...register('email')} {...a11y('email')} />
          <Err id="e-email" msg={errors.email?.message} />
        </div>
        <div className="field">
          <label htmlFor="f-phone">Phone (optional)</label>
          <input id="f-phone" type="tel" autoComplete="tel" {...register('phone')} {...a11y('phone')} />
          <Err id="e-phone" msg={errors.phone?.message} />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="f-loc">Number of locations *</label>
          <select id="f-loc" {...register('locations')} {...a11y('locations')}>
            <option value="">Select</option>
            {F.locations.map((o) => <option key={o}>{o}</option>)}
          </select>
          <Err id="e-locations" msg={errors.locations?.message} />
        </div>
        <div className="field">
          <label htmlFor="f-team">Team size *</label>
          <select id="f-team" {...register('team')} {...a11y('team')}>
            <option value="">Select</option>
            {F.team.map((o) => <option key={o}>{o}</option>)}
          </select>
          <Err id="e-team" msg={errors.team?.message} />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="f-budget">Budget *</label>
          <select id="f-budget" {...register('budget')} {...a11y('budget')}>
            <option value="">Select</option>
            {F.budget.map((o) => <option key={o}>{o}</option>)}
          </select>
          <Err id="e-budget" msg={errors.budget?.message} />
        </div>
        <div className="field">
          <label htmlFor="f-launch">Ideal launch date (optional)</label>
          <input id="f-launch" placeholder="e.g. March 2027" {...register('launch')} {...a11y('launch')} />
          <Err id="e-launch" msg={errors.launch?.message} />
        </div>
      </div>

      <fieldset className="field" style={{ border: 0, padding: 0, margin: '0 0 24px' }}>
        <legend style={{ marginBottom: 12 }}>What you’re interested in</legend>
        <div className="chips">
          {F.improve.map((o) => (
            <label className="chip" key={o}><input type="checkbox" value={o} {...register('improve')} /><span>{o}</span></label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="f-notes">Anything else? (optional)</label>
        <textarea id="f-notes" {...register('notes')} {...a11y('notes')} />
        <Err id="e-notes" msg={errors.notes?.message} />
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-company">Company</label>
        <input id="f-company" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <label className="check">
        <input type="checkbox" {...register('privacy')} {...a11y('privacy')} />
        <span>I have read the <a href={site.privacyUrl} target="_blank" rel="noopener">privacy notice</a> and understand how my details will be used to respond to this request. *</span>
      </label>
      <Err id="e-privacy" msg={errors.privacy?.message} />
      <label className="check" style={{ margin: '14px 0 28px' }}>
        <input type="checkbox" {...register('marketing')} />
        <span>Send me occasional updates from {site.brand}. (Optional — you can unsubscribe at any time.)</span>
      </label>

      <button type="submit" className="btn solid" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : cta.final}<span className="arrow" aria-hidden="true">→</span>
      </button>
      <p className="under-btn">{closing.underButton}</p>
    </form>
  );
}

export default function Review() {
  const root = useRef();

  useGSAP(() => {
    if (reducedMotion()) return;
    const q = gsap.utils.selector(root);
    gsap.from(q('.closing-left .line > span'), { yPercent: 110, duration: 1.4, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 60%' } });
    gsap.fromTo(q('.closing-left .bg img'), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });

    // The shears return for the close (desktop only — on mobile the form needs the room).
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
      const b = shears.b;
      Object.assign(b, { x: -0.25, y: 1.6, size: 0.36, rx: 0.3, ry: -3, rz: -0.9, open: 0.1, snip: 0, o: 0, in: 1, spin: 0 });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top 75%', endTrigger: document.querySelector('.footer'), end: 'top 40%', scrub: 1.2 },
      });
      tl.to(b, { o: 1, duration: 0.3 }, 0)
        .to(b, { y: -0.5, x: -0.09, ry: 0.5, rz: -0.55, open: 0.35, duration: 1, ease: 'power2.out' }, 0)
        .to(b, { snip: 0.8, duration: 0.2 }, 0.9)
        .to(b, { ry: Math.PI * 2 + 0.5, duration: 2 }, 1)
        .to(b, { y: -1.6, o: 0, snip: 0, duration: 0.6, ease: 'power2.in' }, 3);
    });
  }, { scope: root });

  return (
    <section className="section closing" id="review" ref={root} aria-labelledby="closing-title">
      <div className="closing-grid">
        <div className="closing-left">
          <div className="bg" aria-hidden="true"><img src={img('review-salon.webp')} alt="" loading="lazy" /></div>
          <div>
            <SecLabel n="10">{closing.label}</SecLabel>
            <h2 className="serif d-m" id="closing-title" style={{ margin: 0 }}><Lines lines={closing.heading} /></h2>
            <p className="lede">{closing.body}</p>
            <p className="review-note">{closing.reviewNote}</p>
          </div>
          <p className="closing-contact mono">Prefer email? <a href={`mailto:${site.email}`}>{site.email}</a></p>
        </div>
        <div className="closing-right">
          <div className="form-card"><LeadForm /></div>
        </div>
      </div>
    </section>
  );
}
