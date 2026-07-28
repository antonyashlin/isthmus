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
import { BACKDROP, CORRIDOR, ECONOMICS, MARKET } from "./content";
import { baseAxis, type DeckPalette, EChart, echarts, ENTER } from "./echart";

/* ------------------------------------------------- IV · backdrop divergence */

/**
 * Two indexed series diverging. The whole argument is the widening gap, so the
 * annotation sits on the year it stops being recoverable by hiring.
 */
export function BackdropChart({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const { years, series, annotation, axisNote } = BACKDROP;
    const annIndex = years.indexOf(annotation.at);

    return {
      ...ENTER,
      backgroundColor: "transparent",
      grid: { left: 8, right: 168, top: 28, bottom: 34, containLabel: true },
      xAxis: {
        type: "category",
        data: years,
        boundaryGap: false,
        ...baseAxis(p),
      },
      yAxis: {
        type: "value",
        min: 80,
        max: 300,
        name: axisNote,
        nameTextStyle: { color: p.faint, fontSize: 11, fontFamily: p.sans, align: "left" },
        nameGap: 14,
        ...baseAxis(p),
        axisLine: { show: false },
        splitLine: { show: true, lineStyle: { color: p.grid, width: 1 } },
      },
      series: [
        {
          name: series.aum.label,
          type: "line",
          data: series.aum.values,
          smooth: 0.28,
          symbol: "circle",
          symbolSize: 8,
          showSymbol: false,
          lineStyle: { width: 2.5, color: p.accent },
          itemStyle: { color: p.accent },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${p.accent}2e` },
              { offset: 1, color: `${p.accent}00` },
            ]),
          },
          // Direct label at the series end — this is why there is no legend.
          endLabel: {
            show: true,
            formatter: series.aum.label,
            color: p.text,
            fontSize: 12,
            fontFamily: p.sans,
            fontWeight: 500,
            distance: 10,
          },
          markPoint: {
            symbol: "circle",
            symbolSize: 9,
            data: [{ coord: [annIndex, series.aum.values[annIndex]] }],
            itemStyle: { color: p.accent, borderColor: p.bg, borderWidth: 2 },
            label: { show: false },
          },
          ...ENTER,
        },
        {
          name: series.ops.label,
          type: "line",
          data: series.ops.values,
          smooth: 0.28,
          showSymbol: false,
          lineStyle: { width: 2, color: p.accent2, type: "dashed" },
          itemStyle: { color: p.accent2 },
          endLabel: {
            show: true,
            formatter: series.ops.label,
            color: p.body,
            fontSize: 12,
            fontFamily: p.sans,
            distance: 10,
          },
          ...ENTER,
          animationDelay: () => 180,
        },
      ],
      graphic: annotationBlock(p, annotation.label, 0.42, 0.2),
    };
  };

  return (
    <EChart
      active={active}
      alt={`${BACKDROP.title} ${BACKDROP.titleAccent} Private-markets AUM compounds while back-office capacity per fund stays close to flat.`}
      build={build}
    />
  );
}

/* ------------------------------------------------------ IX · economics curve */

/**
 * Gross margin rising as workflows automate, with the two multiple regimes
 * drawn as bands behind it. The crossing is the finding.
 */
export function EconomicsChart({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    const { quarters, series, annotation, bands } = ECONOMICS;
    const annIndex = quarters.indexOf(annotation.at);

    return {
      ...ENTER,
      backgroundColor: "transparent",
      grid: { left: 8, right: 150, top: 30, bottom: 34, containLabel: true },
      xAxis: { type: "category", data: quarters, boundaryGap: false, ...baseAxis(p) },
      yAxis: [
        {
          type: "value",
          min: 0,
          max: 80,
          axisLabel: { ...baseAxis(p).axisLabel, formatter: "{value}%" },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: true, lineStyle: { color: p.grid, width: 1 } },
        },
        {
          type: "value",
          min: 0,
          max: 24,
          ...baseAxis(p),
          axisLine: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: series.margin.label,
          type: "line",
          data: series.margin.values,
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2.5, color: p.accent },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${p.accent}33` },
              { offset: 1, color: `${p.accent}00` },
            ]),
          },
          endLabel: {
            show: true,
            formatter: series.margin.label,
            color: p.text,
            fontSize: 12,
            fontFamily: p.sans,
            fontWeight: 500,
            distance: 10,
          },
          markArea: {
            silent: true,
            itemStyle: { color: `${p.accent2}12` },
            label: {
              show: true,
              position: "insideTop",
              color: p.faint,
              fontSize: 10,
              fontFamily: p.sans,
            },
            data: bands.map((b) => [
              { xAxis: quarters[b.from], name: b.label },
              { xAxis: quarters[b.to] },
            ]),
          },
          markPoint: {
            symbol: "circle",
            symbolSize: 9,
            data: [{ coord: [annIndex, series.margin.values[annIndex]] }],
            itemStyle: { color: p.accent, borderColor: p.bg, borderWidth: 2 },
            label: { show: false },
          },
          ...ENTER,
        },
        {
          name: series.automated.label,
          type: "line",
          yAxisIndex: 1,
          data: series.automated.values,
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { width: 2, color: p.accent2, type: "dashed" },
          endLabel: {
            show: true,
            formatter: series.automated.label,
            color: p.body,
            fontSize: 12,
            fontFamily: p.sans,
            distance: 10,
          },
          ...ENTER,
          animationDelay: () => 180,
        },
      ],
      graphic: annotationBlock(p, annotation.label, 0.5, 0.16),
    };
  };

  return (
    <EChart
      active={active}
      alt={`${ECONOMICS.title} ${ECONOMICS.titleAccent} Gross margin rises from the services range into the software range as workflows automate.`}
      build={build}
    />
  );
}

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

