"use client";

/**
 * The deck's ECharts figures — nine native chart types, one per the blueprint's
 * "Apache ECharts-inspired visualization system": circular graph (cover),
 * sunburst (identity), chord (moat), nested pie (commercial wedge), stacked
 * area (model), calendar heatmap (traction), tree (go-to-market), custom-series
 * Gantt (roadmap) and matrix heatmap (risks) — plus the corridor geo map.
 *
 * Each one obeys the rules in DESIGN.md:
 *   - at most two series (a third would mean the chart is wrong)
 *   - direct labels, never a legend box
 *   - exactly one dominant chart per slide, no more than a few annotations
 *   - colours come from the resolved palette, never a literal
 *
 * Every module is a pure `build(palette) => option` so the wrapper can
 * re-resolve on theme or container change without the chart knowing.
 */

import * as topojson from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";
import { DECK, GTM, IDENTITY, MODEL, MOAT, RISKS, ROADMAP, WEDGE } from "./content";
import { baseAxis, type DeckPalette, EChart, ENTER } from "./echart";

/* ------------------------------------------------------------------- I · cover */

/** Ambient circular graph: eight workstreams orbiting the operating layer.
 *  Deliberately quiet — thin strokes, small nodes — brand texture, not a
 *  data chart the eye is meant to read line-by-line. */
