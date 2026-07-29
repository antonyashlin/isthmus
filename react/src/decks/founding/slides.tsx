"use client";

import * as React from "react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  Bar,
  BarChart,
  BarXAxis,
  ChartTooltip,
  FunnelChart,
  Grid,
  PieCenter,
  PieChart,
  PieSlice,
  RadarArea,
  RadarAxis,
  RadarChart,
  RadarGrid,
  RadarLabels,
} from "@/components/charts";
import { GLOBE_HTML } from "@/components/site/globe-markup";
import {
  ASK,
  CLOSING,
  CURRENT,
  DECK,
  type Figure,
  FUNCTIONS,
  GAP,
  IDENTITY,
  isIllustrative,
  MARKET,
  MOAT,
  MODEL,
  RISKS,
  ROADMAP,
  type Source,
  STRUCTURE,
} from "./content";
import { GapChart, ModelChart } from "./bklit-charts";
import { CompsChart, MAP_ASPECT, RoadmapHeatmap, StructureMap } from "./echart-charts";

/**
 * The fourteen slides of the second build (2026-07-29).
 *
 * Every content slide follows the site's own block pattern — eyebrow, heading,
 * one-line description, then a real chart or animated illustration on a
 * plate (`.fd-blk-desc` / `.fd-blk-viz` / `.fd-viz-plate`, all lifted from the
 * site's `.blk-head` / `.blk-desc` / `.blk-viz` / `.viz-plate` rules). Nothing
 * here is text next to a bare line with bullet points under it.
 *
 * Charts come from two places: the Bklit visx primitives already vendored at
 * `@/components/charts` (Ring, Radar, Bar, Funnel, Pie) and the deck's own
 * four ECharts figures in `echart-charts.tsx`. The two illustration slides use
 * magicui's OrbitingCircles and AnimatedBeam, vendored (not hand-drawn) via
 * `@/components/ui/*`.
 */

export type SlideProps = { active: boolean; index: number; total: number };
type SlideFn = (p: SlideProps) => React.ReactElement;

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX",
  "X", "XI", "XII", "XIII", "XIV",
];

/* -------------------------------------------------------------- the field */

/**
 * The ambient background carried on every content slide (II–XIV) — a very
 * large globe, pushed mostly off-canvas and heavily blurred, so it reads as
 * atmosphere in the corner rather than a diagram. No crisp lines, no motion —
 * that register belongs to the cover's hero alone.
 */
const GLOBE_ROT = "rotate(-14 302 -431)";
const MERIDIANS: Array<[d: string, o: string]> = [
  ["M -407 -431 A 709 700.3 0 0 1 1011 -431 A 709 700.3 0 0 1 -407 -431", "0.5"],
  ["M -407 -431 A 709 674.3 0 0 1 1011 -431 A 709 674.3 0 0 1 -407 -431", "0.2"],
  ["M -407 -431 A 709 631.7 0 0 1 1011 -431 A 709 631.7 0 0 1 -407 -431", "0.08"],
  ["M -407 -431 A 709 573.6 0 0 1 1011 -431 A 709 573.6 0 0 1 -407 -431", "0.032"],
];
/** Scale the whole globe up around its own centre (302, -431). */
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

/**
 * Slide one only — the site's own hero field, `GLOBE_HTML` lifted verbatim,
 * cropped to its hero third exactly the way the site crops it (the SVGs run
 * 3x the wrapper's height; only the top third shows, matching `.fg{height:
 * 300vh}` at scroll position zero). Both globes the hero shows are present —
 * the earlier deck only ever ported the first one.
 */
