"use client";

/**
 * Isthmus theme for Apache ECharts.
 *
 * ECharts draws to <canvas> with hard-coded colours, so — unlike the Bklit
 * charts, which read CSS vars directly — we resolve the deck's `--isth-*` /
 * `--chart-*` tokens to concrete rgb strings at runtime and hand ECharts a
 * theme object. Resolution goes through a hidden probe element so token chains
 * (`--chart-1: var(--isth-accent)`) collapse to a real colour. Falls back to
 * the measured deck hexes when there is no DOM (SSR / docs pre-mount).
 */

export interface IsthmusTokens {
  series: string[]; // categorical, --chart-1..5
  scale: string[]; // sequential ramp, --chart-scale-01..05 (maps / heatmaps)
  accent: string;
  gold: string;
  danger: string;
  text: string; // primary text
  body: string; // axis / body text
  muted: string; // captions
  grid: string; // gridlines
  border: string;
  bg: string;
  panel: string; // tooltips / raised
  surface: string;
  font: string;
}

// Measured from the master deck — used as SSR / pre-mount fallback.
const FALLBACK: IsthmusTokens = {
  series: ["#88c1ed", "#4f83b0", "#d9a441", "#9fadbb", "#c96f6f"],
  scale: ["#0e2233", "#1b3d57", "#356d97", "#5a9bc9", "#88c1ed"],
  accent: "#88c1ed",
  gold: "#d9a441",
  danger: "#c96f6f",
  text: "#f2f6fa",
  body: "#9fadbb",
  muted: "#6a798a",
  grid: "rgba(79,131,176,0.12)",
  border: "rgba(79,131,176,0.4)",
  bg: "#06121d",
  panel: "#0b1926",
  surface: "#0e1e2d",
  font: '"Helvetica Neue", Helvetica, Arial, "Segoe UI", system-ui, sans-serif',
};

// color-mix() resolves via getComputedStyle to CSS Color 4 `color(srgb r g b / a)`
// form, which ECharts' colour parser rejects. Normalise everything to rgb()/rgba().
function toRgb(c: string): string {
  const m = c.match(
    /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)/,
  );
  if (!m) return c; // already rgb()/rgba()/#hex
  const r = Math.round(+m[1] * 255);
  const g = Math.round(+m[2] * 255);
  const b = Math.round(+m[3] * 255);
  return m[4] !== undefined
    ? `rgba(${r}, ${g}, ${b}, ${+m[4]})`
    : `rgb(${r}, ${g}, ${b})`;
}

function resolve(expr: string): string {
  const el = document.createElement("span");
  el.style.color = expr;
  el.style.display = "none";
  document.body.appendChild(el);
  const c = getComputedStyle(el).color;
  el.remove();
  return toRgb(c || expr);
}

/** Resolve the live Isthmus tokens from the document, or fall back off-DOM. */
export function resolveIsthmusTokens(): IsthmusTokens {
  if (typeof document === "undefined") return FALLBACK;
  try {
    const cs = getComputedStyle(document.documentElement);
    const font = cs.getPropertyValue("--font-sans").trim() || FALLBACK.font;
    return {
      series: [1, 2, 3, 4, 5].map((i) => resolve(`var(--chart-${i})`)),
      scale: [1, 2, 3, 4, 5].map((i) => resolve(`var(--chart-scale-0${i})`)),
      accent: resolve("var(--isth-accent)"),
      gold: resolve("var(--isth-gold)"),
      danger: resolve("var(--isth-danger)"),
      text: resolve("var(--isth-text)"),
      body: resolve("var(--isth-body)"),
      muted: resolve("var(--isth-muted)"),
      grid: resolve("var(--isth-grid-line)"),
      border: resolve("var(--isth-border)"),
      bg: resolve("var(--isth-bg)"),
      panel: resolve("var(--isth-panel)"),
      surface: resolve("var(--isth-surface)"),
      font,
    };
  } catch {
    return FALLBACK;
  }
}

/** Build an ECharts theme object from resolved tokens. */
export function isthmusEChartsTheme(t: IsthmusTokens): Record<string, unknown> {
  const axisCommon = {
    axisLine: { show: true, lineStyle: { color: t.border } },
    axisTick: { show: false, lineStyle: { color: t.border } },
    axisLabel: { color: t.muted },
    splitLine: { show: false, lineStyle: { color: t.grid } },
    splitArea: { show: false, areaStyle: { color: [t.grid] } },
  };
  const valueAxis = {
    ...axisCommon,
    axisLine: { show: false, lineStyle: { color: t.border } },
    splitLine: { show: true, lineStyle: { color: t.grid } },
  };
  return {
    color: t.series,
    backgroundColor: "transparent",
    textStyle: { fontFamily: t.font, color: t.body },
    title: {
      textStyle: { color: t.text, fontWeight: 500 },
      subtextStyle: { color: t.muted },
    },
    line: { lineStyle: { width: 2.5 }, symbolSize: 7, symbol: "circle", smooth: false },
    categoryAxis: axisCommon,
    valueAxis,
    logAxis: valueAxis,
    timeAxis: { ...axisCommon, splitLine: { show: false, lineStyle: { color: t.grid } } },
    legend: { textStyle: { color: t.body }, inactiveColor: t.muted },
    tooltip: {
      backgroundColor: t.panel,
      borderColor: t.border,
      borderWidth: 1,
      textStyle: { color: t.text },
      axisPointer: {
        lineStyle: { color: t.border },
        crossStyle: { color: t.border },
        label: { backgroundColor: t.surface, color: t.text },
      },
    },
    visualMap: {
      textStyle: { color: t.muted },
      inRange: { color: t.scale },
    },
    dataZoom: {
      borderColor: t.border,
      textStyle: { color: t.muted },
      handleStyle: { color: t.accent, borderColor: t.accent },
      fillerColor: "rgba(136,193,237,0.12)",
      dataBackground: { lineStyle: { color: t.border }, areaStyle: { color: t.grid } },
    },
    timeline: {
      lineStyle: { color: t.border },
      label: { color: t.muted },
      itemStyle: { color: t.accent },
      controlStyle: { color: t.body, borderColor: t.body },
    },
    geo: {
      itemStyle: { areaColor: t.panel, borderColor: t.border },
      emphasis: { itemStyle: { areaColor: t.surface } },
      label: { color: t.body },
    },
  };
}
