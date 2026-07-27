"use client";

import { useEffect } from "react";

/**
 * The medium travelling light — the scroll read-out on the meridian.
 *
 * First attempt walked one lap of the meridian per page, which put the lamp
 * off-screen almost the whole time: these meridians are full ellipses ~1400
 * units tall inside a 2025-unit viewBox that is itself panning, so most of the
 * curve is never in frame.
 *
 * Instead: each frame, find the point where the meridian actually crosses the
 * viewport at the height your scroll position maps to, and put the lamp there.
 * The light stays on the line, stays on screen, and reads as your position.
 *
 * `getScreenCTM()` on the lamp's own group accounts for the layer's CSS pan, so
 * the local→screen mapping is exact (verified against getBoundingClientRect).
 */

const SAMPLES = 260;
/** keep the lamp inside this vertical band of the viewport */
const PAD_TOP = 0.12;
const PAD_BOT = 0.12;

export function GlobeSparks() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = document.querySelector(".fgl-spark");
    if (!layer) return;

    const lamps = Array.from(layer.querySelectorAll<SVGGElement>(".spk-md"))
      .map((el) => {
        const path = layer.querySelector<SVGPathElement>(
          `#${el.dataset.track ?? ""}`
        );
        if (!path) return null;
        const len = path.getTotalLength();
        // sample the curve once — the geometry never changes, only the mapping
        const pts = Array.from({ length: SAMPLES + 1 }, (_, i) => {
          const p = path.getPointAtLength((i / SAMPLES) * len);
          return { x: p.x, y: p.y };
        });
        return { el, pts, group: el.parentNode as SVGGElement };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null);
    if (!lamps.length) return;

    let frame = 0;
    const place = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      const h = innerHeight;
      const targetY = h * PAD_TOP + p * h * (1 - PAD_TOP - PAD_BOT);
      const slackY = h * 0.55;

      for (const l of lamps) {
        const m = l.group.getScreenCTM();
        if (!m) continue;
        let best = -1;
        let bestCost = Number.POSITIVE_INFINITY;
        for (let i = 0; i < l.pts.length; i++) {
          const q = l.pts[i];
          if (!q) continue;
          const sx = m.a * q.x + m.c * q.y + m.e;
          const sy = m.b * q.x + m.d * q.y + m.f;
          // off the sides is disqualifying; otherwise favour the crossing
          // nearest the scroll height, then the left-hand one (the arcs read
          // strongest down the left of the page)
          if (sx < 0 || sx > innerWidth) continue;
          const cost = Math.abs(sy - targetY) + sx * 0.06;
          if (cost < bestCost) {
            bestCost = cost;
            best = i;
          }
        }
        const pt = best >= 0 ? l.pts[best] : null;
        if (!pt || bestCost > slackY) {
          l.el.classList.remove("lit");
          continue;
        }
        l.el.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        l.el.classList.add("lit");
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };

    place();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