function Hero() {
  return (
    <div
      aria-hidden="true"
      className="fd-hero-field"
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
  /** Which of the four reference-deck templates this slide reads as.
   * Omit for slides that build their own internal grid (Market, Ask). */
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
}: {
  head: string;
  accent?: string;
  size?: "sm" | "wide";
}) {
  return (
    <h2 className={`fd-rise fd-h${size ? ` ${size}` : ""}`}>
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
function Plate({
  children,
  source,
}: {
  children: React.ReactNode;
  source?: Source;
}) {
  return (
    <div className="fd-rise fd-blk-viz">
      <div className="fd-viz-plate">{children}</div>
      {source ? (
        isIllustrative(source) ? (
          <span className="fd-illustrative" style={{ marginTop: 12 }}>
            Illustrative — not sourced
          </span>
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

/* ============================================================== I · cover */

const Cover: SlideFn = () => (
  <>
    <Hero />
    <h1 className="fd-rise fd-cover-h">
      {DECK.proposition} <span className="serif-i">{DECK.propositionAccent}</span>
    </h1>
    <div className="fd-rise fd-lockup">
      <span className="lk-1">ISTHMUS</span>
      <span className="lk-2">Meridian</span>
    </div>
    <div className="fd-rise fd-cover-meta">
      <span>{DECK.classification}</span>
      <span>·</span>
      <span>{DECK.place}</span>
      <span>·</span>
      <span>{DECK.date}</span>
    </div>
  </>
);

/* ======================================================= II · what we are */

const IdentityIllustration = () => (
  <div className="fd-orbit-stage">
    <div className="fd-orbit-hub">
      <Mark size={20} />
      <span>{IDENTITY.hub}</span>
    </div>
    <OrbitingCircles duration={42} iconSize={10} path radius={130}>
      {IDENTITY.nodes.map((n) => (
        <div className="fd-orbit-node" key={n.key}>
          {n.label}
        </div>
      ))}
    </OrbitingCircles>
    <OrbitingCircles duration={30} iconSize={6} path={false} radius={64} reverse />
  </div>
);

const Identity: SlideFn = ({ index, total }) => (
  <Screen eyebrow={IDENTITY.eyebrow} index={index} layout="c" total={total}>
    <H accent={IDENTITY.titleAccent} head={IDENTITY.title} size="wide" />
    <Desc>{IDENTITY.desc}</Desc>
    <Plate>
      <IdentityIllustration />
    </Plate>
  </Screen>
);

/* -------------------------------------------------------------- IV · the gap */

const Gap: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={GAP.eyebrow} index={index} layout="b" total={total}>
    <H accent={GAP.titleAccent} head={GAP.title} size="wide" />
    <Desc>{GAP.desc}</Desc>
    <Plate source={GAP.source}>
      <GapChart />
    </Plate>
  </Screen>
);

/* ------------------------------------------------------------- V · what we do */

const NET_SHORT: Record<string, string> = {
  "01": "Deal sourcing",
  "02": "Due diligence",
  "03": "Modeling & valuation",
  "04": "Capital formation",
  "05": "Fund & investment ops",
  "06": "Portfolio & LP reporting",
  "07": "Data ops & AI",
  "08": "Market research",
};

function useNodeRefs(n: number) {
  const store = React.useRef<React.RefObject<HTMLDivElement | null>[] | null>(null);
  if (!store.current) {
    store.current = Array.from({ length: n }, () => React.createRef<HTMLDivElement>());
  }
  return store.current;
}

const FunctionNetwork = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hubRef = React.useRef<HTMLDivElement>(null);
  const nodeRefs = useNodeRefs(FUNCTIONS.items.length);
  const n = FUNCTIONS.items.length;
  const RX = 41;
  const RY = 39;

  return (
    <div className="fd-net-stage" ref={containerRef}>
      {FUNCTIONS.items.map((f, i) => (
        <AnimatedBeam
          containerRef={containerRef}
          curvature={0}
          delay={i * 0.22}
          duration={4.2}
          fromRef={hubRef}
          gradientStartColor="var(--mer)"
          gradientStopColor="var(--accent-ink)"
          key={f.n}
          pathColor="var(--line-2)"
          pathOpacity={0.55}
          pathWidth={1}
          toRef={nodeRefs[i]}
        />
      ))}
      {FUNCTIONS.items.map((f, i) => {
        const a = (-90 + (360 / n) * i) * (Math.PI / 180);
        const left = 50 + RX * Math.cos(a);
        const top = 50 + RY * Math.sin(a);
        return (
          <div
            className="fd-net-node"
            key={f.n}
            ref={nodeRefs[i]}
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <span className="fd-net-n">{f.n}</span>
            {NET_SHORT[f.n] ?? f.label}
          </div>
        );
      })}
      <div className="fd-net-hub" ref={hubRef}>
        <b>Operating</b>
        <span>Layer</span>
      </div>
    </div>
  );
};

const Functions: SlideFn = ({ index, total }) => (
  <Screen eyebrow={FUNCTIONS.eyebrow} index={index} layout="a" total={total}>
    <H accent={FUNCTIONS.titleAccent} head={FUNCTIONS.title} />
    <Desc>{FUNCTIONS.desc}</Desc>
    <Plate>
      <FunctionNetwork />
    </Plate>
  </Screen>
);

/* ------------------------------------------------ VI · how we stack up · moat */

const MoatBars = () => {
  const data = MOAT.axes.map((a) => ({
    axis: a.label,
    wrappers: a.wrappers,
    ours: a.ours,
  }));
  return (
    <div className="fd-chart-fill">
      <BarChart
        aspectRatio="4.6 / 1"
        barGap={0.35}
        data={data}
        margin={{ top: 10, right: 10, bottom: 38, left: 10 }}
        xDataKey="axis"
      >
        <Grid horizontal />
        <Bar dataKey="wrappers" fill="var(--tx-3)" lineCap="round" />
        <Bar dataKey="ours" fill="var(--accent-ink)" lineCap="round" />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </div>
  );
};

const Moat: SlideFn = ({ index, total }) => (
  <Screen eyebrow={MOAT.eyebrow} index={index} layout="c" total={total}>
    <H accent={MOAT.titleAccent} head={MOAT.title} size="wide" />
    <Desc>{MOAT.desc}</Desc>
    <Plate source={MOAT.source}>
      <MoatBars />
    </Plate>
  </Screen>
);

/* ---------------------------------------------- VII · how we stack up · market */

const Market: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={MARKET.eyebrow} index={index} total={total}>
    <H accent={MARKET.titleAccent} head={MARKET.title} />
    <Desc>{MARKET.desc}</Desc>
    <div
      className="fd-rise fd-blk-viz"
      style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 28, minHeight: 230 }}
    >
      <div className="fd-viz-plate">
        <div className="fd-label" style={{ marginBottom: 4 }}>
          {MARKET.compsLabel}
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <CompsChart active={active} />
        </div>
      </div>
      <div className="fd-viz-plate" style={{ justifyContent: "center" }}>
        <div className="fd-label">{MARKET.multiple.label}</div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            marginTop: 12,
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            color: "var(--accent-ink)",
          }}
        >
          <span style={{ fontSize: 40 }}>{MARKET.multiple.low}–</span>
          <NumberTicker
            className="serif-i"
            style={{ fontSize: 60, fontStyle: "italic", color: "var(--accent-ink)" }}
            value={MARKET.multiple.high}
          />
          <span style={{ fontSize: 40 }}>×</span>
        </div>
        <p className="fd-col-b" style={{ marginTop: 14 }}>
          {MARKET.multiple.caption}
        </p>
      </div>
    </div>
    <p className="fd-rise fd-viz-source">{MARKET.compsSource}</p>
    <p className="fd-rise fd-viz-source" style={{ color: "var(--gold)", marginTop: 4 }}>
      {MARKET.compsStale}
    </p>
  </Screen>
);

