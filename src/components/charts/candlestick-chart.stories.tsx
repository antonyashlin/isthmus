"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CandlestickChart, Candlestick, Grid, XAxis, YAxis, ChartTooltip } from "@/components/charts"

const ohlcData = [
  { date: new Date("2024-01-02"), open: 100, high: 108, low: 98, close: 105 },
  { date: new Date("2024-01-03"), open: 105, high: 110, low: 102, close: 103 },
  { date: new Date("2024-01-04"), open: 103, high: 112, low: 101, close: 110 },
  { date: new Date("2024-01-05"), open: 110, high: 115, low: 107, close: 108 },
];

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <CandlestickChart data={ohlcData}>
  <Grid horizontal vertical />
  <Candlestick />
  <XAxis />
  <YAxis />
  <ChartTooltip />
</CandlestickChart>
      </div>
    </main>
  )
}

const meta = {
  title: "Charts/Candlestick",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
