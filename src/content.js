// All page copy lives here (PRD FR-08: editable without touching components).
// Source: "UK Luxury Salons — Final Page Copy & Sales Reference" (14 Nov 2026). Paste-as-written copy.

export const site = {
  company: 'AI Automation Labs LLP',
  brand: 'AI Automation Labs',
  website: 'https://automationlabs.online',
  email: 'info@automationlabs.online',
  privacyUrl: '/privacy',
  termsUrl: '/terms',
  // PRD 10.4: optional, never invented. Set to an approved Calendly/booking URL to enable.
  bookingUrl: null,
  // Relative to the deploy base, so it reaches this project's function at /uksalons/api/lead.
  formEndpoint: `${import.meta.env.BASE_URL}api/lead`,
  formVersion: 'uksalons-v2',
  legal: '© 2026 AI Automation Labs LLP',
};

export const nav = [
  { id: 'experience', label: 'The Experience' },
  { id: 'build', label: 'What We Build' },
  { id: 'beyond', label: 'Beyond the Website' },
  { id: 'process', label: 'Our Process' },
  { id: 'investment', label: 'Investment' },
  { id: 'faqs', label: 'FAQs' },
];

export const cta = {
  header: 'Free review',
  primary: 'Request your complimentary review',
  primaryShort: 'Request a review',
  secondary: 'See What We Can Build',
  discuss: 'Discuss your salon website',
  final: 'Request my review',
};

export const hero = {
  eyebrow: 'Automation Labs · For Salons',
  titleLines: ['Your salon is', 'exceptional in person.', 'Your website', 'should be too.'],
  italicFrom: 2,
  body:
    'Bespoke websites for the UK’s finest salons and salon groups. Your treatments, team and booking, presented with the same care your clients feel in the chair.',
  trust: ['Bespoke design', 'Live in 8–12 working days', 'From £1,000'],
};

export const value = [
  'A more considered first impression.',
  'A clearer path to booking.',
  'A digital foundation that can grow with your salon.',
];

export const problems = {
  label: 'The Experience',
  heading: ['When your salon experience is premium,', 'your website should be too.'],
  items: [
    {
      title: 'Your website no longer looks like your salon',
      body: 'You’ve refined the interiors, the team and the menu. Your website still shows the salon you were five years ago.',
      img: 'pr-dated-salon.webp',
    },
    {
      title: 'Your best treatments are hard to find',
      body: 'Colour, bridal and signature services deserve to be presented, not buried in a price list. Clients should see why you’re worth it in seconds.',
      img: 'pr-colour-foils-work.webp',
    },
    {
      title: 'Booking takes too many taps',
      body: 'Every extra step between “I want this” and “booked” loses you a client. It should take three taps, not ten.',
      img: 'pr-reception.webp',
    },
    {
      title: 'Your locations feel like different brands',
      body: 'One brand, every salon. Clients find the nearest location, the right stylist and the right service, wherever they start.',
      img: 'pr-group-floor.webp',
    },
  ],
};

export const journey = {
  label: 'Moments',
  heading: ['From first impression', 'to confirmed appointment.'],
  steps: [
    { title: 'Discover', body: 'She hears your name from a friend, or finds you on Instagram or Google.', img: 'jr-discover.webp' },
    { title: 'Explore', body: 'She browses your treatments and stylists, and understands what makes you different.', img: 'jr-explore.webp' },
    { title: 'Build confidence', body: 'She sees your real work, real reviews and the people behind the chair.', img: 'jr-confidence.webp' },
    { title: 'Take action', body: 'She books in a few taps, straight into the system your team already uses.', img: 'jr-action.webp' },
    { title: 'Stay connected', body: 'She comes back, with gentle reminders, rebooking prompts and a reason to return.', img: 'jr-connected.webp' },
  ],
};

