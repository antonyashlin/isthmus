import * as React from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * Type system — Helvetica Neue (Thin / Regular / Medium / Bold), Arial fallback.
 * Emphasis is carried by accent-blue colour, not italics: that is the deck's own
 * convention and it is preserved here verbatim.
 */

const SCALE = [
  { token: "--isth-fs-display", px: 45, weight: 200, label: "Display / cover" },
  { token: "--isth-fs-h1", px: 34, weight: 400, label: "H1" },
  { token: "--isth-fs-h2", px: 27, weight: 400, label: "H2" },
  { token: "--isth-fs-h3", px: 23, weight: 500, label: "H3" },
  { token: "--isth-fs-lead", px: 19, weight: 400, label: "Lead / subhead" },
  { token: "--isth-fs-body", px: 17, weight: 400, label: "Body" },
  { token: "--isth-fs-small", px: 14, weight: 400, label: "Caption" },
];

function Typography() {
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
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Typography</h1>
      <p style={{ color: "#9fadbb", fontSize: 15, marginBottom: 40 }}>
        Helvetica Neue · Arial fallback. Emphasis = accent-blue, never italic.
      </p>

      {/* Eyebrow specimen */}
      <div
        style={{
          color: "#88c1ed",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 28,
        }}
      >
        —— The Thesis
      </div>

      {/* Scale specimens */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 48 }}>
        {SCALE.map((s) => (
          <div key={s.token} style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
            <div
              style={{
                width: 150,
                flexShrink: 0,
                color: "#6a798a",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
            >
              {s.px}px · {s.weight}
            </div>
            <div style={{ fontSize: s.px, fontWeight: s.weight, lineHeight: 1.1 }}>
              The crossing, and the line
            </div>
          </div>
        ))}
      </div>

      {/* Emphasis specimen */}
      <div style={{ fontSize: 34, fontWeight: 400, maxWidth: 760, lineHeight: 1.2 }}>
        We started with the part that kills most AI companies{" "}
        <span style={{ color: "#88c1ed" }}>already solved.</span>
      </div>
    </div>
  );
}

const meta: Meta<typeof Typography> = {
  title: "Foundations/Typography",
  component: Typography,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Scale: StoryObj<typeof Typography> = {};
