"use client";

import { animate, stagger, utils } from "animejs";
import { useEffect, useRef, useState } from "react";

/**
 * "From periodic reporting to on-demand analysis" — three panels that each show
 * their claim rather than captioning it: a share filling in, a turnaround
 * collapsing, a report getting finer. anime.js drives all three.
 *
 * Every panel replays on hover or focus, so the evidence is repeatable instead
 * of a one-shot you might scroll past.
 */

const TICKS = 40;
const LIT = Math.round(TICKS * 0.58);
const ROWS_COARSE = 3;
const ROWS_FINE = 12;

export function ExpectationPanels() {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  const play = (which: number) => {
    const el = root.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (which === 0) {
      const ticks = el.querySelectorAll(".xp-tick");
      if (reduce) {
        utils.set(ticks, { opacity: 1 });
      } else {
        utils.set(ticks, { opacity: 0.18, scaleY: 0.55 });
        animate(Array.from(ticks).slice(0, LIT), {
          opacity: 1,
          scaleY: 1,
          duration: 420,
          delay: stagger(22),
          ease: "out(3)",
        });
      }
      const n = { v: 0 };
      animate(n, {
        v: 58,
        duration: reduce ? 0 : 1100,
        ease: "out(3)",
        onUpdate: () => setCount(Math.round(n.v)),
      });
    }

    // scaleX, not width: this replays on every hover, and animating width
    // forces layout + paint on each of ~54 frames. The bar is laid out at
    // full width in CSS and collapses toward its left anchor (transform-origin
    // 0 50%), which is visually identical and rides the compositor.
    if (which === 1) {
      const bar = el.querySelector(".xp-bar-fill");
      if (!bar) return;
      utils.set(bar, { scaleX: 1 });
      if (!reduce) {
        animate(bar, { scaleX: 0.14, duration: 900, ease: "inOut(3)" });
      } else {
        utils.set(bar, { scaleX: 0.14 });
      }
    }

    if (which === 2) {
      const rows = el.querySelectorAll(".xp-row");
      if (reduce) {
        utils.set(rows, { opacity: 1, scaleX: 1 });
        return;
      }
      utils.set(rows, { opacity: 0, scaleX: 0.2 });
      animate(Array.from(rows).slice(0, ROWS_COARSE), {
        opacity: 1,
        scaleX: 1,
        duration: 380,
        delay: stagger(60),
        ease: "out(3)",
      });
      animate(Array.from(rows).slice(ROWS_COARSE), {
        opacity: 1,
        scaleX: 1,
        duration: 420,
        delay: stagger(38, { start: 620 }),
        ease: "out(3)",
      });
    }
  };

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        play(0);
        play(1);
        play(2);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
    // biome-ignore lint/correctness/useExhaustiveDependencies: play reads refs only
  }, []);

  const panel = (i: number) => ({
    onMouseEnter: () => play(i),
    onFocus: () => play(i),
    tabIndex: 0,
  });

  return (
    <div className="xpanels" ref={root}>
      {/* 1 — the share, filled in tick by tick */}
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users can replay it */}
      <div className="xpanel" {...panel(0)}>
        <div className="xp-figure">
          {count}
          <span className="xp-unit">%</span>
        </div>
        <div className="xp-ticks">
          {Array.from({ length: TICKS }, (_, i) => (
            <span className="xp-tick" key={`t${i + 1}`} />
          ))}
        </div>
        <p className="xp-cap">of CFOs report more detailed LP information requests.</p>
      </div>

      {/* 2 — the turnaround, collapsing */}
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users can replay it */}
      <div className="xpanel" {...panel(1)}>
        <div className="xp-figure">Hours</div>
        <div className="xp-bar">
          <span className="xp-bar-fill" />
          <span className="xp-bar-from">days</span>
          <span className="xp-bar-to">hours</span>
        </div>
        <p className="xp-cap">Expected response speed is compressing from days toward hours.</p>
      </div>

      {/* 3 — the report, getting finer */}
      {/* biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users can replay it */}
      <div className="xpanel" {...panel(2)}>
        <div className="xp-figure">Baseline</div>
        <div className="xp-rows">
          {Array.from({ length: ROWS_FINE }, (_, i) => (
            <span
              className={`xp-row${i >= ROWS_COARSE ? " fine" : ""}`}
              key={`r${i + 1}`}
            />
          ))}
        </div>
        <p className="xp-cap">
          Granular, standardized reporting is becoming the expectation, not the exception.
        </p>
      </div>
    </div>
  );
}
