import * as React from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  MeridianGlobe,
  MeridianMark,
  MeridianWordmark,
} from "@/decks/isthmus/Meridian";

/**
 * Deck system — the reusable building blocks a slide is assembled from: the
 * three logo lockups, the tracked eyebrow, the glass card, and the left-bar
 * callout, all on the deck ground.
 */

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div
        style={{
          color: "#88c1ed",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 18,
        }}
      >
        {title}
      </div>
      {children}
    </section>
  );
}

function Card({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        width: 300,
        background: "#0e1e2d",
        border: "1px solid rgba(79,131,176,0.35)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "rgba(136,193,237,0.10)",
          border: "1px solid rgba(136,193,237,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#88c1ed",
          marginBottom: 40,
        }}
      >
        <MeridianMark style={{ width: 22, height: 22 }} />
      </div>
      <div style={{ color: "#88c1ed", fontSize: 11, letterSpacing: "0.16em", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ color: "#f2f6fa", fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
        {title}
      </div>
      <div style={{ color: "#9fadbb", fontSize: 14, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

function DeckSystem() {
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
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>Deck system</h1>
      <p style={{ color: "#9fadbb", fontSize: 15, marginBottom: 40 }}>
        The building blocks of an Isthmus Meridian slide.
      </p>

      <Block title="Logo — mark, globe, wordmark">
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          <MeridianMark style={{ width: 48, height: 48, color: "#f2f6fa" }} />
          <MeridianGlobe style={{ width: 130, height: 130, color: "#88c1ed" }} />
          <MeridianWordmark />
        </div>
      </Block>

      <Block title="Eyebrow">
        <div
          style={{
            color: "#88c1ed",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          —— The Thesis
        </div>
      </Block>

      <Block title="Cards">
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Card
            label="01"
            title="A live, paying anchor"
            body="Customer zero is already invoicing — real revenue, not a pilot."
          />
          <Card
            label="02"
            title="Recurring revenue"
            body="The services business funds the build — no venture burn to survive."
          />
          <Card
            label="03"
            title="A proprietary dataset"
            body="A continuously refreshing corpus of real private-markets deals."
          />
        </div>
      </Block>

      <Block title="Callout">
        <div
          style={{
            borderLeft: "2px solid #88c1ed",
            background:
              "linear-gradient(90deg, rgba(136,193,237,0.10), rgba(136,193,237,0))",
            padding: "20px 28px",
            fontSize: 22,
            maxWidth: 900,
          }}
        >
          We don&apos;t burn capital to survive.{" "}
          <b style={{ color: "#88c1ed" }}>We get paid to build the moat.</b>
        </div>
      </Block>
    </div>
  );
}

const meta: Meta<typeof DeckSystem> = {
  title: "Foundations/Deck System",
  component: DeckSystem,
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Blocks: StoryObj<typeof DeckSystem> = {};
