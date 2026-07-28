import type * as React from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";

/**
 * Button — shadcn primitive (base-ui `Button`, `cva` variants). The `deck`
 * variant is Isthmus-specific: transparent with a hairline border that fills
 * on hover, built from the founding deck's own CSS-var tokens so it reads on
 * both the navy and paper deck screens. Used for the deck's "Take the
 * crossing" close on the Ask slide — previously authored copy with no
 * component rendering it.
 */
const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

function DeckGround({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={
        {
          "--bg": "#04101c",
          "--heading": "#ffffff",
          "--accent-ink": "#88c1ed",
          "--line-3": "rgba(136,193,237,0.24)",
          background: "var(--bg)",
          color: "var(--heading)",
          padding: 32,
          borderRadius: 8,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export const DeckCta: Story = {
  name: "deck variant · Ask slide close",
  render: () => (
    <DeckGround>
      <Button size="sm" variant="deck">
        Take the crossing
      </Button>
    </DeckGround>
  ),
};
