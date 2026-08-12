// js/colors.js
// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for MR. DUVAL brand palette.
// • Injected at runtime as CSS custom properties (consumed by style.css)
// • Exported as a JS object (consumed by main.js and any future scripts)
// Fine-tuned to match the flyer's roof-tile red / charcoal / white palette.
// ─────────────────────────────────────────────────────────────────────────────

const BRAND_COLORS = {
  red:       "#CC1F25", // primary brand red — roof-tile red sampled from flyer logo
  redDark:   "#9E1519", // hover / active state (deeper crimson)
  redLight:  "#E8353B", // lighter tint for gradients / accents
  black:     "#141414", // primary text / dark hero sections
  charcoal:  "#1F1F1F", // secondary dark surface / cards on dark bg
  white:     "#FFFFFF",
  offWhite:  "#F4F4F2", // section backgrounds (warm, not clinical)
  gray:      "#6B6B6B", // muted body text / meta
  grayLight: "#D0D0D0", // borders / dividers
  success:   "#2E7D32", // guarantee checkmarks — used sparingly
};

// ── Inject as CSS custom properties ──────────────────────────────────────────
(function injectCSSVars() {
  const root = document.documentElement;
  root.style.setProperty("--color-red",        BRAND_COLORS.red);
  root.style.setProperty("--color-red-dark",   BRAND_COLORS.redDark);
  root.style.setProperty("--color-red-light",  BRAND_COLORS.redLight);
  root.style.setProperty("--color-black",      BRAND_COLORS.black);
  root.style.setProperty("--color-charcoal",   BRAND_COLORS.charcoal);
  root.style.setProperty("--color-white",      BRAND_COLORS.white);
  root.style.setProperty("--color-offwhite",   BRAND_COLORS.offWhite);
  root.style.setProperty("--color-gray",       BRAND_COLORS.gray);
  root.style.setProperty("--color-gray-light", BRAND_COLORS.grayLight);
  root.style.setProperty("--color-success",    BRAND_COLORS.success);
})();

export default BRAND_COLORS;
