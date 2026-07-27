"use client";
import type { ReactNode } from "react";

/** Centered slide-scale stage shared by the ECharts stories. */
export function Frame({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-3xl">{children}</div>
    </main>
  );
}
