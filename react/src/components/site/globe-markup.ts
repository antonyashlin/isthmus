// Globe field markup, ported from the static build. Panned by CSS
// (animation-timeline: scroll) in site.css; colour flips via body.on-light.
//
// THREE independent fixed layers render the same field:
//   .fgl-glow   soft blurred field (a real filter:blur, rasterised once onto its
//               own compositor texture so the scroll-pan is a cheap translate)
//   .fgl-sharp  the crisp line on top of it
//   .fgl-spark  travelling lights — no CSS filter on this layer, because its
//               contents move every frame and a filter would re-rasterise it
const FIELD = `<g transform="rotate(-14 302 -431)"><circle cx="302" cy="-431" r="709" stroke-opacity="0.8"></circle><path d="M -407 -431 A 709 700.3 0 0 1 1011 -431 A 709 700.3 0 0 1 -407 -431" stroke-opacity="0.5"></path><path d="M -407 -431 A 709 674.3 0 0 1 1011 -431 A 709 674.3 0 0 1 -407 -431" stroke-opacity="0.2"></path><path d="M -407 -431 A 709 631.7 0 0 1 1011 -431 A 709 631.7 0 0 1 -407 -431" stroke-opacity="0.08"></path><path d="M -407 -431 A 709 573.6 0 0 1 1011 -431 A 709 573.6 0 0 1 -407 -431" stroke-opacity="0.032"></path></g><g transform="rotate(8 885 1042)"><circle cx="885" cy="1042" r="745" stroke-opacity="0.8"></circle><path d="M 140 1042 A 745 735.8 0 0 1 1630 1042 A 745 735.8 0 0 1 140 1042" stroke-opacity="0.5"></path><path d="M 140 1042 A 745 708.5 0 0 1 1630 1042 A 745 708.5 0 0 1 140 1042" stroke-opacity="0.2"></path><path d="M 140 1042 A 745 663.8 0 0 1 1630 1042 A 745 663.8 0 0 1 140 1042" stroke-opacity="0.08"></path><path d="M 140 1042 A 745 602.7 0 0 1 1630 1042 A 745 602.7 0 0 1 140 1042" stroke-opacity="0.032"></path></g><g transform="rotate(-6 338 2550)"><circle cx="338" cy="2550" r="709" stroke-opacity="0.8"></circle><path d="M -371 2550 A 709 700.3 0 0 1 1047 2550 A 709 700.3 0 0 1 -371 2550" stroke-opacity="0.5"></path><path d="M -371 2550 A 709 674.3 0 0 1 1047 2550 A 709 674.3 0 0 1 -371 2550" stroke-opacity="0.2"></path><path d="M -371 2550 A 709 631.7 0 0 1 1047 2550 A 709 631.7 0 0 1 -371 2550" stroke-opacity="0.08"></path><path d="M -371 2550 A 709 573.6 0 0 1 1047 2550 A 709 573.6 0 0 1 -371 2550" stroke-opacity="0.032"></path></g><line x1="-180" y1="560" x2="1300" y2="70"></line><line x1="-180" y1="1625" x2="1340" y2="1985"></line>`;

const svg = (cls: string, body: string) =>
  `<svg class="fg ${cls}" viewBox="0 0 1200 2025" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>`;

const field = `<g class="gf-field">${FIELD}</g>`;

