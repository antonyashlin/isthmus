"use client";

import LiquidGlass from "liquid-glass-react";
import type { CSSProperties, ReactNode } from "react";

/**
 * liquid-glass-react (github.com/rdev/liquid-glass-react) is a self-contained
 * floating widget — a composited stack of absolutely-positioned siblings
 * (the visible glass box, two "over light" tint layers, two border-gradient
 * layers, and up to three hover-glow layers), sized by measuring its OWN
 * rendered box and centered via top:50%/left:50% plus a
 * transform:translate(-50%,-50%) it applies unconditionally. It has no mode
 * for "stretch to fill a fluid, content-driven size" — it is built for
 * buttons and cards, exactly the two examples in its own README.
 *
 * Every glass surface on this site is still built from it (see `.lg-shell`
 * in site.css for why forcing it into bar/panel roles works: two layers, a
 * decorative fill that takes no part in sizing, and the real content in
 * normal flow that does). This file holds the two "house" tunings and the
 * two shell shapes everything else composes from — a button label, and an
 * auto-height panel (nav drawer, the inquiry form).
 *
 * One correctness note that cost real debugging time: the library's OWN
 * decorative siblings default their top/left to "50%" when unset (via
 * `baseStyle.top || "50%"`), but the VISIBLE glass box does not — it takes
 * `style` raw. Leave top/left out of `GLASS_FILL` and the always-applied
 * translate(-50%,-50%) shifts the visible box a further half-width/
 * half-height off from where its siblings land. GLASS_FILL sets them
 * explicitly so every instance matches.
 */

const GLASS_BAR = {
  blurAmount: 0.06,
  saturation: 150,
  aberrationIntensity: 0.6,
  displacementScale: 50,
  elasticity: 0, // persistent chrome shouldn't wobble toward the cursor
  mode: "standard" as const,
};

const GLASS_BUTTON = {
  blurAmount: 0.08,
  saturation: 150,
  aberrationIntensity: 0.8,
  displacementScale: 60,
  elasticity: 0.2, // a little of the library's own "liquid" feel, for something self-contained and tappable
  mode: "standard" as const,
};

const GLASS_FILL: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "100%",
  height: "100%",
};

/**
 * A button-shaped glass label: the decorative layer plus its real content,
 * stacked per the .lg-shell pattern. The CALLER is the shell (an <a>,
 * <button>, or Base UI trigger/close element) — it needs className="lg-shell"
 * and must not itself carry a position the glass would clobber (see the
 * comment on the drawer's own wrapper in Nav.tsx for the failure mode).
 *
 * `onClick={() => {}}` is a deliberate no-op, not the real handler — it
 * exists only so the library's `Boolean(onClick)` check turns on its hover/
 * press glow, which a real control should have even though activation is
 * handled by whatever wraps this.
 */
export function GlassLabel({
  children,
  radius = 999,
}: {
  children: ReactNode;
  radius?: number;
}) {
  return (
    <>
      <LiquidGlass className="lg-decor" cornerRadius={radius} onClick={() => {}} style={GLASS_FILL} {...GLASS_BUTTON}>
        {null}
      </LiquidGlass>
      <span className="lg-content">{children}</span>
    </>
  );
}

/**
 * An auto-height glass panel: same two-layer pattern, for a container whose
 * size is driven by real, variable content (the nav drawer's link count, the
 * inquiry form's validation state) rather than a fixed shape. No onClick —
 * a panel isn't a button, and shouldn't glow like one.
 */
export function GlassPanel({
  children,
  className,
  radius = 26,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  return (
    <div className={className ? `lg-shell ${className}` : "lg-shell"}>
      <LiquidGlass className="lg-decor" cornerRadius={radius} style={GLASS_FILL} {...GLASS_BAR}>
        {null}
      </LiquidGlass>
      <div className="lg-content">{children}</div>
    </div>
  );
}

export { GLASS_BAR, GLASS_BUTTON, GLASS_FILL };
