"use client";

import { useEffect } from "react";
import { animate, inView, stagger } from "motion";

// Entrance choreography + theme flip, ported from the static build's motion.js.
// Class-based (the ported site.css drives the visuals); Bklit charts animate themselves.
export function ScrollFx() {
  useEffect(() => {
    const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
    document.documentElement.classList.add("js");

    const reveal = (section: Element) => {
      const items = section.querySelectorAll(".reveal");
      if (!items.length) return;
      if (REDUCE) {
        items.forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "none";
        });
        return;
      }
      animate(
        items,
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.6, delay: stagger(0.07), ease: EASE }
      );
    };

    // The five journey dots and the four sign-off dots. There is no longer a
    // `.journey-track` / `.flow-track` element to draw — both rows are strung
    // together by AnimatedBeams now (see the note at site.css:576) — so this
    // only handles the dots themselves. They enter from 0.9 with an opacity
    // fade rather than scale(0): a 15px ring with a glow that pops out of
    // nothing reads as a glitch, and bounce stays subtle to match the rest.
    const tracks = (section: Element) => {
      const dots = section.querySelectorAll(".jdot, .sodot");
      if (!dots.length) return;
      if (REDUCE) {
        dots.forEach((d) => {
          (d as HTMLElement).style.transform = "none";
          (d as HTMLElement).style.opacity = "1";
        });
        return;
      }
      animate(
        dots,
        { scale: [0.9, 1], opacity: [0, 1] },
        {
          type: "spring",
          duration: 0.5,
          bounce: 0.2,
          delay: (i: number) => 0.4 + i * 0.11,
        }
      );
    };

    const counts = (section: Element) => {
      if (REDUCE) return;
      section.querySelectorAll("[data-count]").forEach((el) => {
        const target = parseFloat(el.getAttribute("data-count") || "0");
        const suffix = el.getAttribute("data-suffix") || "";
        animate(0, target, {
          duration: 1.0,
          ease: EASE,
          delay: 0.3,
          onUpdate: (v: number) => {
            el.textContent = Math.round(v) + suffix;
          },
        });
      });
    };

    const seen = new WeakSet<Element>();
    const stops: Array<() => void> = [];
    document.querySelectorAll(".hero, main > section").forEach((section) => {
      const stop = inView(
        section,
        () => {
          if (seen.has(section)) return;
          seen.add(section);
          reveal(section);
          tracks(section);
          counts(section);
        },
        { amount: 0.2 }
      );
      stops.push(stop);
    });

    // Theme flip: a thin trigger band near the bottom of the viewport — the
    // incoming screen takes the colour as soon as it starts arriving from
    // below, not once it's most of the way in.
    const themeIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            document.body.classList.toggle("on-light", e.target.classList.contains("light"));
            document.body.classList.toggle("at-hero", e.target.classList.contains("hero"));
            document.body.classList.toggle("at-end", (e.target as HTMLElement).id === "company");
          }
        });
      },
      { rootMargin: "-85% 0px -10% 0px", threshold: 0 }
    );
    document
      .querySelectorAll("header.hero, main > section")
      .forEach((s) => themeIO.observe(s));

    return () => {
      stops.forEach((s) => s && s());
      themeIO.disconnect();
    };
  }, []);

  return null;
}