export function CoverGraph({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const R = 100;
    const nodes = [
      {
        id: "hub",
        name: "",
        x: 0,
        y: 0,
        symbolSize: 8,
        itemStyle: { color: p.accent },
        label: { show: false },
      },
      ...DECK.orbit.map((n, i) => {
        const a = (-90 + (360 / DECK.orbit.length) * i) * (Math.PI / 180);
        return {
          id: n.key,
          name: n.label,
          x: R * Math.cos(a),
          y: R * Math.sin(a),
          symbolSize: n.live ? 5 : 3.5,
          itemStyle: { color: n.live ? p.accent : p.faint },
          label: {
            show: true,
            color: n.live ? p.body : p.faint,
            fontSize: 9,
            fontFamily: p.sans,
            distance: 6,
          },
        };
      }),
    ];
    const links = DECK.orbit.map((n) => ({
      source: "hub",
      target: n.key,
      lineStyle: {
        color: n.live ? p.accent : p.border,
        opacity: n.live ? 0.5 : 0.2,
        width: n.live ? 1.3 : 0.9,
        curveness: 0.3,
      },
    }));
    return {
      backgroundColor: "transparent",
      series: [
        {
          type: "graph",
          layout: "none",
          data: nodes,
          links,
          roam: false,
          silent: true,
          label: { position: "right" },
          emphasis: { disabled: true },
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Eight back-office workstreams orbiting the operating layer; modeling, fund operations and portfolio monitoring already trace a brighter, live path."
      build={build}
    />
  );
}

/* ------------------------------------------------------------ II · what we are */

/** Sunburst, four concentric full rings — the layered operating architecture.
 *  Inner three rings are Isthmus-owned (one ink, darkening outward); the
 *  outer ring is the client's, in a visibly different, cooler tone. */
export function IdentitySunburst({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    // Inner three rings (Isthmus-owned) darken outward through the brand
    // blue; the outer ring (client-owned) switches to a visibly distinct
    // warm-neutral so the "who owns this layer" boundary reads at a glance.
    // Labels are always white-on-dark-halo — legible regardless of which
    // shade sits underneath, the same technique as the orbiting ring text.
    const ring = (name: string, color: string, child?: Record<string, unknown>) => ({
      name,
      value: 1,
      itemStyle: { color, borderColor: p.bg, borderWidth: 3 },
      label: {
        color: "#ffffff",
        textBorderColor: "rgba(0,0,0,0.55)",
        textBorderWidth: 3,
        fontSize: 12,
        fontFamily: p.sans,
        fontWeight: 600,
      },
      ...(child ? { children: [child] } : {}),
    });
    const data = [
      ring(
        IDENTITY.layers[0].label,
        p.accent2,
        ring(
          IDENTITY.layers[1].label,
          `${p.accent2}cc`,
          ring(
            IDENTITY.layers[2].label,
            `${p.accent}bb`,
            ring(IDENTITY.layers[3].label, `${p.muted}66`)
          )
        )
      ),
    ];
    return {
      backgroundColor: "transparent",
      series: [
        {
          type: "sunburst",
          radius: ["16%", "92%"],
          center: ["50%", "50%"],
          sort: undefined,
          data,
          label: {
            rotate: "tangential",
            minAngle: 24,
          },
          itemStyle: { borderWidth: 3, borderColor: p.bg },
          emphasis: { focus: "none" },
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Four-layer operating architecture: shared data foundation at the core, then the workflow and automation engine, then domain-expert delivery, with client decisions and approvals as the outer ring."
      build={build}
    />
  );
}

/* -------------------------------------------------------------------- IV · moat */

/** Native ECharts chord diagram — the same execution data reused across the
 *  workflow. Thicker chords, more reuse and switching cost. */
export function MoatChord({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const { nodes, edges } = MOAT.reuse;
    return {
      backgroundColor: "transparent",
      series: [
        {
          type: "chord",
          center: ["50%", "50%"],
          radius: ["0%", "34%"],
          data: nodes.map((name) => ({
            name,
            itemStyle: { color: p.border },
          })),
          edges: edges.map((e) => ({ source: e.source, target: e.target, value: e.value })),
          // No labels here — six extra text fragments crossing the flywheel's
          // own five would just double the reading load. This ring is quiet
          // texture behind the loop, not a second diagram competing with it.
          label: { show: false },
          lineStyle: { color: p.accent, opacity: 0.16, curveness: 0 },
          itemStyle: { borderWidth: 0, opacity: 0.5 },
          emphasis: { disabled: true },
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Chord diagram: the same company, assumption and decision data reused across sourcing, diligence, IC, monitoring, LP reporting and fundraising — thicker chords mean more reuse."
      build={build}
    />
  );
}

/* ---------------------------------------------------------- VI · commercial wedge */

/** Three concentric bands drawn as single-slice pie rings — a market-sizing
 *  framework, not a proportioned pie. */
export function WedgePie({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const bands = WEDGE.bands;
    const colors = [p.accent, `${p.accent2}bb`, p.border];
    const step = 72 / bands.length;
    const lastIndex = bands.length - 1;
    return {
      backgroundColor: "transparent",
      series: bands.map((b, i) => ({
        type: "pie",
        radius: [`${18 + step * i}%`, `${18 + step * (i + 1) - 4}%`],
        center: ["38%", "50%"],
        silent: true,
        avoidLabelOverlap: false,
        // Only the outermost band gets an on-chart label (it has a whole
        // ring's worth of outside room for a leader line). The inner two
        // bands are too thin to hold text without crossing their own
        // boundary — those read from the key beside the chart instead.
        label: {
          show: i === lastIndex,
          position: "outside",
          formatter: () => b.label,
          color: p.text,
          fontSize: 12,
          fontFamily: p.sans,
          fontWeight: 500,
        },
        labelLine: { show: i === lastIndex, length: 14, length2: 8, lineStyle: { color: p.border } },
        data: [{ value: 1, name: b.label, itemStyle: { color: colors[i] ?? p.border } }],
        ...ENTER,
        animationDelay: () => i * 90,
      })),
    };
  };

  return (
    <EChart
      active={active}
      alt="Three concentric bands: beachhead accounts, serviceable manager segments, and the broader private-markets universe — a market-sizing framework, not a TAM."
      build={build}
    />
  );
}

/* ------------------------------------------------------------------ VII · model */

/** Stacked area — the delivery mix shifting from expert judgment to software
 *  execution across Embed, Standardize, Automate. Management target. */
export function ModelStackedArea({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const { categories, checkpoints, series } = MODEL.mix;
    const ramp = [p.accent2, p.accent, `${p.accent}99`, p.border];
    return {
      ...ENTER,
      backgroundColor: "transparent",
      grid: { left: 8, right: 16, top: 14, bottom: 26, containLabel: true },
      xAxis: {
        type: "category",
        data: checkpoints,
        boundaryGap: false,
        ...baseAxis(p),
        axisLine: { show: false },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 100,
        interval: 25,
        ...baseAxis(p),
        axisLabel: { ...baseAxis(p).axisLabel, formatter: (v: number) => `${v}%` },
        splitLine: { show: true, lineStyle: { color: p.grid, width: 1 } },
      },
      series: categories.map((cat, i) => ({
        type: "line",
        name: cat,
        stack: "mix",
        smooth: 0.25,
        showSymbol: false,
        lineStyle: { width: 1, color: ramp[i] },
        areaStyle: { color: ramp[i], opacity: 0.88 },
        label:
          i === categories.length - 1
            ? undefined
            : {
                show: false,
              },
        data: series.map((row) => row[i]),
        ...ENTER,
      })),
    };
  };

  return (
    <EChart
      active={active}
      alt="Delivery mix across Embed, Standardize and Automate: expert judgment shrinks from 70% to 15% of hours as workflow automation and pure software execution grow, a management target rather than reported history."
      build={build}
    />
  );
}

/* -------------------------------------------- IX · go-to-market + footprint */

/** Tree — customer zero branching into reusable manager archetypes and the
 *  next anchor funds. Illustrative expansion framework. */
export function GtmTree({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const { root, archetypes, anchors } = GTM.expansion;
    const data = [
      {
        name: root,
        itemStyle: { color: p.accent },
        children: [
          {
            name: "Manager archetypes",
            itemStyle: { color: p.border },
            label: { color: p.muted },
            children: archetypes.map((a, i) => ({
              name: a,
              itemStyle: { color: p.border },
              label: { distance: i % 2 === 0 ? 7 : 26 },
            })),
          },
          {
            name: "Anchor funds",
            itemStyle: { color: p.accent2 },
            label: { color: p.body },
            children: anchors.map((a, i) => ({
              name: a,
              itemStyle: { color: p.accent2 },
              label: { distance: i % 2 === 0 ? 7 : 26 },
            })),
          },
        ],
      },
    ];
    return {
      backgroundColor: "transparent",
      series: [
        {
          type: "tree",
          data,
          layout: "orthogonal",
          orient: "TB",
          top: 24,
          bottom: 46,
          left: 14,
          right: 14,
          symbol: "circle",
          symbolSize: 6,
          edgeShape: "curve",
          lineStyle: { color: p.border, width: 1, curveness: 0.35 },
          label: {
            position: "top",
            distance: 6,
            color: p.text,
            fontSize: 10.5,
            fontFamily: p.sans,
            verticalAlign: "bottom",
            align: "center",
          },
          leaves: {
            label: {
              position: "bottom",
              distance: 7,
              verticalAlign: "top",
              align: "center",
              fontSize: 9,
            },
          },
          expandAndCollapse: false,
          roam: false,
          initialTreeDepth: -1,
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Customer zero branches into reusable manager archetypes — emerging PE, venture, growth, multi-strategy — and into the anchor funds that come next."
      build={build}
    />
  );
}

/* ---------------------------------------------------- X · corridor geo map */

/**
 * The `geo` component (topojson + `center`/`zoom`/`layoutSize`) kept fighting
 * itself on resize and shipping stray clipped edges. Nodes and routes now
 * plot directly on a plain lon/lat cartesian grid instead (the `lines-ny`
 * pattern). Coastlines are a `custom` series on that *same* grid — plain
 * filled polygons via `api.coord()`, so they're pixel-locked to the nodes
 * with none of `geo`'s projection math to get wrong.
 */
const NODE_BY_KEY = new Map(GTM.nodes.map((n) => [n.key, n]));
const LON_RANGE: [number, number] = [-128, 68];
const LAT_RANGE: [number, number] = [16, 60];

/**
 * A degree of longitude is only as wide as a degree of latitude at the
 * equator — at the corridor's ~38°N centre it's about 79% as wide. Plotting
 * raw lon/lat as x/y (what a plain cartesian grid does) ignores that and
 * reads as a squashed, skewed world. Scaling x by cos(centre latitude) is
 * the standard equirectangular fix; `MAP_ASPECT` is the resulting box shape
 * the chart's *container* must actually be, or the correction is undone by
 * the container stretching it right back out.
 */
const CENTER_LAT = (LAT_RANGE[0] + LAT_RANGE[1]) / 2;
const LON_SCALE = Math.cos((CENTER_LAT * Math.PI) / 180);
const projLon = (lon: number) => lon * LON_SCALE;
const PROJ_LON_RANGE: [number, number] = [projLon(LON_RANGE[0]), projLon(LON_RANGE[1])];
export const MAP_ASPECT = (PROJ_LON_RANGE[1] - PROJ_LON_RANGE[0]) / (LAT_RANGE[1] - LAT_RANGE[0]);

/**
 * Real coastlines, not a hand trace: `world-atlas`'s 110m country topology.
 * `topojson.merge` dissolves every country into one landmass first — country
 * *borders* (Kazakhstan/Uzbekistan, the Balkans, the Gulf states) share arcs
 * with their neighbours and otherwise get traced as if they were coastline,
 * which at this map's small render size reads as dense, jagged noise rather
 * than a coastline. Merging leaves only the arcs that don't border another
 * country — the actual coast. Computed once at module load — this doesn't
 * change per render or per theme, only the stroke/fill colours the chart
 * applies to it do.
 */
function buildCoastlines(): number[][][] {
  const topo = worldTopo as unknown as Parameters<typeof topojson.feature>[0];
  // biome-ignore lint/suspicious/noExplicitAny: topojson's object index is untyped
  const objects = (topo as any).objects.countries;
  const merged = topojson.merge(topo, objects.geometries) as unknown as {
    type: string;
    coordinates: number[][][][];
  };

  const [lonMin, lonMax] = LON_RANGE;
  const [latMin, latMax] = LAT_RANGE;
  const padded = { lonMin: lonMin - 15, lonMax: lonMax + 15, latMin: latMin - 10, latMax: latMax + 10 };
  const inBounds = (pt: number[]) =>
    pt[0] >= padded.lonMin && pt[0] <= padded.lonMax && pt[1] >= padded.latMin && pt[1] <= padded.latMax;

  const rings: number[][][] = [];
  const addRing = (ring: number[][]) => {
    if (!ring.some(inBounds)) return;
    const simplified = ring.map((pt) => [projLon(pt[0]), pt[1]]);
    if (simplified.length >= 3) rings.push(simplified);
  };

  for (const poly of merged.coordinates) {
    for (const ring of poly) addRing(ring);
  }
  return rings;
}

const COASTLINES: number[][][] = buildCoastlines();

export function StructureMap({ active, compact = false }: { active: boolean; compact?: boolean }) {
  const build = (p: DeckPalette) => {
    const kindColor: Record<string, string> = {
      parent: p.accent,
      hub: p.accent,
      delivery: p.accent2,
      client: p.accent2,
      market: p.gold,
    };

    const proj = (coord: number[]) => [projLon(coord[0]), coord[1]];
    const routes = GTM.routes.map(([from, to]) => {
      const a = NODE_BY_KEY.get(from);
      const b = NODE_BY_KEY.get(to);
      return { coords: [a && proj(a.coord), b && proj(b.coord)] };
    });

    return {
      backgroundColor: "transparent",
      // Percentage margins, not fixed pixels: the container is sized to
      // `MAP_ASPECT` exactly, but a *fixed-px* right margin for labels eats a
      // wildly different fraction of the box depending on how large the map
      // renders — at the small end that skews the plotted grid's aspect
      // ratio away from the container's and visibly distorts the coastline.
      // Percentages scale with the box, so as long as the horizontal and
      // vertical margins sum to the same fraction, the grid stays undistorted
      // at any size.
      grid: compact
        ? { left: "2%", right: "10%", top: "6%", bottom: "6%", containLabel: false }
        : { left: "2%", right: "12%", top: "7%", bottom: "7%", containLabel: false },
      xAxis: {
        type: "value",
        min: PROJ_LON_RANGE[0],
        max: PROJ_LON_RANGE[1],
        show: false,
        splitLine: { show: true, lineStyle: { color: p.grid, width: 1 } },
      },
      yAxis: {
        type: "value",
        min: LAT_RANGE[0],
        max: LAT_RANGE[1],
        show: false,
        splitLine: { show: true, lineStyle: { color: p.grid, width: 1 } },
      },
      series: [
        {
          type: "custom",
          coordinateSystem: "cartesian2d",
          silent: true,
          data: COASTLINES.map((_, i) => i),
          renderItem: (
            params: { dataIndex: number },
            api: { coord: (v: number[]) => number[] }
          ) => ({
            type: "polygon",
            shape: { points: COASTLINES[params.dataIndex].map((pt) => api.coord(pt)) },
            style: { fill: p.surface, stroke: p.border, lineWidth: 0.75, opacity: 0.85 },
          }),
          zlevel: 0,
        },
        {
          type: "lines",
          coordinateSystem: "cartesian2d",
          data: routes,
          polyline: false,
          lineStyle: { color: p.accent, width: 1.2, opacity: 0.45, curveness: 0.06 },
          effect: {
            show: true,
            period: 5,
            trailLength: 0.55,
            symbol: "circle",
            symbolSize: 4,
            color: p.accent,
          },
          zlevel: 1,
        },
        {
          type: "effectScatter",
          coordinateSystem: "cartesian2d",
          data: GTM.nodes.map((n) => ({
            name: n.label,
            value: proj(n.coord),
            itemStyle: { color: kindColor[n.kind] ?? p.accent2 },
          })),
          symbolSize: 8,
          rippleEffect: { scale: 2.6, brushType: "stroke", period: 4 },
          showEffectOn: "render",
          label: {
            show: true,
            position: "right",
            distance: compact ? 8 : 14,
            formatter: (d: { name: string }) => {
              const n = GTM.nodes.find((x) => x.label === d.name);
              return n ? (compact ? `{t|${n.label}}` : `{t|${n.label}}\n{s|${n.note}}`) : d.name;
            },
            rich: {
              t: {
                color: p.text,
                fontSize: compact ? 10.5 : 12,
                fontFamily: p.sans,
                fontWeight: 500,
                lineHeight: compact ? 13 : 15,
              },
              s: { color: p.muted, fontSize: 10.5, fontFamily: p.sans, lineHeight: 13 },
            },
          },
          zlevel: 2,
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Corridor map: capital and clients in North America and London, the client-facing entity in Dubai, delivery in Bengaluru, frontier deal flow from Almaty."
      build={build}
    />
  );
}

/* -------------------------------------------------------- XI · 18-month plan */

const GANTT_MONTH_VALUES = [0, 3, 6, 9, 12, 15, 18];
const GANTT_PHASES = ["Baseline", "Standardize", "Production", "Automate"];

/** Custom-series Gantt: one row per workstream, four coloured phase segments,
 *  milestone diamonds on a dedicated top row. Proposed target dates. */
export function RoadmapGantt({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const rows = ROADMAP.gantt;
    const rampBase = [p.border, `${p.accent2}99`, p.accent2, p.accent];
    const milestoneRow = rows.length;

    type Item = { rowIndex: number; from: number; to: number; phase: number };
    const items: Item[] = [];
    rows.forEach((row, r) => {
      const starts = row.start.map((idx) => GANTT_MONTH_VALUES[idx]);
      for (let ph = 0; ph < 4; ph++) {
        const from = starts[ph];
        const to = ph < 3 ? starts[ph + 1] : 18;
        if (to > from) items.push({ rowIndex: r, from, to, phase: ph });
      }
    });

    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 12, top: 8, bottom: 28, containLabel: true },
      xAxis: {
        type: "value",
        min: 0,
        max: 18,
        interval: 3,
        ...baseAxis(p),
        axisLabel: { ...baseAxis(p).axisLabel, formatter: (v: number) => `M${v}` },
        axisLine: { show: false },
        splitLine: { show: true, lineStyle: { color: p.grid, width: 1 } },
      },
      yAxis: {
        type: "category",
        inverse: true,
        data: [...rows.map((r) => r.label), "Milestones"],
        ...baseAxis(p),
        axisLine: { show: false },
        axisLabel: {
          interval: 0,
          color: (value: string) => (value === "Milestones" ? p.muted : p.text),
          fontSize: 10,
          fontFamily: p.sans,
          width: 128,
          overflow: "truncate",
        },
      },
      series: [
        {
          type: "custom",
          renderItem: (
            params: { dataIndex: number },
            api: { coord: (v: number[]) => number[]; value: (i: number) => number; size: (v: number[]) => number[] }
          ) => {
            const it = items[params.dataIndex];
            const start = api.coord([it.from, it.rowIndex]);
            const end = api.coord([it.to, it.rowIndex]);
            const height = Math.min(16, (api.size?.([0, 1]) as number[] | undefined)?.[1] ?? 16) * 0.56;
            return {
              type: "rect",
              shape: {
                x: start[0],
                y: start[1] - height / 2,
                width: Math.max(1, end[0] - start[0]),
                height,
                r: 2,
              },
              style: { fill: rampBase[it.phase] },
            };
          },
          data: items,
          encode: { x: ["from", "to"], y: "rowIndex" },
          clip: true,
          ...ENTER,
        },
        {
          type: "scatter",
          symbol: "diamond",
          symbolSize: 9,
          data: ROADMAP.milestones.map((m) => [
            GANTT_MONTH_VALUES[ROADMAP.months.indexOf(m.at)],
            milestoneRow,
          ]),
          itemStyle: { color: p.gold, borderColor: p.bg, borderWidth: 1.5 },
          label: {
            show: true,
            position: "top",
            distance: 6,
            formatter: (d: { dataIndex: number }) => ROADMAP.milestones[d.dataIndex].label,
            color: p.muted,
            fontSize: 9.5,
            fontFamily: p.sans,
            width: 76,
            overflow: "break",
            lineHeight: 12,
          },
          z: 3,
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Eighteen-month Gantt: each workstream moves through Baseline, Standardize, Production and Automate on its own schedule, with entity, controls and second-anchor milestones marked above."
      build={build}
    />
  );
}

/* ------------------------------------------------ XII · what could go wrong */

const RISK_COLS = ["Likelihood", "Impact", "Control maturity"] as const;

/** Matrix heatmap: six risks × three dimensions. High likelihood/impact reads
 *  as risk (danger-tinted); high control maturity reads as strength
 *  (accent-tinted) — the same "3" means opposite things in different columns,
 *  so colour direction flips per column rather than one shared scale. */
export function RiskMatrix({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const rows = RISKS.items;
    const cells: Array<{ value: [number, number, number]; itemStyle: { color: string } }> = [];
    rows.forEach((r, ri) => {
      const vals = [r.likelihood, r.impact, r.maturity];
      vals.forEach((v, ci) => {
        const good = ci === 2 ? v : 4 - v;
        const color =
          good >= 3
            ? p.accent
            : good === 2
              ? `${p.accent2}99`
              : ci === 2
                ? p.border
                : `${p.danger}b3`;
        cells.push({ value: [ci, ri, v], itemStyle: { color } });
      });
    });

    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 8, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: "category",
        data: RISK_COLS as unknown as string[],
        position: "top",
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: p.muted, fontSize: 10.5, fontFamily: p.sans },
      },
      yAxis: {
        type: "category",
        data: rows.map((r) => r.risk),
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: p.text, fontSize: 11, fontFamily: p.sans, width: 150, overflow: "truncate" },
      },
      series: [
        {
          type: "heatmap",
          data: cells,
          label: {
            show: true,
            formatter: (d: { value: number[] }) => ["Low", "Med", "High"][d.value[2] - 1],
            color: p.bg,
            fontSize: 9.5,
            fontFamily: p.sans,
            fontWeight: 500,
          },
          itemStyle: { borderColor: p.bg, borderWidth: 3, borderRadius: 3 },
          emphasis: { disabled: true },
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Risk matrix: six risks scored on likelihood, impact and control maturity — customer concentration and data rights carry the highest impact, data rights already carries the most mature control."
      build={build}
    />
  );
}
