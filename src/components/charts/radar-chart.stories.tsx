"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RadarChart, RadarGrid, RadarAxis, RadarLabels, RadarArea } from "@/components/charts";

const metrics = [
  { key: "speed", label: "Speed" },
  { key: "reliability", label: "Reliability" },
  { key: "comfort", label: "Comfort" },
  { key: "safety", label: "Safety" },
  { key: "efficiency", label: "Efficiency" },
];

const data = [
  { label: "Model A", values: { speed: 80, reliability: 70, comfort: 60, safety: 90, efficiency: 75 } },
  { label: "Model B", values: { speed: 55, reliability: 88, comfort: 78, safety: 65, efficiency: 82 } },
];

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <RadarChart data={data} metrics={metrics} size={320}>
          <RadarGrid />
          <RadarAxis />
          <RadarLabels fontSize={10} offset={16} />
          {data.map((row, i) => (
            <RadarArea key={row.label} index={i} />
          ))}
        </RadarChart>
      </div>
    </main>
  );
}

const meta = {
  title: "Charts/Radar",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