export const capabilities = {
  label: 'What We Build',
  heading: ['Every page,', 'designed around your clients.'],
  items: [
    { title: 'Premium homepage', body: 'A first impression that sets your price before a client sees it.', img: 'cap-homepage.webp' },
    { title: 'Treatment & service pages', body: 'Your signature services, presented like a fine menu, with the detail clients need to book with confidence.', img: 'cap-treatments.webp' },
    { title: 'Team & stylist profiles', body: 'Introduce your artists. Clients choose their stylist and book with them directly.', img: 'cap-team.webp' },
    { title: 'Work & gallery', body: 'Your best work, beautifully shown, by service and by stylist.', img: 'cap-gallery.webp' },
    { title: 'Reviews & testimonials', body: 'Real words from real clients, presented with the elegance they deserve.', img: 'cap-reviews.webp' },
    { title: 'Online booking', body: 'Seamless booking through the platform you already use, from every page.', img: 'cap-booking.webp' },
    { title: 'Gift vouchers & packages', body: 'Vouchers and packages that sell themselves, all year round.', img: 'cap-vouchers.webp' },
    { title: 'Membership & loyalty', body: 'Turn regulars into members, with a programme presented as beautifully as your salon.', img: 'cap-membership.webp' },
    { title: 'Locations', body: 'A page for every salon: hours, map, team and booking, under one brand.', img: 'cap-locations.webp' },
    { title: 'Enquiries', body: 'Bridal, events and consultation enquiries, delivered straight to the right person.', img: 'cap-enquiry.webp' },
    { title: 'Found on Google', body: 'Found first by clients searching for a premium salon near them.', img: 'cap-seo.webp' },
    { title: 'Insight', body: 'Know exactly where your bookings come from, and what’s working.', img: 'cap-analytics.webp' },
  ],
};

export const lookbook = {
  heading: ['Your work,', 'beautifully shown.'],
  note: 'How your work could look',
  tiles: [
    ['lb-cut.webp', 'Precision cut'], ['lb-colour.webp', 'Colour'], ['lb-blowdry.webp', 'Blow-dry'],
    ['lb-bridal.webp', 'Bridal'], ['lb-balayage.webp', 'Balayage'], ['lb-extensions.webp', 'Extensions'],
    ['lb-ritual.webp', 'Hair rituals'], ['lb-updo.webp', 'Up-dos'], ['lb-natural.webp', 'Natural hair'],
    ['lb-manicure.webp', 'Manicure'], ['lb-studio.webp', 'The studio'], ['lb-facial.webp', 'Facials'],
  ],
};

export const concepts = {
  label: 'Concepts',
  heading: ['See what your salon', 'could look like.'],
  note: 'Concept designs for Maison Ondine, an imagined salon.',
  tag: 'Concept',
  salonName: 'Maison Ondine',
  items: ['Homepage', 'Treatment page', 'Stylist page', 'Location page', 'Gift voucher & membership'],
  blurbs: [
    'The first impression: your story, your signature services, and booking one tap away.',
    'Everything she needs to say yes: the experience, the result, the price.',
    'Your artists, their specialisms, and a direct line to their chair.',
    'Each salon with its own character, team and booking, under one name.',
    'Vouchers and memberships, presented as beautifully as the salon.',
  ],
};

// New: sits directly after Concepts.
export const proof = {
  eyebrow: 'In the salon',
  line: 'We don’t just design for salons. We built the client management system that runs GlamLuxe, a luxury salon, day to day.',
  link: 'Ask how we work',
};

export const beyond = {
  label: 'Beyond the Website',
  heading: ['When you’re ready,', 'we can run the back of house too.'],
  body:
    'Your website is the front door. Behind it, our Salon CRM brings clients, appointments, staff, payments and loyalty into one calm, connected view, across every location.',
  cta: 'Ask about Salon CRM',
  note: 'Optional · Available after launch',
  modules: ['Client profiles', 'Appointments', 'Staff', 'Payments', 'Inventory', 'Loyalty', 'Marketing', 'Multi-location', 'Reporting'],
};

export const why = {
  label: 'Why Automation Labs',
  heading: ['A digital partner', 'beyond the launch date.'],
  statement:
    'Most agencies hand over a website and walk away. We also build the software that runs salons, so your website is designed to grow with your business, not sit beside it.',
  marquee: ['Website development', 'Salon CRM', 'Custom software', 'Business automation', 'Booking integrations', 'SEO foundations', 'Analytics'],
};

export const process = {
  label: 'Our Process',
  heading: ['Considered at every step.', 'Live in 8 to 12 days.'],
  intro:
    'Six clear phases, your approval at every checkpoint, and a launch date agreed on day one. You’ll always know what we need from you, and what happens next.',
  steps: [
    ['Discover', 'Day 1.', 'A private call to understand your salon, your clients and what success looks like.'],
    ['Plan', 'Day 2.', 'We agree the pages, the booking set-up and exactly what we need from you.'],
    ['Design', 'Days 3–5.', 'Your design direction, presented for your feedback and approval.'],
    ['Build', 'Days 5–9.', 'Every page built, your booking connected, your treatments and team in place.'],
    ['Review & launch', 'Days 9–12.', 'You review it on phone and desktop. We refine, test everything, and go live.'],
    ['Improve', 'After launch.', '30 days of aftercare included, then ongoing care whenever you want it.'],
  ],
  small: 'Timelines run from receipt of your content. Salon groups typically launch on day 12.',
};