/* ------------------------------------------------------- XII · corridor map */

const WORLD = "fdeck-world";
let worldRegistered = false;

/** Latitude band the corridor actually occupies. */
const LAT_MIN = -40;
const LAT_MAX = 75;

function registerWorld() {
  if (worldRegistered) return;
  // world-atlas ships TopoJSON; ECharts wants GeoJSON.
  const topo = worldTopo as unknown as Parameters<typeof topojson.feature>[0];
  const geo = topojson.feature(
    topo,
    // biome-ignore lint/suspicious/noExplicitAny: topojson's object index is untyped
    (topo as any).objects.countries
  ) as unknown as {
    type: string;
    features: Array<{ properties?: { name?: string }; geometry?: unknown }>;
  };

  // Antarctica and the high Arctic sit outside the corridor entirely, and when
  // the geo box clips them their polygons close along the frame as stray
  // full-width rules. Dropping them is cheaper and cleaner than clipping.
  const features = geo.features.filter((f) => {
    const name = f.properties?.name;
    if (name === "Antarctica") return false;
    const lats: number[] = [];
    JSON.stringify(f.geometry, (_k, v) => {
      if (
        Array.isArray(v) &&
        v.length === 2 &&
        typeof v[0] === "number" &&
        typeof v[1] === "number"
      ) {
        lats.push(v[1]);
      }
      return v;
    });
    if (lats.length === 0) return true;
    // keep anything that overlaps the band at all
    return Math.max(...lats) > LAT_MIN && Math.min(...lats) < LAT_MAX;
  });

  echarts.registerMap(WORLD, { ...geo, features } as never);
  worldRegistered = true;
}

const NODE_BY_KEY = new Map(CORRIDOR.nodes.map((n) => [n.key, n]));

export function CorridorMap({ active }: { active: boolean }) {
  const build = (p: DeckPalette) => {
    registerWorld();

    const kindColor: Record<string, string> = {
      parent: p.accent,
      hub: p.accent,
      delivery: p.accent2,
      client: p.accent2,
      market: p.gold,
    };

    const routes = CORRIDOR.routes.map(([from, to]) => {
      const a = NODE_BY_KEY.get(from);
      const b = NODE_BY_KEY.get(to);
      return { coords: [a?.coord, b?.coord] };
    });

    return {
      backgroundColor: "transparent",
      geo: {
        map: WORLD,
        roam: false,
        // `boundingCoords` clips rather than crops: every polygon crossing the
        // box closes along it, which drew stray full-width rules across the
        // top and bottom of the frame. Centre-and-zoom crops instead, so the
        // corridor fills the frame with no cut edges.
        center: [-24, 34],
        zoom: 2.05,
        layoutCenter: ["50%", "52%"],
        layoutSize: "118%",
        itemStyle: {
          areaColor: p.surface,
          borderColor: p.border,
          // Faint: the crop cuts the top off Canada and Russia, and a heavier
          // stroke makes those cut edges read as stray rules rather than
          // coastline. The container's mask fades them out entirely.
          borderWidth: 0.5,
          opacity: 0.75,
        },
        emphasis: { disabled: true },
        silent: true,
      },
      series: [
        {
          type: "lines",
          coordinateSystem: "geo",
          data: routes,
          polyline: false,
          lineStyle: {
            color: p.accent,
            width: 1.2,
            opacity: 0.45,
            curveness: 0.22,
          },
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
          coordinateSystem: "geo",
          data: CORRIDOR.nodes.map((n) => ({
            name: n.label,
            value: [...n.coord, 1],
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
              const n = CORRIDOR.nodes.find((x) => x.label === d.name);
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
      alt="Corridor map: capital and clients in North America and London, the client-facing entity in Abu Dhabi, delivery in Bengaluru, frontier deal flow from Almaty."
      build={build}
    />
  );
}

/* ------------------------------------------------------------------ shared */

/**
 * The single annotation every chart is allowed. A dot is drawn by the series'
 * own markPoint; this is the leader and the ink label beside it.
 * `x`/`y` are fractions of the chart box.
 */
function annotationBlock(p: DeckPalette, text: string, x: number, y: number) {
  return [
    {
      type: "text",
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      style: {
        text,
        fill: p.text,
        fontSize: 12,
        fontFamily: p.sans,
        fontWeight: 500,
        width: 210,
        overflow: "break",
        lineHeight: 16,
      },
      silent: true,
    },
  ];
}
