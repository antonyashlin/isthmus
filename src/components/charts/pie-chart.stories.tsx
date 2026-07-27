"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PieChart, PieSlice, PieCenter } from "@/components/charts"

const pieData = [
  { label: "Direct", value: 320 },
  { label: "Organic", value: 280 },
  { label: "Referral", value: 190 },
  { label: "Social", value: 140 },
];

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <PieChart data={pieData} size={280}>
  {pieData.map((item, i) => (
    <PieSlice index={i} key={item.label} />
  ))}
  <PieCenter defaultLabel="Traffic" />
</PieChart>
      </div>
    </main>
  )
}

const meta = {
  title: "Charts/Pie",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
