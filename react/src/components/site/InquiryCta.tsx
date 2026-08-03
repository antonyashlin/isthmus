"use client";

import { GlassLabel } from "@/components/site/glass";

/**
 * The one glass surface `page.tsx` itself needs — everything else there is a
 * Server Component, so this stays a one-button client island rather than
 * pulling the whole page across the boundary.
 */
export function InquiryCta() {
  return (
    <a className="glass-btn glass-btn-lg inquiry-cta lg-shell" href="/inquiry">
      <GlassLabel>Make an inquiry</GlassLabel>
    </a>
  );
}
