"use client";

import { animate, createTimeline, stagger, utils } from "animejs";
import { useEffect, useRef } from "react";

/**
 * "Running a fund takes more than an investment team" — the three routes firms
 * take today, each drawn as its own failure mode rather than listed.
 *
 * anime.js drives everything: an entry sequence per route, an idle loop that
 * keeps each diagram alive, and a hover state that plays the failure through.
 * Hover is DOM-class only — no React state — so pointing along the row never
 * re-renders the tree of SVG nodes underneath it.
 */

const EASE = "cubicBezier(0.22, 1, 0.36, 1)";

const ROUTES = [
  {
    key: "build",
    label: "Build it",
    lede: "Standing up every function internally is slow and expensive.",
    detail:
      "Headcount, tooling, and management overhead all land well before the first deliverable does.",
  },
  {
    key: "outsource",
    label: "Outsource it",
    lede: "Coordinating a roster of point providers stays fragmented.",
    detail:
      "Every vendor owns one slice. The seams between them stay on your desk.",
  },
  {
    key: "automate",
    label: "Automate it",
    lede: "Generic AI tools still leave the actual work on the investor's desk.",
    detail:
      "The tool drafts. Someone on your team still has to finish it, check it, and own it.",
  },
] as const;

/** cost climbing straight through the line it was meant to stay under */
function GlyphBuild() {
  const bars = [20, 34, 52, 76, 106];
  return (
    <svg aria-hidden="true" className="rt-glyph" viewBox="0 0 200 124">
      <line className="rt-base" x1="6" x2="194" y1="114" y2="114" />
      <line className="rt-dash" x1="6" x2="194" y1="56" y2="56" />
      {bars.map((h, i) => (
        <rect
          className="rt-bar"
          data-bar={i}
          height={h}
          key={h}
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          width={16}
          x={24 + i * 32}
          y={114 - h}
        />
      ))}
    </svg>
  );
}

/** four providers, four links, none of them reaching the middle */
function GlyphOutsource() {
  const nodes = [
    { x: 30, y: 30 },
    { x: 170, y: 34 },
    { x: 26, y: 96 },
    { x: 172, y: 98 },
  ];
  return (
    <svg aria-hidden="true" className="rt-glyph" viewBox="0 0 200 124">
      {nodes.map((n) => (
        <line
          className="rt-dash rt-spoke"
          key={`l-${n.x}-${n.y}`}
          x1={n.x}
          x2={100 + (n.x - 100) * 0.34}
          y1={n.y}
          y2={64 + (n.y - 64) * 0.34}
        />
      ))}
      {nodes.map((n) => (
        <circle
          className="rt-node"
          cx={n.x}
          cy={n.y}
          key={`n-${n.x}-${n.y}`}
          r={7}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
        />
      ))}
      <circle className="rt-hole" cx={100} cy={64} r={13} />
    </svg>
  );
}

/** input goes in, drafts come out, the residue still lands on the desk */
function GlyphAutomate() {
  return (
    <svg aria-hidden="true" className="rt-glyph" viewBox="0 0 200 124">
      <path
        className="rt-funnel"
        d="M 46 18 L 154 18 L 112 66 L 112 88 L 88 88 L 88 66 Z"
        style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
      />
      {[0, 1, 2, 3, 4, 5].map((d) => (
        <circle className="rt-drop" cx={100} cy={0} key={d} r={2.6} />
      ))}
      <line className="rt-base" x1="30" x2="170" y1="114" y2="114" />
      <text className="rt-deskmark" textAnchor="end" x="170" y="108">
        your desk
      </text>
    </svg>
  );
}

const GLYPHS: Record<string, () => React.ReactElement> = {
  build: GlyphBuild,
  outsource: GlyphOutsource,
  automate: GlyphAutomate,
};

