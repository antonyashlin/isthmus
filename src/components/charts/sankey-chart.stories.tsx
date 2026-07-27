"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SankeyChart, SankeyLink, SankeyNode, SankeyTooltip } from "@/components/charts"

const data = {
  nodes: [
    { name: "Ads" },
    { name: "Organic" },
    { name: "Landing" },
    { name: "Product" },
    { name: "Checkout" },
  ],
  links: [
    { source: 0, target: 2, value: 40 },
    { source: 1, target: 2, value: 30 },
    { source: 2, target: 3, value: 50 },
    { source: 3, target: 4, value: 35 },
  ],
};

function ChartDemo() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">
        <SankeyChart data={data} aspectRatio="16 / 9">
  <SankeyLink />
  <SankeyNode />
  <SankeyTooltip />
</SankeyChart>
      </div>
    </main>
  )
}

const meta = {
  title: "Charts/Sankey",
  component: ChartDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChartDemo>;

export default meta;

export const Default: StoryObj<typeof ChartDemo> = {};
