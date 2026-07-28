/* =========================================================================
   ASPECT — page logic (no build step, no dependencies, plain JS)
   ========================================================================= */

(function () {
  "use strict";

  const igLink = (extra) =>
    `https://ig.me/m/${encodeURIComponent(SITE.instagramUsername)}`;

  // ---------- GA4 event tracking ----------
  // Small guard wrapper: gtag may be missing (ad blocker, offline gtag.js load failure) —
  // never let analytics break the page.
  function track(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
  }

  // ---------- fill in text from config.js ----------
  document.getElementById("footer-ig-link").textContent = SITE.instagramHandleDisplay;
  document.getElementById("footer-ig-link").href = igLink();
  document.getElementById("footer-ig-link").addEventListener("click", () => {
    track("contact_click", { source: "footer" });
  });
  document.getElementById("question-ig-link").href = igLink();
  document.getElementById("question-ig-link").addEventListener("click", () => {
    track("contact_click", {
      source: "product_modal",
      product_id: currentProduct ? currentProduct.id : null,
      product_name: currentProduct ? currentProduct.name : null,
    });
  });

  if (SITE.heroPhoto) {
    document.getElementById("hero-photo-img-slot").innerHTML =
      `<img src="${SITE.heroPhoto}" alt="Model wearing an ASPECT mask — eyes visible through the design" />`;
  }
  // else: leave the CSS placeholder (photo not shot yet) as-is

  document.getElementById("hero-title").textContent = SITE.heroTitle;
  document.getElementById("hero-subtitle").textContent = SITE.heroSubtitle;

  document.getElementById("hero-tagline-lines").innerHTML = SITE.heroTaglineLines
    .map((line) => `<p>${line}</p>`)
    .join("");

  document.getElementById("hero-scarcity-number").textContent = SITE.heroScarcityNumber;

  document.getElementById("order-title").textContent = SITE.orderPopupTitle;
  document.getElementById("order-explainer").textContent = SITE.orderPopupExplainer;

  // ---------- helpers ----------
  function mediaPath(productId, filename) {
    return `assets/products/${productId}/${filename}`;
  }

  function slideHTML(product, item) {
    // "text" slides: photo strip up top (src, ~54% of slide height), then the "aspect" watermark,
    // then left-aligned bullets. Redesigned 2026-07-28 — heading/subheading dropped entirely.
    if (item.type === "text") {
      const bgSrc = item.src ? mediaPath(product.id, item.src) : null;
      const bullets = item.bullets || [];
      // focusY: per-photo eye-position calibration (see text-slide-template-spec.md).
      // Defaults to 41% (ruby-dune's value) when a product doesn't specify one.
      const focusY = item.focusY != null ? item.focusY : 41;
      // scale: normally the fixed 1.81 shared by every product — only override per-product
      // when a photo's composition genuinely needs a different crop tightness (explicit
      // per-item `scale` field on the text-slide entry in products.js).
      const scale = item.scale != null ? item.scale : 1.81;
      const focusStyle = ` style="object-position:center ${focusY}%; transform-origin:center ${focusY}%; transform:scale(${scale});"`;
      return `<div class="carousel-slide"><div class="text-slide">
        ${bgSrc ? `<div class="text-slide-photo"><img src="${bgSrc}" alt=""${focusStyle} /><div class="text-slide-photo-scrim"></div></div>` : ""}
        <img class="text-slide-watermark" src="assets/brand/logo-mark.png" alt="" aria-hidden="true" />
        <div class="text-slide-content">
          ${bullets.length ? `<ul class="text-slide-bullets">${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>` : ""}
        </div>
      </div></div>`;
    }

    // "proof" slides: full-bleed process photo (proof of handmade craft) with a short text
    // overlay at the bottom. Added 2026-07-28, sits right after the text slide. Same heading/
    // bodyLines on every product — only the background photo changes.
    if (item.type === "proof") {
      const bgSrc = item.src ? mediaPath(product.id, item.src) : null;
      if (!bgSrc) {
        return `<div class="carousel-slide"><div class="placeholder-slide">
          <span class="ph-icon">📷</span>
          <span class="ph-label">${item.slot}</span>
          <span>add file to<br>assets/products/${product.id}/</span>
        </div></div>`;
      }
      const bodyLines = item.bodyLines || [];
      return `<div class="carousel-slide"><div class="proof-slide">
        <img src="${bgSrc}" alt="${product.name} — ${item.slot}" loading="lazy" decoding="async" />
        <div class="proof-slide-scrim"></div>
        <div class="proof-slide-content">
          ${item.heading ? `<p class="proof-slide-heading">${item.heading}</p>` : ""}
          <div class="proof-slide-body">${bodyLines.map((l) => `<p>${l}</p>`).join("")}</div>
        </div>
      </div></div>`;
    }

    if (!item.src) {
      return `<div class="carousel-slide"><div class="placeholder-slide">
        <span class="ph-icon">${item.type === "video" ? "🎬" : "📷"}</span>
        <span class="ph-label">${item.slot}</span>
        <span>add file to<br>assets/products/${product.id}/</span>
      </div></div>`;
    }
    const src = mediaPath(product.id, item.src);

    if (item.type === "cta") {
      return `<div class="carousel-slide"><div class="cta-slide">
        <img src="${src}" alt="${product.name} — ${item.slot}" loading="lazy" decoding="async" />
        <div class="cta-slide-overlay">
          <p class="cta-slide-title">${item.ctaTitle || product.name}</p>
          <p class="cta-slide-sub">${item.ctaSub || "Tap “Order this piece” below to make it yours."}</p>
        </div>
      </div></div>`;
    }

    if (item.type === "video") {
      // offer webm (same filename, .webm) first for browsers that support it, mp4/H.264 as the
      // universally-compatible fallback (Safari/iOS in particular needs the mp4 source)
      const webmSrc = mediaPath(product.id, item.src.replace(/\.mp4$/i, ".webm"));
      return `<div class="carousel-slide"><video muted loop playsinline autoplay preload="metadata">
        <source src="${webmSrc}" type="video/webm">
        <source src="${src}" type="video/mp4">
      </video></div>`;
    }
    return `<div class="carousel-slide"><img src="${src}" alt="${product.name} — ${item.slot}" loading="lazy" decoding="async" /></div>`;
  }

  // ---------- render product grid ----------
  const grid = document.getElementById("product-grid");
  grid.innerHTML = PRODUCTS.map((p) => {
    const cover = p.media.find((m) => m.src) || p.media[0];
    const coverHTML = cover.src
      ? `<img src="${mediaPath(p.id, cover.src)}" alt="${p.name}" loading="lazy" decoding="async" />`
      : `<div class="placeholder-slide"><span class="ph-icon">📷</span><span class="ph-label">${cover.slot}</span></div>`;
    return `
      <div class="card" data-id="${p.id}">
        <div class="card-media">
          ${coverHTML}
        </div>
        <div class="card-info">
          <p class="card-name">${p.name}</p>
          ${p.price ? `<p class="card-price">${p.price}</p>` : ""}
          <button class="card-btn" type="button">view piece</button>
        </div>
      </div>`;
  }).join("");

  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const product = PRODUCTS.find((p) => p.id === card.dataset.id);
      track("card_click", {
        product_id: card.dataset.id,
        product_name: product ? product.name : card.dataset.id,
      });
      openProduct(card.dataset.id, true);
    });
  });

  // ---------- product modal ----------
  const productModal = document.getElementById("product-modal");
  const carouselEl = document.getElementById("modal-carousel");
  const dotsEl = document.getElementById("modal-dots");
  let currentProduct = null;
  // per-product-view carousel-progress tracking (for GA4 slide_view / product_view_end):
  // maxSlideIndex is the furthest slide (0-based) reached in the CURRENT modal viewing,
  // reset every time a product is opened. viewEndSent guards against firing the summary
  // event twice (explicit close + pagehide) for the same viewing.
  let maxSlideIndex = 0;
  let viewEndSent = true;

  function trackViewEnd() {
    if (viewEndSent || !currentProduct) return;
    viewEndSent = true;
    const total = currentProduct.media.length;
    track("product_view_end", {
      product_id: currentProduct.id,
      product_name: currentProduct.name,
      max_slide_reached: maxSlideIndex + 1,
      slide_total: total,
      reached_end: maxSlideIndex >= total - 1,
    });
  }
  // covers the case where the visitor closes the tab / navigates away without
  // tapping the ✕ — otherwise that viewing's drop-off point would never be recorded
  window.addEventListener("pagehide", trackViewEnd);

  function openProduct(id, pushHash) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    trackViewEnd(); // flush the previous product's viewing, if any, before switching
    currentProduct = product;
    maxSlideIndex = 0;
    viewEndSent = false;

    carouselEl.innerHTML = product.media.map((m) => slideHTML(product, m)).join("");
    dotsEl.innerHTML = product.media.map((_, i) => `<span class="${i === 0 ? "active" : ""}"></span>`).join("");
    carouselEl.scrollLeft = 0;
    dotsEl.querySelectorAll("span").forEach((dot, i) => {
      dot.addEventListener("click", () => goToSlide(i));
    });

    document.getElementById("modal-name").textContent = product.name;
    document.getElementById("modal-tagline").textContent = product.tagline;
    document.getElementById("modal-price").textContent = product.price || "";
    document.getElementById("modal-price").style.display = product.price ? "block" : "none";

    productModal.classList.add("open");
    productModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    track("slide_view", {
      product_id: product.id,
      product_name: product.name,
      slide_index: 1,
      slide_total: product.media.length,
      slide_type: product.media[0] ? (product.media[0].type || "photo") : "photo",
    });

    // wrapped in try/catch: some browsers (notably Safari on a file:// page,
    // e.g. a locally-saved preview opened straight from the Files app) refuse
    // to let history.pushState change the URL and throw a SecurityError —
    // the card/modal must still open even if the URL can't be updated
    if (pushHash) {
      try { history.pushState({ product: id }, "", `#p-${id}`); } catch (e) {}
    }
  }

  function closeProduct(popHash) {
    trackViewEnd();
    productModal.classList.remove("open");
    productModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (popHash && location.hash) {
      try { history.pushState({}, "", location.pathname); } catch (e) {}
    }
  }

  document.getElementById("modal-close").addEventListener("click", () => closeProduct(true));

  carouselEl.addEventListener("scroll", () => {
    const idx = Math.round(carouselEl.scrollLeft / carouselEl.clientWidth);
    dotsEl.querySelectorAll("span").forEach((d, i) => d.classList.toggle("active", i === idx));

    // fire slide_view only the first time a given slide index is reached in this
    // viewing (not on every back-and-forth swipe) — gives a clean per-product
    // "how far did they get" funnel in GA4
    if (currentProduct && idx > maxSlideIndex) {
      maxSlideIndex = idx;
      const item = currentProduct.media[idx];
      track("slide_view", {
        product_id: currentProduct.id,
        product_name: currentProduct.name,
        slide_index: idx + 1,
        slide_total: currentProduct.media.length,
        slide_type: item ? (item.type || "photo") : "photo",
      });
    }
  });

  // ---------- carousel prev/next arrows (mouse-friendly — swipe still works on touch) ----------
  function currentSlideIndex() {
    return Math.round(carouselEl.scrollLeft / carouselEl.clientWidth);
  }
  function goToSlide(i) {
    const slides = carouselEl.querySelectorAll(".carousel-slide").length;
    const clamped = Math.max(0, Math.min(slides - 1, i));
    carouselEl.scrollTo({ left: clamped * carouselEl.clientWidth, behavior: "smooth" });
  }
  document.getElementById("carousel-prev").addEventListener("click", () => goToSlide(currentSlideIndex() - 1));
  document.getElementById("carousel-next").addEventListener("click", () => goToSlide(currentSlideIndex() + 1));

  // ---------- open product directly from a shared link (#p-slug) ----------
  function openFromHash() {
    const m = location.hash.match(/^#p-(.+)$/);
    if (m) openProduct(m[1], false);
  }
  window.addEventListener("hashchange", openFromHash);
  window.addEventListener("popstate", () => {
    if (!location.hash) closeProduct(false);
    else openFromHash();
  });
  openFromHash();

  // ---------- order popup ----------
  const orderModal = document.getElementById("order-modal");
  const copyField = document.getElementById("copy-field");
  const copyHint = document.getElementById("copy-hint");
  const orderIgBtn = document.getElementById("order-ig-btn");
  const orderWaBtn = document.getElementById("order-wa-btn");

  document.getElementById("order-btn").addEventListener("click", () => {
    if (!currentProduct) return;
    track("order_button_click", {
      product_id: currentProduct.id,
      product_name: currentProduct.name,
    });
    const url = `${location.origin}${location.pathname}#p-${currentProduct.id}`;
    const message = `${currentProduct.name} — ${url}`;
    copyField.value = message;
    copyHint.classList.remove("show"); // reset — copying is now an explicit step the buyer taps below, not silent

    // name the exact piece being ordered — the whole point of this popup is copying
    // a link to THIS mask, so say so in both the title and the copy-step button
    document.getElementById("order-title").textContent = `Order the ${currentProduct.name}`;
    document.getElementById("copy-btn").textContent = `Tap to copy ${currentProduct.name} link`;

    orderIgBtn.href = igLink();
    if (SITE.whatsappNumber) {
      orderWaBtn.href = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
      orderWaBtn.style.display = "flex";
    } else {
      orderWaBtn.style.display = "none";
    }

    orderModal.classList.add("open");
    orderModal.setAttribute("aria-hidden", "false");
  });

  document.getElementById("copy-btn").addEventListener("click", () => {
    if (currentProduct) {
      track("order_copy_link_click", { product_id: currentProduct.id, product_name: currentProduct.name });
    }
  });
  orderIgBtn.addEventListener("click", () => {
    if (currentProduct) {
      track("order_instagram_click", { product_id: currentProduct.id, product_name: currentProduct.name });
    }
  });
  orderWaBtn.addEventListener("click", () => {
    if (currentProduct) {
      track("order_whatsapp_click", { product_id: currentProduct.id, product_name: currentProduct.name });
    }
  });

  function closeOrderModal() {
    orderModal.classList.remove("open");
    orderModal.setAttribute("aria-hidden", "true");
  }
  document.getElementById("order-modal-close").addEventListener("click", closeOrderModal);
  // tap the dimmed backdrop (not the sheet itself) to dismiss — standard bottom-sheet behavior
  orderModal.addEventListener("click", (e) => {
    if (e.target === orderModal) closeOrderModal();
  });

  document.getElementById("copy-btn").addEventListener("click", () => {
    copyToClipboard(copyField.value);
  });

  function copyToClipboard(text) {
    const done = () => {
      copyHint.classList.add("show");
      setTimeout(() => copyHint.classList.remove("show"), 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    copyField.removeAttribute("readonly");
    copyField.select();
    try { document.execCommand("copy"); } catch (e) {}
    copyField.setAttribute("readonly", "readonly");
    done();
  }
})();
