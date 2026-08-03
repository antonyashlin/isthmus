"use client";

import * as React from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GLOBE_HTML } from "@/components/site/globe-markup";
import {
  ASK,
  CLOSING,
  DECK,
  type Figure,
  FUNCTIONS,
  GAP,
  GTM,
  IDENTITY,
  isIllustrative,
  MOAT,
  MODEL,
  ROADMAP,
  RISKS,
  type Source,
  WEDGE,
} from "./content";
import { GapChart } from "./bklit-charts";
import {
  CoverGraph,
  GtmTree,
  IdentitySunburst,
  MAP_ASPECT,
  ModelStackedArea,
  MoatChord,
  RiskMatrix,
  RoadmapGantt,
  StructureMap,
  WedgePie,
} from "./echart-charts";

/**
 * The twelve slides of the fourth build (2026-08-02), rewritten against the
 * "Founding Deck Content + Visual Blueprint v2" brief. The traction slide
 * ("where we are today") was cut on user direction — it did not carry its
 * weight without real operations data behind it.
 *
 * Every content slide follows the site's own block pattern — eyebrow, heading,
 * one-line description, then a real chart or animated illustration on a
 * plate. Charts come from the deck's own ECharts figures in
 * `echart-charts.tsx` (eight of them now: circular graph, sunburst, chord,
 * nested pie, stacked area, tree, custom Gantt, matrix heatmap) plus one
 * surviving Bklit area chart (`GapChart`, sparse-year data Bklit's own date
 * axis can't carry). Illustrations that are not data charts
 * — the lifecycle ribbon, the flywheel, the contribution bridge, the closing
 * crossing-line — are hand-built on primitives this deck already vendors
 * (`AnimatedBeam` from magicui; `runFlywheel`/`drawPaths` from `motion.ts`,
 * offset-path and stroke-dashoffset techniques in the same family as
 * Aceternity's Tracing Beam and Motion Primitives' Border Trail) rather than
 * introducing a second animation engine for one slide each.
 */

export type SlideProps = { active: boolean; index: number; staticMode?: boolean; total: number };
type SlideFn = (p: SlideProps) => React.ReactElement;

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX",
  "X", "XI", "XII", "XIII", "XIV",
];

/* -------------------------------------------------------------- the field */

const GLOBE_ROT = "rotate(-14 302 -431)";
const MERIDIANS: Array<[d: string, o: string]> = [
  ["M -407 -431 A 709 700.3 0 0 1 1011 -431 A 709 700.3 0 0 1 -407 -431", "0.5"],
  ["M -407 -431 A 709 674.3 0 0 1 1011 -431 A 709 674.3 0 0 1 -407 -431", "0.2"],
  ["M -407 -431 A 709 631.7 0 0 1 1011 -431 A 709 631.7 0 0 1 -407 -431", "0.08"],
  ["M -407 -431 A 709 573.6 0 0 1 1011 -431 A 709 573.6 0 0 1 -407 -431", "0.032"],
];
const GLOBE_SCALE = "translate(302 -431) scale(1.16) translate(-302 431)";

