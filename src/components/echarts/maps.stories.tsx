"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
// @ts-expect-error — topojson-client ships no bundled types here
import { feature } from "topojson-client";
// @ts-expect-error — JSON map data
import worldTopo from "world-atlas/countries-110m.json";
// @ts-expect-error — JSON map data (pre-projected albersUsa, with AK/HI insets)
import statesTopo from "us-atlas/states-albers-10m.json";
import { EChart, useIsthmusTokens } from "./EChart";
import { Frame } from "./story-frame";

/* eslint-disable @typescript-eslint/no-explicit-any */
const worldFC: any = feature(worldTopo as any, (worldTopo as any).objects.countries);

// Drop Antarctica (empty polar strip) and any feature that wraps the
// antimeridian (Russia, Fiji) — those streak across the map as full-width
// horizontal lines in plate-carrée and read as "broken".
function lngSpan(geom: any): number {
  let min = 180;
  let max = -180;
  const walk = (c: any) => {
    if (typeof c[0] === "number") {
      min = Math.min(min, c[0]);
      max = Math.max(max, c[0]);
    } else c.forEach(walk);
  };
  walk(geom.coordinates);
  return max - min;
}
const world = {
  type: "FeatureCollection",
  features: worldFC.features.filter(
    (f: any) => f.properties?.name !== "Antarctica" && lngSpan(f.geometry) < 300,
  ),
} as unknown;
const usStates = feature(statesTopo as any, (statesTopo as any).objects.states) as unknown;

