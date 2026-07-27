"use client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { EChart, useIsthmusTokens } from "./EChart";
import { Frame } from "./story-frame";

const meta = {
  title: "ECharts/Part to Whole",
  parameters: { layout: "fullscreen" },
} satisfies Meta;
export default meta;
type S = StoryObj;

const alloc = [
  { value: 40, name: "Enterprise SaaS" },
  { value: 25, name: "Fintech" },
  { value: 18, name: "Infrastructure" },
  { value: 10, name: "Health" },
  { value: 7, name: "Other" },
];

function PieDemo({ radius }: { radius: string | [string, string] }) {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={400}
        option={{
          tooltip: { trigger: "item" },
          legend: { bottom: 0, textStyle: { color: t.body } },
          series: [
            {
              type: "pie",
              radius,
              data: alloc,
              label: { color: t.body },
              labelLine: { lineStyle: { color: t.border } },
              itemStyle: { borderColor: t.bg, borderWidth: 2 },
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Pie: S = { render: () => <PieDemo radius="62%" /> };
export const Doughnut: S = { render: () => <PieDemo radius={["42%", "68%"]} /> };

function RoseDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={400}
        option={{
          tooltip: { trigger: "item" },
          series: [
            {
              type: "pie",
              radius: [24, 150],
              roseType: "area",
              center: ["50%", "50%"],
              data: alloc,
              label: { color: t.body },
              itemStyle: { borderColor: t.bg, borderWidth: 2, borderRadius: 4 },
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Rose: S = { render: () => <RoseDemo /> };

function FunnelDemo() {
  const t = useIsthmusTokens();
  const stages = [
    { value: 100, name: "Sourced" },
    { value: 62, name: "Screened" },
    { value: 38, name: "Diligence" },
    { value: 18, name: "Term sheet" },
    { value: 8, name: "Closed" },
  ];
  // Bklit-style: a smooth top→bottom blue ramp across the funnel (bright to deep),
  // soft gaps, labels inside — not flat categorical segments.
  const ramp = [t.scale[4], t.scale[3], t.scale[2], t.scale[1], t.scale[0]];
  return (
    <Frame>
      <EChart
        height={420}
        option={{
          tooltip: { trigger: "item" },
          series: [
            {
              type: "funnel",
              left: "12%",
              right: "12%",
              top: 16,
              bottom: 16,
              minSize: "16%",
              gap: 4,
              funnelAlign: "center",
              label: { color: t.text, position: "inside", fontWeight: 500 },
              labelLine: { show: false },
              itemStyle: { borderWidth: 0, opacity: 0.96 },
              emphasis: { itemStyle: { opacity: 1 } },
              data: stages.map((s, i) => ({ ...s, itemStyle: { color: ramp[i] } })),
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Funnel: S = { render: () => <FunnelDemo /> };

function TreemapDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={420}
        option={{
          tooltip: {},
          series: [
            {
              type: "treemap",
              roam: false,
              nodeClick: false,
              breadcrumb: { show: false },
              label: { color: t.text },
              upperLabel: { show: true, color: t.body, height: 22 },
              itemStyle: { borderColor: t.bg, borderWidth: 2, gapWidth: 2 },
              levels: [
                { itemStyle: { borderColor: t.bg, borderWidth: 3, gapWidth: 3 } },
                { colorSaturation: [0.25, 0.55], itemStyle: { borderColor: t.panel, gapWidth: 1 } },
              ],
              data: [
                { name: "Fund I", value: 120, children: [
                  { name: "Co A", value: 50 }, { name: "Co B", value: 40 }, { name: "Co C", value: 30 } ] },
                { name: "Fund II", value: 200, children: [
                  { name: "Co D", value: 90 }, { name: "Co E", value: 70 }, { name: "Co F", value: 40 } ] },
                { name: "Fund III", value: 150, children: [
                  { name: "Co G", value: 80 }, { name: "Co H", value: 70 } ] },
              ],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Treemap: S = { render: () => <TreemapDemo /> };

function SunburstDemo() {
  const t = useIsthmusTokens();
  return (
    <Frame>
      <EChart
        height={440}
        option={{
          tooltip: {},
          series: [
            {
              type: "sunburst",
              radius: [0, "92%"],
              label: { color: t.text, minAngle: 8 },
              itemStyle: { borderColor: t.bg, borderWidth: 2 },
              data: [
                { name: "Enterprise", children: [
                  { name: "SaaS", value: 20 }, { name: "Security", value: 12 }, { name: "Data", value: 8 } ] },
                { name: "Consumer", children: [
                  { name: "Fintech", value: 15 }, { name: "Health", value: 9 } ] },
                { name: "Infra", children: [
                  { name: "Cloud", value: 14 }, { name: "Dev tools", value: 10 } ] },
              ],
            },
          ],
        }}
      />
    </Frame>
  );
}
export const Sunburst: S = { render: () => <SunburstDemo /> };
