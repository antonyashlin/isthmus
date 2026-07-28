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
import { BackdropChart, CompsChart, CorridorMap, EconomicsChart } from "./echart-charts";
import { runFlywheel } from "./motion";

/**
 * The seventeen slides, in the marketing site's layout language.
 *
 * Each screen carries a heading and ONE piece of evidence, with the emphasis
 * set as a whole serif-italic phrase. Evidence is a rail — a hairline with
 * glowing nodes and columns beneath — not a grid of cards. Roughly half of
 * every canvas is deliberately empty.
 *
 * Screens alternate navy and paper, as the site does; the cover and the close
 * are both navy so the deck opens and lands on the same ground.
 *
 * Nothing here inlines a figure or a sentence — all of it comes from
 * `content.ts`, so the argument can be corrected without touching a component.
 */

export type SlideProps = { active: boolean; index: number; total: number };
type SlideFn = (p: SlideProps) => React.ReactElement;

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX",
  "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII",
];

/* -------------------------------------------------------------- the field */

/**
 * The hero's meridian field, mirrored.
 *
 * These are the site's own paths, lifted verbatim from
 * `components/site/globe-markup.ts` — the globe outline, its four meridian
 * arcs at descending opacity, and the straight ray. The site's viewBox is
 * 1200x2025 and the hero occupies its first third, so the deck frames
 * `0 0 1200 675` to land on exactly the hero crop.
 *
 * The whole thing is then mirrored on X. The site sweeps in from the left; the
 * deck sweeps in from the right, which frees the left margin for the heading
 * and keeps the two surfaces from looking like the same screen twice.
 */
const GLOBE_ROT = "rotate(-14 302 -431)";
const MERIDIANS: Array<[d: string, o: string]> = [
  ["M -407 -431 A 709 700.3 0 0 1 1011 -431 A 709 700.3 0 0 1 -407 -431", "0.5"],
  ["M -407 -431 A 709 674.3 0 0 1 1011 -431 A 709 674.3 0 0 1 -407 -431", "0.2"],
  ["M -407 -431 A 709 631.7 0 0 1 1011 -431 A 709 631.7 0 0 1 -407 -431", "0.08"],
  ["M -407 -431 A 709 573.6 0 0 1 1011 -431 A 709 573.6 0 0 1 -407 -431", "0.032"],
];
/** The lamp rides the brightest meridian, as it does on the site. */
const LAMP_TRACK = MERIDIANS[0][0];

