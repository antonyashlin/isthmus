import type * as React from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "./badge";

/**
 * Badge — shadcn primitive (base-ui `useRender`, `cva` variants). The `deck`
 * and `deck-warn` variants are Isthmus-specific: they read the founding
 * deck's own CSS-var tokens (`--accent-ink`, `--line-3`, `--gold`, `--heading`)
 * instead of the app's fixed Tailwind theme, so they render correctly on both
 * the deck's navy and paper screens. Pulled into `react/src/decks/founding`
 * to replace that deck's hand-rolled `.fd-chip` pill (FLAGSHIP,
 * DIFFERENTIATOR, TERMS PENDING) with a real, reusable component.
 */
const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
};

function DeckGround({
  paper,
  children,
}: {
  paper?: boolean;
  children: React.ReactNode;
}) {
  const navy = {
    "--bg": "#04101c",
    "--heading": "#ffffff",
    "--accent-ink": "#88c1ed",
    "--line-3": "rgba(136,193,237,0.24)",
    "--gold": "#d9a441",
  } as React.CSSProperties;
  const paperVars = {
    "--bg": "#edf2f7",
    "--heading": "#06121e",
    "--accent-ink": "#2f628a",
    "--line-3": "rgba(70,134,183,0.32)",
    "--gold": "#d9a441",
  } as React.CSSProperties;
  return (
    <div
      style={{
        ...(paper ? paperVars : navy),
        background: "var(--bg)",
        color: "var(--heading)",
        padding: 32,
        borderRadius: 8,
        display: "flex",
        gap: 12,
      }}
    >
      {children}
    </div>
  );
}

export const DeckOnNavy: Story = {
  name: "deck variant · navy screen",
  render: () => (
    <DeckGround>
      <Badge variant="deck">FLAGSHIP</Badge>
      <Badge variant="deck-warn">TERMS PENDING</Badge>
    </DeckGround>
  ),
};

export const DeckOnPaper: Story = {
  name: "deck variant · paper screen",
  render: () => (
    <DeckGround paper>
      <Badge variant="deck">DIFFERENTIATOR</Badge>
      <Badge variant="deck-warn">TERMS PENDING</Badge>
    </DeckGround>
  ),
};
