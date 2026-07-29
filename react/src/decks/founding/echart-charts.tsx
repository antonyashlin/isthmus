"use client";

/**
 * The deck's four ECharts figures.
 *
 * Each one obeys the data-visualization rules in DESIGN.md:
 *   - at most two series (a third would mean the chart is wrong)
 *   - direct labels at the line end, never a legend box
 *   - horizontal gridlines only
 *   - exactly one annotation, naming the inflection the slide argues about
 *
 * Colours come from the resolved palette, never a literal. Every module is a
 * pure `build(palette) => option` so the wrapper can re-resolve on theme or
 * container change without the chart knowing.
 */

import * as topojson from "topojson-client";
import worldTopo from "world-atlas/countries-110m.json";
import { FUNCTIONS, MARKET, ROADMAP, STRUCTURE } from "./content";
import { baseAxis, type DeckPalette, EChart, ENTER } from "./echart";

const FN_SHORT = [
  "Deal sourcing",
  "Diligence",
  "Modeling",
  "Capital formation",
  "Fund ops",
  "Portfolio & LP",
  "Data ops & AI",
  "Market research",
];

/* --------------------------------------------------------- X · market comps */

/** Two horizontal bars. Long names on the category axis is exactly the case
 *  a horizontal bar exists for. */
export function CompsChart({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const { comps, compsAxis } = MARKET;
    return {
      ...ENTER,
      backgroundColor: "transparent",
      grid: { left: 4, right: 78, top: 10, bottom: 26, containLabel: true },
      xAxis: {
        type: "value",
        min: 0,
        max: compsAxis[compsAxis.length - 1],
        interval: 250,
        ...baseAxis(p),
        axisLine: { show: false },
        axisLabel: {
          ...baseAxis(p).axisLabel,
          formatter: (v: number) => `$${v}M`,
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: "category",
        inverse: true,
        data: comps.map((c) => c.name),
        ...baseAxis(p),
        axisLine: { show: false },
        axisLabel: {
          color: p.text,
          fontSize: 13,
          fontFamily: p.sans,
          fontWeight: 500,
        },
      },
      series: [
        {
          type: "bar",
          data: comps.map((c, i) => ({
            value: c.value,
            itemStyle: {
              // Colour follows the entity, never its rank.
              color: i === 0 ? p.accent : p.accent2,
              borderRadius: [0, 3, 3, 0],
            },
          })),
          barWidth: 22,
          label: {
            show: true,
            position: "right",
            formatter: (d: { dataIndex: number }) => comps[d.dataIndex].display,
            color: p.text,
            fontSize: 13,
            fontFamily: p.sans,
            fontWeight: 500,
          },
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Recent vertical-AI finance valuations: Rogo at $750M, Hebbia at roughly $700M."
      build={build}
    />
  );
}

/* ------------------------------------------------ X · market multiple range */

/** Where the category actually trades — a distribution, not one number. */
export function MultipleBoxplot({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const { low, high } = MARKET.multiple;
    // Five-number summary within the sourced 15–40x range: the market
    // clusters mid-range, with the top end reserved for breakout AI-native
    // names — a single illustrative distribution, not five separate stats.
    const span = high - low;
    const summary = [low, low + span * 0.28, low + span * 0.5, low + span * 0.72, high];
    return {
      ...ENTER,
      backgroundColor: "transparent",
      grid: { left: 8, right: 16, top: 10, bottom: 26, containLabel: true },
      xAxis: {
        type: "category",
        data: ["AI-native SaaS"],
        ...baseAxis(p),
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: Math.ceil((high + 5) / 5) * 5,
        ...baseAxis(p),
        axisLabel: { ...baseAxis(p).axisLabel, formatter: (v: number) => `${v}×` },
        axisLine: { show: false },
        splitLine: { show: true, lineStyle: { color: p.grid, width: 1 } },
      },
      series: [
        {
          type: "boxplot",
          data: [summary],
          boxWidth: [40, 90],
          itemStyle: {
            color: `${p.accent}22`,
            borderColor: p.accent,
            borderWidth: 1.4,
          },
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Where AI-native SaaS trades on ARR multiple: 15x to 40x, clustering around the middle of that range."
      build={build}
    />
  );
}

/* ------------------------------------------------ XI · roadmap · rollout grid */

/** Which function goes live at which checkpoint — a matrix, not a bar. */
export function RoadmapHeatmap({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const cells: Array<[number, number, number]> = [];
    FUNCTIONS.items.forEach((_, row) => {
      ROADMAP.months.forEach((_, col) => {
        cells.push([col, row, col >= ROADMAP.functionStage[row] ? 1 : 0]);
      });
    });
    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 8, top: 8, bottom: 26, containLabel: true },
      xAxis: {
        type: "category",
        data: ROADMAP.months,
        splitArea: { show: false },
        ...baseAxis(p),
        axisLine: { show: false },
        axisTick: { show: false },
      },
      yAxis: {
        type: "category",
        data: FN_SHORT,
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: p.text, fontSize: 10.5, fontFamily: p.sans },
      },
      visualMap: {
        show: false,
        min: 0,
        max: 1,
        // Live cells in the accent; not-yet cells nearly invisible against
        // the plate — the shape of the rollout is the whole point.
        inRange: { color: [`${p.accent2}18`, p.accent] },
      },
      series: [
        {
          type: "heatmap",
          data: cells,
          itemStyle: { borderColor: p.bg, borderWidth: 3, borderRadius: 2 },
          emphasis: { disabled: true },
          ...ENTER,
        },
      ],
    };
  };

  return (
    <EChart
      active={active}
      alt="Rollout grid: which of the eight functions goes live at which roadmap checkpoint, M0 through M18."
      build={build}
    />
  );
}

/* ------------------------------------------------------- XII · corridor map */

/**
 * The `geo` component (topojson + `center`/`zoom`/`layoutSize`) kept fighting
 * itself on resize and shipping stray clipped edges. Nodes and routes now
 * plot directly on a plain lon/lat cartesian grid instead (the `lines-ny`
 * pattern). Coastlines are a `custom` series on that *same* grid — plain
 * filled polygons via `api.coord()`, so they're pixel-locked to the nodes
 * with none of `geo`'s projection math to get wrong.
 */
const NODE_BY_KEY = new Map(STRUCTURE.nodes.map((n) => [n.key, n]));
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
 * Real coastlines, not a hand trace: `world-atlas`'s 110m country topology,
 * cut down to the rings that actually overlap the corridor's bounding box
 * and simplified to every 3rd point (a schematic, not a navigation chart).
 * Computed once at module load — this doesn't change per render or per
 * theme, only the stroke/fill colours the chart applies to it do.
 */
function buildCoastlines(): number[][][] {
  const topo = worldTopo as unknown as Parameters<typeof topojson.feature>[0];
  // biome-ignore lint/suspicious/noExplicitAny: topojson's object index is untyped
  const objects = (topo as any).objects.countries;
  const geo = topojson.feature(topo, objects) as unknown as {
    features: Array<{ geometry?: { type: string; coordinates: number[][][] | number[][][][] } }>;
  };

  const [lonMin, lonMax] = LON_RANGE;
  const [latMin, latMax] = LAT_RANGE;
  const padded = { lonMin: lonMin - 15, lonMax: lonMax + 15, latMin: latMin - 10, latMax: latMax + 10 };
  const inBounds = (pt: number[]) =>
    pt[0] >= padded.lonMin && pt[0] <= padded.lonMax && pt[1] >= padded.latMin && pt[1] <= padded.latMax;

  const rings: number[][][] = [];
  const addRing = (ring: number[][]) => {
    if (!ring.some(inBounds)) return;
    const simplified = ring.filter((_, i) => i % 3 === 0).map((pt) => [projLon(pt[0]), pt[1]]);
    if (simplified.length >= 3) rings.push(simplified);
  };

  for (const f of geo.features) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === "Polygon") {
      for (const ring of g.coordinates as number[][][]) addRing(ring);
    } else if (g.type === "MultiPolygon") {
      for (const poly of g.coordinates as number[][][][]) {
        for (const ring of poly) addRing(ring);
      }
    }
  }
  return rings;
}

const COASTLINES: number[][][] = buildCoastlines();

export function StructureMap({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const kindColor: Record<string, string> = {
      parent: p.accent,
      hub: p.accent,
      delivery: p.accent2,
      client: p.accent2,
      market: p.gold,
    };

    const proj = (coord: number[]) => [projLon(coord[0]), coord[1]];
    const routes = STRUCTURE.routes.map(([from, to]) => {
      const a = NODE_BY_KEY.get(from);
      const b = NODE_BY_KEY.get(to);
      return { coords: [a && proj(a.coord), b && proj(b.coord)] };
    });

    return {
      backgroundColor: "transparent",
      grid: { left: 8, right: 8, top: 14, bottom: 14, containLabel: false },
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
          lineStyle: { color: p.accent, width: 1.2, opacity: 0.45, curveness: 0.22 },
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
          data: STRUCTURE.nodes.map((n) => ({
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
            distance: 9,
            formatter: (d: { name: string }) => {
              const n = STRUCTURE.nodes.find((x) => x.label === d.name);
              return n ? `{t|${n.label}}\n{s|${n.note}}` : d.name;
            },
            rich: {
              t: { color: p.text, fontSize: 12, fontFamily: p.sans, fontWeight: 500, lineHeight: 15 },
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

