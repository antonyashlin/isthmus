import * as React from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * The Isthmus Meridian colour system — sampled from the master deck. Grounds run
 * deepest→nearest; text is the glyph hierarchy by frequency; accents are led by
 * the light blue that carries every emphasis phrase.
 */

type Swatch = { name: string; token: string; value: string; note?: string };

const GROUNDS: Swatch[] = [
  { name: "Stage", token: "--isth-stage", value: "#000000", note: "letterbox" },
  { name: "Background", token: "--isth-bg", value: "#06121d", note: "slide ground" },
  { name: "Panel", token: "--isth-panel", value: "#0b1926", note: "raised band" },
  { name: "Surface", token: "--isth-surface", value: "#0e1e2d", note: "card / glass" },
  { name: "Light", token: "--isth-light", value: "#f2f6fa", note: "inverted" },
];

const TEXT: Swatch[] = [
  { name: "Text", token: "--isth-text", value: "#f2f6fa", note: "primary" },
  { name: "Bright", token: "--isth-text-bright", value: "#eaf1f8", note: "headline" },
  { name: "Body", token: "--isth-body", value: "#9fadbb", note: "body copy" },
  { name: "Muted", token: "--isth-muted", value: "#6a798a", note: "eyebrow / footer" },
  { name: "Faint", token: "--isth-faint", value: "#45525f", note: "hairline label" },
];

const ACCENTS: Swatch[] = [
  { name: "Accent", token: "--isth-accent", value: "#88c1ed", note: "emphasis / active" },
  { name: "Accent 2", token: "--isth-accent-2", value: "#4f83b0", note: "border / node" },
  { name: "Gold", token: "--isth-gold", value: "#d9a441", note: "rare highlight" },
  { name: "Danger", token: "--isth-danger", value: "#c96f6f", note: "negative" },
];

function Chip({ s }: { s: Swatch }) {
  const dark = ["#f2f6fa", "#eaf1f8", "#d9a441", "#88c1ed"].includes(s.value);
  return (
    <div style={{ width: 168 }}>
      <div
        style={{
          height: 96,
          borderRadius: 10,
          background: s.value,
          border: "1px solid rgba(79,131,176,0.35)",
          display: "flex",
          alignItems: "flex-end",
          padding: 10,
          color: dark ? "#06121d" : "#f2f6fa",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
        }}
      >
        {s.value}
      </div>
      <div style={{ marginTop: 8, color: "#f2f6fa", fontSize: 13, fontWeight: 500 }}>
        {s.name}
      </div>
      <div style={{ color: "#6a798a", fontSize: 12, fontFamily: "var(--font-mono)" }}>
        {s.token}
      </div>
      {s.note && <div style={{ color: "#6a798a", fontSize: 12 }}>{s.note}</div>}
    </div>
  );
}

function Row({ label, items }: { label: string; items: Swatch[] }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div
        style={{
          color: "#88c1ed",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {items.map((s) => (
          <Chip key={s.token} s={s} />
        ))}
      </div>
    </section>
  );
}

function ColourSystem() {
  return (
    <div
      style={{
        background: "#06121d",
        minHeight: "100vh",
        padding: 48,
        fontFamily: "var(--font-sans)",
      }}
    >
      <h1 style={{ color: "#f2f6fa", fontSize: 28, marginBottom: 4 }}>Colour system</h1>
      <p style={{ color: "#9fadbb", fontSize: 15, marginBottom: 40 }}>
        Measured from the Isthmus Meridian master deck.
      </p>
      <Row label="Grounds" items={GROUNDS} />
      <Row label="Text" items={TEXT} />
      <Row label="Accents" items={ACCENTS} />
    </div>
  );
}

const meta: Meta<typeof ColourSystem> = {
  title: "Foundations/Colours",
  component: ColourSystem,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Palette: StoryObj<typeof ColourSystem> = {};
