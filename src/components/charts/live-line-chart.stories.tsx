"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";
import { LiveLineChart, LiveLine, LiveXAxis, LiveYAxis, ChartTooltip } from "@/components/charts";
import { curveNatural } from "@visx/curve";

const nowSec = () => Math.floor(Date.now() / 1000);

function ChartDemo() {
  const [data, setData] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      time: nowSec() - (29 - i),
      value: 50 + Math.sin(i / 3) * 18,
    })),
  );
  const [value, setValue] = useState(50);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => {
        const next = Math.max(8, Math.min(92, v + (Math.random() - 0.5) * 16));
        setData((d) => [...d.slice(-59), { time: nowSec(), value: next }]);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <LiveLineChart data={data} value={value} window={30}>
          <LiveLine dataKey="value" curve={curveNatural} stroke="var(--chart-line-primary)" />
          <LiveXAxis />
          <LiveYAxis />
          <ChartTooltip />
        </LiveLineChart>
      </div>
    </main>
  );
}

const meta = {
  title: "Charts/Live Line",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
