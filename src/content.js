// All page copy lives here (PRD FR-08: editable without touching components).
// Source: AI Automation Labs — UK Salon Landing Page PRD v1.0.

export const site = {
  company: 'AI Automation Labs LLP',
  brand: 'AI Automation Labs',
  website: 'https://automationlabs.online',
  // TODO(confirm before launch): public contact mailbox.
  email: 'hello@automationlabs.online',
  privacyUrl: '/privacy',
  termsUrl: '/terms',
  // PRD 10.4: optional, never invented. Set to an approved Calendly/booking URL to enable.
  bookingUrl: null,
  formEndpoint: '/api/lead',
  formVersion: 'uksalons-v1',
};

export const nav = [
  { id: 'experience', label: 'The Experience' },
  { id: 'build', label: 'What We Build' },
  { id: 'beyond', label: 'Beyond the Website' },
  { id: 'process', label: 'Our Process' },
  { id: 'faqs', label: 'FAQs' },
];

export const cta = {
  primary: 'Request a Complimentary Website Review',
  primaryShort: 'Request a Review',
  secondary: 'See What We Can Build',
  discuss: 'Discuss Your Salon Website',
  final: 'Request My Complimentary Website Review',
};

export const hero = {
  eyebrow: 'Premium website design for UK salons',
  titleLines: ['Your salon deserves', 'a digital experience', 'as considered as the', 'experience you create in person.'],
  italicFrom: 2,
  body:
    'We design premium websites for established salons and salon groups — bringing your treatments, team, locations and booking journey together in a polished online experience that reflects the quality of your business.',
  micro: 'A short conversation. Practical ideas for your salon. No obligation.',
  word: 'Atelier',
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
      title: 'Your website no longer reflects your brand',
      body: 'Your salon has evolved, but the website still looks like an earlier version of the business.',
      img: 'pr-dated-salon.webp',
    },
    {
      title: 'Great treatments are difficult to discover',
      body: 'Visitors should be able to understand your services, specialists, pricing approach and treatment experience without searching through disconnected pages.',
      img: 'pr-colour-foils-work.webp',
    },
    {
      title: 'Booking takes too many steps',
      body: 'Make the next step clear and connect visitors to the booking journey your team already uses.',
      img: 'pr-reception.webp',
    },
    {
      title: 'Multiple locations feel disconnected',
      body: 'Create a consistent brand experience while helping customers find the right salon, service and team.',
      img: 'pr-group-floor.webp',
    },
  ],
};

export const journey = {
  label: 'The Journey',
  heading: ['From first impression', 'to confirmed appointment.'],
  steps: [
    { title: 'Discover', body: 'A prospective client finds the salon through search, social media or a recommendation.', img: 'jr-discover.webp' },
    { title: 'Explore', body: 'They browse treatments, specialists, prices or guidance and understand what makes the salon distinctive.', img: 'jr-explore.webp' },
    { title: 'Build confidence', body: 'They see authentic work, reviews, team profiles, location details and clear information.', img: 'jr-confidence.webp' },
    { title: 'Take action', body: 'They book through the salon’s supported booking system or submit an enquiry.', img: 'jr-action.webp' },
    { title: 'Stay connected', body: 'Where the salon has the right system and permissions, follow-up and retention workflows can support the relationship.', img: 'jr-connected.webp' },
  ],
};

export const capabilities = {
  label: 'What We Build',
  heading: ['A website designed around the way', 'salons attract and serve clients.'],
  items: [
    { title: 'Premium homepage', body: 'Clear salon positioning, hero imagery, service discovery, proof and booking CTA.', img: 'cap-homepage.webp' },
    { title: 'Treatment & service pages', body: 'Individual pages for priority services, treatment information, pricing guidance and relevant FAQs.', img: 'cap-treatments.webp' },
    { title: 'Team & stylist profiles', body: 'Portrait, role, specialties, biography and a relevant booking path.', img: 'cap-team.webp' },
    { title: 'Work & gallery', body: 'Optimised images, categories and consent-aware publication.', img: 'cap-gallery.webp' },
    { title: 'Reviews & testimonials', body: 'Authentic, permissioned proof — never fabricated ratings, testimonials or client identities.', img: 'cap-reviews.webp' },
    { title: 'Online booking', body: 'Connected to your current booking platform where a supported integration exists, or a clearly labelled booking link.', img: 'cap-booking.webp' },
    { title: 'Gift vouchers & packages', body: 'Linked to a supported ecommerce or voucher provider, or scoped as custom functionality.', img: 'cap-vouchers.webp' },
    { title: 'Membership & loyalty', body: 'Present your programme and connect it to supported systems where possible.', img: 'cap-membership.webp' },
    { title: 'Locations', body: 'Individual location pages with address, opening hours, contact, map and a location-specific booking link.', img: 'cap-locations.webp' },
    { title: 'Enquiry capture', body: 'Forms with consent and privacy controls, routed to the nominated salon contact.', img: 'cap-enquiry.webp' },
    { title: 'SEO foundations', body: 'Technical SEO, page titles, metadata, semantic headings, image optimisation and local business structured data.', img: 'cap-seo.webp' },
    { title: 'Analytics', body: 'Measure CTA clicks, booking link clicks, form completion and channel attribution.', img: 'cap-analytics.webp' },
  ],
};

