"use client";

import { animate, createTimeline, utils } from "animejs";
import { useEffect, useRef } from "react";

/**
 * "We run the work" — work moving through the bench.
 *
 * An anime.js timeline drives one packet along the track; the trailing fill
 * follows it, and each waypoint flares as the packet lands. Positions are
 * measured from the live dots rather than assumed, so the packet stays welded to
 * them at any column width.
 *
 * Pointing at a step takes the timeline over and seeks to that step instead of
 * fighting it, and releasing hands it back — the motion is never something you
 * have to wait out.
 */

const STEPS = [
  {
    k: "You send",
    p: "A deal, a model, a reporting need, a fundraise, a research question.",
  },
  {
    k: "We operate",
    p: "On an AI-first bench, to your firm's standard, at the pace of a live raise.",
    feat: true,
  },
  {
    k: "You receive",
    p: "Completed, institutional-grade work, ready for the IC or the LP.",
  },
] as const;

const TRAVEL = 900;
const DWELL = 1100;

export function FlowDiagram() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const packet = el.querySelector<HTMLElement>(".flow-packet");
    const fill = el.querySelector<HTMLElement>(".flow-fill");
    const dots = Array.from(el.querySelectorAll<HTMLElement>(".fdot"));
    const steps = Array.from(el.querySelectorAll<HTMLElement>(".fstep"));
    if (!(packet && fill) || !dots.length) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** dot centres, in px from the track's left edge */
    let xs: number[] = [];
    const measure = () => {
      const base = el.getBoundingClientRect().left;
      xs = dots.map((d) => {
        const r = d.getBoundingClientRect();
        return r.left + r.width / 2 - base;
      });
    };
    measure();

    const light = (i: number) => {
      steps.forEach((s, j) => s.classList.toggle("lit", j === i));
    };

    if (reduce) {
      light(1);
      utils.set(packet, { x: xs[1] ?? 0, opacity: 1 });
      utils.set(fill, { width: xs[1] ?? 0 });
      return;
    }

    utils.set(packet, { x: xs[0] ?? 0 });
    utils.set(fill, { width: xs[0] ?? 0 });

    const tl = createTimeline({ loop: true, defaults: { ease: "inOut(2)" } });
    for (let i = 0; i < xs.length; i++) {
      const from = xs[i === 0 ? xs.length - 1 : i - 1] ?? 0;
      const to = xs[i] ?? 0;
      // the first leg of each lap restarts from the left rather than sliding back
      const jump = i === 0;
      tl.add(packet, {
        x: jump ? [to, to] : [from, to],
        opacity: jump ? [0, 1] : 1,
        duration: jump ? 260 : TRAVEL,
        onBegin: () => light(i),
      }).add(
        fill,
        { width: to, duration: jump ? 260 : TRAVEL },
        jump ? "<<" : "<<"
      );
      // land: the waypoint takes the hit, then settles
      tl.add(dots[i] as HTMLElement, {
        scale: [1, 1.55, 1],
        duration: 520,
        ease: "out(3)",
      }).add(packet, { duration: DWELL }, "<<");
    }

    // pointing at a step takes the loop over; leaving hands it back
    const enter = (i: number) => () => {
      tl.pause();
      light(i);
      animate(packet, { x: xs[i] ?? 0, duration: 420, ease: "out(3)" });
      animate(fill, { width: xs[i] ?? 0, duration: 420, ease: "out(3)" });
    };
    const leave = () => tl.play();

    const offs: Array<() => void> = [];
    steps.forEach((s, i) => {
      const on = enter(i);
      s.addEventListener("mouseenter", on);
      s.addEventListener("focusin", on);
      s.addEventListener("mouseleave", leave);
      s.addEventListener("focusout", leave);
      offs.push(() => {
        s.removeEventListener("mouseenter", on);
        s.removeEventListener("focusin", on);
        s.removeEventListener("mouseleave", leave);
        s.removeEventListener("focusout", leave);
      });
    });

    const onResize = () => measure();
    addEventListener("resize", onResize);

    return () => {
      tl.pause();
      offs.forEach((o) => o());
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="flow reveal" ref={root}>
      <div className="flow-track" />
      <div className="flow-fill" />
      <span className="flow-packet" />
      {STEPS.map((s) => (
        // biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users can steer the loop
        <div className="fstep" key={s.k} tabIndex={0}>
          <span className={`fdot${"feat" in s && s.feat ? " feat" : ""}`} />
          <div className="fk">{s.k}</div>
          <p>{s.p}</p>
        </div>
      ))}
    </div>
  );
}
