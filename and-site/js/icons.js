/*
 * AND Capital — icon system. "Cut from the wordmark."
 *
 * Every icon is built only from what the AND wordmark is made of:
 *   - the stem: straight strokes with flat, square-cut ends, like the letters;
 *   - the A's angle: every diagonal runs at the A's leg slope (0.378 across for 1 down);
 *   - the D's bowl: every curve is a true semicircle, like the D;
 *   - the A's counter: the triangle inside the A, drawn at the same angle, in emerald.
 * Each icon carries exactly one counter. It is the signature of the set and its only colour.
 */
(function (global) {
  const EMERALD = "#4FB97A";
  const K = 0.378; // the A's leg: horizontal run per unit of height

  // The counter, apex up: centre x, base y, height.
  const counter = (cx, by, h) => `M${cx} ${by - h}L${+(cx + K * h).toFixed(2)} ${by}H${+(cx - K * h).toFixed(2)}Z`;
  // The counter turned to point right (used once, as the arrow's head): apex x, centre y, length.
  const counterRight = (ax, cy, h) => `M${ax} ${cy}L${ax - h} ${+(cy + K * h).toFixed(2)}V${+(cy - K * h).toFixed(2)}Z`;

  // paths: strokes on a 24-unit box. and: the counter.
  const ICONS = {
    // Why complexity is mispriced
    understanding: { label: "Deep Understanding", paths: ["M3 8H21", "M4 8A8 8 0 0 0 20 8"], and: counter(12, 14, 5.2) },
    hidden:        { label: "Hidden Opportunities", paths: ["M6 4H8A8 8 0 0 1 8 20H6Z"], and: counter(10.5, 15.5, 5) },
    speed:         { label: "The Speed Trap", paths: ["M4 20L10 4", "M9 20L15 4", "M19.5 4V20"], and: counter(16.4, 20, 4.5) },
    // Institutional infrastructure
    process:       { label: "Systematic Process", paths: ["M4 20V4L10 20V4L16 20V4"], and: counter(19.5, 20, 5) },
    efficiency:    { label: "Operational Efficiency", paths: ["M3 13H21", "M7 8V18", "M17 8V18"], and: counter(12, 11.9, 6) },
    data:          { label: "Data-Informed Decisions", paths: ["M6 20V15", "M12 20V10", "M18 20V5"], and: counter(6, 12.5, 4.5) },
    // How we decide
    curiosity:     { label: "First Principles", paths: ["M6 20L11.3 6H12.7L18 20"], and: counter(12, 16, 5) },
    immersion:     { label: "Deep Immersion", paths: ["M3 7H21", "M12 3V13"], and: counter(12, 21, 6) },
    separation:    { label: "Headline vs Structural", paths: ["M4 5H20", "M6 20V11H18V20"], and: counter(12, 19, 5) },
    durability:    { label: "Durable Structures", paths: ["M4 4H20", "M4 20H20", "M8 4V20", "M16 4V20"], and: counter(12, 15, 5) },
    // Focus areas
    health:        { label: "Health & Wellness", paths: ["M12 4V20", "M4 12H20"], and: counter(16.5, 19.5, 4.5) },
    assets:        { label: "Real Assets", paths: ["M4 20V10H11V4H20V20Z"], and: counter(7.5, 18.5, 4.5) },
    energy:        { label: "Energy Transition", paths: ["M2 14A3.5 3.5 0 0 1 9 14A3.5 3.5 0 0 0 16 14"], and: counter(19.5, 17.5, 7) },
    // Firm and audiences
    alignment:     { label: "GP Commitment", paths: ["M5 20L11 4", "M13 20L19 4"], and: counter(10, 19, 5) },
    transactions:  { label: "Transactions", paths: ["M10 5A7 7 0 0 0 10 19", "M14 5A7 7 0 0 1 14 19"], and: counter(12, 15, 5) },
    partners:      { label: "Limited Partners", paths: ["M3 20L7.2 9L11.4 20", "M12.6 20L16.8 9L21 20"], and: counter(12, 8, 4.5) },
    companies:     { label: "For Companies", paths: ["M7 3H17V21H7Z", "M7 8H17", "M7 16H17"], and: counter(12, 14.6, 4.2) },
    funds:         { label: "Prior Funds", paths: ["M8 10H16", "M6 15H18", "M4 20H20"], and: counter(12, 8, 4.5) },
    // Interface
    arrow:         { label: "Forward", paths: ["M3 12H15"], and: counterRight(21, 12, 6) },
    contact:       { label: "Contact", paths: ["M4 6H20V18H4Z", "M4 10H20"], and: counter(12, 16.5, 4.5) },
  };

  /**
   * svg(name, { size, theme, stroke }) -> SVG markup string.
   * theme "dark" draws white, "light" draws ink. Without a theme the strokes follow
   * currentColor, so icons take the colour of the text they sit in.
   */
  function svg(name, opts = {}) {
    const ic = ICONS[name];
    if (!ic) return "";
    const size = opts.size || 24;
    const ink = opts.theme === "light" ? "#0A0E0C" : opts.theme === "dark" ? "#FFFFFF" : "currentColor";
    const sw = opts.stroke || 2.2;
    let s = `<svg class="and-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">`;
    s += `<g stroke="${ink}" stroke-width="${sw}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10">`;
    ic.paths.forEach((d) => { s += `<path class="and-icon-line" d="${d}" pathLength="1"/>`; });
    s += `</g><path class="and-icon-and" d="${ic.and}" fill="${EMERALD}"/></svg>`;
    return s;
  }

  /** Replaces every <i data-icon="name"> with its SVG. */
  function mount(root = document) {
    root.querySelectorAll("[data-icon]").forEach((el) => {
      if (el.dataset.mounted) return;
      el.innerHTML = svg(el.dataset.icon, { size: +el.dataset.size || 24 });
      el.dataset.mounted = "1";
    });
  }

  global.ANDIcons = { ICONS, svg, mount };
})(window);
