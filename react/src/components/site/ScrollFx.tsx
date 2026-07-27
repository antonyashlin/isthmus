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

    const tracks = (section: Element) => {
      const track = section.querySelector(".journey-track, .flow-track");
      const dots = section.querySelectorAll(".jdot, .fdot");
      if (REDUCE) {
        if (track) (track as HTMLElement).style.transform = "scaleX(1)";
        dots.forEach((d) => ((d as HTMLElement).style.transform = "none"));
        return;
      }
      if (track) {
        (track as HTMLElement).style.transformOrigin = "left center";
        animate(track, { scaleX: [0, 1] }, { duration: 0.85, ease: EASE, delay: 0.2 });
      }
      if (dots.length)
        animate(
          dots,
          { scale: [0, 1] },
          { type: "spring", bounce: 0.5, visualDuration: 0.5, delay: (i: number) => 0.4 + i * 0.11 }
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

    // Theme flip: a thin trigger band at ~58% of the viewport → the incoming
    // screen takes the colour early in the transition, so the background has
    // settled by the time the snap lands.
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
      { rootMargin: "-56% 0px -42% 0px", threshold: 0 }
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
