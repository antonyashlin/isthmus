import * as React from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const SPACE = [
  { token: "--isth-space-1", px: 4 },
  { token: "--isth-space-2", px: 8 },
  { token: "--isth-space-3", px: 12 },
  { token: "--isth-space-4", px: 16 },
  { token: "--isth-space-5", px: 24 },
  { token: "--isth-space-6", px: 32 },
  { token: "--isth-space-7", px: 48 },
  { token: "--isth-space-8", px: 64 },
  { token: "--isth-space-9", px: 80, note: "slide safe-margin" },
];

function Spacing() {
  return (
    <div
      style={{
        background: "#06121d",
        minHeight: "100vh",
        padding: 48,
        fontFamily: "var(--font-sans)",
        color: "#f2f6fa",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Spacing</h1>
      <p style={{ color: "#9fadbb", fontSize: 15, marginBottom: 40 }}>
        The deck rhythm, in px on the 1280×720 canvas.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {SPACE.map((s) => (
          <div key={s.token} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 150,
                color: "#6a798a",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
            >
              {s.token.replace("--isth-", "")} · {s.px}
            </div>
            <div
              style={{
                height: 18,
                width: s.px,
                background: "#88c1ed",
                borderRadius: 3,
              }}
            />
            {s.note && <span style={{ color: "#6a798a", fontSize: 12 }}>{s.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof Spacing> = {
  title: "Foundations/Spacing",
  component: Spacing,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Scale: StoryObj<typeof Spacing> = {};
