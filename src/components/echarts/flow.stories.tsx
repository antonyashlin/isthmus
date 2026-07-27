"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EChart, useIsthmusTokens } from "./EChart";
import { Frame } from "./story-frame";

const meta = {
  title: "ECharts/Flow",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type S = StoryObj;

function SankeyDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={420}
        option={{
          tooltip: { trigger: "item", triggerOn: "mousemove" },
          series: [
            {
              type: "sankey",
              nodeAlign: "justify",
              emphasis: { focus: "adjacency" },
              label: { color: t.text },
              lineStyle: { color: "gradient", opacity: 0.35, curveness: 0.5 },
              itemStyle: { borderColor: t.bg },
              data: [
                { name: "LPs" }, { name: "Fund" }, { name: "Enterprise" },
                { name: "Fintech" }, { name: "Infra" }, { name: "Exits" }, { name: "Returns" },
              ],
              links: [
                { source: "LPs", target: "Fund", value: 100 },
                { source: "Fund", target: "Enterprise", value: 45 },
                { source: "Fund", target: "Fintech", value: 30 },
                { source: "Fund", target: "Infra", value: 25 },
                { source: "Enterprise", target: "Exits", value: 40 },
                { source: "Fintech", target: "Exits", value: 20 },
                { source: "Infra", target: "Exits", value: 15 },
                { source: "Exits", target: "Returns", value: 75 },
              ],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Sankey: S = { render: () => <SankeyDemo /> };

function GraphDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={440}
        option={{
          tooltip: {},
          legend: { bottom: 0, textStyle: { color: t.body } },
          series: [
            {
              type: "graph",
              layout: "force",
              roam: true,
              draggable: true,
              categories: [{ name: "Isthmus" }, { name: "Co-investors" }, { name: "Companies" }],
              force: { repulsion: 160, edgeLength: 90, gravity: 0.1 },
              label: { show: true, color: t.body, position: "right", fontSize: 10 },
              lineStyle: { color: t.border, opacity: 0.6, curveness: 0.1 },
              emphasis: { focus: "adjacency", lineStyle: { width: 3 } },
              data: [
                { id: "us", name: "Isthmus", symbolSize: 44, category: 0 },
                { id: "pa", name: "Peer A", symbolSize: 26, category: 1 },
                { id: "pb", name: "Peer B", symbolSize: 26, category: 1 },
                { id: "pc", name: "Peer C", symbolSize: 22, category: 1 },
                { id: "c1", name: "Co 1", symbolSize: 16, category: 2 },
                { id: "c2", name: "Co 2", symbolSize: 16, category: 2 },
                { id: "c3", name: "Co 3", symbolSize: 16, category: 2 },
                { id: "c4", name: "Co 4", symbolSize: 16, category: 2 },
              ],
              links: [
                { source: "us", target: "c1" }, { source: "us", target: "c2" }, { source: "us", target: "c3" },
                { source: "pa", target: "c1" }, { source: "pa", target: "c4" },
                { source: "pb", target: "c2" }, { source: "pb", target: "c3" },
                { source: "pc", target: "c3" }, { source: "pc", target: "c4" },
              ],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Graph: S = { render: () => <GraphDemo /> };

function ThemeRiverDemo() {
  const t = useIsthmusTokens();
  const names = ["Enterprise", "Fintech", "Infra"];
  const years = ["2021", "2022", "2023", "2024", "2025", "2026"];
  const data: [string, number, string][] = [];
  years.forEach((y, yi) =>
    names.forEach((n, ni) => data.push([`${y}-01-01`, [30, 18, 12][ni] + yi * [8, 6, 5][ni], n])),
  );
  return (
    <Frame>
      <EChart
        height={420}
        option={{
          tooltip: { trigger: "axis", axisPointer: { type: "line" } },
          legend: { top: 0, textStyle: { color: t.body } },
          singleAxis: {
            type: "time",
            top: 40,
            bottom: 40,
            axisLabel: { color: t.muted },
            axisLine: { lineStyle: { color: t.border } },
          },
          series: [
            {
              type: "themeRiver",
              emphasis: { focus: "self" },
              label: { color: t.body },
              itemStyle: { borderColor: t.bg, borderWidth: 1 },
              data,
            },
          ],
        }}
      />
    </Frame>
  );
}
export const ThemeRiver: S = { render: () => <ThemeRiverDemo /> };

function ParallelDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={420}
        option={{
          parallelAxis: [
            { dim: 0, name: "Growth %" },
            { dim: 1, name: "Margin %" },
            { dim: 2, name: "NRR %" },
            { dim: 3, name: "Burn mult" },
            { dim: 4, name: "MOIC" },
          ],
          parallel: {
            left: 60, right: 40, top: 40, bottom: 24,
            parallelAxisDefault: {
              nameTextStyle: { color: t.body },
              axisLine: { lineStyle: { color: t.border } },
              axisLabel: { color: t.muted },
              splitLine: { show: false },
            },
          },
          series: [
            {
              type: "parallel",
              lineStyle: { width: 2, opacity: 0.7 },
              data: [
                [80, 20, 120, 1.8, 3.2],
                [55, 35, 110, 1.2, 2.4],
                [95, 15, 140, 2.4, 4.1],
                [45, 50, 105, 0.9, 1.9],
                [70, 28, 125, 1.5, 2.9],
              ],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Parallel: S = { render: () => <ParallelDemo /> };
