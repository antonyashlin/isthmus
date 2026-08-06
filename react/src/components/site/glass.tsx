"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * Every glass surface here used to be liquid-glass-react
 * (github.com/rdev/liquid-glass-react) — a composited stack of
 * absolutely-positioned siblings giving a blur, a refraction warp, and a
 * mouse-elastic stretch. It is not used anymore: verified live, with Chrome
 * DevTools Protocol against a real GPU-accelerated window (not just a
 * headless one, in case that was the confound) — a `.glass__warp` span with
 * nothing on it but `backdrop-filter` fails to composite ANY blur, on a
 * plain 34px button exactly as on the 64px bar, the instant it is rendered
 * by that library. Computed style reports the blur correctly the whole
 * time; nothing paints. A hand-built clone of the identical
 * position:fixed>absolute(transform)>relative(overflow:hidden)>absolute
 * nesting blurs fine, as does a trivial React-rendered sibling `<div>` with
 * nothing but `backdropFilter` sitting right next to the broken one on the
 * same page — so it is not backdrop-filter, not the nesting, not hydration,
 * not element size, not the library's own SVG displacement filter (removing
 * it live changes nothing). It is something specific to that component's
 * own render path in this Chromium build, underneath all of the above.
 * Given that, the fix is to stop routing the effect through the library at
 * all: a plain `backdrop-filter` div gets the actual "frosted glass" look
 * (blur, saturation lift, tint, shadow) — verified working — at the cost of
 * the library's mouse-elastic stretch and refraction warp, which were
 * cosmetic on top of a blur that, empirically, was never rendering anyway.
 *
 * The two-layer shell survives unchanged: `.lg-decor` is a decorative
 * backdrop-filter layer, absolutely filling its `.lg-shell` parent and
 * contributing nothing to that parent's own size; `.lg-content` is the real
 * content in normal flow, which is what actually sizes the shell — a fixed
 * 64px bar, or a button exactly as wide as its label.
 */

const RADIUS = 43;
const BLUR = 23;
const BLUR_OVER_LIGHT = 31;
const SATURATE = 160;

function glassFilter(overLight: boolean) {
  return `blur(${overLight ? BLUR_OVER_LIGHT : BLUR}px) saturate(${SATURATE}%)`;
}

/**
 * Whether the nearest ancestor a glass surface floats over is currently a
 * light ("paper") screen — `ScrollFx` toggles `body.on-light` as the user
 * scrolls, driving the globe field's colour flip the same way. This mirrors
 * that class onto React state via a MutationObserver rather than re-deriving
 * scroll position independently.
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

function GlassDecor({ overLight = false, radius = RADIUS }: { overLight?: boolean; radius?: number }) {
  return (
    <div
      aria-hidden="true"
      className="lg-decor"
      style={{
        borderRadius: radius,
        backdropFilter: glassFilter(overLight),
        WebkitBackdropFilter: glassFilter(overLight),
        boxShadow: overLight ? "0 16px 70px rgba(0,0,0,0.75)" : "0 12px 40px rgba(0,0,0,0.25)",
      }}
    />
  );
}

/**
 * A button-shaped glass label: the decorative layer plus its real content,
 * stacked per the .lg-shell pattern. The CALLER is the shell (an <a>,
 * <button>, or Base UI trigger/close element) — it needs className="lg-shell"
 * and must not itself carry a position the glass would clobber (see the
 * comment on the drawer's own wrapper in Nav.tsx for the failure mode).
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
      <GlassDecor overLight={overLight} radius={radius} />
      <span aria-hidden="true" className="lg-scrim" style={{ borderRadius: radius }} />
      <span className="lg-content">{children}</span>
    </>
  );
}

/**
 * An auto-height glass panel: same two-layer pattern, for a container whose
 * size is driven by real, variable content (the nav drawer's link count, the
 * inquiry form's validation state) rather than a fixed shape.
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
      <GlassDecor overLight={overLight} radius={radius} />
      <span aria-hidden="true" className="lg-scrim" style={{ borderRadius: radius }} />
      <div className="lg-content">{children}</div>
    </div>
  );
}

export { GlassDecor, RADIUS as GLASS_RADIUS };
