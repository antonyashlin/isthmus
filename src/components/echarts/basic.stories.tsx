"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EChart } from "./EChart";
import { Frame } from "./story-frame";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

const meta = {
  title: "ECharts/Basic",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type S = StoryObj;

export const Line: S = {
  render: () => (
    <Frame>
      <EChart
        height={360}
        option={{
          grid: { left: 44, right: 20, top: 28, bottom: 28 },
          tooltip: { trigger: "axis" },
          legend: { top: 0, right: 0 },
          xAxis: { type: "category", boundaryGap: false, data: months },
          yAxis: { type: "value" },
          series: [
            {
              name: "ARR ($k)",
              type: "line",
              smooth: true,
              data: [120, 145, 160, 155, 185, 210, 240, 275],
              areaStyle: { opacity: 0.14 },
              lineStyle: { width: 2.5 },
            },
            {
              name: "Pipeline ($k)",
              type: "line",
              smooth: true,
              data: [80, 95, 110, 130, 150, 165, 190, 205],
            },
          ],
        }}
      />
    </Frame>
  ),
};

export const Area: S = {
  render: () => (
    <Frame>
      <EChart
        height={360}
        option={{
          grid: { left: 44, right: 20, top: 28, bottom: 28 },
          tooltip: { trigger: "axis" },
          legend: { top: 0, right: 0 },
          xAxis: { type: "category", boundaryGap: false, data: months },
          yAxis: { type: "value" },
          series: ["Enterprise", "Mid-market", "SMB"].map((name, i) => ({
            name,
            type: "line",
            stack: "tot",
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 0 },
            areaStyle: { opacity: 0.4 },
            data: months.map((_, m) => [40, 30, 20][i] + m * [11, 6, 3][i]),
          })),
        }}
      />
    </Frame>
  ),
};

export const Bar: S = {
  render: () => (
    <Frame>
      <EChart
        height={360}
        option={{
          grid: { left: 44, right: 20, top: 28, bottom: 28 },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          legend: { top: 0, right: 0 },
          xAxis: { type: "category", data: months },
          yAxis: { type: "value" },
          series: [
            {
              name: "New",
              type: "bar",
              data: [24, 28, 26, 32, 38, 40, 44, 50],
              barMaxWidth: 22,
              itemStyle: { borderRadius: [3, 3, 0, 0] },
            },
            {
              name: "Expansion",
              type: "bar",
              data: [10, 12, 14, 13, 18, 20, 22, 26],
              barMaxWidth: 22,
              itemStyle: { borderRadius: [3, 3, 0, 0] },
            },
          ],
        }}
      />
    </Frame>
  ),
};

export const StackedBar: S = {
  render: () => (
    <Frame>
      <EChart
        height={360}
        option={{
          grid: { left: 44, right: 20, top: 28, bottom: 28 },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          legend: { top: 0, right: 0 },
          xAxis: { type: "category", data: months },
          yAxis: { type: "value" },
          series: ["Enterprise", "Mid-market", "SMB"].map((name, i) => ({
            name,
            type: "bar",
            stack: "t",
            barMaxWidth: 26,
            data: months.map((_, m) => [40, 26, 16][i] + m * [3, 2, 1][i]),
          })),
        }}
      />
    </Frame>
  ),
};

export const HorizontalBar: S = {
  render: () => (
    <Frame>
      <EChart
        height={360}
        option={{
          grid: { left: 92, right: 24, top: 16, bottom: 24 },
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          xAxis: { type: "value" },
          yAxis: {
            type: "category",
            data: ["Referral", "Outbound", "Content", "Events", "Paid", "Partner"],
          },
          series: [
            {
              type: "bar",
              data: [38, 52, 61, 29, 44, 33],
              barMaxWidth: 16,
              itemStyle: { borderRadius: [0, 3, 3, 0] },
            },
          ],
        }}
      />
    </Frame>
  ),
};

export const Scatter: S = {
  render: () => (
    <Frame>
      <EChart
        height={360}
        option={{
          grid: { left: 44, right: 20, top: 24, bottom: 40 },
          tooltip: { trigger: "item" },
          xAxis: { type: "value", name: "MOIC", nameLocation: "middle", nameGap: 26 },
          yAxis: { type: "value", name: "IRR %", nameLocation: "middle", nameGap: 34 },
          series: [
            {
              type: "scatter",
              symbolSize: 12,
              data: [
                [1.2, 8], [2.1, 19], [3.4, 31], [1.8, 14], [2.7, 24],
                [4.1, 38], [1.1, 5], [3.0, 28], [2.4, 21], [5.2, 44],
              ],
            },
          ],
        }}
      />
    </Frame>
  ),
};

export const Bubble: S = {
  render: () => (
    <Frame>
      <EChart
        height={360}
        option={{
          grid: { left: 44, right: 20, top: 24, bottom: 40 },
          tooltip: { trigger: "item" },
          xAxis: { type: "value", name: "Growth %", nameLocation: "middle", nameGap: 26 },
          yAxis: { type: "value", name: "Margin %", nameLocation: "middle", nameGap: 34 },
          series: [
            {
              type: "scatter",
              data: [
                [30, 20, 60], [55, 35, 120], [80, 15, 200],
                [45, 50, 90], [70, 28, 150], [95, 40, 260],
              ],
              symbolSize: (d: number[]) => Math.sqrt(d[2]) * 2.4,
            },
          ],
        }}
      />
    </Frame>
  ),
};
