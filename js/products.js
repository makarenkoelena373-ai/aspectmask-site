/* =========================================================================
   ASPECT — product catalog data
   -------------------------------------------------------------------------
   HOW TO ADD A NEW PRODUCT (no coding needed):
   1. Copy one whole {…} block below (from "{" to the matching "},").
   2. Paste it right after the last product, before the closing "];".
   3. Change id, name, price, description.
   4. For media: put your photo/video files in  assets/products/<id>/
      and change each `src` to the file name, e.g. "01-hero.jpg".
      If you don't have a file yet for a slot, leave src: null —
      the site will show a labeled placeholder instead of breaking.
   5. Save the file. That's it — the new card appears automatically.

   CAROUSEL SLIDE ORDER (updated 2026-07-20):
    1. image — Hero photo
    2. video — Hero video
    3. video — Video product review
    4. video — Hands-on video (table → hands → on face)
    5. image — Front photo, on mannequin
    6. image — Side photo 1, on mannequin
    7. image — Side photo 2, on mannequin
    8. image — Back photo, on mannequin
    9. image — Inside photo
    10-11. image — Macro / detail photos (2-3 of them)
    12. text  — brand statement slide (no photo — see `type: "text"` below)
    13. cta   — hero photo + overlay copy, nudges toward the Order button

   SLIDE TYPES:
   - { type: "image", slot, src }                — a normal photo
   - { type: "video", slot, src }                 — a normal video (muted, autoplay, loop)
   - { type: "text",  slot, src, heading, subheading, bullets }
                                                   — brand-copy slide, template APPROVED 2026-07-22.
                                                     heading/subheading/bullets are the SAME on every
                                                     product — do not change the copy. `src` is the ONLY
                                                     thing that changes per product (a photo of that
                                                     product's mask, framed so the eyes read clearly in
                                                     the top-third crop). Full positioning spec is saved
                                                     in the Claude project doc "text-slide-template-spec.md"
                                                     — read it before touching this slide's CSS/JS/copy.
   - { type: "cta",   slot, src, ctaTitle, ctaSub } — template APPROVED 2026-07-22.
                                                     ctaTitle/ctaSub are the SAME on every
                                                     product ("Ready to ship" / "Claim it for
                                                     your look. Make your entrance."). `src`
                                                     is the ONLY thing that changes per product.
                                                     Full spec in the Claude project doc
                                                     "cta-slide-template-spec.md".
   ========================================================================= */