/* ---------------------------------------------------------------------------
   Travelling lights.
   Each track below is one field line re-declared as a <path> in <defs> so SMIL
   can reference it with <mpath>. The arc/circle geometry is identical to the
   field; the per-globe rotation is carried by the wrapping <g>, because
   animateMotion resolves mpath data in the animated element's own user space
   and ignores the referenced path's ancestors.
   Directions are chosen so the visible half of every track reads downward.
--------------------------------------------------------------------------- */
const TRACKS: Array<[id: string, d: string]> = [
  // globe A (hero) — outline + two meridians
  ["tkAOut", "M 302 -1140 A 709 709 0 1 1 302 278 A 709 709 0 1 1 302 -1140"],
  ["tkAM1", "M -407 -431 A 709 700.3 0 0 1 1011 -431 A 709 700.3 0 0 1 -407 -431"],
  ["tkAM2", "M -407 -431 A 709 631.7 0 0 1 1011 -431 A 709 631.7 0 0 1 -407 -431"],
  // globe B (mid page)
  ["tkBOut", "M 885 297 A 745 745 0 1 1 885 1787 A 745 745 0 1 1 885 297"],
  ["tkBM1", "M 140 1042 A 745 735.8 0 0 1 1630 1042 A 745 735.8 0 0 1 140 1042"],
  ["tkBM2", "M 140 1042 A 745 663.8 0 0 1 1630 1042 A 745 663.8 0 0 1 140 1042"],
  // globe C (foot of the page)
  ["tkCOut", "M 338 1841 A 709 709 0 1 1 338 3259 A 709 709 0 1 1 338 1841"],
  ["tkCM1", "M -371 2550 A 709 700.3 0 0 1 1047 2550 A 709 700.3 0 0 1 -371 2550"],
  // the two straight rays — authored top-down so the lights run downhill
  ["tkR1", "M 1300 70 L -180 560"],
  ["tkR2", "M -180 1625 L 1340 1985"],
];

/** one light: concentric rings (no SVG filter — cheap, and themeable via CSS fill) */
const lamp = (s: number) =>
  `<circle r="${(9 * s).toFixed(1)}" class="lp-3"></circle>` +
  `<circle r="${(5.4 * s).toFixed(1)}" class="lp-2"></circle>` +
  `<circle r="${(2.6 * s).toFixed(1)}" class="lp-1"></circle>` +
  `<circle r="${(1.3 * s).toFixed(1)}" class="lp-0"></circle>`;

/** a small light looping a track on its own clock (SMIL, phase-offset by `begin`) */
const spark = (track: string, dur: number, begin: number) =>
  `<g class="spk">${lamp(1)}<animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" fill="freeze"><mpath href="#${track}" xlink:href="#${track}"></mpath></animateMotion></g>`;

/** the medium light — positioned from scroll progress by GlobeSparks.tsx */
const scrollLamp = (track: string, phase: number) =>
  `<g class="spk-md" data-track="${track}" data-phase="${phase}">${lamp(2.1)}</g>`;

const SPARKS =
  `<defs>${TRACKS.map(([id, d]) => `<path id="${id}" d="${d}"></path>`).join("")}</defs>` +
  // globe A
  `<g transform="rotate(-14 302 -431)">${spark("tkAOut", 30, 0)}${spark("tkAOut", 30, -15)}` +
  `${spark("tkAM1", 24, -4)}${spark("tkAM1", 24, -16)}${spark("tkAM2", 34, -9)}` +
  `${scrollLamp("tkAM1", 0)}</g>` +
  // globe B
  `<g transform="rotate(8 885 1042)">${spark("tkBOut", 32, 0)}${spark("tkBOut", 32, -16)}` +
  `${spark("tkBM1", 26, -6)}${spark("tkBM1", 26, -19)}${spark("tkBM2", 36, -11)}` +
  `${scrollLamp("tkBM1", 0.34)}</g>` +
  // globe C
  `<g transform="rotate(-6 338 2550)">${spark("tkCOut", 30, -8)}${spark("tkCOut", 30, -23)}` +
  `${spark("tkCM1", 28, -13)}${scrollLamp("tkCM1", 0.68)}</g>` +
  // the straight rays
  `<g>${spark("tkR1", 13, 0)}${spark("tkR1", 13, -6.5)}${spark("tkR1", 19, -11)}` +
  `${spark("tkR2", 15, -3)}${spark("tkR2", 15, -10.5)}</g>`;

export const GLOBE_HTML = `<div class="gf-rule" aria-hidden="true"></div>
${svg("fgl-glow", field)}
${svg("fgl-sharp", field)}
${svg("fgl-spark", SPARKS)}`;