function Field() {
  return (
    <div aria-hidden="true" className="fd-field fd-field-lg">
      <svg preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 675">
        <g transform={GLOBE_SCALE}>
          <g className="fd-field-glow" transform={GLOBE_ROT}>
            <circle cx="302" cy="-431" r="709" strokeOpacity="0.8" />
            {MERIDIANS.map(([d, o]) => (
              <path d={d} key={d} strokeOpacity={o} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

function Hero({ className }: { className?: string } = {}) {
  return (
    <div
      aria-hidden="true"
      className={`fd-hero-field${className ? ` ${className}` : ""}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: the site's own markup, lifted verbatim
      dangerouslySetInnerHTML={{ __html: GLOBE_HTML }}
    />
  );
}

/* ------------------------------------------------------------- primitives */

function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg aria-hidden="true" height={size} viewBox="0 0 48 48" width={size}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4">
        <line x1="24" x2="24" y1="9" y2="39" />
        <path d="M12.5 12 C 24 18, 24 30, 12.5 38" />
        <path d="M35.5 12 C 24 18, 24 30, 35.5 38" />
      </g>
    </svg>
  );
}

function Screen({
  eyebrow,
  index,
  total,
  layout,
  children,
}: {
  eyebrow?: string;
  index: number;
  total: number;
  layout?: "a" | "b" | "c" | "d";
  children: React.ReactNode;
}) {
  return (
    <>
      <Field />
      {eyebrow ? (
        <div className="fd-eyebrow">
          <span>{ROMAN[index]}</span>
          <span className="fd-sec">{eyebrow}</span>
        </div>
      ) : null}
      <div className={`fd-body${layout ? ` fd-lay-${layout}` : ""}`}>{children}</div>
      <div className="fd-page">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </>
  );
}

function H({
  head,
  accent,
  size,
  maxWidth,
}: {
  head: string;
  accent?: string;
  size?: "sm" | "wide";
  maxWidth?: string;
}) {
  return (
    <h2 className={`fd-rise fd-h${size ? ` ${size}` : ""}`} style={maxWidth ? { maxWidth } : undefined}>
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

function Desc({ children }: { children: React.ReactNode }) {
  return <p className="fd-rise fd-blk-desc">{children}</p>;
}

/** The chart/illustration plate every content slide carries. */
function Plate({ children, source }: { children: React.ReactNode; source?: Source }) {
  return (
    <div className="fd-rise fd-blk-viz">
      <div className="fd-viz-plate">{children}</div>
      {source ? (
        isIllustrative(source) ? (
          <p className="fd-illustrative">* Illustrative — not independently sourced.</p>
        ) : (
          <p className="fd-viz-source">{source}</p>
        )
      ) : null}
    </div>
  );
}

function GapPlaceholder({ width = 6 }: { width?: number }) {
  return <span aria-label="pending" className="fd-gap" style={{ minWidth: `${width}ch` }} />;
}

/** Mouse-tracked radial glow on card surfaces — the technique behind
 *  Aceternity's Card Spotlight, Sera UI's Spotlight Card and ReactBits'
 *  MagicBento, all converging on the same CSS-variable + radial-gradient
 *  approach. One shared implementation, reused everywhere a small card
 *  needs to feel alive under the cursor. */
function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className={`fd-spot ${className}`} onPointerMove={onMove} ref={ref}>
      {children}
    </div>
  );
}

/** Four short label/body cards in a row — the gap's friction points, the
 *  wedge's spend pools. Same shape, two callers. */
function CardStrip({ items }: { items: Array<{ label: string; body: string }> }) {
  return (
    <div className="fd-card-strip">
      {items.map((it) => (
        <SpotlightCard className="fd-mini-card" key={it.label}>
          <div className="fd-mini-card-label">{it.label}</div>
          <p className="fd-mini-card-body">{it.body}</p>
        </SpotlightCard>
      ))}
    </div>
  );
}

/* ============================================================== I · cover */

const Cover: SlideFn = () => (
  <>
    <Hero />
    <div aria-hidden="true" className="fd-cover-graph">
      <CoverGraph active />
    </div>
    <div className="fd-cover-block">
      <h1 className="fd-rise fd-cover-h">
        {DECK.proposition} <span className="serif-i">{DECK.propositionAccent}</span>
      </h1>
      <p className="fd-rise fd-cover-sub">{DECK.subhead}</p>
      <div className="fd-rise" style={{ maxWidth: 620 }}>
        <CardStrip items={DECK.meta} />
      </div>
    </div>
    <div className="fd-rise fd-lockup">
      <span className="lk-1">ISTHMUS</span>
      <span className="lk-2">Meridian</span>
    </div>
  </>
);

/* ======================================================= II · what we are */

const Identity: SlideFn = ({ index, total }) => (
  <Screen eyebrow={IDENTITY.eyebrow} index={index} layout="c" total={total}>
    <Plate>
      <IdentitySunburst active />
    </Plate>
    <H accent={IDENTITY.titleAccent} head={IDENTITY.title} size="sm" />
    <div className="fd-blk-desc">
      <p className="fd-rise" style={{ margin: 0 }}>
        {IDENTITY.desc}
      </p>
      <ul className="fd-pillars fd-rise">
        {IDENTITY.pillars.map((p) => (
          <li key={p.label}>
            <b>{p.label}.</b> {p.body}
          </li>
        ))}
      </ul>
    </div>
  </Screen>
);

/* -------------------------------------------------------------- III · the gap */

const Gap: SlideFn = ({ index, total }) => (
  <Screen eyebrow={GAP.eyebrow} index={index} layout="b" total={total}>
    <H accent={GAP.titleAccent} head={GAP.title} size="sm" />
    <Desc>{GAP.desc}</Desc>
    <div className="fd-rise fd-blk-viz">
      <div className="fd-viz-plate" style={{ minHeight: 150 }}>
        <GapChart />
      </div>
      <CardStrip items={GAP.friction} />
      <p className="fd-viz-source" style={{ marginTop: 14 }}>
        {GAP.source}
      </p>
    </div>
  </Screen>
);

/* ------------------------------------------------------------- IV · what we do */

function LifecycleRibbon() {
  const stageCount = FUNCTIONS.stages.length;
  const byStage = new Map<number, typeof FUNCTIONS.items>();
  const crosscut: typeof FUNCTIONS.items = [];
  for (const item of FUNCTIONS.items) {
    if (item.stage === null) {
      crosscut.push(item);
      continue;
    }
    const arr = byStage.get(item.stage) ?? [];
    arr.push(item);
    byStage.set(item.stage, arr);
  }
  const at = (stage: number) => `${6 + (stage / (stageCount - 1)) * 88}%`;

  return (
    <div className="fd-ribbon">
      <div className="fd-ribbon-stages">
        {FUNCTIONS.stages.map((s, i) => (
          <div className="fd-ribbon-stage" key={s} style={{ left: at(i) }}>
            {s}
            <span className="fd-ribbon-tick" aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="fd-ribbon-track">
        <svg aria-hidden="true" className="fd-ribbon-rail" preserveAspectRatio="none" viewBox="0 0 100 1">
          <line x1="0" x2="100" y1="0.5" y2="0.5" />
        </svg>
        <div className="fd-ribbon-lamp" />
        {Array.from(byStage.entries()).flatMap(([stage, items]) =>
          items.map((f, row) => (
            <div className="fd-ribbon-node" key={f.n} style={{ left: at(stage) }}>
              <span className="fd-ribbon-drop" aria-hidden="true" style={{ height: 10 + row * 74 }} />
              <div className="fd-ribbon-card">
                <span className="fd-net-n">{f.n}</span>
                <div className="fd-ribbon-label">
                  {f.label}
                  {f.tag ? <b className="fd-ribbon-tag">{f.tag}</b> : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {crosscut.map((f) => (
        <p className="fd-ribbon-cross" key={f.n}>
          <span className="fd-net-n">{f.n}</span> {f.label} — runs through every stage above.
        </p>
      ))}
    </div>
  );
}

const Functions: SlideFn = ({ index, total }) => (
  <Screen eyebrow={FUNCTIONS.eyebrow} index={index} layout="a" total={total}>
    <H accent={FUNCTIONS.titleAccent} head={FUNCTIONS.title} />
    <Desc>{FUNCTIONS.desc}</Desc>
    <Plate>
      <LifecycleRibbon />
    </Plate>
    <p className="fd-rise fd-viz-source">{FUNCTIONS.aiNote}</p>
  </Screen>
);

/* ------------------------------------------------ V · how we stack up · moat */

/** Five-step compounding loop — the deck's own `runFlywheel` motion (an
 *  offset-path travelling packet lighting each node as it arrives), sized to
 *  a percentage-based circle so it reads correctly at any plate size. */
function FlywheelLoop() {
  const steps = MOAT.flywheel;
  const n = steps.length;
  return (
    <div className="fw-ring">
      <svg aria-hidden="true" className="fw-track" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" />
      </svg>
      <div className="fw-packet" />
      {steps.map((label, i) => {
        const a = (-90 + (360 / n) * i) * (Math.PI / 180);
        const x = 50 + 42 * Math.cos(a);
        const y = 50 + 42 * Math.sin(a);
        return (
          <div className="fw-node-pos" key={label} style={{ left: `${x}%`, top: `${y}%` }}>
            <div className="fw-node" />
            <div className="fw-step">{label}</div>
          </div>
        );
      })}
    </div>
  );
}

function CompareTable() {
  const { columns, rows } = MOAT.compare;
  const ICONS: Record<string, string> = { yes: "✓", partial: "±", no: "–" };
  return (
    <div className="fd-compare">
      <div className="fd-compare-row fd-compare-head">
        <span className="fd-compare-label" />
        {columns.map((c) => (
          <span className="fd-compare-col-h" key={c}>
            {c}
          </span>
        ))}
      </div>
      {rows.map((r) => (
        <div className="fd-compare-row" key={r.label}>
          <span className="fd-compare-label">{r.label}</span>
          {r.values.map((v, i) => (
            <span className={`fd-compare-v fd-compare-${v}`} key={columns[i]}>
              {ICONS[v]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

const Moat: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={MOAT.eyebrow} index={index} total={total}>
    <div
      className="fd-rise fd-blk-viz"
      style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 32, minHeight: 0, flex: 1 }}
    >
      <div className="fd-viz-plate" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <MoatChord active={active} />
        </div>
        <FlywheelLoop />
      </div>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <H accent={MOAT.titleAccent} head={MOAT.title} size="wide" />
        <Desc>{MOAT.desc}</Desc>
        <div style={{ marginTop: "auto" }}>
          <CompareTable />
          <p className="fd-viz-source" style={{ marginTop: 10 }}>
            {MOAT.compare.source}
          </p>
        </div>
      </div>
    </div>
    <p className="fd-illustrative fd-rise">* Data-reuse chord is illustrative, not independently sourced.</p>
  </Screen>
);

/* ---------------------------------------------------------- VI · commercial wedge */

const Wedge: SlideFn = ({ index, total }) => (
  <Screen eyebrow={WEDGE.eyebrow} index={index} layout="c" total={total}>
    <div className="fd-rise fd-blk-viz">
      <div className="fd-viz-plate">
        <WedgePie active />
        <ul className="fd-ring-key" aria-hidden="true">
          {WEDGE.bands.slice(0, 2).map((b, i) => (
            <li key={b.key}>
              <span className={`fd-ring-swatch fd-ring-swatch-${i}`} />
              {b.label}
            </li>
          ))}
        </ul>
      </div>
      <CardStrip items={WEDGE.spendPools} />
    </div>
    <H accent={WEDGE.titleAccent} head={WEDGE.title} size="sm" />
    <div className="fd-blk-desc">
      <p className="fd-rise" style={{ margin: 0 }}>
        {WEDGE.desc}
      </p>
      <ul className="fd-pillars fd-rise">
        <li>
          <b>Beachhead.</b> {WEDGE.beachhead}
        </li>
        <li>
          <b>Triggers.</b> {WEDGE.triggers}
        </li>
        <li>
          <b>Land and expand.</b> {WEDGE.landExpand}
        </li>
      </ul>
      <p className="fd-illustrative fd-rise">* Market-sizing framework, not a TAM — illustrative until validated.</p>
    </div>
  </Screen>
);

/* ------------------------------------------------------------------- VII · model */

const Model: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={MODEL.eyebrow} index={index} total={total}>
    <H accent={MODEL.titleAccent} head={MODEL.title} size="sm" />
    <Desc>{MODEL.desc}</Desc>
    <div
      className="fd-rise fd-blk-viz"
      style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 28, minHeight: 0 }}
    >
      <div className="fd-viz-plate">
        <div className="fd-label" style={{ marginBottom: 6 }}>
          DELIVERY MIX BY STAGE
        </div>
        <div style={{ flex: 1, minHeight: 130 }}>
          <ModelStackedArea active={active} />
        </div>
      </div>
      <div className="fd-viz-plate" style={{ gap: 4, justifyContent: "space-between" }}>
        {MODEL.stages.map((s) => (
          <div key={s.label}>
            <div className="fd-col-n" style={{ fontSize: 10 }}>
              {s.n}
            </div>
            <div className="fd-col-t" style={{ fontSize: 13.5, marginTop: 2 }}>
              {s.label}
            </div>
            <p
              className="fd-col-b"
              style={{
                marginTop: 3,
                maxWidth: "none",
                fontSize: 11,
                lineHeight: 1.32,
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </div>
    <p className="fd-rise fd-viz-source">
      {MODEL.commercialModel} {MODEL.source}
    </p>
  </Screen>
);

/* -------------------------------------------- IX · go-to-market + footprint */

const Gtm: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={GTM.eyebrow} index={index} total={total}>
    <div
      style={{
        flex: 1,
        minHeight: 0,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gridTemplateRows: "auto minmax(0, 1fr)",
        columnGap: 40,
      }}
    >
      <div style={{ gridColumn: 1, gridRow: 1 }}>
        <H accent={GTM.titleAccent} head={GTM.title} size="sm" maxWidth="30ch" />
        <Desc>{GTM.desc}</Desc>
      </div>
      <div style={{ gridColumn: 1, gridRow: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14 }}>
        <p className="fd-rise fd-viz-source" style={{ margin: 0 }}>
          {GTM.caption}
        </p>
        <p className="fd-rise fd-illustrative" style={{ margin: 0 }}>
          * Customer-expansion tree is illustrative, not independently sourced.
        </p>
      </div>
      <div
        className="fd-rise"
        style={{ gridColumn: 2, gridRow: "1 / span 2", display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}
      >
        <div className="fd-viz-plate" style={{ flex: "1.15 1 0", minHeight: 150 }}>
          <div className="fd-label" style={{ marginBottom: 6 }}>
            CUSTOMER EXPANSION
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <GtmTree active={active} />
          </div>
        </div>
        <div className="fd-viz-plate" style={{ flex: "0.85 1 0", minHeight: 110 }}>
          <div className="fd-label" style={{ marginBottom: 6 }}>
            OPERATING CORRIDOR
          </div>
          <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "100%", aspectRatio: MAP_ASPECT, maxHeight: "100%" }}>
              <StructureMap active={active} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Screen>
);

/* -------------------------------------------------------- X · 18-month plan */

const Roadmap: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={ROADMAP.eyebrow} index={index} total={total}>
    <div
      className="fd-rise fd-blk-viz"
      style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 0.85fr)", gap: 40, minHeight: 0 }}
    >
      <div className="fd-viz-plate">
        <div className="fd-label" style={{ marginBottom: 6 }}>
          ROLLOUT BY WORKSTREAM
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <RoadmapGantt active={active} />
        </div>
        <ul className="fd-phase-strip">
          {ROADMAP.phases.map((p) => (
            <li key={p.label}>
              <span className="fd-phase-at">{p.at}</span>
              <span className="fd-phase-label">{p.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <H accent={ROADMAP.titleAccent} head={ROADMAP.title} size="sm" />
        <Desc>{ROADMAP.desc}</Desc>
        <p className="fd-viz-source" style={{ marginTop: "auto" }}>
          {ROADMAP.source}
        </p>
      </div>
    </div>
  </Screen>
);

/* --------------------------------------------------------- XI · what could go wrong */

const Risks: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={RISKS.eyebrow} index={index} layout="a" total={total}>
    <H accent={RISKS.titleAccent} head={RISKS.title} size="sm" />
    <Desc>{RISKS.desc}</Desc>
    <div className="fd-rise fd-blk-viz">
      <div className="fd-viz-plate">
        <div style={{ flex: 1, minHeight: 0 }}>
          <RiskMatrix active={active} />
        </div>
      </div>
      <ul className="fd-risk-key" aria-hidden="true">
        <li>
          <span className="fd-risk-swatch fd-risk-swatch-bad" /> Needs attention
        </li>
        <li>
          <span className="fd-risk-swatch fd-risk-swatch-mid" /> Watch
        </li>
        <li>
          <span className="fd-risk-swatch fd-risk-swatch-good" /> Under control
        </li>
      </ul>
      <p className="fd-viz-source" style={{ marginTop: 6 }}>
        {RISKS.scaleNote}
      </p>
    </div>
  </Screen>
);

/* ------------------------------------------------------------- XII · the ask */

/** Two contributions merging into the operating company — the deck's own
 *  `AnimatedBeam` (already vendored for the "what we do" network), pointed
 *  at a two-source, one-hub layout. The same visual job as Kokonut UI's
 *  `currency-transfer` merge, on the primitive already in this codebase. */
function ContributionBridge() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const oursRef = React.useRef<HTMLDivElement>(null);
  const theirsRef = React.useRef<HTMLDivElement>(null);
  const hubRef = React.useRef<HTMLDivElement>(null);
  return (
    <div className="fd-bridge-stage" ref={containerRef}>
      <AnimatedBeam
        containerRef={containerRef}
        curvature={-46}
        duration={4.6}
        fromRef={oursRef}
        gradientStartColor="var(--mer)"
        gradientStopColor="var(--accent-ink)"
        pathColor="var(--line-2)"
        pathOpacity={0.5}
        pathWidth={1.4}
        toRef={hubRef}
      />
      <AnimatedBeam
        containerRef={containerRef}
        curvature={46}
        duration={4.6}
        delay={0.4}
        fromRef={theirsRef}
        gradientStartColor="var(--gold)"
        gradientStopColor="var(--accent-ink)"
        pathColor="var(--line-2)"
        pathOpacity={0.5}
        pathWidth={1.4}
        toRef={hubRef}
      />
      <div className="fd-bridge-node ours" ref={oursRef}>
        <Mark size={15} />
        <span>Isthmus Meridian</span>
      </div>
      <div className="fd-bridge-node theirs" ref={theirsRef}>
        <span>Founding partners</span>
      </div>
      <div className="fd-bridge-hub" ref={hubRef}>
        <b>Operating</b>
        <span>Company</span>
      </div>
    </div>
  );
}

const Ask: SlideFn = ({ index, total }) => (
  <Screen eyebrow={ASK.eyebrow} index={index} layout="c" total={total}>
    <div className="fd-rise fd-blk-viz" style={{ display: "grid", gridTemplateRows: "minmax(0, 0.85fr) minmax(0, 1.15fr)", gap: 20 }}>
      <div className="fd-viz-plate" style={{ position: "relative", overflow: "hidden" }}>
        <ContributionBridge />
      </div>

      <div className="fd-viz-plate" style={{ gap: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: 22,
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {[ASK.contributions.ours, ASK.contributions.theirs].map((side, i) => (
            <div key={side.label}>
              <Badge variant={i === 0 ? "deck" : "deck-warn"}>{side.label}</Badge>
              <ul className="fd-contrib-list" style={{ marginTop: 12 }}>
                {side.items.map((it) => (
                  <li key={it} style={{ fontSize: 12 }}>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="fd-viz-source" style={{ marginTop: 14 }}>
          {ASK.decisions}
        </p>
      </div>
    </div>

    <H accent={ASK.titleAccent} head={ASK.title} size="sm" />
    <div className="fd-blk-desc">
      <p className="fd-rise" style={{ margin: 0 }}>
        {ASK.desc}
      </p>
      <div className="fd-card-strip fd-rise" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", margin: "18px 0 0" }}>
        {ASK.terms.map((t) => (
          <div className="fd-mini-card" key={t.label}>
            <div className="fd-mini-card-label">{t.label}</div>
            <div className="fd-term-v" style={{ fontSize: 14, marginTop: 4 }}>
              {t.value === null ? <GapPlaceholder width={4} /> : `${t.value as Figure}${t.unit}`}
            </div>
          </div>
        ))}
      </div>
      <div className="fd-rise" style={{ marginTop: 18 }}>
        <Button
          render={
            <a href="mailto:info@isthmusmeridian.com?subject=Isthmus%20Meridian%20%E2%80%94%20the%20crossing" />
          }
          size="sm"
          variant="deck"
        >
          {ASK.cta}
        </Button>
      </div>
      <p className="fd-rise fd-viz-source" style={{ marginTop: 16 }}>
        {ASK.nextStep} {ASK.warning}
      </p>
    </div>
  </Screen>
);

/* ---------------------------------------------------------------- XIII · close */

function CrossingLine() {
  return (
    <div aria-hidden="true" className="fd-crossing">
      <svg className="fd-crossing-svg" preserveAspectRatio="none" viewBox="0 0 1000 40">
        <line className="fd-draw fd-field-glow" x1="0" x2="1000" y1="20" y2="20" />
        <line className="fd-draw fd-field-g" x1="0" x2="1000" y1="20" y2="20" />
      </svg>
      <div className="fd-crossing-labels">
        <span>{CLOSING.crossing.near}</span>
        <span className="serif-i">{CLOSING.crossing.far}</span>
      </div>
    </div>
  );
}

const Closing: SlideFn = () => (
  <>
    <Hero className="fd-hero-right" />
    <div className="fd-body" style={{ justifyContent: "center" }}>
      <div style={{ maxWidth: 620 }}>
        <p className="fd-rise fd-statement">
          {CLOSING.statement} <span className="hi">{CLOSING.statementAccent}</span>
        </p>
        <p className="fd-rise fd-lede">{CLOSING.subline}</p>
        <ol className="fd-rise fd-closing-steps">
          {CLOSING.steps.map((s, i) => (
            <li key={s}>
              <span className="fd-net-n">{i + 1}</span> {s}
            </li>
          ))}
        </ol>
        <div className="fd-rise" style={{ marginTop: 30 }}>
          <CrossingLine />
        </div>
        <div className="fd-rise" style={{ marginTop: 30, flex: "0 0 420px" }}>
          <CardStrip items={CLOSING.meta} />
        </div>
      </div>
    </div>
    <div
      className="fd-rise"
      style={{ position: "absolute", right: 84, bottom: 92, zIndex: 1, color: "var(--silver)" }}
    >
      <Mark size={54} />
    </div>
  </>
);

/* ------------------------------------------------------------------ export */

export type Slide = { render: SlideFn; light?: boolean };

export const SLIDES: Slide[] = [
  { render: Cover },
  { render: Identity },
  { render: Gap, light: true },
  { render: Functions },
  { render: Moat },
  { render: Wedge, light: true },
  { render: Model, light: true },
  { render: Gtm, light: true },
  { render: Roadmap },
  { render: Risks, light: true },
  { render: Ask },
  { render: Closing },
];