const PRODUCTS = [
  {
    id: "ruby-dune",
    name: "Ruby Dune Mask",
    price: "$ 255", // confirmed 2026-07-23, Notion price list
    inStock: true,
    tagline: "Hand-sculpted red wire mask — veins of thread tracing the face",
    description:
      "One-of-one hand-sculpted piece — no two Aspect masks are ever the same.",
    media: [
      { type: "image", slot: "Hero photo", src: "01-hero.jpg" },
      { type: "video", slot: "Hero video", src: "02-hero-video.mp4" },
      { type: "video", slot: "Video product review", src: "03-video-review.mp4" },
      { type: "video", slot: "Hands-on video", src: "04-hands-on.mp4" },
      { type: "image", slot: "Front photo, on mannequin", src: "05-front-maneken.jpg" },
      { type: "image", slot: "Side photo 1, on mannequin", src: "06-side-maneken-1.jpg" },
      { type: "image", slot: "Side photo 2, on mannequin", src: "07-side-maneken-2.jpg" },
      { type: "image", slot: "Back photo, on mannequin", src: "08-back.jpg" },
      { type: "image", slot: "Inside photo", src: "09-inside.jpg" },
      { type: "image", slot: "Macro detail 1", src: "10-macro-1.jpg" },
      { type: "image", slot: "Macro detail 2", src: "11-macro-2.jpg" },
      {
        type: "text",
        slot: "Brand statement",
        src: "12-text-slide.jpg",
        focusY: 41, // eye-position calibration for THIS photo — see text-slide-template-spec.md
        heading: "One of one",
        subheading:
          "Designer handmade accessory<br>one-of-a-kind piece - one for the whole world.",
        bullets: [
          "Bends by hand to fit any face.",
          "Lightweight. Wear it all night.",
          "Travels easily — weighs next to nothing, box included.",
          "Soft against your skin, not wire.",
        ],
      },
      {
        type: "cta",
        slot: "Order CTA",
        src: "13-cta-hero.jpg",
        ctaTitle: "Ready to ship",
        ctaSub: "Claim it for your look.<br>Make your entrance.",
      },
    ],
  },

  {
    id: "black-bird-eye",
    name: "Black Bird Eye Mask",
    price: "$ 355", // confirmed 2026-07-23, Notion price list
    inStock: true,
    tagline: "Hand-woven black thread mask — a raven's gaze traced in wire",
    description:
      "One-of-one hand-sculpted piece — no two Aspect masks are ever the same.",
    media: [
      { type: "image", slot: "Hero photo", src: "01-hero.jpg" },
      { type: "video", slot: "Hero video", src: "02-hero-video.mp4" },
      { type: "video", slot: "Video product review", src: "03-video-review.mp4" },
      { type: "video", slot: "Hands-on video", src: "04-hands-on.mp4" },
      { type: "image", slot: "Front photo, on mannequin", src: "05-front-maneken.jpg" },
      { type: "image", slot: "Side photo 1, on mannequin", src: "06-side-maneken-1.jpg" },
      { type: "image", slot: "Side photo 2, on mannequin", src: "07-side-maneken-2.jpg" },
      { type: "image", slot: "Back photo, on mannequin", src: "08-back.jpg" },
      { type: "image", slot: "Inside photo", src: "09-inside.jpg" },
      { type: "image", slot: "Macro detail 1", src: "10-macro-1.jpg" },
      { type: "image", slot: "Macro detail 2", src: "11-macro-2.jpg" },
      {
        type: "text",
        slot: "Brand statement",
        src: "12-text-slide.jpg",
        focusY: 23.3, // eye-position calibration for THIS photo — see text-slide-template-spec.md
        heading: "One of one",
        subheading:
          "Designer handmade accessory<br>one-of-a-kind piece - one for the whole world.",
        bullets: [
          "Bends by hand to fit any face.",
          "Lightweight. Wear it all night.",
          "Travels easily — weighs next to nothing, box included.",
          "Soft against your skin, not wire.",
        ],
      },
      {
        type: "cta",
        slot: "Order CTA",
        src: "13-cta-hero.jpg",
        ctaTitle: "Ready to ship",
        ctaSub: "Claim it for your look.<br>Make your entrance.",
      },
    ],
  },

  {
    id: "black-fire",
    name: "Black Fire Mask",
    price: "$ 455", // confirmed 2026-07-23, Notion price list
    inStock: true,
    tagline: "Hand-sculpted black wire crown — flames traced in thread",
    description:
      "One-of-one hand-sculpted piece — no two Aspect masks are ever the same.",
    media: [
      { type: "image", slot: "Hero photo", src: "01-hero.jpg" },
      { type: "video", slot: "Hero video", src: "02-hero-video.mp4" },
      { type: "video", slot: "Video product review", src: "03-video-review.mp4" },
      { type: "video", slot: "Hands-on video", src: "04-hands-on.mp4" },
      { type: "image", slot: "Front photo, on mannequin", src: "05-front-maneken.jpg" },
      { type: "image", slot: "Side photo 1, on mannequin", src: "06-side-maneken-1.jpg" },
      { type: "image", slot: "Side photo 2, on mannequin", src: "07-side-maneken-2.jpg" },
      { type: "image", slot: "Back photo, on mannequin", src: "08-back.jpg" },
      { type: "image", slot: "Inside photo", src: "09-inside.jpg" },
      { type: "image", slot: "Macro detail 1", src: "10-macro-1.jpg" },
      { type: "image", slot: "Macro detail 2", src: "11-macro-2.jpg" },
      {
        type: "text",
        slot: "Brand statement",
        src: "12-text-slide.jpg",
        focusY: 40, // final, approved 2026-07-23 (picked from 4-way comparison grid) — see text-slide-template-spec.md
        scale: 1.54, // -15% vs the shared 1.81, per Lena's request 2026-07-23
        heading: "One of one",
        subheading:
          "Designer handmade accessory<br>one-of-a-kind piece - one for the whole world.",
        bullets: [
          "Bends by hand to fit any face.",
          "Lightweight. Wear it all night.",
          "Travels easily — weighs next to nothing, box included.",
          "Soft against your skin, not wire.",
        ],
      },
      {
        type: "cta",
        slot: "Order CTA",
        src: "13-cta-hero.jpg",
        ctaTitle: "Ready to ship",
        ctaSub: "Claim it for your look.<br>Make your entrance.",
      },
    ],
  },

  /* ---- TEMPLATE — copy this block to add your next product ------------
  {
    id: "your-product-id",
    name: "Product Name",
    price: "$ 000", // keep the space between "$" and the number — approved format, see card-body-below-carousel-spec.md
    inStock: true,
    tagline: "One short line describing the piece",
    description: "One-of-one hand-sculpted piece — no two Aspect masks are ever the same.",
    media: [
      { type: "image", slot: "Hero photo", src: null },
      { type: "video", slot: "Hero video", src: null },
      { type: "video", slot: "Video product review", src: null },
      { type: "video", slot: "Hands-on video", src: null },
      { type: "image", slot: "Front photo, on mannequin", src: null },
      { type: "image", slot: "Side photo 1, on mannequin", src: null },
      { type: "image", slot: "Side photo 2, on mannequin", src: null },
      { type: "image", slot: "Back photo, on mannequin", src: null },
      { type: "image", slot: "Inside photo", src: null },
      { type: "image", slot: "Macro detail 1", src: null },
      { type: "image", slot: "Macro detail 2", src: null },
      // text-slide copy is APPROVED and identical for every product — only change `src`
      // (a photo of THIS product's mask, cropped/zoomed per text-slide-template-spec.md
      // so the eyes read clearly in the top third). Do not edit heading/subheading/bullets.
      // focusY: eye-position % for THIS photo, calculated per the formula in
      // text-slide-template-spec.md — every product needs its own value (photos differ).
      { type: "text", slot: "Brand statement", src: null, focusY: 41, heading: "One of one",
        subheading:
          "Designer handmade accessory<br>one-of-a-kind piece - one for the whole world.",
        bullets: [
          "Bends by hand to fit any face.",
          "Lightweight. Wear it all night.",
          "Travels easily — weighs next to nothing, box included.",
          "Soft against your skin, not wire.",
        ] },
      // cta-slide copy is APPROVED and identical for every product — only change `src`
      // (a photo of THIS product's mask; the bottom third gets covered by a graphite
      // gradient + text, so keep the piece's key visual detail in the top two-thirds
      // of the frame). Full spec: Claude project doc "cta-slide-template-spec.md".
      { type: "cta", slot: "Order CTA", src: null,
        ctaTitle: "Ready to ship",
        ctaSub: "Claim it for your look.<br>Make your entrance." },
    ],
  },
  ------------------------------------------------------------------------ */
];
