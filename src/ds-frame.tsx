"use client";
import * as React from "react";

// Design-sync preview provider — wraps every preview card so charts render on
// the deck's dark ground (isolated mounts don't inherit the Storybook <body>).
export function DeckFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--isth-bg, #06121d)",
        color: "var(--isth-text, #f2f6fa)",
        fontFamily:
          "var(--font-sans, 'Helvetica Neue', Helvetica, Arial, sans-serif)",
        padding: "28px 32px",
        minHeight: 340,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
      }}
    >
      {children}
    </div>
  );
}
