"use client";

import * as React from "react";

import {
  ASK,
  BACKDROP,
  CORRIDOR,
  DECK,
  ECONOMICS,
  FLYWHEEL,
  FUNCTIONS,
  isIllustrative,
  MARKET,
  MOAT,
  PROBLEM,
  RISKS,
  ROADMAP,
  type Source,
  STRUCTURE,
  TEAM,
  THESIS,
  WEDGE,
} from "./content";
import { LiquidGlassCard } from "@/components/kokonutui/liquid-glass-card";
import { BackdropChart, CompsChart, CorridorMap, EconomicsChart } from "./echart-charts";
import { drawPaths, runFlywheel } from "./motion";

/**
 * The seventeen slides.
 *
 * Every slide states one conclusion, and its title is that conclusion written
 * as a claim — never a topic. Read the titles in order and you get the whole
 * argument. Nothing here inlines a figure or a sentence; all of it comes from
 * `content.ts`, so the argument can be corrected without touching a component.
 *
 * Slides marked NEW do not exist in the reference deck. Four of them close the
 * holes a founding-partner document cannot have: economics, roadmap, team and
 * risks. The structure slide is a revision of the reference deck's, at the
 * client's instruction, and carries its own counter-argument.
 */

export type SlideProps = { active: boolean; index: number; total: number };
type Slide = (p: SlideProps) => React.ReactElement;

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
];

/* -------------------------------------------------------------- primitives */

function Mark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 48 48"
      width={size}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      >
        <line x1="24" x2="24" y1="9" y2="39" />
        <path d="M12.5 12 C 24 18, 24 30, 12.5 38" />
        <path d="M35.5 12 C 24 18, 24 30, 35.5 38" />
      </g>
    </svg>
  );
}

/** Slide chrome: roman numeral + section left, mark right, running foot below. */
function Frame({
  eyebrow,
  foot,
  index,
  total,
  children,
}: {
  eyebrow: string;
  foot?: string;
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fd-head">
        <div className="fd-eyebrow">
          <span className="fd-num">{ROMAN[index + 1]}</span>
          <span className="fd-bar">|</span>
          <span className="fd-sec">{eyebrow}</span>
        </div>
        <Mark className="fd-mark" />
      </header>

      <div className="fd-body-wrap">{children}</div>

      <footer className="fd-foot">
        <span>
          {DECK.name} · {foot ?? eyebrow}
        </span>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </footer>
    </>
  );
}

/** Fires off a `source` of ILLUSTRATIVE. An unsourced figure must look it. */
function Provenance({ source, note }: { source: Source; note?: string }) {
  if (isIllustrative(source)) {
    return (
      <div className="fd-rise" style={{ marginTop: "var(--s-3)" }}>
        <span className="fd-illustrative">Illustrative — not sourced</span>
        {note ? <p className="fd-source">{note}</p> : null}
      </div>
    );
  }
  return <p className="fd-rise fd-source">{source}</p>;
}

/** A figure the client has not supplied. Never a plausible-looking number. */
function Gap({ width = 5 }: { width?: number }) {
  return <span aria-label="pending" className="fd-gap" style={{ minWidth: `${width}ch` }} />;
}

function Title({ head, accent }: { head: string; accent?: string }) {
  return (
    <h2 className="fd-rise fd-title">
      {head}
      {accent ? (
        <>
          {" "}
          <span className="serif-i">{accent}</span>
        </>
      ) : null}
    </h2>
  );
}

/** Runs a one-shot effect when the slide first becomes active. */
function useOnActive(active: boolean, run: (el: HTMLElement) => () => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  const played = React.useRef(false);
  React.useEffect(() => {
    if (!active || played.current) return;
    const el = ref.current;
    if (!el) return;
    played.current = true;
    return run(el);
  }, [active, run]);
  return ref;
}

/* ------------------------------------------------------------- I · cover */

