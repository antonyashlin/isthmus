"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { FeatureCollection, Geometry } from "geojson";
import { ChoroplethChart, ChoroplethFeatureComponent, ChoroplethTooltip } from "@/components/charts";

// NOTE: placeholder geometry — a grid of rectangular "regions" so the story is
// self-contained. The choropleth mechanics (projection, value→scale coloring,
// hover tooltip) are identical for a real map; swap `geo` for GeoJSON/TopoJSON.
interface RegionProps {
  name: string;
  value: number;
  bucket: number;
  [key: string]: unknown;
}

const rect = (lon: number, lat: number, w = 46, h = 34): number[][][] => [
  [
    [lon, lat],
    [lon + w, lat],
    [lon + w, lat - h],
    [lon, lat - h],
    [lon, lat],
  ],
];

const regions = [
  { name: "West", value: 128, lon: -150, lat: 55 },
  { name: "Central", value: 74, lon: -100, lat: 55 },
  { name: "East", value: 205, lon: -50, lat: 55 },
  { name: "South", value: 46, lon: -150, lat: 12 },
  { name: "Gulf", value: 96, lon: -100, lat: 12 },
  { name: "Atlantic", value: 152, lon: -50, lat: 12 },
];
const max = Math.max(...regions.map((r) => r.value));

const geo: FeatureCollection<Geometry, RegionProps> = {
  type: "FeatureCollection",
  features: regions.map((r) => ({
    type: "Feature",
    properties: {
      name: r.name,
      value: r.value,
      bucket: Math.min(5, Math.max(1, Math.ceil((r.value / max) * 5))),
    },
    geometry: { type: "Polygon", coordinates: rect(r.lon, r.lat) },
  })),
};

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <ChoroplethChart data={geo} aspectRatio="2 / 1" center={[-100, 30]}>
          <ChoroplethFeatureComponent
            getFeatureColor={(feature) =>
              `var(--chart-scale-0${(feature.properties as RegionProps).bucket})`
            }
          />
          <ChoroplethTooltip />
        </ChoroplethChart>
      </div>
    </main>
  );
}

const meta = {
  title: "Charts/Choropleth",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
