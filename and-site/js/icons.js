/*
 * AND Capital — icon system. "One grid. Every line meets at AND."
 *
 * Every icon is drawn on the same 3x3 node grid (24-unit box, nodes at 4 / 12 / 20).
 * Straight joins only, one 1.25 stroke weight, square terminals: firm, not friendly.
 * Nodes a line touches are solid squares; untouched nodes stay as faint points so the
 * grid is always legible. Each icon carries exactly one emerald node: the conjunction,
 * the point the idea resolves to. That node is the signature of the set.
 */
(function (global) {
  const P = [4, 12, 20];
  const EMERALD = "#4FB97A";

  // lines: [[c,r],[c,r]] segments on the grid; and: the emerald node.
  const ICONS = {
    // Why complexity is mispriced
    understanding: { label: "Deep Understanding", lines: [[[0, 0], [2, 0]], [[0, 1], [2, 1]], [[1, 0], [1, 2]]], and: [1, 2] },
    hidden:        { label: "Hidden Opportunities", lines: [[[0, 2], [0, 1]], [[0, 1], [1, 1]], [[1, 1], [1, 0]], [[1, 0], [2, 0]]], and: [2, 0] },
    speed:         { label: "The Speed Trap", lines: [[[0, 0], [2, 0]], [[0, 1], [2, 1]], [[0, 2], [1, 2]]], and: [1, 2] },
    // Institutional infrastructure
    process:       { label: "Systematic Process", lines: [[[0, 0], [2, 0]], [[2, 0], [2, 1]], [[2, 1], [0, 1]], [[0, 1], [0, 2]], [[0, 2], [2, 2]]], and: [2, 2] },
    efficiency:    { label: "Operational Efficiency", lines: [[[0, 0], [2, 1]], [[0, 1], [2, 1]], [[0, 2], [2, 1]]], and: [2, 1] },
    data:          { label: "Data-Informed Decisions", lines: [[[0, 2], [2, 2]], [[0, 2], [0, 1]], [[1, 2], [1, 0]], [[2, 2], [2, 1]]], and: [1, 0] },
    // How we decide
    curiosity:     { label: "First Principles", lines: [[[1, 0], [2, 1]], [[2, 1], [1, 2]], [[1, 2], [0, 1]], [[0, 1], [1, 0]]], and: [1, 1] },
    immersion:     { label: "Deep Immersion", lines: [[[1, 0], [1, 2]], [[0, 1], [1, 2]], [[2, 1], [1, 2]]], and: [1, 2] },
    separation:    { label: "Headline vs Structural", lines: [[[0, 0], [0, 2]], [[2, 0], [2, 2]]], and: [1, 1] },
    durability:    { label: "Durable Structures", lines: [[[1, 0], [0, 2]], [[1, 0], [2, 2]], [[0, 2], [2, 2]], [[1, 0], [1, 2]]], and: [1, 0] },
    // Focus areas
    health:        { label: "Health & Wellness", lines: [[[1, 0], [1, 2]], [[0, 1], [2, 1]]], and: [1, 1] },
    assets:        { label: "Real Assets", lines: [[[0, 2], [0, 1]], [[0, 1], [1, 0]], [[1, 0], [2, 1]], [[2, 1], [2, 2]], [[0, 2], [2, 2]]], and: [1, 2] },
    energy:        { label: "Energy Transition", lines: [[[2, 0], [0, 1]], [[0, 1], [2, 1]], [[2, 1], [0, 2]]], and: [0, 2] },
    // Firm and audiences
    alignment:     { label: "GP Commitment", lines: [[[0, 0], [1, 1]], [[2, 0], [1, 1]], [[1, 1], [1, 2]]], and: [1, 1] },
    transactions:  { label: "Transactions", lines: [[[0, 0], [2, 2]], [[0, 2], [2, 0]]], and: [1, 1] },
    partners:      { label: "Limited Partners", lines: [[[0, 0], [2, 0]], [[0, 0], [1, 2]], [[2, 0], [1, 2]]], and: [1, 2] },
    companies:     { label: "For Companies", lines: [[[0, 0], [0, 2]], [[0, 0], [2, 0]], [[2, 0], [2, 2]], [[0, 2], [2, 2]]], and: [2, 2] },
    funds:         { label: "Prior Funds", lines: [[[0, 0], [0, 2]], [[1, 0], [1, 2]], [[0, 2], [2, 2]]], and: [2, 0] },
    // Interface
    arrow:         { label: "Forward", lines: [[[0, 1], [2, 1]], [[1, 0], [2, 1]], [[1, 2], [2, 1]]], and: [2, 1] },
    contact:       { label: "Contact", lines: [[[0, 0], [2, 0]], [[0, 0], [1, 1]], [[2, 0], [1, 1]], [[0, 0], [0, 2]], [[2, 0], [2, 2]], [[0, 2], [2, 2]]], and: [1, 1] },
  };

  const key = (c, r) => c + "," + r;

  /**
   * svg(name, { size, theme, stroke }) -> SVG markup string.
   * theme "dark" draws white on dark, "light" draws ink on white. Ink follows currentColor
   * when theme is omitted, so icons inherit text colour in place.
   */
  function svg(name, opts = {}) {
    const ic = ICONS[name];
    if (!ic) return "";
    const size = opts.size || 24;
    const ink = opts.theme === "light" ? "#0A0E0C" : opts.theme === "dark" ? "#FFFFFF" : "currentColor";
    const sw = opts.stroke || 1.25;
    const used = new Set();
    ic.lines.forEach(([a, b]) => { used.add(key(...a)); used.add(key(...b)); });
    const and = key(...ic.and);

    let s = `<svg class="and-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">`;
    s += `<g stroke="${ink}" stroke-width="${sw}" stroke-linecap="square" stroke-linejoin="miter">`;
    ic.lines.forEach(([[c1, r1], [c2, r2]]) => {
      s += `<line class="and-icon-line" x1="${P[c1]}" y1="${P[r1]}" x2="${P[c2]}" y2="${P[r2]}" pathLength="1"/>`;
    });
    s += `</g>`;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const k = key(c, r);
      const x = P[c], y = P[r];
      if (k === and) continue;
      if (used.has(k)) s += `<rect class="and-icon-node" x="${x - 1.4}" y="${y - 1.4}" width="2.8" height="2.8" fill="${ink}"/>`;
      else s += `<rect class="and-icon-dot" x="${x - 0.6}" y="${y - 0.6}" width="1.2" height="1.2" fill="${ink}" opacity=".32"/>`;
    }
    const [ac, ar] = ic.and;
    s += `<rect class="and-icon-and" x="${P[ac] - 2.1}" y="${P[ar] - 2.1}" width="4.2" height="4.2" fill="${EMERALD}"/>`;
    s += `</svg>`;
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