function Field() {
  return (
    <div aria-hidden="true" className="fd-field">
      <svg
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 675"
      >
        {/* mirror: flip on X about the viewBox centre */}
        <g transform="translate(1200 0) scale(-1 1)">
          <g className="fd-field-g" transform={GLOBE_ROT}>
            <circle cx="302" cy="-431" r="709" strokeOpacity="0.8" />
            {MERIDIANS.map(([d, o]) => (
              <path d={d} key={d} strokeOpacity={o} />
            ))}
            <g className="fd-lamp" style={{ offsetPath: `path("${LAMP_TRACK}")` }}>
              <circle className="lp-3" r="9" />
              <circle className="lp-2" r="5.4" />
              <circle className="lp-1" r="2.6" />
              <circle className="lp-0" r="1.3" />
            </g>
          </g>
          <line className="fd-field-g" x1="-180" x2="1300" y1="560" y2="70" />
        </g>
      </svg>
    </div>
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

/** Section label, arc, page number. That is the entire slide furniture. */
function Screen({
  eyebrow,
  index,
  total,
  children,
}: {
  eyebrow?: string;
  index: number;
  total: number;
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
      <div className="fd-body">{children}</div>
      <div className="fd-page">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </>
  );
}

/** Heading. `accent` is a whole phrase, not a word — that is the point. */
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

/**
 * The evidence pattern: one hairline, a glowing node per column, copy beneath.
 * This replaces every grid of cards in the deck.
 */
function Rail({
  cols,
  serif = false,
}: {
  cols: Array<{ key: string; n?: string; title: string; body?: string }>;
  serif?: boolean;
}) {
  return (
    <div className="fd-rail fd-rise">
      <div className="fd-rail-line" />
      <div
        className="fd-rail-cols"
        style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}
      >
        {cols.map((c) => (
          <div key={c.key} style={{ position: "relative" }}>
            <span className="fd-node" style={{ left: 0, top: -5 }} />
            <div style={{ paddingTop: 26 }}>
              {c.n ? <div className="fd-col-n">{c.n}</div> : null}
              <div className={`fd-col-t${serif ? " serif" : ""}`}>{c.title}</div>
              {c.body ? <p className="fd-col-b">{c.body}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Fires off a `source` of ILLUSTRATIVE. An unsourced figure must look it. */
function Provenance({ source, note }: { source: Source; note?: string }) {
  if (isIllustrative(source)) {
    return (
      <div className="fd-rise" style={{ marginTop: 18 }}>
        <span className="fd-illustrative">Illustrative — not sourced</span>
        {note ? (
          <p className="fd-note" style={{ marginTop: 10 }}>
            {note}
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <p className="fd-rise fd-note" style={{ marginTop: 18 }}>
      {source}
    </p>
  );
}

/** A figure the client has not supplied. Never a plausible-looking number. */
function Gap({ width = 6 }: { width?: number }) {
  return <span aria-label="pending" className="fd-gap" style={{ minWidth: `${width}ch` }} />;
}

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

/* ============================================================== I · cover */

const Cover: SlideFn = () => (
  <>
    <Field />
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

/* ============================================================= II · thesis */

const Thesis: SlideFn = ({ index, total }) => (
  <Screen eyebrow={THESIS.eyebrow} index={index} total={total}>
    <H accent={THESIS.titleAccent} head={THESIS.title} />
    <p className="fd-rise fd-lede">{THESIS.lede}</p>
    <Rail
      cols={THESIS.cards.map((c) => ({ key: c.key, title: c.title, body: c.body }))}
      serif
    />
  </Screen>
);

/* ============================================================ III · problem */

const Problem: SlideFn = ({ index, total }) => (
  <Screen eyebrow={PROBLEM.eyebrow} index={index} total={total}>
    <H accent={PROBLEM.titleAccent} head={PROBLEM.title} />
    <p className="fd-rise fd-lede">{PROBLEM.lede}</p>
    <Rail
      cols={PROBLEM.points.map((p, i) => ({
        key: `p${i + 1}`,
        n: `0${i + 1}`,
        title: p.split(" — ")[0],
        body: p.includes(" — ") ? p.split(" — ").slice(1).join(" — ") : undefined,
      }))}
    />
  </Screen>
);

/* ========================================================== IV · backdrop ◆ */

const Backdrop: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={BACKDROP.eyebrow} index={index} total={total}>
    <H accent={BACKDROP.titleAccent} head={BACKDROP.title} size="wide" />
    <div className="fd-plot fd-rise">
      <BackdropChart active={active} />
    </div>
    <Provenance
      note="Replace with Preqin or McKinsey Global Private Markets Review. No clean public series exists for back-office capacity."
      source={BACKDROP.source}
    />
  </Screen>
);

/* ============================================================== V · wedge */

/** A statement screen: the line is the whole slide. */
const Wedge: SlideFn = ({ index, total }) => (
  <Screen eyebrow={WEDGE.eyebrow} index={index} total={total}>
    <p className="fd-rise fd-statement">
      {WEDGE.title} <span className="hi">{WEDGE.titleAccent}</span>
    </p>
    <div className="fd-rail fd-rise">
      <div className="fd-rail-line" />
      <div className="fd-rail-cols" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
        <div style={{ position: "relative" }}>
          <span className="fd-node" style={{ left: 0, top: -5 }} />
          <div style={{ paddingTop: 26 }}>
            <div className="fd-col-n">{WEDGE.panel.eyebrow}</div>
            <div className="fd-col-t">{WEDGE.panel.title}</div>
          </div>
        </div>
        <div style={{ paddingTop: 52 }}>
          <p className="fd-col-b" style={{ maxWidth: "48ch", margin: 0 }}>
            {WEDGE.panel.body}
          </p>
        </div>
      </div>
    </div>
  </Screen>
);

/* ========================================================== VI · functions */

const Functions: SlideFn = ({ index, total }) => (
  <Screen eyebrow={FUNCTIONS.eyebrow} index={index} total={total}>
    <H accent={FUNCTIONS.titleAccent} head={FUNCTIONS.title} />
    <p className="fd-rise fd-lede">
      {FUNCTIONS.footnote} <span className="serif-i">{FUNCTIONS.footnoteAccent}</span>
    </p>
    {/* Eight items, labels only — no bodies. A rail can carry eight; a grid of
        eight cards cannot, which is what made the first version airless. */}
    <div className="fd-rail fd-rise">
      <div className="fd-rail-line" />
      <div
        className="fd-rail-cols"
        style={{ gridTemplateColumns: "repeat(4, 1fr)", rowGap: 34 }}
      >
        {FUNCTIONS.items.map((f, i) => (
          <div key={f.n} style={{ position: "relative" }}>
            {i < 4 ? <span className="fd-node" style={{ left: 0, top: -5 }} /> : null}
            <div style={{ paddingTop: i < 4 ? 26 : 0 }}>
              <div className="fd-col-n">{f.n}</div>
              <div className="fd-col-t" style={{ fontSize: 16, marginTop: 10 }}>
                {f.label}
              </div>
              {f.tag ? (
                <div style={{ marginTop: 10 }}>
                  <span className="fd-chip">{f.tag}</span>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  </Screen>
);

/* =========================================================== VII · flywheel */

const Flywheel: SlideFn = ({ active, index, total }) => {
  const ref = useOnActive(active, runFlywheel);
  const R = 130;
  const C = 158;

  return (
    <Screen eyebrow={FLYWHEEL.eyebrow} index={index} total={total}>
      <div
        ref={ref}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 316px",
          gap: 64,
          alignItems: "center",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div>
          <p className="fd-rise fd-statement" style={{ fontSize: 46, maxWidth: "15ch" }}>
            Enter at a services multiple.{" "}
            <span className="hi">Exit at a software one.</span>
          </p>
          <ol
            className="fd-rise"
            style={{
              listStyle: "none",
              margin: "34px 0 0",
              padding: 0,
              display: "grid",
              gap: 9,
            }}
          >
            {FLYWHEEL.steps.map((s) => (
              <li
                className="fw-step"
                key={s.n}
                style={{ fontSize: 13, lineHeight: 1.55, color: "var(--tx-2)" }}
              >
                <span style={{ color: "var(--accent-ink)", marginRight: 10 }}>{s.n}</span>
                {s.text}{" "}
                <b style={{ color: "var(--heading)", fontWeight: 400 }}>{s.accent}</b>{" "}
                {s.tail}
              </li>
            ))}
          </ol>
        </div>

        <div
          className="fw-stage fd-rise"
          style={{ position: "relative", width: 316, height: 316 }}
        >
          <svg aria-hidden="true" height="316" viewBox="0 0 316 316" width="316">
            <circle cx={C} cy={C} fill="none" r={R} stroke="var(--line-2)" strokeWidth="1" />
            <g
              fill="none"
              stroke="var(--heading)"
              strokeLinecap="round"
              strokeWidth="1.3"
              transform={`translate(${C - 22} ${C - 30}) scale(0.95)`}
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
              y={C + 42}
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
                  position: "absolute",
                  left: `${C + R * Math.cos(a)}px`,
                  top: `${C + R * Math.sin(a)}px`,
                  width: 26,
                  height: 26,
                  margin: "-13px 0 0 -13px",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  color: "var(--tx-3)",
                  background: "var(--bg)",
                  border: "1px solid var(--line-2)",
                  transition:
                    "color .22s var(--ease), border-color .22s var(--ease), box-shadow .22s var(--ease)",
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
                position: "absolute",
                top: 0,
                left: 0,
                width: 9,
                height: 9,
                margin: "-4.5px 0 0 -4.5px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, var(--heading) 0%, var(--mer) 52%, transparent 74%)",
                boxShadow: "0 0 16px 3px color-mix(in srgb, var(--mer) 50%, transparent)",
                offsetPath: `path("M ${C} ${C - R} A ${R} ${R} 0 1 1 ${C - 0.01} ${C - R} Z")`,
                offsetDistance: "var(--t, 0%)",
                offsetRotate: "0deg",
                pointerEvents: "none",
              } as React.CSSProperties
            }
          />
        </div>
      </div>
    </Screen>
  );
};

/* =============================================================== VIII · moat */

const Moat: SlideFn = ({ index, total }) => (
  <Screen eyebrow={MOAT.eyebrow} index={index} total={total}>
    <H accent={MOAT.titleAccent} head={MOAT.title} />
    {/* Two columns divided by one hairline — no boxes, no ticks and crosses. */}
    <div
      className="fd-rise"
      style={{
        marginTop: "auto",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        paddingTop: 38,
        borderTop: "1px solid var(--line-2)",
      }}
    >
      <div>
        <div className="fd-label">{MOAT.wrappers.label}</div>
        <ul style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "grid", gap: 12 }}>
          {MOAT.wrappers.rows.map((r) => (
            <li key={r} style={{ fontSize: 13, color: "var(--tx-3)" }}>
              {r}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="fd-label" style={{ color: "var(--accent-ink)" }}>
          {MOAT.ours.label}
        </div>
        <ul style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "grid", gap: 12 }}>
          {MOAT.ours.rows.map((r) => (
            <li key={r} style={{ fontSize: 13, color: "var(--heading)" }}>
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Screen>
);

/* ========================================================= IX · economics ◆ */

const Economics: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={ECONOMICS.eyebrow} index={index} total={total}>
    <H accent={ECONOMICS.titleAccent} head={ECONOMICS.title} size="wide" />
    <div className="fd-plot fd-rise">
      <EconomicsChart active={active} />
    </div>
    <Provenance
      note="Needs AND Capital revenue, delivery cost, and the automation rate actually observed per workflow."
      source={ECONOMICS.source}
    />
  </Screen>
);

/* ============================================================== X · market */

const Market: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={MARKET.eyebrow} index={index} total={total}>
    <H accent={MARKET.titleAccent} head={MARKET.title} />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gap: 64,
        alignItems: "center",
        flex: 1,
        minHeight: 0,
        marginTop: 22,
      }}
    >
      <div className="fd-plot fd-rise" style={{ marginTop: 0 }}>
        <CompsChart active={active} />
      </div>
      <div className="fd-rise">
        <div className="fd-label">{MARKET.multiple.label}</div>
        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 72,
            lineHeight: 1,
            color: "var(--accent-ink)",
            marginTop: 14,
          }}
        >
          {MARKET.multiple.display}
        </div>
        <p className="fd-col-b" style={{ marginTop: 16 }}>
          {MARKET.multiple.caption}
        </p>
      </div>
    </div>
    <p className="fd-rise fd-note">{MARKET.compsSource}</p>
    <p className="fd-rise fd-note" style={{ color: "var(--gold)", marginTop: 6 }}>
      {MARKET.compsStale}
    </p>
  </Screen>
);

/* ========================================================== XI · structure ◆ */

const Structure: SlideFn = ({ index, total }) => {
  const { tree, counter, pending } = STRUCTURE;
  const entities = [tree.parent, ...tree.children];

  return (
    <Screen eyebrow={STRUCTURE.eyebrow} index={index} total={total}>
      <H accent={STRUCTURE.titleAccent} head={STRUCTURE.title} />
      <p className="fd-rise fd-lede">{STRUCTURE.lede}</p>
      {/* The entity sequence as a rail — a tree diagram was three boxes and a
          wire doing the work one timeline does better. */}
      <Rail
        cols={entities.map((e) => ({
          key: e.key,
          n: e.timing,
          title: e.label,
          body: e.note,
        }))}
      />
      <div
        className="fd-rise"
        style={{ marginTop: 24, display: "flex", gap: 18, alignItems: "flex-start" }}
      >
        <span className="fd-chip warn" style={{ flex: "none" }}>
          {counter.label}
        </span>
        <p className="fd-note" style={{ maxWidth: "76ch" }}>
          {counter.body} {pending}
        </p>
      </div>
    </Screen>
  );
};

/* ========================================================== XII · corridor ◆ */

const Corridor: SlideFn = ({ active, index, total }) => (
  <Screen eyebrow={CORRIDOR.eyebrow} index={index} total={total}>
    <H accent={CORRIDOR.titleAccent} head={CORRIDOR.title} size="wide" />
    <div className="fd-plot fd-plot-mask fd-rise">
      <CorridorMap active={active} />
    </div>
    <p className="fd-rise fd-note">{CORRIDOR.caption}</p>
  </Screen>
);

/* ========================================================= XIII · roadmap ◆ */

const Roadmap: SlideFn = ({ index, total }) => (
  <Screen eyebrow={ROADMAP.eyebrow} index={index} total={total}>
    <H accent={ROADMAP.titleAccent} head={ROADMAP.title} />
    <Rail
      cols={ROADMAP.milestones.map((m) => ({
        key: m.when,
        n: m.when,
        title: m.title,
        body: m.body,
      }))}
    />
    <Provenance source={ROADMAP.source} />
  </Screen>
);

/* ============================================================== XIV · team ◆ */

const Team: SlideFn = ({ index, total }) => (
  <Screen eyebrow={TEAM.eyebrow} index={index} total={total}>
    <H accent="still open." head="The bench behind customer zero, and the seats" />
    {/* No names supplied. Inventing founders in a founding-partner deck would
        be the worst fabrication this document could contain, so the seats are
        named and the people stay labelled gaps. */}
    <Rail
      cols={[
        ...TEAM.openSeats.map((s) => ({
          key: s.role,
          n: "OPEN",
          title: s.role,
          body: s.note,
        })),
        { key: "pending", n: "PENDING", title: "—", body: TEAM.emptyNote },
      ]}
    />
  </Screen>
);

/* ============================================================= XV · risks ◆ */

const Risks: SlideFn = ({ index, total }) => (
  <Screen eyebrow={RISKS.eyebrow} index={index} total={total}>
    <H accent={RISKS.titleAccent} head={RISKS.title} />
    <Rail
      cols={RISKS.items.map((r, i) => ({
        key: r.risk,
        n: `0${i + 1}`,
        title: r.risk,
        body: r.mitigation,
      }))}
    />
  </Screen>
);

/* =============================================================== XVI · ask ◆ */

const Ask: SlideFn = ({ index, total }) => (
  <Screen eyebrow={ASK.eyebrow} index={index} total={total}>
    <H accent={ASK.titleAccent} head={ASK.title} />
    <p className="fd-rise fd-lede" style={{ marginTop: 22, maxWidth: "46ch" }}>{ASK.lede}</p>

    {/* The proposal drawn as one rail in two equal halves. If the halves are
        not equal the slide is lying, so the geometry carries the claim and the
        numbers only label it. */}
    <div className="fd-rise fd-split-bar">
      <div className="sb-track">
        <span className="sb-ours" style={{ flexBasis: `${ASK.split.ours}%` }} />
        <span className="sb-theirs" style={{ flexBasis: `${ASK.split.theirs}%` }} />
      </div>
      <div className="sb-legend">
        <span>
          <b>{ASK.split.ours}%</b> {ASK.splitLabels.ours}
        </span>
        <span>
          <b>{ASK.split.theirs}%</b> {ASK.splitLabels.theirs}
        </span>
      </div>
    </div>

    <div className="fd-rise fd-contribs">
      {[ASK.contributions.ours, ASK.contributions.theirs].map((side) => (
        <div key={side.label}>
          <div className="fd-label">{side.label}</div>
          <ul className="fd-contrib-list">
            {side.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="fd-rise fd-ask-foot">
      <div>
        <p className="fd-note" style={{ maxWidth: "56ch" }}>
          {ASK.governance}
        </p>
        <div className="fd-ask-warn">
          <span className="fd-chip warn">TERMS PENDING</span>
          <p className="fd-note">{ASK.warning}</p>
        </div>
      </div>
      <div className="fd-ask-terms">
        {ASK.terms.map((t) => (
          <div key={t.label}>
            <div className="fd-label">{t.label}</div>
            <div className="fd-term-v">
              {t.value === null ? <Gap width={5} /> : `${t.value}${t.unit}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  </Screen>
);

/* ============================================================ XVII · closing */

const Closing: SlideFn = () => (
  <>
    <Field />
    <div className="fd-body" style={{ justifyContent: "center" }}>
      <p className="fd-rise fd-statement">
        The crossing, and the <span className="hi">line you cross it by.</span>
      </p>
      <div
        className="fd-rise"
        style={{ marginTop: 52, display: "flex", gap: 64 }}
      >
        <div>
          <div className="fd-label">Structure</div>
          <div style={{ fontSize: 15, color: "var(--tx-2)", marginTop: 8 }}>
            Delaware · Dubai
          </div>
        </div>
        <div>
          <div className="fd-label">Opportunity</div>
          <div style={{ fontSize: 15, color: "var(--tx-2)", marginTop: 8 }}>
            AND Capital · 50/50 JV
          </div>
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

/**
 * Screens alternate navy and paper, as the site does. The cover and the close
 * are both navy so the deck opens and lands on the same ground.
 */
export const SLIDES: Slide[] = [
  { render: Cover },
  { render: Thesis },
  { render: Problem, light: true },
  { render: Backdrop },
  { render: Wedge, light: true },
  { render: Functions },
  { render: Flywheel, light: true },
  { render: Moat },
  { render: Economics, light: true },
  { render: Market },
  { render: Structure, light: true },
  { render: Corridor },
  { render: Roadmap, light: true },
  { render: Team },
  { render: Risks, light: true },
  { render: Ask },
  { render: Closing },
];
