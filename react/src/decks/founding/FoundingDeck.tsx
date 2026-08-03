"use client";

import * as React from "react";

import "./deck.css";
import { drawPaths, revealSlide, runFlywheel } from "./motion";
import { SLIDES } from "./slides";

/**
 * Viewer for the founding-partner deck.
 *
 * Slides are authored at a fixed 1280x720 — the canvas DESIGN.md specifies, and
 * the one its type ramp is measured against — then scaled to fit the viewport,
 * so the deck renders identically on a laptop, a projector and in PDF.
 *
 * Every slide stays mounted. On screen only the active one is visible; in print
 * each becomes its own 16:9 page, which is how Ctrl-P captures the whole deck.
 * Charts receive `active` so a figure four slides away is not animating to an
 * audience that cannot see it.
 */

const W = 1280;
const H = 720;

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

export function FoundingDeck() {
  const [index, setIndex] = React.useState(0);
  const [staticMode, setStaticMode] = React.useState(false);
  // Explicit centring: a scale factor plus the pixel offset that puts the
  // scaled stage's top-left in the right place. A top-left origin with px
  // offsets avoids the oversized-item cases that clip a slide's leading edge.
  const [fit, setFit] = React.useState({ s: 1, ox: 0, oy: 0 });
  const stage = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / W, vh / H);
      setFit({ s, ox: (vw - W * s) / 2, oy: (vh - H * s) / 2 });
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    window.visualViewport?.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
      window.visualViewport?.removeEventListener("resize", compute);
    };
  }, []);

  React.useEffect(() => {
    const print = window.matchMedia("print");
    const compute = () => setStaticMode(isStaticDeckMode());
    compute();
    window.addEventListener("beforeprint", compute);
    window.addEventListener("afterprint", compute);
    print.addEventListener("change", compute);
    return () => {
      window.removeEventListener("beforeprint", compute);
      window.removeEventListener("afterprint", compute);
      print.removeEventListener("change", compute);
    };
  }, []);

  const go = React.useCallback((next: number) => {
    setIndex((i) => {
      const clamped = Math.max(0, Math.min(next, SLIDES.length - 1));
      return clamped === i ? i : clamped;
    });
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
          e.preventDefault();
          setIndex((i) => Math.min(i + 1, SLIDES.length - 1));
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          setIndex((i) => Math.max(i - 1, 0));
          break;
        case "Home":
          setIndex(0);
          break;
        case "End":
          setIndex(SLIDES.length - 1);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reveal runs on the slide that just became active, and its cleanup settles
  // anything still in flight when the deck moves on. All three motion
  // primitives no-op harmlessly on a slide that carries none of their
  // elements, and all three settle instantly (rather than animate) under
  // reduced motion or static/PDF capture — see `prefersReduced` in motion.ts.
  React.useEffect(() => {
    const el = stage.current?.querySelector<HTMLElement>(
      `[data-slide-index="${index}"]`
    );
    if (!el) return;
    const cleanups = [revealSlide(el), runFlywheel(el), drawPaths(el)];
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [index, staticMode]);

  return (
    <div className="fdeck" data-static={staticMode ? "true" : undefined}>
      <div
        className="fdeck-stage"
        ref={stage}
        style={{
          transform: `translate(${fit.ox}px, ${fit.oy}px) scale(${fit.s})`,
        }}
      >
        {SLIDES.map((slide, i) => {
          const Body = slide.render;
          return (
            <section
              aria-hidden={i === index ? undefined : true}
              className={`fdeck-slide${slide.light ? " light" : ""}`}
              data-active={i === index}
              data-slide-index={i}
              // biome-ignore lint/suspicious/noArrayIndexKey: slide order is the identity
              key={i}
            >
              <Body
                active={staticMode || i === index}
                index={i}
                staticMode={staticMode}
                total={SLIDES.length}
              />
            </section>
          );
        })}
      </div>

      <nav aria-label="Slides" className="fdeck-nav">
        {SLIDES.map((_, i) => (
          <button
            aria-current={i === index}
            aria-label={`Slide ${i + 1}`}
            className="fdeck-dot"
            data-on={i === index}
            // biome-ignore lint/suspicious/noArrayIndexKey: slide order is the identity
            key={i}
            onClick={() => go(i)}
            type="button"
          />
        ))}
        <span className="fdeck-count">
          {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
      </nav>
    </div>
  );
}
