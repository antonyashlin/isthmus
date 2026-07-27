"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FunnelChart } from "@/components/charts";

const funnelData = [
  { label: "Visitors", value: 12000 },
  { label: "Signups", value: 4800 },
  { label: "Activated", value: 2100 },
  { label: "Paid", value: 840 },
];

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <FunnelChart data={funnelData} />
      </div>
    </main>
  );
}

const meta = {
  title: "Charts/Funnel",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