export const lookbook = {
  heading: ['Your work,', 'beautifully shown.'],
  note: 'Example gallery · Illustrative imagery',
  tiles: [
    ['lb-blowdry.webp', 'Blow-dry'], ['lb-twists.webp', 'Twists'], ['lb-balayage.webp', 'Balayage'],
    ['lb-curls.webp', 'Curls'], ['lb-copper.webp', 'Colour'], ['lb-natural.webp', 'Natural hair'],
    ['lb-styling.webp', 'Styling'], ['lb-studio.webp', 'The studio'], ['lb-texture.webp', 'Texture'],
    ['lb-lengths.webp', 'Lengths'], ['lb-lounge.webp', 'Welcome'], ['lb-details.webp', 'The details'],
  ],
};

export const concepts = {
  label: 'Illustrative Concepts',
  heading: ['See what your salon', 'could look like.'],
  note: 'Concept designs for a fictional salon — not client work.',
  salonName: 'Maison Ondine',
  items: ['Homepage', 'Treatment page', 'Stylist page', 'Location page', 'Gift voucher & membership'],
};

export const beyond = {
  label: 'Beyond the Website',
  heading: ['And when you’re ready to connect', 'more of your salon operations…'],
  body:
    'For salons looking beyond the website, AI Automation Labs can also explore a connected Salon CRM platform — helping bring customer relationships, appointments, staff, payments and day-to-day operations into a more joined-up view.',
  cta: 'Ask about Salon CRM',
  note: 'Optional next step · Capabilities confirmed during discovery · Illustrative interface',
  modules: [
    ['Customer CRM', 'Client profiles, visit history, preferences, notes, consent and segmentation.'],
    ['Appointments', 'Service calendars, staff availability, booking management, rescheduling and waitlists.'],
    ['Staff & resources', 'Roles, permissions, shifts, leave, commissions, productivity and resource allocation.'],
    ['POS & payments', 'Checkout, receipts, payment tracking, packages and transaction reports.'],
    ['Inventory', 'Product catalogue, stock levels, usage, purchase orders, suppliers and low-stock alerts.'],
    ['Memberships & loyalty', 'Membership plans, points, rewards, packages, gift cards and customer retention.'],
    ['Marketing & communications', 'Consent-aware reminders, campaigns, reactivation, birthday messages and review requests.'],
    ['Multi-location management', 'Branch-level calendars, staff, services, performance and central oversight.'],
    ['Reporting', 'Revenue, appointments, customer retention, service mix, staff utilisation and branch performance.'],
  ],
};

export const why = {
  label: 'Why AI Automation Labs',
  heading: ['A digital partner', 'beyond the launch date.'],
  statement:
    'AI Automation Labs combines website development with CRM, custom software and business automation capabilities. That means your website can be designed as the starting point for a better-connected digital experience — not another standalone system that your team has to manage manually.',
  marquee: ['Website development', 'Salon CRM', 'Custom software', 'Business automation', 'Booking integrations', 'SEO foundations', 'Analytics'],
};

export const process = {
  label: 'Our Process',
  heading: ['Considered at every step,', 'from first call to launch.'],
  steps: [
    ['Discover', 'Understand the salon, brand, services, locations, customer journey and current systems.'],
    ['Plan', 'Agree sitemap, key pages, content requirements, integrations and measurable goals.'],
    ['Design', 'Create a visual direction and page designs for your review and approval.'],
    ['Build', 'Develop responsive pages, CMS components, forms and approved integrations.'],
    ['Review & launch', 'Test content, mobile experience, forms, performance, accessibility and analytics before launch.'],
    ['Improve', 'Provide agreed support and identify future CRM or automation opportunities.'],
  ],
};

export const faqs = {
  label: 'FAQs',
  heading: ['Questions salon owners', 'usually ask.'],
  items: [
    ['How much does a salon website cost?', 'Every salon is different, so we don’t publish a fixed price. After your complimentary review and a short discovery conversation, we’ll share a clearly scoped proposal.'],
    ['How long does it take?', 'Timelines depend on the number of pages, how ready your content is and which integrations you need. We agree a realistic schedule after discovery rather than promising a date upfront.'],
    ['Can you work with our existing booking system?', 'Usually, yes. Where a supported integration or safe handoff exists, we connect your website to the booking platform your team already uses. Otherwise we use a clearly labelled booking link. We confirm what’s possible during discovery.'],
    ['We already have a website. Do we start from scratch?', 'Not necessarily. We review what’s working today — content, structure, search visibility — and carry forward what still serves your salon.'],
    ['Do we need the Salon CRM?', 'No. The website stands on its own. Salon CRM is an optional next step for salons that want to bring more of their operations together.'],
    ['Who provides the photos and content?', 'You know your salon best. We’ll guide exactly what’s needed, work with your existing photography where it’s suitable, and advise on new photography or copy support if helpful.'],
    ['What support do we get after launch?', 'We agree a support arrangement that suits your salon — from occasional updates to ongoing improvements and future CRM or automation work.'],
    ['Who owns the website?', 'Ownership of your domain, content and website is set out clearly in your proposal before any work begins.'],
  ],
};

export const closing = {
  label: 'Complimentary website review',
  heading: ['Let’s make your online experience', 'match the quality of your salon.'],
  body:
    'Tell us a little about your salon and what you would like your website to do better. We’ll review your current digital presence and share a few practical ideas to explore together.',
  reviewNote:
    'We’ll look at your publicly visible website and share a small number of practical improvement opportunities. It’s a conversation starter — not a full technical audit.',
  success:
    'Thank you — your request has been received. We’ll review the details you shared and be in touch using the contact information provided.',
};

export const form = {
  locations: ['1', '2–3', '4–10', '11+', 'Planning expansion'],
  team: ['1–4', '5–10', '11–25', '26–50', '50+'],
  improve: [
    'Website redesign', 'New website', 'Online booking', 'Multi-location website',
    'Gift vouchers / memberships', 'CRM / customer management', 'Automation', 'Other',
  ],
};
