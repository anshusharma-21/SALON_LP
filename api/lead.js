// Vercel serverless function: POST /api/lead
// PRD 7.2 / 10.3 — server-side validation, honeypot, rate limit, lead never silently lost.
//
// Environment variables (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY     – enables email delivery via Resend (https://resend.com)
//   LEAD_TO            – internal recipient (PRD default: ajay@automationlabs.online — confirm before launch)
//   LEAD_FROM          – verified sender, e.g. "AI Automation Labs <salons@automationlabs.online>"
//   LEAD_WEBHOOK_URL   – optional: CRM / Google Sheet / Make.com webhook that stores every lead first
//   SEND_ACK=true      – optional: short acknowledgement email to the prospect

const LOCATIONS = ['1', '2–3', '4–10', '11+', 'Planning expansion'];
const TEAM = ['1–4', '5–10', '11–25', '26–50', '50+'];
const IMPROVE = [
  'Website redesign', 'New website', 'Online booking', 'Multi-location website',
  'Gift vouchers / memberships', 'CRM / customer management', 'Automation', 'Other',
];
const PRIVACY_VERSION = 'privacy-2026-11';

// Best-effort in-memory limiter (per warm instance). Use Upstash/Vercel KV for strict limits.
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
function normUrl(v) {
  if (!v) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`);
    return u.hostname.includes('.') ? u.toString() : null;
  } catch { return null; }
}
function normUkPhone(v) {
  const d = v.replace(/[^\d+]/g, '');
  if (!d) return '';
  if (d.startsWith('+44')) return d;
  if (d.startsWith('0044')) return `+44${d.slice(4)}`;
  if (d.startsWith('0')) return `+44${d.slice(1)}`;
  return d;
}

export function validate(body) {
  const errors = {};
  const lead = {
    name: str(body.name, 120),
    salon: str(body.salon, 160),
    noSite: !!body.noSite,
    website: '',
    email: str(body.email, 200).toLowerCase(),
    phone: normUkPhone(str(body.phone, 40)),
    locations: str(body.locations, 40),
    team: str(body.team, 40),
    improve: Array.isArray(body.improve) ? body.improve.filter((x) => IMPROVE.includes(x)) : [],
    notes: str(body.notes, 2000),
    privacy: body.privacy === true,
    marketing: body.marketing === true,
  };
  if (!lead.name) errors.name = 'Please enter your name.';
  if (!lead.salon) errors.salon = 'Please enter your salon or business name.';
  if (!lead.noSite) {
    const u = normUrl(str(body.website, 300));
    if (!u) errors.website = 'Please enter a valid website address, or tick “I’m planning a new website”.';
    else lead.website = u;
  }
  if (!isEmail(lead.email)) errors.email = 'Please enter a valid work email.';
  if (!LOCATIONS.includes(lead.locations)) errors.locations = 'Please choose the number of locations.';
  if (!TEAM.includes(lead.team)) errors.team = 'Please choose your team size.';
  if (!lead.privacy) errors.privacy = 'Please confirm you have read the privacy notice.';
  return { lead, errors };
}

async function sendEmail({ to, subject, text, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEAD_FROM || 'AI Automation Labs <onboarding@resend.dev>',
      to: [to], subject, text, reply_to: replyTo,
    }),
  });
  if (!r.ok) throw new Error(`Email failed: ${r.status}`);
  return { sent: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  // Honeypot: bots fill the hidden "company" field. Pretend success, store nothing.
  if (body.company) return res.status(200).json({ ok: true, ref: 'UKS-0' });

  // Behind the Cloudflare Worker every request arrives from Cloudflare, so use the visitor IP it passes on.
  const ip = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (limited(ip)) return res.status(429).json({ ok: false, error: 'rate', message: 'Too many requests. Please try again shortly.' });

  const { lead, errors } = validate(body);
  if (Object.keys(errors).length) return res.status(422).json({ ok: false, error: 'validation', fields: errors });

  const ref = `UKS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const meta = body.meta && typeof body.meta === 'object' ? body.meta : {};
  const record = {
    ref,
    ...lead,
    consent: { privacyAcknowledged: lead.privacy, privacyVersion: PRIVACY_VERSION, marketingOptIn: lead.marketing },
    attribution: {
      path: str(meta.path, 300), referrer: str(meta.referrer, 500),
      utm: Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
        .map((k) => [k, str(meta.utm?.[k], 200)])),
    },
    formVersion: str(body.formVersion, 40),
    submittedAt: new Date().toISOString(),
  };

  // 1) Store first, so a failed email never loses the lead (PRD 10.3).
  let stored = false;
  if (process.env.LEAD_WEBHOOK_URL) {
    try {
      const r = await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(record),
      });
      stored = r.ok;
    } catch (e) { console.error('[lead] webhook failed', ref, e.message); }
  }
  console.log('[lead]', JSON.stringify(record)); // Always in function logs as a last-resort record.

  // 2) Internal notification.
  const lines = [
    `New UK salon website review request — ${ref}`, '',
    `Name: ${lead.name}`, `Salon: ${lead.salon}`,
    `Website: ${lead.noSite ? 'Planning a new website' : lead.website}`,
    `Email: ${lead.email}`, `Phone: ${lead.phone || '—'}`,
    `Locations: ${lead.locations}`, `Team size: ${lead.team}`,
    `Wants to improve: ${lead.improve.join(', ') || '—'}`, '', `Notes: ${lead.notes || '—'}`, '',
    `Marketing opt-in: ${lead.marketing ? 'Yes' : 'No'} · Privacy notice: ${PRIVACY_VERSION}`,
    `Source: ${record.attribution.utm.utm_source || '—'} / ${record.attribution.utm.utm_campaign || '—'}`,
    `Referrer: ${record.attribution.referrer || '—'}`,
  ];
  try {
    await sendEmail({
      to: process.env.LEAD_TO || 'ajay@automationlabs.online',
      subject: `Salon website review: ${lead.salon} (${lead.locations} location${lead.locations === '1' ? '' : 's'})`,
      text: lines.join('\n'),
      replyTo: lead.email,
    });
  } catch (e) {
    console.error('[lead] ALERT internal email failed', ref, e.message, 'stored:', stored);
  }

  // 3) Optional short, transactional acknowledgement.
  if (process.env.SEND_ACK === 'true') {
    sendEmail({
      to: lead.email,
      subject: 'We’ve received your website review request',
      text: `Hello ${lead.name},\n\nThank you — we’ve received your request for ${lead.salon}. We’ll review the details you shared and be in touch.\n\nReference: ${ref}\n\nAI Automation Labs`,
    }).catch((e) => console.error('[lead] ack failed', ref, e.message));
  }

  return res.status(200).json({ ok: true, ref });
}
