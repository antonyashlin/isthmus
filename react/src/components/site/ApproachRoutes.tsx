"use client";

import { motion } from "motion/react";
import { useState } from "react";

/**
 * "Running a fund takes more than an investment team" — the three routes firms
 * take today, drawn rather than listed. Each route is a line diagram of its own
 * failure mode; hovering or focusing one draws it out and expands the cost.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

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

const grow = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1 },
};

/** cost climbing straight through the line it was meant to stay under */
function GlyphBuild() {
  const bars = [20, 34, 52, 76, 106];
  return (
    <svg aria-hidden="true" className="rt-glyph" viewBox="0 0 200 124">
      <line className="rt-base" x1="6" x2="194" y1="114" y2="114" />
      <line className="rt-dash rt-drift" x1="6" x2="194" y1="56" y2="56" />
      {bars.map((h, i) => (
        <motion.rect
          className="rt-bar"
          height={h}
          key={h}
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          transition={{ duration: 0.62, delay: 0.09 * i, ease: EASE }}
          variants={grow}
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
      {nodes.map((n, i) => (
        <motion.line
          className="rt-dash rt-drift"
          key={`l-${n.x}-${n.y}`}
          style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
          transition={{ duration: 0.55, delay: 0.08 * i, ease: EASE }}
          variants={{ hidden: { scaleX: 0, scaleY: 0 }, show: { scaleX: 1, scaleY: 1 } }}
          x1={n.x}
          x2={100 + (n.x - 100) * 0.34}
          y1={n.y}
          y2={64 + (n.y - 64) * 0.34}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          className="rt-node rt-pulse"
          cx={n.x}
          cy={n.y}
          key={`n-${n.x}-${n.y}`}
          r={7}
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
      <circle className="rt-hole" cx={100} cy={64} r={13} />
    </svg>
  );
}

/** input goes in, drafts come out, the residue still lands on the desk */
function GlyphAutomate() {
  const drops = [0, 1, 2, 3, 4, 5];
  return (
    <svg aria-hidden="true" className="rt-glyph" viewBox="0 0 200 124">
      <motion.path
        className="rt-funnel"
        d="M 46 18 L 154 18 L 112 66 L 112 88 L 88 88 L 88 66 Z"
        style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        transition={{ duration: 0.6, ease: EASE }}
        variants={grow}
      />
      {drops.map((d) => (
        <circle
          className="rt-drop"
          cx={100}
          cy={0}
          key={d}
          r={2.6}
          style={{ animationDelay: `${d * 0.62}s` }}
        />
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
  const [active, setActive] = useState<string | null>(null);

  return (
    <motion.div
      className="routes"
      initial="hidden"
      viewport={{ once: true, amount: 0.35 }}
      whileInView="show"
    >
      {ROUTES.map((r) => {
        const Glyph = GLYPHS[r.key];
        const on = active === r.key;
        return (
          // biome-ignore lint/a11y/noNoninteractiveTabindex: the panel is a focus stop so keyboard users get the same expansion as hover
          <div
            className={`route${on ? " on" : ""}${active && !on ? " off" : ""}`}
            key={r.key}
            onBlur={() => setActive((c) => (c === r.key ? null : c))}
            onFocus={() => setActive(r.key)}
            onMouseEnter={() => setActive(r.key)}
            onMouseLeave={() => setActive((c) => (c === r.key ? null : c))}
            tabIndex={0}
          >
            <Glyph />
            <div className="rt-name">{r.label}</div>
            <p className="rt-lede">{r.lede}</p>
            {/* always in flow — the reveal is opacity + lift, so an expanding
                route never changes the height of a fixed 100vh screen */}
            <p className="rt-detail">{r.detail}</p>
          </div>
        );
      })}
    </motion.div>
  );
}
