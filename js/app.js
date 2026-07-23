/* =========================================================================
   ASPECT — page logic (no build step, no dependencies, plain JS)
   ========================================================================= */

(function () {
  "use strict";

  const igLink = (extra) =>
    `https://ig.me/m/${encodeURIComponent(SITE.instagramUsername)}`;

  // ---------- fill in text from config.js ----------
  document.getElementById("footer-ig-link").textContent = SITE.instagramHandleDisplay;
  document.getElementById("footer-ig-link").href = igLink();
  document.getElementById("header-ig-link").href = igLink();
  document.getElementById("question-ig-link").href = igLink();

  document.getElementById("hero-eyebrow").textContent = SITE.heroEyebrow;
  document.getElementById("hero-title").textContent = SITE.heroTitle;
  document.getElementById("hero-subtitle").textContent = SITE.heroSubtitle;
  document.getElementById("hero-bullets").innerHTML = SITE.heroBullets
    .map((b) => `<li>${b}</li>`)
    .join("");

  document.getElementById("section-title").textContent = SITE.sectionTitle;
  document.getElementById("section-subtitle").textContent = SITE.sectionSubtitle;

  document.getElementById("order-title").textContent = SITE.orderPopupTitle;
  document.getElementById("order-explainer").textContent = SITE.orderPopupExplainer;

  // ---------- helpers ----------
  function mediaPath(productId, filename) {
    return `assets/products/${productId}/${filename}`;
  }

  function slideHTML(product, item) {
    // "text" slides: optional photo strip up top (src), heading + subheading + left-aligned bullets below
    if (item.type === "text") {
      const bgSrc = item.src ? mediaPath(product.id, item.src) : null;
      const bullets = item.bullets || [];
      return `<div class="carousel-slide"><div class="text-slide">
        ${bgSrc ? `<div class="text-slide-photo"><img src="${bgSrc}" alt="" /><div class="text-slide-photo-scrim"></div></div>` : ""}
        <img class="text-slide-watermark" src="assets/brand/logo-mark.png" alt="" aria-hidden="true" />
        <div class="text-slide-content">
          ${item.heading ? `<p class="text-slide-heading">${item.heading}</p>` : ""}
          ${item.subheading ? `<p class="text-slide-subheading">${item.subheading}</p>` : ""}
          ${bullets.length ? `<ul class="text-slide-bullets">${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>` : ""}
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
          ${p.inStock ? '<span class="card-badge">In stock</span>' : ""}
          ${coverHTML}
        </div>
        <div class="card-info">
          <p class="card-name">${p.name}</p>
          <p class="card-tagline">${p.tagline}</p>
          ${p.price ? `<p class="card-price">${p.price}</p>` : ""}
          <button class="card-btn" type="button">View piece</button>
        </div>
      </div>`;
  }).join("");

  grid.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => openProduct(card.dataset.id, true));
  });

  // ---------- product modal ----------
  const productModal = document.getElementById("product-modal");
  const carouselEl = document.getElementById("modal-carousel");
  const dotsEl = document.getElementById("modal-dots");
  let currentProduct = null;

  function openProduct(id, pushHash) {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    currentProduct = product;

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

    // wrapped in try/catch: some browsers (notably Safari on a file:// page,
    // e.g. a locally-saved preview opened straight from the Files app) refuse
    // to let history.pushState change the URL and throw a SecurityError —
    // the card/modal must still open even if the URL can't be updated
    if (pushHash) {
      try { history.pushState({ product: id }, "", `#p-${id}`); } catch (e) {}
    }
  }

  function closeProduct(popHash) {
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