export function ApproachRoutes() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));

    const bars = q<SVGRectElement>(".rt-bar");
    const nodes = q<SVGCircleElement>(".rt-node");
    const spokes = q<SVGLineElement>(".rt-spoke");
    const funnel = el.querySelector<SVGPathElement>(".rt-funnel");
    const drops = q<SVGCircleElement>(".rt-drop");
    const routes = q<HTMLElement>(".route");

    if (reduce) {
      utils.set([...bars, ...nodes, ...drops], { opacity: 1 });
      if (funnel) utils.set(funnel, { opacity: 1 });
      el.classList.add("ready");
      return;
    }

    utils.set(bars, { scaleY: 0 });
    utils.set(nodes, { scale: 0, opacity: 1 });
    if (funnel) utils.set(funnel, { scaleY: 0 });
    utils.set(drops, { opacity: 0 });

    // idle: the cost line keeps creeping, the providers pulse out of phase,
    // and drafts keep falling through onto the desk
    const idles: Array<{ pause: () => void }> = [];
    const startIdle = () => {
      idles.push(
        animate(nodes, {
          opacity: [1, 0.45, 1],
          duration: 2800,
          delay: stagger(420),
          loop: true,
          ease: "inOut(2)",
        })
      );
      idles.push(
        animate(spokes, {
          strokeDashoffset: [0, -18],
          duration: 2400,
          loop: true,
          ease: "linear",
        })
      );
      idles.push(
        animate(drops, {
          y: [4, 110],
          opacity: [
            { to: 1, duration: 260 },
            { to: 1, duration: 2200 },
            { to: 0, duration: 320 },
          ],
          duration: 2800,
          delay: stagger(430),
          loop: true,
          ease: "linear",
        })
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        el.classList.add("ready");
        const tl = createTimeline({ defaults: { ease: EASE } });
        tl.add(bars, { scaleY: 1, duration: 620, delay: stagger(90) }, 0)
          .add(nodes, { scale: 1, duration: 520, delay: stagger(80) }, 120)
          .add(funnel ?? [], { scaleY: 1, duration: 600 }, 200);
        tl.then(startIdle);
      },
      { threshold: 0.3 }
    );
    io.observe(el);

    // hover: play the failure through, and dim the routes not being read
    const offs: Array<() => void> = [];
    routes.forEach((r, i) => {
      const on = () => {
        routes.forEach((o, j) => {
          o.classList.toggle("on", j === i);
          o.classList.toggle("off", j !== i);
        });
        if (i === 0) {
          animate(bars, {
            scaleY: [0.82, 1],
            duration: 620,
            delay: stagger(70),
            ease: "out(3)",
          });
        }
        if (i === 1) {
          animate(nodes, {
            scale: [1, 1.28, 1],
            duration: 620,
            delay: stagger(70),
            ease: "out(3)",
          });
        }
        if (i === 2 && funnel) {
          animate(funnel, { scaleY: [0.9, 1], duration: 560, ease: "out(4)" });
        }
      };
      const off = () => routes.forEach((o) => o.classList.remove("on", "off"));
      r.addEventListener("mouseenter", on);
      r.addEventListener("focusin", on);
      r.addEventListener("mouseleave", off);
      r.addEventListener("focusout", off);
      offs.push(() => {
        r.removeEventListener("mouseenter", on);
        r.removeEventListener("focusin", on);
        r.removeEventListener("mouseleave", off);
        r.removeEventListener("focusout", off);
      });
    });

    return () => {
      io.disconnect();
      idles.forEach((a) => a.pause());
      offs.forEach((o) => o());
    };
  }, []);

  return (
    <div className="routes" ref={scope}>
      {ROUTES.map((r) => {
        const Glyph = GLYPHS[r.key];
        return (
          // biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so keyboard users get the same reading as hover
          <div className="route" key={r.key} tabIndex={0}>
            <Glyph />
            <div className="rt-name">{r.label}</div>
            <p className="rt-lede">{r.lede}</p>
            <p className="rt-detail">{r.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
