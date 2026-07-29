"use client";

/**
 * The deck's ECharts surface.
 *
 * ECharts renders to SVG here rather than canvas: crisp at any scale factor,
 * and it survives the print path that turns each slide into a PDF page. Only
 * the modules the deck actually draws with are registered, so the bundle
 * tree-shakes — and because nothing outside `src/decks/founding` imports this
 * file, the cost stays off `/`, which was deliberately stripped of ECharts for
 * page-speed reasons.
 *
 * A chart cannot read CSS custom properties from inside its own option object,
 * so the wrapper resolves the site's brand tokens off its own container and
 * hands the option builder a concrete palette. Charts therefore inherit the
 * design system automatically, with no per-slide colour wiring and no literal
 * hex anywhere in a chart module.
 */

import {
  BarChart,
  BoxplotChart,
  CustomChart,
  EffectScatterChart,
  HeatmapChart,
  LineChart,
  LinesChart,
} from "echarts/charts";
import {
  GeoComponent,
  GraphicComponent,
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  VisualMapComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import * as React from "react";

echarts.use([
  BarChart,
  LineChart,
  LinesChart,
  EffectScatterChart,
  HeatmapChart,
  BoxplotChart,
  CustomChart,
  GeoComponent,
  GraphicComponent,
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  VisualMapComponent,
  SVGRenderer,
]);

/** Re-exported so chart modules can register geo maps. */
export { echarts };

export type DeckPalette = {
  bg: string;
  panel: string;
  surface: string;
  text: string;
  body: string;
  muted: string;
  faint: string;
  accent: string;
  accent2: string;
  gold: string;
  danger: string;
  border: string;
  grid: string;
  sans: string;
  mono: string;
};

/* The site's variable names — the deck reads the same tokens the marketing
   pages do, so a brand change lands on both surfaces at once. */
const TOKENS: Array<[keyof DeckPalette, string]> = [
  ["bg", "--bg"],
  ["panel", "--panel"],
  ["surface", "--card"],
  ["text", "--heading"],
  ["body", "--tx-2"],
  ["muted", "--tx-3"],
  ["faint", "--tx-3"],
  ["accent", "--sky"],
  ["accent2", "--steel"],
  ["gold", "--gold"],
  ["danger", "--danger"],
  ["border", "--line-2"],
  ["grid", "--line"],
  ["sans", "--sans"],
  ["mono", "--sans"],
];

function readPalette(el: HTMLElement): DeckPalette {
  const cs = getComputedStyle(el);
  const out = {} as DeckPalette;
  for (const [key, token] of TOKENS) {
    out[key] = cs.getPropertyValue(token).trim();
  }
  return out;
}

export type EChartProps = {
  /** Builds the option from the resolved palette. Must be stable or memoised. */
  build: (p: DeckPalette) => Record<string, unknown>;
  /**
   * Play the chart's own entrance. The viewer flips this to `true` when the
   * slide becomes active, so a chart four slides away is not silently
   * animating to an audience that will never see it.
   */
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Text alternative — the finding, not "a chart". */
  alt: string;
};

export function EChart({ build, active = true, className, style, alt }: EChartProps) {
  const host = React.useRef<HTMLDivElement>(null);
  const chart = React.useRef<echarts.ECharts | null>(null);
  const played = React.useRef(false);

  React.useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // No fixed width/height here: every slide mounts at once (only
    // `visibility` toggles), and on the very first paint a chart on a slide
    // that isn't index 0 can read a 0×0 box before the grid layout settles.
    // A size locked in at init time then never recovers — ECharts only
    // re-measures on `resize()`, and if the box never *changes* size after
    // that (it was already at its final size, just measured too early) the
    // ResizeObserver below has nothing to fire on. Let ECharts auto-size
    // from the container on every read instead.
    const inst = echarts.init(el, undefined, { renderer: "svg" });
    chart.current = inst;
    inst.resize();
    inst.setOption(build(readPalette(el)), true);

    // The still frame is the deliverable: with reduced motion the chart is
    // painted settled and never animates at all.
    if (reduce) {
      played.current = true;
    }

    const ro = new ResizeObserver(() => inst.resize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      inst.dispose();
      chart.current = null;
    };
  }, [build]);

  // Entrance plays once, when the slide first becomes active. Scrolling back
  // to a slide shows a static chart, which is what a reader rereading a
  // section expects.
  React.useEffect(() => {
    if (!active || played.current) return;
    const inst = chart.current;
    const el = host.current;
    if (!inst || !el) return;
    played.current = true;
    // Becoming the active slide is also the most reliable moment to
    // re-measure: the browser has definitely laid the box out by now.
    inst.resize();
    inst.setOption(build(readPalette(el)), { replaceMerge: ["series"] });
  }, [active, build]);

  return (
    <div
      aria-label={alt}
      className={className}
      ref={host}
      role="img"
      style={{ width: "100%", height: "100%", ...style }}
    />
  );
}

/* ------------------------------------------------------------------ shared */

/**
 * The deck's one chart-entrance motion, expressed as ECharts animation config.
 * Bouncier than the reference system allows — a capped overshoot, on client
 * direction — but still: plays once, no loop, no idle.
 */
export const ENTER = {
  animation: true,
  animationDuration: 520,
  animationEasing: "cubicOut" as const,
  animationDelay: (i: number) => i * 45,
};

/** Horizontal gridlines only, behind the marks. Never vertical. */
export const gridLines = (p: DeckPalette) => ({
  show: true,
  lineStyle: { color: p.grid, width: 1 },
});

export const axisText = (p: DeckPalette) => ({
  color: p.muted,
  fontSize: 11,
  fontFamily: p.sans,
  fontWeight: 500,
});

/** Category/value axis base: no vertical grid, hairline baseline, quiet ticks. */
export const baseAxis = (p: DeckPalette) => ({
  axisLine: { lineStyle: { color: p.border } },
  axisTick: { show: false },
  axisLabel: axisText(p),
  splitLine: { show: false },
});
