"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BarChart, Bar, BarXAxis, Grid, ChartTooltip } from "@/components/charts"

const data = [
  { month: "Jan", revenue: 12000, profit: 4500 },
  { month: "Feb", revenue: 15500, profit: 5200 },
  { month: "Mar", revenue: 11000, profit: 3800 },
  { month: "Apr", revenue: 18500, profit: 7100 },
  { month: "May", revenue: 16800, profit: 5400 },
  { month: "Jun", revenue: 21200, profit: 8800 },
];

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <BarChart data={data} xDataKey="month">
  <Grid horizontal />
  <Bar dataKey="revenue" fill="var(--chart-line-primary)" lineCap="round" />
  <Bar dataKey="profit" fill="var(--chart-line-secondary)" lineCap="round" />
  <BarXAxis />
  <ChartTooltip />
</BarChart>
      </div>
    </main>
  )
}

const meta = {
  title: "Charts/Bar",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