/* -------------------------------------------------------------- VIII · model */

const Model: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={MODEL.eyebrow} index={index} layout="b" total={total}>
    <H accent={MODEL.titleAccent} head={MODEL.title} size="wide" />
    <Desc>{MODEL.desc}</Desc>
    <Plate source={MODEL.source}>
      <ModelChart />
    </Plate>
  </Screen>
);

/* ---------------------------------------------------------- IX · where we are */

const CurrentFunnel = () => (
  <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", overflow: "hidden" }}>
    <div style={{ width: 210, maxWidth: "100%", padding: "0 34px" }}>
      <FunnelChart
        color="var(--accent-ink)"
        data={CURRENT.funnel}
        orientation="vertical"
        showLabels
        showPercentage
        showValues
        style={{ height: "100%" }}
      />
    </div>
  </div>
);

const Current: SlideFn = ({ index, total }) => (
  <Screen eyebrow={CURRENT.eyebrow} index={index} layout="c" total={total}>
    <H accent={CURRENT.titleAccent} head={CURRENT.title} />
    <Desc>{CURRENT.desc}</Desc>
    <Plate source={CURRENT.source}>
      <CurrentFunnel />
    </Plate>
  </Screen>
);

/* ------------------------------------------------------- X · how we get there */

const Structure: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={STRUCTURE.eyebrow} index={index} layout="a" total={total}>
    <H accent={STRUCTURE.titleAccent} head={STRUCTURE.title} size="wide" />
    <Desc>{STRUCTURE.desc}</Desc>
    <Plate>
      {/* Longitude and latitude aren't equal-sized units off the equator —
          plotted 1:1 the corridor reads skewed. The chart itself corrects
          for that (`MAP_ASPECT`), but the correction only holds if this box
          is actually that shape; a wider/shorter box would just stretch it
          straight back out. */}
      <div style={{ height: "100%", aspectRatio: MAP_ASPECT, alignSelf: "center" }}>
        <StructureMap active={active} />
      </div>
    </Plate>
    <p className="fd-rise fd-viz-source">{STRUCTURE.caption}</p>
  </Screen>
);