const meta = {
  title: "ECharts/Maps",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type S = StoryObj;

function ChoroplethDemo() {
  const t = useIsthmusTokens();
  const data = [
    { name: "United States of America", value: 120 },
    { name: "United Kingdom", value: 62 },
    { name: "Germany", value: 48 },
    { name: "France", value: 40 },
    { name: "India", value: 74 },
    { name: "China", value: 88 },
    { name: "Brazil", value: 33 },
    { name: "Canada", value: 41 },
    { name: "Australia", value: 29 },
    { name: "Japan", value: 55 },
  ];
  return (
    <Frame>
      <EChart
        map={{ name: "world", geoJson: world }}
        height={480}
        option={{
          tooltip: { trigger: "item" },
          visualMap: {
            min: 0, max: 130, left: 16, bottom: 16, calculable: true,
            inRange: { color: t.scale }, textStyle: { color: t.muted },
          },
          series: [
            {
              name: "Deployed ($M)",
              type: "map",
              map: "world",
              roam: true,
              itemStyle: { areaColor: t.panel, borderColor: t.border },
              emphasis: { itemStyle: { areaColor: t.accent }, label: { show: false } },
              data,
            },
          ],
        }}
      />
    </Frame>
  );
}
export const WorldChoropleth: S = { render: () => <ChoroplethDemo /> };

function HighlightedDemo() {
  const t = useIsthmusTokens();
  const markets = [
    "United States of America", "United Kingdom", "Germany",
    "India", "Singapore", "United Arab Emirates", "Brazil",
  ];
  return (
    <Frame>
      <EChart
        map={{ name: "world", geoJson: world }}
        height={480}
        option={{
          tooltip: { trigger: "item" },
          series: [
            {
              name: "Active markets",
              type: "map",
              map: "world",
              roam: true,
              itemStyle: { areaColor: t.panel, borderColor: t.border },
              label: { show: false },
              emphasis: { itemStyle: { areaColor: t.accent }, label: { show: true, color: t.text } },
              select: { itemStyle: { areaColor: t.accent }, label: { show: true, color: t.text } },
              selectedMode: "multiple",
              data: markets.map((name) => ({
                name,
                selected: true,
                itemStyle: { areaColor: t.accent, borderColor: t.bg },
              })),
            },
          ],
        }}
      />
    </Frame>
  );
}
export const HighlightedMarkets: S = { render: () => <HighlightedDemo /> };

function StatesDemo() {
  const t = useIsthmusTokens();
  const data = [
    { name: "California", value: 120 },
    { name: "New York", value: 90 },
    { name: "Massachusetts", value: 55 },
    { name: "Texas", value: 48 },
    { name: "Washington", value: 44 },
    { name: "Illinois", value: 30 },
    { name: "Florida", value: 26 },
    { name: "Colorado", value: 22 },
    { name: "Georgia", value: 18 },
  ];
  return (
    <Frame>
      <EChart
        map={{ name: "usa", geoJson: usStates }}
        height={460}
        option={{
          tooltip: { trigger: "item" },
          visualMap: {
            min: 0, max: 130, left: 16, bottom: 16, calculable: true,
            inRange: { color: t.scale }, textStyle: { color: t.muted },
          },
          series: [
            {
              name: "Deployed ($M)",
              type: "map",
              map: "usa",
              roam: true,
              aspectScale: 1, // us-atlas albers is already projected — don't squish
              itemStyle: { areaColor: t.panel, borderColor: t.border },
              emphasis: { itemStyle: { areaColor: t.accent }, label: { show: true, color: t.text } },
              data,
            },
          ],
        }}
      />
    </Frame>
  );
}
export const USStates: S = { render: () => <StatesDemo /> };

function BubbleMapDemo() {
  const t = useIsthmusTokens();
  const cities = [
    { name: "San Francisco", value: [-122.4, 37.8, 90] },
    { name: "New York", value: [-74, 40.7, 120] },
    { name: "London", value: [-0.1, 51.5, 80] },
    { name: "Berlin", value: [13.4, 52.5, 50] },
    { name: "Bengaluru", value: [77.6, 13, 70] },
    { name: "Singapore", value: [103.8, 1.35, 60] },
    { name: "Dubai", value: [55.3, 25.2, 45] },
    { name: "São Paulo", value: [-46.6, -23.5, 40] },
  ];
  return (
    <Frame>
      <EChart
        map={{ name: "world", geoJson: world }}
        height={480}
        option={{
          tooltip: { trigger: "item" },
          geo: {
            map: "world", roam: true,
            itemStyle: { areaColor: t.panel, borderColor: t.border },
            emphasis: { itemStyle: { areaColor: t.surface }, label: { show: false } },
          },
          series: [
            {
              type: "effectScatter",
              coordinateSystem: "geo",
              symbolSize: (v: number[]) => Math.sqrt(v[2]) * 1.6,
              rippleEffect: { scale: 2.6 },
              itemStyle: { color: t.accent },
              data: cities,
            },
          ],
        }}
      />
    </Frame>
  );
}
export const BubbleMap: S = { render: () => <BubbleMapDemo /> };

function FlowMapDemo() {
  const t = useIsthmusTokens();
  const hub = [-122.4, 37.8];
  const dests: [string, number[]][] = [
    ["New York", [-74, 40.7]],
    ["London", [-0.1, 51.5]],
    ["Berlin", [13.4, 52.5]],
    ["Bengaluru", [77.6, 13]],
    ["Singapore", [103.8, 1.35]],
    ["Dubai", [55.3, 25.2]],
  ];
  return (
    <Frame>
      <EChart
        map={{ name: "world", geoJson: world }}
        height={480}
        option={{
          tooltip: {},
          geo: {
            map: "world", roam: true,
            itemStyle: { areaColor: t.panel, borderColor: t.border },
          },
          series: [
            {
              type: "lines",
              coordinateSystem: "geo",
              effect: { show: true, period: 5, trailLength: 0.4, symbol: "arrow", symbolSize: 5, color: t.accent },
              lineStyle: { color: t.accent, width: 1, opacity: 0.5, curveness: 0.3 },
              data: dests.map(([, c]) => ({ coords: [hub, c] })),
            },
            {
              type: "effectScatter",
              coordinateSystem: "geo",
              symbolSize: 8,
              itemStyle: { color: t.gold },
              rippleEffect: { scale: 2 },
              data: [{ name: "San Francisco", value: hub }, ...dests.map(([n, c]) => ({ name: n, value: c }))],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const FlowMap: S = { render: () => <FlowMapDemo /> };
