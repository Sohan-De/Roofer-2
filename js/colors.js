// js/colors.js
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for MR. DUVAL brand palette.
// • Injected at runtime as CSS custom properties (consumed by style.css)
// • Exported as a JS object (consumed by main.js and any future scripts)
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_COLORS = {
  navy:      "#0B1F3A", // primary dark — header / footer bar, dark hero sections
  navyLight: "#16335C", // lighter navy for cards / gradients on dark bg
  red:       "#D9182B", // primary accent — "NEUF & RÉNOVATION", CTA, paint splash
  redDark:   "#A81120", // hover / active state (deeper crimson)
  redLight:  "#EC3B4B", // lighter tint for gradients / highlights
  blue:      "#1E5BD8", // secondary accent — "APRÈS" label, icons, experience badge
  blueDark:  "#1746A8", // hover / active state for blue elements
  blueLight: "#4C86EE", // lighter tint for gradients / accents
  black:     "#141414", // primary text on light backgrounds
  charcoal:  "#222222", // body text / service list text
  white:     "#FFFFFF", // header text, icons, card backgrounds
  offWhite:  "#F2F2F2", // section backgrounds (service list area)
  cream:     "#D8CBB5", // warm neutral — wall tone from before/after photos
  gray:      "#6B6B6B", // muted body text / meta
  grayLight: "#D0D0D0", // borders / dividers
  success:   "#2E7D32", // guarantee checkmarks — used sparingly
};

// ── Inject as CSS custom properties ──────────────────────────────────────────
(function injectCSSVars() {
  const root = document.documentElement;
  root.style.setProperty("--color-navy",       BRAND_COLORS.navy);
  root.style.setProperty("--color-navy-light", BRAND_COLORS.navyLight);
  root.style.setProperty("--color-red",        BRAND_COLORS.red);
  root.style.setProperty("--color-red-dark",   BRAND_COLORS.redDark);
  root.style.setProperty("--color-red-light",  BRAND_COLORS.redLight);
  root.style.setProperty("--color-blue",       BRAND_COLORS.blue);
  root.style.setProperty("--color-blue-dark",  BRAND_COLORS.blueDark);
  root.style.setProperty("--color-blue-light", BRAND_COLORS.blueLight);
  root.style.setProperty("--color-black",      BRAND_COLORS.black);
  root.style.setProperty("--color-charcoal",   BRAND_COLORS.charcoal);
  root.style.setProperty("--color-white",      BRAND_COLORS.white);
  root.style.setProperty("--color-offwhite",   BRAND_COLORS.offWhite);
  root.style.setProperty("--color-cream",      BRAND_COLORS.cream);
  root.style.setProperty("--color-gray",       BRAND_COLORS.gray);
  root.style.setProperty("--color-gray-light", BRAND_COLORS.grayLight);
  root.style.setProperty("--color-success",    BRAND_COLORS.success);
})();

export default BRAND_COLORS;
