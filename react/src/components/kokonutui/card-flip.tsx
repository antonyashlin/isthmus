"use client";

/**
 * Card Flip — Kokonut UI (@dorianbaffier, MIT, https://kokonutui.com)
 *
 * Adapted for Isthmus Meridian. The flip mechanics are Kokonut's and unchanged:
 * a `perspective` wrapper, two faces at rotateY(0)/rotateY(180) with
 * backface-visibility hidden, and the feature list staggering in behind the
 * turn. What changed is everything decorative, because the original ships a
 * zinc/orange palette and a "Start today" CTA:
 *
 *   · zinc/orange Tailwind classes → semantic classes driven by the site tokens,
 *     so the card reads correctly on both the navy and paper screens
 *   · the CTA is gone — there is nothing to start here; the back face ends on
 *     the capability list
 *   · fixed 280×320 → sized by the grid it sits in
 *
 * Hover flips it; so does keyboard focus, so the back face is reachable without
 * a pointer.
 */

import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface CardFlipProps {
  title: string;
  /** front face: who the offering is for */
  subtitle: string;
  /** back face: what we actually run */
  features: string[];
  /** the central offering — carries the tag and the lit border */
  feature?: boolean;
}

export function CardFlip({
  title,
  subtitle,
  features,
  feature = false,
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    // biome-ignore lint/a11y/noNoninteractiveTabindex: focus stop so the back face is reachable without a pointer
    <div
      className={cn("cardflip", feature && "feat")}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsFlipped(false);
      }}
      onFocus={() => setIsFlipped(true)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      tabIndex={0}
    >
      <div className={cn("cf-turn", isFlipped && "flipped")}>
        {/* front */}
        <div className="cf-face cf-front">
          <div aria-hidden="true" className="cf-pulse">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.38}s` }} />
            ))}
          </div>
          {feature ? <div className="cf-tag">Central offering</div> : null}
          <div className="cf-front-copy">
            <h3>{title}</h3>
            <p>{subtitle}</p>
          </div>
        </div>

        {/* back */}
        <div className="cf-face cf-back">
          <h3>{title}</h3>
          <p className="cf-eyebrow">What we run</p>
          <ul className="cf-caps">
            {features.map((f, i) => (
              <li
                key={f}
                style={{
                  transform: isFlipped ? "translateX(0)" : "translateX(-10px)",
                  opacity: isFlipped ? 1 : 0,
                  transitionDelay: `${i * 50 + 150}ms`,
                }}
              >
                <ArrowRight aria-hidden="true" size={12} strokeWidth={1.8} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CardFlip;
