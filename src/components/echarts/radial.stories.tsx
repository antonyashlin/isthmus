"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EChart, useIsthmusTokens } from "./EChart";
import { Frame } from "./story-frame";

const meta = {
  title: "ECharts/Radial",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type S = StoryObj;

function RadarDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={420}
        option={{
          tooltip: {},
          legend: { bottom: 0, textStyle: { color: t.body } },
          radar: {
            indicator: [
              { name: "Speed", max: 100 },
              { name: "Reliability", max: 100 },
              { name: "Comfort", max: 100 },
              { name: "Safety", max: 100 },
              { name: "Efficiency", max: 100 },
            ],
            axisName: { color: t.muted },
            axisLine: { lineStyle: { color: t.grid } },
            splitLine: { lineStyle: { color: t.grid } },
            splitArea: { show: false },
          },
          series: [
            {
              type: "radar",
              areaStyle: { opacity: 0.15 },
              data: [
                { value: [80, 70, 60, 90, 75], name: "Model A" },
                { value: [55, 88, 78, 65, 82], name: "Model B" },
              ],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Radar: S = { render: () => <RadarDemo /> };

function GaugeDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={400}
        option={{
          series: [
            {
              type: "gauge",
              startAngle: 210,
              endAngle: -30,
              min: 0,
              max: 100,
              progress: { show: true, width: 14, itemStyle: { color: t.accent } },
              axisLine: { lineStyle: { width: 14, color: [[1, t.grid]] } },
              axisTick: { lineStyle: { color: t.border } },
              splitLine: { length: 12, lineStyle: { color: t.border } },
              axisLabel: { color: t.muted, distance: 18 },
              pointer: { itemStyle: { color: t.accent } },
              anchor: { show: true, itemStyle: { color: t.accent } },
              detail: { color: t.text, fontSize: 30, offsetCenter: [0, "44%"], formatter: "{value}" },
              title: { color: t.muted, offsetCenter: [0, "70%"] },
              data: [{ value: 72, name: "NPS" }],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Gauge: S = { render: () => <GaugeDemo /> };

function PictorialDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={380}
        option={{
          grid: { left: 44, right: 20, top: 28, bottom: 28 },
          tooltip: { trigger: "axis" },
          xAxis: {
            type: "category",
            data: ["Seed", "Series A", "Series B", "Series C", "Growth"],
          },
          yAxis: { type: "value", name: "Deals" },
          series: [
            {
              type: "pictorialBar",
              symbol: "roundRect",
              symbolRepeat: true,
              symbolSize: [18, 8],
              symbolMargin: 3,
              itemStyle: { color: t.accent },
              data: [24, 18, 12, 7, 4],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const PictorialBar: S = { render: () => <PictorialDemo /> };
