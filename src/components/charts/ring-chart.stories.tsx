"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RingChart, Ring, RingCenter } from "@/components/charts";

const ringData = [
  { label: "Email", value: 42, maxValue: 100 },
  { label: "Social", value: 28, maxValue: 100 },
  { label: "Direct", value: 18, maxValue: 100 },
  { label: "Other", value: 12, maxValue: 100 },
];

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <RingChart data={ringData} size={280} strokeWidth={14}>
          {ringData.map((item, i) => (
            <Ring index={i} key={item.label} />
          ))}
          <RingCenter defaultLabel="Channels" />
        </RingChart>
      </div>
    </main>
  );
}

const meta = {
  title: "Charts/Ring",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
