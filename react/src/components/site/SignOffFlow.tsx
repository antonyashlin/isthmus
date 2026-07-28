"use client";

import { animate, type AnimationParams, createTimeline, utils } from "animejs";
import { useEffect, useRef } from "react";

/**
 * "Nothing reaches your desk without a sign-off" — the same packet-on-a-track
 * rig as FlowDiagram, extended to four waypoints so the human checkpoint
 * between the AI draft and the client's own approval is explicit rather than
 * implied.
 */

const STEPS = [
  {
    k: "AI drafts",
    p: "First-pass work from an AI-first bench, built to your firm's structure and standard.",
  },
  {
    k: "Bench reviews",
    p: "A senior analyst checks it against your standard before it ever reaches you.",
    feat: true,
  },
  {
    k: "You sign off",
    p: "Nothing ships to an IC or an LP without your team's approval.",
  },
  {
    k: "IC / LP receives",
    p: "Completed, institutional-grade work, delivered ready to use.",
  },
] as const;

const TRAVEL = 900;
const DWELL = 1100;

export function SignOffFlow() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const packet = el.querySelector<HTMLElement>(".soflow-packet");
    const fill = el.querySelector<HTMLElement>(".soflow-fill");
    const dots = Array.from(el.querySelectorAll<HTMLElement>(".sodot"));
    const steps = Array.from(el.querySelectorAll<HTMLElement>(".sostep"));
    if (!(packet && fill) || !dots.length) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* On mobile the rail is vertical and the packet travels DOWNWARDS, so the
       whole thing is measured and animated on the cross axis instead. */
    let vertical = matchMedia("(max-width:760px)").matches;
    /** dot centres in px, along whichever axis the rail runs */
    let xs: number[] = [];
    const measure = () => {
      vertical = matchMedia("(max-width:760px)").matches;
      const box = el.getBoundingClientRect();
      xs = dots.map((d) => {
        const r = d.getBoundingClientRect();
        return vertical
          ? r.top + r.height / 2 - box.top
          : r.left + r.width / 2 - box.left;
      });
    };
    measure();
    const along = (v: number): AnimationParams =>
      (vertical ? { y: v } : { x: v }) as AnimationParams;
    const grow = (v: number): AnimationParams =>
      (vertical ? { height: v, width: "1.5px" } : { width: v }) as AnimationParams;

    const light = (i: number) => {
      steps.forEach((s, j) => s.classList.toggle("lit", j === i));
    };

    if (reduce) {
      light(1);
      utils.set(packet, { ...along(xs[1] ?? 0), opacity: 1 });
      utils.set(fill, grow(xs[1] ?? 0));
      return;
    }

    utils.set(packet, along(xs[0] ?? 0));
    utils.set(fill, grow(xs[0] ?? 0));

    const tl = createTimeline({ loop: true, defaults: { ease: "inOut(2)" } });
    for (let i = 0; i < xs.length; i++) {
      const from = xs[i === 0 ? xs.length - 1 : i - 1] ?? 0;
      const to = xs[i] ?? 0;
      // the first leg of each lap restarts from the left rather than sliding back
      const jump = i === 0;
      const move = (vertical
        ? { y: jump ? [to, to] : [from, to] }
        : { x: jump ? [to, to] : [from, to] }) as AnimationParams;
      tl.add(packet, {
        ...move,
        opacity: jump ? [0, 1] : 1,
        duration: jump ? 260 : TRAVEL,
        onBegin: () => light(i),
      }).add(fill, { ...grow(to), duration: jump ? 260 : TRAVEL }, "<<");
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
      animate(packet, { ...along(xs[i] ?? 0), duration: 420, ease: "out(3)" });
      animate(fill, { ...grow(xs[i] ?? 0), duration: 420, ease: "out(3)" });
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
    <div className="soflow reveal" ref={root}>
      <div className="soflow-track" />
      <div className="soflow-fill" />
      <span className="soflow-packet" />
      {STEPS.map((s) => (
        // biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users can steer the loop
        <div className="sostep" key={s.k} tabIndex={0}>
          <span className={`sodot${"feat" in s && s.feat ? " feat" : ""}`} />
          <div className="sok">{s.k}</div>
          <p>{s.p}</p>
        </div>
      ))}
    </div>
  );
}
