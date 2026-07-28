"use client";

import { createTimeline, stagger, utils } from "animejs";
import { useEffect, useRef } from "react";

/**
 * "Built for private-market operating work" — six switches that travel from the
 * way this work is usually done to the way we do it.
 *
 * The motion is the argument: the track fills as the marker leaves the old
 * position, the old label recedes, and ours arrives lit. anime.js runs one
 * timeline per row so fill, marker and both labels move as a single gesture
 * rather than three animations that happen to overlap.
 */

const PAIRS = [
  ["Integrated", "fragmented"],
  ["Embedded", "external"],
  ["Execution", "software licenses"],
  ["Investment-specific", "generic"],
  ["AI-enabled", "labor-only"],
  ["Scalable", "dependent on internal hiring"],
] as const;

const EASE = "cubicBezier(0.22, 1, 0.36, 1)";

export function ContrastSwitches() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".cs-row"));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const parts = rows.map((r) => ({
      row: r,
      fill: r.querySelector<HTMLElement>(".cs-fill"),
      knob: r.querySelector<HTMLElement>(".cs-knob"),
      no: r.querySelector<HTMLElement>(".cs-no"),
      yes: r.querySelector<HTMLElement>(".cs-yes"),
    }));

    const settle = () => {
      for (const p of parts) {
        if (p.fill) utils.set(p.fill, { width: "100%" });
        if (p.knob) utils.set(p.knob, { left: "100%" });
        if (p.no) utils.set(p.no, { opacity: 0.34 });
        if (p.yes) utils.set(p.yes, { opacity: 1 });
        p.row.classList.add("landed");
      }
    };

    if (reduce) {
      settle();
      return;
    }

    const rest = () => {
      for (const p of parts) {
        if (p.fill) utils.set(p.fill, { width: "0%" });
        if (p.knob) utils.set(p.knob, { left: "0%" });
        if (p.no) utils.set(p.no, { opacity: 1 });
        if (p.yes) utils.set(p.yes, { opacity: 0.3 });
        p.row.classList.remove("landed");
      }
    };
    rest();

    /** one gesture: the marker leaves, the track fills behind it, labels swap */
    const throwRow = (i: number, delay = 0) => {
      const p = parts[i];
      if (!p) return;
      const tl = createTimeline({ defaults: { ease: EASE }, delay });
      tl.add(p.knob ?? [], {
        left: ["0%", "100%"],
        duration: 720,
        ease: "out(4)",
        onBegin: () => p.row.classList.remove("landed"),
        onComplete: () => p.row.classList.add("landed"),
      }, 0)
        .add(p.fill ?? [], { width: ["0%", "100%"], duration: 720, ease: "out(4)" }, 0)
        .add(p.no ?? [], { opacity: [1, 0.34], duration: 520 }, 60)
        .add(p.yes ?? [], { opacity: [0.3, 1], duration: 520 }, 240);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const step = stagger(90) as unknown as (
          t: unknown,
          i: number,
          n: number
        ) => number;
        parts.forEach((_, i) => throwRow(i, step(null, i, parts.length)));
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    const offs: Array<() => void> = [];
    parts.forEach((p, i) => {
      const again = () => throwRow(i);
      p.row.addEventListener("mouseenter", again);
      p.row.addEventListener("focusin", again);
      offs.push(() => {
        p.row.removeEventListener("mouseenter", again);
        p.row.removeEventListener("focusin", again);
      });
    });

    return () => {
      io.disconnect();
      offs.forEach((o) => o());
    };
  }, []);

  return (
    <div className="switches" ref={scope}>
      <div aria-hidden="true" className="cs-head">
        <span>how it is usually done</span>
        <span>with us</span>
      </div>
      {PAIRS.map(([yes, no]) => (
        // biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users get the same reading as hover
        <div className="cs-row" key={yes} tabIndex={0}>
          <span className="cs-no">{no}</span>
          <span className="cs-track">
            <span className="cs-fill" />
            <span className="cs-knob" />
          </span>
          <span className="cs-yes">{yes}</span>
        </div>
      ))}
    </div>
  );
}
