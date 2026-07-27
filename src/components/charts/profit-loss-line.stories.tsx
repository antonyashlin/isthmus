"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LineChart, ProfitLossLine, Grid, XAxis, ChartTooltip } from "@/components/charts";

// Alternating gains/losses so both profit (up) and loss (down) segments show.
const chartData = [
  { date: new Date("2024-01-01"), pnl: -42 },
  { date: new Date("2024-02-01"), pnl: -18 },
  { date: new Date("2024-03-01"), pnl: 24 },
  { date: new Date("2024-04-01"), pnl: 61 },
  { date: new Date("2024-05-01"), pnl: 15 },
  { date: new Date("2024-06-01"), pnl: -27 },
  { date: new Date("2024-07-01"), pnl: 49 },
];

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <LineChart data={chartData} animationDuration={1100}>
          <Grid horizontal />
          <ProfitLossLine dataKey="pnl" />
          <XAxis />
          <ChartTooltip />
        </LineChart>
      </div>
    </main>
  );
}

const meta = {
  title: "Charts/Profit & Loss",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
