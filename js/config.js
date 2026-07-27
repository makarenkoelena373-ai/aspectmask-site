/* =========================================================================
   ASPECT — site settings
   Edit these values, everything on the page updates automatically.
   ========================================================================= */

const SITE = {
  brandName: "ASPECT",

  // Your Instagram username WITHOUT the @ — used to build the
  // one-tap "message us" link (https://ig.me/m/<username>)
  instagramUsername: "aspect_mask", // confirmed real handle — instagram.com/aspect_mask

  // Shown in the header/footer as a fallback contact line
  instagramHandleDisplay: "@aspect_mask",

  whatsappNumber: "", // optional, e.g. "15551234567" — leave "" to hide the WhatsApp option

  // Hero banner photo — close-up, eyes visible through the mask, black
  // background. Replaced 2026-07-27 (previous version was hands+tools on
  // a burgundy background — see hero-banner-hands-OLD.jpg for that one).
  // Portrait 3:4 — css .hero-photo-banner aspect-ratio matches it exactly.
  heroPhoto: "assets/brand/hero-banner.jpg",

  heroTitle: "Feel insane.",
  heroSubtitle: "At the event. On camera. Inside out.",

  // "Wear it for" — occasion-recognition list, approved 2026-07-27.
  // Order matters: "Wow content" first (broadest, most universally understood
  // value), then specific occasions. Do not reorder without asking Lena.
  heroWearForHeading: "Fashion avant-garde masks for:",
  heroWearFor: [
    "Wow content",
    "Burning Man & festival looks",
    "Red carpet & gala dress codes",
    "Stage performance & music videos",
    "Masquerade & fantasy nights",
    "Boudoir shoots & intimate content",
  ],

  // Uniqueness/urgency/price-anchor paragraph — approved 2026-07-27.
  // "Only 6 pieces" / "$255" reflect the CURRENT catalog — update this text
  // by hand whenever a product is added/removed or the cheapest price changes,
  // it is not computed automatically.
  heroUniqueParagraph:
    "Designer, hand-sculpted masks & headpieces, one of one. Once one is claimed, it's gone for good. In stock and ready to ship today, worldwide. Pieces from $255. Only 6 pieces exist in the world right now — Own yours now.",

  // NOT rendered on the page anymore — removed 2026-07-27 per Lena
  // ("Available Now" heading + subtitle above the catalog grid). Left here
  // in case she wants them back later; js/app.js no longer reads these.
  sectionTitle: "Available Now",
  sectionSubtitle: "Everything below is in stock and ready to ship today.",

  orderPopupTitle: "How to order",
  orderPopupExplainer:
    "Every piece is ordered personally, over Instagram Direct — that's how we confirm shipping with you. Copy the link below, paste it into the chat and send it over.",
};
