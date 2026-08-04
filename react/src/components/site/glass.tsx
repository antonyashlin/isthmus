"use client";

import LiquidGlass from "liquid-glass-react";
import { useEffect, useState } from "react";
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
 * normal flow that does). This file holds the one house tuning and the two
 * shell shapes everything else composes from — a button label, and an
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

const GLASS = {
  displacementScale: 162,
  blurAmount: 0.6,
  saturation: 160,
  aberrationIntensity: 2,
  elasticity: 0.75,
  mode: "standard" as const,
};

/* CSS clamps border-radius to at most half of an element's own height/width
   per axis, so 43px still reads as a full stadium on anything shorter than
   ~86px (every button, and the 64px bar) — it only becomes a visibly
   separate, larger corner on the taller auto-height panels (the drawer, the
   form). One radius, not a per-shape set. */
const RADIUS = 43;

const GLASS_FILL: CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "100%",
  height: "100%",
};

/**
 * Whether the nearest ancestor a glass surface floats over is currently a
 * light ("paper") screen — `ScrollFx` toggles `body.on-light` as the user
 * scrolls, driving the globe field's colour flip the same way. `overLight`
 * is a React prop the library reads at render time, not something CSS can
 * hand it, so this mirrors that class onto state via a MutationObserver
 * rather than re-deriving scroll position independently.
 */
export function useOnLight() {
  const [onLight, setOnLight] = useState(false);
  useEffect(() => {
    const body = document.body;
    const sync = () => setOnLight(body.classList.contains("on-light"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(body, { attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return onLight;
}

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
  overLight = false,
  radius = RADIUS,
}: {
  children: ReactNode;
  overLight?: boolean;
  radius?: number;
}) {
  return (
    <>
      <LiquidGlass
        className="lg-decor"
        cornerRadius={radius}
        onClick={() => {}}
        overLight={overLight}
        style={GLASS_FILL}
        {...GLASS}
      >
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
  overLight = false,
  radius = RADIUS,
}: {
  children: ReactNode;
  className?: string;
  overLight?: boolean;
  radius?: number;
}) {
  return (
    <div className={className ? `lg-shell ${className}` : "lg-shell"}>
      <LiquidGlass className="lg-decor" cornerRadius={radius} overLight={overLight} style={GLASS_FILL} {...GLASS}>
        {null}
      </LiquidGlass>
      <div className="lg-content">{children}</div>
    </div>
  );
}

export { GLASS, GLASS_FILL, RADIUS as GLASS_RADIUS };
