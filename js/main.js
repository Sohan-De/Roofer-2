/**
 * js/main.js — MR. DUVAL Couverture
 * All interactions: nav, slider, FAQ, form, scroll-reveal, smooth scroll.
 * Relies on CSS variables injected by colors.js (loaded before this script).
 */

import BRAND_COLORS from "./colors.js";

// Add js-enabled class to document element since modules loaded successfully
document.documentElement.classList.add("js");

/* ─── Utilities ──────────────────────────────────────────────────────────── */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════════════════════════════════════
   1. STICKY HEADER + SHRINK ON SCROLL
   ══════════════════════════════════════════════════════════════════════════ */
function initHeader() {
  const header = qs("#site-header");
  const navLinks = qsa(".header-nav a");

  // Shrink on scroll
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 60);

    // Active nav link highlight
    const sections = qsa("section[id]");
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      const href = a.getAttribute("href").replace("#", "");
      a.classList.toggle("active", href === current);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ── Zone Dropdown click-to-toggle ──────────────────────────────────────────
  const dropdownWraps = qsa(".nav-dropdown-wrap");
  dropdownWraps.forEach(wrap => {
    const trigger = wrap.querySelector(".nav-has-dropdown");
    if (!trigger) return;

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = wrap.classList.contains("open");
      // Close all dropdowns first
      dropdownWraps.forEach(w => {
        w.classList.remove("open");
        const t = w.querySelector(".nav-has-dropdown");
        if (t) t.setAttribute("aria-expanded", "false");
      });
      // Toggle the clicked one
      if (!isOpen) {
        wrap.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    dropdownWraps.forEach(w => {
      w.classList.remove("open");
      const t = w.querySelector(".nav-has-dropdown");
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });

  // Close dropdown on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdownWraps.forEach(w => {
        w.classList.remove("open");
        const t = w.querySelector(".nav-has-dropdown");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    }
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   2. MOBILE NAV TOGGLE
   ══════════════════════════════════════════════════════════════════════════ */
function initMobileNav() {
  const toggle = qs(".nav-toggle");
  const mobileNav = qs(".mobile-nav");
  if (!toggle || !mobileNav) return;

  const open = () => {
    toggle.classList.add("open");
    mobileNav.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    toggle.classList.remove("open");
    mobileNav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () =>
    mobileNav.classList.contains("open") ? close() : open()
  );

  // Close on nav link click; for hash-anchors on mobile/tablet keep menu open
  qsa(".mobile-nav a").forEach(a => a.addEventListener("click", (e) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#") && window.innerWidth <= 960) {
      e.preventDefault(); // no scroll, no redirect, no close
      return;
    }
    close();
  }));

  // Close on escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   3. SMOOTH SCROLL
   ══════════════════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  const HEADER_H = () => parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--header-h") || "72"
  );

  document.addEventListener("click", e => {
    const anchor = e.target.closest("a[href^='#']");
    if (!anchor) return;
    // Mobile nav links: skip smooth scroll, let browser handle naturally
    if (anchor.closest(".mobile-nav")) return;
    const target = qs(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H();
    window.scrollTo({ top, behavior: "smooth" });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   4. BEFORE / AFTER DRAG SLIDER
   ══════════════════════════════════════════════════════════════════════════ */
function initBASliders() {
  qsa(".ba-slider-wrap").forEach(wrap => {
    const beforeContainer = qs(".ba-before-container", wrap);
    const divider = qs(".ba-divider", wrap);
    let dragging = false;

    // Set the full slider width as a CSS variable for the before image
    const updateSliderWidth = () => {
      wrap.style.setProperty("--slider-w", wrap.offsetWidth + "px");
    };
    updateSliderWidth();
    window.addEventListener("resize", updateSliderWidth, { passive: true });

    const setPos = (x) => {
      const rect = wrap.getBoundingClientRect();
      let pct = ((x - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      beforeContainer.style.width = pct + "%";
      divider.style.left = pct + "%";
    };

    // Mouse
    wrap.addEventListener("mousedown", e => { dragging = true; setPos(e.clientX); });
    window.addEventListener("mouseup", () => { dragging = false; });
    window.addEventListener("mousemove", e => { if (dragging) setPos(e.clientX); });

    // Touch
    wrap.addEventListener("touchstart", e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener("touchend", () => { dragging = false; });
    window.addEventListener("touchmove", e => {
      if (dragging) setPos(e.touches[0].clientX);
    }, { passive: true });

    // Keyboard (when wrapper focused)
    wrap.setAttribute("tabindex", "0");
    wrap.setAttribute("role", "slider");
    wrap.setAttribute("aria-label", "Comparaison avant/après — utilisez ← → pour ajuster");
    wrap.addEventListener("keydown", e => {
      const rect = wrap.getBoundingClientRect();
      const cur = parseFloat(beforeContainer.style.width) || 50;
      if (e.key === "ArrowLeft") { setPos(rect.left + (cur - 5) / 100 * rect.width); e.preventDefault(); }
      if (e.key === "ArrowRight") { setPos(rect.left + (cur + 5) / 100 * rect.width); e.preventDefault(); }
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   5. FAQ ACCORDION
   ══════════════════════════════════════════════════════════════════════════ */
function initFAQ() {
  const items = qsa(".faq-item");

  items.forEach(item => {
    const trigger = qs(".faq-trigger", item);
    const body = qs(".faq-body", item);
    const inner = qs(".faq-body-inner", item);

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all
      items.forEach(i => {
        i.classList.remove("open");
        qs(".faq-body", i).style.height = "0";
        qs(".faq-trigger", i).setAttribute("aria-expanded", "false");
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add("open");
        body.style.height = inner.scrollHeight + "px";
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   6. SCROLL REVEAL (IntersectionObserver)
   ══════════════════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = qsa(".reveal, .reveal-left, .reveal-right");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger children delay
          const delay = entry.target.dataset.delay || "0";
          entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════════════════
   7. CONTACT FORM VALIDATION + EMAILJS
   ══════════════════════════════════════════════════════════════════════════ */

// ── EmailJS init (runs once when module loads) ─────────────────────────────
if (typeof emailjs !== "undefined") {
  emailjs.init("DZOrjYjrM1Q1Wbd2n");
}

function initForm() {
  const form = qs("#contact-form");
  if (!form) return;

  const rules = {
    nom: { required: true, label: "Votre nom" },
    telephone: { required: true, pattern: /^[\d\s\+\-\(\)\.]{8,20}$/, label: "Téléphone" },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: "E-mail" },
    ville: { required: false },
    message: { required: true, minLength: 10, label: "Message" },
  };

  const showError = (field, msg) => {
    field.classList.add("error");
    const err = field.parentElement.querySelector(".field-error");
    if (err) { err.textContent = msg; err.classList.add("visible"); }
  };
  const clearError = (field) => {
    field.classList.remove("error");
    const err = field.parentElement.querySelector(".field-error");
    if (err) err.classList.remove("visible");
  };

  // Live validation on blur
  qsa("[data-rule]", form).forEach(field => {
    field.addEventListener("blur", () => validate(field));
    field.addEventListener("input", () => clearError(field));
  });

  const validate = (field) => {
    const name = field.dataset.rule;
    const rule = rules[name];
    if (!rule) return true;

    const val = field.value.trim();
    if (rule.required && !val) {
      showError(field, `${rule.label || "Ce champ"} est obligatoire.`);
      return false;
    }
    if (val && rule.pattern && !rule.pattern.test(val)) {
      showError(field, `${rule.label || "Ce champ"} n'est pas valide.`);
      return false;
    }
    if (val && rule.minLength && val.length < rule.minLength) {
      showError(field, `${rule.label} doit contenir au moins ${rule.minLength} caractères.`);
      return false;
    }
    clearError(field);
    return true;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fields = qsa("[data-rule]", form);
    const allValid = fields.map(f => validate(f)).every(Boolean);

    const msgEl = qs(".form-message", form);
    const btn = qs("[type='submit']", form);
    msgEl.className = "form-message";
    msgEl.textContent = "";

    if (!allValid) {
      msgEl.textContent = "Veuillez corriger les erreurs ci-dessus.";
      msgEl.classList.add("error");
      return;
    }

    // ── Loading state ─────────────────────────────────────────────────────
    const originalBtnHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = "Envoi en cours\u2026";

    // ── Collect form data ─────────────────────────────────────────────────
    const getValue = (name) => {
      const el = qs(`[name='${name}']`, form);
      return el ? el.value.trim() : "";
    };

    // ── Destinataire du devis (Change admin email here) ───────────────────
    const adminEmail = "sohandevkn@gmail.com";


    const templateParams = {
      nom: getValue("nom"),
      telephone: getValue("telephone"),
      email: getValue("email"),
      ville: getValue("ville"),
      message: getValue("message"),
      source_page: window.location.href,
      to_email: adminEmail, // Passed to EmailJS template variable {{to_email}}
    };

    // ── Send via EmailJS ──────────────────────────────────────────────────
    try {
      await emailjs.send("service_zbtfbfg", "template_u2ams2m", templateParams);
      msgEl.textContent = "Merci\u00a0! Votre demande a bien \u00e9t\u00e9 envoy\u00e9e. Nous vous recontacterons sous 48h.";
      msgEl.classList.add("success");
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      msgEl.textContent = "Une erreur est survenue. Veuillez r\u00e9essayer ou appeler le 06\u00a028\u00a062\u00a050\u00a006.";
      msgEl.classList.add("error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalBtnHTML;
    }
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   8. LEAFLET MAP
   ══════════════════════════════════════════════════════════════════════════ */
function initMap() {
  const mapEl = qs("#leaflet-map");
  if (!mapEl || typeof L === "undefined") return;

  const center = [48.8258, 2.8833]; // Bouleurs, 77580

  const map = L.map("leaflet-map", {
    center,
    zoom: 10,
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: true,
  });

  // Dark-tinted tile layer
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://carto.com/" target="_blank">CARTO</a>',
    maxZoom: 18,
  }).addTo(map);

  // Custom red marker icon
  const redIcon = L.divIcon({
    html: `<div style="
      width:36px;height:36px;
      background:${BRAND_COLORS.red};
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 16px rgba(0,0,0,0.35);
    "></div>`,
    className: "",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  // Main office marker
  L.marker([48.8258, 2.8833], { icon: redIcon })
    .addTo(map)
    .bindPopup(
      `<strong style="font-family:sans-serif;font-size:13px;color:${BRAND_COLORS.black}">
        MR. DUVAL Couverture
      </strong><br/>
      <span style="font-size:12px;color:${BRAND_COLORS.gray}">
        48 rue de la République, 77580 Bouleurs
      </span>`,
      { maxWidth: 220 }
    );

  // Service area radius (approximate ~40 km)
  L.circle([48.8258, 2.8833], {
    radius: 42000,
    color: BRAND_COLORS.red,
    fillColor: BRAND_COLORS.red,
    fillOpacity: 0.07,
    weight: 2,
    dashArray: "6 6",
  }).addTo(map);

  // City markers (subset with notable cities)
  const cities = [
    { name: "Meaux", lat: 48.9602, lon: 2.8886 },
    { name: "Coulommiers", lat: 48.8147, lon: 3.0863 },
    { name: "La Ferté-sous-Jouarre", lat: 48.9531, lon: 3.1289 },
    { name: "Tournan-en-Brie", lat: 48.7392, lon: 2.7703 },
    { name: "Crécy-la-Chapelle", lat: 48.8567, lon: 2.9136 },
    { name: "Château-Thierry", lat: 49.0467, lon: 3.4042 },
    { name: "Nanteuil-le-Haudouin", lat: 49.1394, lon: 2.8078 },
    { name: "Lizy-sur-Ourcq", lat: 49.0103, lon: 3.0231 },
    { name: "Rebais", lat: 48.8467, lon: 3.2289 },
    { name: "Montmirail", lat: 48.8775, lon: 3.5394 },
  ];

  const smallIcon = L.divIcon({
    html: `<div style="
      width:10px;height:10px;
      background:${BRAND_COLORS.red};
      border:2px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

  cities.forEach(c => {
    L.marker([c.lat, c.lon], { icon: smallIcon })
      .addTo(map)
      .bindTooltip(c.name, { className: "city-tooltip", permanent: false });
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initBASliders();
  initFAQ();
  initScrollReveal();
  initForm();

  // Robust Leaflet detection — deferred scripts may load after DOMContentLoaded
  // Poll every 200ms for up to 10 seconds to catch the Leaflet global
  function tryInitMap() {
    if (typeof L !== "undefined") {
      initMap();
      return true;
    }
    return false;
  }

  if (!tryInitMap()) {
    let attempts = 0;
    const maxAttempts = 50; // 50 × 200ms = 10 seconds
    const poll = setInterval(() => {
      attempts++;
      if (tryInitMap() || attempts >= maxAttempts) {
        clearInterval(poll);
      }
    }, 200);
  }
});

