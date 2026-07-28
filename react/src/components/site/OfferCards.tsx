"use client";

import { animate, createTimeline, stagger, utils } from "animejs";
import { useEffect, useRef } from "react";
import { LiquidGlassCard } from "@/components/kokonutui/liquid-glass-card";

/**
 * "Three ways to work with us" — Kokonut liquid-glass cards, driven by anime.js.
 *
 * Entry is one timeline: the cards rise in sequence, then the central offering
 * settles last so the eye lands on it. Hover sweeps a sheen across the glass,
 * staggers the capabilities up, and dims the two you are not reading.
 *
 * All hover state is DOM classes — no React re-render while the pointer moves
 * across three cards holding a blurred glass surface each.
 */

export type Offer = {
  key: string;
  title: string;
  blurb: string;
  caps: string[];
  feature?: boolean;
};

const EASE = "cubicBezier(0.22, 1, 0.36, 1)";

export function OfferCards({ offers }: { offers: Offer[] }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slots = Array.from(el.querySelectorAll<HTMLElement>(".glass-slot"));
    const caps = Array.from(el.querySelectorAll<HTMLElement>(".glass-detail li"));

    if (reduce) {
      el.classList.add("ready");
      return;
    }

    utils.set(slots, { opacity: 0, y: 26 });

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.classList.add("ready");
        const tl = createTimeline({ defaults: { ease: EASE } });
        // the two flanking cards first, the central offering last so it lands
        const flanks = slots.filter((s) => !s.querySelector(".offer.feat"));
        const centre = slots.filter((s) => s.querySelector(".offer.feat"));
        tl.add(flanks, { opacity: 1, y: 0, duration: 620, delay: stagger(110) }, 0)
          .add(centre, { opacity: 1, y: 0, duration: 680 }, 180);
      },
      { threshold: 0.25 }
    );
    io.observe(el);

    const offs: Array<() => void> = [];
    slots.forEach((slot, i) => {
      const sheen = slot.querySelector<HTMLElement>(".glass-sheen");
      const mine = caps.filter((c) => slot.contains(c));

      const on = () => {
        slots.forEach((o, j) => {
          o.classList.toggle("on", j === i);
          o.classList.toggle("off", j !== i);
        });
        animate(slot, { y: -10, duration: 420, ease: "out(3)" });
        if (sheen) {
          animate(sheen, {
            left: ["-40%", "140%"],
            opacity: [{ to: 1, duration: 160 }, { to: 0, duration: 420 }],
            duration: 720,
            ease: "inOut(2)",
          });
        }
        animate(mine, {
          opacity: [0, 1],
          y: [10, 0],
          duration: 420,
          delay: stagger(70),
          ease: "out(3)",
        });
      };
      const off = () => {
        slots.forEach((o) => o.classList.remove("on", "off"));
        animate(slot, { y: 0, duration: 420, ease: "out(3)" });
        animate(mine, { opacity: 0, y: 10, duration: 240, ease: EASE });
      };

      slot.addEventListener("mouseenter", on);
      slot.addEventListener("focusin", on);
      slot.addEventListener("mouseleave", off);
      slot.addEventListener("focusout", off);
      offs.push(() => {
        slot.removeEventListener("mouseenter", on);
        slot.removeEventListener("focusin", on);
        slot.removeEventListener("mouseleave", off);
        slot.removeEventListener("focusout", off);
      });
    });

    return () => {
      io.disconnect();
      offs.forEach((o) => o());
    };
  }, []);

  return (
    <div className="offers" ref={scope}>
      {offers.map((o) => (
        // biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users get the same reading as hover
        <div className="glass-slot" key={o.key} tabIndex={0}>
          <LiquidGlassCard
            className={`offer${o.feature ? " feat" : ""}`}
            glassEffect={false}
            glassSize="lg"
          >
            <span className="glass-sheen" />
            {o.feature ? <div className="feat-tag">Central offering</div> : null}
            <h3>{o.title}</h3>
            <p>{o.blurb}</p>
            <ul className="glass-detail">
              {o.caps.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </LiquidGlassCard>
        </div>
      ))}
    </div>
  );
}