const Cover: Slide = () => (
  <div className="fd-cover">
    <header className="fd-cover-top">
      <div className="fd-wordmark">
        <Mark size={26} />
        <span>
          <b>ISTHMUS</b> <i>MERIDIAN</i>
        </span>
      </div>
      <div className="fd-label">
        {DECK.classification} <span className="fd-bar">·</span> {DECK.confidential}
      </div>
    </header>

    <div className="fd-cover-mid">
      <CoverGlobe />
      <h1 className="fd-rise fd-cover-name">
        <b>ISTHMUS</b>
        <i>MERIDIAN</i>
      </h1>
      <p className="fd-rise fd-cover-sub">
        {DECK.proposition} <span className="serif-i">{DECK.propositionAccent}</span>
      </p>
      <p className="fd-rise fd-label fd-cover-meta">
        {DECK.classification} <span className="fd-bar">·</span> {DECK.place}{" "}
        <span className="fd-bar">·</span> {DECK.date}
      </p>
      <p className="fd-rise fd-cover-tag">{DECK.tagline}</p>
    </div>
  </div>
);

/** The brand globe: a wireframe sphere with the mark at its crossing. */
function CoverGlobe() {
  return (
    <svg
      aria-hidden="true"
      className="fd-rise fd-globe"
      height="200"
      viewBox="0 0 200 200"
      width="200"
    >
      <g fill="none" stroke="var(--steel)" strokeWidth="0.9" opacity="0.75">
        <circle cx="100" cy="100" r="96" />
        <ellipse cx="100" cy="100" rx="38" ry="96" />
        <line x1="4" x2="196" y1="100" y2="100" />
        <line x1="100" x2="100" y1="4" y2="196" />
      </g>
      <g
        fill="none"
        stroke="var(--heading)"
        strokeLinecap="round"
        strokeWidth="1.6"
        transform="translate(62 62) scale(1.6)"
      >
        <line x1="24" x2="24" y1="9" y2="39" />
        <path d="M12.5 12 C 24 18, 24 30, 12.5 38" />
        <path d="M35.5 12 C 24 18, 24 30, 35.5 38" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ II · thesis */

const Thesis: Slide = ({ index, total }) => (
  <Frame eyebrow={THESIS.eyebrow} index={index} total={total}>
    <Title accent={THESIS.titleAccent} head={THESIS.title} />
    <p className="fd-rise fd-lede">{THESIS.lede}</p>

    <div className="fd-grid-3" style={{ marginTop: "var(--s-6)" }}>
      {THESIS.cards.map((c, i) => (
        // `glassEffect={false}`: Kokonut's SVG-displacement backdrop is the
        // known perf trap, and the site already settled on the shadow recipe
        // alone. `.liquid-glass` carries that recipe.
        <LiquidGlassCard
          className="fd-glass-card fd-rise liquid-glass"
          glassEffect={false}
          glassSize="sm"
          key={c.key}
        >
          <div className="fd-icon">{THESIS_ICONS[i]}</div>
          <h3 className="fd-card-title">{c.title}</h3>
          <p className="fd-card-body">{c.body}</p>
        </LiquidGlassCard>
      ))}
    </div>

    <div className="fd-quote fd-rise" style={{ marginTop: "auto" }}>
      {THESIS.quote} <b>{THESIS.quoteAccent}</b>
    </div>
  </Frame>
);

const ICON = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  width: 18,
  height: 18,
  "aria-hidden": true,
};

const THESIS_ICONS = [
  // anchor — a live, paying customer holding the whole thing in place
  <svg key="a" {...ICON}>
    <circle cx="12" cy="5" r="2.2" />
    <line x1="12" x2="12" y1="7.2" y2="21" />
    <path d="M5 13a7 7 0 0 0 14 0" />
    <line x1="8.5" x2="15.5" y1="10" y2="10" />
  </svg>,
  // cycle — recurring revenue
  <svg key="b" {...ICON}>
    <path d="M3.5 12a8.5 8.5 0 0 1 14.4-6.1L21 8" />
    <path d="M20.5 12a8.5 8.5 0 0 1-14.4 6.1L3 16" />
    <path d="M21 4v4h-4M3 20v-4h4" />
  </svg>,
  // stack — a proprietary dataset
  <svg key="c" {...ICON}>
    <ellipse cx="12" cy="6" rx="7.5" ry="3" />
    <path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
    <path d="M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
  </svg>,
];

/* ----------------------------------------------------------- III · problem */

const Problem: Slide = ({ active, index, total }) => {
  const ref = useOnActive(active, drawPaths);
  return (
    <Frame eyebrow={PROBLEM.eyebrow} index={index} total={total}>
      <div className="fd-split" ref={ref}>
        <div>
          <Title accent={PROBLEM.titleAccent} head={PROBLEM.title} />
          <p className="fd-rise fd-lede">{PROBLEM.lede}</p>
          <ByHandIllustration />
        </div>

        <div className="fd-aside">
          <div className="fd-rise fd-label" style={{ color: "var(--sky)" }}>
            {PROBLEM.asideTitle}
          </div>
          <ul className="fd-aside-list">
            {PROBLEM.points.map((p) => (
              <li className="fd-rise" key={p}>
                <span className="fd-aside-glyph">→</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
};

/** Doc → analysis → chart → doc, rebuilt by hand on every deal. */
function ByHandIllustration() {
  return (
    <svg
      aria-hidden="true"
      className="fd-rise"
      height="120"
      style={{ marginTop: "var(--s-7)" }}
      viewBox="0 0 460 120"
      width="460"
    >
      <g fill="none" stroke="var(--steel)" strokeWidth="1.3">
        <rect className="fd-draw" height="76" rx="3" width="60" x="2" y="22" />
        <line className="fd-draw" x1="14" x2="50" y1="42" y2="42" />
        <line className="fd-draw" x1="14" x2="50" y1="56" y2="56" />
        <line className="fd-draw" x1="14" x2="38" y1="70" y2="70" />

        <circle className="fd-draw" cx="176" cy="60" r="26" />
        <line className="fd-draw" x1="176" x2="176" y1="26" y2="94" />

        <rect className="fd-draw" height="76" rx="3" width="60" x="398" y="22" />
        <line className="fd-draw" x1="410" x2="446" y1="42" y2="42" />
        <line className="fd-draw" x1="410" x2="446" y1="56" y2="56" />
        <line className="fd-draw" x1="410" x2="434" y1="70" y2="70" />
      </g>

      <g
        fill="none"
        stroke="var(--sky)"
        strokeLinecap="round"
        strokeWidth="1.5"
      >
        <polyline className="fd-draw" points="256,86 286,64 310,74 340,34" />
        <circle cx="256" cy="86" fill="var(--sky)" r="2.6" stroke="none" />
        <circle cx="286" cy="64" fill="var(--sky)" r="2.6" stroke="none" />
        <circle cx="310" cy="74" fill="var(--sky)" r="2.6" stroke="none" />
        <circle cx="340" cy="34" fill="var(--sky)" r="2.6" stroke="none" />
      </g>

      <g
        fill="none"
        stroke="var(--tx-3)"
        strokeDasharray="3 5"
        strokeWidth="1.1"
      >
        <line x1="66" x2="146" y1="60" y2="60" />
        <line x1="206" x2="248" y1="60" y2="60" />
        <line x1="350" x2="394" y1="60" y2="60" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------- IV · backdrop ◆ */

const Backdrop: Slide = ({ active, index, total }) => (
  <Frame eyebrow={BACKDROP.eyebrow} index={index} total={total}>
    <Title accent={BACKDROP.titleAccent} head={BACKDROP.title} />
    <p className="fd-rise fd-lede">{BACKDROP.lede}</p>
    <div className="fd-plot fd-rise" style={{ marginTop: "var(--s-5)" }}>
      <BackdropChart active={active} />
    </div>
    <Provenance
      note="Replace with Preqin or McKinsey Global Private Markets Review for AUM and fund count. No clean public series exists for back-office capacity."
      source={BACKDROP.source}
    />
  </Frame>
);

/* -------------------------------------------------------------- V · wedge */

const Wedge: Slide = ({ index, total }) => (
  <Frame eyebrow={WEDGE.eyebrow} index={index} total={total}>
    <div className="fd-split">
      <div>
        <h2 className="fd-rise fd-title">
          {WEDGE.title}
          <br />
          <span className="serif-i">{WEDGE.titleAccent}</span>
        </h2>
        <p className="fd-rise fd-lede">{WEDGE.lede}</p>
        <div className="fd-quote fd-rise" style={{ marginTop: "var(--s-7)" }}>
          {WEDGE.quote} <b>{WEDGE.quoteAccent}</b>
        </div>
      </div>

      <LiquidGlassCard
        className="fd-glass-card fd-rise fd-feature liquid-glass"
        glassEffect={false}
        glassSize="sm"
      >
        <div className="fd-label" style={{ color: "var(--accent-ink)" }}>
          {WEDGE.panel.eyebrow}
        </div>
        <h3 className="fd-feature-title">{WEDGE.panel.title}</h3>
        <p className="fd-card-body">{WEDGE.panel.body}</p>
        <svg
          aria-hidden="true"
          className="fd-feature-rings"
          height="110"
          viewBox="0 0 110 110"
          width="110"
        >
          <g fill="none" stroke="var(--steel)" strokeWidth="1">
            <circle cx="55" cy="55" opacity="0.5" r="52" />
            <circle cx="55" cy="55" opacity="0.3" r="38" />
          </g>
          <circle cx="55" cy="14" fill="var(--sky)" r="3.4" />
        </svg>
      </LiquidGlassCard>
    </div>
  </Frame>
);

/* -------------------------------------------------------- VI · eight functions */

const Functions: Slide = ({ index, total }) => (
  <Frame eyebrow={FUNCTIONS.eyebrow} foot="WHAT WE RUN" index={index} total={total}>
    <Title accent={FUNCTIONS.titleAccent} head={FUNCTIONS.title} />

    <div className="fd-grid-4" style={{ marginTop: "var(--s-7)" }}>
      {FUNCTIONS.items.map((f) => (
        <div className="fd-card fd-rise fd-fn" key={f.n}>
          {f.tag ? <span className="fd-chip fd-fn-tag">{f.tag}</span> : null}
          <span className="fd-fn-n">{f.n}</span>
          <span className="fd-fn-label">{f.label}</span>
        </div>
      ))}
    </div>

    <p className="fd-rise fd-small" style={{ marginTop: "auto", color: "var(--tx-3)" }}>
      {FUNCTIONS.footnote}{" "}
      <b style={{ color: "var(--heading)", fontWeight: 500 }}>{FUNCTIONS.footnoteAccent}</b>
    </p>
  </Frame>
);

/* ---------------------------------------------------------- VII · flywheel */

const Flywheel: Slide = ({ active, index, total }) => {
  const ref = useOnActive(active, runFlywheel);
  const R = 118;
  const C = 150;

  return (
    <Frame eyebrow={FLYWHEEL.eyebrow} foot="THE FLYWHEEL" index={index} total={total}>
      <div className="fd-split fd-flywheel" ref={ref}>
        <div className="fw-stage">
          <svg aria-hidden="true" height="300" viewBox="0 0 300 300" width="300">
            <circle
              cx={C}
              cy={C}
              fill="none"
              opacity="0.55"
              r={R}
              stroke="var(--line-3)"
              strokeWidth="1"
            />
            <circle
              cx={C}
              cy={C}
              fill="none"
              opacity="0.35"
              r={R - 44}
              stroke="var(--line-3)"
              strokeWidth="1"
            />
            <g
              fill="none"
              stroke="var(--heading)"
              strokeLinecap="round"
              strokeWidth="1.4"
              transform={`translate(${C - 24} ${C - 32}) scale(1.05)`}
            >
              <line x1="24" x2="24" y1="9" y2="39" />
              <path d="M12.5 12 C 24 18, 24 30, 12.5 38" />
              <path d="M35.5 12 C 24 18, 24 30, 35.5 38" />
            </g>
            <text
              fill="var(--tx-3)"
              fontSize="10"
              letterSpacing="0.22em"
              textAnchor="middle"
              x={C}
              y={C + 40}
            >
              {FLYWHEEL.hub}
            </text>
          </svg>

          {FLYWHEEL.steps.map((s, i) => {
            const a = (-90 + i * 60) * (Math.PI / 180);
            return (
              <span
                className="fw-node"
                key={s.n}
                style={{
                  left: `${C + R * Math.cos(a)}px`,
                  top: `${C + R * Math.sin(a)}px`,
                }}
              >
                {s.n}
              </span>
            );
          })}

          <span
            className="fw-packet"
            style={
              {
                offsetPath: `path("M ${C} ${C - R} A ${R} ${R} 0 1 1 ${C - 0.01} ${C - R} Z")`,
              } as React.CSSProperties
            }
          />
        </div>

        <ol className="fw-steps">
          {FLYWHEEL.steps.map((s) => (
            <li className="fw-step" key={s.n}>
              <span className="fw-step-n">{s.n}</span>
              <span>
                {s.text} <b>{s.accent}</b> {s.tail}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="fd-quote fd-rise" style={{ marginTop: "var(--s-5)" }}>
        {FLYWHEEL.title} <b>{FLYWHEEL.titleAccent}</b>
      </div>
    </Frame>
  );
};

/* --------------------------------------------------------- VIII · the moat */

const Moat: Slide = ({ index, total }) => (
  <Frame eyebrow={MOAT.eyebrow} index={index} total={total}>
    <Title accent={MOAT.titleAccent} head={MOAT.title} />

    <div className="fd-compare" style={{ marginTop: "var(--s-7)" }}>
      <div className="fd-card fd-rise fd-col-dim">
        <div className="fd-label">{MOAT.wrappers.label}</div>
        <ul className="fd-rows">
          {MOAT.wrappers.rows.map((r) => (
            <li key={r}>
              <span className="fd-x">✕</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="fd-card fd-rise fd-col-lit">
        <div className="fd-label" style={{ color: "var(--sky)" }}>
          {MOAT.ours.label}
        </div>
        <ul className="fd-rows">
          {MOAT.ours.rows.map((r) => (
            <li key={r}>
              <span className="fd-check">✓</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <p className="fd-rise fd-small" style={{ marginTop: "auto", maxWidth: "96ch" }}>
      {MOAT.footnote}
    </p>
  </Frame>
);

/* ------------------------------------------------------- IX · economics ◆ */

const Economics: Slide = ({ active, index, total }) => (
  <Frame eyebrow={ECONOMICS.eyebrow} index={index} total={total}>
    <Title accent={ECONOMICS.titleAccent} head={ECONOMICS.title} />
    <p className="fd-rise fd-lede">{ECONOMICS.lede}</p>
    <div className="fd-plot fd-rise" style={{ marginTop: "var(--s-4)" }}>
      <EconomicsChart active={active} />
    </div>
    <Provenance
      note="Needs AND Capital revenue, delivery cost, and the automation rate actually observed per workflow."
      source={ECONOMICS.source}
    />
  </Frame>
);

/* ---------------------------------------------------------- X · the market */

const Market: Slide = ({ active, index, total }) => (
  <Frame eyebrow={MARKET.eyebrow} foot="THE MARKET · COMPS" index={index} total={total}>
    <Title accent={MARKET.titleAccent} head={MARKET.title} />

    <div className="fd-market" style={{ marginTop: "var(--s-6)" }}>
      <div className="fd-frame fd-rise">
        <div className="fd-label">{MARKET.compsLabel}</div>
        <div style={{ height: 150, marginTop: "var(--s-4)" }}>
          <CompsChart active={active} />
        </div>
        <p className="fd-source">{MARKET.compsSource}</p>
        <p className="fd-source" style={{ color: "var(--gold)" }}>
          {MARKET.compsStale}
        </p>
      </div>

      <div className="fd-frame fd-rise fd-multiple">
        <div className="fd-label">{MARKET.multiple.label}</div>
        <div className="fd-multiple-figure">{MARKET.multiple.display}</div>
        <MultipleTrack />
        <p className="fd-small" style={{ color: "var(--tx-3)" }}>
          {MARKET.multiple.caption}
        </p>
        <Provenance source={MARKET.multiple.source} />
      </div>
    </div>

    <p className="fd-rise fd-small" style={{ marginTop: "auto", maxWidth: "100ch" }}>
      {MARKET.footnote}{" "}
      <b style={{ color: "var(--heading)", fontWeight: 500 }}>{MARKET.footnoteAccent}</b>
      {MARKET.footnoteTail}
    </p>
  </Frame>
);

/** The 20–38× band on a 0–50× track. */
function MultipleTrack() {
  const { low, high, scaleMax } = MARKET.multiple;
  const pct = (v: number) => (v / scaleMax) * 100;
  return (
    <div className="fd-track">
      <div className="fd-track-rail" />
      <div
        className="fd-track-band"
        style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
      />
      <div className="fd-track-ticks">
        {[0, 20, 38, 50].map((t) => (
          <span key={t} style={{ left: `${pct(t)}%` }}>
            {t}×
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- XI · structure ◆ */

const Structure: Slide = ({ active, index, total }) => {
  const ref = useOnActive(active, drawPaths);
  const { tree, rationale, counter, pending } = STRUCTURE;

  return (
    <Frame eyebrow={STRUCTURE.eyebrow} foot="STRUCTURE" index={index} total={total}>
      <Title accent={STRUCTURE.titleAccent} head={STRUCTURE.title} />
      <p className="fd-rise fd-lede fd-lede-tight">{STRUCTURE.lede}</p>

      <div className="fd-structure" ref={ref}>
        <div className="fd-tree">
          <div className="fd-entity fd-rise fd-entity-parent">
            <span className="fd-chip">{tree.parent.timing}</span>
            <div className="fd-entity-name">{tree.parent.label}</div>
            <div className="fd-entity-role">{tree.parent.role}</div>
            <p className="fd-entity-note">{tree.parent.note}</p>
          </div>

          <svg aria-hidden="true" className="fd-tree-wire" height="30" viewBox="0 0 420 30" width="420">
            <g fill="none" stroke="var(--line-3)" strokeWidth="1.1">
              <path className="fd-draw" d="M210 0 L210 14" />
              <path className="fd-draw" d="M105 30 L105 14 L315 14 L315 30" />
            </g>
          </svg>

          <div className="fd-tree-children">
            {tree.children.map((c) => (
              <div className="fd-entity fd-rise" key={c.key}>
                <span className="fd-chip">{c.timing}</span>
                <div className="fd-entity-name">{c.label}</div>
                <div className="fd-entity-role">{c.role}</div>
                <p className="fd-entity-note">{c.note}</p>
              </div>
            ))}
          </div>

          <p className="fd-rise fd-source fd-pending">{pending}</p>
        </div>

        <div className="fd-rationale">
          {rationale.map((r) => (
            <div className="fd-rise fd-reason" key={r.n}>
              <span className="fd-reason-n">{r.n}</span>
              <div>
                <div className="fd-reason-title">{r.title}</div>
                <p className="fd-reason-body">{r.body}</p>
                {r.caveat ? <p className="fd-reason-caveat">{r.caveat}</p> : null}
              </div>
            </div>
          ))}

          {/* The honest counter ships on the slide, not in a footnote — this
              structure argues against the client's own prior deck. */}
          <div className="fd-counter fd-rise">
            <span className="fd-chip warn">{counter.label}</span>
            <p className="fd-counter-body">{counter.body}</p>
          </div>
        </div>
      </div>
    </Frame>
  );
};

/* -------------------------------------------------------- XII · corridor ◆ */

const Corridor: Slide = ({ active, index, total }) => (
  <Frame eyebrow={CORRIDOR.eyebrow} index={index} total={total}>
    <div className="fd-corridor-head">
      <div>
        <Title accent={CORRIDOR.titleAccent} head={CORRIDOR.title} />
        <p className="fd-rise fd-lede" style={{ maxWidth: "48ch" }}>
          {CORRIDOR.lede}
        </p>
      </div>
      <ul className="fd-rise fd-legend">
        {CORRIDOR.legend.map((l) => (
          <li key={l.kind}>
            <span className={`fd-dot k-${l.kind}`} />
            {l.label}
          </li>
        ))}
      </ul>
    </div>

    <div className="fd-plot fd-plot-mask fd-rise">
      <CorridorMap active={active} />
    </div>
    <p className="fd-rise fd-source">{CORRIDOR.caption}</p>
  </Frame>
);

/* --------------------------------------------------------- XIII · roadmap ◆ */

const Roadmap: Slide = ({ index, total }) => (
  <Frame eyebrow={ROADMAP.eyebrow} index={index} total={total}>
    <Title accent={ROADMAP.titleAccent} head={ROADMAP.title} />

    <div className="fd-timeline">
      <div className="fd-timeline-rail" />
      {ROADMAP.milestones.map((m) => (
        <div className="fd-rise fd-milestone" key={m.when}>
          <span className="fd-milestone-dot" />
          <div className="fd-milestone-when">{m.when}</div>
          <div className="fd-milestone-title">{m.title}</div>
          <p className="fd-milestone-body">{m.body}</p>
        </div>
      ))}
    </div>

    <Provenance source={ROADMAP.source} />
  </Frame>
);

/* ------------------------------------------------------------ XIV · team ◆ */

const Team: Slide = ({ index, total }) => (
  <Frame eyebrow={TEAM.eyebrow} index={index} total={total}>
    <Title head={TEAM.title} />
    <p className="fd-rise fd-lede">{TEAM.lede}</p>

    <div className="fd-grid-3" style={{ marginTop: "var(--s-6)" }}>
      {TEAM.members.length > 0
        ? TEAM.members.map((m) => (
            <div className="fd-card fd-rise" key={m.name}>
              <h3 className="fd-card-title">{m.name}</h3>
              <div className="fd-label">{m.role}</div>
              <p className="fd-card-body" style={{ marginTop: "var(--s-3)" }}>
                {m.bio}
              </p>
            </div>
          ))
        : // No names supplied. A founding-partner deck with invented founders
          // would be the worst fabrication this deck could contain, so the
          // slide shows labelled gaps instead.
          [0, 1, 2].map((i) => (
            <div className="fd-card fd-rise fd-card-empty" key={i}>
              <div className="fd-card-title">
                <Gap width={12} />
              </div>
              <div className="fd-label">
                <Gap width={9} />
              </div>
              <p className="fd-card-body" style={{ marginTop: "var(--s-3)" }}>
                <Gap width={20} />
              </p>
            </div>
          ))}
    </div>

    <div className="fd-grid-2" style={{ marginTop: "var(--s-5)" }}>
      {TEAM.openSeats.map((s) => (
        <div className="fd-card fd-rise fd-seat" key={s.role}>
          <span className="fd-chip">OPEN</span>
          <div className="fd-card-title" style={{ margin: 0 }}>
            {s.role}
          </div>
          <p className="fd-card-body">{s.note}</p>
        </div>
      ))}
    </div>

    <p className="fd-rise fd-source" style={{ marginTop: "auto", color: "var(--gold)" }}>
      {TEAM.emptyNote}
    </p>
  </Frame>
);

/* ----------------------------------------------------------- XV · risks ◆ */

const Risks: Slide = ({ index, total }) => (
  <Frame eyebrow={RISKS.eyebrow} index={index} total={total}>
    <Title accent={RISKS.titleAccent} head={RISKS.title} />

    <div className="fd-risks">
      {RISKS.items.map((r) => (
        <div className="fd-card fd-rise fd-risk" key={r.risk}>
          <h3 className="fd-card-title">{r.risk}</h3>
          <p className="fd-card-body">{r.body}</p>
          <div className="fd-mitigation">
            <span className="fd-label">Mitigation</span>
            <p className="fd-card-body">{r.mitigation}</p>
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

/* ------------------------------------------------------------- XVI · ask ◆ */

const Ask: Slide = ({ index, total }) => (
  <Frame eyebrow={ASK.eyebrow} index={index} total={total}>
    <Title accent={ASK.titleAccent} head={ASK.title} />
    <p className="fd-rise fd-lede">{ASK.lede}</p>

    <div className="fd-terms">
      {ASK.terms.map((t) => (
        <div className="fd-rise fd-term" key={t.label}>
          <div className="fd-label">{t.label}</div>
          <div className="fd-term-value">
            {t.value === null ? <Gap width={7} /> : `${t.value}${t.unit}`}
          </div>
        </div>
      ))}
    </div>

    <div className="fd-rise fd-warning">
      <span className="fd-chip warn">TERMS PENDING</span>
      <p className="fd-card-body">{ASK.warning}</p>
    </div>

    <div className="fd-rise fd-cta-row">
      <span className="fd-cta">{ASK.cta}</span>
    </div>
  </Frame>
);

/* ---------------------------------------------------------- XVII · closing */

const Closing: Slide = () => (
  <div className="fd-cover fd-closing">
    <div className="fd-cover-mid">
      <Mark className="fd-rise" size={72} />
      <p className="fd-rise fd-label" style={{ color: "var(--sky)", marginTop: 28 }}>
        THANK YOU
      </p>
      <h2 className="fd-rise fd-display fd-closing-line">
        The crossing, and the
        <br />
        <span className="serif-i">line you cross it by.</span>
      </h2>
      <div className="fd-rise fd-wordmark" style={{ justifyContent: "center", marginTop: 26 }}>
        <span>
          <b>ISTHMUS</b> <i>MERIDIAN</i>
        </span>
      </div>
      <div className="fd-rise fd-closing-meta">
        <div>
          <div className="fd-label">Structure</div>
          <div className="fd-small">Delaware · Abu Dhabi</div>
        </div>
        <div>
          <div className="fd-label">Opportunity</div>
          <div className="fd-small">Founding partners</div>
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ export */

export const SLIDES: Slide[] = [
  Cover,
  Thesis,
  Problem,
  Backdrop,
  Wedge,
  Functions,
  Flywheel,
  Moat,
  Economics,
  Market,
  Structure,
  Corridor,
  Roadmap,
  Team,
  Risks,
  Ask,
  Closing,
];
