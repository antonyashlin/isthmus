"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EChart, useIsthmusTokens } from "./EChart";
import { Frame } from "./story-frame";

const meta = {
  title: "ECharts/Statistical",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type S = StoryObj;

function CandlestickDemo() {
  const t = useIsthmusTokens();
  const days = Array.from({ length: 20 }, (_, i) => `D${i + 1}`);
  // [open, close, low, high]
  const data = [
    [20, 24, 19, 25], [24, 22, 21, 26], [22, 27, 21, 28], [27, 25, 24, 29],
    [25, 30, 24, 31], [30, 28, 27, 32], [28, 33, 27, 34], [33, 31, 30, 35],
    [31, 29, 28, 33], [29, 34, 28, 36], [34, 37, 33, 39], [37, 35, 34, 40],
    [35, 40, 34, 42], [40, 38, 37, 43], [38, 36, 35, 41], [36, 41, 35, 43],
    [41, 44, 40, 46], [44, 42, 41, 47], [42, 47, 41, 49], [47, 50, 46, 52],
  ];
  return (
    <Frame>
      <EChart
        height={380}
        option={{
          grid: { left: 40, right: 16, top: 20, bottom: 28 },
          tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
          xAxis: { type: "category", data: days },
          yAxis: { type: "value", scale: true },
          series: [
            {
              type: "candlestick",
              data,
              itemStyle: {
                color: t.accent,
                color0: t.danger,
                borderColor: t.accent,
                borderColor0: t.danger,
              },
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Candlestick: S = { render: () => <CandlestickDemo /> };

export const Boxplot: S = {
  render: () => (
    <Frame>
      <EChart
        height={380}
        option={{
          grid: { left: 44, right: 16, top: 20, bottom: 28 },
          tooltip: { trigger: "item" },
          xAxis: { type: "category", data: ["Seed", "Series A", "Series B", "Series C", "Growth"] },
          yAxis: { type: "value", name: "MOIC", scale: true },
          // [min, Q1, median, Q3, max]
          series: [
            {
              type: "boxplot",
              data: [
                [0.2, 0.9, 1.6, 2.8, 6.0],
                [0.5, 1.2, 2.1, 3.4, 8.0],
                [0.8, 1.4, 2.4, 3.6, 7.0],
                [1.0, 1.6, 2.2, 3.0, 5.0],
                [1.1, 1.5, 1.9, 2.4, 3.6],
              ],
            },
          ],
        }}
      />
    </Frame>
  ),
};

function HeatmapDemo() {
  const t = useIsthmusTokens();
  const cohorts = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const cols = ["M0", "M1", "M2", "M3", "M4", "M5"];
  const data: [number, number, number][] = [];
  for (let y = 0; y < cohorts.length; y++)
    for (let x = 0; x < cols.length; x++)
      data.push([x, y, Math.round(100 * Math.exp(-x * 0.35) * (1 - y * 0.03))]);
  return (
    <Frame>
      <EChart
        height={400}
        option={{
          grid: { left: 44, right: 16, top: 12, bottom: 64 },
          tooltip: { position: "top" },
          xAxis: { type: "category", data: cols, splitArea: { show: true } },
          yAxis: { type: "category", data: cohorts, splitArea: { show: true } },
          visualMap: {
            min: 0, max: 100, calculable: true, orient: "horizontal",
            left: "center", bottom: 8, inRange: { color: t.scale },
          },
          series: [
            {
              name: "Retention %",
              type: "heatmap",
              data,
              label: { show: true, color: t.text, fontSize: 10 },
              itemStyle: { borderColor: t.bg, borderWidth: 2 },
            },
          ],
        }}
      />
    </Frame>
  );
}
export const CohortHeatmap: S = { render: () => <HeatmapDemo /> };

function WaterfallDemo() {
  const t = useIsthmusTokens();
  const cats = ["Start", "New", "Expansion", "Churn", "Contraction", "End"];
  const base = [0, 120, 160, 167, 157, 0];
  const val = [120, 40, 25, 18, 10, 157];
  const total = t.series[1];
  const colors = [total, t.accent, t.accent, t.danger, t.danger, total];
  return (
    <Frame>
      <EChart
        height={380}
        option={{
          grid: { left: 44, right: 16, top: 20, bottom: 28 },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            formatter: (p: Array<{ seriesName: string; axisValue: string; data: number }>) => {
              const d = p.find((x) => x.seriesName === "Δ");
              return d ? `${d.axisValue}: ${d.data}` : "";
            },
          },
          xAxis: { type: "category", data: cats },
          yAxis: { type: "value", name: "ARR ($k)" },
          series: [
            {
              name: "base",
              type: "bar",
              stack: "w",
              itemStyle: { color: "transparent" },
              emphasis: { itemStyle: { color: "transparent" } },
              data: base,
              silent: true,
              tooltip: { show: false },
            },
            {
              name: "Δ",
              type: "bar",
              stack: "w",
              barMaxWidth: 34,
              data: val.map((v, i) => ({ value: v, itemStyle: { color: colors[i], borderRadius: 2 } })),
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Waterfall: S = { render: () => <WaterfallDemo /> };