// New section.
export const investment = {
  label: 'Investment',
  heading: ['A considered investment,', 'quoted before we begin.'],
  intro: 'Every salon is different, so every project is scoped to you. As a guide:',
  tiers: [
    {
      name: 'Atelier', price: 'From £1,000',
      for: 'The independent salon ready to look the part',
      includes: 'Bespoke homepage and up to 5 pages, booking link, mobile-first build',
      live: '8 working days',
    },
    {
      name: 'Maison', price: 'From £3,500',
      for: 'The established salon with a full treatment menu',
      includes: 'Up to 12 bespoke pages, treatment and stylist pages, integrated booking, gift vouchers',
      live: '10 working days',
    },
    {
      name: 'Flagship', price: '£6,000–£10,000',
      for: 'Salon groups and multi-location brands',
      includes: 'Unlimited pages, a page per location, membership and loyalty, booking analytics',
      live: '12 working days',
    },
  ],
  under: 'Every project includes 30 days of aftercare. A fixed quote follows your complimentary review, with no obligation.',
};

export const faqs = {
  label: 'FAQs',
  heading: ['Questions salon owners', 'usually ask.'],
  side: {
    title: 'Still have a question?',
    body: 'Ask us anything about your salon’s website, booking journey or CRM, and we’ll answer it in your complimentary review.',
  },
  items: [
    ['How much does a salon website cost?', 'Projects range from £1,000 to £10,000, depending on pages, locations and integrations. After your complimentary review, you receive a fixed quote, so there are no surprises.'],
    ['How long does it take?', 'Most salons are live in 8 to 12 working days. We agree your launch date on day one and keep to it, from the moment we receive your content.'],
    ['Can you work with our existing booking system?', 'Yes. We connect your website to the booking platform your team already uses, so clients book without ever leaving your brand.'],
    ['We already have a website. Do we start from scratch?', 'Not necessarily. We keep what works, including your domain, content and Google rankings, and redesign the rest.'],
    ['We have several salons. Can you handle that?', 'Yes. Our Flagship projects are built for salon groups, with a page, team and booking link for every location under one consistent brand.'],
    ['Who provides the photos and content?', 'You share your treatment menu, prices, team details and images. We write and polish every word on the site. If your photography needs refreshing, we give you a shot list and art direction for your photographer.'],
    ['How many rounds of changes do we get?', 'Two rounds of feedback on the design, and one on the finished site before launch. Most salons need fewer.'],
    ['Do we need the Salon CRM?', 'No. Your website stands on its own. The CRM is there if you later want clients, appointments and payments in one place.'],
    ['What happens after launch?', 'Every project includes 30 days of aftercare and a walkthrough so your team can update the site themselves. Ongoing care is available whenever you want it.'],
    ['How does payment work?', '50% to begin and 50% at launch, in pounds sterling.'],
    ['Who owns the website?', 'You do. Once the final invoice is paid, the design, content and domain are entirely yours.'],
  ],
};

export const closing = {
  label: 'Complimentary website review',
  heading: ['Let’s make', 'your website', 'worthy of your salon.'],
  body:
    'Tell us about your salon. Within two working days, we’ll send a personal review of your website with three ideas to make it work harder, and an indicative quote.',
  reviewNote: 'Complimentary, personal and with no obligation.',
  formTitle: 'Request your complimentary review',
  formSub: 'Fields marked * are required. It takes about two minutes.',
  underButton: 'We reply to every request within one working day.',
  successTitle: 'Thank you.',
  success:
    'Your request is with us, and we’ll be in touch within one working day to arrange a short call. Your review follows within two working days.',
};

export const form = {
  locations: ['1', '2–3', '4–10', '11+', 'Planning expansion'],
  team: ['1–4', '5–10', '11–25', '26–50', '50+'],
  budget: ['£1,000–£3,500', '£3,500–£6,000', '£6,000–£10,000', 'Not sure yet'],
  improve: [
    'Website redesign', 'New website', 'Online booking', 'Multi-location website',
    'Gift vouchers / memberships', 'CRM / customer management', 'Automation', 'Other',
  ],
};

export const footer = {
  tagline: 'Bespoke websites for the UK’s finest salons and salon groups. Live in 8 to 12 days.',
};
