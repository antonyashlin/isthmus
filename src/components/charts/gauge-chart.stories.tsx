"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Gauge } from "@/components/charts"



function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <Gauge
  value={72}
  centerValue={72}
  totalNotches={40}
  defaultLabel="Score"
  formatOptions={{ style: "percent" }}
/>
      </div>
    </main>
  )
}

const meta = {
  title: "Charts/Gauge",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
