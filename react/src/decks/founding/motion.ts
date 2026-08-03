"use client";

/**
 * The deck's motion.
 *
 * One mechanism: when a slide becomes active, `revealSlide` walks its `.fd-rise`
 * elements in DOM order and lifts them in on a staggered timeline. Slides do not
 * write their own animation code — they mark what should rise and, optionally,
 * which group it belongs to.
 *
 * Character is a deliberate departure from the reference motion system, which
 * bans overshoot outright. On client direction these curves carry a small,
 * capped overshoot so reveals land with weight rather than easing to a stop.
 * Everything else from that system is kept, because it is about safety rather
 * than taste:
 *
 *   - everything plays once; returning to a slide shows a settled frame
 *   - nothing loops and nothing idles
 *   - reduced motion and print resolve to the settled state, not a fast version
 */

import { animate, createTimeline, stagger, utils } from "animejs";

/** Bouncy but bounded — overshoots ~4% and settles. Never a spring. */
const EASE_RISE = "out(3)";
const EASE_SETTLE = "cubicBezier(0.22, 1, 0.36, 1)";

const STAGGER = 45;
const RISE = 520;

function isStaticDeckMode() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return (
    params.has("print") ||
    params.has("pdf") ||
    params.has("static") ||
    window.matchMedia("print").matches
  );
}

export const prefersReduced = () =>
  (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) ||
  isStaticDeckMode();

/**
 * Lift a slide's contents in. Returns a cleanup that leaves everything settled,
 * so an interrupted reveal never strands an element mid-flight.
 */
export function revealSlide(root: HTMLElement): () => void {
  const items = Array.from(root.querySelectorAll<HTMLElement>(".fd-rise"));
  if (items.length === 0) return () => undefined;

  if (prefersReduced()) {
    utils.set(items, { opacity: 1, y: 0 });
    return () => undefined;
  }

  utils.set(items, { opacity: 0, y: 18 });

  const tl = createTimeline({ defaults: { ease: EASE_RISE } });
  tl.add(items, {
    opacity: 1,
    y: 0,
    duration: RISE,
    delay: stagger(STAGGER),
  });

  return () => {
    tl.pause();
    utils.set(items, { opacity: 1, y: 0 });
  };
}

/**
 * The flywheel's travelling packet. Six nodes on a ring: the packet moves node
 * to node and each step lights as it arrives, so the sequence reads as one
 * circuit rather than six independent pulses.
 */
export function runFlywheel(root: HTMLElement): () => void {
  const packet = root.querySelector<HTMLElement>(".fw-packet");
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(".fw-node"));
  const rows = Array.from(root.querySelectorAll<HTMLElement>(".fw-step"));
  if (!packet || nodes.length === 0) return () => undefined;

  if (prefersReduced()) {
    for (const n of nodes) n.classList.add("lit");
    utils.set(rows, { opacity: 1, x: 0 });
    utils.set(packet, { opacity: 0 });
    return () => undefined;
  }

  utils.set(rows, { opacity: 0, x: 12 });
  utils.set(packet, { opacity: 1 });

  const tl = createTimeline({ defaults: { ease: EASE_SETTLE } });

  nodes.forEach((node, i) => {
    const at = i * 620;
    // offset-path drives the packet; `--t` is its position along the ring.
    tl.add(
      packet,
      {
        "--t": `${(i / nodes.length) * 100}%`,
        duration: 560,
        ease: "inOut(2)",
      },
      at
    ).call(() => node.classList.add("lit"), at + 480);

    if (rows[i]) {
      tl.add(rows[i], { opacity: 1, x: 0, duration: 420, ease: EASE_RISE }, at + 460);
    }
  });

  // One full circuit, then the packet retires. No loop.
  tl.add(packet, { opacity: 0, duration: 320 }, nodes.length * 620);

  return () => {
    tl.pause();
    for (const n of nodes) n.classList.add("lit");
    utils.set(rows, { opacity: 1, x: 0 });
    utils.set(packet, { opacity: 0 });
  };
}

/**
 * Draw an SVG path in. Used by the problem illustration and the structure tree,
 * where the line itself is the content and should arrive rather than appear.
 */
export function drawPaths(root: HTMLElement, selector = ".fd-draw"): () => void {
  const paths = Array.from(root.querySelectorAll<SVGPathElement | SVGLineElement>(selector));
  if (paths.length === 0) return () => undefined;

  const settle = () => {
    for (const p of paths) {
      p.style.strokeDasharray = "";
      p.style.strokeDashoffset = "";
    }
  };

  if (prefersReduced()) {
    settle();
    return () => undefined;
  }

  for (const p of paths) {
    const len = p.getTotalLength();
    p.style.strokeDasharray = `${len}`;
    p.style.strokeDashoffset = `${len}`;
  }

  const anim = animate(paths, {
    strokeDashoffset: 0,
    duration: 720,
    delay: stagger(90),
    ease: EASE_SETTLE,
  });

  return () => {
    anim.pause();
    settle();
  };
}