/* -------------------------------------------------------- XI · long-term plan */

const RoadmapBars = () => {
  const data = ROADMAP.months.map((m, i) => ({
    month: m,
    automated: ROADMAP.workflowsAutomated[i],
  }));
  return (
    <div className="fd-chart-fill">
      <BarChart
        aspectRatio="5.4 / 1"
        data={data}
        margin={{ top: 16, right: 16, bottom: 34, left: 10 }}
        xDataKey="month"
      >
        <Grid horizontal />
        <Bar dataKey="automated" fill="var(--accent-ink)" lineCap="round" />
        <BarXAxis />
        <ChartTooltip />
      </BarChart>
    </div>
  );
};

const Roadmap: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={ROADMAP.eyebrow} index={index} layout="d" total={total}>
    <H accent={ROADMAP.titleAccent} head={ROADMAP.title} size="wide" />
    <Desc>{ROADMAP.desc}</Desc>
    <div className="fd-rise fd-blk-viz">
      <div className="fd-viz-plate">
        <div className="fd-label" style={{ marginBottom: 6 }}>
          ROLLOUT BY FUNCTION
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <RoadmapHeatmap active={active} />
        </div>
      </div>
      <div className="fd-viz-plate">
        <div className="fd-label" style={{ marginBottom: 6 }}>
          WORKFLOWS AUTOMATED, CUMULATIVE
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <RoadmapBars />
        </div>
        <div
          style={{
            display: "flex",
            flex: "0 0 auto",
            gap: 14,
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid var(--line)",
          }}
        >
          {ROADMAP.milestones.map((m) => (
            <div key={m.at} style={{ flex: 1 }}>
              <div className="fd-col-n">{m.at}</div>
              <div style={{ fontSize: 11, color: "var(--tx-2)", marginTop: 3, lineHeight: 1.3 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <p className="fd-rise fd-viz-source" style={{ marginTop: 14 }}>
      {ROADMAP.source}
    </p>
  </Screen>
);

/* --------------------------------------------------------- XII · what could go wrong */

const RiskRadar = () => {
  const data = [
    { label: "Exposure today", color: "var(--gold)", values: RISKS.exposure },
    { label: "Mitigated", color: "var(--accent-ink)", values: RISKS.mitigated },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <RadarChart data={data} levels={4} margin={54} metrics={RISKS.metrics}>
          <RadarGrid showLabels={false} strokeOpacity={0.4} />
          <RadarAxis strokeOpacity={0.35} />
          <RadarLabels fontSize={11.5} offset={16} />
          {data.map((d, i) => (
            <RadarArea color={d.color} index={i} key={d.label} />
          ))}
        </RadarChart>
      </div>
      <ul
        className="radarw-key"
        style={{
          display: "flex",
          gap: 24,
          borderTop: "none",
          paddingTop: 0,
          marginTop: 6,
          justifyContent: "center",
        }}
      >
        {data.map((d) => (
          <li key={d.label}>
            <div className="rk">
              <span className="rk-top">
                <span className="rk-label" style={{ color: d.color }}>
                  {d.label}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Risks: SlideFn = ({ index, total }) => (
  <Screen eyebrow={RISKS.eyebrow} index={index} layout="c" total={total}>
    <H accent={RISKS.titleAccent} head={RISKS.title} />
    <Desc>{RISKS.desc}</Desc>
    <Plate>
      <RiskRadar />
    </Plate>
  </Screen>
);

/* ------------------------------------------------------------- XIII · the ask */

const AskPie = () => (
  <PieChart data={ASK.split} size={112}>
    {ASK.split.map((d, i) => (
      <PieSlice color={i === 0 ? "var(--accent-ink)" : "var(--line-3)"} index={i} key={d.label} />
    ))}
    <PieCenter defaultLabel="split" />
  </PieChart>
);

const Ask: SlideFn = ({ index, total }) => (
  <Screen eyebrow={ASK.eyebrow} index={index} layout="d" total={total}>
    <H accent={ASK.titleAccent} head={ASK.title} />
    <Desc>{ASK.desc}</Desc>

    <div className="fd-rise fd-blk-viz">
      <div
        className="fd-viz-plate"
        style={{ alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}
      >
        <BorderBeam colorFrom="var(--mer)" colorTo="var(--accent-ink)" duration={7} size={90} />
        <AskPie />
        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          {ASK.split.map((d, i) => (
            <div key={d.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  color: i === 0 ? "var(--accent-ink)" : "var(--heading)",
                }}
              >
                {d.value}%
              </div>
              <div className="fd-label" style={{ marginTop: 2, fontSize: 9.5 }}>
                {d.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fd-viz-plate" style={{ gap: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {[ASK.contributions.ours, ASK.contributions.theirs].map((side, i) => (
            <div key={side.label}>
              <Badge variant={i === 0 ? "deck" : "deck-warn"}>{side.label}</Badge>
              <ul className="fd-contrib-list" style={{ marginTop: 10 }}>
                {side.items.slice(0, 2).map((it) => (
                  <li key={it} style={{ fontSize: 11.5 }}>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid var(--line)",
          }}
        >
          <div style={{ display: "flex", gap: 22 }}>
            {ASK.terms.map((t) => (
              <div key={t.label}>
                <div className="fd-label" style={{ fontSize: 9.5 }}>
                  {t.label}
                </div>
                <div className="fd-term-v" style={{ fontSize: 15, marginTop: 4 }}>
                  {t.value === null ? <GapPlaceholder width={4} /> : `${t.value as Figure}${t.unit}`}
                </div>
              </div>
            ))}
          </div>
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
      </div>
    </div>

    <p className="fd-rise fd-viz-source" style={{ marginTop: 12 }}>
      {ASK.governance} {ASK.warning}
    </p>
  </Screen>
);

/* ---------------------------------------------------------------- XIV · close */

const Closing: SlideFn = () => (
  <>
    <Field />
    <div className="fd-body" style={{ justifyContent: "center" }}>
      <p className="fd-rise fd-statement">
        {CLOSING.statement} <span className="hi">{CLOSING.statementAccent}</span>
      </p>
      <div className="fd-rise" style={{ marginTop: 52, display: "flex", gap: 64 }}>
        <div>
          <div className="fd-label">Structure</div>
          <div style={{ fontSize: 15, color: "var(--tx-2)", marginTop: 8 }}>{CLOSING.structure}</div>
        </div>
        <div>
          <div className="fd-label">Opportunity</div>
          <div style={{ fontSize: 15, color: "var(--tx-2)", marginTop: 8 }}>{CLOSING.opportunity}</div>
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
  { render: Moat, light: true },
  { render: Market },
  { render: Model, light: true },
  { render: Current },
  { render: Structure, light: true },
  { render: Roadmap },
  { render: Risks, light: true },
  { render: Ask },
  { render: Closing },
];
